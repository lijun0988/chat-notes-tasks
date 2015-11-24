'use strict';

angular.module('unrecognizedContact.module', [])
.controller('addContactController', ['$scope', '$rootScope', '$http', 'PATHS','JabberService', '$log', '$timeout',
    function ($scope, $rootScope, $http, PATHS, JabberService,$log,$timeout) {

    $scope.submitted = false;
    $scope.unrecognizedContact = [];

    $scope.personSearchList = [];
    $scope.selectedSearchedPerson;


    $scope.init = function () {
        $scope.unrecognizedContact = [];
        $scope.unrecognizedContact.typeContact = 'private';
        $scope.phoneType = [];
        $scope.phoneType['work'] = {
            isToggle: false,
            selected: 'Work',
            number: ''
        };
        $scope.phoneType['home'] = {
            isToggle: false,
            selected: 'Home',
            number: ''
        };
        $scope.phoneType['mobile'] = {
            isToggle: false,
            selected: 'Mobile',
            number: ''
        }
    };

    $scope.onClickModle = function(){
        $scope.clearSearchDropdown();
    }

    $scope.selectSearchedPerson = function () {
        $scope.selectedSearchedPerson = this.person;
        $scope.authenticationSource = this.person.authenticationSource; //authenticationSource=='LDAP'

        $scope.unrecognizedContact.userId = this.person.id;
        $scope.unrecognizedContact.email = this.person.username;

        $scope.unrecognizedContact.firstName = this.person.firstName
        $scope.unrecognizedContact.lastName = this.person.lastName;
        $scope.unrecognizedContact.companyName = this.person.companyName;
        if (this.person.accounts&&this.person.accounts[0]) {
            var account = this.person.accounts[0]
            if (account.phones) $scope.phoneType['work'].number = account.phones[0];
            if (account.phones) $scope.phoneType['mobile'].number = account.mobilePhones[0];
            if (account.phones) $scope.phoneType['home'].number = account.homePhones[0];
            if (!$scope.authenticationSource && !this.person.username) {
                $scope.unrecognizedContact.email = account.emails[0];
            }
        }

    }
    $scope.clearSearchDropdown = function() {
        $scope.personSearchList = [];
    }
    $scope.searchPerson = function (e){
        if (!$scope.unrecognizedContact.email||$scope.unrecognizedContact.email.trim().length==0) {
            $scope.personSearchList = [];
            $scope.selectedSearchedPerson = null;
            return;
        }

        var searchInput = $scope.unrecognizedContact.email.trim();
        if ( searchInput.length > 1 ) {
            $scope.selectedSearchedPerson = null;
            window.clearTimeout(window.timoutSearch);
            window.timoutSearch = window.setTimeout( function () {
                var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.PERSON_SEARCH_URL +"?query="+searchInput+"&max=100&includeDisabled=false";
                var personsearch = $http.get(url, {'cache': false, headers: {'Access-Token': $rootScope.credentials.accessToken }});
                personsearch.then(function(resp) {
                    var persons = resp.data.data;
                    $scope.personSearchList = persons;
                });

            },  150);
        } else {
            $scope.personSearchList = [];
        }
    }

    //addToExistContact: this seems needed to be deleted since MF1401 combine adding contact, then contact can be added directly
    $scope.$on('onAddUnknownNumber', function(event, contact) {
        $scope.clearSearchDropdown();

        if (!contact) {
            $scope.isAddEdit = true;
            $scope.init();
            $scope.phoneType['work'].number = $rootScope.selectedContact.selectedPhone.number;
            if ($rootScope.selectedContact.displayName && $rootScope.selectedContact.displayName.substring('@')!=-1)
                $scope.unrecognizedContact.email = $rootScope.selectedContact.displayName;//unknown email from jabber

            $rootScope.openAddUnrecognizedPanel = true;
            $rootScope.isOpenAddUnrecognizedMenu = false;
            $rootScope.isOpenUnknownSearchPanel = false;
        }
        //add to existing
        else {
            $scope.isAddEdit = false;
            if (contact.groups) { //MF server groups has different meaning with roster groups
                contact.groups = null;
            }
            //set private/public visibility (search person don't give client visibility)
            for(var i=0; i< $rootScope.myGenericsUser.length; i++){
                if($rootScope.myGenericsUser[i].id == contact.id){
                    contact.visibility = $rootScope.myGenericsUser[i].visibility;
                    //if ($rootScope.myGenericsUser[i].accounts&&$rootScope.myGenericsUser[i].accounts[0])
                    //    contact.email = $rootScope.myGenericsUser[i].accounts[0].emails[0];

                    break;
                }
            }
            $scope.addContactToUpdate(contact);
            if (!$scope.phoneType['work'].number)
                $scope.phoneType['work'].number = $rootScope.selectedContact.selectedPhone.number;
            else if (!$scope.phoneType['home'].number)
                $scope.phoneType['home'].number = $rootScope.selectedContact.selectedPhone.number;
            else if (!$scope.phoneType['mobile'].number)
                $scope.phoneType['mobile'].number = $rootScope.selectedContact.selectedPhone.number;

            $rootScope.openAddUnrecognizedPanel = true;
            $rootScope.isOpenAddUnrecognizedMenu = false;
            $rootScope.isOpenUnknownSearchPanel = false;

        }

    });

    $scope.$on('onEditContactInRoster', function (event, contact, group) {
        $scope.isAddEdit = false;
        $scope.clearSearchDropdown();
        $scope.addContactToUpdate(contact,group);
    });

    $scope.$on('addNewContactsVisiblePopUp', function(event, contact) {
        $scope.isAddEdit = false;
        $scope.clearSearchDropdown();
        $scope.addContactToUpdate(contact, null);
    });

    $scope.$on('emptyData', function(event, contact) {
        $scope.init();
        $scope.isAddEdit = true;
    });

    $scope.addContactToUpdate = function(contact, group){
        $scope.init();
        $scope.unrecognizedContact.userId = contact.id;
        $scope.unrecognizedContact.firstName = contact.firstName;
        $scope.unrecognizedContact.lastName = contact.lastName;
        $scope.unrecognizedContact.typeContact = contact.visibility;
        $scope.unrecognizedContact.companyName = contact.companyName;
        if (!contact.jid) {
            if (contact.groups && contact.groups.length > 0) {
                $scope.unrecognizedContact.group = contact.groups[0];
            } else {
                $scope.unrecognizedContact.group = [''];
            }
        } else {
            if (contact._groups && contact._groups.length > 0) {
                $scope.unrecognizedContact.group = contact._groups[0];
            } else {
                $scope.unrecognizedContact.group = [''];
            }
        }

        if (contact.emails && !contact.jid) {
            $scope.unrecognizedContact.email = contact.emails[0];
        } else if (contact.accounts && contact.accounts[0]) {
            $scope.unrecognizedContact.email = contact.accounts[0].emails[0];
        }
        if (contact.jid) {
            $scope.unrecognizedContact.email=contact.email;
            if (contact.displayName){
                $scope.unrecognizedContact.firstName = contact.displayName.split(' ')[0];
                $scope.unrecognizedContact.lastName = contact.displayName.split(' ')[1];
            }
        }

        if (contact.phones && contact.phones.length > 0) {
            for (var i=0;i<contact.phones.length;i++) {
                if (contact.phones[i].type=='office-phone') {
                    $scope.addNumberToPhoneTypes(contact.phones[i].number, 'Work');
                }
                if (contact.phones[i].type=='mobile-phone') {
                    $scope.addNumberToPhoneTypes(contact.phones[i].number, 'Mobile');
                }
                if (contact.phones[i].type=='home-phone') {
                    $scope.addNumberToPhoneTypes(contact.phones[i].number, 'Home');
                }
            }

        }
    };

    $scope.$on('addContactToDisable', function (event, contact) {
        $scope.disable(contact.id);
    });

    $scope.cancel = function(e) {
        e.stopPropagation();
        if ($scope.xyz==2) {

            $rootScope.addNewContactsVisiblePopUp = false;
            $scope.unrecognizedContactForm.submitted = false;
        }
        else if ($scope.xyz==3) {
            $rootScope.openAddUnrecognizedPanel = false;
            $rootScope.isOpenAddUnrecognizedMenu = false;
            $rootScope.isOpenUnknownSearchPanel = false;

            $scope.unrecognizedContactForm.submitted = false;
        }
        else {
            $rootScope.toggleAddNewContactsMenu();
            $scope.unrecognizedContactForm.submitted = false;
        }
    }


    $scope.submit = function(){
        if ($scope.unrecognizedContactForm.$valid) {
            if (!$scope.isAddEdit) {
                $scope.update();
            }
            else {
                $scope.save();//$scope.unrecognizedContact.email
            }
            $rootScope.openAddUnrecognizedPanel = false;

        } else {
            $scope.unrecognizedContactForm.submitted = true;

        }
    };

    $scope.selectPhoneType = function (e, type, option) {
        e.stopPropagation();
        $scope.phoneType[type].isToggle = !$scope.phoneType[type].isToggle;
        $scope.phoneType[type].selected = option;
    };

    $scope.save = function () {
        var email = $scope.unrecognizedContact.email;
        $log.debug("Saving new contact, email is "+email);
        //if no email, create generic contact directly
        if (!email || email.trim().length==0) {
            $scope.saveGenericContact(false);
            return;
        }

        email = email.trim();
        var group = [];
        if ($scope.unrecognizedContact.group) { group.push($scope.unrecognizedContact.group); }
        $log.debug("Saving new contact, group is "+group);
        //search by email : if found matched result means the email is LDAP type then adding directly; if not found, creating generic contact then adding jabber
        var urlQuery = PATHS.BASE_SERVICE_API_URL  + $rootScope.currentAccount + "/mindframe/user/getperson?userid="+email;
        $http({
            method: 'GET',
            url: urlQuery
        }).success(function (data, status) {
                $log.debug('status, '+status+', data:'+JSON.stringify(data));
                try{
                    JabberService.addContact(email, email, [group], function(errorStanza){
                        console.log('addContact callback');
                        console.log(errorStanza);
                    });
                }catch(e){
                    console.log('An error occurs when trying to add contact:' + e);
                }

                $rootScope.addNewContactsVisiblePopUp = false;
                if ($scope.xyz==1) {
                    $rootScope.toggleAddNewContactsMenu();
                }
        }).error(function(data, status) {
                $log.debug("Saving new contact: MF server search person failed");
                $scope.saveGenericContact(true);
        });

    };

    $scope.saveGenericContact = function(hasEmail) {
        var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/genericContact/create";
        var json = {
            "firstName": $scope.unrecognizedContact.firstName,
            "lastName": $scope.unrecognizedContact.lastName,
            "companyName": $scope.unrecognizedContact.companyName,
            "enabled": 'true',

            "accounts": [
                {"priority": 0, "type": 'akkadian'}
            ],
            "groups": [],
            "externalSourceId": 'LOCAL',
            "authenticationSource": 'LOCAL',
            "accountUserEnabled": true,
            "visibility": $scope.unrecognizedContact.typeContact
        };

        if ($scope.unrecognizedContact.group != undefined && $scope.unrecognizedContact.group != '') {
            json.groups.push($scope.unrecognizedContact.group);
        }

        if ($scope.unrecognizedContact.email != undefined) {
            json.accounts[0].emails = [$scope.unrecognizedContact.email];
        }

        if ($scope.phoneType['work'].number != null && $scope.phoneType['work'].number != '') {
            json = $scope.preparePhoneNumbers('work', json);
        }

        if ($scope.phoneType['mobile'].number != null && $scope.phoneType['mobile'].number != '') {
            json = $scope.preparePhoneNumbers('mobile', json);
        }

        if ($scope.phoneType['home'].number != null && $scope.phoneType['home'].number != '') {
            json = $scope.preparePhoneNumbers('home', json);
        }

        $http({
            method: 'POST',
            url: url,
            headers: {'Access-Token': $scope.authenticationService.credentials.accessToken },
            data: JSON.stringify(json)
        }).success(function (response, status) {
                $rootScope.$broadcast('addContactToGroup', response.data);

                $scope.unrecognizedContactForm.submitted = false;
                console.log(response.data);

                if (hasEmail) { //if has email , detect adding jabber
                    $timeout(function() {
                        try{
                            var email = $scope.unrecognizedContact.email;
                            var group = [];
                            if ($scope.unrecognizedContact.group) {
                                group.push($scope.unrecognizedContact.group);
                            }
                            if (email && email.trim().length>0) {
                                JabberService.addContact(email.trim(), email.trim(), group, function(errorStanza){
                                    console.log('addContact callback');
                                    console.log(errorStanza);
                                });
                            }
                        }catch(e){
                            console.log('An error occurs when trying to add contact:' + e);
                        }
                    },1000);
                }

                $rootScope.addNewContactsVisiblePopUp = false;
                if ($scope.xyz==1) {
                    $rootScope.toggleAddNewContactsMenu();
                }
            })
            .error(function (data, status, headers, config) {
                console.log('Error to save contact - ' + data);
                //$rootScope.addNewContactsVisiblePopUp = false;
                //even generic failed, we need to try to add email as jabber.
                try{
                    var email = $scope.unrecognizedContact.email;
                    var group = [];
                    if ($scope.unrecognizedContact.group) {
                        group.push($scope.unrecognizedContact.group);
                    }
                    if (email && email.trim().length>0) {
                        JabberService.addContact(email.trim(), email.trim(), group, function(errorStanza){
                            console.log('addContact callback');
                            console.log(errorStanza);
                            $rootScope.addNewContactsVisiblePopUp = false;
                            if ($scope.xyz==1) {
                                $rootScope.toggleAddNewContactsMenu();
                            }
                        });
                    }
                }catch(e){
                    console.log('An error occurs when trying to add contact:' + e);
                }
            });

    }

    $scope.update = function () {
        var email = $scope.unrecognizedContact.email;
        $log.debug("Updating new contact, email is "+email);
        //if no email, create generic contact directly
        if (!email || email.trim().length==0) {
            $scope.updateGenericContact(false);
            return;
        }
        else {
            $scope.updateGenericContact(true);
        }

    };

    $scope.updateGenericContact = function(hasEmail) {

        var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/genericContact/modify/" + $scope.unrecognizedContact.userId;
        var json = {
            "firstName": $scope.unrecognizedContact.firstName,
            "lastName": $scope.unrecognizedContact.lastName,
            "companyName": $scope.unrecognizedContact.companyName,
            "enabled": 'true',
            "accounts": [
                {"priority": 0, "type": 'akkadian'}
            ],
            "groups": [],
            "externalSourceId": 'LOCAL',
            "authenticationSource": 'LOCAL',
            "accountUserEnabled": true,
            "visibility": $scope.unrecognizedContact.typeContact
        };

        if($rootScope.selectedContact != undefined){
            $rootScope.selectedContact.displayName = $scope.unrecognizedContact.firstName + ' ' + $scope.unrecognizedContact.lastName;
        }

        if ($scope.unrecognizedContact.group != undefined && $scope.unrecognizedContact.group != '') {
            json.groups = [$scope.unrecognizedContact.group];
        }

        if ($scope.unrecognizedContact.email != undefined) {
            json.accounts[0].emails = [$scope.unrecognizedContact.email];
        }

        if ($scope.phoneType['work'].number != null && $scope.phoneType['work'].number != '') {
            json = $scope.preparePhoneNumbers('work', json);
        }

        if ($scope.phoneType['mobile'].number != null && $scope.phoneType['mobile'].number != '') {
            json = $scope.preparePhoneNumbers('mobile', json);
        }

        if ($scope.phoneType['home'].number != null && $scope.phoneType['home'].number != '') {
            json = $scope.preparePhoneNumbers('home', json);
        }

        $http({
            method: 'POST',
            url: url,
            headers: {'Access-Token': $scope.authenticationService.credentials.accessToken },
            data: JSON.stringify(json)
        }).success(function (response, status) {
                //if (!hasEmail) { //when there's no email, let contact module do the my ws work.
                    $rootScope.$broadcast('removeContactToGroup', response.data);
                //}
                $scope.unrecognizedContactForm.submitted = false;
                console.log(response.data);

                if (hasEmail) { //if has email and email changed, detect adding jabber
                  $timeout(function(){
                    try{
                        var email = $scope.unrecognizedContact.email;
                        var group = [];
                        if ($scope.unrecognizedContact.group) {
                            group.push($scope.unrecognizedContact.group);
                        }
                        if (email && email.trim().length>0) {
                            JabberService.addContact(email.trim(), email.trim(), group, function(errorStanza){
                                console.log('addContact callback');
                                console.log(errorStanza);
                            });
                        }
                    }catch(e){
                        console.log('An error occurs when trying to add contact:' + e);
                    }
                  },1000);
                }

                $rootScope.addNewContactsVisiblePopUp = false;
                if ($scope.xyz==1) {
                    $rootScope.toggleAddNewContactsMenu();
                }
                $rootScope.openAddUnrecognizedPanel = false;
                $rootScope.isOpenAddUnrecognizedMenu = false;
                $rootScope.isOpenUnknownSearchPanel = false;
            })
            .error(function (data, status, headers, config) {
                console.log('Error to update contact - ' + data);
            });
    };

    $scope.addNumberToPhoneTypes = function (phoneNumber, phoneType) {
        if (phoneType=='Work') {
            $scope.phoneType['work'].number = phoneNumber;
            $scope.phoneType['work'].selected = phoneType;
        }
        if (phoneType=='Mobile') {
            $scope.phoneType['mobile'].number = phoneNumber;
            $scope.phoneType['mobile'].selected = phoneType;
        }
        if (phoneType=='Home') {
            $scope.phoneType['home'].number = phoneNumber;
            $scope.phoneType['home'].selected = phoneType;
        }
    };

    $scope.preparePhoneNumbersToUpdate = function (phones, phoneType) {
        if (phones.length == 1) {
            $scope.addNumberToPhoneTypes(phones[0], phoneType);
        } else {
            for (var p = 0; p < phones.length; p++) {
                $scope.addNumberToPhoneTypes(phones[p], phoneType);
            }
        }
    };

    $scope.preparePhoneNumbers = function (phoneType, json) {
        if ($scope.phoneType[phoneType].selected == 'Work') {
            if (json.accounts[0].phones == undefined) {
                json.accounts[0].phones = [];
            }
            json.accounts[0].phones.push($scope.phoneType[phoneType].number);
        } else if ($scope.phoneType[phoneType].selected == 'Mobile') {
            if (json.accounts[0].mobilePhones == undefined) {
                json.accounts[0].mobilePhones = [];
            }
            json.accounts[0].mobilePhones.push($scope.phoneType[phoneType].number);
        } else if ($scope.phoneType[phoneType].selected == 'Home') {
            if (json.accounts[0].homePhones == undefined) {
                json.accounts[0].homePhones = [];
            }
            json.accounts[0].homePhones.push($scope.phoneType[phoneType].number);
        }
        return json;
    };

    $scope.disable = function (id) {
        var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/genericContact/modify/" + id;
        var json = {
            "enabled": 'false'
        };
        $http({
            method: 'POST',
            url: url,
            headers: {'Access-Token': $scope.authenticationService.credentials.accessToken },
            data: JSON.stringify(json)
        })
            .success(function (response, status) {
            })
            .error(function (data, status, headers, config) {
                console.log('Error to disable contact - ' + data);
            });
    };

    $scope.togglePhoneType = function(e, type){
        e.stopPropagation();
        $scope.phoneType[type].isToggle = !$scope.phoneType[type].isToggle;
        if (type=='work' && $scope.phoneType[type].isToggle==true) {
            $scope.phoneType['mobile'].isToggle = false;
            $scope.phoneType['home'].isToggle = false;
        }
        else if (type=='mobile' && $scope.phoneType[type].isToggle==true) {
            $scope.phoneType['work'].isToggle = false;
            $scope.phoneType['home'].isToggle = false;
        }
        else if (type=='home' && $scope.phoneType[type].isToggle==true) {
            $scope.phoneType['mobile'].isToggle = false;
            $scope.phoneType['work'].isToggle = false;
        }
    }

    $scope.init();

    }])
    .directive('phoneNumberFormat', function () {
        return{
            restrict: 'A',
            terminal: true,
            require: "?ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {
                scope.$watch(attrs.ngModel, function () {

                    if (scope.$eval(attrs.ngModel) != undefined) {
                        var value = scope.$eval(attrs.ngModel).replace(/[^0-9\s]+/g, '');
                        switch (value.length) {
                            case 10:
                                attrs.$$element.val(value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
                                break;
                            case 11:
                                attrs.$$element.val(value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4"));
                                break;
                            default:
                                attrs.$$element.val(value);
                                break;
                        }
                        ngModelCtrl.$setViewValue(attrs.$$element.val());
                        ngModelCtrl.$render();
                    }
                });
            }
        };
    });