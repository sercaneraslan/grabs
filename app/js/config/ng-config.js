// Defined Grabs Module
window.grabs = angular.module('grabs', [
    'ngRoute',
    'pageTitle'
]);

// Grabs Routing Configuration
angular.module('grabs').config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    'use strict';

    $routeProvider.when('/', {
        templateUrl: '/views/homepage/homepage.html',
        controller: 'HomepageCtrl',
        key: 'en'
    }).
    when('/tr', {
        templateUrl: '/views/homepage/homepage.html',
        controller: 'HomepageCtrl',
        key: 'tr'
    }).
    otherwise({
        redirectTo: '/'
    });

    // HTML5 Push State
    $locationProvider.html5Mode(true);
}]);
