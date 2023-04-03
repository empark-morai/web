<template>
    <div>
        <button @click="addRoof(this.scene)"> 지붕추가 </button>        
        <button @click="addGround(this.scene)">  바닥추가 </button>        
        <canvas id="babylon_canvas" style="width:500px;height:500px; background-color: red;">
        </canvas>
    </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import LINK from '@/assets/link_set.json'

export default {
    mounted() {
        var canvas = document.getElementById("babylon_canvas");        
        this.scene = this.demo_2(canvas)
        console.log(LINK)
    },
    methods: {
        demo_1(canvas) {
            var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
            var createScene = function(){
                // Create a basic BJS Scene object
                var scene = new BABYLON.Scene(engine);
                // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
                var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
                // Target the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());
                // Attach the camera to the canvas
                camera.attachControl(canvas, false);
                // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
                // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
                var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
                // Move the sphere upward 1/2 of its height
                sphere.position.y = 1;
                // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
                var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
                // Return the created scene 
                return scene; 
            }

            // call the createScene function 
            var scene = createScene();


            let mySphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
                diameter: 1
            }, scene);
            // Give the sphere mesh a height so it spawns above the ground
            mySphere.position.y = 2;
            // Create a Pysics Imposter around the Sphere, and enable collisions so it interacts with other parts of the scene
            


            // run the render loop
            engine.runRenderLoop(function(){
                scene.render();
            });
            // the canvas/window resize event handler
            window.addEventListener('resize', function(){
                engine.resize();
            });

            return scene
        },
        demo_2(canvas) {
            var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
            var createScene = function(){
                const scene = new BABYLON.Scene(engine);

                const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 7, new BABYLON.Vector3(0, 0, 0));
                camera.attachControl(canvas, true);

                const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
                
                const box = BABYLON.MeshBuilder.CreateBox("box", {});
                const boxMat = new BABYLON.StandardMaterial("boxMat");
                boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
                box.material = boxMat;

                return scene;
            }

            // call the createScene function 
            var scene = createScene();
            // run the render loop
            engine.runRenderLoop(function(){
                scene.render();
            });
            // the canvas/window resize event handler
            window.addEventListener('resize', function(){
                engine.resize();
            });

            return scene
        },
        addRoof(scene) {
            let roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
                diameter: 1.3, height: 1.2, tessellation: 3
            }, scene);
            roof.scaling.x = 0.75;
            roof.rotation.z = Math.PI / 2;
            roof.position.y = 0.7;

            const roofMat = new BABYLON.StandardMaterial("roofMat");
                roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
                roof.material = roofMat;
        },
        addGround(scene) {
            // ground
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, scene);
            ground.position.y = -0.5;
            const groundMat = new BABYLON.StandardMaterial("groundMat");
                groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
                ground.material = groundMat; //Place the material property of the ground
        }
    }
}
</script>
  
<style>
</style>

