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

// ====================
// Camera Focus Animation
// ====================

let cameraTargetPosition = null;
let cameraLookAtTarget = null;
let selectedRing = null;

function highlightObject(object) {

  // Remove previous highlight
  if (selectedRing) {
    scene.remove(selectedRing);
    selectedRing.geometry.dispose();
    selectedRing.material.dispose();
  }

  const ringGeometry =
    new THREE.RingGeometry(0.35, 0.45, 32);

  const ringMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x66ccff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });

  selectedRing =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

  selectedRing.position.copy(
    object.position
  );

  selectedRing.rotation.x =
    Math.PI / 2;

  scene.add(selectedRing);
}

function focusOnObject(object) {

  const worldPosition =
    new THREE.Vector3();

  object.getWorldPosition(
    worldPosition
  );

  cameraTargetPosition =
    worldPosition.clone().add(
      new THREE.Vector3(3, 2, 5)
    );

  cameraLookAtTarget =
    worldPosition.clone();
}

controls.enableDamping = true;
controls.dampingFactor = 0.05;


// Save initial camera position
const initialCameraPosition = camera.position.clone();
const initialTarget = controls.target.clone();


// ====================
// Star Field
// ====================

const starCount = 10000;

const starPositions = new Float32Array(
  starCount * 3
);

for (let i = 0; i < starCount * 3; i += 3) {

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
// Sun
// ====================

const sunGeometry =
  new THREE.SphereGeometry(
    2,
    32,
    32
  );

const sunMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffcc33
  });

const sun =
  new THREE.Mesh(
    sunGeometry,
    sunMaterial
  );

scene.add(sun);


// ====================
// Earth
// ====================

const earthOrbit =
  new THREE.Group();

scene.add(earthOrbit);

const earthGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    32
  );

const earthMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x3388ff
  });

const earth =
  new THREE.Mesh(
    earthGeometry,
    earthMaterial
  );

earth.position.x = 5;

earthOrbit.add(earth);


// ====================
// Mars
// ====================

const marsOrbit =
  new THREE.Group();

scene.add(marsOrbit);

const marsGeometry =
  new THREE.SphereGeometry(
    0.45,
    32,
    32
  );

const marsMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xdd5533
  });

const mars =
  new THREE.Mesh(
    marsGeometry,
    marsMaterial
  );

mars.position.x = 7;

marsOrbit.add(mars);


// ====================
// Jupiter
// ====================

const jupiterOrbit =
  new THREE.Group();

scene.add(jupiterOrbit);

const jupiterGeometry =
  new THREE.SphereGeometry(
    1.1,
    32,
    32
  );

const jupiterMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xddaa77
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


// --------------------
// Title
// --------------------

const title =
  document.createElement('div');

title.className = 'title';

title.innerHTML = `
  <h1>🌌 Universe Explorer</h1>
  <p>Interactive 3D Cosmic Visualization</p>
`;

document.body.appendChild(title);


// --------------------
// Statistics
// --------------------

const stats =
  document.createElement('div');

stats.className = 'stats';

stats.innerHTML = `
  <span>⭐ 10,000 Stars</span>
  <span>🌌 30,000 Galaxy Particles</span>
`;

document.body.appendChild(stats);


// --------------------
// Controls Panel
// --------------------

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


// --------------------
// Information Panel
// --------------------

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

    camera.position.copy(
      initialCameraPosition
    );

    controls.target.copy(
      initialTarget
    );

    controls.update();
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

    mouse.x =
      (event.clientX /
        window.innerWidth) *
        2 -
      1;

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
        2 +
      1;

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


// --------------------
// Search Input
// --------------------

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


    // No results

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


    // Show results

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

              selectedObject.scale.set(
                1.5,
                1.5,
                1.5
              );

              focusOnObject(selectedObject);

              highlightObject(selectedObject);
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
    0.004;


  // Planet rotation

  earth.rotation.y +=
    0.02;

  mars.rotation.y +=
    0.015;

  jupiter.rotation.y +=
    0.01;


  // Galaxy rotation

  galaxy.rotation.y +=
    0.0005;

  if (selectedRing) {
  selectedRing.rotation.z += 0.02;
}


  if (cameraTargetPosition) {

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
}

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