const WIDTH = 800;
const HEIGHT = 800;
const xWall = WIDTH / 15;
const yWall = HEIGHT / 17;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;
const RADIUS = 1;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
const camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT, NEAR, FAR);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 100;
pointLight.position.y = 100;
pointLight.position.z = 30;

let xMove = 0.8;
let yMove = 0.8;
let geometry;
let geometry2;
let material;
let material2;
let ball;
let line;
let point;
let spheres = [];
let planeGeometry;
let planeTexture;
let planeMaterial;
let plane;

const init = () => {
  scene.add(pointLight);
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
};

const drawLine = () => {
  material2 = new THREE.LineBasicMaterial({
    color: 0xff3030
  });
  geometry2 = new THREE.SphereGeometry(0.2, 10, 10);

  for (let i = 0; i < 30; i++) {
    spheres.push(new THREE.Mesh(geometry2, material2));
  }
  //line = new THREE.Mesh(geometry2, material2);
  //scene.add(line);
};

const initOctahedron = () => {
  geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
  texture = new THREE.TextureLoader().load("./ball.jpg");
  material = new THREE.MeshBasicMaterial({ map: texture });
  ball = new THREE.Mesh(geometry, material);

  scene.add(ball);
  ball.position.z = -400;

  planeGeometry = new THREE.PlaneGeometry(xWall * 2, yWall * 2, 32);
  planeTexture = new THREE.TextureLoader().load("./grass.jpg");
  planeMaterial = new THREE.MeshBasicMaterial({
    // map: planeTexture,
    color: 0x444,
    side: THREE.DoubleSize
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -400;
  scene.add(plane);
  drawLine();
  update();
};

const updateLine = () => {
  var sphere = spheres.shift();
  scene.remove(sphere);
  spheres.push(sphere);
  sphere.position.copy(ball.position);
  scene.add(sphere);
};

const update = () => {
  const speed = Math.random() / 20;
  ball.rotation.x += speed;
  ball.rotation.y += speed;
  ball.rotation.z += speed;
  ball.position.x += xMove / 2;
  ball.position.y += yMove / 2;
  // octahedron.position.z += yMove / 2;

  if (ball.position.x >= xWall - RADIUS || ball.position.x <= -xWall + RADIUS) {
    xMove = -1 * xMove;
    //drawLine();
  }
  if (ball.position.y >= yWall - RADIUS || ball.position.y <= -yWall + RADIUS) {
    yMove = -1 * yMove;
    //drawLine();
  }
  updateLine();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

window.onload = () => {
  init();
  drawLine();
  initOctahedron();
};
