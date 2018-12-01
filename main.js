const WIDTH = 800;
const HEIGHT = 800;
const xWall = WIDTH / 15;
const yWall = HEIGHT / 17;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;
const RADIUS = 1;

let render, camera, scene;

let xMove = 0.8;
let yMove = 0.8;
let ball;
let line;
let spheres = [];
let plane;
let bar;
let gameover = false;

const init = () => {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT, NEAR, FAR);
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // draw Items
  drawPlane();
  drawBall();
  drawSpheres();
  drawBar();
  update();

  document.querySelector("canvas").addEventListener("mousemove", onMouseMove);
};

const drawSpheres = () => {
  const sphereMaterial = new THREE.LineBasicMaterial({
    color: 0xff3030
  });
  let sphereGeometry = new THREE.SphereGeometry(0.2, 10, 10);
  for (let i = 0; i < 30; i++) {
    spheres.push(new THREE.Mesh(sphereGeometry, sphereMaterial));
  }
};

const drawBall = () => {
  const geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
  const texture = new THREE.TextureLoader().load("./ball.jpg");
  const material = new THREE.MeshBasicMaterial({ map: texture });
  ball = new THREE.Mesh(geometry, material);
  ball.position.z = -400;
  scene.add(ball);
};

const drawPlane = () => {
  const planeGeometry = new THREE.PlaneGeometry(xWall * 2, yWall * 2, 32);
  const planeTexture = new THREE.TextureLoader().load("./grass.jpg");
  const planeMaterial = new THREE.MeshBasicMaterial({
    // map: planeTexture,
    color: 0x444,
    side: THREE.DoubleSize
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -400;
  scene.add(plane);
};

const drawBar = () => {
  const geometry = new THREE.PlaneGeometry(20, 2, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  });
  bar = new THREE.Mesh(geometry, material);
  scene.add(bar);
  bar.position.y = -yWall + 5;
  bar.position.z = -400;
};

const updateSpheres = () => {
  var sphere = spheres.shift();
  scene.remove(sphere);
  spheres.push(sphere);
  sphere.position.copy(ball.position);
  scene.add(sphere);
};

const updateBall = () => {
  const speed = Math.random() / 20;
  ball.rotation.x += speed;
  ball.rotation.y += speed;
  ball.rotation.z += speed;
  ball.position.x += xMove / 2;
  ball.position.y += yMove / 2;
  if (ball.position.x >= xWall - RADIUS || ball.position.x <= -xWall + RADIUS) {
    xMove = -1 * xMove;
  }
  if (ball.position.y >= yWall - RADIUS || ball.position.y <= -yWall + RADIUS) {
    yMove = -1 * yMove;
  }
  if (
    ball.position.y < bar.position.y + 2 &&
    ball.position.x + 10 >= bar.position.x &&
    ball.position.x <= bar.position.x + 10
  ) {
    xMove = xMove * 1.2;
    yMove = -1.2 * yMove;
  }
  if (ball.position.y < bar.position.y) {
    ball.position.x = 0;
    ball.position.y = 0;
    gameover = true;
  }
};

const onMouseMove = e => {
  const mouse = new THREE.Vector2();
  mouse.x = (e.clientX / WIDTH) * 2 - 1;
  mouse.y = -(e.clientY / HEIGHT) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length === 0) return;

  var point = intersects[0].point;
  bar.position.x = point.x;
};

const update = () => {
  if (gameover) return;
  updateBall();
  updateSpheres();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

window.onload = () => {
  init();
};
