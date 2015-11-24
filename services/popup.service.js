angular.module('popup.service', [])
.factory('PopupService',
function ($rootScope, SETTINGS, $window, PathService) {
    var popupService = this;
    var openWindows = [];

    var openHtmlWindow = function ( windowName, $scope, URL, data, width, height ) {
        if ( 'undefined' == typeof openWindows[windowName] || openWindows[windowName].closed ) {

            var windowConfig =  "menubar=no,location=no,resizable=no,"+
                            "scrollbars=yes,status=no, width=" + width + ", height="+height;
            console.log('Window config: ' + windowConfig);
            if (data){
                URL += '?'+$.param(data);
            }
            openWindows[windowName] = $window.open(URL, windowName, windowConfig);
            console.log("window created : "+openWindows[windowName]);

            var startWindow = function (){


                //Dirty fix for Mac and Window for Missing first Caht
				if (navigator.appVersion.indexOf("Mac")!=-1){
					popupService.sendMessage(windowName, 'ready', {ready:true, contact:data} );
				}
                else
				{
                    popupService.sendMessage(windowName, 'ready', {ready:true, contact:data} );
					popupService.sendMessage(windowName, 'data', data);
				}


            }
            $window.setTimeout(startWindow, 500);
        } else {
            console.log(data);
            popupService.sendMessage(windowName, 'data', data);
            //openWindows[windowName].focus();
        }
        return openWindows[windowName];
    }



    this.openWindow = function (windowName, $scope, URL, data, width, height) {

        openHtmlWindow(windowName, $scope, URL, data, width, height);

        if (typeof Awesome != 'undefined' && typeof Awesome.OpenInternalWindow != 'undefined') {
            if (data != null) {                
                Awesome.OpenInternalWindow(windowName, URL + '?' + $.param(data), width, height);
            }
            else {
                Awesome.OpenInternalWindow(windowName, URL, width, height);
            }
        }
    }
    
    this.sendMessage = function ( windowName, messageType, message) {
        if (openWindows[windowName]) {
            openWindows[windowName].postMessage({
                    messageType: messageType,
                    message: message
            },'*');
        }
    }
    
    this.getOpenWindows = function () {
        return openWindows;
    }
    
    this.getOpenWindow = function (windowName){
        if ( openWindows[windowName]) {
            return openWindows[windowName];
        } else {
            return false;
        }
    }
    
    this.closeOpenWindows = function (){
        for (var windowName in openWindows) {
    	    if (openWindows.hasOwnProperty(windowName)) {
    	    	openWindows[windowName].close();
    	    }
    	}
    }

    var getEventFromChatPopup = function () {
        var data = event.data;
        var isRestoreWindow = false;
        console.log("getEventFromChatPopup: " + data.type);

        if(typeof data.type != 'undefined' && data.type == 'get_file_transfer_url'){

            var awsS3formsParamsUrl =  PathService.getAWSFileTransferFormsParams() + "?accessToken=" + encodeURIComponent($rootScope.credentials.accessToken);
            var awsS3signedUrl =  PathService.getAWSFileTransferSignedUrl() + "?accessToken=" + encodeURIComponent($rootScope.credentials.accessToken);

            popupService.sendMessage('chat-' + data.contactJid, 'fileTransferUrls', { formsParamsUrl: awsS3formsParamsUrl, signedUrl: awsS3signedUrl});

        }

        if(isRestoreWindow){
            if(typeof Awesome != 'undefined' ){
                Awesome.restoreWindow();
            }
        }
    }
    window.addEventListener("message", getEventFromChatPopup, false);

    return popupService;
});