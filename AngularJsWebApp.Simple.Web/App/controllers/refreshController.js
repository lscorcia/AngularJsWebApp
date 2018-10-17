﻿'use strict';
angular
    .module('AngularAuthApp')
    .controller('refreshController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

            $scope.authentication = authService.authentication;
            $scope.tokenRefreshed = false;
            $scope.tokenResponse = null;

            $scope.refreshToken = function () {

                authService.refreshToken().then(function (response) {
                    $scope.tokenRefreshed = true;
                    $scope.tokenResponse = response.data;
                },
                function (err) {
                    $location.path('/login');
                });
            };

        }]);