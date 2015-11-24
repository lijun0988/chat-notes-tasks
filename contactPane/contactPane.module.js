'use strict';

angular.module('contactPane.module', [])

.controller('ContactPaneController',[
	'$scope',
	'$rootScope',
    '$window',
    '$log',
	function($scope, $rootScope, $window, $log) {

	$rootScope.viewMainPhoneSelector = false;
    $rootScope.openAddUnrecognizedPanel = false;

    $rootScope.isOpenUnknownSearchPanel = false;
    $rootScope.isOpenAddUnrecognizedMenu = false;

    $scope.outputPhoneType = [];
	$scope.outputPhoneType['office-phone'] = 'Work';
	$scope.outputPhoneType['mobile-phone'] = 'Mobile';
	$scope.outputPhoneType['home-phone'] = 'Home';

    $scope.onClickPopupModule = function(e) {
        e.stopPropagation();

        $rootScope.addNewContactsVisiblePopUp = true;
        var phoneType = angular.element($(".unrecognized-contact-container-popup")).scope();
        if(phoneType != undefined){
            phoneType.$$childHead.phoneType.work.isToggle = false;
            phoneType.$$childHead.phoneType.mobile.isToggle = false;
            phoneType.$$childHead.phoneType.home.isToggle = false;
        }
    }

    $scope.onClickPopupModuleCenter = function(e) {
        e.stopPropagation();

        $rootScope.openAddUnrecognizedPanel = true;
        var phoneType = angular.element($(".unrecognized-contact-container-popup.center")).scope();
        if(phoneType != undefined){
            phoneType.$$childHead.phoneType.work.isToggle = false;
            phoneType.$$childHead.phoneType.mobile.isToggle = false;
            phoneType.$$childHead.phoneType.home.isToggle = false;
        }
    }

	$scope.selectPhone = function(phone){
		$scope.selectedContact.selectedPhone = phone;
		$rootScope.viewMainPhoneSelector = false;

	}

	$scope.togglePhoneSelector = function(e){
		e.stopPropagation();
		$rootScope.viewMainPhoneSelector = !$rootScope.viewMainPhoneSelector;
	}

    $scope.getPhoneStatus = function() {
        var conversation = $window.calls.getSelectedCall();
        var state='';
        if (conversation) {
            state = conversation.callState.toLowerCase();
            if (conversation.callType === "Outgoing") {
                if (state.toUpperCase()=='RINGOUT')
                    state = 'calling';
            }
            else if (conversation.callType === "Incoming") {
                if (state.toUpperCase()=='RINGIN')
                    state = 'calling';
            }
        }
        return state;
    }

     $scope.isSamePhoneCall = function() {
         if (!$rootScope.selectedContact || !$rootScope.selectedContact.selectedPhone) {
             return true;
         }
         var phoneNumberSel = $rootScope.selectedContact.selectedPhone.number;
         var callingNumber = '';
         var conversation = $window.calls.getSelectedCall();

         if (conversation) {
             if (conversation.callType === "Outgoing") {
                 callingNumber = conversation.calledPartyDirectoryNumber;
             }
             else if (conversation.callType === "Incoming") {
                 callingNumber = conversation.callingPartyDirectoryNumber;
             }
         }
         if (phoneNumberSel && callingNumber) {
             if (phoneNumberSel.replace(/[^0-9]/g, '')==callingNumber.replace(/[^0-9]/g, '')) {
                 return true;
             }
         }
         return false;
     }

    $scope.isMultiCalls = function() {
        var callsCount = $window.calls.getCallsCount();

        if (callsCount==0) return false;
        if (callsCount>1)
            return true;
        if ($window.calls.getSelectedCall().isConference)
            return true;

        return false;
    }

    //center
    $scope.openAddUnrecognizedContact = function(e){
        e.stopPropagation();


        $rootScope.$broadcast('onAddUnknownNumber');
    };

    $scope.isGenericContact = function(contact) {
        if (!contact) return false;
        if (contact.jabberId)
            return contact.jabberId.indexOf('generic-contact') != -1;
        return false;
    };

    $scope.openAddUnrecognizedMenu = function(e){
        e.stopPropagation();
        $rootScope.isOpenAddUnrecognizedMenu = !$rootScope.isOpenAddUnrecognizedMenu;
        $rootScope.isOpenUnknownSearchPanel = false;
    };

    $scope.openUnknownSearch = function(e) {
        e.stopPropagation();
        $rootScope.isOpenAddUnrecognizedMenu = false;
        $rootScope.isOpenUnknownSearchPanel = true;
    };

    //right
    $scope.onClickEditContactPopUp = function (e, contact) {
        e.preventDefault();
        e.stopPropagation();
        $rootScope.addNewContactsVisiblePopUp = !$rootScope.addNewContactsVisiblePopUp;

        $rootScope.$broadcast('addNewContactsVisiblePopUp', contact, null);
    };


    $scope.$on('closeAddUnrecognizedContact', function (newValue, oldValue) {
        $rootScope.openAddUnrecognizedPanel = false;
    });


    $rootScope.$watch('selectedContact', function(newVal, oldVal){
        if(newVal){
            if($rootScope.selectedContact && $rootScope.selectedContact.phones && $rootScope.selectedContact.phones[0]){

                if(!$rootScope.selectedContact.selectedPhone){
                    $scope.selectedPhone = $rootScope.selectedContact.phones[0];
                }

            };
            $rootScope.viewMainPhoneSelector = false;
        }
    });
}])