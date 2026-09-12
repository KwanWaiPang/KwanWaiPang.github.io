---
layout: post
title: "事件相机的时间同步处理"
date:   2025-03-16
tags: [Event-based Vision]
comments: true
author: kwanwaipang
toc: true
excerpt: "本博文记录了本人实现多个事件相机时间同步的实验过程。" # 【核心：指定摘要分隔符】
---


<!-- * 目录
{:toc} -->


# 1. Abstract
{: #1.-abstract }

In this report, we will provide a brief overview of our sensor synchronization process.
This primarily involves synchronizing event cameras, synchronizing different types of sensors, and synchronizing onboard computers across multiple platforms.

😀For the details of Event Cameras calibration, please refer to:

* Achieving image reconstruction from event streams, and then using the Kalibr toolbox for camera-and-IMU calibration: [Link](https://arclab-hku.github.io/ecmd/calibration/)
* Using dv-gui for camera-and-IMU calibration: [Link](https://blog.csdn.net/gwplovekimi/article/details/121637241?spm=1001.2014.3001.5501)
* Assuming that the event camera is consistent with the image camera in pixel coordination, use the Kalibr toolbox to calibrate the image sensor: [Link](https://blog.csdn.net/gwplovekimi/article/details/120948986)

# 2. The Synchronization of Event Cameras
{: #2.-the-synchronization-of-event-cameras }

The event camera has an additional synchronization interface, called as "sync connectors", as shown in the figure below. (Using DAVIS346 as example reference to [Link](https://inivation.com/wp-content/uploads/2019/08/DAVIS346.pdf),
same as DVXplorer [Link](https://inivation.com/wp-content/uploads/2023/03/DVXplorer.pdf)).

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/syns_connectors.png" width="80%" />
<figcaption>  
Fig. 1. Sync connector pinouts on DAVIS 346
</figcaption>
</div>

The synchronization connectors are HiRose HR10A-7R-4P (male, SYNC OUTPUT) and HR10A-7R-4S (female, SYNC INPUT) connectors. Cables should use the matching connectors HR10A-7P-4S (female) and HR10A-7P-4P (male).
Please note that to keep full electrical isolation between different cameras, the cable should not be shielded, or if it is, the shield should not connect one end of the cable to the other.
Input signals can be 3.3V or 5V, depending on the VDD_IN supplied externally, output signals are 5V, as is VDD_OUT.
If you chain cameras together for synchronization, the clock and VDD will be 5V, for example.

Therefore, utilizing this sync connector, we connected four event cameras together (two DAVIS346 and two DVXplorer) as shown in the diagram below.
Additionally, we replaced the event camera ROS driver [Code](https://gitlab.com/inivation/dv/dv-ros) provided by Invitation Company with our own driver [Code](https://github.com/arclab-hku/Event_based_VO-VIO-SLAM/tree/main/driver_code/dv-ros-master).

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/four_event_camera.jpg" width="80%" />
<figcaption>  
Fig. 2. Sync connector pinouts on DAVIS 346
</figcaption>
</div>

There are two key parameter in the driver code of event camera for synchronization, `syncDevices` and `waitForSync`

```xml
<rosparam param="syncDevices">["series number of your event camera"]</rosparam>
```

A list of other cameras connected with synchronization cable to this camera, If this list is empty, the camera node will not properly synchronize them.

```xml
<param name="waitForSync" value="true"/>
```

This means that it does not publish data until synchronization is complete.
The launch file of our event camera synchronization can be seen in [Link](https://github.com/arclab-hku/Event_based_VO-VIO-SLAM/tree/main/driver_code/dv-ros-master/dv_ros_visualization/launch).
We use an event camera as "master" while the other three event cameras is waiting on list.
Through the series number of the event camera to avoid mis-match.

<div align="center">
  <iframe src="https://player.bilibili.com/player.html?aid=869034367&bvid=BV1xV4y1B7qF&cid=1141562890&page=1" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

Furthermore, to validate the synchronization effect, we simultaneously started four event cameras, recorded a rosbag, and then outputted the rostopic, as shown in the figure below.
It can be observed that "/DAVIS346 left/events: 4482", "/DAVIS346 right/events: 4482", "/DVXplorer left/events: 4483", and "/DVXplorer right/events: 4480".
The data volume from all four event cameras is similar.
Additionally, from the video demo, it can be seen that when the event cameras are started, there is a waiting period until all of them have finished initializing.
Moreover, the difference in data volume between "/DAVIS346 left/events" and "/DAVIS346 left/imu" is only 1, and both are recorded at 1000Hz.

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/number_of_event_after_synchronization.png" width="80%" />
<figcaption>  
Fig. 3. The rosbag information for the four event cameras
</figcaption>
</div>

# 3. The Synchronization of Multi Sensors
{: #3.-the-synchronization-of-multi-sensors }

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/structure_of_syns.png" width="80%" />
<figcaption>  
Fig. 4. The Structure of Our Sensors Synchronization
</figcaption>
</div>

### 3.1. The Synchronization of Two Onboard Computer
{: #3.1.-the-synchronization-of-two-onboard-computer }

Firstly, we install the PTP.

```bash
sudo apt install ptpd
```

Choose a machine to serve as the master node and initiate the following on it (where eth0 is the selected network interface for synchronization, please note that it requires the connected switch to support the PTP protocol):

```bash
sudo ptpd -M -i eth0
```

On the remaining slave nodes, initiate the following:

```bash
sudo ptpd -g -i eth0
```

If the "-C" parameter is added to both the master and slave, it will run in the foreground and print the output. For example, on the master side:

```bash
sudo ptpd -g -i eth0 -C
```

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/ptpd_syns.png" width="80%" />
<figcaption>  
The screenshot of the PTPD
</figcaption>
</div>

### 3.2 The Synchronization of Event Camera and Standard Camera
{: #3.2-the-synchronization-of-event-camera-and-standard-camera }

After synchronizing the clock cycles between two onboard computers, we set the image publishing frequency of DAVIS346 on onboard computer A to 20Hz, and the publishing frequency of the industrial camera on onboard computer B to 20Hz as well.
Then, we placed a stopwatch in front of both cameras.
We observed the stopwatch values for image topics with the same timestamps from both cameras.
After multiple verifications, we concluded that the time difference between the DAVIS346 on onboard computer A and the industrial camera on onboard computer B, directly capturing images, was within 10ms, which aligns with our expectations.

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_camera_synchronization.jpg" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/image_synchronization.jpg" width="100%" />
      </td>
    </tr>
  </table>
<figcaption>
  Fig. 5. Synchronization Testing between the Event Camera (left) and the Standard Camera (right)
</figcaption>
</div>

We further test the synchronization between the event and image data streams in DAVIS346 as following:

<div align="center">
  <table style="border: none; background-color: transparent;">
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_1.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_2.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_3.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_4.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_5.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_6.png" width="100%" />
      </td>
    </tr>
    <tr align="center">
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_7.png" width="100%" />
      </td>
      <td style="width: 50%; border: none; padding: 0.01; background-color: transparent; vertical-align: middle;">
        <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/event_vs_image_8.png" width="100%" />
      </td>
    </tr>
  </table>
<figcaption>
  Fig. 6. Synchronization Testing between the Event and Image from DAVIS346
</figcaption>
</div>

<div align="center">
  <iframe src="https://player.bilibili.com/player.html?aid=229390210&bvid=BV168411o7BJ&cid=1152522995&page=1" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

### 3.3. The Synchronization of Other Sensors
{: #3.3.-the-synchronization-of-other-sensors }

Our sensor platform can be seen as following:

<div align="center">
  <img src="https://kwanwaipang.github.io/Poster_files/Sensor_Synchronization/four_event_camera_platform.jpg" width="80%" />
<figcaption>  
Fig. 7. Sensor Setup
</figcaption>
</div>

#### Tips:
{: #tips }

* Event cameras are sensitive to infrared light, enabling them to detect the brightness changes caused by LiDAR with the right wavelength.

To alleviate disturbance from the LiDAR on the event camera, we add an infrared filter on the lens surface of the DAVIS346 camera.
As can be seen from the video, we demonstrate that two event cameras with infrared filter while the other two event cameras without infrared filter.

<div align="center">
  <iframe src="https://player.bilibili.com/player.html?aid=399299383&bvid=BV15o4y1u7Up&cid=1147844860&page=1" width="600" height="340" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>
