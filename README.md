<div align="center">

🌌 Universe Explorer 3D

Interactive 3D Cosmic Visualization

Explore a stylized universe with Three.js, featuring stars, galaxy particles, planets, celestial objects, search, interactive labels, and camera controls.

<br>

<img src="./screenshot.png" alt="Universe Explorer 3D Preview" width="900">

<br><br>






</div>

✨ Overview

Universe Explorer 3D is an interactive browser-based cosmic visualization built with Three.js and Vite.

The project combines a 3D star field, a procedural galaxy particle system, a stylized solar system, and interactive celestial-object data into one visual experience.

The goal is to make exploring astronomical concepts more visual, interactive, and engaging rather than presenting them as static information.

🚀 Key Features

🌌 Cosmic Visualization

⭐ 10,000 background stars

🌀 30,000 procedural galaxy particles

🎨 Custom GLSL vertex and fragment shaders

🌠 Animated galaxy rotation

☀️ Solar System

☀️ Glowing Sun

🌍 Bright stylized Earth with oceans, land, clouds, and atmosphere

🔴 Improved Mars appearance

🪐 Textured Jupiter with atmospheric bands and a Great Red Spot

🔄 Animated planetary orbits and self-rotation

🔭 Celestial Object Explorer

🖱️ Click celestial objects to inspect them

🏷️ Dynamic object labels

📊 Information panel

🔎 Search celestial objects by name

📍 Displays type, distance, redshift, and magnitude

🎮 3D Controls

Drag to rotate the scene

Scroll to zoom

Interactive camera controls

Reset-view controls

🛠️ Tech Stack

Technology

Purpose

Three.js

3D rendering and scene management

JavaScript (ES Modules)

Application logic

Vite

Development server and build tooling

HTML5

Application structure

CSS3

UI and glassmorphism styling

GLSL

Custom galaxy particle shaders

📸 Preview

<div align="center">

<img src="./screenshot.png" alt="Universe Explorer 3D" width="850">

</div>

🔎 Celestial Objects

The current dataset includes sample objects such as:

🌌 Andromeda Galaxy

🌫️ Orion Nebula

🌌 Sombrero Galaxy

🌌 Whirlpool Galaxy

🌌 Triangulum Galaxy

Selecting an object opens its information panel with astronomical data such as:

Object type

Distance

Redshift

Magnitude

📂 Project Structure

universe-explorer-3d/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── data/
│   │   └── celestialObjects.js
│   ├── shaders/
│   │   ├── star.vert
│   │   └── star.frag
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── package-lock.json
├── screenshot.png
└── README.md

🚀 Getting Started

Prerequisites

Make sure Node.js and npm are installed.

1. Install dependencies

npm install

2. Start the development server

npm run dev

3. Open the application

Open the local URL shown by Vite in your browser.

Usually it will be:

http://localhost:5173

4. Build for production

npm run build

🎮 Controls

Input

Action

🖱️ Drag

Rotate the 3D scene

🖱️ Scroll

Zoom in / out

🖱️ Click object

Inspect celestial object

🔎 Search

Find an object by name

🔄 Reset View

Return to the default camera view

🧠 How It Works

User
 │
 ├── Search celestial object
 │          │
 │          ▼
 │    Match dataset
 │          │
 │          ▼
 │    Select object
 │          │
 │          ▼
 │    Show information
 │
 └── Interact with 3D scene
            │
            ▼
      Three.js Camera
            │
            ▼
     Cosmic Visualization
            │
      ┌─────┴─────┐
      ▼           ▼
 Star Field    Galaxy Particles
                    │
                    ▼
              GLSL Shaders

🌟 Project Highlights

Real-time 3D rendering in the browser

Procedural particle-based galaxy

Custom shader-based rendering

Interactive astronomical data

Searchable celestial objects

Animated planetary system

Responsive glass-style interface

🔮 Future Improvements

Planned ideas for future versions:

🔭 Better astronomical textures

🌍 More realistic planetary materials

🪐 Additional planets and moons

✨ Improved object highlighting

🎯 Smooth camera focus on selected objects

📈 More astronomical data visualizations

🌌 More galaxy types

📱 Further mobile optimization

🚀 Production deployment

📌 Project Status

Active development 🚧

The core 3D visualization and interactive exploration features are working. More visual effects, astronomical objects, and interaction features can be added as the project evolves.

<div align="center">

🌌 Explore. Discover. Visualize.

Built with ❤️ using Three.js

</div>