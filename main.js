// // 엄격하게 쓰는 것을 정의
// 'use strict';
function Element2(x,y,z,rx,ry,rz, fScale, strAddress)
{
  
  var element = document.createElement( 'div' );
  element.style.width = '100px';
  element.style.height = '100px';
  element.style.opacity = 0.5;
  element.style.background = new THREE.Color(
    55,
    100,
    255,
  ).getStyle();
  element.textContent = "test text"
  element.setAttribute('contenteditable', '');



  var iframe = document.createElement( 'iframe' );
  iframe.style.width = element.style.width;
  iframe.style.height = element.style.height;
  iframe.style.border = '0px';
  // iframe.style.opacity=0.1;
  // iframe.src = [ 'https://www.youtube.com/embed/', '5Tr2ZO-IKu0', '?rel=0' ].join( '' );
  iframe.src = strAddress;
  // iframe.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/5Tr2ZO-IKu0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  element.appendChild( iframe );
/*
<iframe width="560" height="315" src="https://www.youtube.com/embed/5Tr2ZO-IKu0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
*/



  let domObject = new THREE.CSS3DObject( element );
  
  domObject.position.set( x, y, z );
  domObject.rotation.x = rx / 180 * Math.PI;
  domObject.rotation.y = ry / 180 * Math.PI;
  domObject.rotation.z = rz / 180 * Math.PI;

  domObject.scale.x = fScale;
  domObject.scale.y = fScale;
  domObject.scale.z = fScale;
  //domObject.scale.x = Math.random() + 0.5;
  //domObject.scale.y = Math.random() + 0.5;
  cssscene.add( domObject );

  ~function() {
      var material = new THREE.MeshPhongMaterial({
          opacity	: 0.2,
          color	: new THREE.Color('black'),
          blending: THREE.NoBlending,
          side	: THREE.DoubleSide,
      });
      var geometry = new THREE.PlaneGeometry( element.style.width, element.style.height );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.copy( domObject.position );
      mesh.rotation.copy( domObject.rotation );
      //mesh.scale.copy( domObject.scale );
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      scene.add( mesh );
  }();
}

// import { CSS3DRenderer, CSS3DObject } from './libs/three/renderers/CSS3DRenderer.js';
var Element = function ( id, x, y, z, rx, ry, rz ) {
  var w = 240;//40;//480;
  var h = 180;//360;
  var div = document.createElement( 'div' );
  div.style.width = w + 'px';
  div.style.height = h + 'px';
  div.style.opacity=0.5;

  // div.style.backgroundColor = '#000';
  div.style.background = new THREE.Color(
    0,
    0,
    0,
  ).getStyle();
  // div.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  div.setAttribute('contenteditable', '')

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = w + 'px';
  iframe.style.height = h + 'px';
  iframe.style.border = '0px';
  // iframe.style.opacity=0.1;
  iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  div.appendChild( iframe );

  var object = new THREE.CSS3DObject( div );
  object.position.set( x, y, z );
  object.rotation.x = rx / 180 * Math.PI;
  object.rotation.y = ry / 180 * Math.PI;
  object.rotation.z = rz / 180 * Math.PI;
// cssscene.add(object);
  return object;

};


let camera;
let scene;
let renderer; 

let cssscene;
let cssrenderer; 



var m_nMode = 0;
var mouse = new THREE.Vector2();
var mouse_Prev = new THREE.Vector2();
function onDocumentMouseDown(event) {
  mouse.x = event.clientX;
  mouse.y = -event.clientY;

  if (m_nMode != 1)
  {

    m_nMode = 1;
    switch ( event.button ) {
      case 0:
        log2('Left');
        m_nMode = 1;
        break;
      case 1:
        log2('Wheel');
        break;
      case 2:
        log2('Right');
        
        break;
    }  
  }

  

  mouse_Prev.x = mouse.x;
  mouse_Prev.y = mouse.y;
}

function onDocumentMouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = -event.clientY;

  if ( m_nMode >= 1 )
  { 
    m_nMode = 2;
    let str = '#webgl-output';
    let selectedObj = $(str)[0].getBoundingClientRect();
    let nClicked_X = (mouse.x - selectedObj.left);
    let nClicked_Y = ((-mouse.y) - selectedObj.top);
    // 3D 를 클릭한 상태인지...
    if (
      ((nClicked_X >= 0) && (nClicked_X <= selectedObj.width)) &&
      ((nClicked_Y >= 0) && (nClicked_Y <= selectedObj.height))
    )
    {
      let fDx = (mouse.x - mouse_Prev.x) / 5;
      let fDy = (mouse.y - mouse_Prev.y) / 5;
      camera.rotation.y += fDx * Math.PI / 180;
      camera.rotation.x -= fDy * Math.PI / 180;
    }
  }

  mouse_Prev.x = mouse.x;
  mouse_Prev.y = mouse.y;
}

function onDocumentMouseUp(event) {
  m_nMode = 0;
}
function log_init()
{
  document.getElementById("txtMessage").style.display = "block";
  // print_init("txtMessage");
  // print_set_depth(1);
}
let m_nView_W, m_nView_H;
function init() {
  // for test
  if (_DEF_DEBUG != 0) log_init();
  // listen to the resize events
  window.addEventListener('resize', onResize, false);

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false); 


  
  scene = new THREE.Scene();
  m_nView_W = $('#webgl-output')[0].getBoundingClientRect().width;
  m_nView_H = $('#webgl-output')[0].getBoundingClientRect().height;
  let aspect = m_nView_W / m_nView_H;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);  

  camera.position.x = 0; 
  camera.position.y = 50;//5; 
  camera.position.z = 300;//30;
  camera.aspect = aspect;
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.updateProjectionMatrix();

  
  

  let ambienLight = new THREE.AmbientLight(0x000000);
  scene.add(ambienLight);
  var glSpotlight = new THREE.SpotLight(0x999999);
  glSpotlight.position.copy(new THREE.Vector3(0, 500, 700));    
  glSpotlight.castShadow = true;
  scene.add(glSpotlight);
  
  
  cssscene = new THREE.Scene();
  // cssscene.add(ambienLight);
  // cssscene.add(glSpotlight);


  var glLight1 = new THREE.DirectionalLight( 0x999999, 1 );
  
  glLight1.castShadow = true;
  // glLight1.position.z = 300;
  // glLight1.shadow.mapSize.width = 256;  // default
  // glLight1.shadow.mapSize.height = 256; // default
  glLight1.shadow.camera.near = 1;       // default
  glLight1.shadow.camera.far = 2000;      // default

  glLight1.position.copy(new THREE.Vector3(0, 400, 800));  
  scene.add( glLight1 );
  // cssscene.add(glLight1);


  let vecBase = new THREE.Vector3(0, -5, 0);

  let nSize_Ground = 500;
  let nSize_Grid = 60;
  let planeGeometry = new THREE.PlaneGeometry(nSize_Ground, nSize_Ground, nSize_Grid, nSize_Grid);
    
  let planeMaterial = new THREE.MeshPhongMaterial(
    {
      wireframe : false,
      color: 0x50a0a0
    }
  );
    



  // var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  // light.position.set( 0, 20, 0 );
  // scene.add( light );

  // light = new THREE.DirectionalLight( 0xffffff );
  // light.position.set( 0, 20, 10 );
  // scene.add( light );

  // ground

  // var mesh = new THREE.Mesh( 
  //   new THREE.PlaneBufferGeometry( 2000, 2000 ), 
  //   new THREE.MeshPhongMaterial( { color: 0x50a0a0, depthWrite: false } ) );
  // mesh.rotation.x = - Math.PI / 2;
  // scene.add( mesh );

  var grid = new THREE.GridHelper( 200, 40, 0x444444, 0x50a0a0 );
  grid.material.opacity = 1.0;
  grid.material.transparent = false;
  grid.position.set(0,0,200);
  scene.add( grid );





  // let objPlane = new THREE.Mesh(planeGeometry, planeMaterial);

  

  // objPlane.rotation.x = -0.5 * Math.PI;
  // objPlane.position.x = vecBase.x;
  // objPlane.position.y = vecBase.y;
  // objPlane.position.z = vecBase.z;  
  // objPlane.receiveShadow = true;
  // objPlane.castShadow = true;
  // scene.add(objPlane);


  var idleAction, walkAction, runAction;
  var idleWeight, walkWeight, runWeight;
  var IsLoaded = false;
  let singleStepMode = false;
  var actions;
  var animations;
  var model;
  var mixer;
  var clock;
  clock = new THREE.Clock();

  var loader = new THREE.GLTFLoader();
  loader.load( 'RobotExpressive.glb', function ( gltf ) {
    // console.log("test2");
    // var material = new THREE.MeshPhongMaterial({
    //   color: 0x156289,
    //   emissive: 0x000000,
    //   specular: 0x111111,
    //   side: THREE.DoubleSide,
    //   flatShading: false,
    //   shininess: 30,
    // })
    
    
    // // let group = new THREE.Mesh(gltf.scene, material);
    model = gltf.scene;
    gltf.scene.scale.x = 10;
    gltf.scene.scale.y = 10;
    gltf.scene.scale.z = 10;
    // // // // gltf.scene.material.side = THREE.DoubleSide;
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = false;
    // scene.add( model );

    gltf.scene.traverse(child => {
      if (child.material && child.material.emissive) {
        if (child.material) 
        {
          child.material.emissive.setRGB(0, 0, 0);
          child.material.side = THREE.DoubleSide;

        }
        if ( child.isMesh ) child.castShadow = true;

      }



    });
    scene.add( gltf.scene );
    // load the same asset with a new loader
    // and add it to scene without changing the color
    // new GLTFLoader().load(gltf2 => {
    //   scene.add(gltf2);
    //   // reddened asset will be rendered although
    //   // we don't change the color of gltf2
    // });
    model.position.set( 0, 0, 200 );



    
    let skeleton = new THREE.SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );
        
    ////////////////
    animations = gltf.animations;
    mixer = new THREE.AnimationMixer( model );
    idleAction = mixer.clipAction( animations[ 0 ] );
    walkAction = mixer.clipAction( animations[ 3 ] );
    runAction = mixer.clipAction( animations[ 1 ] );
    actions = [ idleAction, walkAction, runAction ];

    mixer.timeScale = 0.5;
    
    // setWeight( idleAction, 0.5 );
    activateAllActions();
    IsLoaded = true;

  }, undefined, function ( e ) {
    console.error( e );
  } );


  function activateAllActions() {

    setWeight( idleAction, 0.5 );
    setWeight( walkAction, 0.5 );
    setWeight( runAction, 0.5 );

// prepareCrossFade( walkAction, runAction, 2.5 );
actions[0].play();
    // actions.forEach( function ( action ) {

    //   action.play();

    // } );

  }
  function prepareCrossFade( startAction, endAction, defaultDuration ) {

    // Switch default / custom crossfade duration (according to the user's choice)

    var duration = defaultDuration;//setCrossFadeDuration( defaultDuration );

    // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

    singleStepMode = false;
    unPauseAllActions();

    // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if ( startAction === idleAction ) {
      executeCrossFade( startAction, endAction, duration );
    } else {
      synchronizeCrossFade( startAction, endAction, duration );
    }

  }
  
  function unPauseAllActions() {

    actions.forEach( function ( action ) {

      action.paused = false;

    } );

  }

  function toSingleStepMode() {

    unPauseAllActions();

    singleStepMode = true;
    sizeOfNextStep = settings[ 'modify step size' ];

  }
  // function setCrossFadeDuration( defaultDuration ) {

  //   // Switch default crossfade duration <-> custom crossfade duration

  //   if ( settings[ 'use default duration' ] ) {

  //     return defaultDuration;

  //   } else {

  //     return settings[ 'set custom duration' ];

  //   }

  // }

  function synchronizeCrossFade( startAction, endAction, duration ) {

    mixer.addEventListener( 'loop', onLoopFinished );

    function onLoopFinished( event ) {

      if ( event.action === startAction ) {

        mixer.removeEventListener( 'loop', onLoopFinished );

        executeCrossFade( startAction, endAction, duration );

      }

    }

  }

  function executeCrossFade( startAction, endAction, duration ) {

    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)

    setWeight( endAction, 1 );
    endAction.time = 0;

    // Crossfade with warping - you can also try without warping by setting the third parameter to false

    startAction.crossFadeTo( endAction, duration, true );

  }
  function setWeight( action, weight ) {

    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );

  }




  
  


var nPos = 240;//240;
var nPos_H = 10;//120;
/*
  var group = new THREE.Group();
  // group.add( new Element( 'SJOz3qjfQXU', 0, 0, nPos, 0 ) );
  group.add( new Element( 'Y2-xZ-1HE-Q', nPos, nPos_H, 0, 0, 90, 0 ) );
  group.add( new Element( 'IrydklNpcFI', 0, nPos_H, - nPos, 0, 0, 0));//Math.PI ) );
  group.add( new Element( '9ubytEsCaS0', - nPos, nPos_H, 0, 0, - 90, 0 ) );
  // cssscene.add( group );
  // var obj = new Element( 'Y2-xZ-1HE-Q', nPos, nPos_H, 0, Math.PI / 2 );
  cssscene.add(group);
  // group.position.z += -0;
  // Element( 'Y2-xZ-1HE-Q', nPos, nPos_H, 0, Math.PI / 2 );
*/

  Element2(nPos/2, nPos_H, 0, 0, -90, 0, 0.3, 'https://www.youtube.com/embed/5Tr2ZO-IKu0');
  Element2(0, nPos_H, -nPos/2, 0, 0, 0, 0.3, 'https://www.youtube.com/embed/3CEjuPAVRLE');
  Element2(-nPos/2, nPos_H, 0, 0, 90, 0, 0.3, 'https://www.youtube.com/embed/ixK5Kh5xbSE');




  cssrenderer = new THREE.CSS3DRenderer();
  cssrenderer.setSize( m_nView_W, m_nView_H );
  cssrenderer.domElement.style.position = 'absolute';
  cssrenderer.domElement.style.top = 0;
  // cssrenderer.domElement.style.backgroundColor = 'transparent';
  // document.getElementById("container").appendChild(cssrenderer.domElement);
  document.querySelector('#container').appendChild( cssrenderer.domElement );

  // cssscene.scale.x = 0.01;
  // cssscene.scale.y = 0.01;
  // cssscene.scale.z = 0.01;

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setClearColor(new THREE.Color(0xfdfdfd), 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(m_nView_W, m_nView_H);  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  document.querySelector('#webgl-output').appendChild( renderer.domElement );
  // document.getElementById("webgl-output").appendChild(renderer.domElement);
  

  render();
  function render()
  {
    scene.updateMatrixWorld();

    // var lookAt = new THREE.Vector3(0, 0, 0);
    // lookAt.setFromMatrixPosition(model.matrixWorld);
    // camera.lookAt(lookAt);
    // cssscene.updateMatrixWorld();
    
    requestAnimationFrame(render);

    if (IsLoaded)
    {

      idleWeight = idleAction.getEffectiveWeight();
      walkWeight = walkAction.getEffectiveWeight();
      runWeight = runAction.getEffectiveWeight();
  
      var mixerUpdateDelta = clock.getDelta();
  
      mixer.update( mixerUpdateDelta );
  
    }


    cssrenderer.render(cssscene, camera);
    renderer.render(scene, camera);
    // camera.position.multiplyScalar(10);
  }
}
function onResize()
{
  // renderer = new THREE.WebGLRenderer({antialias: true});
  // renderer.setClearColor(new THREE.Color(cColor));
  // renderer.setPixelRatio(window.devicePixelRatio);
  
  // scene = new THREE.Scene();
  
  m_nView_W = $('#webgl-output')[0].getBoundingClientRect().width;
  m_nView_H = $('#webgl-output')[0].getBoundingClientRect().height;
  // camera = new THREE.PerspectiveCamera(45, m_nView_W / m_nView_H, 0.1, 1000);
  // camera.aspect = $('#webgl-output')[0].getBoundingClientRect().width / $('#webgl-output')[0].getBoundingClientRect().height;
  // camera.lookAt(new THREE.Vector3(0,0,0));
  // camera.updateProjectionMatrix();

  




  
  
}
