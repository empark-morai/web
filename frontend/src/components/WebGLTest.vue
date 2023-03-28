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
        
        // this.drawTriangle(gl)

        console.log(gl)
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
        clear() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
        }
    }
}
</script>
  
<style>
</style>

