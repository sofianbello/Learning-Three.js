import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


/**
 * Debug
 */
const gui = new dat.GUI()




const parameters = {
    materialColor: '#ffeded',
    count: 77200,
    size: 0.01,
    radius: 6.39,
    branches: 7,
    spin: 1,
    randomness: 0.2,
    rndPower: 4.25,
    insideColor: 0xe1a35b,
    outsideColor: 0xb361ea,
}

gui
    .close()
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })


/**
 * Base
 */

// Loaders
const gltfLoader = new GLTFLoader()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
})


// Meshes
const objectDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)


/**
 * Galaxy
 */



let galaxy = null
let galaxyMaterial = null
let galaxyPoints = null
let mesh4 = null

const generateGalaxy = () =>
{
    if(galaxyPoints !== null)
    {
        galaxy.dispose()
        galaxyMaterial.dispose()
        scene.remove(galaxyPoints)
    }

    
    // Geometry
    galaxy = new THREE.BufferGeometry()

    const galaxyPositions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)



    for (let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches)/ parameters.branches *Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.rndPower) * (Math.random() < 0.5 ? 1: -1) 
        const randomY = Math.pow(Math.random(), parameters.rndPower) * (Math.random() < 0.5 ? 1: -1)
        const randomZ = Math.pow(Math.random(), parameters.rndPower) * (Math.random() < 0.5 ? 1: -1)

        galaxyPositions[i3+0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        galaxyPositions[i3+1] = 0 + randomY
        galaxyPositions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        
        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius/parameters.radius)
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    galaxy.setAttribute(
        'position', 
        new THREE.BufferAttribute(galaxyPositions, 3))

    galaxy.setAttribute(
        'color', 
        new THREE.BufferAttribute(colors, 3))

    //  Material
    galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    })

    //  Points
    mesh4 = new THREE.Points(galaxy, galaxyMaterial)
    mesh4.position.y = - objectDistance * 2
    mesh4.position.x = 2
    mesh4.position.z = -2
    mesh4.rotation.x = 30
    scene.add(mesh4)


    console.log('Generating galaxy...')
}

generateGalaxy()



// Mixer
let mixer = null
let mesh0 = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => 
    {
        // Mixer
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[1])

        action.play()

        mesh0 = gltf.scene
        mesh0.scale.set(0.02, 0.02, 0.02)
        mesh0.position.y = (-objectDistance * 0) -0.75
        mesh0.position.x = 1.75
        mesh0.rotation.y = -(Math.PI)*0.25
        scene.add(mesh0)
    })



mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2


mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2


scene.add(mesh2,mesh3, )

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */

const particles = {
    count: 200,
    size: 0.02,
}

const positions = new Float32Array(particles.count * 3)

for(let i=0; i< particles.count; i++)
{
    positions[i*3+0] = (Math.random() - 0.5) * 10
    positions[i*3+1] = objectDistance * 0.5 - Math.random() * objectDistance * 3
    positions[i*3+2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
    )

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: particles.size,
    sizeAttenuation: true,
})

const myParticles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(myParticles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 50, 0)
scene.add(directionalLight)


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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
*/
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(sectionMeshes[currentSection].rotation, 
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=2',
            }
)
        console.log('changed', currentSection);
    }
    
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height- 0.5
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

     // Ani Mixer
     if(mixer !== null)
     {
         mixer.update(deltaTime)
     }


    // Animate particles
    myParticles.rotation.y += deltaTime * 0.0025
    myParticles.rotation.x += deltaTime * 0.0025


    // Animate Camera
    camera.position.y = - scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = cursor.y * 0.5
    cameraGroup.position.x +=  (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y +=  (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate Meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    
    mesh4.rotation.y += deltaTime * 0.007

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()