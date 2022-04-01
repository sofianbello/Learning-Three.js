import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// Position

//Long Form
/* mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1 */

// Short Form
mesh.position.set(0.7,- 0.6, 1)

// Scale

// Long Form 
/* mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 0.5 */

// Short Form
mesh.scale.set(2, 0.5, 0.5)

// Rotation
mesh.rotation.reorder('YXZ')


// Long Form
/*
mesh.rotation.y = Math.PI * 0.25 
mesh.rotation.x = Math.PI * 0.25
 */

// Short Form
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0)



// Axes Helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)


/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

camera.lookAt(mesh.position)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)