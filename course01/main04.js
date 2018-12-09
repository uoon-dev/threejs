const WIDTH = 800;
const HEIGHT = 800;
const xWall = WIDTH / 15;
const yWall = HEIGHT / 17;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;
const RADIUS = 1;

let render, camera, scene, controls;

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

  controls = new THREE.OrbitControls(camera);
  // renderer.setClearColor('#444');
  document.body.appendChild(renderer.domElement);

  // draw Items
  drawPlane();
  drawBall();
  drawSpheres();
  drawBar();
  drawGrid();
  // drawArrows();
  setListeners();
  camera.position.y = yWall;

  update();
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
  ball.position.y = -400;
  scene.add(ball);
};

const drawPlane = () => {
  const planeGeometry = new THREE.PlaneGeometry(xWall * 2, yWall * 2, 32);
  const planeTexture = new THREE.TextureLoader().load("./grass.jpg");
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: planeTexture,
    side: THREE.DoubleSize
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -402;
  //plane.rotateX(Math.PI / 2.)
  plane.rotateX(-Math.PI / 2.)
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
  bar.rotateX(-Math.PI / 2.)
  bar.position.z = yWall - 5;
  bar.position.y = -400;
};

const drawGrid = () => {
  const size = 10000;
  const divisions = 1000;

  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.position.y = -800;
  scene.add(gridHelper);
}

const drawArrows = () => {
  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

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
  ball.position.z += yMove / 2;
  if (ball.position.x >= xWall - RADIUS || ball.position.x <= -xWall + RADIUS) {
    xMove = -1 * xMove;
  }
  if (ball.position.z >= yWall - RADIUS || ball.position.z <= -yWall + RADIUS) {
    yMove = -1 * yMove;
  }
  if (
    ball.position.z > bar.position.z - 2 &&
    ball.position.x + 10 >= bar.position.x &&
    ball.position.x <= bar.position.x + 10
  ) {
    xMove = xMove * 1.2;
    yMove = -1.2 * yMove;
  }
  if (ball.position.z > bar.position.z) {
    ball.position.x = 0;
    ball.position.z = 0;
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

let rightKeySpeed = 1;
let leftKeySpeed = 1;

const onKeyDown = (e) => {
  console.log('keydown', e);

  switch (e.keyCode) {
    // right arrow key 
    case 39:
      changeBarPositionX(bar.position.x + 3 * rightKeySpeed);
      rightKeySpeed += 1;
      leftKeySpeed = 1;
      break;
    // left arrow key
    case 37:
      changeBarPositionX(bar.position.x - 3 * leftKeySpeed);
      leftKeySpeed += 1;
      rightKeySpeed = 1;
      break;

    case 67:
      changeCameraPosition();
      break;

    case 82:
      resetCameraPosition();
      break;
  }
}
const onKeyUp = (e) => {
  // console.log('keyup', e);
  rightKeySpeed = 1;
  leftKeySpeed = 1;
}

const changeBarPositionX = (x) => {
  var targetPos = bar.position.clone();
  targetPos.x = x;
  new TWEEN.Tween(bar.position) // Create a new tween that modifies 'coords'.
    .to(targetPos, 100) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function () { // Called after tween.js updates 'coords'.
      // Move 'box' to the position described by 'coords' with a CSS translation.
      //box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
      console.log(targetPos);
    })
    .start(); // Start the tween immediately.
}
const changeCameraPosition = () => {
  var targetPos = camera.position.clone();
  targetPos.z += 300;
  targetPos.y -= 300;
  new TWEEN.Tween(camera.position) // Create a new tween that modifies 'coords'.
    .to(targetPos, 3000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function () { // Called after tween.js updates 'coords'.
      // Move 'box' to the position described by 'coords' with a CSS translation.
      //box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
      //camera.lookAt(plane.position);
    })
    .start(); // Start the tween immediately.
}
const resetCameraPosition = () => {
  var targetPos = new THREE.Vector3();
  new TWEEN.Tween(camera.position) // Create a new tween that modifies 'coords'.
    .to(targetPos, 3000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function () { // Called after tween.js updates 'coords'.
      // Move 'box' to the position described by 'coords' with a CSS translation.
      //box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
      //camera.lookAt(plane.position);
    })
    .start(); // Start the tween immediately.
}

const update = () => {
  if (!gameover) {
    updateBall();
  }
  updateSpheres();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
  TWEEN.update();
  controls.target = plane.position;
  controls.update();
};

const setListeners = () => {
  document.querySelector("canvas").addEventListener("mousemove", onMouseMove);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
}

window.onload = () => {
  init();
};
