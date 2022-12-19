const vsUrl = "./shader/shape/vertex.vert";
const fsUrl = "./shader/shape/fragment.frag";

class Renderer {
    constructor() {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        const gl = canvas.getContext("webgl");
        document.body.appendChild(canvas);
        this.gl = gl;
        this.isInit = false;

        this.loadImage("./moon.jpg",(img)=>{
            this.img = img;
            this.loadShaders(vsUrl, fsUrl);
        });
    }

    loadImage(src, callback){
        const img = new Image();
        img.onload = ()=>{
            callback && callback(img);
            document.body.appendChild(img);
        }
        img.src = src;
    }

    loadShaders(vertexUrl, fragmentUrl) {
        this._loadXHR(vertexUrl, (response) => {
            this.vsSource = response;
            if (this.fsSource) {
                this._initShader();
            }
        });
        this._loadXHR(fragmentUrl, (response) => {
            this.fsSource = response;
            if (this.vsSource) {
                this._initShader();
            }
        });
    }

    _loadXHR(url, callback){
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange =  ()=> {
            if ((xhr.readyState ===  4) && (xhr.status === 200)) {
                callback && callback(xhr.responseText);
            } 
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    }

    _initShader() {
        if (this.isInit) return;
        this.isInit = true;
        const gl = this.gl;
        const vs = this._createShader(gl.VERTEX_SHADER, this.vsSource);
        const fs = this._createShader(gl.FRAGMENT_SHADER, this.fsSource);
        this.program = this._createProgram(vs, fs);
        this._draw();
    }

    _createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    _createProgram(vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    _draw() {
        const gl = this.gl;
        const program = this.program;

        const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
        const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');

        const positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(vertexPosition,2,gl.FLOAT,false,0,0);  
        gl.enableVertexAttribArray(aVertexPosition);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  
        gl.clearDepth(1.0);                
        gl.enable(gl.DEPTH_TEST);   
        gl.depthFunc(gl.LEQUAL);   
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(uProjectionMatrix,false,projectionMatrix);
        gl.uniformMatrix4fv(uModelViewMatrix,false,modelViewMatrix);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
}

const renderer = new Renderer();
