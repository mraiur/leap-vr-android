(function(){
    var socket = io();

    window.TO_RAD = Math.PI / 180;
    window.TO_DEG = 1 / TO_RAD;

    socket.on('connect', function (){
        console.log('main.js:4','connect');
        var startY = cube.rotation.y;
        socket.on('hand', function (data) {
            // data.direction[0] = front - back
            // data.direction[1] = left - right

            if( data.pitch > 0.5){
                var z = cube.position.z + (data.direction[0]*-1);
                cube.position.setZ( z );
            }
            cube.rotation.y = startY + ( (data.roll * TO_DEG) / Math.PI  );
        });
    });
})();
