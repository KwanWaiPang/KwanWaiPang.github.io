---
layout: post
title: "论文阅读笔记之——《Splat-LOAM: Gaussian Splatting LiDAR Odometry and Mapping》"
date:   2025-06-19
tags: [SLAM]
comments: true
author: kwanwaipang
toc: true
---


<!-- * 目录
{:toc} -->


<!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
# 引言





# 实验测试

## 安装配置

* 可以采用作者提供的Docker或者Pixi，不过此处采用conda配置：

```sh
git clone --recursive https://github.com/R-C-Group/Splat-LOAM.git

# rm -rf .git

conda env create -f environment.yaml # for A100 with CUDA12.2/12.1
# # conda remove --name Splat-LOAM --all
conda activate Splat-LOAM
# bash post_install.sh

# 安装第一个模块
pip install ./submodules/diff-surfel-spherical-rasterization/

# 安装第二个模块
pip install ./submodules/gsaligner/

# 安装第三个模块
pip install ./submodules/simple-knn/
```

## 实验测试

* `configs`文件中含有运行所需要的配置
* 运行代码（注意要修改数据的路径,同时下载[kitti](https://www.cvlibs.net/datasets/kitti/eval_odometry.php)数据）

```sh
python3 run.py slam <path/to/config.yaml>

conda activate Splat-LOAM
python3 run.py slam configs/kitti/kitti-00-odom.yaml
```

* 注意，上述需要在`sequences/00`内还要有times.txt文件，故此需要下载图像帧
* 下面是成功运行的截图：

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250618211049.png" width="80%" />
<figcaption>  
</figcaption>
</div>

>[!TIP]
>If you want to solve `Mapping-only`, provide a trajectory in `data.trajectory_reader.filename`, set tracking to use it with `tracking.method=gt` and enable skipping of clouds that have no associated pose with `data.skip_clouds_wno_sync=true`

* 运行后提醒打开浏览器`http://127.0.0.1:9876/`,但是加载好久都加载不出来（改为MobaXterm即可）

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250618214610.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 若`output.folder`没有设置，实验结果会保存在 `results/<date_of_the_experiment>/`文件中(但实际运行中会遇到没有results导致跑了几个小时后没法保存模型...)

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250619161850.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 运行完SLAM后(运行的时间应该要好几个小时)，接下来可以基于SLAM的结果来生成mesh：

```sh
python3 run.py mesh <path/to/result/folder>
# conda activate Splat-LOAM
# python3 run.py mesh /home/gwp/Splat-LOAM/results/2025-06-19_09-40-53
```

<div align="center">
  <img src="https://github.com/R-C-Group/Splat-LOAM/raw/main/Fig/微信截图_20250619162246.png" width="80%" />
<figcaption>  
</figcaption>
</div>

* 下面是`.ply`文件的可视化

<!-- 在博客Markdown文件中直接插入此代码 -->
<div id="ply-container" style="width:100%; height:500px; border-radius:15px; box-shadow:0 6px 12px rgba(0,0,0,0.15);"></div>

<script type="module">
  // 动态加载Three.js及其依赖
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
  import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
  import { PLYLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/PLYLoader.js';

  // 1. 初始化场景
  const container = document.getElementById('ply-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  const camera = new THREE.PerspectiveCamera(
    75, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 1.5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 2. 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 3. 加载PLY模型
  const loader = new PLYLoader();
  loader.load(
    'https://r-c-group.github.io/blog_media/Splat-LOAM/2025-06-19_16-22-19.ply', // 替换为你的PLY路径
    (geometry) => {
      // 创建材质 (根据需求选择)
      let material;
      
      // 选项1: 顶点颜色材质 (如果PLY包含颜色数据)
      if (geometry.hasAttribute('color')) {
        material = new THREE.MeshPhongMaterial({
          vertexColors: true,
          shininess: 30,
          side: THREE.DoubleSide
        });
      } 
      // 选项2: 单色材质
      else {
        material = new THREE.MeshPhongMaterial({
          color: 0x0080ff,
          shininess: 30,
          side: THREE.DoubleSide
        });
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // 自动居中并缩放模型
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      
      mesh.position.sub(center);
      mesh.scale.multiplyScalar(1.0 / size);
      
      scene.add(mesh);
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    (error) => console.error('Error loading PLY:', error)
  );

  // 4. 添加交互控制
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 5. 动画循环
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
</script>

* 为了验证所计算的mesh以及odometry，运行下面命令:

```sh
python3 run.py eval_recon <reference_pointcloud_file> <estimate_mesh> 

python3 run.py eval_odom <path/to/odom/estimate> \
                          --reference-filename <path/to/reference/trajectory> \
                          --reference-format <tum|kitti|vilens> \
                          --estimate-format <tum|kitti|vilens> \
```