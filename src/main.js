import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import celestialObjects from './data/celestialObjects.js';

import starVertexShader from './shaders/star.vert?raw';
import starFragmentShader from './shaders/star.frag?raw';

import './style.css';

// ====================
// Scene
// ====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// ====================
// Camera
// ====================

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 8, 15);
camera.lookAt(0, 0, 0);

// ====================
// Renderer
// ====================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);

// ====================
// Orbit Controls
// ====================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ====================
// Camera Focus
// ====================

let cameraTargetPosition = null;
let cameraLookAtTarget = null;
let isCameraFocusing = false;

function focusOnObject(object) {
  const worldPosition = new THREE.Vector3();

  object.getWorldPosition(worldPosition);

  cameraTargetPosition = worldPosition
    .clone()
    .add(new THREE.Vector3(3, 2, 5));

  cameraLookAtTarget = worldPosition.clone();

  isCameraFocusing = true;
}

// User manually moves camera
controls.addEventListener('start', () => {
  isCameraFocusing = false;
  cameraTargetPosition = null;
  cameraLookAtTarget = null;
});

// ====================
// Initial Camera State
// ====================

const initialCameraPosition =
  camera.position.clone();

const initialTarget =
  controls.target.clone();

// ====================
// Star Field
// ====================

const starCount = 10000;

const starPositions =
  new Float32Array(starCount * 3);

for (
  let i = 0;
  i < starCount * 3;
  i += 3
) {
  starPositions[i] =
    (Math.random() - 0.5) * 100;

  starPositions[i + 1] =
    (Math.random() - 0.5) * 100;

  starPositions[i + 2] =
    (Math.random() - 0.5) * 100;
}

const starGeometry =
  new THREE.BufferGeometry();

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    starPositions,
    3
  )
);

const starMaterial =
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08
  });

const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  );

scene.add(stars);

// ====================
// Spiral Galaxy
// ====================

const galaxyCount = 30000;

const galaxyPositions =
  new Float32Array(
    galaxyCount * 3
  );

const arms = 4;
const galaxyRadius = 15;

for (let i = 0; i < galaxyCount; i++) {

  const i3 = i * 3;

  const radius =
    Math.random() * galaxyRadius;

  const armAngle =
    (i % arms) *
    (Math.PI * 2 / arms);

  const spiralAngle =
    armAngle + radius * 0.45;

  const spread =
    (Math.random() - 0.5) * 1.2;

  galaxyPositions[i3] =
    Math.cos(spiralAngle) *
    radius +
    spread;

  galaxyPositions[i3 + 1] =
    (Math.random() - 0.5) * 0.8;

  galaxyPositions[i3 + 2] =
    Math.sin(spiralAngle) *
    radius +
    spread;
}

const galaxyGeometry =
  new THREE.BufferGeometry();

galaxyGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    galaxyPositions,
    3
  )
);

const galaxyMaterial =
  new THREE.ShaderMaterial({

    vertexShader:
      starVertexShader,

    fragmentShader:
      starFragmentShader,

    uniforms: {

      uSize: {
        value: 0.12
      },

      uColor: {
        value:
          new THREE.Color(
            0x9bbcff
          )
      },

      uOpacity: {
        value: 0.9
      }

    },

    transparent: true,
    depthWrite: false,
    blending:
      THREE.AdditiveBlending
  });

const galaxy =
  new THREE.Points(
    galaxyGeometry,
    galaxyMaterial
  );

scene.add(galaxy);

// ====================
// Celestial Objects
// ====================

const celestialGroup =
  new THREE.Group();

celestialObjects.forEach(
  (object, index) => {

    const geometry =
      new THREE.SphereGeometry(
        0.18,
        16,
        16
      );

    const material =
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      });

    const marker =
      new THREE.Mesh(
        geometry,
        material
      );

    const angle =
      (index /
        celestialObjects.length) *
      Math.PI * 2;

    const radius = 6;

    marker.position.x =
      Math.cos(angle) * radius;

    marker.position.z =
      Math.sin(angle) * radius;

    marker.userData = object;

    celestialGroup.add(marker);
  }
);

scene.add(celestialGroup);

// ====================
// Object Labels
// ====================

const objectLabels = [];

celestialObjects.forEach(
  (object, index) => {

    const label =
      document.createElement('div');

    label.className =
      'object-label';

    label.textContent =
      object.name;

    document.body.appendChild(label);

    objectLabels.push({
      element: label,
      object:
        celestialGroup.children[index]
    });
  }
);

// ====================
// Highlight
// ====================

let selectedRing = null;

function highlightObject(object) {

  // Remove previous highlight
  if (selectedRing) {

    selectedRing.parent?.remove(
      selectedRing
    );

    selectedRing.geometry.dispose();

    selectedRing.material.dispose();

    selectedRing = null;
  }

  // Create highlight ring
  const ringGeometry =
    new THREE.TorusGeometry(
      0.35,
      0.035,
      16,
      64
    );

  const ringMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x66ccff,
      transparent: true,
      opacity: 0.9
    });

  selectedRing =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

  selectedRing.rotation.x =
    Math.PI / 2;

  object.add(selectedRing);
}

// ====================
// Sun
// ====================

const sunGeometry =
  new THREE.SphereGeometry(
    2,
    32,
    32
  );

const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd54a
});

const sun =
  new THREE.Mesh(
    sunGeometry,
    sunMaterial
  );

scene.add(sun);

// ====================
// Sun Glow
// ====================

const sunGlowGeometry = new THREE.SphereGeometry(
  2.25,
  32,
  32
);

const sunGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffdd55,
  transparent: true,
  opacity: 0.12,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const sunGlow = new THREE.Mesh(
  sunGlowGeometry,
  sunGlowMaterial
);

scene.add(sunGlow);
// ====================
// Lighting
// ====================

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    2.1
  );

scene.add(ambientLight);

const sunLight =
  new THREE.PointLight(
    0xfff4d6,
    7,
    100
  );

sunLight.position.set(
  0,
  0,
  0
);

scene.add(sunLight);

// --------------------
// Earth
// --------------------

const earthOrbit = new THREE.Group();

scene.add(earthOrbit);

// Earth geometry
const earthGeometry = new THREE.SphereGeometry(
  0.7,
  64,
  64
);

// --------------------
// Earth Texture
// --------------------

const earthCanvas = document.createElement('canvas');

earthCanvas.width = 512;
earthCanvas.height = 256;

const earthContext =
  earthCanvas.getContext('2d');

// Ocean
earthContext.fillStyle = '#2563EB';

earthContext.fillRect(
  0,
  0,
  earthCanvas.width,
  earthCanvas.height
);

// Continents
earthContext.fillStyle = '#22C55E';

const continents = [
  [120, 80, 55, 30],
  [175, 105, 45, 65],
  [250, 75, 70, 35],
  [315, 105, 55, 65],
  [390, 80, 45, 35],
  [420, 145, 30, 45],
  [90, 155, 45, 30],
  [225, 165, 40, 25]
];

continents.forEach(
  ([x, y, width, height]) => {

    earthContext.beginPath();

    earthContext.ellipse(
      x,
      y,
      width,
      height,
      Math.random() * 0.5,
      0,
      Math.PI * 2
    );

    earthContext.fill();
  }
);

// Light green areas
earthContext.fillStyle = '#86EFAC';

for (let i = 0; i < 25; i++) {

  const x = Math.random() * 512;
  const y = Math.random() * 256;

  const size =
    Math.random() * 10 + 3;

  earthContext.beginPath();

  earthContext.arc(
    x,
    y,
    size,
    0,
    Math.PI * 2
  );

  earthContext.fill();
}

// Clouds / polar highlights
earthContext.fillStyle = '#FFFFFF';

for (let i = 0; i < 35; i++) {

  const x = Math.random() * 512;
  const y = Math.random() * 256;

  const width = Math.random() * 18 + 5;
  const height = Math.random() * 5 + 2;

  earthContext.beginPath();

  earthContext.ellipse(
    x,
    y,
    width,
    height,
    0,
    0,
    Math.PI * 2
  );

  earthContext.fill();
}

const earthTexture =
  new THREE.CanvasTexture(
    earthCanvas
  );

// Earth material
const earthMaterial =
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.3,
    metalness: 0.0,

    emissive: 0x1a6cff,
    emissiveIntensity: 1.8
  });

const earth = new THREE.Mesh(
  earthGeometry,
  earthMaterial
);

earth.position.x = 5;

earthOrbit.add(earth);

// --------------------
// Earth Atmosphere
// --------------------

const atmosphereGeometry =
  new THREE.SphereGeometry(
    0.76,
    64,
    64
  );

const atmosphereMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x60A5FA,
    transparent: true,
    opacity: 0.55,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

const atmosphere =
  new THREE.Mesh(
    atmosphereGeometry,
    atmosphereMaterial
  );

earth.add(atmosphere);

// ====================
// Mars
// ====================

const marsOrbit =
  new THREE.Group();

scene.add(marsOrbit);

const marsGeometry =
  new THREE.SphereGeometry(
    0.45,
    64,
    64
  );

const marsMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xe85d3f,
    roughness: 0.9,
    metalness: 0.0,
    emissive: 0x4a1208,
    emissiveIntensity: 0.35
  });

const mars =
  new THREE.Mesh(
    marsGeometry,
    marsMaterial
  );

mars.position.x = 7;

marsOrbit.add(mars);

/// ====================
// Jupiter
// ====================

const jupiterOrbit =
  new THREE.Group();

scene.add(jupiterOrbit);

const jupiterGeometry =
  new THREE.SphereGeometry(
    1.1,
    64,
    64
  );

// Jupiter texture
const jupiterCanvas =
  document.createElement('canvas');

jupiterCanvas.width = 512;
jupiterCanvas.height = 256;

const jupiterContext =
  jupiterCanvas.getContext('2d');

// Base
jupiterContext.fillStyle = '#d9a66f';

jupiterContext.fillRect(
  0,
  0,
  512,
  256
);

// Jupiter bands
const bands = [
  ['#f3d2a2', 0, 35],
  ['#b9784f', 35, 28],
  ['#e8bd88', 63, 40],
  ['#c9875c', 103, 25],
  ['#f0cfa0', 128, 45],
  ['#b66d48', 173, 30],
  ['#e5b47d', 203, 38],
  ['#c27b52', 241, 15]
];

bands.forEach(
  ([color, y, height]) => {

    jupiterContext.fillStyle =
      color;

    jupiterContext.fillRect(
      0,
      y,
      512,
      height
    );
  }
);

// Great Red Spot
jupiterContext.fillStyle =
  '#b84d35';

jupiterContext.beginPath();

jupiterContext.ellipse(
  370,
  170,
  45,
  20,
  0,
  0,
  Math.PI * 2
);

jupiterContext.fill();

const jupiterTexture =
  new THREE.CanvasTexture(
    jupiterCanvas
  );

const jupiterMaterial =
  new THREE.MeshStandardMaterial({
    map: jupiterTexture,
    roughness: 0.85,
    metalness: 0.0
  });

const jupiter =
  new THREE.Mesh(
    jupiterGeometry,
    jupiterMaterial
  );

jupiter.position.x = 9;

jupiterOrbit.add(jupiter);
// ====================
// Interface
// ====================

// Title
const title =
  document.createElement('div');

title.className = 'title';

title.innerHTML = `
  <h1>🌌 Universe Explorer</h1>
  <p>Interactive 3D Cosmic Visualization</p>
`;

document.body.appendChild(title);

// ====================
// Statistics
// ====================

const stats =
  document.createElement('div');

stats.className = 'stats';

stats.innerHTML = `
  <span>⭐ 10,000 Stars</span>
  <span>🌌 30,000 Galaxy Particles</span>
`;

document.body.appendChild(stats);

// ====================
// Controls Panel
// ====================

const controlsPanel =
  document.createElement('div');

controlsPanel.className =
  'controls-panel';

controlsPanel.innerHTML = `
  <button id="reset-view">
    Reset View
  </button>

  <p>🖱 Drag to rotate</p>
  <p>🔍 Scroll to zoom</p>
`;

document.body.appendChild(
  controlsPanel
);

// ====================
// Information Panel
// ====================

const infoPanel =
  document.createElement('div');

infoPanel.className =
  'info-panel';

infoPanel.innerHTML = `
  <h2>Select an object</h2>
  <p>Click a celestial object to explore it.</p>
`;

document.body.appendChild(
  infoPanel
);

// ====================
// Reset View
// ====================

const resetButton =
  document.getElementById(
    'reset-view'
  );

resetButton.addEventListener(
  'click',
  (event) => {

    event.stopPropagation();

    // Stop camera focus
    isCameraFocusing = false;

    cameraTargetPosition = null;
    cameraLookAtTarget = null;

    // Reset camera
    camera.position.copy(
      initialCameraPosition
    );

    controls.target.copy(
      initialTarget
    );

    controls.update();

    // Remove selected ring
    if (selectedRing) {

      selectedRing.parent?.remove(
        selectedRing
      );

      selectedRing.geometry.dispose();

      selectedRing.material.dispose();

      selectedRing = null;
    }

    // Reset information panel
    infoPanel.innerHTML = `
      <h2>Select an object</h2>
      <p>Click a celestial object to explore it.</p>
    `;

    // Clear search
    searchInput.value = '';

    searchResults.innerHTML = '';
  }
);

// ====================
// Object Selection
// ====================

const raycaster =
  new THREE.Raycaster();

const mouse =
  new THREE.Vector2();

window.addEventListener(
  'click',
  (event) => {

    // Ignore UI clicks
    if (
      event.target.closest(
        '.search-container'
      ) ||
      event.target.closest(
        '.controls-panel'
      ) ||
      event.target.closest(
        '.info-panel'
      )
    ) {
      return;
    }

    mouse.x =
      (event.clientX /
        window.innerWidth) *
      2 - 1;

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
      2 + 1;

    raycaster.setFromCamera(
      mouse,
      camera
    );

    const intersects =
      raycaster.intersectObjects(
        celestialGroup.children
      );

    if (
      intersects.length > 0
    ) {

      const selectedObject =
        intersects[0].object;

      const data =
        selectedObject.userData;

      infoPanel.innerHTML = `
        <h2>${data.name}</h2>

        <p>
          <strong>Type:</strong>
          ${data.type}
        </p>

        <p>
          <strong>Distance:</strong>
          ${data.distance}
        </p>

        <p>
          <strong>Redshift:</strong>
          ${data.redshift}
        </p>

        <p>
          <strong>Magnitude:</strong>
          ${data.magnitude}
        </p>
      `;

      highlightObject(
        selectedObject
      );

      focusOnObject(
        selectedObject
      );
    }
  }
);

// ====================
// Search
// ====================

const searchContainer =
  document.createElement('div');

searchContainer.className =
  'search-container';

searchContainer.innerHTML = `
  <input
    type="text"
    id="search-input"
    placeholder="Search celestial object..."
  />

  <div id="search-results"></div>
`;

document.body.appendChild(
  searchContainer
);

const searchInput =
  document.getElementById(
    'search-input'
  );

const searchResults =
  document.getElementById(
    'search-results'
  );

// ====================
// Search Input
// ====================

searchInput.addEventListener(
  'input',
  () => {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    searchResults.innerHTML = '';

    if (query === '') {
      return;
    }

    const matches =
      celestialObjects.filter(
        (object) =>
          object.name
            .toLowerCase()
            .includes(query)
      );

    if (
      matches.length === 0
    ) {

      searchResults.innerHTML = `
        <div class="search-result">
          <strong>
            No object found
          </strong>

          <span>
            Try another name
          </span>
        </div>
      `;

      return;
    }

    matches.forEach(
      (object) => {

        const result =
          document.createElement(
            'div'
          );

        result.className =
          'search-result';

        result.innerHTML = `
          <strong>
            ${object.name}
          </strong>

          <span>
            ${object.type}
          </span>
        `;

        result.addEventListener(
          'click',
          (event) => {

            event.stopPropagation();

            const selectedObject =
              celestialGroup.children.find(
                (child) =>
                  child.userData.id ===
                  object.id
              );

            if (
              selectedObject
            ) {

              infoPanel.innerHTML = `
                <h2>
                  ${object.name}
                </h2>

                <p>
                  <strong>Type:</strong>
                  ${object.type}
                </p>

                <p>
                  <strong>Distance:</strong>
                  ${object.distance}
                </p>

                <p>
                  <strong>Redshift:</strong>
                  ${object.redshift}
                </p>

                <p>
                  <strong>Magnitude:</strong>
                  ${object.magnitude}
                </p>
              `;

              highlightObject(
                selectedObject
              );

              focusOnObject(
                selectedObject
              );
            }

            searchResults.innerHTML =
              '';

            searchInput.value =
              object.name;
          }
        );

        searchResults.appendChild(
          result
        );
      }
    );
  }
);

// ====================
// Animation
// ====================

function animate() {

  requestAnimationFrame(
    animate
  );

  // Planets around Sun
  earthOrbit.rotation.y +=
    0.01;

  marsOrbit.rotation.y +=
    0.007;

  jupiterOrbit.rotation.y +=
    0.005;

  // Planet rotation
  earth.rotation.y +=
    0.01;

  mars.rotation.y +=
    0.09;

  jupiter.rotation.y +=
    0.06;

  // Galaxy rotation
  galaxy.rotation.y +=
    0.0005;


  // Rotate highlight ring
  if (selectedRing) {
    selectedRing.rotation.z +=
      0.03;
  }

  // Camera focus animation
  if (
    isCameraFocusing &&
    cameraTargetPosition
  ) {

    camera.position.lerp(
      cameraTargetPosition,
      0.05
    );

    if (cameraLookAtTarget) {

      controls.target.lerp(
        cameraLookAtTarget,
        0.05
      );
    }

    if (
      camera.position.distanceTo(
        cameraTargetPosition
      ) < 0.05
    ) {

      camera.position.copy(
        cameraTargetPosition
      );

      controls.target.copy(
        cameraLookAtTarget
      );

      isCameraFocusing = false;

      cameraTargetPosition = null;
      cameraLookAtTarget = null;
    }
  }

  // ====================
  // Update Object Labels
  // ====================

  objectLabels.forEach(
    (labelData) => {

      const position =
        new THREE.Vector3();

      labelData.object.getWorldPosition(
        position
      );

      // Label above object
      position.y += 0.5;

      position.project(camera);

      const x =
        (position.x * 0.5 + 0.5) *
        window.innerWidth;

      const y =
        (-position.y * 0.5 + 0.5) *
        window.innerHeight;

      const isVisible =
        position.z > -1 &&
        position.z < 1 &&
        Math.abs(position.x) < 1 &&
        Math.abs(position.y) < 1;

      if (isVisible) {

        labelData.element.style.display =
          'block';

        labelData.element.style.left =
          `${x}px`;

        labelData.element.style.top =
          `${y}px`;

      } else {

        labelData.element.style.display =
          'none';
      }
    }
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();

// ====================
// Responsive
// ====================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);