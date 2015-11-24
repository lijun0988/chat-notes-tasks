'use strict';

angular.module('login.module', [])

.controller('LoginController', 
	['$scope',
	'$location',
    'PathService',
    'EncodingService',
    'AuthenticationService',
    'StorageService',
    '$socket',
    '$rootScope',
	function($scope, $location, PathService, EncodingService, AuthenticationService, StorageService, $socket, $rootScope){

		$scope.authenticationService = AuthenticationService;
        $scope.messages = {};
        $scope.doingLogin = false;
        $scope.loginError = false;
        
        $scope.currentVersion = localStorage.version;

        $scope.doLogin = function () {

            $scope.doingLogin = true;
            var rememberme = $scope.rememberme;
            var cred = $scope.username + ':' + $scope.password;
            var credentials64 = EncodingService.encode(cred);
            AuthenticationService.authenticate(credentials64, rememberme, $scope, $location);

            // Save base64 encoded password in local storage
            StorageService.set('password', EncodingService.encode($scope.password));
            // Save isRememberMeChecked variable in local storage
            StorageService.set('isRememberMeChecked',rememberme);

            /*if($socket !== undefined){
                $socket.emit('enter_task_module', authenticationService.credentials.userId);
            }*/

            $socket.on('connected', function (socket_id) {
                $rootScope.$on('user_initializated', function () {
                    $socket.emit('activate_notifications', { 'socket_id': socket_id, 'user_id': mf.login.user.person_id });
                });

            });
            
        }

        $scope.clearError = function(){
            $scope.loginError = false;
            $scope.message = '';
        }

}]) // end contacts.controller

