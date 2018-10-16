'use strict';
angular
    .module('AngularAuthApp')
    .controller('loginController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

            $scope.loginData = {
                userName: "",
                password: ""
            };

            $scope.message = "";

            $scope.login = function () {

                authService.login($scope.loginData).then(function (response) {

                    $location.path('/orders');

                },
                    function (err) {
                        if (err.data)
                            $scope.message = err.data.error_description;
                        else
                            $scope.message = err.status + ' - ' + err.statusText;
                    });
            };

        }]);