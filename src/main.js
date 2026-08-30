import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// Star
const starGeometry = new THREE.SphereGeometry(1, 32, 32);

const starMaterial = new THREE.MeshBasicMaterial({
  color: 0xffdd66
});

const star = new THREE.Mesh(
  starGeometry,
  starMaterial
);

scene.add(star);

// Animation
function animate() {
  requestAnimationFrame(animate);

  star.rotation.y += 0.005;

  renderer.render(scene, camera);
}

animate();

// Responsive screen
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});