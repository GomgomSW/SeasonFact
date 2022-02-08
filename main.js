import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from "https://cdn.skypack.dev/dat.gui"
import gsap from 'gsap'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(new THREE.Color('#000000'), 1)
document.body.appendChild(renderer.domElement)

const pointLight = new THREE.PointLight(0xffffff, 0)
pointLight.position.set(2,3,4)
scene.add(pointLight)


const orbGeometry = new THREE.SphereGeometry(2, 4, 20)
const orbMaterial = new THREE.PointsMaterial({
  size: 0.008,
})


const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
  size: 0.008,
  color: 'red'
})
const totalParticle = 1500;

///Generate Particle Position
const posArray = new Float32Array(totalParticle * 3)

for(let i = 0; i< totalParticle * 3; i++){
  posArray[i] = (Math.random() -0.5) * (Math.random() * 5);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))



const orb = new THREE.Points(orbGeometry, orbMaterial)
const particleMesh = new THREE.Points(particleGeometry, particleMaterial)

scene.add(particleMesh)

const clock = new THREE.Clock()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


/// MouseMovement Tracking
document.addEventListener('mousemove', moveParticles)

let mouseX = 0
let mouseY = 0

function moveParticles(event) {
  mouseX = event.clientX
  mouseY = event.clientY
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

function animate(){
  const elapsedTime = clock.getElapsedTime()

 
  orb.rotation.x = .05 * elapsedTime
  orb.rotation.y = .05 * elapsedTime


  //update mouse rotation
  particleMesh.rotation.x = -mouseY * (elapsedTime * 0.0001)
  particleMesh.rotation.y = mouseX * (elapsedTime * 0.0001) 

  requestAnimationFrame(animate)
  renderer.render(scene, camera)

}

animate()

