<template>
    <div>
        <div>2D + rotate</div>
        <canvas id="glcanvas_2" style="width:300px;height:300px; background-color: red;">
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
        var canvas = document.getElementById("glcanvas_2");
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
                dimension: 2
            };

            const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
            const colors = [
                1.0,
                1.0,
                1.0,
                1.0, // white
                1.0,
                0.0,
                0.0,
                1.0, // red
                0.0,
                1.0,
                0.0,
                1.0, // green
                0.0,
                0.0,
                1.0,
                1.0, // blue
            ];
            const buffers = initBuffers(gl, positions, colors);

            setColorAttribute(gl, buffers, programInfo);

            let squareRotation = 0.0;
            let deltaTime = 0;
            let then = 0;

            // Draw the scene repeatedly
            function render(now) {
                now *= 0.001; // convert to seconds
                deltaTime = now - then;
                then = now;

                drawScene(gl, programInfo, buffers, squareRotation);
                squareRotation += deltaTime;

                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        },
        
        
    }
}
</script>
  
<style>
</style>

