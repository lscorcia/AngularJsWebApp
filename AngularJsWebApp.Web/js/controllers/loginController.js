'use strict';
angular
    .module('app')
    .controller('loginController', ['$scope', '$state', 'authService',
        function ($scope, $state, authService) {

            $scope.loginData = {
                userName: "",
                password: "",
                useRefreshTokens: true
            };

            $scope.message = "";

            $scope.login = function () {

                authService.login($scope.loginData).then(function (response) {

                    $state.go('app.main');

                },
                    function (err) {
                        if (err.data)
                            $scope.message = err.data.error_description;
                        else
                            $scope.message = err.status + ' - ' + err.statusText;
                    });
            };

            $scope.loginWindowsAuth = function () {

                authService.loginWindowsAuth().then(function (response) {

                        $state.go('app.main');

                    },
                    function (err) {
                        if (err.data)
                            $scope.message = err.data.error_description;
                        else
                            $scope.message = err.status + ' - ' + err.statusText;
                    });
            };

        }]);