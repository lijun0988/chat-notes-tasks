'use strict';
//Authentication service  
angular.module('authentication.service', [])

.factory('AuthenticationService', function ($http, $rootScope, $socket, PathService, EncodingService,
    StorageService, CALL_MANAGER, PATHS) {

    var authenticationService = this;
    this.authenticated = false; // this is a boolean that will be modified by
    // the following methods:
    this.credentials = {};
    this.accountsMap = {};

    this.loggedIn = function (credentials) {
        authenticationService.credentials = credentials;
        for (var i = 0; i < credentials.clientAccounts.length; i++) {
            var clientAccount = credentials.clientAccounts[i];
            authenticationService.accountsMap[clientAccount.name] = clientAccount;
        }

        $rootScope.currentAccount = credentials.clientAccounts[0].name;
        $rootScope.credentials = credentials;
        $rootScope.$emit('auth:credentials', credentials);

        authenticationService.authenticated = true;

        $http.defaults.headers.common["Access-Token"] = credentials.accessToken;

        //Get Urls From Server and then login jabber
        PathService.getUrlsFromServer.get().then(function(){
            console.log('Already getting the server configuration , start to login jabber.');
            $rootScope.$broadcast('auth-done');
        });

    };

    this.checkRememberMe = function(){

        var isRememberMeChecked = (StorageService.get('isRememberMeChecked'));

        if(eval(isRememberMeChecked)){
            $rootScope.rememberme = true;
            $rootScope.username = StorageService.get('loggedin');
            $rootScope.password = EncodingService.decode(StorageService.get('password'));
        }else{
            $rootScope.rememberme = false;
            $rootScope.username = '';
            $rootScope.password = '';
            StorageService.remove('loggedin');
            StorageService.remove('password');
        }

    }

    this.onLoad = function () {
        //We are checking the rememberme functionality.
        authenticationService.checkRememberMe();

        // TODO check if this is necessary

        // check the service user/me to get the accounts
        // save them in the autentication service
        // and if token & user are ok.
        // if token & user are not ok we need to delete the cookies

        var token = StorageService.get('accessToken');
        var usr = StorageService.get('loggedin');
        var isRememberMeChecked = (StorageService.get('isRememberMeChecked'));

        if (token && token != '' && usr && usr != '' && eval(isRememberMeChecked)) {
            $http({
                method: 'GET',
                url: PathService.getAccessMeUrl(),
                headers: { 'Access-Token': token }
            }).
            // if the ajax request goes fine success its executed
            success(function (data, status) {
                var resp = data.data;
                resp.accessToken = token;
                authenticationService.loggedIn(resp);

                /// LEGACY /////////////////////////////////////////////////////
                // TODO: remove this after call manager settings is refactored
                // Try to connect to call manager

                mf.login.accessToken = token;
                $.ajaxSetup({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Access-Token', token);
                        xhr.setRequestHeader('Accept', "application/json");
                    }
                });
                mf.services.udpateServicesUrl( resp.clientAccounts[0].name );
                mf.login.user.firstName = resp.firstName;
                mf.login.user.lastName = resp.lastName;
                mf.login.user.username = resp.user;

                authenticationService.whoiam($rootScope.currentAccount, function(data){
                    mf.login.user.person_id = data.data;
                    $rootScope.$broadcast('user_initializated');
                });

                ////////////////////////////////////////////////////////////////
                authenticationService.setAnalytic();

                if(typeof Awesome != 'undefined'){
                    $http({
                        method: 'GET',
                        url: PathService.getAccountConfigUrl()
                    }).success(function (response) {
                        var jabberDomain = response.data.urlsConfig.jabberDomainUrl;
                        var jabberHost = response.data.urlsConfig.jabberBindingUrl;

                        var objSettings = {
                            credentials:  $scope != null ? $scope.credentials: null,
                            credentials64: credentials64,
                            jabberDomain: jabberDomain,
                            jabberHost: jabberHost
                        };

                        Awesome.SetSettings(JSON.stringify(objSettings));

                    }).error(function (error) {
                        console.log("Get URL Config Error: " + error);
                    });
                }

            }).error(function (data, status) {
                authenticationService.authenticated = false;
            });
        }
    };

    this.setAnalytic = function(fromLogin){
        $http({
            method:'GET',
            url:PathService.getAccountConfigUrl()
        }).success(function (response) {
            $rootScope.fidelusDomainName = response.data.piwikConfig.fidelusDomainName;
            $rootScope.fidelusAnalyticServerUrl = response.data.piwikConfig.fidelusAnalyticServerUrl;
            $rootScope.fidelusSiteCode = response.data.piwikConfig.fidelusSiteCode;
            $rootScope.fromLogin = fromLogin;

            var piwikTrackerServer = { 'fidelusDomainName': $rootScope.fidelusDomainName, 'fidelusAnalyticServerUrl': $rootScope.fidelusAnalyticServerUrl, 'fidelusSiteCode': $rootScope.fidelusSiteCode };
            localStorage.setItem('piwikTrackerServer', JSON.stringify(piwikTrackerServer));
            $rootScope.$broadcast('setPiwikTracker');

        }).error(function (error) {
            console.log("Get Account Config Error: "+error);

            var retrievedObject = JSON.parse(localStorage.getItem('piwikTrackerServer'));
            if(retrievedObject != null){
                $rootScope.fidelusDomainName = retrievedObject.fidelusDomainName;
                $rootScope.fidelusAnalyticServerUrl = retrievedObject.fidelusAnalyticServerUrl;
                $rootScope.fidelusSiteCode = retrievedObject.fidelusSiteCode;
                $rootScope.fromLogin = fromLogin;
                $rootScope.$broadcast('setPiwikTracker');
            }
        });
    }

    this.setAnalyticOffline = function(fromLogin){

        var retrievedObject = JSON.parse(localStorage.getItem('piwikTrackerServer'));
        if(retrievedObject != null){
            $rootScope.fidelusDomainName = retrievedObject.fidelusDomainName;
            $rootScope.fidelusAnalyticServerUrl = retrievedObject.fidelusAnalyticServerUrl;
            $rootScope.fidelusSiteCode = retrievedObject.fidelusSiteCode;
            $rootScope.fromLoginError = fromLogin;
            $rootScope.$broadcast('setPiwikTracker');
        }
    }

    this.authenticate = function(credentials64, rememberMe, $scope){

        var permanent = '';
        if (rememberMe) {
            permanent = '&permanent=true'
        };

        // get access token
        $http.get( PathService.getAccessTokenUrl() + '?credentials=' + credentials64 + permanent)
            .success(function(resp){
                var credentials = resp.data;
                $scope.username = credentials.user;
                $scope.accessToken = credentials.accessToken;
                $scope.credentials = credentials;

                if (!resp.success) {
                    $scope.message = mfMessages.autentication.wrongUserOrPassword;
                } else {

                    authenticationService.loggedIn(credentials);

                    // Save info in local storage
                    if (rememberMe) {
                        StorageService.set('loggedin', credentials.user);
                        StorageService.set('accessToken', credentials.accessToken);
                    }

                    $scope.doingLogin = false;

                    //cucm: try to pin with MF user/password under LDAP mode
                    var isLDAP = credentials.authenticationSource;
                    if (isLDAP != "LOCAL") {
                            //var username = StorageService.userGet('callmanagerAuthenticationService.username');
                            //var password = StorageService.userGet('callmanagerAuthenticationService.password');
                            //if(!username || !password){
                                // Update local storage to allow settings > account module to perform autologin
                                var usr = credentials.user.split("@")[0];
                                var pwd = EncodingService.encode($scope.password);
                                StorageService.userSet('callmanagerAuthenticationService.username', usr);
                                StorageService.userSet('callmanagerAuthenticationService.password', pwd);
                                var cucm = StorageService.userGet('callmanagerAuthenticationService.cucm');
                                if(!cucm){
                                    StorageService.userSet('callmanagerAuthenticationService.cucm', PathService.getCallManagerUrl());
                                }
                            //}
                    }

                    ////// Legacy /////////////////////////////////////////////////////////////////
                    // TBD: this belogns to old app, remove after is completly migrated

                    mf.login.user.firstName = resp.data.firstName;
                    mf.login.user.lastName = resp.data.lastName;
                    mf.login.user.authenticationSource = resp.data.authenticationSource;
                    mf.login.user.username = resp.data.user;
                    //mf.login.user.password = password;

                    mf.storage.setItem('user.firstName', mf.login.user.firstName);
                    mf.storage.setItem('user.lastName', mf.login.user.lastName);
                    mf.storage.setItem('user.username', mf.login.user.username);
                    mf.storage.setItem('user.password', password);



                    $.ajaxSetup({
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Access-Token', mf.login.accessToken);
                            xhr.setRequestHeader('Accept', "application/json");
                        }
                    });

                    mf.login.accessToken = resp.data.accessToken;

                    var account = resp.data.clientAccounts[0].name;
                    // User services with user account
                    mf.services.udpateServicesUrl(account);
                    authenticationService.setAnalytic(true);

                    // Set Credentials and Jabber Settings in Local.
                    if(typeof Awesome != 'undefined'){

                        $http({
                            method: 'GET',
                            url: PathService.getAccountConfigUrl()
                        }).success(function (response) {
                            var jabberDomain = response.data.urlsConfig.jabberDomainUrl;
                            var jabberHost = response.data.urlsConfig.jabberBindingUrl;

                            var objSettings = {
                                credentials: $scope.credentials,
                                credentials64: credentials64,
                                jabberDomain: jabberDomain,
                                jabberHost: jabberHost
                            };

                            Awesome.SetSettings(JSON.stringify(objSettings));

                        }).error(function (error) {
                            console.log("Get URL Config Error: " + error);
                        });

                    }

                    authenticationService.whoiam($rootScope.currentAccount, function(data){
                        mf.login.user.person_id = data.data;
                        $rootScope.$broadcast('user_initializated');
                    });
                    ///////////////////////////////////////////////////////////////////////
                }
            })
            .error(function(resp){
                $scope.doingLogin = false;
                $scope.status = resp.status;
                $scope.loginError = true;
                switch(resp.status){
                    case 406:
                        $scope.message = mfMessages.authentication.wrongPassword;
                        break;
                    case 500:
                        $scope.message = mfMessages.authentication.wrongEmail;
                        break;
                    default:
                        $scope.message = resp.message;
                }
                authenticationService.authenticated = false;
                authenticationService.setAnalyticOffline(true);
            });
    }


    this.logout = function () {
        authenticationService.checkRememberMe();

        StorageService.remove('accessToken');

        authenticationService.authenticated = false;
        for (var i = 0; i < authenticationService.credentials.roles.length; i++) {
            var role = authenticationService.credentials.roles[i];
            authenticationService['is' + role] = false;
        }
        authenticationService.credentials = {};
    };

    this.isAccountComplete = function () {
        var currentAccount = authenticationService.accountsMap[$rootScope.currentAccount];
        var isComplete = currentAccount && !currentAccount.incompleteAccount;
        return isComplete;
    };

    this.reauthenticate = function () {
        authenticationService.authenticated = false;

        $http({
            method: 'GET',
            url: PathService.getAccessMeUrl(),
            headers: {
                'Access-Token': authenticationService.credentials.accessToken
            }
        }).
        // if the ajax request goes fine success its executed
        success(function (data, status) {
            var resp = data.data;
            resp.accessToken = authenticationService.credentials.accessToken;
            authenticationService.loggedIn(resp);
        }).error(function (data, status) {
            authenticationService.authenticated = false;
        });
    };

    this.whoiam = function(account, callback){
        $http({
            method: 'GET',
            url: PATHS.BASE_SERVICE_API_URL + account + '/mindframe/user/whoiam',
            headers: {
                'Access-Token': authenticationService.credentials.accessToken
            }
        }).
        // if the ajax request goes fine success its executed
        success(function (data, status) {
            callback(data);
        }).error(function (data, status) {
            console.log(data);
        });
    }

    return authenticationService;
});