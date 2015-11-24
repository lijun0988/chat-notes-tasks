
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    var scope = angular.element($("[data-ng-controller='DialPadPopupController']")).scope();
    scope.$apply(function(){
        var value = event.data.message;
        if (value && value=='true')
            scope.isPhoneReady = true;
        else
            scope.isPhoneReady = false;
        console.log('phone is '+scope.isPhoneReady);
    });
}

var dialPadPopup = angular.module('dialPadPopup.module', []);

dialPadPopup.controller('DialPadPopupController', function ($scope, $interval) {

    var stop;
    var relativePath = 'dialpad.html';
    var width = 253;
    var height = 480;
    var windowName = 'child';
    var path = window.location.pathname;
    localStorage.setItem("CallContactName", '');
    localStorage.setItem("DialNumber", '');


    $scope.dialPadPopup = {
        input: '',
        contactName: ''
    };

    $scope.isPhoneReady = false;
    $scope.startCall = false;

    $scope.pressDialPad = function (value) {
        var current = $scope.dialPadPopup.input;
        if (current.length < 40) {
            $scope.dialPadPopup.input = current + value;
            $scope.phoneNumberFormat($scope.dialPadPopup.input, 'addValue');
        }
    };

    $scope.clearLastValue = function () {
        var str = $scope.dialPadPopup.input;
        if ((str.length - 1) >= 0) {
            $scope.dialPadPopup.input = str.substring(0, str.length - 1);
            $scope.phoneNumberFormat($scope.dialPadPopup.input, 'clearValue');
        }
        $('#dialpadInput').focus();
    };

    $scope.phoneNumberFormat = function (value, event) {
        var split = value.replace(/[^0-9*#+]/g, '').split('');
        var temp = "";
        if (split.length === 4) {
            $.each(split, function (index, value) {
                if (index === 3) {
                    temp = temp + '-' + value;
                } else {
                    temp = temp + value;
                }
            });
            $scope.dialPadPopup.input = temp;
        }
        else if (split.length === 8 || split.length === 10) {
            $.each(split, function (index, value) {
                if (index === 3) {
                    temp = '(' + temp + ') ' + value;
                } else if (index === 6) {
                    temp = temp + '-' + value;
                } else {
                    temp = temp + value;
                }

            });
            $scope.dialPadPopup.input = temp;
        } else if (split.length > 10) {
            $scope.dialPadPopup.input = split.join('');
        }

        //Add number to local storage
        localStorage.DialNumber = $scope.dialPadPopup.input.replace(/[^0-9*#+]/g, '');

        //Send char to DTFM
        event = (event.keyCode != null && event.keyCode == 8) ? false : event == 'clearValue' ? false : true;

        if (event) {
            window.opener.$(window.opener.document).trigger('mainWindow', $scope.dialPadPopup.input);
        }
    };

    $scope.closeFromWPF = function () {
        window.opener.$(window.opener.document).trigger('mainWindow', 'close');
    };

    $scope.callInCourse = function () {
        if (angular.isDefined(stop)) return;
        stop = $interval(function () {
            /*
            if (localStorage.CallInProgress == 'true') {
                $scope.dialPadPopup.contactName =  localStorage.CallContactName;
            }else{
                $scope.dialPadPopup.contactName = '';
            }
            */
        }, 1000);
    };

    $scope.stopCallInCourse = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };



    $scope.callInCourse();

    $scope.call = function () {
        localStorage.DialNumber = $scope.dialPadPopup.input.replace(/[^0-9*#+]/g, '');
        if ($scope.startCall==false) {
            window.opener.$(window.opener.document).trigger('mainWindow', 'call');
        }
        else {
            window.opener.$(window.opener.document).trigger('mainWindow', 'end-call');
        }
        $scope.startCall = !$scope.startCall;
    };

    $scope.keyPress = function (event) {
        if ((event.keyCode != null && event.keyCode == 13)) {
            $scope.call();
        }
    };


});

dialPadPopup.directive('phoneNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9*#+()-\s]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

            scope.$watch(attrs.ngModel, function (value) {
                if (value !== undefined) {
                    var ele = $('#dialpadInput');
                    ele.val(value).focus();
                    var val = value.length;
                    var match = /[!$%^&()_|~=`{}\[\]:";'<>?,.\/]/.test(value);
                    $('#dotsBefore').removeClass('shown');

                    if (val >= 11 && val < 15 && !match) {
                        ele.css('font-size', '21px');
                    }
                    else if (val >= 15 && !match) {
                        if (val >= 17) {
                            $('#dotsBefore').addClass('shown');
                        }
                        ele.css('font-size', '19px');
                    }
                    else if (val <= 15) {
                        ele.css('font-size', '25px');
                    }

                }
            });
        }
    };
});

dialPadPopup.directive('longPress', function () {
    return {
        require: "^ngController",
        scope: {},
        link: function (scope, element, attrs, ngCtrl) {

            var pressTimer;
            scope.isLongPress = false;

            scope.longPressHelper = function (value) {
                window.setTimeout(function () {
                    scope.isLongPress = value;
                })
            };

            element.bind('mouseup', function (event) {
                clearTimeout(pressTimer);
                scope.longPressHelper(false);
                if (!scope.isLongPress) {
                    scope.$parent.pressDialPad('0');
                }
                return false;
            });

            element.bind('mousedown', function (event) {
                pressTimer = window.setTimeout(function () {
                    scope.$apply(function () {
                        scope.$parent.pressDialPad('+');
                        scope.longPressHelper(true);
                    });
                }, 500)
                return false;
            });
        }
    };
});


