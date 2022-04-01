import * as THREE from 'three';
import Experience from '../Experience';

export default class Environment 
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }
        
        this.setSunLight();
        this.setEnvironmentMap();
    }
    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1.5)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('Sunlight')
                .min(0)
                .max(3)
                .step(0.0001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('SunPosX')
                .min(-10)
                .max(10)
                .step(0.0001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('SunPosY')
                .min(0)
                .max(10)
                .step(0.0001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('SunPosZ')
                .min(-10)
                .max(10)
                .step(0.0001)
        }
    }
    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.3
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debug
            this.debugFolder
            .add(this.environmentMap, 'intensity')
                .name('Intensity')
                .min(0)
                .max(1)
                .step(0.0001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }

}