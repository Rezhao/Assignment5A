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
	const fov = 80; //field of view (in degrees)
	const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 12, 30 );

	//adding orbit controls
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	//creating scene and setting background color
	const scene = new THREE.Scene();
	// scene.background = new THREE.Color( 'black' );

	{

		const near = 3;
		const far = 90;
		const color = 0x99ff9b;
		scene.fog = new THREE.Fog( color, near, far );
		scene.background = new THREE.Color( color );

	}

	//adding platform
	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( './assets/grass.jpg' );
		// const texture = loader.load( './public/assets/grass.jpg');
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
		// './public/assets/helvetiker_regular.typeface.json'
		loader.load('./assets/helvetiker_regular.typeface.json' , (font) => {
			const text = 'Welcome!';  

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
			mesh.position.set(0, 2, 18);
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
	const sphereShape = new THREE.SphereGeometry( 2, 32, 16 ); //radius, widthSegments, heightSegments

	//making shapes
	// const shapes = [
	// 	makeInstance( geometry, 0x4ef5e1, 8, 8, 0 ),
	// 	makeInstance( triRot, 0xd0a1ff, 9, 11, 0),
	// 	makeInstance( sphereShape, 0xf2e422, 7, 0, 0 ),
	// ];

	//creating textured cube
	//loading texture
	const loader = new THREE.TextureLoader();

	// './public/assets/candy.avif'
	const texture = loader.load( './assets/candy.avif' );
	texture.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );

	//setting textured cube details
	const cube = new THREE.Mesh( geometry, material );
	cube.position.x = 6;
	cube.position.y = 10;
	cube.scale.set(1.5, 1.5, 1.5);
	// scene.add( cube );
	// shapes.push(cube);

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
  heartMesh.position.set(-4, -6, 18);
  // mesh.position.set(0, 2, 18);
	scene.add( heartMesh );

  const heartMesh2 = new THREE.Mesh( heart, heartMat );
	heartMesh2.scale.set(0.2, -0.2, 0.2);
  heartMesh2.position.set(19, -6, 18);
  // mesh.position.set(0, 2, 18);
	scene.add( heartMesh2 );

	//creating triangle 
	const triShape = new THREE.TetrahedronGeometry(3);
	const triMat = new THREE.MeshPhongMaterial( { color: 0x66a9fa } );
	const triangle = new THREE.Mesh( triShape, triMat );
	triangle.position.x = -7;
	triangle.position.y = 0;
	// scene.add( triangle );


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

  drawRoundTree(-15, -15);
  drawRoundTree(-12, -15);
  drawRoundTree(-16, -13);

  drawRoundTree(-10, -12);
  drawPineTree(-12, -8);
  drawPineTree(-17, -3);
  drawRoundTree(-12, -10);
  drawRoundTree(-6, -16);

  drawPineTree(-3, -13);
  drawPineTree(-7, -11);

  drawPineTree(-15, -5);
  drawPineTree(-17, -3);
  drawPineTree(-12, -3);

  drawPineTree(18, -15);
  drawPineTree(16, -18);
  drawPineTree(10, -10);

  drawPineTree(5, -15);
  drawPineTree(7, -17);
  drawRoundTree(8, -13);
  drawRoundTree(10, -13);

  drawRoundTree(15, -10);
  drawPineTree(17, -9);
  drawPineTree(14, -5);
  drawRoundTree(15, -1);
  drawRoundTree(10, -1);

  drawPineTree(-12, 5);
  drawPineTree(-17, 3);
  drawRoundTree(-8, -2);
  drawPineTree(-17, 8);

  drawRoundTree(13, 10);
  drawPineTree(17, 9);
  drawPineTree(14, 5);

  drawRoundTree(11, 14);
  drawPineTree(17, 15);

  drawRoundTree(-11, 12);
  drawPineTree(-17, 15);

  function drawRainbow() {
	//rainbow arc
	const rainbowColors = [0xff0835, 0xfc903d, 0xfff53b, 0x6dfc65, 0x65c0fc, 0xa274f7];
	const innerRadius = 9;
	const outerRadius = 10;
	for ( var i = 0; i < 6; i++) {
		const arc = new THREE.RingGeometry( innerRadius - i, outerRadius - i, 25, 3, 0, Math.PI );
		const material = new THREE.MeshPhongMaterial( { color: rainbowColors[i], side: THREE.DoubleSide } );
		const mesh = new THREE.Mesh( arc, material ); 
		scene.add( mesh );
		mesh.position.set(0, 10, -0.01);
	}

	//clouds
	for (var i = 0; i < 4; i++) {
		const geometry = new THREE.CircleGeometry( 2, 32 ); 
		const material = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide  } ); 
		const circle1 = new THREE.Mesh( geometry, material ); 
		const circle2 = new THREE.Mesh( geometry, material ); 
		const circle3 = new THREE.Mesh( geometry, material ); 
		const circle4 = new THREE.Mesh( geometry, material ); 
		scene.add( circle1 );
		circle1.position.set(-4-i*2, 10, 0);
		scene.add( circle2 );
		circle2.position.set(4+i*2, 10, 0);
		scene.add( circle3 );
		circle3.position.set(-4-i*2, 10, -0.02);
		scene.add( circle4 );
		circle4.position.set(4+i*2, 10, -0.02);
	}
  }
  drawRainbow();

  function drawBench() {
	//creating textured cube
	//loading texture
	const loader = new THREE.TextureLoader();

	// './public/assets/candy.avif'
	const texture = loader.load( './assets/wood.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );

	//setting textured cube details
	const bench = new THREE.Mesh( geometry, material );
	bench.position.set(0, 1, 8);
	// bench.rotation.y = 0.5;
	bench.scale.set(5, 0.5, 1.5);
	scene.add( bench );

	const leg1 = new THREE.Mesh( geometry, material );
	leg1.position.set(-2.75, 0.65, 8);
	// leg1.rotation.y = 0.5;
	leg1.scale.set(0.5, 1.25, 1.5);
	scene.add( leg1 );

	const leg2 = new THREE.Mesh( geometry, material );
	leg2.position.set(2.75, 0.65, 8);
	// leg2.rotation.y = 0.5;
	leg2.scale.set(0.5, 1.25, 1.5);
	scene.add( leg2 );
  }

  drawBench();


  //creating cube
	function makeSparkle( geometry, color, x, y, z, scale) {

		const material = new THREE.MeshPhongMaterial( { color } ); //must use to be affected by light

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.set(x, y, z);
    cube.scale.set(scale[0], scale[1], scale[2]);

		return cube;

	}

  //making shapes
	const sparkleSpin = [];
  function drawSparkles() {
    const heart = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const cube = new THREE.BoxGeometry(1, 1, 1); //boxWidth, boxHeight, boxDepth
    const sphereShape = new THREE.SphereGeometry( 0.5, 32, 16 ); //radius, widthSegments, heightSegments
    const triRot = new THREE.TetrahedronGeometry(2); //radius
    const donut = new THREE.TorusGeometry(2, 1, 20, 50); //radius, tubeRadius, radialSegments, tubularSegments
    const dodec = new THREE.DodecahedronGeometry(2);

    const sparkles = [heart, cube, sphereShape, triRot, donut, dodec];
    const scale = [[0.1, -0.1, 0.1], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]];

    const colors = [0xf22275, 0xffa64d, 0xfcee4c, 0x5dfc5d, 0x75a3ff, 0xa66bff];

    for (var i = 0; i < 50; i++) {
      var n = Math.floor(Math.random() * 6);
      var c = Math.floor(Math.random() * 6);
      var x = Math.floor(Math.random() * 36) - 18;
      var y = Math.floor(Math.random() * 19) + 2;
      var z = Math.floor(Math.random() * 36) - 18;
      const temp = makeSparkle(sparkles[n], colors[c], x, y, z, scale[n]);
      sparkleSpin.push(temp);
    }
  }
  drawSparkles();

	
	//adding skybox
	{
		const loader = new THREE.TextureLoader();
		// './public/assets/sky10.jpeg' './assets/sky10.jpeg'
		const texture = loader.load(
			'./assets/sky10.jpeg' ,
			() => {

				texture.mapping = THREE.EquirectangularReflectionMapping;
				texture.colorSpace = THREE.SRGBColorSpace;
				scene.background = texture;

			} );
	}

	//loading 3d model with texture/materials
	{
		const mtlLoader = new MTLLoader();
		// './public/assets/waterfall.mtl' './assets/waterfall.mtl'
		mtlLoader.load( './assets/waterfall.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			// '/public/assets/waterfall.obj' './assets/waterfall.obj'
			objLoader.load( './assets/waterfall.obj', ( root ) => {
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
		// shapes.forEach( ( cube, ndx ) => {

		// 	const speed = 1 + ndx * .1;
		// 	const rot = time * speed;
		// 	cube.rotation.x = rot;
		// 	cube.rotation.y = rot;

		// });
    sparkleSpin.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
			const rot = time * speed;
			// cube.rotation.x = rot;
			cube.rotation.y = rot;
    });
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}

	requestAnimationFrame( render );

}

main();
