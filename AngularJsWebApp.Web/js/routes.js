'use strict';
angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
            $urlRouterProvider.otherwise('/dashboard');

            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                debug: true
            });

            $breadcrumbProvider.setOptions({
                prefixStateName: 'app',
                includeAbstract: true,
                template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
            });

            $stateProvider
                .state('app', {
                    abstract: true,
                    templateUrl: 'views/common/layouts/full.html',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Root',
                        skip: true
                    },
                    resolve: {
                        loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load CSS files
                            return $ocLazyLoad.load([{
                                serie: true,
                                name: 'Flags',
                                files: ['../lib/flag-icon-css/css/flag-icon.min.css']
                            }, {
                                serie: true,
                                name: 'Font Awesome',
                                files: ['../lib/font-awesome/css/font-awesome.min.css']
                            }, {
                                serie: true,
                                name: 'Simple Line Icons',
                                files: ['../lib/simple-line-icons/css/simple-line-icons.css']
                            }]);
                        }],
                        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load([{
                                serie: true,
                                name: 'chart.js',
                                files: [
                                    '../lib/chartjs/Chart.bundle.min.js',
                                    '../lib/angular/angular-chart.min.js'
                                ]
                            }]);
                        }],
                    }
                })
                .state('app.main', {
                    url: '/dashboard',
                    templateUrl: 'views/main.html',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Home',
                    },
                    data: {
                        requiresAuth: true
                    },
                    //page subtitle goes here
                    params: { subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit' },
                    resolve: {
                        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'chart.js',
                                    files: [
                                        '../lib/chartjs/Chart.bundle.min.js',
                                        '../lib/angular/angular-chart.min.js'
                                    ]
                                },
                            ]);
                        }],
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/mainController.js']
                            });
                        }]
                    }
                })
                .state('app.orders', {
                    url: '/orders',
                    templateUrl: 'views/pages/orders.html',
                    controller: 'ordersController',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Orders',
                    },
                    data: {
                        requiresAuth: true
                    },
                    //page subtitle goes here
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/ordersController.js']
                            });
                        }]
                    }
                })
                .state('app.tokens', {
                    url: '/tokens',
                    templateUrl: 'views/pages/tokens.html',
                    controller: 'tokensManagerController',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Tokens',
                    },
                    data: {
                        requiresAuth: true
                    },
                    //page subtitle goes here
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/tokensManagerController.js']
                            });
                        }]
                    }
                })
                .state('app.refresh', {
                    url: '/refresh',
                    templateUrl: 'views/pages/refresh.html',
                    controller: 'refreshController',
                    //page title goes here
                    ncyBreadcrumb: {
                        label: 'Refresh Token',
                    },
                    data: {
                        requiresAuth: true
                    },
                    //page subtitle goes here
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/refreshController.js']
                            });
                        }]
                    }
                })
                .state('appSimple', {
                    abstract: true,
                    templateUrl: 'views/common/layouts/simple.html',
                    resolve: {
                        loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load CSS files
                            return $ocLazyLoad.load([{
                                serie: true,
                                name: 'Font Awesome',
                                files: ['../lib/font-awesome/css/font-awesome.min.css']
                            }, {
                                serie: true,
                                name: 'Simple Line Icons',
                                files: ['../lib/simple-line-icons/css/simple-line-icons.css']
                            }]);
                        }],
                    }
                })

                // Additional Pages
                .state('appSimple.login', {
                    url: '/login',
                    templateUrl: 'views/pages/login.html',
                    controller: 'loginController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/loginController.js']
                            });
                        }]
                    }
                })
                .state("appSimple.logout", {
                    url: '/logout',
                    data: {
                        requiresAuth: true
                    },
                    controller: ['$state', 'authService', function ($state, authService) {
                        authService.logOut();
                        $state.transitionTo('appSimple.login', null, { reload: true });
                    }]
                })
                .state('appSimple.register', {
                    url: '/register',
                    templateUrl: 'views/pages/register.html',
                    controller: 'registerController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                            // you can lazy load controllers
                            return $ocLazyLoad.load({
                                files: ['js/controllers/registerController.js']
                            });
                        }]
                    }
                })
                .state('appSimple.404', {
                    url: '/404',
                    templateUrl: 'views/pages/404.html'
                })
                .state('appSimple.500', {
                    url: '/500',
                    templateUrl: 'views/pages/500.html'
                })
        }]);
