import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as Simplex from "https://cdn.skypack.dev/simplex-noise@4.0.1";

class VaporwaveManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

    
        this.timeOffset = Math.random() * 10;
        this.worldSize = 2048;
        this.noise = Simplex.createNoise3D();
        this.seed = Math.random() * 0xffffff;
        this.skyscraperCount = 10000;
    
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(this.worldSize * 2, this.worldSize * 2, 512, 512), new THREE.MeshToonMaterial({ color: 0x711A2D, side: THREE.DoubleSide }));
        plane.rotation.x = Math.PI * 0.5;
    
        for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
            const positionAttribute = plane.geometry.attributes.position;
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const height = -this.getHeightValue(x, y);
    
            positionAttribute.setZ(i, height);
        }
    

        this.scene.fog = new THREE.Fog(0xD33057, 0, 1000);
        this.skydome = new THREE.Mesh(new THREE.SphereGeometry(4000, 64, 32), new THREE.MeshBasicMaterial({ color: 0xFB5C6A, side: THREE.BackSide, fog: false }));
        this.cameraLight = new THREE.PointLight(0xffffff, 1, 250, 2);
        
        this.hemiLight = new THREE.HemisphereLight(0xFB5C6A, 0xEB928E, 0.1);

        this.createCity();

        this.scene.add(plane);
        this.scene.add(this.city);
        this.scene.add(this.cameraLight);
        this.scene.add(this.hemiLight);

        this.camera.position.set(0, 10, 10);
    }

    createCity() {
        const geometryList = [];
    
        for (let i = 0; i < this.skyscraperCount; i++) {
            const height = 50 + (Math.random() ** 5) * 150;
            const size = 10 + Math.round(Math.random() * 3) * 5;
            const skyscraperGeometry = new THREE.BoxGeometry(size, height, size);
            
            const gridSize = 48;
            const gridRandomOffset = gridSize * 0.5;
    
            let x, z;
            const isInvalid = () => {
                if (Math.abs(this.worldSize * 0.5 - Math.sqrt(x ** 2 + z ** 2)) < 25) return true;
    
                if (Math.random() < this.noise(x * 0.05, z * 0.05, this.seed + this.worldSize) * 0.5 + 0.5) return true;
    
                return false;
            }
            do {
                x = Math.round((Math.random() * 2 - 1) * this.worldSize / gridSize) * gridSize + (Math.random() - 0.5) * gridRandomOffset;
                z = Math.round((Math.random() * 2 - 1) * this.worldSize / gridSize) * gridSize + (Math.random() - 0.5) * gridRandomOffset;
            } while (isInvalid())
    
            const matrix = new THREE.Matrix4();
            matrix.makeTranslation(x, height * 0.5 + this.getHeightValue(x, z) - 5, z);
            skyscraperGeometry.applyMatrix4(matrix);

            geometryList.push(skyscraperGeometry);
        }

        const material = new THREE.MeshToonMaterial({ color: 0x7F031E });
        const geometry = BufferGeometryUtils.mergeGeometries(geometryList, false);
        this.city = new THREE.Mesh(geometry, material);
    }
    
    calculateTangent(x, z) {
        const epsilon = 0.0001;

        const dx = epsilon;
        const dz = epsilon;

        const y0 = this.getHeightValue(x, z);

        const y1 = this.getHeightValue(x + dx, z);
        const y2 = this.getHeightValue(x, z + dz);

        const rx = Math.atan((y1 - y0) / dx);
        const ry = Math.atan((y2 - y0) / dz);
        const rz = Math.atan(Math.sqrt(Math.pow((y1 - y0) / dx, 2) + Math.pow((y2 - y0) / dz, 2)));

        return [rx, ry, rz];
    }

    getHeightValue(x, z) {
        const distanceOffset = (Math.sqrt(x ** 2 + z ** 2) / (this.worldSize * 0.2));
        return this.noise(x * 0.001, z * 0.001, this.seed) * 50 + distanceOffset * 75;
    }

    frame() {
        const time = performance.now() * 0.001 + this.timeOffset;
        const cameraSpeed = 0.05;

        this.camera.position.x = Math.cos(time * cameraSpeed) * this.worldSize * 0.5;
        this.camera.position.z = Math.sin(time * cameraSpeed) * this.worldSize * -0.5;

        const trackHeight = Math.abs(this.noise(time * cameraSpeed * 0.5, this.seed - 100, this.seed));
        this.camera.position.y = (trackHeight ** 1.25) * 50 + 20 + this.getHeightValue(this.camera.position.x, this.camera.position.z);

        this.camera.rotation.y = time * cameraSpeed;
        this.cameraLight.position.x = this.camera.position.x;
        this.cameraLight.position.y = this.camera.position.y;
        this.cameraLight.position.z = this.camera.position.z;

        this.cameraLight.distance = this.camera.position.y + 300;


        const surfaceDeflectionTangent = this.calculateTangent(this.camera.position.x, this.camera.position.z);
        this.camera.rotation.z = surfaceDeflectionTangent[2] * 0.5;

        document.body.style.setProperty("--cameraRZ", this.camera.rotation.z + "rad");
    }
}

export default VaporwaveManager;