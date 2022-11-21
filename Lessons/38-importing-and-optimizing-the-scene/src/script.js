import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 500})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fogParams = {color: '#251320',near: 1, far: 10}
const fog = new THREE.Fog(fogParams.color, fogParams.near, fogParams.far)
scene.fog = fog



/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Materials
 */

// Baked Material
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// PortalLight Material
const portalLightMaterial = new THREE.ShaderMaterial({ 
    uniforms: 
    {
        uTime: { vlaue: 0},
        uColorStart: { value: new THREE.Color(0xf77e7e)},
        uColorEnd: { value: new THREE.Color(0xfdd7fe)},
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
 })

// PoleLight Material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xf993fb })

// gui.addColor(portalLightMaterial, 'color').name('PortalLight')
gui.addColor(portalLightMaterial.uniforms.uColorStart, 'value').name('PortalLightStart')
gui.addColor(portalLightMaterial.uniforms.uColorEnd, 'value').name('PortalLightEnd')
gui.addColor(poleLightMaterial, 'color').name('PoleLight')

/**
 * Model
 */

gltfLoader.load(
    'portal.glb', // Path by default is set to 'static' this can also be written as './/portal.glb'
    (gltf) =>
    {

        const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'Portal')
        const lampAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        const lampBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
        const lampCMesh = gltf.scene.children.find(child => child.name === 'poleLightC')
        const lampDMesh = gltf.scene.children.find(child => child.name === 'poleLightD')

        bakedMesh.material = bakedMaterial
        portalLightMesh.material = portalLightMaterial
        lampAMesh.material = poleLightMaterial
        lampBMesh.material = poleLightMaterial
        lampCMesh.material = poleLightMaterial
        lampDMesh.material = poleLightMaterial

        scene.add(gltf.scene);
    }
)

/**
 * Fireflies
 */

// Geometriy
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 150
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0 ] = (Math.random() - 0.5) * 4
    positionArray[i * 3 + 1 ] = Math.random() * 2.5
    positionArray[i * 3 + 2 ] = (Math.random() - 0.5) * 4

    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({ 
    uniforms:
    {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 200 },
    },

    vertexShader: firefliesVertexShader, 
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('Particle Size')

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update Fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.02
controls.maxPolarAngle = Math.PI * 0.45
controls.minPolarAngle = Math.PI * 0.3

controls.minAzimuthAngle = 0
controls.maxAzimuthAngle = 1.5




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

debugObject.clearColor = '#251320'
gui.addColor(debugObject, 'clearColor').name('Background').onChange( ()=>
{
    renderer.setClearColor(debugObject.clearColor)
})
renderer.setClearColor(debugObject.clearColor)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update materials
    portalLightMaterial.uniforms.uTime.value = elapsedTime
    firefliesMaterial.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()