angular.module('AngularJsInternals', [])
.run(function ($rootScope, $timeout) {
    $rootScope.my = {
      alert: function (message) {
        alert(message || 'This be my alert');
      }
    };
    
    Reveal.addEventListener('slidechanged', function(event) {
        // trigger digest cycle on slide change
        $rootScope.$digest();
    });
})
.directive('eval', function ($compile) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element) {
            scope.element = element;
        },
        controller: function ($scope) {
            var outputs = [];
            
            this.addOutput = function (output) {
                outputs.push(output);
            }
            
            $scope.run = function () {
                var code = $($scope.element.find('.code').get(0)).text();
                
                console.log('eval.run', code);
                
                outputs.map(function (output) {
                    output.setContent(
                        $compile(code)($scope.$new())
                    );
                });
            }
        }
    };
})
.directive('evalOutput', function () {
    return {
        restrict: 'A',
        require: '^eval',
        link: function (scope, element, attrs, evalCtrl) {
            evalCtrl.addOutput(scope);
            
            scope.setContent = function (content) {
                element.html(content);
            }
        }
    };
})
.directive('callout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var slideElement = $(element).closest('section');
            var removeWatchFn = scope.$watch(
                function () {
                    return slideElement.attr('class');
                }, function (newValue) {
                    if ($(slideElement).hasClass('present')) {
                        // add a small timeout so highlight.js has had time to do it's thing
                        $timeout(function() {
                            slideElement
                                .find(attrs.callout)
                                .map(positionCallout);
                        }, 300);
                        
                        removeWatchFn();
                    }
                }
            );
            
            function positionCallout(i, target) {
                var targetElement = $(target);
                var position = targetElement.offset();
                var calloutElement = $(element);
                
                if (calloutElement.hasClass('position-topright')) {
                    position.top = (position.top - calloutElement.outerHeight()) + (targetElement.outerHeight() / 2) - 10;
                    position.left += targetElement.width();
                } else if (calloutElement.hasClass('position-left')) {
                    position.top += (targetElement.outerHeight() - calloutElement.outerHeight()) / 2;
                    position.left -= calloutElement.width() - 10;
                } else if (calloutElement.hasClass('position-right')) {
                    position.top += (targetElement.outerHeight() - calloutElement.outerHeight()) / 2;
                    position.left += targetElement.width() + 10;
                } else if (calloutElement.hasClass('position-bottom')) {
                    position.top = position.top + targetElement.outerHeight() - 5;
                    position.left += targetElement.width() / 2;
                } else if (calloutElement.hasClass('position-bottomleft')) {
                    position.top = position.top + targetElement.outerHeight();
                    position.left -= calloutElement.width();
                    position.left += targetElement.width() / 2;
                } else { // position-top
                    position.top -= calloutElement.outerHeight();
                    position.left += targetElement.width() / 2;
                }
                
                position.top += parseInt(calloutElement.attr('data-callout-offset-top')) || 0;
                position.left += parseInt(calloutElement.attr('data-callout-offset-left')) || 0;
                
                //console.log('positionCallout', position, targetElement, calloutElement);
                
                calloutElement.offset(position);
            }
        }
    };
})
.directive('greetButton', function () {
  return {
    compile: function (element, attrs) {
      $(element).click(function () {
        window.alert('ohai!');
      });
    }
  };
})
.directive('greetings', function () {
  return {
    link: function (scope, element, attrs) {
      $(element).click(function () {
        window.alert(scope.my.greeting);
      });
    }
  };
})
.directive('greetingButton', function () {
  return {
    scope: {
      greeting: '='
    },
    template: '<button ng-click="click()">{{label}}</button>',
    link: function (scope, element, attrs) {
      scope.label = attrs.label;
      scope.click = function () {
        window.alert(scope.greeting);
      };
    }
  };
})
.directive('awesomeButton', function () {
  return {
    template: '<button class="button" ng-click="click()"><i class="fa fa-{{icon}}"></i>'+
              '<span ng-transclude></span></button>',
    transclude: true,
    scope: {
      click: '&',
      icon: '@'
    }
  };
})
;
