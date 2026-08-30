import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import celestialObjects from './data/celestialObjects.js';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 8, 15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// --------------------
// Star Field
// --------------------

const starCount = 10000;

const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {
  starPositions[i] = (Math.random() - 0.5) * 100;
  starPositions[i + 1] = (Math.random() - 0.5) * 100;
  starPositions[i + 2] = (Math.random() - 0.5) * 100;
}

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.08
});

const stars = new THREE.Points(
  starGeometry,
  starMaterial
);

scene.add(stars);

// --------------------
// Spiral Galaxy
// --------------------

const galaxyCount = 30000;
const galaxyPositions = new Float32Array(galaxyCount * 3);

const arms = 4;
const galaxyRadius = 15;

for (let i = 0; i < galaxyCount; i++) {
  const i3 = i * 3;

  const radius = Math.random() * galaxyRadius;

  const armAngle =
    (i % arms) * (Math.PI * 2 / arms);

  const spiralAngle =
    armAngle + radius * 0.45;

  const spread =
    (Math.random() - 0.5) * 1.2;

  galaxyPositions[i3] =
    Math.cos(spiralAngle) * radius + spread;

  galaxyPositions[i3 + 1] =
    (Math.random() - 0.5) * 0.8;

  galaxyPositions[i3 + 2] =
    Math.sin(spiralAngle) * radius + spread;
}

const galaxyGeometry = new THREE.BufferGeometry();

galaxyGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(galaxyPositions, 3)
);

const galaxyMaterial = new THREE.PointsMaterial({
  color: 0x9bbcff,
  size: 0.06,
  transparent: true,
  opacity: 0.85
});

const galaxy = new THREE.Points(
  galaxyGeometry,
  galaxyMaterial
);

scene.add(galaxy);

// --------------------
// Celestial Objects
// --------------------

const celestialGroup = new THREE.Group();

celestialObjects.forEach((object, index) => {
  const geometry = new THREE.SphereGeometry(0.18, 16, 16);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });

  const marker = new THREE.Mesh(
    geometry,
    material
  );

  const angle = (index / celestialObjects.length) * Math.PI * 2;
  const radius = 6;

  marker.position.x = Math.cos(angle) * radius;
  marker.position.z = Math.sin(angle) * radius;

  marker.userData = object;

  celestialGroup.add(marker);
});

scene.add(celestialGroup);

// --------------------
// Sun
// --------------------

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);

const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffcc33
});

const sun = new THREE.Mesh(
  sunGeometry,
  sunMaterial
);

scene.add(sun);

// --------------------
// Earth
// --------------------

const earthOrbit = new THREE.Group();

scene.add(earthOrbit);

const earthGeometry = new THREE.SphereGeometry(0.7, 32, 32);

const earthMaterial = new THREE.MeshBasicMaterial({
  color: 0x3388ff
});

const earth = new THREE.Mesh(
  earthGeometry,
  earthMaterial
);

earth.position.x = 5;

earthOrbit.add(earth);

// --------------------
// Mars
// --------------------

const marsOrbit = new THREE.Group();

scene.add(marsOrbit);

const marsGeometry = new THREE.SphereGeometry(0.45, 32, 32);

const marsMaterial = new THREE.MeshBasicMaterial({
  color: 0xdd5533
});

const mars = new THREE.Mesh(
  marsGeometry,
  marsMaterial
);

mars.position.x = 7;

marsOrbit.add(mars);

// --------------------
// Jupiter
// --------------------

const jupiterOrbit = new THREE.Group();

scene.add(jupiterOrbit);

const jupiterGeometry = new THREE.SphereGeometry(1.1, 32, 32);

const jupiterMaterial = new THREE.MeshBasicMaterial({
  color: 0xddaa77
});

const jupiter = new THREE.Mesh(
  jupiterGeometry,
  jupiterMaterial
);

jupiter.position.x = 9;

jupiterOrbit.add(jupiter);

// --------------------
// Animation
// --------------------

function animate() {
  requestAnimationFrame(animate);

  // Rotate planets around the Sun
  earthOrbit.rotation.y += 0.01;
  marsOrbit.rotation.y += 0.007;
  jupiterOrbit.rotation.y += 0.004;

  // Rotate planets on their own axis
  earth.rotation.y += 0.02;
  mars.rotation.y += 0.015;
  jupiter.rotation.y += 0.01;

  galaxy.rotation.y += 0.0005;

  controls.update();

  renderer.render(scene, camera);
}

animate();

// --------------------
// Responsive
// --------------------

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});