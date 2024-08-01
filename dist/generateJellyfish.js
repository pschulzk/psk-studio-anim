var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { promises as fs } from 'fs';
function createJellyfish() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function exportGLB(scene, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const exporter = new GLTFExporter();
        exporter.parse(scene, (result) => __awaiter(this, void 0, void 0, function* () {
            if (result instanceof ArrayBuffer) {
                yield fs.writeFile(outputPath, Buffer.from(result));
                console.log('Jellyfish model saved as', outputPath);
            }
        }), error => console.error(error), { binary: true });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scene = yield createJellyfish();
        yield exportGLB(scene, 'jellyfish.glb');
    });
}
main().catch(console.error);
