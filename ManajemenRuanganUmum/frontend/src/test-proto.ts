import * as THREE from "three";
const myThree = Object.create(THREE);
myThree.VertexColors = 2;
console.log("Color is valid: ", new myThree.Color() instanceof THREE.Color);
console.log("VertexColors: ", myThree.VertexColors);
