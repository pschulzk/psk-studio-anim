import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createJellyfish, exportGLB } from './generateJellyfish';
import { gsap } from 'gsap';

document.getElementById('generate')!.addEventListener('click', async () => {
  const scene = await createJellyfish();
  await exportGLB(scene);
});

document.getElementById('startAnimation')!.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);

  const loader = new GLTFLoader();
  loader.load(
    'teapot.glb',
    (gltf) => {
      const teapot = gltf.scene;
      scene.add(teapot);

      // Animate the teapot using GSAP
      gsap.to(teapot.rotation, {
        y: "+=6.28", // Rotate 360 degrees
        duration: 10,
        repeat: -1,
        ease: "none"
      });

      gsap.to(teapot.position, {
        y: "+=1",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });

      gsap.to(teapot.scale, {
        x: "+=0.2",
        y: "+=0.2",
        z: "+=0.2",
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );
});