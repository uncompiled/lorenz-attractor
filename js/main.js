require(["js/vector"], function(vector) {
    var scene, camera, renderer;
    var geometry, material;

    var WIDTH = window.innerWidth * 0.95,
        HEIGHT = window.innerHeight * 0.95;

    var mouseX = 0, mouseY = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    var LORENZ_POS_INITIAL = new Vector(10, 1, 10),
        LORENZ_SIGMA = 10,
        LORENZ_RHO = 28,
        LORENZ_BETA = 8 / 3;

    var pos = LORENZ_POS_INITIAL,
        oldPos = pos;

    var lorenzSystem = function (pos, sigma, rho, beta) {
        var x = sigma * (pos.y - pos.x),
            y = pos.x * (rho - pos.z) - pos.y,
            z = pos.x * pos.y - (beta * pos.z);
        return new Vector(x, y, z);
    };

    var nextPoint = function (x) {
        return lorenzSystem(x, LORENZ_SIGMA, LORENZ_RHO, LORENZ_BETA);
    };

    initialize();
    render();

    function initialize() {
        scene = new THREE.Scene();

        // Configure camera settings
        camera = new THREE.PerspectiveCamera(50, WIDTH/HEIGHT, 0.1, 1000);
        camera.position.set(0, 0, 200);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.setLens(80);

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

    function render() {
        requestAnimationFrame(render);

        oldPos = pos;
        // Vector.rk4 uses Runge-Kutta method
        pos = pos.rk4(0.01, nextPoint);

        var geo = new THREE.Geometry();
        var col = new THREE.Color(colorScale(pos.x), colorScale(pos.y), colorScale(pos.z));
        material.color = col;

        var line = new THREE.Line(geo, material);
        geo.vertices.push(new THREE.Vector3(oldPos.x, oldPos.y, oldPos.z));
        geo.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        scene.add(line);

        // Spin camera around the visualization
        var timer = new Date().getTime() * 0.0005; 
        camera.position.x = Math.floor(Math.cos( timer ) * 200);
        camera.position.z = Math.floor(Math.sin( timer ) * 200);
        camera.lookAt( scene.position );

        renderer.render(scene, camera);
    }

    function colorScale(n) {
        // Cheesy math to change the material color
        return Math.abs(n)/40;
    }

});

