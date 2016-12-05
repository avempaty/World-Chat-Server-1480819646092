var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));
app.use(express.static(path.resolve(__dirname, "client")));

var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);

var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);


var users = [];

/*function updateScroll() {
    var element = document.getElementById("ChatWindow");
    console.log(element.scrollHeight);
    element.scrollTop = element.scrollHeight + 20;
    //element.scrollIntoView();
};*/
io.on('connection', function (socket) {
    var username = '';
    console.log('A user has connected!');
    socket.on('request-users', function () {
        socket.emit('users', {
            users: users
        });
    });
    socket.on('message', function (data) {
        io.emit('message', {
            username: username
            , message: data.message
        });
        //updateScroll();
    });
    socket.on('add-user', function (data) {
        console.log(data.username + ' has connected!');
        if (users.indexOf(data.username) == -1) {
            io.emit('add-user', {
                username: data.username
            });
            username = data.username;
            users.push(data.username);
        }
        else {
            socket.emit('prompt-username', {
                message: 'Username Already Exists'
            })
        }
    })
    socket.on('disconnect', function () {
        if (username != "") {
            console.log(username + ' has disconnected!');
            users.splice(users.indexOf(username), 1);
            io.emit('remove-user', {
                username: username
            });
        }
    });
});
app.get('/*', function (req, res) {
    res.render('index.ejs');
});
http.listen(port, function () {
    console.log("server is running" + port);
});