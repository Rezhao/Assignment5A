import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

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
	camera.position.set( 0, 10, 20 );

	//adding orbit controls
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	//creating scene and setting background color
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

	//creating hemisphere light
	{

		const skyColor = 0xB1E1FF; // light blue
		const groundColor = 0xB97A20; // brownish orange
		const intensity = 2;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );
	}

	//creating directional light
	{

		const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

	}

	//setting box details
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	//creating cube
	function makeInstance( geometry, color, x, y ) {

		const material = new THREE.MeshPhongMaterial( { color } ); //must use to be affected by light

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;

		return cube;

	}

	//creating triangle
	const triRot = new THREE.TetrahedronGeometry(2);

	//creating sphere
	const sphereShape = new THREE.SphereGeometry( 2, 32, 16 ); 

	//making shapes
	const shapes = [
		makeInstance( geometry, 0x4ef5e1, 8, 8 ),
		makeInstance( triRot, 0xd0a1ff, 9, 11),
		makeInstance( sphereShape, 0xf2e422, 7, 0 ),
	];

	//creating textured cube
	//loading texture
	const loader = new THREE.TextureLoader();

	const texture = loader.load( 'https://github.com/Rezhao/Assignment5A/blob/master/assets/candy.avif' );
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


	//loading 3d model with texture/materials
	{
		const mtlLoader = new MTLLoader();
		mtlLoader.load( 'https://github.com/Rezhao/Assignment5A/blob/master/assets/castle.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'https://github.com/Rezhao/Assignment5A/blob/master/assets/castle.obj', ( root ) => {

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
