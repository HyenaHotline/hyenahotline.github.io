import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as Simplex from "https://cdn.skypack.dev/simplex-noise@4.0.1";

class VaporwaveManager {
    constructor(scene, camera, mode) {
        this.scene = scene;
        this.camera = camera;
        this.mode = mode;
    }

    async init() {
        this.timeOffset = Math.random() * 10;
        this.worldSize = 2048;
        this.noise = Simplex.createNoise3D();
        this.seed = Math.random() * 0xffffff;
        this.skyscraperCount = this.worldSize ** 2 * 0.0025;

        const ground = new THREE.Mesh(new THREE.PlaneGeometry(this.worldSize * 2, this.worldSize * 2, 512, 512), new THREE.MeshToonMaterial({ color: 0x711A2D, side: THREE.DoubleSide }));
        ground.rotation.x = Math.PI * 0.5;

        for (let i = 0; i < ground.geometry.attributes.position.count; i++) {
            const positionAttribute = ground.geometry.attributes.position;
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const height = -this.getHeightValue(x, y);

            positionAttribute.setZ(i, height);
        }

        const water = new THREE.Mesh(new THREE.PlaneGeometry(this.worldSize + 32768, this.worldSize + 32768), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        water.rotation.x = Math.PI * 0.5;


        this.scene.fog = new THREE.Fog(0xD33057, 0, 1000);
        this.skydome = new THREE.Mesh(new THREE.SphereGeometry(4000, 64, 32), new THREE.MeshBasicMaterial({ color: 0xFB5C6A, side: THREE.BackSide, fog: false }));
        this.cameraLight = new THREE.PointLight(0xffffff, 1, 250, 2);

        this.hemiLight = new THREE.HemisphereLight(0xFB5C6A, 0xEB928E, 0.1);

        await this.createCity();

        this.scene.add(ground);
        this.scene.add(this.city);
        this.scene.add(this.cameraLight);
        this.scene.add(this.hemiLight);

        this.camera.position.set(0, 10, 10);
    }

    createCity() {
        return new Promise((res, rej) => {
            const geometryList = [];

            let i = 0;
            let loopId;
            const makeSkyscraper = () => {
                const height = 50 + (Math.random() ** 5) * 150;
                const size = 10 + Math.round(Math.random() * 3) * 5;
                const skyscraperGeometry = new THREE.BoxGeometry(size, height, size);

                const gridSize = 48;
                const gridRandomOffset = gridSize * 0.5;

                let x, z;
                const isInvalid = () => {
                    if (Math.abs(this.worldSize * 0.5 - Math.sqrt(x ** 2 + z ** 2)) < 25 && this.mode == "walk") return true;

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

                i++;
                if (i >= this.skyscraperCount) {
                    return true;
                }
                return false;
            };
            const iteration = () => {
                for(let i = 0; i < 384; i++) {
                    let breaking = makeSkyscraper();
                    if(breaking) {
                        clearInterval(loopId);

                        const material = new THREE.MeshToonMaterial({ color: 0x7F031E });
                        const geometry = BufferGeometryUtils.mergeGeometries(geometryList, false);
                        this.city = new THREE.Mesh(geometry, material);
                        res();
                        break;
                    }
                }
            };

            loopId = setInterval(iteration, 1);
        });
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
        const distance = Math.sqrt(x ** 2 + z ** 2) / this.worldSize;

        const noise = (this.noise(x * 0.001, z * 0.001, this.seed) + this.noise(x * 0.0001, z * 0.0001, this.seed) * 5) + 3
        return noise * distance * 100;
    }

    frame() {
        const time = performance.now() * 0.001 + this.timeOffset;

        if(this.mode == "walk") {
            const cameraSpeed = this.worldSize * 0.25e-4;

            this.camera.position.x = Math.cos(time * cameraSpeed) * this.worldSize * 0.5;
            this.camera.position.z = Math.sin(time * cameraSpeed) * this.worldSize * -0.5;

            const trackHeight = Math.abs(this.noise(time * cameraSpeed * 0.5, this.seed - 100, this.seed));
            this.camera.position.y = (trackHeight ** 1.25) * 50 + 20 + this.getHeightValue(this.camera.position.x, this.camera.position.z);

            this.camera.rotation.y = time * cameraSpeed;
            this.cameraLight.position.x = this.camera.position.x;
            this.cameraLight.position.y = this.camera.position.y;
            this.cameraLight.position.z = this.camera.position.z;

            this.cameraLight.distance = this.camera.position.y + 300;


            this.camera.rotation.z = this.noise(time * 0.25, this.seed - 700, this.seed) * 0.025;
        }

        document.body.style.setProperty("--cameraRZ", this.camera.rotation.z + "rad");
    }
}

export default VaporwaveManager;