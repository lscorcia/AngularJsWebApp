'use strict';
angular
    .module('app')
    .factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings',
        function ($http, $q, localStorageService, ngAuthSettings) {

            var authServiceFactory = {};

            var _authentication = {
                isAuth: false,
                userName: "",
                useRefreshTokens: false
            };

            var _saveRegistration = function (registration) {

                _logOut();

                return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/account/register', registration).then(function (response) {
                    return response;
                });

            };

            var _login = function (loginData) {

                var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

                if (loginData.useRefreshTokens) {
                    data = data + "&client_id=" + ngAuthSettings.clientId;
                }

                var deferred = $q.defer();

                $http.post(ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .then(function (response) {

                        if (loginData.useRefreshTokens) {
                            localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true });
                        }
                        else {
                            localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                        }

                        _authentication.isAuth = true;
                        _authentication.userName = loginData.userName;
                        _authentication.useRefreshTokens = loginData.useRefreshTokens;

                        deferred.resolve(response);

                    }, function (err) {
                        _logOut();
                        deferred.reject(err);
                    });

                return deferred.promise;

            };

            var _logOut = function () {

                localStorageService.remove('authorizationData');

                _authentication.isAuth = false;
                _authentication.userName = "";
                _authentication.useRefreshTokens = false;
            };

            var _isLoggedIn = function () {
                return _authentication.isAuth;
            };

            var _fillAuthData = function () {

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    _authentication.isAuth = true;
                    _authentication.userName = authData.userName;
                    _authentication.useRefreshTokens = authData.useRefreshTokens;
                }

            };

            var _refreshToken = function () {
                var deferred = $q.defer();

                var authData = localStorageService.get('authorizationData');

                if (authData) {

                    if (authData.useRefreshTokens) {

                        var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                        localStorageService.remove('authorizationData');

                        $http.post(ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                            .then(function (response) {

                                localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true });

                                deferred.resolve(response);

                            }, function (err) {
                                _logOut();
                                deferred.reject(err);
                            });
                    }
                }

                return deferred.promise;
            };

            var _loginWindowsAuth = function () {
                var deferred = $q.defer();

                var data = { authenticationType: "bearer", clientId: ngAuthSettings.clientId };

                $http.post(ngAuthSettings.apiServiceBaseUri + 'sso/WindowsAuthentication/Logon', data, { withCredentials: true })
                    .then(function (response) {

                        if (response.data.useRefreshTokens) {
                            localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, refreshToken: response.data.refresh_token, useRefreshTokens: true });
                        }
                        else {
                            localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, refreshToken: "", useRefreshTokens: false });
                        }

                        _authentication.isAuth = true;
                        _authentication.userName = response.data.userName;
                        _authentication.useRefreshTokens = response.data.useRefreshTokens;

                        deferred.resolve(response);
                    }, function (err) {
                        _logOut();
                        deferred.reject(err);
                    });

                return deferred.promise;
            };

            authServiceFactory.saveRegistration = _saveRegistration;
            authServiceFactory.login = _login;
            authServiceFactory.logOut = _logOut;
            authServiceFactory.fillAuthData = _fillAuthData;
            authServiceFactory.authentication = _authentication;
            authServiceFactory.refreshToken = _refreshToken;
            authServiceFactory.isLoggedIn = _isLoggedIn;
            authServiceFactory.loginWindowsAuth = _loginWindowsAuth;

            return authServiceFactory;
        }]);