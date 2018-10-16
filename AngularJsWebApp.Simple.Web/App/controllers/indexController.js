'use strict';
angular
    .module('AngularAuthApp')
    .controller('indexController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

            $scope.logOut = function() {
                authService.logOut();
                $location.path('/home');
            };

            $scope.authentication = authService.authentication;

        }]);