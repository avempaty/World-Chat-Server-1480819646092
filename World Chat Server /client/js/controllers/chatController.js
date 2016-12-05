myApp.controller('chatController',['$scope','Socket',function($scope, Socket){
    Socket.connect();
    $scope.users = [];
    $scope.messages = [];
    $scope.currUsername = "";
    
    $scope.guest = "Guest";
    
    //$scope.currPassword = "";
    
    function updateScroll() {
        var element = document.getElementById("ChatWindow");
        console.log(element.scrollHeight);
        element.scrollTop = element.scrollHeight + 20;
        //element.scrollIntoView();
    }
    
    var promptUsername = function(message) {
        bootbox.prompt(message, function(name) {
            if (name == "") {
                promptUsername('You must enter a username!');
            }
            else if(name != null && name != "") {
                Socket.emit('add-user', {username: name});
                $scope.currUsername = name;
                $scope.guest = name;
            } else {
                $scope.currUsername = "";
            }
        })
    };
    
    $scope.sendMessage = function(msg){
        if ($scope.currUsername != "") {
            if(msg != null && msg != '') {
                Socket.emit('message',{message: msg})
            }
            $scope.msg = '';
        }
        updateScroll();
    };
    
    if ($scope.currUsername == "") {
        promptUsername("What is your name?");
    }
    
    Socket.emit('request-users', {});
    
    Socket.on('users', function(data){
        $scope.users = data.users;
    });
    
    Socket.on('message', function(data){
        //if ($scope.currUsername != "") {
            $scope.messages.push(data);
            updateScroll();
        //}
    });
    
    Socket.on('add-user', function(data){
        if (data.username != "") {
            $scope.users.push(data.username);
            $scope.messages.push({
                username: data.username, 
                message: 'has entered the channel.'
            });
        }
    });
    
    Socket.on('remove-user', function(data){
        /*$scope.users.splice($scope.users.indexOf(data.username), 1);
        $scope.messages.push({
            username: data.username,
            message: 'has left the channel'
        });*/
        $scope.users.splice($scope.users.indexOf(data.username), 1);
        $scope.messages.push({username: data.username, message: 'has left the channel.'
        });
    });
    
    Socket.on('prompt-username', function(data){
        promptUsername(data.message);
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });
}])