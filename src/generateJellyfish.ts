import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export async function createJellyfish(): Promise<THREE.Scene> {
  const scene = new THREE.Scene();

  // Create the teapot body
  const body = createTeapot();
  scene.add(body);

  // Add spectacular lighting
  addLighting(scene);

  return scene;
}

function createTeapot(): THREE.Mesh {
  // Create a teapot geometry
  const teapotGeometry = new TeapotGeometry(1, 15); // Size and detail level
  const teapotMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x7fffd4, // Light aquamarine blue
    emissive: 0x007fff, // Emissive blue color for glowing effect
    emissiveIntensity: 0.5, // Increase emissive intensity for glowing effect
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
    transmission: 0.8, // Make the material slightly transparent
    opacity: 0.9,
    transparent: true,
    envMap: createEnvironmentMap(), // Add fake reflection
  });
  const teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
  teapot.position.y = 1.5;
  return teapot;
}

function addLighting(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white ambient light
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xffffff, 1, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x00ffff, 1, 50); // Light aquamarine blue light
  pointLight2.position.set(-10, 10, -10);
  scene.add(pointLight2);

  const spotLight = new THREE.SpotLight(0xffffff, 2);
  spotLight.position.set(0, 20, 0);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 50;
  spotLight.castShadow = true;
  spotLight.target.position.set(0, 0, -1); // Ensure the target is set correctly
  spotLight.add(spotLight.target);
  scene.add(spotLight);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
}

function createEnvironmentMap(): THREE.CubeTexture {
  const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
  const format = '.jpg';
  const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format,
  ];

  const loader = new THREE.CubeTextureLoader();
  const envMap = loader.load(urls);
  return envMap;
}

export async function exportGLB(scene: THREE.Scene): Promise<void> {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        const blob = new Blob([result], { type: 'model/gltf-binary' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'teapot.glb';
        link.click();
      } else {
        console.error('Unexpected GLTF result type:', result);
      }
    },
    (error) => console.error(error),
    { binary: true },
  );
}