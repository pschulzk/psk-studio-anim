import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createJellyfish, exportGLB } from './generateJellyfish';
// import { gsap } from 'gsap';

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
    'jellyfish.glb',
    (gltf) => {
      const jellyfish = gltf.scene;
      scene.add(jellyfish);

      // Animate the jellyfish
      function animate() {
        requestAnimationFrame(animate);
        jellyfish.rotation.y += 0.01;
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