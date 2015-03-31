require(["js/vector"], function(vector) {
    var scene, camera, renderer;
    var geometry, material;

    var WIDTH = window.innerWidth * 0.95,
        HEIGHT = window.innerHeight * 0.95;

    var mouseX = 0, mouseY = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    var cameraSpinning = true,
        cameraSpeed = 0.05;

    var LORENZ_POS_INITIAL = new Vector(rand(10), rand(10), rand(10)),
        LORENZ_SIGMA = 10,
        LORENZ_RHO = 28,
        LORENZ_BETA = 8 / 3,
        LORENZ_DELTA = 0.01;

    var pos = LORENZ_POS_INITIAL,
        oldPos = pos,
        elapsedTime = 0;

    var lorenzSystem = function (pos, sigma, rho, beta) {
        var x = sigma * (pos.y - pos.x),
            y = pos.x * (rho - pos.z) - pos.y,
            z = pos.x * pos.y - (beta * pos.z);
        return new Vector(x, y, z);
    };

    var nextPoint = function (x) {
        return lorenzSystem(x, LORENZ_SIGMA, LORENZ_RHO, LORENZ_BETA);
    };

    initializeLegend();
    initializeCamera();
    renderScene();

    function initializeCamera() {
        scene = new THREE.Scene();

        // Configure camera settings
        camera = new THREE.PerspectiveCamera(50, WIDTH/HEIGHT, 0.1, 1000);
        camera.position.set(0, 0, 200);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.setLens(70); // set focal length

        // Configure renderer
        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor( 0xffffff, 1 );

        // Append WebGLRenderer to body
        document.body.appendChild(renderer.domElement);

        // Material will be lines connecting each point of the lorenz system
        material = new THREE.LineDashedMaterial({
            linewidth: 1,
            color: 0x000000
        });

        geometry = new THREE.Geometry();
        geometry.dynamic = true;

        renderer.render(scene, camera);
    }

    function renderScene() {
        requestAnimationFrame(renderScene);

        oldPos = pos;
        // Vector.rk4 uses Runge-Kutta method
        pos = pos.rk4(LORENZ_DELTA, nextPoint);
        elapsedTime += LORENZ_DELTA;

        var geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(oldPos.x, oldPos.y, oldPos.z));
        geo.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));

        var col = new THREE.Color(colorScale(pos.x), colorScale(pos.y), colorScale(pos.z));
        material.color = col;

        var line = new THREE.Line(geo, material);
        scene.add(line); 

        if (cameraSpinning) {
            // Spin camera around the visualization
            var timer = new Date().getTime() * 0.0005; 
            camera.position.x = Math.floor(Math.cos( timer ) * 200);
            camera.position.z = Math.floor(Math.sin( timer ) * 200);
            camera.lookAt( scene.position );
        }      

        updateLegend();
        renderer.render(scene, camera);
    }

    function rotateCamera() {

        if (event.keyCode == 37) {
            // Left key
            rotate("left");
        } else if (event.keyCode == 39) { 
            // Right key
            rotate("right");
        } else {
            // Any other key toggles auto-spinning
            setCameraMode();
        }
        
        camera.lookAt(scene.position);
    }

    function rotate(direction) {
        var x = camera.position.x,
            y = camera.position.y,
            z = camera.position.z;

        if (direction == "left") {
            camera.position.x = x * Math.cos(cameraSpeed) + z * Math.sin(cameraSpeed);
            camera.position.z = z * Math.cos(cameraSpeed) - x * Math.sin(cameraSpeed);
        } else if (direction == "right") {
            camera.position.x = x * Math.cos(cameraSpeed) - z * Math.sin(cameraSpeed);
            camera.position.z = z * Math.cos(cameraSpeed) + x * Math.sin(cameraSpeed);
        }

    }

    function initializeLegend() {
        // Display initial value in the legend
        var initialValue = document.getElementById("initialValue");
        initialValue.innerText = LORENZ_POS_INITIAL;

        var s = document.getElementById("sigma");
        var r = document.getElementById("rho");
        var b = document.getElementById("beta");

        s.innerText = LORENZ_SIGMA.toFixed(2);
        r.innerText = LORENZ_RHO.toFixed(2);
        b.innerText = LORENZ_BETA.toFixed(2);
    }

    function updateLegend() {
        // Updates the elapsed time
        var time = document.getElementById("time");
        time.innerText = elapsedTime.toFixed(2);

    }

    function rand(n) {
        return Math.floor(Math.random() * n) + 1;
    }

    function colorScale(n) {
        // Cheesy math to change the material color
        return Math.abs(n)/40;
    }

    function setCameraMode() {
        return (cameraSpinning = !cameraSpinning); 
    }

    document.addEventListener("keydown", rotateCamera, false);

});

