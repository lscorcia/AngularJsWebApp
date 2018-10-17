'use strict';
angular
    .module('app')
    .factory('tokensManagerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {
        var tokenManagerServiceFactory = {};

        var _getRefreshTokens = function () {

            return $http.get(ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens').then(function (results) {
                return results;
            });
        };

        var _deleteRefreshTokens = function (tokenid) {

            return $http.delete(ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        };

        tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
        tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

        return tokenManagerServiceFactory;

    }]);