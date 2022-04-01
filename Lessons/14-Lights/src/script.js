import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLight } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
console.log(RectAreaLightHelper);
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const lightParameters = {
    color1: 0xff0000,
    color2: 0x0000ff,
    color3: 0xff0000,
    color4: 0x0000ff,
    color5: 0x00ff00,
    color6: 0xffff00,
    color7: 0xff00ff,
    intensity1: 0.01,
    intensity2: 0.01,
    intensity3: 0.01,
    intensity4: 0.01,
    intensity5: 0.01,
    intensity6: 0.01,
    intensity7: 0.01
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// Light #1
const ambientLight = new THREE.AmbientLight(lightParameters.color, lightParameters.intensity1)


var v1 = gui.addFolder('AmbientLight',)
v1.add(ambientLight, 'intensity', 0.01, 0.5, 0.01)
v1.addColor(lightParameters, 'color1')
.onChange(() =>
{
    ambientLight.color.set(lightParameters.color1)

})


scene.add(ambientLight)


// Light #2

const directionalLight = new THREE.DirectionalLight(lightParameters.color2, lightParameters.intensity2)

var v2 = gui.addFolder('DirectionalLight',)

v2.add(directionalLight, 'intensity', 0.01, 1, 0.01)
v2.addColor(lightParameters, 'color2')
.onChange(() =>
{
    directionalLight.color.set(lightParameters.color2)
    hemisphereLight.color.set(lightParameters.color2)

})
var v22 = v2.addFolder('Transformation')
v22.add(directionalLight.position, 'x', -2, 2, 0.01)
v22.add(directionalLight.position, 'y', -2, 2, 0.01)
v22.add(directionalLight.position, 'z', -2, 2, 0.01)

scene.add(directionalLight)



// Light #3
const hemisphereLight = new THREE.HemisphereLight(lightParameters.color3,lightParameters.color4, lightParameters.intensity3)


var v3 = gui.addFolder('HemisphereLight',)
v3.add(hemisphereLight, 'intensity', 0.01, 1, 0.01)
v3.addColor(lightParameters, 'color3')
.onChange(() =>
{
    
    hemisphereLight.color.set(lightParameters.color3)

})
v3.addColor(lightParameters, 'color4')
.onChange(() =>
{
    
    hemisphereLight.color.set(lightParameters.color4)

})
var v32 = v3.addFolder('Transformation')
v32.add(hemisphereLight.position, 'x', -2, 2, 0.01)
v32.add(hemisphereLight.position, 'y', -2, 2, 0.01)
v32.add(hemisphereLight.position, 'z', -2, 2, 0.01)


scene.add(hemisphereLight)

// Light #4

const pointLight = new PointLight(lightParameters.color5, lightParameters.intensity4, 3, 2)
pointLight.position.x = 1
pointLight.position.y = 0.5
pointLight.position.z = 0

var v4 = gui.addFolder('PointLight',)

v4.add(pointLight, 'intensity', 0.01, 1, 0.01)
v4.addColor(lightParameters, 'color4')
.onChange(() =>
{
    pointLight.color.set(lightParameters.color4)
})
var v42 = v4.addFolder('Transformation')
v42.add(pointLight.position, 'x', -2, 2, 0.01)
v42.add(pointLight.position, 'y', -2, 5, 0.01)
v42.add(pointLight.position, 'z', -2, 2, 0.01)

scene.add(pointLight)
// Light #5

const rectAreaLight = new THREE.RectAreaLight(lightParameters.color6, lightParameters.intensity5, 3, 2)
rectAreaLight.position.x = 1
rectAreaLight.position.y = 0.5
rectAreaLight.position.z = 0



var v5 = gui.addFolder('RectAreaLight',)
v5.add(rectAreaLight, 'intensity', 0.01, 5, 0.01)
v5.add(rectAreaLight, 'width', 0.01, 30, 0.1)
v5.add(rectAreaLight, 'height', 0.01, 30, 0.1)
v5.addColor(lightParameters, 'color6')
.onChange(() =>
{
    rectAreaLight.color.set(lightParameters.color6)
})
var v52 = v5.addFolder('Transformation')
v52.add(rectAreaLight.position, 'x', -2, 2, 0.01)
v52.add(rectAreaLight.position, 'y', -2, 5, 0.01)
v52.add(rectAreaLight.position, 'z', -2, 2, 0.01)

scene.add(rectAreaLight)
// Light #6

const spotLight = new THREE.SpotLight(lightParameters.color7, lightParameters.intensity6, 6, Math.PI * 0.1, 0.25,1)
spotLight.position.x = 0
spotLight.position.y = 2
spotLight.position.z = 3
spotLight.castShadow = true


var v6 = gui.addFolder('spotLight',)


v6.add(spotLight, 'intensity', 0.01, 5, 0.01)
v6.add(spotLight, 'distance', -0.01, 10, 0.1)
v6.add(spotLight, 'angle', 0.1, 2, 0.1)
v6.add(spotLight, 'decay', 0.01, 0.5, 0.1)
v6.add(spotLight, 'penumbra', 0.01, 0.5, 0.1)
v6.addColor(lightParameters, 'color7')
.onChange(() =>
{
    spotLight.color.set(lightParameters.color7)
})
var v62 = v6.addFolder('Transformation')
v62.add(spotLight.position, 'x', -2, 2, 0.01)
v62.add(spotLight.position, 'y', -2, 5, 0.01)
v62.add(spotLight.position, 'z', -2, 2, 0.01)
v62.add(spotLight.target.position, 'x', -2, 2, 0.01)

scene.add(spotLight)

spotLight.target.position.x = 2

scene.add(spotLight.target)

// Helpers

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)
hemisphereLightHelper.visible = false


const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
directionalLightHelper.visible = false


const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)
pointLightHelper.visible = false

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
spotLightHelper.visible = false

window.requestAnimationFrame(()=>
{
    spotLightHelper.update()
})
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
rectAreaLightHelper.visible = false



var v7 = gui.addFolder('Helpers')
v7.add(hemisphereLightHelper, 'visible').name('Hemisphere')
v7.add(directionalLightHelper, 'visible').name('Directional')
v7.add(pointLightHelper, 'visible').name('Point')
v7.add(rectAreaLightHelper, 'visible').name('RectArea')
v7.add(spotLightHelper, 'visible').name('Spot')



/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()
    rectAreaLight.lookAt(new THREE.Vector3())

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()