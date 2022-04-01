import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { NearestFilter } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes Helper
 */
const axisHelper = new THREE.AxesHelper()
/* scene.add(axisHelper) */
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture1 = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/10.png')
matcapTexture1.minFilter = THREE.NearestFilter
matcapTexture1.magFilter = THREE.NearestFilter
matcapTexture1.generateMipmaps = false




/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new THREE.TextBufferGeometry(
            'Mr. Bello',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.003,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x -0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y -0.02)* 0.5,
        //     - (textGeometry.boundingBox.max.z -0.03)* 0.5
        // )


        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 })
        // const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 })
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)

        var f1 = gui.addFolder('Position');
        f1.add(text.position, 'x', -1.5, 0.2, 0.01)
        f1.add(text.position, 'y', -1.5, 1.2, 0.01)
        f1.open()
        var f2 = gui.addFolder('Text')
        gui.add(text.geometry.parameters.options, 'bevelEnabled')
        gui.add(text.geometry.parameters.options, 'bevelOffset', 0, 0.5, 0.1)
        gui.add(text.geometry.parameters.options, 'bevelSegments', 0, 5, 0.1)
        gui.add(text.geometry.parameters.options, 'bevelThickness', 0, 5, 0.01)
        gui.add(text.geometry.parameters.options, 'curveSegments', 0, 5, 0.01)
        gui.add(text.geometry.parameters.options, 'depth', 0, 5, 0.01)
        gui.add(text.geometry.parameters.options, 'height', 0, 5, 0.01)
        gui.add(text.geometry.parameters.options, 'size', 0, 5, 0.01)
        console.log(text.geometry.parameters.options);




        scene.add(text)



        console.time('donuts')
        const donutGeometry = new THREE.TorusBufferGeometry(0.3,0.2,20,45)
        const boxGeometry = new THREE.BoxBufferGeometry(0.5,0.5)
        const coneGeometry = new THREE.ConeBufferGeometry(0.2,0.5)
            // const donutMaterial= new THREE.MeshMatcapMaterial( {matcap: matcapTexture1})


        for(let i = 0; i< 100; i++)
        {
            
            const donut = new THREE.Mesh(donutGeometry, material)
            const box = new THREE.Mesh(boxGeometry, material)
            const cone = new THREE.Mesh(coneGeometry, material)


            donut.position.x = (Math.random() - 0.5)* 10 
            donut.position.y = (Math.random() - 0.5)* 10 
            donut.position.z = (Math.random() - 0.5)* 10 
            donut.rotation.x = Math.random()* Math.PI 
            donut.rotation.y = Math.random()* Math.PI
            box.position.x = (Math.random() - 0.5)* 10 
            box.position.y = (Math.random() - 0.5)* 10 
            box.position.z = (Math.random() - 0.5)* 10 
            box.rotation.x = Math.random()* Math.PI 
            box.rotation.y = Math.random()* Math.PI
            cone.position.x = (Math.random() - 0.5)* 10 
            cone.position.y = (Math.random() - 0.5)* 10 
            cone.position.z = (Math.random() - 0.5)* 10 
            cone.rotation.x = Math.random()* Math.PI*2
            cone.rotation.y = Math.random()* Math.PI*2


            const scale = Math.random()
            donut.scale.set(scale,scale,scale)
            box.scale.set(scale*0.25,scale,scale*0.25)
            cone.scale.set(scale*0.25,scale,scale*0.25)




            scene.add(donut, box,cone)
        }
        console.timeEnd('donuts')
        // console.log(textGeometry.parameters.options);
        // gui
            // .add(textGeometry.parameters.options, 'height' ).min(0).max(0.5).step(.001)
    }

)




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



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()