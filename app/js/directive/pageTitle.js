// Page Title Directive
angular.module('pageTitle', []).directive('pageTitle', function () {
    'use strict';

    return function (scope, element, attrs) {
        attrs.$observe('pageTitle', function () {
            document.getElementsByTagName('title')[0].innerHTML = attrs.pageTitle || element.html();
        });
    };
});
