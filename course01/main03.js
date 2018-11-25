const WIDTH = 800;
const HEIGHT = 800;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;
const RADIUS = 10;
const scene = new THREE.Scene();
const renderer= new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
const camera = new THREE.PerspectiveCamera(
  FIELD_OF_VIEW, 
  ASPECT, 
  NEAR, 
  FAR
)
const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.x = 100;
pointLight.position.y = 100;
pointLight.position.z = 30;

let xMove = 0.8;
let yMove = 0.8;
let geometry;
let geometry2;
let material;
let material2;
let octahedron;
let line;
let point;


const init = () => {
  scene.add(pointLight);
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
}

const initOctahedron = () => {
  geometry = new THREE.OctahedronGeometry(RADIUS, 0);
  material = new THREE.MeshLambertMaterial({ color: 0xFF3030 });
  octahedron = new THREE.Mesh(geometry, material);
  
  scene.add(octahedron);
  octahedron.position.z = -40 * 10;
  update();
}

const drawLine = (position) => {
  // material2 = new THREE.PointsMaterial({
  //   color: 0xFF3030,
  //   size: 0.2
  // });
  material2 = new THREE.LineBasicMaterial({
    color: 0xFF3030,
    lineWidth: 100
  });
  geometry2 = new THREE.Geometry();
  if (!line) {
    geometry2.vertices.push(
      new THREE.Vector3( 
        0, 
        0, 
        0) 
    );
    geometry2.vertices.push(
      new THREE.Vector3( 
        1, 
        1, 
        0) 
    );
  } else {
    geometry2.vertices.push(
      new THREE.Vector3( 
        line.geometry.vertices[1].x, 
        line.geometry.vertices[1].y, 
        0)
    );
    geometry2.vertices.push(
      new THREE.Vector3( 
        line.geometry.vertices[1].x + 1, 
        line.geometry.vertices[1].y + 1, 
        0) 
    );
  }
  line = new THREE.Line(geometry2, material2);
  // line.geometry.vertices[0].x = position.x / 10;
  // line.geometry.vertices[0].y = position.y / 10;
  // line.geometry.vertices[1].x = position.x / 11;
  // line.geometry.vertices[1].y = position.y / 11;
  line.position.z = -2500;
  scene.add(line);
  // update();
}

const update = () => {
  const speed = Math.random() / 20;
  const xWall = WIDTH / 15;
  const yWall = HEIGHT / 17;
  octahedron.rotation.x += speed;
  octahedron.rotation.y += speed;
  octahedron.rotation.z += speed;
  octahedron.position.x += xMove / 3;
  octahedron.position.y += yMove / 3;
  octahedron.position.z += yMove / 3;

  // line.geometry.vertices[1].x += xMove * 5;
  // line.geometry.vertices[1].y += yMove * 5;
  line.geometry.vertices[1].x += xMove * 2;
  line.geometry.vertices[1].y += yMove * 2;
  line.geometry.verticesNeedUpdate = true;

  if (octahedron.position.x >= xWall ||
    octahedron.position.x <= -xWall) {
    xMove = -1 * xMove;
    drawLine();
  }
  if (octahedron.position.y >= yWall ||
    octahedron.position.y <= -yWall) {
    yMove = -1 * yMove;
    drawLine();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

window.onload = () => {
  init();
  drawLine();
  initOctahedron();
}
