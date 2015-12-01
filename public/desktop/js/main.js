(function(){
    var socket = io();
    
    socket.on('test-message', function (data) {
        console.log('test-message');
    });
})();
