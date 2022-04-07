import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
// import { DoubleSide } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry

const waterGeometry = new THREE.PlaneGeometry( 2 , 2 , 128);

//  Color
debugObject.depthColor = '#0000ff'
debugObject.surfaceColor = '#8888ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: 
    {
        u_time: { value: 0},

        u_BigWaveSpeed: { value: 0.75 },
        u_BigWavesElevation: { value: 0.2 },
        u_BigWavesFrequency: { value: new THREE.Vector2(4,1.5) },

        u_DepthColor: {value: new THREE.Color( debugObject.depthColor )},
        u_SurfaceColor: {value: new THREE.Color( debugObject.surfaceColor )},
        u_ColorOffset: {value: 0.25},
        u_ColorMultiplier: {value: 2.0}
    }
})

// Debug
gui.add(waterMaterial.uniforms.u_BigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWaveElevation')
gui.add(waterMaterial.uniforms.u_BigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWaveFrequency-X')
gui.add(waterMaterial.uniforms.u_BigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWaveFrequency-Y')
gui.add(waterMaterial.uniforms.u_BigWaveSpeed, 'value').min(0).max(10).step(0.001).name('uBigWaveSpeed')
gui.addColor(debugObject, 'depthColor').name('uDepthColor')
.onChange(() =>
{
    waterMaterial.uniforms.u_DepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').name('uSurfaceColor')
.onChange(() =>
{
    waterMaterial.uniforms.u_SurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(waterMaterial.uniforms.u_ColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.u_ColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Water
    waterMaterial.uniforms.u_time.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()