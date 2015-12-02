(function(){
    var socket = io();

    window.TO_RAD = Math.PI / 180;
    window.TO_DEG = 1 / TO_RAD;

    socket.on('connect', function (){
        console.log('main.js:4','connect');
        var startZ = cube.position.z;
        var startY = cube.rotation.y;
        socket.on('hand', function (data) {
            //console.log('hand', data);

            // 0 = front - back
            // 1 = left - right

            console.log(data.direction[0]);
            if( data.pitch > 0.5){
                var z = cube.position.z + data.direction[0];
                cube.position.setZ( z );
            }

            //cube.rotation.x += 0.01;
            //
            cube.rotation.y = startY + ( (data.roll * TO_DEG) / Math.PI  );
        });
    });
})();
