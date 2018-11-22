// how many field I can view by degree 
const WIDTH = 1000;
const HEIGHT = 800;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 1000;

let scene;
let camera;
let geometry;
let material;
let renderer;
let octahedron;
let pointLight;


window.onload = () => {
  init();
}

let xSpeed = 1;
let ySpeed = 1;
const a = WIDTH/30.0;
const b = HEIGHT/30.0;
function update() {
  const speed = Math.random() / 20;
  octahedron.rotation.x += speed;
  octahedron.rotation.y += speed;
  octahedron.rotation.z += speed;
  octahedron.position.x += xSpeed;
  octahedron.position.y += ySpeed;
  octahedron.position.z += 3*ySpeed;

  if (octahedron.position.x >= a||
    octahedron.position.x<=-a) {
      xSpeed*=-1;
  }


  if (octahedron.position.y >= b||
    octahedron.position.y<=-b) {
      ySpeed*=-1;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })

  geometry = new THREE.OctahedronGeometry(10, 0);

  material = new THREE.MeshLambertMaterial({ color: 0xFF3030 })

  octahedron = new THREE.Mesh(geometry, material);

  scene.add(octahedron);
  octahedron.position.z = -40 * 10;
 // octahedron.position.y = -20;

  camera = new THREE.PerspectiveCamera(
    FIELD_OF_VIEW,
    ASPECT,
    NEAR,
    FAR
  )

  pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
  pointLight.position.x = 100;
  pointLight.position.y = 100;
  pointLight.position.z = 30;

  scene.add(pointLight);

  // const material = new THREE.MeshLambertMaterial({ color: 0xFF3030 });

  renderer.setSize(WIDTH, HEIGHT);

  // const container = document.querySelector('body')
  document.body.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  requestAnimationFrame(update);
}
