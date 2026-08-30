import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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