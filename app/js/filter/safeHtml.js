// Safe HTML Filter
grabs.filter('safeHtml', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);
