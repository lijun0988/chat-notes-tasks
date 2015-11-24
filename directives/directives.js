'use strict';

mfApp.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {

            scope.$watch(function () {
                return attrs['ngSrc'];
            }, function (value) {
                if (!value) {
                    element.attr('src', attrs.errSrc);
                }
            });

            element.bind('error', function () {
                element.attr('src', attrs.errSrc);
            });
        }
    }
})

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    })

    .directive('ngFocus', ['$parse', function ($parse) {
        return function (scope, element, attr) {
            var fn = $parse(attr['ngFocus']);
            element.bind('focus', function (event) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
            });
        }
    }])

    .directive('ngRepeatDone', function () {
        return function (scope, element, attrs) {
            if (scope.$last) { // all are rendered
                // execute callback passed in directive
                scope.$eval(attrs.ngRepeatDone);
            }
        }
    })

mfApp.directive('piwikTracker', function($rootScope){
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ctrl){
                $rootScope.$on('setPiwikTracker', function(){

                    window._paq = window._paq || [];
                    window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
                    window._paq.push(["setCookieDomain", $rootScope.fidelusDomainName]);
                    window._paq.push(["setDomains", [$rootScope.fidelusDomainName]]);
                    window._paq.push(["trackPageView"]);
                    window._paq.push(["enableLinkTracking"]);

                    (function() {
                        var u=(("https:" == document.location.protocol) ? "https" : "http") + "://"+ $rootScope.fidelusAnalyticServerUrl;
                        window._paq.push(["setTrackerUrl", u+"piwik.php"]);
                        window._paq.push(["setSiteId", $rootScope.fidelusSiteCode]);
                        var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
                        g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
                    })();
                    if($rootScope.fromLogin){
                        analytics.trackSuccess('on_logged_in');
                    }
                    if($rootScope.fromLoginError){
                        analytics.trackError('on_logged_in');
                    }
                });

            }
        }
    })
    .directive('staticInclude', function($http, $templateCache, $compile) {
        return function(scope, element, attrs) {
            var templatePath = attrs.staticInclude;
            $http.get(templatePath, { cache: $templateCache }).success(function(response) {
                var contents = element.html(response).contents();
                $compile(contents)(scope);
            });
        };
    })
    .directive('contenteditable', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$apply(read);
                });
                read(); // initialize

                // Write data to the model
                function read() {
                    //var html = element.html();
                    var html = element.text();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    });

