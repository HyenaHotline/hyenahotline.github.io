import * as THREE from "three";
import VaporwaveManager from "./vaporwave-manager.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, 1, 0.01, Number.MAX_SAFE_INTEGER);
let renderer, vm;

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function render() {
    requestAnimationFrame(render);
    vm.frame();
    renderer.render(scene, camera);
}

renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000, 0);

vm = new VaporwaveManager(scene, camera);
resize();
window.addEventListener("resize", resize);
requestAnimationFrame(render);

setTimeout(() => {
    document.body.classList.add("loaded");
}, 1);