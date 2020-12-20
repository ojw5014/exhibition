// // 엄격하게 쓰는 것을 정의
// 'use strict';
function Element2(x,y,z,rx,ry,rz, fScale, strAddress, txtTitle, txtContent)
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
  element.textContent = txtTitle;
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


  var element2 = document.createElement( 'div' );
  element2.style.width = '100px';
  element2.style.height = '100px';
  element2.style.opacity = 0.5;
  element2.style.background = new THREE.Color(
    55,
    100,
    255,
  ).getStyle();
  element2.textContent = txtContent;
  element2.setAttribute('contenteditable', '');

  element.appendChild( element2 );
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
      cssscene.add( mesh );
  }();
}

let camera;
let scene;
let renderer; 

let cssscene;
let cssrenderer; 



var m_nMode = 0;
var mouse = new THREE.Vector2();
var mouse_Prev = new THREE.Vector2();


function onDocumentMouseDown(event) {
  if ((g_nDevice == _DEVICE_ANDROID) || (g_nDevice == _DEVICE_IPHONE))
  {
    // event.preventDefault();
    let touches = event.touches; 
    if (touches.length > 0)
    {
      mouse.x = touches[0].pageX;
      mouse.y = -touches[0].pageY;
    }
  }
  else{
    mouse.x = event.clientX;
    mouse.y = -event.clientY;
  }
  mouse_Prev.x = mouse.x;
  mouse_Prev.y = mouse.y;
  m_nMode = 1;
}


function onDocumentMouseMove(event) {  
  if ((g_nDevice == _DEVICE_ANDROID) || (g_nDevice == _DEVICE_IPHONE))
  {
    // event.preventDefault();
    let touches = event.changedTouches; 

    if (touches.length > 0)
    {
      mouse.x = touches[0].pageX;
      mouse.y = -touches[0].pageY;
    }
  }
  else{
    mouse.x = event.clientX;
    mouse.y = -event.clientY;
  }
  if (m_nMode > 0)
  {
    let fDx = mouse.x - mouse_Prev.x;
    let fDy = mouse.y - mouse_Prev.y;
    // Rotation
    scene.rotation.y += fDx * Math.PI / 180;
    scene.rotation.x -= fDy * Math.PI / 180;
    cssscene.rotation.y += fDx * Math.PI / 180;
    cssscene.rotation.x -= fDy * Math.PI / 180;
    
    mouse_Prev.x = mouse.x;
    mouse_Prev.y = mouse.y;
  }
}

function onDocumentMouseUp(event) {
  m_nMode = 0;
}
const _DEVICE_NONE = 0;
const _DEVICE_ANDROID = 1;
const _DEVICE_IPHONE = 2;
const _DEVICE_TOUCHDEVICE = 3;
const _DEVICE_PC = 4;
let g_nDevice = 0;
renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
cssrenderer = new THREE.CSS3DRenderer();
function IsTouchDevice() { console.log(navigator.userAgent); return (navigator.userAgent.indexOf('Mobile') >= 0) ? true : false; }
function CheckMobile()
{
  g_nDevice = _DEVICE_NONE;

  let str = navigator.userAgent.toLowerCase();
  let nIndex = str.indexOf("android");
  let rst = (nIndex >= 0) ? true : false; 

  let nIndex_Version_End = str.indexOf(";", nIndex+8);
  if (rst == true)
  {
    let version = str.substr(nIndex+8,nIndex_Version_End - (nIndex + 8));
    console.log("Version = " + version);      
    g_nDevice = _DEVICE_ANDROID;
  }
  else {
    let nIndex = str.indexOf("iphone");
    if (nIndex >= 0)
    {
      g_nDevice = _DEVICE_IPHONE;
    }
  }

  if (g_nDevice == _DEVICE_NONE)
  {
    if (IsTouchDevice() == true)
    {
      g_nDevice = _DEVICE_TOUCHDEVICE;
    }
    else 
      g_nDevice = _DEVICE_PC;
  }
  return rst;
}

let m_nView_W, m_nView_H;
function SetPerspective()
{
  let obj = $('#webgl-output')[0].getBoundingClientRect();
  m_nView_W = obj.width;
  m_nView_H = obj.height;
  
  let aspect = m_nView_W / m_nView_H;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);  

  camera.position.x = 0; 
  camera.position.y = 50;//5; 
  camera.position.z = 300;//30;
  camera.aspect = aspect;
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.setSize(m_nView_W, m_nView_H);  
  cssrenderer.setSize(m_nView_W, m_nView_H);  
  camera.updateProjectionMatrix();
}


function log_init()
{
  document.getElementById("txtMessage").style.display = "block";
  // print_init("txtMessage");
  // print_set_depth(1);
}
function init() {
  // listen to the resize events
  window.addEventListener('resize', onResize, false);

  // document.addEventListener('mousedown', onDocumentMouseDown, false);
  // document.addEventListener('mouseup', onDocumentMouseUp, false);
  // document.addEventListener('mousemove', onDocumentMouseMove, false); 

  scene = new THREE.Scene();
  cssscene = new THREE.Scene();

  let ambienLight = new THREE.AmbientLight(0x000000);
  scene.add(ambienLight);
  var glSpotlight = new THREE.SpotLight(0x999999);
  glSpotlight.position.copy(new THREE.Vector3(0, 500, 700));    
  glSpotlight.castShadow = true;
  scene.add(glSpotlight);


  var glLight1 = new THREE.DirectionalLight( 0x999999, 1 );
  
  glLight1.castShadow = true;
  glLight1.shadow.camera.near = 1;       // default
  glLight1.shadow.camera.far = 2000;      // default

  glLight1.position.copy(new THREE.Vector3(0, 400, 800));  
  scene.add( glLight1 );


  renderer.setClearColor(new THREE.Color(0xfdfdfd), 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(m_nView_W, m_nView_H);  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap



  SetPerspective();
  // cssscene.add(glLight1);

  draw_land();

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
/*
  var loader = new THREE.GLTFLoader();
  loader.load( 'RobotExpressive.glb', function ( gltf ) {
    
    model = gltf.scene;
    gltf.scene.scale.x = 10;
    gltf.scene.scale.y = 10;
    gltf.scene.scale.z = 10;
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = false;

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
    model.position.set( 0, 0, 0 );
    
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
*/

  function activateAllActions() {

    setWeight( idleAction, 0.5 );
    setWeight( walkAction, 0.5 );
    setWeight( runAction, 0.5 );

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




    
    
  let aTitle = [];
  let astr = [];
  let aName = [];
  aTitle.push('test0');
  aName.push('쿠루쿠루-1');
  astr.push('https://www.youtube.com/embed/5Tr2ZO-IKu0');
  aTitle.push('test1');
  aName.push('쿠루쿠루-2');
  astr.push('https://www.youtube.com/embed/3CEjuPAVRLE');
  aTitle.push('test2');
  aName.push('쿠루쿠루-3');
  astr.push('https://www.youtube.com/embed/ixK5Kh5xbSE');

  // ros2 네비게이션2 이용한 축구
  aTitle.push('ros2 네비게이션2 이용한 축구');
  aName.push('김민우-1');
  astr.push('https://www.youtube.com/embed/LFXpTPquBc8');
  // pyserial 을 이용한 zumi를 ros로 control
  aName.push('김민우-2');
  aTitle.push('pyserial 을 이용한 zumi를 ros로 control');
  astr.push('https://www.youtube.com/embed/8Jf2OLQgHK0');

  // 파이제로 기반 소형 로봇(쥬미)에서 파이캠 기반 gesture 인식하여 Control 하기
  aName.push('김성주-1');
  aTitle.push('파이제로 기반 소형 로봇(쥬미)에서 파이캠 기반 gesture 인식하여 Control 하기');
  astr.push('https://www.youtube.com/embed/MIPYcma0_sk');
  // 파이제로 기반 소형 로봇(쥬미)에서 파이캠 기반 color detection 을 통한 object follow 하기
  aName.push('김성주-2');
  aTitle.push('파이제로 기반 소형 로봇(쥬미)에서 파이캠 기반 color detection 을 통한 object follow 하기');
  astr.push('https://www.youtube.com/embed/vW3JzmEn7cE');
  // 3족 보행 로봇 프로젝트
  aName.push('김선빈-아인스본');
  aTitle.push('3족 보행 로봇 프로젝트');
  astr.push('https://www.youtube.com/embed/ctsWQZMSsHM');
  // 이족보행 로봇
  aName.push('Park로봇-1');
  aTitle.push('이족보행 로봇');
  astr.push('https://www.youtube.com/embed/yzNCg4FefLg');
  // 다이나믹셀을 이용한 물체의 크기에 상관 없이 잡을 수 있는 로봇 손
  aName.push('Park로봇-2');
  aTitle.push('다이나믹셀을 이용한 물체의 크기에 상관 없이 잡을 수 있는 로봇 손');
  astr.push('https://www.youtube.com/embed/1ttAuQtzgGo');
  // 프로젝트 유니콘
  aName.push('You');
  aTitle.push('프로젝트 유니콘');
  astr.push('https://www.youtube.com/embed/TN9rAbIkE2Q');

  // //  
  // aName.push('한종태-1');
  // aTitle.push('ROS 없이 T265 트래킹 카메라와 G6 라이다를 이용한 데이터 센싱 및 지도그리기');
  // astr.push('https://cafe.naver.com/openrt/23683');
  // // 
  // aName.push('한종태-2');
  // aTitle.push('구글 클라우드 플랫폼 음성 인식(STT) API 와 네이버 TTS API를 활용하여 컴퓨터랑 대화하기');
  // astr.push('https://cafe.naver.com/cafec/369230');
  
  aName.push('로보나이트');
  aTitle.push('내가 설계한 휴머노이드');
  astr.push('https://www.youtube.com/embed/fA_rvG6rWLw');

  let x0 = 0;
  let y0 = 0;
  let z0 = 0;
  let fLength = 100;
  let fAngle = 360;
  let fStart = -fAngle / 2;
  let fSize = (fAngle + 0) / astr.length;
  for (let i = 0; i < astr.length; i++)
  {
    let vPos = new THREE.Vector3(0, 0, fLength);
    let fAngle2 = fStart + fSize * i;
    vPos = Rotation(0, fAngle2, 0, vPos);
    Element2(x0 + vPos.x, y0 + vPos.y, z0 + vPos.z, 0, fAngle2, 0, 0.3, astr[i], aName[i], aTitle[i]);
  }

  cssrenderer.setSize( m_nView_W, m_nView_H );
  cssrenderer.domElement.style.position = 'absolute';
  cssrenderer.domElement.style.top = 0;
  // cssrenderer.domElement.style.backgroundColor = 'transparent';
  // document.getElementById("container").appendChild(cssrenderer.domElement);
  document.querySelector('#container').appendChild( cssrenderer.domElement );

  // cssscene.scale.x = 0.01;
  // cssscene.scale.y = 0.01;
  // cssscene.scale.z = 0.01;

  document.querySelector('#webgl-output').appendChild( renderer.domElement );
  // document.getElementById("webgl-output").appendChild(renderer.domElement);
  
  m_CTmr.start();
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
    let fTmr = 10;
    let fTmr_Max = 30000;
    if (m_CTmr.get() > fTmr)
    {
      m_fRot = m_CTmr.get() / fTmr_Max * 360;
      m_fRot %= 360;
      m_CTmr.start();
      cssscene.rotateY(m_fRot / 180 * Math.PI);
    }

    cssrenderer.render(cssscene, camera);
    renderer.render(scene, camera);
    // camera.position.multiplyScalar(10);
  }
}
let m_fRot = 0;

function onResize()
{
  // renderer = new THREE.WebGLRenderer({antialias: true});
  // renderer.setClearColor(new THREE.Color(cColor));
  // renderer.setPixelRatio(window.devicePixelRatio);
  
  // scene = new THREE.Scene();
  
  // m_nView_W = $('#webgl-output')[0].getBoundingClientRect().width;
  // m_nView_H = $('#webgl-output')[0].getBoundingClientRect().height;
  // camera = new THREE.PerspectiveCamera(45, m_nView_W / m_nView_H, 0.1, 1000);
  // camera.aspect = $('#webgl-output')[0].getBoundingClientRect().width / $('#webgl-output')[0].getBoundingClientRect().height;
  // camera.lookAt(new THREE.Vector3(0,0,0));
  // camera.updateProjectionMatrix();

  console.log("Resizing");
    // 3D Resize
  // GetViewStatus_All();
  // setPerspective(m_IsPerspective);
  SetPerspective();



  
  
}


// function init3d_scale2()
// {
//   init3d_scale();//("-25%", "63px", "120%", "100%");//IntToStr(m_nView_Main_H / 2) + "px");
// }
// function init3d_scale()//(strLeft, strTop, strWidth, strHeight)
// {
//     let obj = $('#' + g_strObjWebGl)[0].getBoundingClientRect();
//     m_nView_Left = obj.left;
//     m_nView_Top = obj.top;
//     m_nView_W = obj.width;
//     m_nView_H = obj.height;
//     console.log("W/H: " + m_nView_W + ', ' + m_nView_H);
// }

// function setPerspective(e) {
//   init3d_scale2();
//   m_IsPerspective = e;
//   // IsDown = 0;
//   let orth = 4;//16;
//   if ((typeof camera != 'undefined') && (camera != null))
//   {
//     let pos_scene = new THREE.Vector3(0,0,0);
//     pos_scene.copy(scene.position);

//     let pos = new THREE.Vector3(0,0,0);
//     //let aspect = camera.aspect;
//     let aspect = m_nView_W / m_nView_H;
  
//     pos.copy(camera.position);
    
//     if (e)  
//     {
//       console.log('perspective');
//       camera = new THREE.PerspectiveCamera(45, m_nView_W / m_nView_H, 0.1, 1000);
//     }              
//     else
//     {
//       console.log('orth');
//       camera = new THREE.OrthographicCamera(m_nView_W / -orth, m_nView_W / orth, m_nView_H / orth, m_nView_H / -orth, -200, 500);     
//     }
//     camera.position.copy(pos);
//     scene.scale.set(g_CRobot.fScale, g_CRobot.fScale, g_CRobot.fScale);

//     camera.aspect = aspect;
//     camera.lookAt(new THREE.Vector3(0,0,0));    
//   }
//   else
//   {
//     console.log('view->');
//     if (e)
//     {
//       console.log('perspective');
//       camera = new THREE.PerspectiveCamera(45, m_nView_W / m_nView_H, 0.1, 1000);
//     }
//     else
//     {
//       console.log('orth');
//       camera = new THREE.OrthographicCamera(m_nView_W / -orth, m_nView_W / orth, m_nView_H / orth, m_nView_H / -orth, -200, 500);      
//     }
//     //// position and point the camera to the center of the scene
//     // camera.position.x = g_CRobot.vCam_Pos.x;
//     // camera.position.y = g_CRobot.vCam_Pos.y;
//     // camera.position.z = g_CRobot.vCam_Pos.z;
    
//     // scene.scale.set(g_CRobot.fScale, g_CRobot.fScale, g_CRobot.fScale);

//     camera.aspect = m_nView_W / m_nView_H;
//     camera.lookAt(new THREE.Vector3(0,0,0));
//   }
//   renderer.setSize(m_nView_W, m_nView_H);  
//   camera.updateProjectionMatrix();
// } 

let m_objPlane;
function draw_land()
{
  let vecBase = new THREE.Vector3(0, -30, 0);

  let nSize_Ground = 400;//60;
  let nSize_Grid = 100;//60;
  let planeGeometry = new THREE.PlaneGeometry(nSize_Ground, nSize_Ground, nSize_Grid, nSize_Grid);
    
  let planeMaterial = new THREE.MeshPhongMaterial(
    {
      //shading: THREE.SmoothShading,
      wireframe : false,
      color: 0xffffff
    }
  );
    
  m_objPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  
  m_objPlane.material.transparent = true; // 투명설정을 사용 허가
  m_objPlane.material.opacity = 0.2;

  m_objPlane.castShadow = true;
  m_objPlane.receiveShadow = true;

  // rotate and position the m_objPlane
  m_objPlane.rotation.x = -0.5 * Math.PI;
  m_objPlane.position.x = vecBase.x;
  m_objPlane.position.y = vecBase.y;
  m_objPlane.position.z = vecBase.z;
  
  scene.add(m_objPlane);
}
let m_CTmr = new CTimer_t();
function CTimer_t(){
  this.tmr = new Date();
  this.IsTimer = true;
  this.start = function()
  {
      this.tmr = new Date();
      this.IsTimer = true;
  }
  this.stop = function()
  {
      this.IsTimer = false;
  }
  this.get = function()
  {
      return this.IsTimer ? (new Date()).getTime() - this.tmr.getTime() : 0;
  }
  this.get_weekday = function() { return (new Date()).getDay(); }
  this.get_year = function() { return (new Date()).getFullYear(); }
  this.get_month = function() { return (new Date()).getMonth() + 1; }
  this.get_day = function() { return (new Date()).getDate(); }
  this.get_hour = function() { return (new Date()).getHours(); }
  this.get_minute = function() { return (new Date()).getMinutes(); }
  this.get_second = function() { return (new Date()).getSeconds(); }
  this.get_millisecond = function() { return (new Date()).getMilliseconds(); }
}

//let vSpot = new THREE.Vector3();
function Rotation(ax, ay, az, vPos)
{
  //float fr = 3.14159f / 180.0f;
  //float ax2 = ax * fr;
  //float ay2 = ay * fr;
  //float az2 = az * fr;
  return Rotation_radian(ax * 0.01745, ay * 0.01745, az * 0.01745, vPos);
}
function Rotation_radian(ax, ay, az, vPos)
{
    //    →X(Left), ↑Y(Up), ●Z(Front)
    // Rotation(Z)(Roll)
    /*
      cos, -sin, 0, 0
      sin,  cos, 0, 0
        0,    0, 1, 0
        0,    0, 0, 1
      */

    // Rotation(X)(Pitch)
    /*
      1,   0,    0, 0
      0, cos, -sin, 0
      0, sin,  cos, 0
      0,   0,    0, 1
      */

    // Rotation(Y)(Yaw)
    /*
      cos, 0, -sin, 0
        0, 1,    0, 0
      sin, 0,  cos, 0
        0, 0,    0, 1
      */

    let x = vPos.x;
    let y = vPos.y;
    let z = vPos.z;
    let x1, y1, z1;
    let x2, y2, z2;
    let fCx = Math.cos(ax);
    let fCy = Math.cos(ay);
    let fCz = Math.cos(az);
    let fSx = Math.sin(ax);
    let fSy = Math.sin(ay);
    let fSz = Math.sin(az);

    //x1 = x * fCy + z * fSy;   // Rotation(y)
    //y1 = y;
    //z1 = -x * fSy + z * fCy;

    x1 = x;    // Rotation(x)
    y1 = y * fCx - z * fSx;
    z1 = y * fSx + z * fCx;

    //x = x2 * fCz - y2 * fSz;    // Rotation(z)
    //y = x2 * fSz + y2 * fCz;
    //z = z2;

    x2 = x1 * fCy + z1 * fSy;   // Rotation(y)
    y2 = y1;
    z2 = -x1 * fSy + z1 * fCy;

    vPos.z = z2;
    vPos.x = x2 * fCz - y2 * fSz;    // Rotation(z)
    vPos.y = x2 * fSz + y2 * fCz;
    return vPos;
}
