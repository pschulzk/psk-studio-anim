import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { gsap } from 'gsap';

export async function createJellyfish() {
  const scene = new THREE.Scene();

  // Create jellyfish body
  const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1.5;
  scene.add(body);

  // Create jellyfish tentacles
  const tentacleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
  for (let i = 0; i < 8; i++) {
    const tentacleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 32);
    const tentacle = new THREE.Mesh(tentacleGeometry, tentacleMaterial);
    tentacle.position.set(Math.cos((i / 8) * Math.PI * 2) * 0.8, -0.5, Math.sin((i / 8) * Math.PI * 2) * 0.8);
    tentacle.rotation.x = Math.PI / 2;
    scene.add(tentacle);
  }

  return scene;
}

export async function exportGLB(scene: THREE.Scene) {
  const exporter = new GLTFExporter();
  exporter.parse(scene, (result) => {
    if (result instanceof ArrayBuffer) {
      const blob = new Blob([result], { type: 'model/gltf-binary' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'jellyfish.glb';
      link.click();
    } else {
      console.error('Unexpected GLTF result type:', result);
    }
  }, error => console.error(error), { binary: true });
}