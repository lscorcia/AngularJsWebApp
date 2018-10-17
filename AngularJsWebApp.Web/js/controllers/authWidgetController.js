'use strict';
angular
    .module('app').controller('authWidgetController', ['$scope', '$state', 'authService',
        function ($scope, $state, authService) {

            $scope.logOut = function() {
                $state.transitionTo('/logout');
            };

            $scope.authentication = authService.authentication;

        }]);