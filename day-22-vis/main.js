import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshPhongMaterial({ color: 0xd3ddd3, side: THREE.DoubleSide }) // Light grey color
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const blockSpecs1 = [
    { min: [1, 0, 1], max: [1, 2, 1], label: "A" },
    { min: [0, 0, 2], max: [2, 0, 2], label: "B" },
    { min: [0, 2, 3], max: [2, 2, 3], label: "C" },
    { min: [0, 0, 4], max: [0, 2, 4], label: "D" },
    { min: [2, 0, 5], max: [2, 2, 5], label: "E" },
    { min: [0, 1, 6], max: [2, 1, 6], label: "F" },
    { min: [1, 1, 8], max: [1, 1, 9], label: "G" }
];

const blockSpecs2 = [
    { min: [ 1, 0, 1 ], max: [ 1, 2, 1 ], label: "A" },
    { min: [ 0, 0, 2 ], max: [ 2, 0, 2 ], label: "B" },
    { min: [ 0, 2, 2 ], max: [ 2, 2, 2 ], label: "C" },
    { min: [ 0, 0, 3 ], max: [ 0, 2, 3 ], label: "D" },
    { min: [ 2, 0, 3 ], max: [ 2, 2, 3 ], label: "E" },
    { min: [ 0, 1, 4 ], max: [ 2, 1, 4 ], label: "F" },
    { min: [ 1, 1, 5 ], max: [ 1, 1, 6 ], label: "G" }
];

function createBoxMeshes(specs) {
    return specs.map((spec) => {
        const { min: c1, max: c2 } = spec;
        const width = 1 + Math.abs(c1[0] - c2[0]);
        const height = 1 + Math.abs(c1[2] - c2[2]);
        const depth = 1 + Math.abs(c1[1] - c2[1]);
        console.log("🦊>", { width, depth, height, })

        const geom = new THREE.BoxGeometry(width, height, depth);
        geom.translate(-(width / 2), -(height / 2), -(depth / 2));
        const bbox = new THREE.Mesh(
            geom,
            new THREE.MeshPhongMaterial({ color: getRandomColor(), specular: 0x444444, shininess: 25 })
        );

        bbox.position.set(c1[0], c1[2], c1[1]);

        return {
            box: bbox,
            label: spec.label,
        };
    })
}

const meshes = createBoxMeshes(blockSpecs2);
meshes.forEach(({ box, label }) => {
    console.log({ label, box });
    const { x, y, z } = box.position;
    const labelMesh = createLabel(`Box ${label}`, x, y, z);
    scene.add(box);
    scene.add(labelMesh);
});


/**
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} z
 *
 * @returns {THREE.Object3D}
 */
function createLabel(text, x, y, z) {
    const labelCanvas = document.createElement('canvas');
    const context = labelCanvas.getContext('2d');

    context.font = 'Bold 48px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 20, 40);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true });
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), labelMaterial);
    labelMesh.position.set(x, y, z);

    return labelMesh;
}

const ambientLight = new THREE.AmbientLight(0xEEEEEE);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3, 8, 6);
scene.add(ambientLight, directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

camera.position.x = 4;
camera.position.y = 8;
camera.position.z = 10;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();
