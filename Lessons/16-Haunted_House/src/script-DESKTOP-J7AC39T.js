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

//  Fog
const fog = new THREE.Fog(0x262837, 2, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('./textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('./textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('./textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('./textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('./textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

// 3D Text
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/10.png')

matcapTexture1.minFilter = THREE.NearestFilter
matcapTexture1.magFilter = THREE.NearestFilter
matcapTexture1.generateMipmaps = false



/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,


    })

)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 2.5 /2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color: '#471111'})
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2, 50, 50),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 +0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c654})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(1.7,0.2,2.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(2.1,0.1,2.9)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.55,0.55,0.35)
bush3.position.set(-2.1,0.1,2.3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.35,0.35,0.5)
bush4.position.set(-1.5,0.1,2.7)

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial)
bush5.scale.set(0.35,0.55,0.75)
bush5.position.set(-2.3,0.1,1.7)
bush5.rotateZ(10)

house.add(bush1, bush2, bush3, bush4, bush5)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,.15)
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xb2b6b1})

for(let i = 0; i <50; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 7
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * .9
    grave.rotation.z = (Math.random() - 0.5) * .21
    grave.castShadow = true
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
     })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new THREE.TextBufferGeometry(
            'Bellos House',
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
        textGeometry.computeBoundingBox()
        textGeometry.translate(
            - (textGeometry.boundingBox.max.x)+2,
            - (textGeometry.boundingBox.max.y -8)* 0.5,
            - (textGeometry.boundingBox.max.z -0.03)* 0.5
        )


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
            
            const donut = new THREE.Mesh(donutGeometry, graveMaterial)
            const box = new THREE.Mesh(boxGeometry, graveMaterial)
            const cone = new THREE.Mesh(coneGeometry, graveMaterial)

            cone.castShadow = true
            box.castShadow = true
            donut.castShadow = true
            donut.position.x = (Math.random() - 0.5)* 20 
            donut.position.y = (Math.random() - 0.5)* 10
            donut.position.z = (Math.random() - 0.5)* 10
            donut.rotation.x = Math.random()* Math.PI 
            donut.rotation.y = Math.random()* Math.PI
            box.position.x = (Math.random() - 0.5)* 15
            box.position.y = (Math.random() - 0.5)* 15
            box.position.z = (Math.random() - 0.5)* 20
            box.rotation.x = Math.random()* Math.PI 
            box.rotation.y = Math.random()* Math.PI
            cone.position.x = (Math.random() - 0.5)* 10
            cone.position.y = (Math.random() - 0.5)* 20
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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/** 
 * Ghosts 
 */
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xff2600, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0x21ff35, 2, 3)
scene.add(ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor(0x262837)

/**
 * Shadows
 */
 renderer.shadowMap.enabled = true
 renderer.shadowMap.type = THREE.PCFSoftShadowMap

 moonLight.castShadow = true
 doorLight.castShadow = true
 ghost1.castShadow = true
 ghost2.castShadow = true
 ghost3.castShadow = true

 walls.castShadow = true
 bush1.castShadow = true
 bush2.castShadow = true
 bush3.castShadow = true
 bush4.castShadow = true
 bush5.castShadow = true

 floor.receiveShadow = true

 doorLight.shadow.mapSize.width = 256
 doorLight.shadow.mapSize.heigth = 256
 doorLight.shadow.camera.far = 7

 ghost1.shadow.mapSize.width = 256
 ghost1.shadow.mapSize.heigth = 256
 ghost1.shadow.camera.far = 7

 ghost2.shadow.mapSize.width = 256
 ghost2.shadow.mapSize.heigth = 256
 ghost2.shadow.camera.far = 7

 ghost3.shadow.mapSize.width = 256
 ghost3.shadow.mapSize.heigth = 256
 ghost3.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Ghosts
    const ghost1Angle = elapsedTime *0.5
    ghost1.position.x = Math.cos(ghost1Angle) *3
    ghost1.position.z = Math.sin(ghost1Angle)* 3
    ghost1.position.y = Math.sin(elapsedTime*3)
    
    const ghost2Angle = - elapsedTime *0.32
    ghost2.position.x = Math.cos(ghost2Angle) *5
    ghost2.position.z = Math.sin(ghost2Angle)* 5
    ghost2.position.y = Math.sin(elapsedTime*2) + Math.sin(elapsedTime*4)
    
    const ghost3Angle = elapsedTime *0.25
    ghost3.position.x = Math.cos(ghost3Angle) * (5.5 + Math.sin(elapsedTime*0.42))
    ghost3.position.z = Math.sin(ghost3Angle) * (6 + Math.sin(elapsedTime*0.32))
    ghost3.position.y = Math.sin(elapsedTime*2) * Math.sin(elapsedTime*4)

    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()