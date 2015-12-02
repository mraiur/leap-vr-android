var http = require('http');
var url = require('url');
var fs = require('fs');
var qrcode = require('qrcode-terminal');
var socketIO = require('socket.io');
var leap = require('leapjs');
var config = {
    port: 5555,
    root: __dirname+"/",
    url: "http://localhost:5555/",
    public: __dirname+"/public"
};

var server = http.createServer(function(request, response) {

    if ('GET' !== request.method && 'HEAD' !== request.method) {
        return false; 
    }

    var path = url.parse(request.url).pathname;
    var self = this;
    var fileMatch = path.match(/(\/|\.html|\.js|\.css?)$/);

    if( path == "/"){
        path = "/index.html";
    }

    if (fileMatch) {
        fs.readFile(config.public+path, function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else 
            {
                var headers = { 'Content-Type': 'text/html' };

                if( fileMatch[0] === '.css'){
                    headers['Content-Type'] = "text/css"; 
                } else if( fileMatch[0] === '.js'){
                    headers['Content-Type'] = "text/javascript"; 
                }
                response.writeHead(200, headers);
                response.end(content, 'utf-8');
            }
        });
    } else {
        response.writeHead(404);
        response.write("File not found");
        response.end();
    }
}).listen(config.port, function(){
    console.log("Listening on "+config.url);
    qrcode.generate(config.url, function (qrcode) {
        console.log(qrcode);
    });
});


var io = socketIO(server);

io.on('connection', function (socket) {
    console.log('user connected');

    leap.loop(function(frame){
        for (var i in frame.handsMap) {
            var hand = frame.handsMap[i];

            var data = {
                roll: hand.roll(),
                pitch: hand.pitch(),
                yaw: hand.yaw(),
                direction: hand.direction
            };

            socket.broadcast.emit('hand', data);
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconected');        
    });
});