import { gsap } from 'gsap';
import * as THREE from 'three'; // Import the THREE module
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import the GLTFLoader module
// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Add a black background
scene.background = new THREE.Color(0x000000);
// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);
// Load the jellyfish model
const loader = new GLTFLoader();
loader.load('../path_to_your_jellyfish_model.glb', (gltf) => {
    const jellyfish = gltf.scene;
    scene.add(jellyfish);
    // Add glowing effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        // emissive: 0x00ff00,
        // emissiveIntensity: 1,
        transparent: true,
        opacity: 0.5
    });
    jellyfish.traverse((child) => {
        if (child.isMesh) {
            child.material = glowMaterial;
        }
    });
    // Animate the jellyfish using GSAP
    gsap.to(jellyfish.rotation, {
        y: "+=6.28", // Rotate 360 degrees
        duration: 10,
        repeat: -1,
        ease: "none"
    });
    gsap.to(jellyfish.position, {
        y: "+=1",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
    });
    gsap.to(jellyfish.scale, {
        x: "+=0.2",
        y: "+=0.2",
        z: "+=0.2",
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
    });
    // Render loop
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    animate();
}, undefined, (error) => {
    console.error(error);
});
// Set camera position
camera.position.z = 5;
// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
