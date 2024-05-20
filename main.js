import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth/1.1, window.innerHeight/1.1);

	//event listener to resize canvas based on screen size
	window.addEventListener('resize', function () {
		var width = window.innerWidth/1.1;
		var height = window.innerHeight/1.1;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	  });

	//adding perspective camera
	const fov = 50; //field of view (in degrees)
	const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 30 );

	//adding orbit controls
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	//creating scene and setting background color
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color( 'black' );

	//adding platform
	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( './public/assets/grass.jpg' );
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	//creating hemisphere light
	{

		const skyColor = 0xB1E1FF; // light blue
		const groundColor = 0x1f6640; // green
		const intensity = 2;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );
	}

	//creating directional light
	{

		const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 2 );
		light.target.position.set( 0, 0, 0 );
		scene.add( light );
		scene.add( light.target );

	}

	//creating spotlight above pond
	{
		const color = 0xFFFFFF;
		const intensity = 150;
		const distance = 5;
		const light = new THREE.SpotLight( color, intensity, distance );
		light.position.set( 0, 5, -0.25 );
		light.target.position.set( 0, 0, -0.25 );
		scene.add( light );
		scene.add( light.target );
	}

	{
		const loader = new FontLoader();

		loader.load('./public/assets/helvetiker_regular.typeface.json', (font) => {
			const text = 'Hello!';  

			const geometry = new TextGeometry(text, {
				font: font,
				size: 3,  
				depth: 2,  
				curveSegments: 12,  
				bevelEnabled: true,  
				bevelThickness: 0.15,  
				bevelSize: 0.2,  
				bevelSegments: 5,  
			});
			geometry.center();
			const material = new THREE.MeshNormalMaterial();
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.y = 12;
			scene.add(mesh);
		});
	}

	//setting box details
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	//creating cube
	function makeInstance( geometry, color, x, y, z ) {

		const material = new THREE.MeshPhongMaterial( { color } ); //must use to be affected by light

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;
    cube.position.z = z;

		return cube;

	}

	//creating triangle
	const triRot = new THREE.TetrahedronGeometry(2);
	//creating sphere
	const sphereShape = new THREE.SphereGeometry( 2, 32, 16 ); 

	//making shapes
	const shapes = [
		makeInstance( geometry, 0x4ef5e1, 8, 8, 0 ),
		makeInstance( triRot, 0xd0a1ff, 9, 11, 0),
		makeInstance( sphereShape, 0xf2e422, 7, 0, 0 ),
	];

	//creating textured cube
	//loading texture
	const loader = new THREE.TextureLoader();

	const texture = loader.load( './public/assets/candy.avif' );
	texture.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );

	//setting textured cube details
	const cube = new THREE.Mesh( geometry, material );
	cube.position.x = 6;
	cube.position.y = 10;
	cube.scale.set(1.5, 1.5, 1.5);
	scene.add( cube );
	shapes.push(cube);

	//creating heart shape
	const shape = new THREE.Shape();
	const x = -40;
	const y = -50;
	shape.moveTo(x + 2.5, y + 2.5);
	shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
	shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
	shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
	shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
	shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
	shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

	const extrudeSettings = {
		steps: 2,  
		depth: 2,  
		bevelEnabled: true,  
		bevelThickness: 1,  
		bevelSize: 1,  
		bevelSegments: 2,  
	};

	const heart = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	const heartMat = new THREE.MeshPhongMaterial( { color: 0xff9cd6 } );
	const heartMesh = new THREE.Mesh( heart, heartMat );
	heartMesh.scale.set(0.2, -0.2, 0.2);
	scene.add( heartMesh );

	//creating triangle 
	const triShape = new THREE.TetrahedronGeometry(3);
	const triMat = new THREE.MeshPhongMaterial( { color: 0x66a9fa } );
	const triangle = new THREE.Mesh( triShape, triMat );
	triangle.position.x = -7;
	triangle.position.y = 0;
	scene.add( triangle );


  //creating polyhedron
  const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  ];
  const indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
  ];
  function drawRoundTree(x, z) {
    const tree = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 2, 2 ); //radius, detail
    makeInstance(tree, 0x4d9e53, x, 5, z);
    const branch = new THREE.CylinderGeometry( 0.25, 0.25, 5, 32 ); //radiusTop, radiusBottom, height, radialSegments
    makeInstance(branch, 0x52413a, x, 2, z);
  }

  drawRoundTree(-15, -15);
  drawRoundTree(-12, -15);
  drawRoundTree(-16, -13);

  function drawPineTree(x, z) {
    const tree1 = new THREE.ConeGeometry( 1.5, 3, 32 ); //radius, height, radialSegments
    makeInstance(tree1, 0x4d9e53, x, 5.5, z);
    const tree2 = new THREE.ConeGeometry( 2, 3, 32 ); 
    makeInstance(tree2, 0x4d9e53, x, 4, z);
    const tree3 = new THREE.ConeGeometry( 2.5, 3, 32 ); 
    makeInstance(tree3, 0x4d9e53, x, 2.5, z);
    const branch = new THREE.CylinderGeometry( 0.5, 0.5, 5, 32 ); //radiusTop, radiusBottom, height, radialSegments
    makeInstance(branch, 0x52413a, x, 2, z);
  }

  drawPineTree(-15, -5);
  drawPineTree(-17, -3);
  drawPineTree(-12, -3);

  drawPineTree(5, -15);
  drawPineTree(7, -17);
  drawRoundTree(8, -13);
  drawRoundTree(10, -13);

  drawRoundTree(15, -10);
  drawPineTree(17, -9);
  drawPineTree(14, -5);
	
	//adding skybox
	{
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'./public/assets/sky10.jpeg',
			() => {

				texture.mapping = THREE.EquirectangularReflectionMapping;
				texture.colorSpace = THREE.SRGBColorSpace;
				scene.background = texture;

			} );
	}

	//loading 3d model with texture/materials
	{
		const mtlLoader = new MTLLoader();
		// mtlLoader.load( './assets/castle.mtl', ( mtl ) => {
		mtlLoader.load( './public/assets/waterfall.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( '/public/assets/waterfall.obj', ( root ) => {
				root.rotation.y = THREE.MathUtils.degToRad(-90);
				root.scale.set(6,6,6);
				root.position.set(0,2.15,0);
				scene.add( root );
			} );

		} );

	}

	//renders shape rotation
	function render( time ) {

		time *= 0.001; // convert time to seconds
		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}

	requestAnimationFrame( render );

}

main();
