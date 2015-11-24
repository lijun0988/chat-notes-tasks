'use strict';

angular.module('callmanager.authentication.service', [])

.factory('CallmanagerAuthenticationService', function ($http, $rootScope, PathService, EncodingService, StorageService, MessageService, CALL_MANAGER) {

    var CallmanagerAuthenticationService = this;

    this.authenticated = false;
    this.username = '';
    this.password = '';
    this.encyptedPassword;
    this.cucm = '';
    this.phoneMode = 'DeskPhone';
    this.phoneModes = [{value: 'SoftPhone', desc: 'SoftPhone'}, {value: 'DeskPhone', desc: 'Desk Phone'}];
    this.phonesLoaded = false;
    this.device = '';
    this.devices = [];
    this.phoneRegistration;
    this.autoLogin = false;
    this.registrationInProgress = false;
    this.registrationSuccess = false;
    var $scope;


    var timerAutoConnectionCUCM ; //use for computer sleep timer
    var timeOutForReLoginWakeup;
    var timeIntervalCheckSleep = 5*1000;

    function phoneRegistrationError(me, error) {
        me.authenticated = false;
        me.autoLogin = false;
        var msg = '';

        if (error.code && error.code == 22) {
            msg = mfMessages.callManager.invalidLogin;
            //msg = mfMessages.callManager.invalidCredentials;
        }else if (error.code && error.code == 20) {
            msg = mfMessages.callManager.authenticationFailed;
        }else if(error.message){
            // TODO: maybe we can move the code above into the errorCwicMap and get it from this new service.
            msg = MessageService.getErrorMessageAdapted(error);
        }else{
            msg = mfMessages.callManager.unableToLogin;
        };
        
        $scope.accountLoginProgress = false;
        $scope.deviceSelectionProgress = false;
        $scope.loginError = true;
        $scope.loginErrorMessage = msg;
        $scope.message = '';

        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    this.authenticationNedded = function(){
        return !!(this.phoneMode === 'DeskPhone' || $('#auth').attr('checked'));
    }

    this.registerPhone = function(scope) {
        this.registrationInProgress = true;
        var me = this;
        var forcereg = true;
        var authNeeded = true;
        if(this.phoneMode == 'SoftPhone') authNeeded = false;
        if(this.encyptedPassword) this.password = this.encyptedPassword;
        if(scope) $scope = scope;

        $('#phonecontainer').cwic('registerPhone', {
            user: this.username,
            password: this.password,
            cucm: (this.cucm || '').split(','), // array of string
            mode: this.phoneMode,
            authenticate: authNeeded,
            forceRegistration: forcereg,

            // devices available after login
            devicesAvailable: function(devices, phoneMode, callback, automatic) {
                me.devices = devices;
                me.authenticated = true;                
                me.phonesLoaded = true;
                if(me.device && me.device.name){
                    callback(me.phoneMode, me.device.name, '');
                }else{
                    $scope.accountLoginProgress = false;
                    $scope.deviceSelectionProgress = false;
                    $scope.message = mfMessages.callManager.successfullConected;
                    //$scope.message = mfMessages.callManager.connected;
                }
                
                if(!$scope.$$phase) {
                  $scope.$apply();
                }

            },

            // Success phone resitration
            success: function(registration) {
                // Force to load phones with devicesAvailable callback
                if(!me.phonesLoaded){
                    me.logout();
                    return;
                }

                // cwic log
                settings.log('Registration succeeded. Registration: ',registration);

                me.authenticated = true;
                me.phoneRegistration = registration;
                globalreg = registration;//
                $scope.accountLoginProgress = false;
                $scope.deviceSelectionProgress = false;
                $scope.message = mfMessages.callManager.successfullConected; //mfMessages.callManager.connectedDevice.replace('__DEVICE__', me.device);
                $scope.loginError = false;
                $scope.loginErrorMessage = null;
                me.registrationInProgress = false;
                me.registrationSuccess = true;
                if(!$scope.$$phase) {
                  $scope.$apply();
                }

                me.autoLogin = false;

                // LEGACY ////////////////////////////////////
                // Remove this when handling bar is migrated to angular.
                mf.elements.callBtnCall.removeClass( mf.cssClasses.DISABLED );

                //When computer is sleep , the phone plugin will die, and cucm connection will be lost;
                //but if you don't sleep computer , just lost network connection, plugin seems can recover the cucm connection !!!
                //so we need to check whether the computer ever enter sleep mode !!
                var lastTime = (new Date()).getTime();
                clearInterval(timerAutoConnectionCUCM);
                timerAutoConnectionCUCM = setInterval(function() {
                    var currentTime = (new Date()).getTime();

                    if (currentTime > (lastTime + timeIntervalCheckSleep+2*1000)) {  // ignore small delays
                        lastTime = currentTime;
                        // Probably just woke up!
                        //window.alert('just wake up');


                        var scopeSettings = angular.element($('.settings-module')).scope();
                        scopeSettings.callmanagerAuthenticationService.registrationSuccess = false;
                        scopeSettings.callmanagerAuthenticationService.registrationInProgress = false;

                        window.clearInterval(timeOutForReLoginWakeup); //after computer is waken up , try cucm login after 20s
                        timeOutForReLoginWakeup = window.setInterval(function() {
                            var isOnLine = navigator.onLine;
                            if (isOnLine==false) return;
                            if (isOnLine && scopeSettings && scopeSettings.callmanagerAuthenticationService
                                && scopeSettings.callmanagerAuthenticationService.username
                                && scopeSettings.callmanagerAuthenticationService.username.trim().length>0
                                && scopeSettings.callmanagerAuthenticationService.password.trim().length>0
                                && scopeSettings.callmanagerAuthenticationService.registrationInProgress==false
                                && scopeSettings.callmanagerAuthenticationService.registrationSuccess==false) {

                                    scopeSettings.$apply(function(){
                                        scopeSettings.doAutoLogin();
                                        console.log('##########system will do auto login since computer has been slept before');

                                    });

                            }
                        },60*1000);



                    } else {
                        lastTime = currentTime;
                    }
                }, timeIntervalCheckSleep);


            },

            error: function(error){
                me.registrationInProgress = false;
                phoneRegistrationError(me, error);
                //me.logout();

                me.registrationSuccess = false;
            }
        })
    }

    this.loggedIn = function (credentials) {

    }

    this.onLoad = function () {
        // Check if there is data stored in local storage
    }

    this.authenticate = function(scope){
        // magic number for encoded password length and trailing char, may break in the future
        // original password must be short <16 chars to produce something that matches  
        if(this.password.length === 44 && this.password[43] === '=') {
            this.encyptedPassword = {'cipher':'cucm','encrypted':this.password};
        }

        this.registerPhone(scope);

    } // End of login

    this.logout = function(scope){
        
        if(scope) $scope = scope;
        var me = this;

        // Clear stored values

        $('#phonecontainer').cwic('unregisterPhone', {
            forceLogout: true,
            complete: function(){
                
                calls.removeAll(); // TBD: move

            }
        });

        if(me.autoLogin){
                    me.registerPhone();
                }else{
                    //me.username = '';
                    //me.password = '';
                    me.device = '';
                    me.devices = [];
                    me.phoneMode = 'DeskPhone';
                    me.clearStoredData();

                    // LEGACY ////////////////////////////////////
                    // Remove this when handling bar is migrated to angular.
                    mf.elements.callBtnCall.addClass( mf.cssClasses.DISABLED );
                }

                me.authenticated = false;
                me.phonesLoaded = false;
                me.phoneRegistration = undefined;
                me.registrationInProgress = false;
                $scope.accountLoginProgress = false;

                if(!$scope.$$phase) {
                    $scope.$apply();
                }

        $(document).cwic('removePreviewWindow',{previewWindow: 'localSettingsPreviewVideo' });

    }

    this.clearStoredData = function(){
        StorageService.userSet('callmanagerAuthenticationService.username', this.device);
        StorageService.userSet('callmanagerAuthenticationService.password', this.password);
        StorageService.userSet('callmanagerAuthenticationService.phoneMode', this.phoneMode);
        StorageService.userSet('callmanagerAuthenticationService.device', this.device);
    }

    this.reauthenticate = function () {
 
    }

    return this;
    
});