'use strict';
// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

angular
    .module('app', [
        'ui.router',
        'oc.lazyLoad',
        'ncy-angular-breadcrumb',
        'angular-loading-bar',
        'LocalStorageModule'
    ])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }])
    .constant('ngAuthSettings', {
        apiServiceBaseUri: 'http://localhost:51012/',
        clientId: 'ngAuthApp'
    })
    .run(['$rootScope', '$state', '$stateParams', '$transitions', 'authService',
        function ($rootScope, $state, $stateParams, $transitions, authService) {
            authService.fillAuthData();
            $transitions.onBefore({}, function (transition) {
                var requiresAuth = transition.to().data && transition.to().data.requiresAuth;
                if (requiresAuth && !authService.isLoggedIn()) {
                    // now, redirect only not authenticated
                    return $state.target('appSimple.login');
                }
            });
            $transitions.onSuccess({}, function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });
            $rootScope.$state = $state;
            return $rootScope.$stateParams = $stateParams;
        }]);
