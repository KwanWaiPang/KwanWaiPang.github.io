---
layout: post
title: "基于python的ros2 topic订阅与时间同步"
date:   2025-10-31
tags: [Coding]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<!-- # 引言 -->

本博文通过python脚本实现订阅ros2的多个topic，并且利用message filter进行时间同步后，再将topic录制为ros2的bag

通过命令即可运行，`python3 sync_camera_joint.py --record`，其中,加了`--record` flag就表示正式录制

```python
import rclpy
from rclpy.node import Node
import message_filters #进行时间同步
from sensor_msgs.msg import Image, JointState # JointState对应于/inspire_hand/state/left_hand和/inspire_hand/state/right_hand
from geometry_msgs.msg import WrenchStamped #对应于/arm_6dof_left和/arm_6dof_right消息
from bodyctrl_msgs.msg import MotorStatusMsg #对应于 /arm/status
import threading
import time
import os
from datetime import datetime
import argparse
import sys

# 导入rosbag2相关模块
try:
    import rosbag2_py
    from rosbag2_py import SequentialWriter, StorageOptions, ConverterOptions
    ROSBAG2_AVAILABLE = True
except ImportError:
    ROSBAG2_AVAILABLE = False
    print("警告: rosbag2_py 不可用，录制功能将禁用!!!!!!")


class MultiTopicSyncNode(Node):
    def __init__(self, record_flag=False):
        super().__init__('multi_topic_sync_node')
        
        # 录制标志
        self.record_flag = record_flag
        
        # 定义需要订阅的topic列表
        self.required_topics = [
            '/camera/color/image_raw',
            '/camera/depth/image_raw', 
            '/arm/status',
            '/inspire_hand/state/left_hand',
            '/inspire_hand/state/right_hand'
        ]
        
        # 用于跟踪已确认的topic
        self.confirmed_topics = {}
        self.confirmation_lock = threading.Lock()
        
        # 创建单次topic确认订阅器
        self.confirmation_subscribers = []
        
        # 主同步订阅器（稍后初始化）
        self.sync_subscribers = {}
        self.ts = None
        self.sync_initialized = False
        
        # Rosbag2录制相关变量
        self.bag_writer = None
        self.recording_enabled = self.record_flag and ROSBAG2_AVAILABLE
        self.bag_path = None
        
        # 同步统计
        self.sync_count = 0
        self.start_time = time.time()
        
        # 如果启用录制，创建bag路径
        if self.recording_enabled:
            self.bag_path = self.create_bag_path()
        
        self.get_logger().info(f'开始确认topic可用性... 录制模式: {"启用" if self.recording_enabled else "禁用"}')

        #调用函数，首先确认哪些topic可用
        self.start_topic_confirmation()
        
    def create_bag_path(self):
        """创建rosbag存储路径"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        bag_dir = f"sync_data_bag_{timestamp}"
        os.makedirs(bag_dir, exist_ok=True)
        self.get_logger().info(f'Rosbag将保存到: {os.path.abspath(bag_dir)}')
        return bag_dir
        
    def start_topic_confirmation(self):
        """为每个topic创建临时订阅器来确认其存在和活跃"""
        for topic in self.required_topics:
            # 根据topic名称确定消息类型
            msg_type = self.get_message_type(topic)#根据topic的名字来获取消息类型
            if msg_type:
                # 创建单次确认订阅器
                sub = self.create_subscription(
                    msg_type,
                    topic,
                    self.create_topic_callback(topic),
                    10  # QoS队列大小
                )
                self.confirmation_subscribers.append(sub)
                self.get_logger().info(f'正在确认topic: {topic}')
            else:
                self.get_logger().warning(f'报错!!!无法确定topic {topic}的消息类型')
        
        # 启动超时检查
        self.confirmation_timer = self.create_timer(5.0, self.check_confirmation_status)
        
    def get_message_type(self, topic):
        """根据topic名称返回对应的消息类型"""
        if 'image_raw' in topic:
            return Image
        elif 'hand/state' in topic:
            return JointState
        elif 'arm/status' in topic:
            return MotorStatusMsg
        else:
            return None
    
    def create_topic_callback(self, topic_name):
        """为每个topic创建确认回调函数"""
        def topic_confirmation_callback(msg):
            with self.confirmation_lock:
                if topic_name not in self.confirmed_topics:
                    self.confirmed_topics[topic_name] = True
                    
                    # 计算确认百分比
                    confirmed_percent = (len(self.confirmed_topics) / len(self.required_topics)) * 100
                    
                    self.get_logger().info(
                        f'✓ 确认topic可用: {topic_name} '
                        f'({len(self.confirmed_topics)}/{len(self.required_topics)}, {confirmed_percent:.1f}%)'
                    )
                    
                    # 检查是否所有topic都已确认，如果确认就开始订阅。
                    self.check_all_topics_confirmed()
        return topic_confirmation_callback
    
    def check_all_topics_confirmed(self):
        """检查是否所有需要的topic都已确认"""
        confirmed_count = len(self.confirmed_topics)
        total_count = len(self.required_topics)
        
        confirmed_percent = (confirmed_count / total_count) * 100
        
        # 根据确认的topic百分比决定是否开始同步
        if confirmed_percent >= 100.0 and not self.sync_initialized:
            self.get_logger().info('所有topic都已确认(100%)，开始初始化时间同步器...')
            self.initialize_synchronizer()
        elif confirmed_percent <100.0 and not self.sync_initialized:
            self.get_logger().warning(
                f'已确认{confirmed_percent:.1f}%的topic ({confirmed_count}/{total_count})，'
                f'开始部分同步(缺少: {[t for t in self.required_topics if t not in self.confirmed_topics]})'
            )
            return
    
    def check_confirmation_status(self):
        """定时检查topic确认状态"""
        if self.sync_initialized:
            self.confirmation_timer.cancel()
            return
            
        confirmed_count = len(self.confirmed_topics)
        total_count = len(self.required_topics)
        confirmed_percent = (confirmed_count / total_count) * 100
        
        missing_topics = [topic for topic in self.required_topics if topic not in self.confirmed_topics]
        if missing_topics:
            self.get_logger().warning(
                f'等待以下topic ({confirmed_percent:.1f}% 已确认): {missing_topics}'
            )

            # 如果录制已启用但topic不完整，发出警告
            if self.recording_enabled:
                self.get_logger().warning(
                    f'录制功能已启用，但topic不完整({confirmed_percent:.1f}%)，无法开始录制'
                )
        else:
            self.get_logger().info('所有topic确认完成！')
    
    def initialize_synchronizer(self):
        """初始化时间同步器"""
        try:
            # 创建同步订阅器
            self.sync_subscribers['color_image'] = message_filters.Subscriber(self, Image, '/camera/color/image_raw')
            self.sync_subscribers['depth_image'] = message_filters.Subscriber(self, Image, '/camera/depth/image_raw')
            self.sync_subscribers['arm_status'] = message_filters.Subscriber(self, MotorStatusMsg, '/arm/status')
            self.sync_subscribers['left_hand'] = message_filters.Subscriber(self, JointState, '/inspire_hand/state/left_hand')
            self.sync_subscribers['right_hand'] = message_filters.Subscriber(self, JointState, '/inspire_hand/state/right_hand')
            
            # 创建近似时间同步器
            self.ts = message_filters.ApproximateTimeSynchronizer(
                list(self.sync_subscribers.values()),
                queue_size=20,
                slop=0.1  # 100ms的时间容差
            )
            
            # 注册同步回调函数
            self.ts.registerCallback(self.sync_callback)
            
            # 如果启用录制，初始化rosbag录制
            if self.recording_enabled:
                self.initialize_rosbag_recorder() #进行rosbag的录制
            
            self.sync_initialized = True
            
            # 清理确认用的临时订阅器
            for sub in self.confirmation_subscribers:
                self.destroy_subscription(sub)
            self.confirmation_subscribers.clear()
            
            self.get_logger().info('✓ 多Topic时间同步器已成功启动并运行')
            
        except Exception as e:
            self.get_logger().error(f'初始化时间同步器失败: {str(e)}')
    
    def initialize_rosbag_recorder(self):
        """初始化rosbag录制器"""
        try:
            storage_options = StorageOptions(
                uri=self.bag_path,
                storage_id='sqlite3'
            )
            converter_options = ConverterOptions(
                input_serialization_format='cdr',
                output_serialization_format='cdr'
            )
            
            self.bag_writer = SequentialWriter()
            self.bag_writer.open(storage_options, converter_options)
            
            # 为每个确认的topic创建录制通道
            topic_types = {
                '/camera/color/image_raw': 'sensor_msgs/msg/Image',
                '/camera/depth/image_raw': 'sensor_msgs/msg/Image',
                '/arm/status': 'bodyctrl_msgs/msg/MotorStatusMsg',
                '/inspire_hand/state/left_hand': 'sensor_msgs/msg/JointState',
                '/inspire_hand/state/right_hand': 'sensor_msgs/msg/JointState'
            }
            
            for topic in self.confirmed_topics:
                if topic in topic_types:
                    self.bag_writer.create_topic(
                        topic,
                        topic_types[topic],
                        'cdr',
                        ''
                    )
            
            self.get_logger().info(f'✓ Rosbag录制已启动: {self.bag_path}')
            
        except Exception as e:
            self.get_logger().error(f'初始化rosbag录制失败: {str(e)}')
            self.bag_writer = None
    
    def write_to_bag(self, topic, msg):
        """将消息写入rosbag"""
        if self.bag_writer is not None:
            try:
                # 使用消息的时间戳作为rosbag记录的时间戳
                if hasattr(msg, 'header') and hasattr(msg.header, 'stamp'):
                    timestamp = msg.header.stamp
                else:
                    timestamp = self.get_clock().now().to_msg()
                
                self.bag_writer.write(topic, msg, timestamp)
                
            except Exception as e:
                self.get_logger().error(f'写入rosbag失败: {str(e)}')
    
    def sync_callback(self, *args):
        """
        同步回调函数，当所有Topic的消息时间同步后调用
        """
        try:
            # 动态处理参数，因为topic数量可能变化
            msg_dict = {}
            arg_index = 0
            
            # 根据确认的topic构建消息字典
            if '/camera/color/image_raw' in self.confirmed_topics:
                msg_dict['color_image'] = args[arg_index]
                arg_index += 1
                
            if '/camera/depth/image_raw' in self.confirmed_topics:
                msg_dict['depth_image'] = args[arg_index]
                arg_index += 1
                
            if '/arm/status' in self.confirmed_topics:
                msg_dict['arm_status'] = args[arg_index]
                arg_index += 1
                
            if '/inspire_hand/state/left_hand' in self.confirmed_topics:
                msg_dict['left_hand_state'] = args[arg_index]
                arg_index += 1
                
            if '/inspire_hand/state/right_hand' in self.confirmed_topics:
                msg_dict['right_hand_state'] = args[arg_index]
                arg_index += 1
            
            # 获取时间戳（使用第一个消息的时间戳作为参考）
            first_msg = next(iter(msg_dict.values()))
            if hasattr(first_msg, 'header'):
                sync_stamp = first_msg.header.stamp
            else:
                sync_stamp = self.get_clock().now().to_msg()
            
            # 如果启用录制，录制到rosbag
            if self.recording_enabled:
                for topic_name, msg in zip(self.confirmed_topics.keys(), msg_dict.values()):
                    self.write_to_bag(topic_name, msg)
            
            self.sync_count += 1
            elapsed_time = time.time() - self.start_time
            
            if self.sync_count % 10 == 0:  # 每10次同步打印一次统计
                self.get_logger().info(
                    f'同步统计: {self.sync_count} 次同步, '
                    f'频率: {self.sync_count/elapsed_time:.2f} Hz, '
                    f'Topics: {len(self.confirmed_topics)}/{len(self.required_topics)}'
                )
            
            # 处理同步数据
            self.process_sync_data(**msg_dict, sync_stamp=sync_stamp)
            
        except Exception as e:
            self.get_logger().error(f'同步回调处理错误: {str(e)}')

    def process_sync_data(self, **kwargs):
        """
        处理同步后的数据
        根据实际需求实现具体的处理逻辑
        """
        try:
            # 动态处理数据，因为topic数量可能变化
            info_parts = []
            
            if 'color_image' in kwargs:
                color_img = kwargs['color_image']
                info_parts.append(f'彩色图: {color_img.width}x{color_img.height}')
                
            if 'depth_image' in kwargs:
                depth_img = kwargs['depth_image']
                info_parts.append(f'深度图: {depth_img.width}x{depth_img.height}')
                
            if 'arm_status' in kwargs:
                arm_status = kwargs['arm_status']
                # 根据MotorStatusMsg的实际结构显示信息
                if hasattr(arm_status, 'status') and len(arm_status.status) > 0:
                    info_parts.append(f'机械臂状态: {len(arm_status.status)}个关节')
                else:
                    info_parts.append('机械臂状态: 无关节数据')
                
            if 'left_hand_state' in kwargs:
                left_hand = kwargs['left_hand_state']
                info_parts.append(f'左手: {len(left_hand.position)}关节')
                
            if 'right_hand_state' in kwargs:
                right_hand = kwargs['right_hand_state']
                info_parts.append(f'右手: {len(right_hand.position)}关节')
            
            if info_parts:
                self.get_logger().debug('同步数据: ' + ', '.join(info_parts))
                
        except Exception as e:
            self.get_logger().error(f'处理同步数据错误: {str(e)}')

    def destroy_node(self):
        """重写销毁节点方法，确保正确关闭rosbag"""
        if self.bag_writer is not None:
            try:
                # 这里需要调用rosbag2_py的关闭方法
                # 注意: SequentialWriter没有显式的close方法，依赖析构函数
                self.bag_writer = None
                self.get_logger().info(f'Rosbag录制已完成: {self.bag_path}')
            except Exception as e:
                self.get_logger().error(f'关闭rosbag失败: {str(e)}')
        
        super().destroy_node()


def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(description='多Topic时间同步节点')
    parser.add_argument(
        '--record', 
        action='store_true',
        help='启用rosbag录制功能'
    )
    return parser.parse_args()


def main(args=None):
    # 解析命令行参数
    cli_args = parse_arguments()
    
    rclpy.init(args=args)
    
    # 检查rosbag2可用性
    if cli_args.record and not ROSBAG2_AVAILABLE:
        print("错误: rosbag2_py 不可用，无法启用录制功能")
        print("请安装: sudo apt install ros-{你的ROS2版本}-rosbag2-py")
        return 1
    
    # 创建节点，传入录制标志
    node = MultiTopicSyncNode(record_flag=cli_args.record)
    
    try:
        # 运行节点
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('收到中断信号，正在关闭...')
    finally:
        # 打印最终统计
        if node.sync_count > 0:
            elapsed_time = time.time() - node.start_time
            node.get_logger().info(
                f'最终统计: {node.sync_count} 次同步, '
                f'平均频率: {node.sync_count/elapsed_time:.2f} Hz'
            )
        
        # 清理资源
        node.destroy_node()
        rclpy.shutdown()
    
    return 0


if __name__ == '__main__':
    sys.exit(main())

```



# 其他补充
* ros2录制bag：`ros2 bag record -o BAG_NAME /arm/status /camera/color/image_raw`
* 查看录制出话题的信息，比如话题记录的时间，大小，类型，数量: `ros2 bag info BAG_NAME`