'use strict';
angular
    .module('app')
    .factory('ordersService', ['$http', 'ngAuthSettings', 
        function ($http, ngAuthSettings) {
    var ordersServiceFactory = {};

    var _getOrders = function () {

        return $http.get(ngAuthSettings.apiServiceBaseUri + 'api/orders').then(function (results) {
            return results;
        });
    };

    ordersServiceFactory.getOrders = _getOrders;

    return ordersServiceFactory;

}]);