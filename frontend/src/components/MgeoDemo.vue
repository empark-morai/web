<template>
    <div>
        <canvas id="mgeo_canvas" style="width:100%;height:800px; background-color: red;">
        </canvas>
    </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import LINK_SET from '@/assets/link_set_2.json'
import { fixRequestBody } from 'http-proxy-middleware';

export default {
    mounted() {
        var canvas = document.getElementById("mgeo_canvas");        
        this.scene = this.createBase(canvas)
        
        for(let link_info of LINK_SET) {
            if(link_info.lazy_init)
                continue

            //this.createLink(link_info)
            //this.createLink2D(link_info) 

            var path = [ 	
                new BABYLON.Vector3(-20, 0, 0),
                new BABYLON.Vector3(-10, 10, 0),
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(10, 10, 0),
                new BABYLON.Vector3(20, 0, 0),
                new BABYLON.Vector3(10, -10, 0)
            ]
            var line = this.create2DTest("line", {path: path, width:1.5}, this.scene);
        }
    },
    methods: {
        createBase(canvas) {             
            var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
            var createScene = function() {
                // Create a basic BJS Scene object 
                var scene = new BABYLON.Scene(engine);
                
                //const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 400, new BABYLON.Vector3(0, 0, 0));
                const camera = new BABYLON.ArcRotateCamera("camera", 1.571554881093752, 2.5, 400, new BABYLON.Vector3(0, 0, 0));
                camera.attachControl(canvas, true);
                
                var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
                
                // Return the created scene
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
                console.log(scene.cameras[0])
            });

            // x: red, y: green, z: blue
            new BABYLON.AxesViewer(scene, 30);

            return scene 
        },
        createLine(name, path) {         
            const options = {
                points: path,
                updatable: true
            }
            
            let lines = BABYLON.MeshBuilder.CreateLines("lines", options);
            
            options.points[0] = new BABYLON.Vector3(-2, 1, -1);
            options.points[1] = new BABYLON.Vector3(0, -1, 0);
            options.points[2] = new BABYLON.Vector3(2, 0, 0);
            options.points[3] = new BABYLON.Vector3(-1, -2, 0);

            options.instance = lines;

            lines = BABYLON.MeshBuilder.CreateLines("lines", options, this.scene);
        },
        createLink(link_info) {
            let path = []
            for(let point of link_info.points) {
                path.push(new BABYLON.Vector3(point[0], point[1], point[2]))
            }
            
            const options = {
                points: path,
                updatable: true
            }
            
            let lines = BABYLON.MeshBuilder.CreateLines(link_info.idx, options, this.scene);
        },
        create2DTest(name, options, scene) {
            //Arrays for vertex positions and indices
            var positions = [];
            var indices = [];
            var normals = [];

            var width = options.width / 2 || 0.5;
            var path = options.path;
            
            var innerData = [];
            var outerData = [];
            var angle = 0;
            
            var nbPoints = path.length;
            var line = BABYLON.Vector3.Zero();
            var nextLine = BABYLON.Vector3.Zero();
            path[1].subtractToRef(path[0], line);
            
            let lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0).normalize();

            var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 8}, scene);
            sphere1.position = new BABYLON.Vector3(lineNormal[0], lineNormal[1], lineNormal[2]);
            const localAxes = new BABYLON.AxesViewer(this.scene, 10);
            localAxes.xAxis.parent = sphere1;
            localAxes.yAxis.parent = sphere1;
            localAxes.zAxis.parent = sphere1;	

            line.normalize()
            innerData[0] = path[0].subtract(lineNormal.scale(width));
            outerData[0] = path[0].add(lineNormal.scale(width));
        
            for(var p = 0; p < nbPoints - 2; p++) {	
                path[p + 2].subtractToRef(path[p + 1], nextLine)
                angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()))
                let direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;			
                lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0).normalize();
                line.normalize();
                innerData[p + 1] = path[p + 1].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
                outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
                line = nextLine.clone();		
            }
            if(nbPoints > 2) {
                path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
                lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0).normalize();
                line.normalize();		
                innerData[nbPoints - 1] = path[nbPoints - 1].subtract(lineNormal.scale(width));
                outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width));
            }
            else {
                innerData[1] = path[1].subtract(lineNormal.scale(width));
                outerData[1] = path[1].add(lineNormal.scale(width));
            } 
        
            var maxX = Number.MIN_VALUE;
            var minX = Number.MAX_VALUE;
            var maxY = Number.MIN_VALUE;
            var minY = Number.MAX_VALUE;
            
            for(var p = 0; p < nbPoints; p++) {
                positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
                maxX = Math.max(innerData[p].x, maxX);
                minX = Math.min(innerData[p].x, minX);
                maxY = Math.max(innerData[p].y, maxY);
                minY = Math.min(innerData[p].y, minY);
            }

            for(var p = 0; p < nbPoints; p++) {
                positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
                maxX = Math.max(innerData[p].x, maxX);
                minX = Math.min(innerData[p].x, minX);
                maxY = Math.max(innerData[p].y, maxY);
                minY = Math.min(innerData[p].y, minY);
            }

            for(var i = 0; i < nbPoints - 1; i++) {
                indices.push(i, i + 1, nbPoints + i + 1);
                indices.push(i, nbPoints + i + 1, nbPoints + i)
            }
            
            if(nbPoints > 2 && closed) {
                indices.push(nbPoints - 1, 0, nbPoints);
                indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
            }

            var normals = [];
            var uvs =[];

            /* if(standardUV) {
                for(var p = 0; p < positions.length; p += 3) {
                    uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 2] - minZ)/(maxZ - minZ));               
                }
            }
            else { */
                var flip = 0;
                var p1 = 0;
                var p2 = 0;
                var p3 = 0;
                var v0 = innerData[0];
                var v1 = innerData[1].subtract(v0);

                var v2 = outerData[0].subtract(v0);
                var v3 = outerData[1].subtract(v0);
                var axis = v1.clone();
                axis.normalize();

                p1 = BABYLON.Vector3.Dot(axis,v1);
                p2 = BABYLON.Vector3.Dot(axis,v2);
                p3 = BABYLON.Vector3.Dot(axis,v3);
                var minX = Math.min(0, p1, p2, p3);
                var maxX = Math.max(0, p1, p2, p3);
                
                uvs[2 * indices[0]] = -minX/(maxX - minX);
                uvs[2 * indices[0] + 1] = 1;
                uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
                uvs[2 * indices[5] + 1] = 0;
                
                uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
                uvs[2 * indices[1] + 1] = 1;
                uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
                uvs[2 * indices[4] + 1] = 0;
            
                for(var i = 6; i < indices.length; i +=6) {
                    flip = (flip + 1) % 2;
                    v0 = innerData[0];
                    v1 = innerData[1].subtract(v0);
                    v2 = outerData[0].subtract(v0);
                    v3 = outerData[1].subtract(v0);
                    axis = v1.clone();
                    axis.normalize();

                    p1 = BABYLON.Vector3.Dot(axis,v1);
                    p2 = BABYLON.Vector3.Dot(axis,v2);
                    p3 = BABYLON.Vector3.Dot(axis,v3);
                    var minX = Math.min(0, p1, p2, p3);
                    var maxX = Math.max(0, p1, p2, p3);
                
                    uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
                    uvs[2 * indices[i + 1] + 1] = 1;
                    uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
                    uvs[2 * indices[i + 4] + 1] = 0;
                }
            //}
            
            BABYLON.VertexData.ComputeNormals(positions, indices, normals);
            BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
            console.log(uvs)		
            //Create a custom mesh  
            var customMesh = new BABYLON.Mesh("custom", scene);

            //Create a vertexData object
            var vertexData = new BABYLON.VertexData();

            //Assign positions and indices to vertexData
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.normals = normals;
            vertexData.uvs = uvs;

            //Apply vertexData to custom mesh
            vertexData.applyToMesh(customMesh);
            
            return customMesh;
        },
        createLink2D(link_info) {
            var closed = false;

            // Arrays for vertex positions and indices
            var positions = [];
            var indices = [];
            var normals = [];

            var width = link_info.width_start;
            var path = [];
            for(let point of link_info.points) {
                path.push(new BABYLON.Vector3(point[0], point[1], point[2]))
            }
            
            var outerData = [];
            var innerData = [];
            var angle = 0;
            
            var nbPoints = path.length;
            var line = BABYLON.Vector3.Zero();
            var nextLine = BABYLON.Vector3.Zero();
            
            path[1].subtractToRef(path[0], line); // line = path[1]-path[0]
            
            if(nbPoints > 2 && closed) {	
                path[2].subtractToRef(path[1], nextLine);    
                for(var p = 0; p < nbPoints; p++) {    
                    angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
                    let direction = BABYLON.Vector3.Cross(line, nextLine).normalize().y;                
                    let lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
                    line.normalize();
                    innerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints];
                    outerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
                    line = nextLine.clone();        
                    path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
                }
            }
            else { 
                let lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0).normalize();
                line.normalize();
                innerData[0] = path[0];
                outerData[0] = path[0].add(lineNormal.scale(width));
                
                for(var p = 0; p < nbPoints - 2; p++) {	
                    path[p + 2].subtractToRef(path[p + 1], nextLine);
                    angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
                    let direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;			
                    lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0).normalize();
                    line.normalize();
                    innerData[p + 1] = path[p + 1];
                    outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
                    line = nextLine.clone();
                }
                if(nbPoints > 2) {
                    path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
                    lineNormal = new BABYLON.Vector3(-line.y, 1 * line.x, 0 ).normalize();
                    line.normalize()
                    innerData[nbPoints - 1] = path[nbPoints - 1]
                    outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width))
                }
                else {
                    innerData[1] = path[1]
                    outerData[1] = path[1].add(lineNormal.scale(width));
                }
            }
        
            var maxX = Number.MIN_VALUE;
            var minX = Number.MAX_VALUE;
            var maxZ = Number.MIN_VALUE;
            var minZ = Number.MAX_VALUE;
            
            for(var p = 0; p < nbPoints; p++) {
                positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
                maxX = Math.max(innerData[p].x, maxX);
                minX = Math.min(innerData[p].x, minX);
                maxZ = Math.max(innerData[p].z, maxZ);
                minZ = Math.min(innerData[p].z, minZ);
            }

            for(var p = 0; p < nbPoints; p++) {
                positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
                maxX = Math.max(innerData[p].x, maxX);
                minX = Math.min(innerData[p].x, minX);
                maxZ = Math.max(innerData[p].z, maxZ);
                minZ = Math.min(innerData[p].z, minZ);
            }

            for(var i = 0; i < nbPoints - 1; i++) {
                indices.push(i, i + 1, nbPoints + i + 1);
                indices.push(i, nbPoints + i + 1, nbPoints + i)
            }
            
            if(nbPoints > 2 && closed) {
                indices.push(nbPoints - 1, 0, nbPoints);
                indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
            }

            var normals = [];
            var uvs =[];

            /*if(standardUV) {
                for(var p = 0; p < positions.length; p += 3) {
                    uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 2] - minZ)/(maxZ - minZ));                
                }
            }
            else {*/
                var flip = 0;
                var p1 = 0;
                var p2 = 0;
                var p3 = 0;
                var v0 = innerData[0];
                var v1 = innerData[1].subtract(v0);
                var v2 = outerData[0].subtract(v0);
                var v3 = outerData[1].subtract(v0);
                var axis = v1.clone();
                axis.normalize();

                p1 = BABYLON.Vector3.Dot(axis,v1);
                p2 = BABYLON.Vector3.Dot(axis,v2);
                p3 = BABYLON.Vector3.Dot(axis,v3);
                var minX = Math.min(0, p1, p2, p3);
                var maxX = Math.max(0, p1, p2, p3);
                
                uvs[2 * indices[0]] = -minX/(maxX - minX);
                uvs[2 * indices[0] + 1] = 1;
                uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
                uvs[2 * indices[5] + 1] = 0;
                
                uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
                uvs[2 * indices[1] + 1] = 1;
                uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
                uvs[2 * indices[4] + 1] = 0;
            
                for(var i = 6; i < indices.length; i +=6) {                
                    flip = (flip + 1) % 2;
                    v0 = innerData[0];
                    v1 = innerData[1].subtract(v0);
                    v2 = outerData[0].subtract(v0);
                    v3 = outerData[1].subtract(v0);
                    axis = v1.clone();
                    axis.normalize();

                    p1 = BABYLON.Vector3.Dot(axis,v1);
                    p2 = BABYLON.Vector3.Dot(axis,v2);
                    p3 = BABYLON.Vector3.Dot(axis,v3);
                    var minX = Math.min(0, p1, p2, p3);
                    var maxX = Math.max(0, p1, p2, p3);
                
                    uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
                    uvs[2 * indices[i + 1] + 1] = 1;
                    uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
                    uvs[2 * indices[i + 4] + 1] = 0;
                }
            //}
            
            BABYLON.VertexData.ComputeNormals(positions, indices, normals);
            BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
            
            //Create a custom mesh  
            const localAxes = new BABYLON.AxesViewer(this.scene, 1);

            var customMesh = new BABYLON.Mesh("custom", this.scene);
            localAxes.xAxis.parent = customMesh;
            localAxes.yAxis.parent = customMesh;
            localAxes.zAxis.parent = customMesh;	

            //Create a vertexData object
            var vertexData = new BABYLON.VertexData();

            //Assign positions and indices to vertexData
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.normals = normals;
            vertexData.uvs = uvs;

            //Apply vertexData to custom mesh
            vertexData.applyToMesh(customMesh);
            
            return customMesh;
        }
    }
}
</script>
  
<style>
</style>

