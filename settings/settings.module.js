'use strict';

angular.module('settings.module', ['profile','update.service'])

.controller('UpdateMessageController', function($scope, $modalInstance, onUpdate) {
    $scope.update = function(result) {
        onUpdate(result);
    };
})

.controller('SettingsController',
    ['$scope',
    '$rootScope',
    '$http',
    'PathService',
    'AuthenticationService',
    'CallmanagerAuthenticationService',
    'EncodingService',
    'StorageService',
    'PostmessageService',
    'JabberService',
    'UpdateService',
    'PopupService',
    '$timeout',
    '$interval',
    '$modal',
    'PATHS',
    function($scope, $rootScope,$http, PathService,
            AuthenticationService, CallmanagerAuthenticationService,
            EncodingService, StorageService, PostmessageService,JabberService, UpdateService, PopupService, $timeout, $interval, $modal, PATHS){

        $scope.callmanagerAuthenticationService = CallmanagerAuthenticationService;
        $scope.filterDevices = function(dev){
            return (dev.isSoftPhone && $scope.callmanagerAuthenticationService.phoneMode == 'SoftPhone') || (!dev.isSoftPhone && $scope.callmanagerAuthenticationService.phoneMode == 'DeskPhone');
        };
        $rootScope.jabberLogin = {
            username:'',
            password:'',
            connected: false,
            //firstLogin : false,
            isError : false,
            message : '',
            isInProgress : false
        };

        $rootScope.settings = {
            general: {showVideo: 'true', contentOrder: 'caller', showOffline:'true'},
            audioVideo: {},
            emailNotifications: {addComment : false, assignedToMe: false},
            alertSounds:{chatSound : false, noteAndTaskSound : false}

        };

        $scope.phoneIsReady = false;
        $scope.selectedPanel = 'account';
        $scope.accountLoginProgress = false;
        $scope.deviceSelectionProgress = false;
        $scope.userSettingsNames = [];
        $scope.userSettingsNames.push('settings.general.showVideo');
        $scope.userSettingsNames.push('settings.general.contentOrder');
        $scope.userSettingsNames.push('settings.general.showOffline');
        $scope.userSettingsNames.push('settings.emailNotifications.addComment');
        $scope.userSettingsNames.push('settings.emailNotifications.assignedToMe');
        $scope.userSettingsNames.push('callmanagerAuthenticationService.username');
        $scope.userSettingsNames.push('callmanagerAuthenticationService.password');
        $scope.userSettingsNames.push('callmanagerAuthenticationService.RememberAccount');
        $scope.userSettingsNames.push('jabberLogin.username');
        $scope.userSettingsNames.push('jabberLogin.password');
        $scope.userSettingsNames.push('webex.username');
        $scope.userSettingsNames.push('webex.password');

        $scope.userSettingsNames.push('callmanagerAuthenticationService.cucm');
        $scope.userSettingsNames.push('callmanagerAuthenticationService.phoneMode');
        $scope.userSettingsNames.push('callmanagerAuthenticationService.device');
        $scope.userSettingsNames.push('settings.audioVideo.captureDevice'); // camera
        $scope.userSettingsNames.push('settings.audioVideo.recordingDevice'); // microphone
        $scope.userSettingsNames.push('settings.audioVideo.playoutDevice'); // output

        $scope.userSettingsNames.push('settings.alertSounds.chatSound');
        $scope.userSettingsNames.push('settings.alertSounds.noteAndTaskSound');

        $scope.captureDevices = [];
        $scope.playoutDevices = [];
        $scope.recordingDevices = [];

        $scope.defaultCaptureDevice = {};
        $scope.defaultPlayoutDevice = {};
        $scope.defaultRecordingDevice = {};

        $scope.mUrlAboutPage = "http://www.akkadianlabs.com";

        $scope.webex = {
            username:'',
            password:'',
            selectedSite:{
            },
            sites:[],
            response:{
                message:''
            }
        };

        $scope.init = function(){
            $scope.callmanagerAuthenticationService.RememberAccount = true;
            $timeout(function(){
                var cucm = StorageService.userGet('callmanagerAuthenticationService.cucm');
                if(!cucm || cucm == 'undefined'){
                    $scope.callmanagerAuthenticationService.cucm = PathService.getCallManagerUrl();
                }},1000);

            $scope.loadUserSettings();
            if($scope.phoneIsReady){
                $scope.doAutoLogin();
            }
            // Devices refresh
            /*$('#phonecontainer').bind('mmDeviceChange.cwic', function(){
                $scope.getMultimediaDevices();
            });*/

            $('#username_settings, #password_settings')
                .unbind('keypress')
                .bind('keypress', function(){
                if (event.which == 13 || event.keyCode == 13) {
                    event.preventDefault();
                    $scope.doCallManagerLogin();
                    if(!$scope.$$phase){$scope.$apply()}
                }
            });

            $('#username_jabber_settings, #password_jabber_settings')
                .unbind('keypress')
                .bind('keypress', function(){
                    if (event.which == 13 || event.keyCode == 13) {
                        event.preventDefault();
                        if(!$rootScope.jabberLogin.connected){
                            $scope.doJabberLogin();
                        }
                        if(!$scope.$$phase){$scope.$apply()}
                    }
                });
        }

        $scope.showSettingsPanel = function(panel){
            $scope.selectedPanel = panel;
            if(panel === 'av'){
                $scope.showLocalVideo();
            }else{
                $scope.removeLocalVideo();
            }
        }

        $scope.loadUserSettings = function(){
            var len = $scope.userSettingsNames.length;
            for (var i = 0; i < len; i++) {
                var storedValue = StorageService.userGet($scope.userSettingsNames[i]);
                if(storedValue !== undefined && storedValue !== null){
                    // Update $scope.settings according to $scope.userSettingsNames namespaces
                    // for instance, setting name 'settings.general.showVideo' value
                    // needs to be saved in $scope.settings.general.showVideo
                    // for 'callmanagerAuthenticationService.device' -> $scope.callmanagerAuthenticationService.device
                    var namespace = $scope.userSettingsNames[i].split('.');
                    if(namespace[0]){
                        if(namespace[2]){
                            $scope[namespace[0]][namespace[1]][namespace[2]] = storedValue;
                        }else if(namespace[1]){
                            if([namespace[1]] == 'password'){
                                if (namespace[0] == 'jabberLogin'||namespace[0] == 'webex') {
                                    $scope[namespace[0]][namespace[1]] = storedValue;
                                }
                                else
                                    $scope[namespace[0]][namespace[1]] = EncodingService.decode(storedValue);
                            }else{
                                $scope[namespace[0]][namespace[1]] = storedValue;
                            }
                        }
                    }
                }
            };

        }

        $scope.saveUserSetting = function(setting, value){
            if(value != undefined){
                StorageService.userSet(setting, value);
            }else{
                StorageService.userSet(setting, null);
            }
        }

        $scope.saveAlertSoundSetting = function(setting, value){
            if(value != undefined){
                StorageService.userSet(setting, value);
            }else{
                StorageService.userSet(setting, null);
            }
        }

        $scope.savePassword = function(){
            if($scope.callmanagerAuthenticationService.password != undefined){
                StorageService.userSet('callmanagerAuthenticationService.password', EncodingService.encode($scope.callmanagerAuthenticationService.password));
            }else{
                StorageService.userSet('callmanagerAuthenticationService.password', null);
            }
        }

        $scope.savePasswordJabber = function(){
            StorageService.userSet('jabberLogin.password', $rootScope.jabberLogin.password);
        }

        $scope.openAboutPage = function() {
            if(typeof Awesome !== 'undefined'){
                Awesome.openBrowser($scope.mUrlAboutPage);
            }
        }
        
        $scope.updateAvailable = false;
        $scope.currentVersion = localStorage.version;
        $scope.currentReleaseDate = localStorage.releaseDate;
        $scope.showingUpdateConfirmation = false;
        $scope.releaseUpToDate = false;
        
        $scope.checkForUpdates = function() {
            UpdateService.checkForUpdates(function (newVersion, isNewVersion, majorChange){
            	if (isNewVersion){            	
            		$scope.releaseUpToDate = false;
	            	$scope.updateAvailable = true;
	            	$scope.availableVersion = newVersion.appVersion;
	            	$scope.availableReleaseDate = newVersion.appReleaseDate;
	            	
	            	if (majorChange && !$scope.showingUpdateConfirmation){
	                    var modalOpts = {
	                        templateUrl : 'settings/update-confirmation.html?' + localStorage.version ,
	                        controller : 'UpdateMessageController',
	                        windowClass: 'update-message-dialog',
	                        resolve : {
	                            onUpdate : function() {
	                                return $scope.updateToNewVersion;
	                            }
	                        }
	                    };
	                    var d = $modal.open(modalOpts);                    
	                    d.result.then(function(result) {
	                    	$scope.showingUpdateConfirmation = false;
	                    }, function (){
	                    	$scope.showingUpdateConfirmation = false;
	                    });
	                    $scope.showingUpdateConfirmation = true;
	            	}            	
            	}
            	else {
            		$scope.releaseUpToDate = true;
            	}
            });
        }
        
        //check for new version continusly
        $interval(function(){
        	if($scope.authenticationService.authenticated){
        		$scope.checkForUpdates();
        	}
        },60000);
        
        $scope.updateToNewVersion= function() {
        	PopupService.closeOpenWindows();
            UpdateService.updateToVersion($scope.availableVersion);
        }

        $scope.sendFeedback = function(){
            if(typeof Awesome != 'undefined')
                Awesome.sendFeedback();
        }

        $scope.doJabberLogin = function(){
            //Get Urls From Server
            PathService.getUrlsFromServer.get();

            $rootScope.jabberLogin.isInProgress = true;
            $rootScope.jabberLogin.message = '';
            $rootScope.jabberLogin.password = StorageService.userGet('jabberLogin.password');
            if(!$rootScope.jabberLogin.username || $rootScope.jabberLogin.username == ''
                || !$rootScope.jabberLogin.password || $rootScope.jabberLogin.password == '' ){
                $rootScope.jabberLogin.isError = true;
                $rootScope.jabberLogin.isInProgress = false;
                $rootScope.jabberLogin.message = mfMessages.jabber.invalidLogin;
                return;
            }

            //Contacts list init
            $rootScope.$broadcast('jabberInitLoginFromSettings');
            //Jabber connect
            $timeout(function(){JabberService.connectFromSettings($rootScope.jabberLogin.username, $rootScope.jabberLogin.password,true);}, 1500);
        };



        $scope.doJabberLogout = function(){
            $scope.clearJabberError();
            JabberService.offline();
        };

        $scope.clearJabberError = function(){
            $rootScope.jabberLogin.isError = false;
            $rootScope.jabberLogin.message = '';
            $rootScope.jabberLogin.isInProgress = false;

            $rootScope.jabberLogin.connected = false;
        }

        // General settings
        $scope.setDefaultCallType = function(value){

        }

        $scope.setContentOrder = function(value){

        }

        // Account settings
        $scope.doAutoLogin = function(){

           // if (AuthenticationService&&AuthenticationService.credentials.authenticationSource!='LDAP')
             // return;
            if($scope.callmanagerAuthenticationService.username != ''
                && $scope.callmanagerAuthenticationService.password != ''
                && $scope.callmanagerAuthenticationService.cucm != ''
                && $scope.callmanagerAuthenticationService.device != ''){
                $scope.callmanagerAuthenticationService.autoLogin = true;

               $timeout(function(){$scope.doCallManagerLogin();},5000) ;
            }
        }

        $scope.doCallManagerLogin = function(){
            if(!$scope.callmanagerAuthenticationService.username ||
                $scope.callmanagerAuthenticationService.username == ''){
                $scope.loginErrorMessage = mfMessages.callManager.invalidLogin;
                return;
            }
            if(!$scope.callmanagerAuthenticationService.password ||
                $scope.callmanagerAuthenticationService.password == ''){
                $scope.loginErrorMessage = mfMessages.callManager.invalidLogin;
                return;
            }
            if($scope.accountLoginProgress) return;
            if(!$scope.callmanagerAuthenticationService.registrationInProgress){
                $scope.callmanagerAuthenticationService.registrationInProgress = true;
                $scope.clearError();
                $scope.accountLoginProgress = true;
                var cucm = StorageService.userGet('callmanagerAuthenticationService.cucm');
                if(!cucm){
                    $scope.saveUserSetting('callmanagerAuthenticationService.cucm', $scope.callmanagerAuthenticationService.cucm);
                }
                CallmanagerAuthenticationService.authenticate($scope);
            }
        }

        $scope.doCallManagerLogout = function(){
            if($scope.accountLoginProgress) return;
            $scope.clearError();
            $scope.accountLoginProgress = true;
            $scope.callmanagerAuthenticationService.logout($scope);
            $scope.callmanagerAuthenticationService.RememberAccount = false;
        }

        $scope.clearError = function(){
            $scope.accountLoginProgress = false;
            $scope.loginError = false;
            $scope.message = '';
            $scope.loginErrorMessage = '';
        }

        $scope.changePhoneMode = function(){
            $scope.saveUserSetting('callmanagerAuthenticationService.phoneMode', $scope.callmanagerAuthenticationService.phoneMode);
            $scope.clearError();
            $('#phonecontainer').cwic('unregisterPhone', {
                forceLogout: true,
                complete: function(){
                    calls.removeAll();
                }
            });
        }

        $scope.changeDevice = function(){
            $scope.deviceSelectionProgress = true;
            $scope.saveUserSetting('callmanagerAuthenticationService.device', $scope.callmanagerAuthenticationService.device);
            $scope.clearError();
            $scope.callmanagerAuthenticationService.authenticated = false;
            $scope.callmanagerAuthenticationService.phonesLoaded = false;
            $scope.callmanagerAuthenticationService.autoLogin = true;
            $scope.callmanagerAuthenticationService.registerPhone($scope);
        }

        // Audio/Video settings
        $scope.getMultimediaDevices = function(){

            // Clear previous values
            $scope.captureDevices = [];
            $scope.playoutDevices = [];
            $scope.recordingDevices = [];

            // Get current devices
            var devices = $().cwic('getMultimediaDevices');
            if(devices.multimediadevices){
                for(var i=0; i < devices.multimediadevices.length; i++){
                    if (devices.multimediadevices[i].canCapture){
                       // In order to set a device as a recording device, send in the clientRecordingID to setRecordingDevice().
                       // Depending on the platform, it may match other fields, but it will always be the value that works for
                       // setRecordingDevice.  We save it here as clientID, so we can send it when the Set Recording Device button
                       // is pushed.
                       if (devices.multimediadevices[i].deviceName && devices.multimediadevices[i].deviceName.trim().length>0)
                           $scope.captureDevices.push(devices.multimediadevices[i]);
                       // Jabber SDK compatibility
                       if (devices.multimediadevices[i].isSelectedCaptureDevice){
                           $scope.defaultCaptureDevice = devices.multimediadevices[i];
                           console.log("current capture device:" +devices.multimediadevices[i].deviceName );
                       }

                   }

                   if (devices.multimediadevices[i].canPlayout){
                        if (devices.multimediadevices[i].deviceName && devices.multimediadevices[i].deviceName.trim().length>0)
                          $scope.playoutDevices.push(devices.multimediadevices[i]);
                        // Jabber SDK compatibility
                        if (devices.multimediadevices[i].isSelectedPlayoutDevice){
                            $scope.defaultPlayoutDevice = devices.multimediadevices[i];
                            console.log("current playout device:" +devices.multimediadevices[i].deviceName );

                        }
                   }

                   if(devices.multimediadevices[i].canRecord){
                        if (devices.multimediadevices[i].deviceName && devices.multimediadevices[i].deviceName.trim().length>0)
                           $scope.recordingDevices.push(devices.multimediadevices[i]);
                        if (devices.multimediadevices[i].isSelectedRecordingDevice){

                            $scope.defaultRecordingDevice = devices.multimediadevices[i];
                            console.log("current recording device:" +devices.multimediadevices[i].deviceName );

                        }
                   }

                }// end for


                //check the storage
                var capId = StorageService.userGet('settings.audioVideo.captureDevice');
                if (capId) {
                    for (var k=0;k<$scope.captureDevices.length;k++) {
                        if (capId==$scope.captureDevices[k].deviceID) {
                            $scope.defaultCaptureDevice = $scope.captureDevices[k];
                            $().cwic('setCaptureDevice', capId);
                        }
                    }
                }
                var recordId = StorageService.userGet('settings.audioVideo.recordingDevice');
                if (recordId) {
                    for (var k=0;k<$scope.recordingDevices.length;k++) {
                        if (recordId==$scope.recordingDevices[k].deviceID) {
                            $scope.defaultRecordingDevice = $scope.recordingDevices[k];
                            $().cwic('setRecordingDevice', recordId);
                        }
                    }
                }
                var playoutId = StorageService.userGet('settings.audioVideo.playoutDevice');
                if (playoutId) {
                    for (var k=0;k<$scope.playoutDevices.length;k++) {
                        if (playoutId==$scope.playoutDevices[k].deviceID) {
                            $scope.defaultPlayoutDevice = $scope.playoutDevices[k];
                            $().cwic('setPlayoutDevice', playoutId);
                        }
                    }
                }
                // Update view
                if(!$scope.$$phase) { $scope.$apply() }
            }
        }

        $scope.showLocalVideo = function(){
            clearTimeout(mf.timeouts['showVideoView']);
            mf.timeouts['showVideoView'] = setTimeout(function(){
                var $vedioDiv = $('#settings .video-audio-settings');
                if ($vedioDiv.is(":visible")) {
                    $vedioDiv.show();
                    $(document).cwic('addPreviewWindow',{previewWindow: 'localSettingsPreviewVideo' });
                }
            }, 350);
        }

        $scope.removeLocalVideo = function(){

            $(document).cwic('removePreviewWindow',{previewWindow: 'localSettingsPreviewVideo' });
        }

        $scope.changeCaptureDevice = function(){
            var deviceId = $scope.defaultCaptureDevice.deviceID;
            $().cwic('setCaptureDevice', deviceId);
            $scope.saveUserSetting('settings.audioVideo.captureDevice', deviceId);
        }

        $scope.changeRecordingDevice = function(){
            var deviceId = $scope.defaultRecordingDevice.deviceID;
            $().cwic('setRecordingDevice', deviceId);
            $scope.saveUserSetting('settings.audioVideo.recordingDevice', deviceId);
        }

        $scope.changePlayoutDevice = function(){
            var deviceId = $scope.defaultPlayoutDevice.deviceID;
            $().cwic('setPlayoutDevice', deviceId);
            $scope.saveUserSetting('settings.audioVideo.playoutDevice', deviceId);
        }

        $scope.onChangeWebExSite = function(){
            var cred = $scope.webex.username + ':' + $scope.webex.password;
            var credentials64 = EncodingService.encode(cred);
            $scope.webex.selectedSite.credentials = credentials64;
            //call ws getWebExConfig
            var webexURL = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.WEBEX_SETUSER_CONFIG;
            var req = {
                method: 'POST',
                url: webexURL,
                cache:false,
                headers: {
                    'Access-Token': $rootScope.credentials.accessToken
                },
                data: JSON.stringify($scope.webex.selectedSite)
            }
            $http(req).success(function(successResp){
                console.log('webex verify ws success:' + successResp);
                if (successResp&&successResp.success) {
                    $scope.webex.response.isVerfied = true;
                    $scope.webex.response.message = 'WebEx verification is successful.';
                }else{
                    $scope.webex.response.isVerfied = false;
                    $scope.webex.response.message = 'WebEx verification is failed.';
                }
            }).error(function(failResp){
                console.log('webex verify ws failed:' + failResp);
                $scope.webex.response.isVerfied = false;
                $scope.webex.response.message = 'WebEx verification is failed.';
            });
        }
        // Initializarion
        $scope.$watch('authenticationService.authenticated',function (newValue, oldValue) {
                if (newValue) {
                    $scope.init();
                }
        });

        $scope.$watch('defaultCaptureDevice.deviceID', function(newValue, oldValue) {
            // Ignore initial setup.
            if ( newValue === oldValue ) {
                return;
            }
            $scope.changeCaptureDevice();
        });

        $scope.$watch('defaultPlayoutDevice.deviceID', function(newValue, oldValue) {
            // Ignore initial setup.
            if ( newValue === oldValue ) {
                return;
            }
            $scope.changePlayoutDevice();
        });

        $scope.$watch('defaultRecordingDevice.deviceID', function(newValue, oldValue) {
            // Ignore initial setup.
            if ( newValue === oldValue ) {
                return;
            }
            $scope.changeRecordingDevice();
        });

        $scope.$watch('viewSettings', function(newValue, oldValue) {
            // Ignore initial setup.
            if ( newValue === false ) {
                //console.log("settings div is hidden");
                $scope.removeLocalVideo();
                return;
            }

        });

        $scope.$watch('phoneIsReady',function (newValue, oldValue) {
                if (newValue) {
                    $scope.getMultimediaDevices();

                    $('#localvidcontainer').cwic('createVideoWindow',{id: 'localPreviewVideo', success: function(id) {
                        //$scope.previewVideoObject = $('#'+id)[0];
                        console.log('CWIC createVideoWindow -> ' + id);
                    }});

                    $('#settings-selfview').cwic('createVideoWindow',{id: 'localSettingsPreviewVideo', success: function(id) {
                        //$scope.previewSettingsVideoObject = $('#'+id)[0];
                        console.log('CWIC createVideoWindow -> ' + id);
                    }});
                    if($scope.authenticationService.authenticated){
                        $scope.doAutoLogin();
                    }
                }
            });

        $scope.$watch('callmanagerAuthenticationService.RememberAccount', function(newValue, oldValue){
            if(newValue){
                $timeout(function(){
                    $scope.callmanagerAuthenticationService.username = $scope.authenticationService.credentials.user.split('@')[0];
                    $scope.callmanagerAuthenticationService.password = EncodingService.decode(StorageService.get('password'));
                    $scope.doCallManagerLogin();
                },2000);
            }else{
                if(oldValue){
                    $scope.saveUserSetting('callmanagerAuthenticationService.username', '');
                    StorageService.userSet('callmanagerAuthenticationService.password', '');
                }
            }
        });

        //get the webex user saved config right after user login MF app
        $scope.$on('auth-done', function(event, data) {
            console.log('start to call webex get config ws');
            //first get the user/pwd from cache;if there's no default user password of webex , set it with mf user/password

            if (!$scope.webex.username&&!$scope.webex.password) {
                $scope.webex.username = $rootScope.username.split('@')[0];
                $scope.webex.password = $rootScope.password;
            }

            $scope.webex.sites = $rootScope.webExConfigs;
            if (!$scope.webex.sites) {
                $scope.webex.sites = [{
                    "class": "com.akkadian.platform.WebExInfo",
                    "id": null,
                    "clientAccount":
                    { "class": "ClientAccount", "id": 1 },
                    "domain": null,
                    "kdc": null,
                    "partnerId": "412fi",
                    "siteId": "412803",
                    "siteName": "fidelus",
                    "ssoConfiguration": "Cisco MeetingPlace"
                },
                {
                    "class": "com.akkadian.platform.WebExInfo",
                    "id": null,
                    "clientAccount":
                    { "class": "ClientAccount", "id": 1 }
                    ,
                    "domain": null,
                    "kdc": null,
                    "partnerId": "kBA8giI2-P0RTCNm-QmCWw",
                    "siteId": "726177",
                    "siteName": "fidelusmeeting",
                    "ssoConfiguration": "Non-Single Sign-On"
                }];

            }
            //call ws getWebExConfig
            var webexURL = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.WEBEX_GETUSER_CONFIG;
            var req = {
                method: 'GET',
                url: webexURL,
                cache:false,
                headers: {
                    'Access-Token': $rootScope.credentials.accessToken
                }
            }
            $http(req).success(function(successResp){
                if (successResp && successResp.success){
                    if (successResp.webExConfig){
                        $scope.webex.selectedSite = successResp.webExConfig;
                    }else {
                        $scope.webex.selectedSite = {};
                    }
                }
            }).error(function(failResp){
                    $scope.webex.selectedSite = {};
            });
        });


        $scope.getEmailConfiguration = function(){
                //Get email configuration from backend
                $http({
                    method: 'GET',
                    url: PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/genericContact/search?max=1000",
                    headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
                }).success(function (response, status) {

                }).error(function (data, status, headers, config) {
                    console.log('Error to get email notification config - ' + data);
                });
        };
}]);