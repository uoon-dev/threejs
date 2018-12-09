// how many field I can view by degree 
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FIELD_OF_VIEW = 20;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 100000;

let scene;
let camera;
let geometry;
let material;
let renderer;
let octahedron;
let pointLight;
let model;


window.onload = () => {
  init();
}

function update() {
  if (model) {
    controls.target = model.position;
    controls.update();
    camera.lookAt(model.position);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

const drawGrid = () => {
  const size = 10000;
  const divisions = 1000;

  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.position.y = -5;
  // gridHelper.rotateX(-Math.PI / 2.);
  scene.add(gridHelper);
}

const drawModel = () => {
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('../three.js/examples/models/obj/male02/')
    .load('male02_dds.mtl', function (materials) {
      materials.preload();
      const loader = new THREE.OBJLoader2();
      loader.setMaterials(materials);
      loader.setPath('../three.js/examples/models/obj/male02/')
      loader.load('male02.obj', (event) => {
        model = event.detail.loaderRootNode;
        model.position.z = 800;
        model.position.x = 350;
        // model.rotateY(-Math.PI / 2.);
        scene.add(model);
      }, null, null, null, false)
    });
}

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })

  camera = new THREE.PerspectiveCamera(
    FIELD_OF_VIEW,
    ASPECT,
    NEAR,
    FAR
  )

  // camera.position.z = -100;
  camera.position.y = 1000;

  controls = new THREE.OrbitControls(camera);

  pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
  pointLight.position.x = 1000;
  pointLight.position.y = 1000;
  pointLight.position.z = 30;

  scene.add(pointLight);
  ////////

  drawModel();
  drawGrid();

  // const material = new THREE.MeshLambertMaterial({ color: 0xFF3030 });

  renderer.setSize(WIDTH, HEIGHT);

  // const container = document.querySelector('body')
  document.body.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  requestAnimationFrame(update);
}
