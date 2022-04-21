import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as ControlKit from 'controlkit'
import * as dat from 'lil-gui'

/**
 * Base
 */



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()

// Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => 
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

/**
 * Camera
 */

// Basic Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test Mesh
 */


let params = {
    cubeColor: '#ff00ff',
    floorColor: '#ffffff',
    func: function(x,y){
        return Math.sin(Math.cos(x)) * Math.PI / Math.cos(y);
    }
}

let cubeGeometry = new THREE.BoxGeometry(2,2,2)
let cubeMaterial = new THREE.MeshStandardMaterial({color: params.cubeColor})
let floorMaterial = new THREE.MeshStandardMaterial({color: params.floorColor})

const cube = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial)
    cube.castShadow = true
    cube.receiveShadow = true
    cube.position.set(0, 0, 0)
    scene.add(cube)
    
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        floorMaterial)
        floor.position.set(0, -2, 0)
        floor.rotation.x = - Math.PI * 0.5
floor.castShadow = false
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

/**
 * Debug
 */


//  Option #1 - ControlKit

let gui = new ControlKit()



gui.addPanel({
    label: 'Debug',
    width: 300,
})      .addSubGroup({
    label: 'Strings and Numbers',
            useLabel: true
        })
        .addColor(params, 'cubeColor', {
            label: 'Cube',
            colorMode: 'hex', 
            onChange: ()=>{cubeMaterial.color.set(params.cubeColor)}
        })     
        .addColor(params, 'floorColor', {
            label: 'Floor',
            colorMode: 'hex', 
            onChange: ()=>{floorMaterial.color.set(params.floorColor)}})    
        .addButton('fire', function(){console.log('Peng!')})
        .addFunctionPlotter(params, 'func', {label: 'Function'})


// Option #2 - Dat.gui (lil-gui)

// let gui = new dat.GUI()

// gui.addColor(params, 'cubeColor').onChange(()=>{
    // cubeMaterial.color.set(params.cubeColor)
// })

/**
 * Animation
 */

const clock = new THREE.Clock()

const tick = () => 
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update Mesh
    
    cube.rotation.y = elapsedTime * 0.1

    // Update controls

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick on next frame
    window.requestAnimationFrame(tick)
}

tick()