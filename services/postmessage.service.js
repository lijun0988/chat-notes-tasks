angular.module('postmessage.service', [])
.factory('PostmessageService', 
function ($rootScope, SETTINGS, PATHS, AuthenticationService, PathService, $window) {

    var PostmessageService = this;    
    var appId = PATHS.APP_ID;
    var timeouts = [];

    this.sendMessage = function(message){
        window.parent.postMessage(message, appId);    
    }

    this.setAppWindowSize = function(width, height){
        if(typeof Awesome != 'undefined')
            Awesome.resizeWindow(width,height);
    }

    return PostmessageService;
});