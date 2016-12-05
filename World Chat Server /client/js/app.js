var myApp = angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'btford.socket-io']).
    config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
        $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeController'});
        $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'aboutController'});
        $routeProvider.when('/contact', {templateUrl: 'partials/contact.html', controller: 'contactController'});
        $routeProvider.when('/chat', {templateUrl: 'partials/chat.html', controller: 'chatController'});
        $routeProvider.otherwise({redirectTo: '/home'});
        
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }])