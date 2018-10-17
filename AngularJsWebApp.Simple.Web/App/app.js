angular
    .module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar'])
    .config(function ($routeProvider) {
        $routeProvider.when("/home", {
            controller: "homeController",
            templateUrl: "/app/views/home.html"
        });

        $routeProvider.when("/login", {
            controller: "loginController",
            templateUrl: "/app/views/login.html"
        });

        $routeProvider.when("/signup", {
            controller: "signupController",
            templateUrl: "/app/views/signup.html"
        });

        $routeProvider.when("/refresh", {
            controller: "refreshController",
            templateUrl: "/app/views/refresh.html"
        });

        $routeProvider.when("/tokens", {
            controller: "tokensManagerController",
            templateUrl: "/app/views/tokens.html"
        });

        $routeProvider.when("/orders", {
            controller: "ordersController",
            templateUrl: "/app/views/orders.html"
        });

        $routeProvider.otherwise({ redirectTo: "/home" });
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    })
    .constant('ngAuthSettings', {
        apiServiceBaseUri: 'http://localhost:51012/',
        clientId: 'ngAuthApp'
    })
    .run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
