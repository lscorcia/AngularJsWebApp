'use strict';
angular
    .module('AngularAuthApp')
    .factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService',
        function ($q, $injector, $location, localStorageService) {

            var authInterceptorServiceFactory = {};
            var $http;  // Cannot inject this - we'd get a circular reference
            var _refreshTokenPending = false;

            var _request = function (config) {

                config.headers = config.headers || {};

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }

                return config;
            };

            var _responseError = function (rejection) {
                var deferred = $q.defer();
                if (rejection.status === 401) {
                    if (!_refreshTokenPending) {
                        var authService = $injector.get('authService');
                        authService.refreshToken()
                            .then(function (refreshResponse) {
                                _refreshTokenPending = true;

                                $http = $http || $injector.get('$http');
                                $http(rejection.config)
                                    .then(function (retryResponse) {
                                        _refreshTokenPending = false;
                                        deferred.resolve(retryResponse);
                                    },
                                        function (retryResponse) {
                                            deferred.reject(retryResponse);
                                        });
                            },
                                function () {
                                    _refreshTokenPending = false;
                                    authService.logOut();
                                    $location.path('/login');
                                    deferred.reject(rejection);
                                }
                            );
                    } else {
                        deferred.reject(rejection);
                    }
                } else {
                    deferred.reject(rejection);
                }

                return deferred.promise;
            };

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }]);