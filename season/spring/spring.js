import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from "https://cdn.skypack.dev/dat.gui"
import gsap from 'gsap'

const gui = new dat.GUI()

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 3   

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(new THREE.Color('#000000'), 1)
document.body.appendChild(renderer.domElement)

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(0,0,0)
scene.add(pointLight)


const textureLoader = new THREE.TextureLoader()
//card
const geometry = new THREE.PlaneBufferGeometry(1, 1.3)
for(let i = 0; i < 5; i++){
    const material = new THREE.MeshBasicMaterial({
        map:textureLoader.load(`/season/spring/assets/${i}.jpeg`)
    })

    const img = new THREE.Mesh(geometry, material)
    img.position.set(1.5 + Math.random(), i*-1.8)
    scene.add(img)
}

let pictures = []
scene.traverse((object) =>{
    if(object.isMesh) {
        pictures.push(object)
    }
})



window.addEventListener('wheel', onMouseWheel)

let y = 0
let position = 0

function onMouseWheel(event){
  y = event.deltaY * 0.0002
}

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>{
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1

  
  // console.log(event.clientX/ sizes.width * 2 - 1)
})


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
  
  ///Responsive THREE.js
window.addEventListener('resize', () => {
  
  //Update Size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
    
   //update camera
   camera.aspect = window.innerWidth
  camera.updateProjectionMatrix()
    
  //update render
   renderer.setSize(sizes.width / sizes.height)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
  
const raycaster = new THREE.Raycaster()
function animate() {

    position -=y
    y *=.9

    //Raycaster
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(pictures)


    //Hover
    for(const intersect of intersects){
        gsap.to(intersect.object.scale, {x: 1.7, y: 1.7})
        gsap.to(intersect.object.rotation, {y: -.5})
      }
      
      for(const picture of pictures) {
        if(!intersects.find(intersect => intersect.object === picture)){
          gsap.to(picture.scale, {x: 1, y: 1})
          gsap.to(picture.rotation, {y: 0})
        }
    }

    camera.position.y = position
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()