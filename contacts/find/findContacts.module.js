angular.module('findContacts.module', ['resources', 'jabber.service'])

    .controller('findContactsController', function ($scope, $rootScope, $http, $interval, $timeout, PATHS, JabberService,CallmanagerAuthenticationService) {

        var addPeopleInterval;
        var addContactTimer;

        $scope.init = {
            input: '',
            loading: false
        };
        $scope.response = {
            fullName: '',
            presence: '',
            phones: {
                home: [],
                mobile: [],
                work: []
            }
        };
        $scope.contacts = [];
        $rootScope.openAddContact = false;
        $scope.disableAddButton = false;

        $scope.clickBtnAdd = function(e){
            e.stopPropagation();
            $rootScope.openAddContact = true;
        };
        $scope.addToExistContact = function(contact) {
            if (!contact || (contact.authenticationSource&&contact.authenticationSource=='LDAP') ) {
                return;
            }
            contact.phones = groupContactPhones(contact.accounts[0]);
            $rootScope.$broadcast('onAddUnknownNumber', contact);

        };
        $scope.searchGenericContact = function(event) {
            if (!$scope.init.input) {
                $scope.contacts = null;
            }
            $timeout.cancel(addContactTimer);
            addContactTimer = $timeout(function () {

                    $scope.init.loading = true;
                    var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/person/search?query=" + $scope.init.input + '&includeDisabled=false';
                    $http({
                        method: 'GET',
                        url: url,
                        headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
                    }).success(function (response, status) {
                            if (status == 200) {
                                $timeout.cancel(addContactTimer);
                                $scope.parseContactInformationGeneric(response, true);

                                $scope.init.loading = false;
                            }
                        }).error(function (data, status, headers, config) {
                            console.log('Find Contacts error - ' + data);
                        });



                /* there's no search abiblity in generic contacts by keyword
                $scope.init.loading = true;
                $http({
                    method: 'GET',
                    url: PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/genericContact/search?max=1000",
                    headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
                })
                    .success(function (response, status) {
                        $timeout.cancel(addContactTimer);
                        $scope.contacts = response.data;
                        $scope.init.loading = false;
                    })
                    .error(function (data, status, headers, config) {
                        console.log('Error to get my generics contacts - ' + data);
                    });
                */


            },500);
        };

        $scope.search = function (event) {
            $timeout.cancel(addContactTimer);
            addContactTimer = $timeout(function () {
                $scope.contacts = [];
                if ($scope.init.input != '') {
                    $scope.init.loading = true;
                    var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/person/search?query=" + $scope.init.input + '&includeDisabled=false';
                    $http({
                        method: 'GET',
                        url: url,
                        headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
                    }).success(function (response, status) {
                            if (status == 200) {
                                $timeout.cancel(addContactTimer);
                                $scope.parseContactInformation(response);
                                $scope.init.loading = false;
                                // if the search field only contains numbers, and you press enter key make a call.
                                if (event.keyCode === 13 && $scope.init.input.length >= 4 && !$scope.init.input.match(/[^0-9*#+]/g)) {
                                    $scope.call($scope.init.input);
                                }
                            }
                        }).error(function (data, status, headers, config) {
                            console.log('Find Contacts error - ' + data);
                        });
                }
            }, 500);
        };

        $scope.getStatusClass = function (status, extra) {
            var statusClass;
            switch (status) {
                case 'away':
                    statusClass = 'away';
                    break;
                case 'xa':
                    statusClass = 'away';
                    if (extra && extra === 'Presenting') {
                        statusClass = 'dnd';
                    }
                    break;

                case 'chat':
                case 'available':
                    statusClass = 'available';
                    break;
                case 'dnd':
                    statusClass = 'dnd';
                    break;

                default:
                    statusClass = status;
            }
            return statusClass;
        }

        $scope.getPresence = function (jid) {
            var result;
            var presence = JabberService.getPrimaryPresenceForEntity(jid);
            if (presence != null || presence != undefined) {
                var presenceType, presenceShow;
                if (presence) {
                    presenceType = presence.getType() || "available";
                    presenceShow = presence.getShow() || presenceType || "available";
                } else {
                    presenceShow = "unavailable";
                }
                result = $scope.getStatusClass(presenceShow, presence ? presence.getStatus() : "unavailable");
            }
            else {
                result = "unavailable";
            }

            return result;
        };

        $scope.parseContactInformationGeneric = function(data, isGeneric){
            $scope.contacts = [];
            if (data.data.length != 0) {
                if (!isGeneric) {
                    $.each(data.data, function (index, value) {
                        $scope.contacts.push(value);
                    });
                } else {
                    $.each(data.data, function (index, value) {
                        //if (value.class='GenericContact') {
                        //value.authenticationSource
                        $scope.contacts.push(value);
                        //}
                    });
                }
            }
            else {
                $scope.contacts = 'No User Found';
            }
        };

        $scope.parseContactInformation = function (data) {
            $scope.contacts = [];

            if (data.data.length != 0) {
                //Get contact information of the search result
                $.each(data.data, function (index, value) {
                    if (value != null) {
                        $scope.response.fullName = value.firstName + ' ' + value.lastName;
                        $scope.response.presence = $scope.getPresence(value.username);
                        $.each(value.accounts, function (indexAccount, valueAccount) {
                            if (valueAccount.phones.length > 0) {
                                $scope.response.phones.work.push.apply($scope.response.phones.work, valueAccount.phones);
                            }
                            if (valueAccount.mobilePhones.length > 0) {
                                $scope.response.phones.mobile.push.apply($scope.response.phones.mobile, valueAccount.mobilePhones);
                            }
                            if (valueAccount.homePhones.length > 0) {
                                $scope.response.phones.home.push.apply($scope.response.phones.home, valueAccount.homePhones);
                            }
                        });

                        //add contact information to array
                        $scope.contacts.push({
                            fullName: $scope.response.fullName.trim(),
                            presence: $scope.response.presence,
                            phones: {
                                home: $scope.response.phones.home,
                                mobile: $scope.response.phones.mobile,
                                work: $scope.response.phones.work
                            }
                        });

                        //clear scope
                        $scope.response.fullName = '';
                        $scope.response.phones =
                        {
                            home: [],
                            mobile: [],
                            work: []
                        };
                        $scope.response.presence = '';
                    }
                });
            }
            else {
                $scope.contacts = "no-data";
            }

            console.log(data);
            console.log($scope.contacts);
        };

        $scope.showAddContactPanel = function () {
            // $rootScope.openAddContact = $rootScope.openAddContact ? false : true;
        };

        $scope.call = function (value) {
            if(!CallmanagerAuthenticationService.authenticated) return;
            var number = value.replace(/[^0-9*#+]/g, '');
            callButtonClick(number);
            if (number) {
                showMindFrameInfo(number);
            }
            $scope.cleanSearch();
            $('#callbtn-add').click();
        };

        $scope.isCallInProgress = function () {
            if (angular.isDefined(addPeopleInterval)) {
                return;
            }
            addPeopleInterval = $interval(function () {
                var conversation = calls.getSelectedCall();
                if (conversation && conversation.state === 'Connected') {
                    $scope.disableAddButton = false;
                }
                else {
                    $scope.disableAddButton = true;
                    $rootScope.openAddContact = false;
                    $scope.init.input = '';
                    $scope.contacts = [];
                }
            }, 1000);
        };

        //$scope.isCallInProgress();

        $scope.cleanSearch = function () {
            $scope.init.input = '';
            $scope.contacts = [];
        };

        $scope.stopPropagation = function (e) {
            e.stopPropagation();
        };
    });


$(document).ready(function () {

});