var http = require('http');
var app = require('./config/express');
require('./config/database')(process.env.MONGODB_URI);

http.createServer(app).listen(3000, function() {
    console.log('Servidor iniciado');
});