'use strict';
angular
    .module('app')
    .factory('authInterceptorService', ['$q', '$injector', '$state', 'localStorageService',
        function ($q, $injector, $state, localStorageService) {

            var authInterceptorServiceFactory = {};

            var _request = function (config) {

                config.headers = config.headers || {};

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }

                return config;
            };

            var _responseError = function (rejection) {
                if (rejection.status === 401) {
                    var authService = $injector.get('authService');
                    var authData = localStorageService.get('authorizationData');

                    if (authData) {
                        if (authData.useRefreshTokens) {
                            $state.transitionTo('/refresh');
                            return $q.reject(rejection);
                        }
                    }
                    authService.logOut();
                    $state.transitionTo('/login');
                }
                return $q.reject(rejection);
            };

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }]);