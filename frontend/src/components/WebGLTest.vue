<template>
    <div>
        <button @click="clear">Clear</button>
        <button @click="drawTriangle(this.gl)">Draw Triangle</button>
        <canvas id="glcanvas" style="width:300px;height:300px; background-color: red;">
            oh
        </canvas>
    </div>
</template>

<script>
import {initBuffers} from "@/utils/init-buffers.js"
import {drawScene, setColorAttribute} from "@/utils/draw-scene"

export default {
    name: 'WebGLTest',
    mounted() {
        var canvas = document.getElementById("glcanvas");
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;

        console.log(this.viewportWidth, this.viewportHeight)

        let gl = this.initWebGL(canvas);
        if(!gl)
            return

        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        
        //this.moveRect(gl)
        this.demo2(gl)
        

        this.gl = gl
    },
    methods: {
        initWebGL(canvas) {
            let gl = null

            try {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            }
            catch(e) {
                console.log(e)
            }

            // If we don't have a GL context, give up now 
            if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
                gl = null;
            }
            return gl;
        },
        drawTriangle(gl) {
            console.log(gl)

            //gl.viewport(0,0,gl)
            //gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

            const vertexData = new Float32Array([ 0, 1, 0, 1, -1, 0, -1, -1, 0, ]); 
            const buffer = gl.createBuffer()
            
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW); 
            
            console.log(buffer)

            const vertexShader = gl.createShader(gl.VERTEX_SHADER);  // 정점 셰이더: 정점 위치를 계산함
            gl.shaderSource(vertexShader, ` attribute vec3 position; void main() { gl_Position = vec4(position, 1); } `); 
            gl.compileShader(vertexShader); 

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 프래그먼트 셰이더: 현재 그려지는 프리미티브(점, 선, 삼각형 등)의 각 픽셀에 대한 색상을 계산함
            gl.shaderSource(fragmentShader, ` void main(){ gl_FragColor = vec4(1, 0, 0, 1); } `); 
            gl.compileShader(fragmentShader); 

            const program = gl.createProgram(); 
            gl.attachShader(program, vertexShader); 
            gl.attachShader(program, fragmentShader); 
            gl.linkProgram(program); 
            
            const positionLocation = gl.getAttribLocation(program, `position`); 
            gl.enableVertexAttribArray(positionLocation); 
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); 
            gl.useProgram(program);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
        demo1(gl) { // add 2D content
            const shaderProgram = this.initShaderProgram(gl)

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
            const buffers = initBuffers(gl, positions);

            setColorAttribute(gl, buffers, programInfo);
            drawScene(gl, programInfo, buffers);
        },
        demo2(gl) { // using color shader
            let squareRotation = 0.0;
            let deltaTime = 0;

            const shaderProgram = this.initShaderProgram(gl)

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
            const buffers = initBuffers(gl, positions);

            setColorAttribute(gl, buffers, programInfo);
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
        demo3(gl) {

        },
        moveRect(gl) {
            gl.enable(gl.DEPTH_TEST);


            var vertexData = [
                // 앞면(Front face)
                -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,

                // 뒤면(Back face)
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,

                // 위면(Top face)
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,

                // 아래면(Bottom face)
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,

                // 오른쪽면(Right face)
                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,

                // 왼쪽면(Left face)
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0
            ];
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW); 


            const vertexShader = gl.createShader(gl.VERTEX_SHADER);  // 정점 셰이더: 정점 위치를 계산함
            gl.shaderSource(vertexShader, ` attribute vec3 position; void main() { gl_Position = vec4(position, 1); } `); 
            gl.compileShader(vertexShader); 

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 프래그먼트 셰이더: 현재 그려지는 프리미티브(점, 선, 삼각형 등)의 각 픽셀에 대한 색상을 계산함
            gl.shaderSource(fragmentShader, ` void main(){ gl_FragColor = vec4(1, 0, 0, 1); } `); 
            gl.compileShader(fragmentShader); 

            const program = gl.createProgram(); 
            gl.attachShader(program, vertexShader); 
            gl.attachShader(program, fragmentShader); 
            gl.linkProgram(program); 

            const positionLocation = gl.getAttribLocation(program, `position`); 
            gl.enableVertexAttribArray(positionLocation); 
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); 
            gl.useProgram(program);            

            var colors = [
                [1.0,  1.0,  1.0,  1.0],    // 앞면 : 흰색
                [1.0,  0.0,  0.0,  1.0],    // 뒤면 : 빨간색
                [0.0,  1.0,  0.0,  1.0],    // 위면 : 녹색
                [0.0,  0.0,  1.0,  1.0],    // 아래면 : 파란색
                [1.0,  1.0,  0.0,  1.0],    // 오른쪽면 : 노란색
                [1.0,  0.0,  1.0,  1.0]     // 왼쪽면 : 보라색
            ];

            var generatedColors = [];
            for (let j=0; j<6; j++) {
                var c = colors[j];
                for (var i=0; i<4; i++) {
                    generatedColors = generatedColors.concat(c);
                }
            }

            let cubeVerticesColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

            let cubeVerticesIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
            var cubeVertexIndices = [
                0,  1,  2,      0,  2,  3,    // front
                4,  5,  6,      4,  6,  7,    // back
                8,  9,  10,     8,  10, 11,   // top
                12, 13, 14,     12, 14, 15,   // bottom
                16, 17, 18,     16, 18, 19,   // right
                20, 21, 22,     20, 22, 23    // left
            ];

            // 인덱스 배열을 GL에 전달

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
            //setMatrixUniforms();

          
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        },
        clear() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
        },
        initShaderProgram(gl) {
            const vsSource = `
                attribute vec4 aVertexPosition;
                attribute vec4 aVertexColor;

                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;

                varying lowp vec4 vColor;

                void main() {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                    vColor = aVertexColor;
                }
            `;

            const fsSource = `
                varying lowp vec4 vColor;
                
                void main(void) {
                    gl_FragColor = vColor;
                }
            `;

            const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                    shaderProgram
                )}`
                );
                return null;
            }

            return shaderProgram;
        },
        loadShader(gl, type, source) {
            const shader = gl.createShader(type);

            // Send the source to the shader object
            gl.shaderSource(shader, source);

            // Compile the shader program
            gl.compileShader(shader);

            // See if it compiled successfully
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(
                `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
                );
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        },
        
    }
}
</script>
  
<style>
</style>

