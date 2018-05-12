// Grabs Language Service
angular.module('grabs').factory('languageService', ['$http', function($http) {
    'use strict';

    return {
        getLanguageFile: function (path) {
            return $http.get('views/' + path + '.json');
        }
    }
}]);
