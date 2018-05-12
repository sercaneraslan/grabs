// Safe HTML Filter
angular.module('grabs').filter('safeHtml', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);
