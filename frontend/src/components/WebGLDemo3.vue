<template>
    <div>
        <div>3D + rotate</div>
        <canvas id="glcanvas_3" style="width:300px;height:300px; background-color: red;">
        </canvas>
    </div>
</template>

<script>
import {initWebGL, initShaderProgram} from "@/utils/init-gl"
import {initBuffers} from "@/utils/init-buffers.js"
import {drawScene, setColorAttribute} from "@/utils/draw-scene"

export default {
    name: 'WebGLTest',
    mounted() {
        var canvas = document.getElementById("glcanvas_3");
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;

        console.log(this.viewportWidth, this.viewportHeight)

        let gl = initWebGL(canvas);
        if(!gl)
            return

        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        
        this.demo(gl)

        this.gl = gl
    },
    methods: {
        demo(gl) { // add 2D content
            let deltaTime = 0;

            const shaderProgram = initShaderProgram(gl)

            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                },
                dimension: 3
            };

            const positions = [
                // Front face
                -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
                // Back face
                -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
                // Top face
                -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
                // Bottom face
                -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
                // Right face
                1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
                // Left face
                -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
            ];
            const colors = [
                [1.0, 1.0, 1.0, 1.0], // Front face: white
                [1.0, 0.0, 0.0, 1.0], // Back face: red
                [0.0, 1.0, 0.0, 1.0], // Top face: green
                [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
                [1.0, 1.0, 0.0, 1.0], // Right face: yellow
                [1.0, 0.0, 1.0, 1.0], // Left face: purple
            ];
            const buffers = initBuffers(gl, positions, colors);

            let cubeRotation = 0.0;
            setColorAttribute(gl, buffers, programInfo);
            let then = 0;

            //drawScene(gl, programInfo, buffers, cubeRotation);

            // Draw the scene repeatedly
            function render(now) {
                now *= 0.001; // convert to seconds
                deltaTime = now - then;
                then = now;

                drawScene(gl, programInfo, buffers, cubeRotation);
                cubeRotation += deltaTime;

                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        },
        
        
    }
}
</script>
  
<style>
</style>

