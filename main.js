// // 엄격하게 쓰는 것을 정의
'use strict';

const _DEVICE_NONE = 0;
const _DEVICE_ANDROID = 1;
const _DEVICE_IPHONE = 2;
const _DEVICE_TOUCHDEVICE = 3;
const _DEVICE_PC = 4;

let camera;
let scene;
let renderer; 

let cssscene;
let cssrenderer; 

let g_nDevice = _DEVICE_NONE;
let m_nView_W, m_nView_H;

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
}

function init() {
  // // listen to the resize events
  // window.addEventListener('resize', onResize, false);

  // // document.addEventListener('mousedown', onDocumentMouseDown, false);
  // // document.addEventListener('mouseup', onDocumentMouseUp, false);
  // // document.addEventListener('mousemove', onDocumentMouseMove, false); 
  
  // renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  // cssrenderer = new THREE.CSS3DRenderer();

  // scene = new THREE.Scene();
  // cssscene = new THREE.Scene();

  // let ambienLight = new THREE.AmbientLight(0x000000);
  // scene.add(ambienLight);
  // var glSpotlight = new THREE.SpotLight(0x999999);
  // glSpotlight.position.copy(new THREE.Vector3(0, 500, 700));    
  // glSpotlight.castShadow = true;
  // scene.add(glSpotlight);

  // render();
  // function render()
  // {
  //   scene.updateMatrixWorld();
    
  //   requestAnimationFrame(render);

  //   // if (IsLoaded)
  //   // {

  //   //   idleWeight = idleAction.getEffectiveWeight();
  //   //   walkWeight = walkAction.getEffectiveWeight();
  //   //   runWeight = runAction.getEffectiveWeight();
  
  //   //   var mixerUpdateDelta = clock.getDelta();
  
  //   //   mixer.update( mixerUpdateDelta );
  
  //   // }
  //   // let fTmr = 10;
  //   // let fTmr_Max = 30000;
  //   // if (m_CTmr.get() > fTmr)
  //   // {
  //   //   m_fRot = m_CTmr.get() / fTmr_Max * 360;
  //   //   m_fRot %= 360;
  //   //   m_CTmr.start();
  //   //   cssscene.rotateY(m_fRot / 180 * Math.PI);
  //   // }

  //   cssrenderer.render(cssscene, camera);
  //   renderer.render(scene, camera);
  // }
}

function onResize()
{
  console.log("Resizing");
  SetPerspective();
}