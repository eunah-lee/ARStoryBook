var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var mesh1;

const myWidth = 960;
const myHeight = 540;

initialize();
animate();
position();

function initialize()
{
  // array of functions for the rendering loop
  var onRenderFcts = [];
  // init scene and camera
	scene = new THREE.Scene();
	// Initialize a basic camera
  // Create a camera
	camera = new THREE.Camera();
	scene.add(camera);
  
  let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
  
  //init renderer
	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
  
    // style of ar layer
    renderer.setClearColor(new THREE.Color('white'), 0);//colour, transparancy
    renderer.setSize(myWidth, myHeight);
    renderer.domElement.style.backgroundImage = "url('https://cdn.glitch.com/701faa12-7f61-4cbe-87c5-c39edc4ae835%2Fscene1-background.png?v=1589054145960')";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "35px";
    renderer.domElement.style.left = "50%";
    renderer.domElement.style.margin = '0 0 0 -480px'; //centres the screen
    //renderer.domElement.style.border = "2px, red";
    document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
  

	
	// handle arToolkitSource

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
    // resolution of at which we initialize in the source image
    sourceWidth: myWidth,
    sourceHeight: myHeight,
    // resolution displayed for the source
    displayWidth: myWidth/3,
    displayHeight: myHeight/3,
    });

	// function onResize()
	// {
	// 	arToolkitSource.onResize()	
	// 	arToolkitSource.copySizeTo(renderer.domElement)	
	// 	if ( arToolkitContext.arController !== null )
	// 	{
	// 		arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
	// 	}	
	// }

	arToolkitSource.init(function onReady(){
		//onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		//onResize()
	});
	
  
  
	// initialize arToolkitContext

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// initialize it
	arToolkitContext.init( function onCompleted(){
    // copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});
    // update artoolkit on every frame
    onRenderFcts.push(function() {
      if (arToolkitSource.ready === false) return;
      arToolkitContext.update(arToolkitSource.domElement);
    });

  
  
//marker and graphic

	// build markerControls
	markerRoot1 = new THREE.Group();
  markerRoot1.name = "marker1";
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})

// 	let geometry1 = new THREE.PlaneBufferGeometry(2,2, 1,1); 
//   //draw a plan ontop of the marker(width, height, width segments, height segments)

//   //add video as texture to the plane
// 	let video = document.getElementById( 'video' );
// 	let texture = new THREE.VideoTexture( video );
// 	texture.minFilter = THREE.LinearFilter;
// 	texture.magFilter = THREE.LinearFilter;
// 	texture.format = THREE.RGBFormat;
// 	let material1 = new THREE.MeshBasicMaterial( { map: texture } );
	
// 	mesh1 = new THREE.Mesh( geometry1, material1 );
// 	mesh1.rotation.x = -Math.PI/2;
	
// 	markerRoot1.add( mesh1 );
  
  let geometry1 = new THREE.PlaneGeometry(2, 2, 2);
	
  //let image = document.getElementById('starfishOnBoat');
	let loader = new THREE.TextureLoader();
	let texture = loader.load( '/markers/cube.png', render );
	let material1 = new THREE.MeshBasicMaterial( { map: texture } );
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = 1;
  mesh1.rotation.x = -Math.PI/2;
	
	markerRoot1.add( mesh1 );
  
}


function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}


function render()
{
	renderer.render( scene, camera );
  //console.log(markerRoot1.position);
    if (markerRoot1.position.x > 1){
    console.log("reached the island");
    console.log(markerRoot1.position);
    }
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
