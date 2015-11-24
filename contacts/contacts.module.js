'use strict';

angular.module('contacts.module', ['jabber.service', 'resources', 'popup.service'])

.filter('cutName', function () {
	return function (input, scope) {
		if (input) {
			var cutLength = [];
			cutLength['long'] = 25;
			cutLength['short'] = 20;
			var stringSizeType = 'long';
			var output;
			if(scope && scope > 0) stringSizeType = 'short';
			(input.length > cutLength[stringSizeType]) ?
				output = input.substring(0, cutLength[stringSizeType] - 3) + '...' :
				output = input;
			return output;
		}
	}
})
.controller('ContactsController',
    ['$scope',
     '$http',
    '$rootScope',
    '$log',
    'USER_STATUSES',
    'SETTINGS',
    'ANALYTICS',
    'JabberService',
    'PATHS',
    'PathService',
    'AuthenticationService',
    'EncodingService',
    'StorageService',
    'Resource',
    'Person',
    'Contact',
    'PopupService',
    'PostmessageService',
    'CallmanagerAuthenticationService',
    'User',
    '$interval',
    '$timeout',
    '$window',
    function($scope, $http, $rootScope, $log,
            USER_STATUSES, SETTINGS, ANALYTICS, JabberService, PATHS, PathService,
            AuthenticationService, EncodingService, StorageService,
            Resource, Person, Contact, PopupService, PostmessageService,
            CallmanagerAuthenticationService, User, $interval, $timeout, $window){

        $scope.Person = Person;
        $scope.authenticationService = AuthenticationService;
        $scope.callmanagerAuthenticationService = CallmanagerAuthenticationService;
        $rootScope.me = {};
        $scope.contactsList = [];
        $scope.mindframeContacts = [];
        $scope.contactsToCheck = [];

        $scope.userStatuses = [];
        $rootScope.statusSelectorToggle = false;
        $rootScope.statusShowHideMF = false;
        $scope.phoneSelectorToggle = -1;
        $scope.myStatus = '';
        $scope.errors = {};
        $scope.elements = { root: $('.contacts-module') };
        $scope.statusShow = [];
        $scope.statusShow['available'] = 'Available';
        $scope.statusShow['chat'] = 'Available';
        $scope.statusShow['custom-available'] = 'Custom Available';
        $scope.statusShow['away'] = 'Away';
        $scope.statusShow['xa'] = 'Away';
        $scope.statusShow['in-meeting'] = 'In a Meeting';
        $scope.statusShow['custom-away'] = 'Custom Away';
        $scope.statusShow['dnd'] = 'Do not disturb';
        $scope.statusShow['presenting'] = 'Presenting';
        $scope.statusShow['custom-dnd'] = 'Custom do not disturb';
        $scope.statusShow['unavailable'] = 'Unavailable';
        $rootScope.myPersonId = -1;

		$rootScope.groups = [];
		$scope.renameNewGroupName = [];
		$scope.renameGroupIndex = -1;

		$scope.addMenuVisible = false;
		$scope.showLoadingSearch = false;
		$scope.addLinksVisible = false;


		$scope.addGroupsVisible = false;

		$scope.addPersonGroupsMenu = false;

		$scope.deleteContactMenuToggle = '';

		$scope.personSearch = '';
		$scope.personSearchList = [];
		$scope.selectedSearchedPerson = false;
		$scope.isPersonInContactList = false;//whether showing right menu or not
		$scope.rightClickPersonMail = '';//whether showing right menu or not

		//for search from search box
		$scope.query = undefined;
		$scope.personsList = [];

		$scope.hoverEdit = 0;
		$scope.scroll = false;

		$rootScope.myGenericsUser = [];

		$scope.saveInProgress = false;

		$rootScope.getFromResume = false;

		$rootScope.editGenericContact = false;

		var interval;
        var nameChatWindow = 'chat.html';
        
		// Methods region
		$scope.init = function(){
			$scope.fillUserStatuses();
			$scope.initialized = true;
			$scope.elements.root.removeClass( mf.cssClasses.HIDDEN );

            $rootScope.groups = [];
            $scope.contactsList = [];
			$scope.initEmptyGroups();

			$scope.getMindframeContactList();
			$scope.getMyPersonId();
			$scope.getContactInfo();
            $scope.getServerGroups();
		}

        $scope.getServerGroups = function() {
            $http({
                method: 'GET',
                url: PathService.getContentGroupsUrl()
            }).success(function (res, status) {
                    if (!res.data) {
                        $rootScope.availableServerGroups = [];
                    } else {
                        $rootScope.availableServerGroups = res.data;
                    }
             });
        }

		$scope.onClickModule = function(){
			$rootScope.viewMainPhoneSelector = false;
			$rootScope.statusSelectorToggle = false;
			$scope.selectedGroupIndex = -1;
			$scope.deleteContactMenuToggle = -1;
			$scope.isPersonInContactList = false;
			$scope.rightClickPersonMail = '';
			if($scope.renameGroupIndex !== -1){
				$scope.renameGroup($scope.renameGroupIndex, $rootScope.groups[$scope.renameGroupIndex]);
			}
		}

		$scope.connectToJabber = function(user, password){
			JabberService.connect(user, password);
		}

		$scope.getMindframeContactList = function(){
			$scope.mindframeContacts = Contact.query({
				account: $scope.currentAccount
			}, function () {
                if ($scope.mindframeContacts.contacts)
				    $scope.contactsToCheck = $scope.mindframeContacts.contacts.slice();
				$rootScope.getGenericContactsFromMindFrame();
			});
		}

		$scope.fillUserStatuses = function(){
			$scope.userStatuses.push(USER_STATUSES.CHAT);
			$scope.userStatuses.push(USER_STATUSES.AVAILABLE);
			$scope.userStatuses.push(USER_STATUSES.AWAY);
			$scope.userStatuses.push(USER_STATUSES.XA);
			$scope.userStatuses.push(USER_STATUSES.DND);
		}

		$scope.disconnectFromJabber = function(){
			//JabberService.disconnect();
		}

		// Header > Status Selector
		//show must be undefined or one of 'away', 'chat', 'dnd', or 'xa'
		$scope.setStatus = function(show, status){
			$rootScope.statusSelectorToggle = false;
			$scope.myStatus = status;
			$rootScope.me.show = show;
			JabberService.sendPresence(show, $scope.statusShow[status]);

			setTimeout(function(){
				if($scope.isMyProfileSelected){
					$scope.getMyProfile();
				}
			},1000);
		}

		$scope.toggleStatusSelector = function(e){
			e.preventDefault();
			e.stopPropagation();
			$rootScope.statusSelectorToggle = !$rootScope.statusSelectorToggle;
		}

		$scope.showDeleteContactMenu = function(e, contact, group){
			e.preventDefault();
			if (group) {
			  $scope.selectedRosterGroup = group;
			  $scope.deleteContactMenuToggle = contact.email != null ?  contact.email: contact.id;
			}
			else { //delete from search person list
			  $scope.isPersonInContactList = $scope.findPersonInContactList(contact);
			  $scope.rightClickPersonMail = contact.username;
			  if ($scope.isPersonInContactList) {
				  $log.warn("the person is in contact list: "+contact.username);
			  }

			}
		}

		$scope.onClickMoveContactToGroup = function(e, contact, group, currentGroup){
			e.preventDefault();
			try{
				if(group != currentGroup){
					var username = contact.email;
					var nickname = contact.displayName;
					var groups = [];
					var addToUnnamedGroup = false;
					$scope.contactsToCheck = [];
					var contactGroups = contact.getGroups();

					if (group) {
						groups.push(group.name);
						} else if ( $scope.newGroupName && $scope.newGroupName != '' ) {
							$scope.createNewGroup( $scope.newGroupName );
							groups.push($scope.newGroupName);
						}else{
							addToUnnamedGroup = true; // TBD
						}
						if ( username.length < 1 || nickname.length < 1 ) {
							return false;
					}

					$scope.contactsToCheck.push(contact);

					JabberService.updateContact(username, nickname, groups, function(){

						var len = $rootScope.groups.length;

						if(addToUnnamedGroup)
						{
							//Find the Contact, remove him from the current Group and added to the Default Group
							for (var i = 0; i < len; i++) {
								for (var j = 0; j < contactGroups.length; j++) {
									if($rootScope.groups[i].name == contactGroups[j]){
										for(var k = 0; k < $rootScope.groups[i].contacts.length; k++){
											if($rootScope.groups[i].contacts[k].id == contact.id)
											{
												$rootScope.groups[i].contacts.splice(k,1);
												$rootScope.groups[0].contacts.splice($rootScope.groups[i].contacts.length,0,contact);
											}
										}
									}
								}
							}

						}
						else{
							for (var i = 0; i < len; i++) {
								if($rootScope.groups[i].name == group.name){
                                    $rootScope.groups[i].contacts.splice($rootScope.groups[i].contacts.length,0,contact);
								}
							}
						}
						//Remove from current group
						for (var i = 0; i < len; i++) {
							if($rootScope.groups[i].name == currentGroup.name){
								for(var k = 0; k < $rootScope.groups[i].contacts.length; k++){
									if($rootScope.groups[i].contacts[k].id == contact.id){
                                        $rootScope.groups[i].contacts.splice(k,1);
									}
								}
							}
						}

					});
				}
			}catch(e){
				console.log(e);
			}

		}

		$scope.onClickDeleteContact = function (e, contact, group) {
			e.preventDefault();
			$scope.deleteContact(contact);
		}

		$scope.hoverGroupsIn = function(contact)
		{
			contact.showGroupListForContact = true;
		}

		$scope.hoverGroupsOut = function(contact)
		{
			contact.showGroupListForContact = false;
		}

		$scope.toggleUserContentPanel = function(e) {
			e.preventDefault();
			$rootScope.statusShowHideMF = !$rootScope.statusShowHideMF;

			//if(typeof Awesome != 'undefined') Awesome.toggleWindow();  MF-778

			//TBD move the logic to module
			if ($rootScope.statusShowHideMF==true) {

				PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT + SETTINGS.WINDOW_SIZE.WIDTH_CUES );
			} else {

				PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT );
			}
		}

		$scope.toggleAddLinks = function (e) {
			e.stopPropagation();
			$scope.hidePhoneSelectors();
			$scope.addLinksVisible = !$scope.addLinksVisible;
			$scope.hideFindResult();
		}


		$rootScope.toggleAddNewContactsMenu = function () {
            $rootScope.$broadcast('emptyData');

            $rootScope.addNewContactsVisible = !$rootScope.addNewContactsVisible;
			$scope.addGroupsVisible = false;
			$scope.addLinksVisible = false;

		}

		$scope.toggleAddGroupsMenu = function () {
			$scope.addGroupsVisible = !$scope.addGroupsVisible;
			$scope.addContactsVisible = false;
			$scope.addLinksVisible = false;
            $rootScope.addNewContactsVisible = false;
			$scope.newGroup = '';
		}


		// Groups
		$scope.securePushGroup = function(group){
			if(!$scope.isExistentGroup(group.name)){
                $rootScope.groups.push(group);
				return true;
			};
			return false;
		}

		$scope.isExistentGroup = function(groupName){
			try{
				groupName = groupName.toLowerCase();
				var groupsLength = $rootScope.groups.length;
				var found = false;
				for (var i = 0; i < groupsLength; i++) {
					if($rootScope.groups[i].name.toLowerCase() === groupName) found = true;
				};

				return found;
			}catch(ex){
				console.log('Invalid group name:' + groupName + ' in contacts.module -> isExistentGroup()');
			}
		}

		$scope.selectGroup = function(groupName){
			$scope.selectedGroup = groupName;
			$scope.addPersonGroupsMenu = false;
		}

		$scope.createNewGroup = function(groupName){
			if(!$scope.isExistentGroup(groupName)){
				$rootScope.groups.push({'visible': false, 'name': groupName, 'contacts': []});

				$scope.storeEmptyGroups();
			};
			$scope.newGroup = '';
		}

		$scope.saveNewGroup = function(e, groupName){
			e.preventDefault();
			$scope.createNewGroup(groupName);
			$scope.addGroupsVisible = false;
		}

		$scope.deleteGroup = function(index, group){

			$scope.selectedGroupIndex = -1;

			// Move to default group
			for (var i = 0; i < group.contacts.length; i++) {
				// only add to default group if the contact is not in other group
				if(group.contacts[i].getGroups().length < 1){
                    $rootScope.groups[0].contacts.push(group.contacts[i]);
				}
			};
			// Remove group
            $rootScope.groups.splice(index, 1);

			// Remove from local storage
			$scope.storeEmptyGroups();

			// Do the update in jabber
			JabberService.removeGroupFromContacts(group.name, group.contacts);
		}

		$scope.renameGroup = function(index, group){
			var previousName = group.name;
			group.name = $scope.renameNewGroupName[index];
			$scope.renameGroupIndex = -1;
			$scope.storeEmptyGroups();
			JabberService.renameContactsGroup(previousName, $scope.renameNewGroupName[index], group.contacts);
		}


		$scope.enableRenameGroup = function(e, index, groupName){
			$scope.renameGroupIndex = index;
			$scope.renameNewGroupName[index] = groupName;
			$scope.selectedGroupIndex = -1;
			var txt = $(e.target).closest('.group-collapser').find('input');
			if(!!txt.length){
				setTimeout(function(){txt.trigger('focus')}, 200);
			}
		}

        function removeDup(groups) {
            var removeRepeatMap = {};
            var uniqueGroups = [];
            for (var i=0;i<groups.length;i++) {
                if (!removeRepeatMap[groups[i].name]) {
                    uniqueGroups.push(groups[i]);
                    removeRepeatMap[groups[i].name]='Already Having';
                }else {
                    removeRepeatMap[groups[i].name]='Already Having';
                }
            }
            return uniqueGroups;
        }

		$scope.storeEmptyGroups = function(){
			var emptyGroups = [];
            for (var i=0;i<$rootScope.groups.length;i++) {
                var group = {};
                group.name = $rootScope.groups[i].name;
                group.visible = $rootScope.groups[i].visible;
                group.contacts = [];
                group.isDefault = $rootScope.groups[i].isDefault;
                emptyGroups.push(group);
            }
            emptyGroups = removeDup(emptyGroups);
            StorageService.userSet('groups',emptyGroups );
		}

		$scope.initEmptyGroups = function(){
            $rootScope.groups.push({'name':'__DEFAULT_GROUP__' + Math.random().toString(36), 'visible':true, 'contacts':[], 'isDefault':true});
			var groupsStorage = (StorageService.userGet('groups') || []);
            if (groupsStorage && groupsStorage.length>0) {
                for (var i=0;i<groupsStorage.length;i++) {
                    if (!groupsStorage[i].isDefault) {
                        $rootScope.groups.push(groupsStorage[i]);
                    }
                }
                $rootScope.groups = removeDup($rootScope.groups);
            }
            $rootScope.groups = _.sortBy( $rootScope.groups, 'name' );
		}

		$scope.showContextualGroupOptions = function(index, group){
			if(!group) return;
			$scope.selectedGroupIndex = index;
		}

		$scope.initGroupMenuPosition = function(elementId){
			setTimeout(function(){
				var menuElement = $('#' + elementId);
				if(!!menuElement.length){
					(menuElement.offset().top > 100) ?
						menuElement.addClass('above show') :
						menuElement.addClass('below show');
				}
			}, 25);
		}

		// Contact List
		$scope.showContact = function(contact){
			console.log('$scope.showContact()');
			console.log(contact);
			analytics.trackTag(ANALYTICS.ON_PROFILE_ACCESS);

			// Expand the window
			if (!$rootScope.statusShowHideMF) {
				$rootScope.statusShowHideMF = true;
				PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT + SETTINGS.WINDOW_SIZE.WIDTH_CUES );
			}

			$scope.hidePhoneSelectors();

			if(!contact.selectedPhone && contact.phones && contact.phones[0]){
				contact.selectedPhone = contact.phones[0];
			}

			if(contact.id != null){
				$rootScope.selectedContact = contact;
			}else{
				$rootScope.selectedContact = {};
			}

			$rootScope.selectedTabbedContent = undefined;
			$rootScope.viewSettings = false; // hide settings

			//choose different ws calls according to personId (person id) is defined
			if (contact.personId||contact.id) {
				if (contact.id && isNaN(contact.id) ) {
					contact.id = contact.personId;
				}
                if (!contact.personId && contact.id && !isNaN(contact.id)) {
                    contact.personId = contact.id;
                }
				mf.content.selectPerson(contact);

			} else {
				if (contact.selectedPhone && contact.selectedPhone.number){
					showMindFrameInfo(contact.selectedPhone.number);
				}else{
                    if (contact.jid)
                        showMindFrameInfo(null,contact.jid.getBareJIDString());//unknown external contact
                    else if (contact.key) {
                        showMindFrameInfo(null,contact.key);//search by email in search box
                    }
				}
			}

            //$rootScope.addNewContactsVisiblePopUp == false;
            if ($rootScope.addNewContactsVisiblePopUp == true ) {
                if (contact.createdBy && contact.createdBy.id)
                    $rootScope.$broadcast('addNewContactsVisiblePopUp', contact, null);
                else
                    $rootScope.addNewContactsVisiblePopUp = false;
            }
            $rootScope.isOpenAddUnrecognizedMenu = false;
            $rootScope.isOpenUnknownSearchPanel = false;
		}

		$scope.callContact = function(contact){
			console.log('$scope.callContact() | number: ' + contact.selectedPhone.number + ' | Call manager authenticated: ' + CallmanagerAuthenticationService.authenticated);
			$scope.cleanSearch();
			if(!CallmanagerAuthenticationService.authenticated) return;
			$scope.showContact(contact);
			callButtonClick(contact.selectedPhone.number);
		}

		$scope.imContact = function(e, contact){
            e.stopPropagation();
            $scope.cleanSearch();
			$scope.hidePhoneSelectors();

			var data = {
				version: localStorage.version,	
				name: contact.displayName,
				jid: contact.key,
				theirStatus: contact.statusShow,
				myStatus: $rootScope.me.status,
				currentUser: $rootScope.me.key,
				theirStatusCode: contact.status,
                myAvatar: $rootScope.me.image,
                theirAvatar: contact.personId ? PathService.getUserAvatar.get(contact.personId, $scope.authenticationService.credentials.accessToken): null
			};
			var windowName = 'chat-'+ contact.key.toLowerCase();
			console.log('PopupService.openWindow = ' + windowName);
			// Put the object into storage
			$scope.setAccessObjectStorage();
			analytics.trackTag(ANALYTICS.ON_CHAT);
			PopupService.openWindow(windowName, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
		}

		$scope.setAccessObjectStorage = function(){
			var accessObject = { 'urlServer': mf.services.url.personSearch, 'accessToken': $scope.authenticationService.credentials.accessToken,'loginUser': $scope.authenticationService.credentials.user};
			localStorage.setItem('accessObject', JSON.stringify(accessObject));
		}

		$scope.deleteContact = function(contact){
			//if it's search person right click removing case, we need to find this person(contact) in contactList
			if (!contact.jid) {
				contact = $scope.findPersonInContactList(contact);
				if (contact==null) {
					$log.error("did not find person in contact list , should not be happened");
				}
			}
			// TBD: use contact object from jabber to do contact.remove()
			JabberService.deleteContact(contact);

            var removeContact = new Contact()
                removeContact.contacts =  [{ jabberId : contact.email, type: 'remove' }];
                removeContact.$create({account: $scope.currentAccount, id: 'sync'}, function (e) {
                    console.log('success! contact deleted');
                    $scope.mindframeContacts.contacts = removeContact.contacts;
                });

        }

		$scope.selectPhone = function(contact, phone){
			if(phone && typeof phone === 'string'){
				contact.selectedPhone = phone;
                $rootScope.selectedContact = contact;
			}
		}

		$scope.selectPhoneAndCall = function(contact, contactPhone){
			$scope.hidePhoneSelectors();
			contact.selectedPhone = contactPhone;
            $rootScope.selectedContact = contact;
			$scope.callContact(contact);
		}

		$scope.getContactPhones = function(e, group, contact){
            e.stopPropagation();
            if($scope.selectedRosterGroup === group
                && $scope.selectedRosterContact === contact){
                $scope.hidePhoneSelectors();
                return;
            }

            if(contact.phones.length < 1){
                return;
            }else if(contact.phones.length === 1){
                // If contact has only one, just call.
                contact.selectedPhone = contact.phones[0];
                $scope.callContact(contact);
            }else if(contact.phones.length > 1){
                // If has more than one, show available phones.
                $scope.togglePhoneSelector(group, contact);
            }
		}

		$scope.togglePhoneSelector = function(group, contact){
			if($scope.selectedRosterGroup === group
				&& $scope.selectedRosterContact === contact){
				$scope.hidePhoneSelectors();
			}else{
				$scope.selectedRosterGroup = group;
				$scope.selectedRosterContact = contact;
			}
		}

		$scope.togglePersonPhoneSelector = function(index) {

			if($scope.phoneSelectorToggle === index){
				$scope.phoneSelectorToggle = -1;

				if($scope.personsList.length < 10){
					$('.list-container').scrollTo(0,200);
					$('.list-container').css('height', 'auto');
				}

			}else{
				$scope.phoneSelectorToggle = index;

				setTimeout(function(){

					var containerHeight =  $('.list-container').height() + $('#'+index+'-group').height();

					if($scope.personsList.length <= 3){
						if($scope.personsList.length == 3){$('.list-container').css('height', (containerHeight - 55) + 'px');}
						if($scope.personsList.length == 2){$('.list-container').css('height', (containerHeight - 45)  + 'px');}
						if($scope.personsList.length == 1){$('.list-container').css('height', containerHeight + 'px');}
						$('.list-container').scrollTo($('#scrollTo'), 200);
					}
					else if($scope.personsList.length > 5
							&& (($scope.personsList.length - 3) == (index + 1))
							|| (($scope.personsList.length - 2) == (index + 1))
							|| (($scope.personsList.length - 1) == (index + 1))
							|| (($scope.personsList.length) == (index + 1))){
								$('.list-container').scrollTo($('#scrollTo'), 200);
					}
					else if($scope.personsList.length <= 10){
						$('.list-container').scrollTo(0,200);
					}

				},100);
			}
		}

		$scope.hidePhoneSelectors = function(){
			$scope.selectedRosterGroup = undefined;
			$scope.selectedRosterContact = undefined;
		}

		$scope.getStatusClass = function (status, extra) {
			// When changing this statuses array change also the same array in chat.js
			var statuses = {
				'available': 'status-online',
				'Available': 'status-online',
				'Unavailable': 'status-offline',
				'unavailable': 'status-offline',
				'chat': 'status-online',
				'away': 'status-unavailable',
				'Away': 'status-unavailable',
				'xa': 'status-unavailable',
				'donotdisturb': 'status-busy',
				'dnd': 'status-busy',
				'Do not disturb': 'status-busy',
				'offline': 'status-offline',
				'Offline': 'status-offline',
				'In a Meeting': 'status-unavailable',
				'In a meeting': 'status-unavailable',
				'In a WebEx meeting': 'status-unavailable',
				'Presenting': 'status-busy',
				'Custom Available': 'status-online',
				'Custom Away': 'status-unavailable',
				'Custom do not disturb': 'status-busy',
				'On a call': 'status-unavailable',
				'on a call': 'status-unavailable'
			};
			var statusClass;
			switch (statuses[status]) {
				case 'status-unavailable':
					statusClass = 'away';
					if (extra && extra.toLowerCase()=='presenting')
						statusClass = 'dnd';
					break;
				case 'status-online':
					statusClass = 'available';
					break;
				case 'status-offline':
					statusClass = 'unavailable';
					break;
				case 'status-busy':
					statusClass = 'dnd';
					break;
				default:
					statusClass = status;
			}
			return statusClass;
		}

		$scope.currentStatusClass = function (status, extra) {
			var statusClass,
				statuses = {
					'chat': 'available',
					'xa' : 'away',
					'away' : 'away',
					'dnd': 'dnd'
				};
			status = status.toLowerCase();
			if (extra !== null && typeof(statuses[status]) !== 'undefined'  && extra.toLowerCase() !== statuses[status]) {
				statusClass = 'custom-' + statuses[status];
				$scope.statusShow[statusClass] = extra;
			} else {
				statusClass = statuses[status];
			}

			return statusClass;
		}

        $scope.getContactGroups = function(contact) {
            if (contact.getGroups) { //jabber groups
                return contact.getGroups();
            } else {

                return contact.groups;
            }
        }

		$scope.addToGroup = function (contact) {
            var contactGroups = $scope.getContactGroups(contact);

            if (!contactGroups||!contactGroups[0]) {
                $rootScope.groups[0].contacts.push(contact);
                return;
            }

			if (contactGroups instanceof Array) {
				var contactGroupsLength = contactGroups.length;

				for ( var i = 0; i < contactGroupsLength; i++ ) {
					var isNewGroup = true;
					var addedToGroup = false;
					for ( var n = 0; n < $rootScope.groups.length; n++ ) {
						if ( contactGroups[i] == $rootScope.groups[n]['name'] ) {
							isNewGroup = false;
							addedToGroup = true;
							if($rootScope.groups[n].contacts.indexOf(contact) == -1){
                                $rootScope.groups[n].contacts.push(contact);
							}
						}
					};

					if ( isNewGroup ) {

                        var isVisible = true;

						// Try to add a new group
						var pushed = $scope.securePushGroup({
							'name': contactGroups[i],
							'visible': isVisible,
							'contacts': [contact]
						});

						if(pushed) addedToGroup = true;
					};

					if ( !addedToGroup ) {
                        $rootScope.groups[0].contacts.push(contact);
					};

                    $rootScope.groups = jQuery.unique($rootScope.groups);

				}
			} else {
				console.log('No group found for user ' + contact.id);
                $rootScope.groups[0].contacts.push(contact);
			}

            if ($window.timeOutSortGroup) clearTimeout($window.timeOutSortGroup);
            $window.timeOutSortGroup = $timeout(function(){$rootScope.groups = _.sortBy( $rootScope.groups, 'name' );},2000);
		}

		$scope.expandCollapseGroup = function(group){

            $rootScope.groups.forEach(function(g) {
                if (g.name==group.name) {
                    g.visible = !group.visible;
                }
            });
            $scope.storeEmptyGroups();

		}

		$scope.keyupSearch = function(e) {
			if (e.which == 13 || e.keyCode == 13) {
				event.preventDefault();
				if ($scope.personsList && $scope.personsList[0]){
					if($scope.personsList[0].id != null){
						$rootScope.selectedContact = $scope.personsList[0];
					}else{
						$rootScope.selectedContact = {};
					}
                    $scope.showContact($scope.personsList[0]);
					$('#searchcontact').blur();
					mf.elements.callBtnCall.focus();
					$scope.cleanSearch();
				}
				return false;
			}

			clearTimeout(window.timoutSearch);
			window.timoutSearch = window.setTimeout( function () {
				if (!$scope.contactSearchTerm || $scope.contactSearchTerm.trim().length <= 1) {
					$scope.$apply(function(){
						$scope.personsList = [];
						$scope.showLoadingSearch = false;
					});
					return;
				} else {
					if($scope.contactSearchTerm.length > 1){
						$scope.search( $scope.contactSearchTerm );
					}
				}
			},300);
		}

		$scope.search = function(iQueryVal) {
			analytics.trackTag(ANALYTICS.ON_SEARCHES);
			$scope.showLoadingSearch = true;
			$scope.personsList = [];
			$http({
				method: 'GET',
				url: mf.services.url.personSearch+"?"+'query='+iQueryVal.trim()
			}).success(function (data, status) {
					window.clearTimeout(window.timoutSearch);
					if ($scope.contactSearchTerm===''||$scope.contactSearchTerm.trim().length<=1) {
						$scope.personsList = [];
						return;
					} else {
						$scope.personsList = [];
					}
					if (data.data && data.data.length>0) {
						var plist = data.data;
						for (var i=0;i<plist.length;i++) {
							if (plist[i]) { //weird: some accounts from server will not have username (account)
								$scope.personsList.push(plist[i]);
							}
						}
					}

					$scope.showLoadingSearch = false;
					if ($scope.personsList.length>0) {
						for (var i=0;i<$scope.personsList.length;i++) {
							var person = $scope.personsList[i];
							person.displayName = person.firstName+" "+person.lastName;
							person.personId = person.id;
							person.groups = [];
							var isFound = $scope.findAndSetStatusByContacts(person);
							if (!isFound) {
								try { //after setting the scope.personsList , we add quickcontact in order to get presence
									JabberService.quickContact(person.username);
									console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^adding a jid quick contact" + person.username + " presence:" + presence);
								} catch(ex) {
								}
							}

							(person.username && person.username !== '') ?
								person.key = person.username :
								person.key = person.id;

							person.phones = [];
							if (person.id) {
								person.image = PathService.getUserAvatar.get(person.id, $scope.authenticationService.credentials.accessToken);
							} else {
								person.image = null;
							}

							if (person.accounts && person.accounts.length>0) {
								if (person.accounts[0]) {
									person.phones = groupContactPhones(person.accounts[0]);
								}
							}
							if (person.phones.length==1){
								person.selectedPhone = {};
								person.selectedPhone.number = person.phones[0].number;
								person.selectedPhone.type = person.phones[0].type;
							}
						}
					} else {
						//no user found
						var person = {};
						var number = iQueryVal.trim();

						if (!isNaN(number)) {
							person.displayName = number;
							person.key = number;
							person.personId = null;
							person.groups = [];
							person.phones = [];
							person.phones.push(number);
							person.selectedPhone = {};
							person.selectedPhone.number = number;
							person.selectedPhone.type = "office-phone"; //don't know the type
							$scope.personsList.push(person);
						}
						else {
							//TODO show no user found
							person.displayName = "No user found";
							person.key = number;
							person.personId = null;
							$scope.personsList.push(person);
						}
					}
			}).error(function (data, status) {
					window.clearTimeout(window.timoutSearch);
					var resp = data;
					console.log("error:"+resp);
					$scope.showLoadingSearch = false;
					$scope.personsList = [];
			});


		}

		$scope.findPersonInContactList = function(person) {
			if (!person||!person.username) return null;
			for (var i = 0; i < $scope.contactsList.length; i++) {
				if (!$scope.contactsList[i].email || !person.username) {
					continue;
				}
				if($scope.contactsList[i].email.toUpperCase() == person.username.toUpperCase()){
					return $scope.contactsList[i];
				}
			}
			return null;
		}

		$scope.findAndSetStatusByContacts = function(person) {
			var found = false;
			if (!person || !person.username ) {
				person.status = "unavailable";
				person.statusShow = "Unavailable";
				return false;
			}
			for (var i = 0; i < $scope.contactsList.length; i++) {
				if (!$scope.contactsList[i].email || !person.username) {
					continue;
				}
				if($scope.contactsList[i].email.toUpperCase() == person.username.toUpperCase()){
					found = true;
					person.status = $scope.contactsList[i].status;
					person.statusShow = $scope.contactsList[i].statusShow;

				}
			}
			if ($rootScope.me && $rootScope.me.show) {
				if ($rootScope.me.key) {
					if (person.username.toUpperCase()==$rootScope.me.key.toUpperCase()){
						found = true;
						person.status = $rootScope.me.status ;
						person.statusShow = $rootScope.me.statusShow ;

					}
				}
			}

			if (found==false) {
				person.status = "unavailable";
				person.statusShow = "Unavailable";
			}
			return found;
		}


		$scope.isPrimaryPresence = function(contact, presence){
			var primary = contact.getPrimaryPresence();
			return (primary == presence);
		}

		$scope.setupContactPresence = function(contact){
			console.log('setupContactPresence for ' + contact.key);
			// Update contact information
			var presence = contact.getPrimaryPresence();
			var presenceType, presenceShow;
			if (presence) {
				presenceType = presence.getType() || "available";
				presenceShow = presence.getShow() || presenceType || "available";
			} else {
				presenceType = "unavailable";
				presenceShow = "unavailable";
			}

			contact.type = presenceType;
			contact.show = presenceShow;

			contact.status = $scope.getStatusClass(presenceShow, presence?presence.getStatus():"unavailable");

			if (presence && presence.getStatus()) {
				contact.statusShow = presence.getStatus();
			} else {
				contact.statusShow = $scope.statusShow[presenceShow];
			}
			if (presence)
				console.log('Contact added ' + contact.username + ' | status = ' + presence.getStatus() + ' | show = ' + presence.getShow() + ' | type = ' + presence.getType() );
				else
				console.log('Contact added ' + contact.username + ' with no primary presence after 2 seconds.');
		}

		$scope.setupSearchContactPresence = function(contact){
			//Update presence for each person in list.
			for (var i=0;i<$scope.personsList.length;i++) {
				var person = $scope.personsList[i];
				if(contact.email === person.username)
				{
					var presence = contact.getPrimaryPresence();
					if(presence == null){
						presence = JabberService.getPrimaryPresenceForEntity(person.username);
					}
					if(presence != null || presence != undefined){
						var presenceType, presenceShow;
						if (presence) {
							presenceType = presence.getType() || "available";
							presenceShow = presence.getShow() || presenceType || "available";
						} else {
							presenceType = "unavailable";
							presenceShow = "unavailable";
						}
						person.type = presenceType;
						person.show = presenceShow;
						person.status = $scope.getStatusClass(presenceShow, presence?presence.getStatus():"unavailable");

						if (presence && presence.getStatus()) {
							person.statusShow = presence.getStatus();
						} else {
							person.statusShow = $scope.statusShow[presenceShow];
						}
					}
				}
			}
		}

        $scope.isShowOffline = function(contact) {
            if ($rootScope.settings.general.showOffline=='true' || !(contact.status == 'unavailable') && !(contact.status == 'offline'))
                return true;
            return false;
        }

		$scope.$on('addContactToGroup', function(event, contact) {
            contact.selectedPhone = {
                number:''
            };
            if(contact.groups.length == 0 ){
                contact.groups = [''];
            }
            //adding to groups and contactsList
            var phones = groupContactPhones(contact.accounts[0]);
            contact.phones = phones;
            var displayName = (!contact.firstName?'':contact.firstName) + ' ' + (!contact.lastName?'':contact.lastName);
            contact.displayName = displayName;
            contact.selectedPhone = contact.phones[0];
            contact.jabberId = contact.id + '-generic-contact@fidelus.com';
            if (contact.createdBy && $rootScope.myPersonId) {
                if (contact.createdBy.id!=$rootScope.myPersonId && $rootScope.myPersonId!=-1) {
                    contact.createdBy.id = $rootScope.myPersonId;
                }
            }

            //if (contact.groups[0]!='') { //MF-1303
            $scope.contactsList.push(contact);
            $scope.addToGroup(contact);

            //create new in my contacts ws
            var newContact = new Contact();
            newContact.name = displayName;
            newContact.jabberId =  contact.id + '-generic-contact@fidelus.com';
            newContact.mindframeId = contact.id;
            newContact.groups = contact.groups;
            newContact.$create({ account: $scope.currentAccount}, function(resp){

            }, function(){});
            //}
            setTimeout(function () {
                $scope.selectContact(contact);
            },400);


        });


        $scope.removeContact = function(contact) {
            for(var i=0; i < $scope.contactsList.length; i++ ){
                if($scope.contactsList[i].id == contact.id){
                    $scope.contactsList.splice(i, 1);
                    //remove from groups
                    var groupsLength = $rootScope.groups.length;
                    var contactsLength;
                    for (var k = 0; k < groupsLength; k++) {
                        contactsLength = $rootScope.groups[k].contacts.length;
                        var removedIndex = -1;
                        for (var j = 0; j < contactsLength; j++) {
                            if ($rootScope.groups[k].contacts[j].id === contact.id) {
                                removedIndex = j;
                                break;
                            }
                        };
                        if(removedIndex >= 0){
                            $rootScope.groups[k].contacts.splice(removedIndex, 1);
                        }
                    }

                    break;
                }
            }
        };

		$scope.$on('removeContactToGroup', function(event, contact) {
            //need to remove from my contacts in server side
            var removeContact = new Contact()
            removeContact.contacts =  [{ jabberId : contact.id + '-generic-contact@fidelus.com', type: 'remove' }];
            removeContact.$create({account: $scope.currentAccount, id: 'sync'}, function (e) {
                console.log('success! contact deleted');
                $scope.mindframeContacts.contacts = removeContact.contacts;
                $scope.removeContact(contact);
                //add new
                $rootScope.$broadcast('addContactToGroup', contact);

            });

		});

		$scope.$on('selectGenericContact', function(event, contact) {
			$scope.selectContact(contact);
		});

		// Event > Added contact to list
		$scope.$on('jabberAddedContactItem', jabberAddedContactItem);

		function jabberAddedContactItem(event, contact) {

            $scope.$apply(function () {
                var found = false;

                for (var i = 0; i < $scope.contactsList.length; i++) {
                    if($scope.contactsList[i].username == contact.username){
                        found = true;
                        break;
                    };
                };
                if(!found){
                    //_jabberwerx_RosterContact , _jabberwerx_QuickContact: no need to add quick contact
                    if (contact._guid && contact._guid.indexOf('jabberwerx_RosterContact')>0) {
                        //$scope.checkIfInMF(contact);
                        //new simple design : query one by one, don't sync
                        var jabberId = contact.jid.getBareJIDString();
                        if ( $scope.contactsToCheck[jabberId] ) {
                            contact.setDisplayName($scope.contactsToCheck[jabberId].displayName);
                            contact.phones = $scope.contactsToCheck[jabberId].phones;
                            contact.personId = $scope.contactsToCheck[jabberId].personId;
                            contact.id = $scope.contactsToCheck[jabberId].id;

                            $scope.removeContact(contact);
                            //add new one
                            $scope.contactsList.push(contact);
                            $scope.addToGroup(contact);
                        }
                        else {
                            //var url = PathService.getMindFramePersonSearchUrl()+"?query="+contact.email+"&includeDisabled=false";
                            var url = PathService.getMindFramePersonSearchUrl()+"?query="+jabberId+"&includeDisabled=false";
                            var personsearch = $http.get(url, {'cache': false, headers: {'Access-Token': $rootScope.credentials.accessToken }});
                            personsearch.then(function(resp) {
                                var person = resp.data.data[0];
                                if (person) {
                                    contact.isLDAP = false;
                                    contact.visibility = person.visibility;
                                    contact.setDisplayName(person.firstName + ' ' + person.lastName);
                                    contact.displayName = person.firstName + ' ' + person.lastName;
                                    contact.phones=groupContactPhones(person.accounts[0]);
                                    contact.id=person.id;
                                    contact.personId = person.id;
                                    $scope.removeContact(contact);
                                    //add new one
                                    $scope.contactsList.push(contact);
                                    $scope.addToGroup(contact);
                                } else {
                                    contact.isLDAP = false;
                                    contact.setDisplayName(contact.email);
                                    contact.displayName = contact.email;
                                    //add new one
                                    $scope.contactsList.push(contact);
                                    $scope.addToGroup(contact);
                                }
                                $scope.contactsToCheck[jabberId] = contact;
                            }, function(){
                                contact.isLDAP = false;

                                contact.setDisplayName(contact.email);
                                contact.displayName = contact.email;
                                $scope.contactsToCheck[jabberId] = contact;
                                //add new one
                                $scope.contactsList.push(contact);
                                $scope.addToGroup(contact);
                            });
                        }

						// Update presence after 2 seconds to ensure Primary presence is the correct
						setTimeout(function(){
							if( !contact.username || contact.username === ''){
								contact.username = contact.jid.getNode();
							};
							contact.key = contact.jid.getBareJIDString();
                            contact.image = PathService.getUserAvatar.get(contact.personId, $scope.authenticationService.credentials.accessToken);
							$scope.setupContactPresence(contact);

						},2000);

                    }

				}
			});
			//When add a _QuickContact: need to update presence
			if (contact._guid && contact._guid.indexOf('_QuickContact')>0) {
				$scope.setupSearchContactPresence(contact);
			}
		}

		// Event > Removed contact to list
		$scope.$on('jabberRemovedContactItem', function(event, contact) {
			console.log('jabberRemovedContactItem event');
				var groupsLength = $rootScope.groups.length;
				var contactsLength;
				for (var i = 0; i < groupsLength; i++) {
					contactsLength = $rootScope.groups[i].contacts.length;
					var removedIndex = -1;
					for (var j = 0; j < contactsLength; j++) {
                        if ($rootScope.groups[i].contacts[j].getGroups) { //only remove jabber contact
                            if ($rootScope.groups[i].contacts[j].email === contact.email) {
                                removedIndex = j;
                                break;
                            }
                        }
					};
					if(removedIndex >= 0){
                        $rootScope.groups[i].contacts.splice(removedIndex, 1);
					}
				}
				// remove from contact list
				contactsLength = $scope.contactsList.length;
				for (var i = 0; i < contactsLength; i++) {
					if ($scope.contactsList[i].email === contact.email) {
						$scope.contactsList.splice(i, 1);

						break;
					}
				}

			setTimeout(function(){
				if(!$scope.$$phase){$scope.$apply()}
			}, 200)

		});

		// Event > Message received
		$scope.$on('jabberMessageReceived', function(event, message) {

			if(!message.sender) return;
            var isChatSoundNeeded = StorageService.userGet('settings.alertSounds.chatSound');
			$scope.$apply(function () {
				var data = {
					version: localStorage.version,
					jid: message.sender,
					myStatus: $rootScope.me.status,
					currentUser: $rootScope.me.key,
					message: message.body,
					type: 'chat', 
					isPlaySound: isChatSoundNeeded,
	                myAvatar: $rootScope.me.image
	            }

                
				if(typeof Awesome != 'undefined') 
				{
					Awesome.NewMessage(data.jid);
					
				}

				var found = false;
                var contact;

				for ( var i = 0; i < $scope.contactsList.length; i++) {
					if ( message.sender == $scope.contactsList[i].email){
						found = true;
						data.name = $scope.contactsList[i].displayName;
						// If currect contact presence is unavailable and I receive a chat
						// then change this contact status to primary presence
						if($scope.contactsList[i].status.toLowerCase() == 'unavailable'){
							$scope.setupContactPresence($scope.contactsList[i]);
						}
						data.theirStatus = $scope.contactsList[i].statusShow;
						data.theirStatusCode = $scope.contactsList[i].status;
						data.theirAvatar= $scope.contactsList[i].personId ? PathService.getUserAvatar.get($scope.contactsList[i].personId, $scope.authenticationService.credentials.accessToken): null
                        var contact = $scope.contactsList[i];
						break;
					}
				}

                if ( found || PopupService.getOpenWindow('chat-'+ data.jid) ) {

                        if(data.name == undefined){

                            $scope.getPersonByJabberId(data.jid).then(function(response){
                                var person = response.data.data;
                                console.log(person);
                                if ( response.data.success ) {
                                    data.name = person.firstName + ' ' + person.lastName;
                                }

                                $scope.setAccessObjectStorage();
                                PopupService.openWindow('chat-'+ data.jid, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);

                            }, function(reason) {
                                console.log('error from server - get person ' + reason);
                                data.name = data.jid;
                                $scope.setAccessObjectStorage();
                                PopupService.openWindow('chat-'+ data.jid, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
                            });
                        }
                        else{

                            $scope.setAccessObjectStorage();
                            PopupService.openWindow('chat-'+ data.jid, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
                        }

                } else {

                    $scope.getPersonByJabberId(data.jid).then(function(response){
                        var person = response.data.data;
                        console.log(person);
                        if ( response.data.success ) {
                            data.name = person.firstName + ' ' + person.lastName;
                        }

                        JabberService.quickContact(data.jid);
                        PopupService.openWindow('chat-'+ data.jid, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);

                    }, function(reason) {
                            data.name = data.jid;
                            JabberService.quickContact(data.jid);
                            PopupService.openWindow('chat-'+ data.jid, window, nameChatWindow, data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
                            console.log('error from server - get person ' + reason);
                    });

                }


                if(typeof Awesome != 'undefined' && Awesome.PresenceChanged != 'undefined')
                {
                    if(data.theirStatusCode != undefined && data.theirStatus != undefined ){
                        var status = $scope.getStatusClass(data.theirStatusCode, data.theirStatus);
                        Awesome.PresenceChanged(data.jid, status);
                    }else{
                        var statusShow;
                        var presence = JabberService.getPrimaryPresenceForEntity(data.jid);
                        if(presence != null || presence != undefined){
                            var presenceType, presenceShow;
                            if (presence) {
                                presenceType = presence.getType() || "available";
                                presenceShow = presence.getShow() || presenceType || "available";
                            } else {
                                presenceShow = "unavailable";
                            }
                            statusShow = $scope.getStatusClass(presenceShow, presence?presence.getStatus():"unavailable");
                        }
                        else
                        {
                            statusShow = "unavailable";
                        }

                        Awesome.PresenceChanged(data.jid, statusShow);
                    }
                }

            });
        });


        $scope.getPersonByJabberId = function(jid){
            var url = PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/user/getperson?userid="+ jid;
            return $http.get(url, {headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }});
        };



		$scope.priority = 0;
		// Event > Presence received
		$scope.$on('jabberPresenceReceived', function(event, presence, originalPresence) {
			$scope.$apply(function () {
				if(presence.isMine){
					// Update my information
					$rootScope.me.key = presence.key;
					$rootScope.me.username = presence.username;
					//PathService.getContactImageUrl().replace(':username', presence.username) + '.png';
					$rootScope.me.image = PathService.getUserAvatar.get($rootScope.myPersonId, $scope.authenticationService.credentials.accessToken);
					$rootScope.me.type = presence.type;

					$rootScope.me.show = presence.show;
					$rootScope.me.status = $scope.getStatusClass(presence.show, presence.status);

					(presence.status) ?
						$rootScope.me.statusShow = presence.status :
						$rootScope.me.statusShow = $scope.statusShow[presence.show];

					if($scope.priority <= presence.priority) {
						$scope.myStatus = $scope.currentStatusClass(presence.show, presence.status);
					}
					$rootScope.me.displayName =  $scope.authenticationService.credentials.firstName + ' ' + $scope.authenticationService.credentials.lastName;

					var openChatWindows = PopupService.getOpenWindows();
					for(var key in openChatWindows){
						if(key.indexOf('chat-') == 0) {
							PopupService.sendMessage(key, 'mypresence', { status: $rootScope.me.status, type:'mypresence'});
						}
					}

				} else {
					for (var i = 0; i < $scope.contactsList.length; i++) {
						if($scope.contactsList[i].email == presence.key){
							/*
							// Only continue if it's primary presence.
							console.log(originalPresence);
							if( !$scope.isPrimaryPresence($scope.contactsList[i], originalPresence) ){
								console.log('Presence for ' + presence.key + ' is NOT primary');
								return;
							}else{
								console.log('Presence for ' + presence.key + ' is primary');
							}
							*/
							// Update contact information
							if( !$scope.contactsList[i].username || $scope.contactsList[i].username === ''){
								$scope.contactsList[i].username = presence.username;
							};

							$scope.contactsList[i].key = presence.key;
							$scope.contactsList[i].image = PathService.getUserAvatar.get($scope.contactsList[i].personId, $scope.authenticationService.credentials.accessToken);
							$scope.contactsList[i].type = presence.type;
							$scope.contactsList[i].show = presence.show;
							$scope.contactsList[i].statusShow = $scope.statusShow[presence.show];
							$scope.contactsList[i].status = $scope.getStatusClass(presence.show, presence.status);

							if(typeof Awesome != 'undefined')
							{
								var status = $scope.getStatusClass(presence.show, $scope.contactsList[i].statusShow);
								Awesome.PresenceChanged(presence.key, status);
							}

							break;
						}
					};

					// this presence to match with the person searched out
					for (var i = 0; i < $scope.personsList.length; i++) {
						if($scope.personsList[i].username == presence.key){
							$scope.personsList[i].key = presence.key;
							$scope.personsList[i].type = presence.type;
							$scope.personsList[i].show = presence.show;
							$scope.personsList[i].status = $scope.getStatusClass(presence.show, presence.status);
							if (presence.status) {
								$scope.personsList[i].statusShow = presence.status;
							} else {
								$scope.personsList[i].statusShow = $scope.statusShow[presence.show];
							}
							break;
						}
					}

					var openChatWindow = PopupService.getOpenWindow('chat-' + presence.key);
					if( openChatWindow ) {
							PopupService.sendMessage('chat-' + presence.key, 'theirpresence', {status: presence.show, type:'theirpresence'});
					}

					if(typeof Awesome != 'undefined')
					{
						var status = $scope.getStatusClass(presence.show, presence.status);
						Awesome.PresenceChanged(presence.key, status);
					}
				}
			});
		});

		/*
		 * Event triggered after the jabber client is connected
		 */
		$scope.$on('jabberSuccessConnected', function(event, obj) {

			$scope.$apply(function () {
				if ($rootScope.firstTimeLogin==true) {
					$rootScope.statusShowHideMF=true;
					$rootScope.viewSettings=true;
				}
				$rootScope.noJabberConnect=false; //set up connection UI
				$rootScope.firstTimeLogin=false;//not first time now.

				$rootScope.showContacts=true;//show contacts pane

				$scope.errors.connectionErrorMessage = null;
				$rootScope.jabberLogin.isError = false;
				$rootScope.jabberLogin.message = mfMessages.jabber.connected;
				$rootScope.jabberLogin.isInProgress = false;
				$rootScope.jabberLogin.connected = true;
			});

			setTimeout(function(){
				JabberService.enableReceibePresence();
				if(!$scope.$$phase){$scope.$apply()}
			},3000);


		});

		// Events Connection error.
		$scope.$on('jabberConnectionError', function(event, error) {
			$scope.$apply(function () {
				if ($rootScope.firstTimeLogin==true) {

					$rootScope.noJabberConnect = true;
					$rootScope.showContacts=false; //hide left chat pane
				} else {
					$rootScope.firstTimeLogin = false;
					$rootScope.noJabberConnect = true;
					$rootScope.showContacts=true;
				}
				$scope.errors.connectionErrorMessage = error;
				$rootScope.jabberLogin.isError = true;
				$rootScope.jabberLogin.message = mfMessages.jabber.invalidLogin;
				$rootScope.jabberLogin.isInProgress = false;
				$rootScope.jabberLogin.connected = false;
			});
		});

		// Events Disconnect.
		$scope.$on('jabberDisconnect', function(event, msg) {
			 $scope.errors.connectionErrorMessage = msg;
		});

		$scope.$on('jabberOffline', function(event, msg) {
			var contacts = $scope.contactsList;
			angular.forEach(contacts, function(item, key){
				item.status = 'offline';
				item.statusShow = 'offline';
			}, contacts);
			$rootScope.me.status = 'offline';
			$rootScope.me.statusShow = 'Offline';

		});

        $scope.$on('auth-done', function(event, data) {
            var usr, pwd;
            //get storage account first and then try MF credentials
            if ($rootScope.jabberLogin.username&&$rootScope.jabberLogin.password)  {

                usr=$rootScope.jabberLogin.username; pwd=$rootScope.jabberLogin.password;
                $rootScope.noJabberConnect=false;
                $rootScope.firstTimeLogin = false;
            }else {
                //first time login: store the usr;
                PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT + SETTINGS.WINDOW_SIZE.WIDTH_CUES );
                usr=$scope.authenticationService.credentials.user.split('@')[0];
                pwd=EncodingService.decode(StorageService.get('password'));
                StorageService.userSet('jabberLogin.username', usr);
                StorageService.userSet('jabberLogin.password', pwd);
                $rootScope.jabberLogin.username = usr;
                $rootScope.jabberLogin.password = pwd;

                $rootScope.firstTimeLogin = true;
                $rootScope.noJabberConnect=false; //set up connection UI
                $rootScope.showContacts=false;//show contacts pane
            }
            $scope.init();
            $scope.connectToJabber(usr,pwd);
        }) ;

		$scope.$on('jabberInitLoginFromSettings', function (newValue, oldValue) {
			$scope.init();
		});

		$scope.$on('groupChatPresence', function(event, data) {
			var found = false;
			var statusShow;
			for (var i = 0; i < $scope.contactsList.length; i++) {
				if (!$scope.contactsList[i].email || !data.jid) {
					continue;
				}
				if($scope.contactsList[i].email.toUpperCase() == data.jid.toUpperCase()){
					found = true;
					statusShow = $scope.getStatusClass($scope.contactsList[i].show);
				}
			}
			if (found==false) {
				var presence = JabberService.getPrimaryPresenceForEntity(data.jid);
				if(presence != null || presence != undefined){
					var presenceType, presenceShow;
					if (presence) {
						presenceType = presence.getType() || "available";
						presenceShow = presence.getShow() || presenceType || "available";
					} else {
						presenceShow = "unavailable";
					}
					statusShow = $scope.getStatusClass(presenceShow, presence?presence.getStatus():"unavailable");
				}
				else
				{
					statusShow = "Unavailable";
				}
			}

			PopupService.sendMessage('chat-' + data.key, 'presence', {key: data.jid, status: statusShow, type: 'presence'});
		});

		$scope.$on('callFromChat', function(event, data) {
			$scope.init.loading = true;
			var url = PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/person/search?query=" + data.number + "&max=1&offset=0";
			$http({
				method: 'GET',
				url: url,
				headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
			}).success(function (response, status) {
				if (status == 200 && response.data.length > 0) {
					$scope.init.loading = false;
					var contact = response.data[0];
					var selectedPhone = null;
					var number = data.number.replace(/[a-z\+\-\(\)\s]/g, '');
					var phones = contact.accounts[0].phones;
					for (var j = 0; j < phones.length; j++) {
						var numberPhone = phones[j];
						numberPhone = numberPhone.replace(/[a-z\+\-\(\)\s]/g, '');
						if (numberPhone == number) {
							selectedPhone = numberPhone;
							break;
						}
					}
					if (selectedPhone != null) {
						$scope.selectPhoneAndCall(contact, { number: selectedPhone });
					}else{
						showMindFrameInfo(data.number);
						callButtonClick(number);
					}
				}else{
					var number = data.number.replace(/[a-z\+\-\(\)\s]/g, '');
					showMindFrameInfo(data.number);
					callButtonClick(number);
				}
			}).error(function (data, status, headers, config) {
				console.log('error from server - call from chat');
			});

		});

		$scope.$on('updateMUCRoom', function(event, room) {
			var data = {
				version: localStorage.version,
				key: room.jid.toString(),
				jid: room.jid.toString(),
				myStatus: $rootScope.me.status,
				currentUser: $rootScope.me.key,
				type: 'groupchat',
				occupants: [],
                myAvatar: $rootScope.me.image
			};
			var occupants = room.occupants.toArray();
			for(var i in occupants) {
				data.occupants.push(occupants[i].getNickname());
			}
			$scope.setAccessObjectStorage();
			PopupService.openWindow('groupchat-'+ data.key, window, 'groupchat.html', data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
		});


		$scope.cleanSearch = function(){
			$scope.contactSearchTerm = '';
			$scope.personsList = [];
			$scope.isMyProfileSelected = false;
		};

		$scope.stopPropagation = function(e){
			$scope.addLinksVisible = false;
			e.stopPropagation();
		};

		$scope.hideFindResult  = function(){
			if($('.float-container').hasClass("visible")){
				$('.float-container').removeClass("visible");
			}
		};

		$scope.hoverIn = function(id){
			$scope.hoverEdit = id;
		};

		$scope.hoverOut = function(){
			$scope.hoverEdit = 0;
			$scope.phoneSelectorToggle = -1;
			if($('#person-list li').hasClass('paint-first-contact')){
				$('#person-list li').removeClass('paint-first-contact');
			}
			if($scope.personsList.length < 10){
				$('.list-container').scrollTo(0,200);
				$('.list-container').css('height', 'auto');
			}
		};

		$scope.findContactSelected = function(person){
			$scope.cleanSearch();
			$scope.showContact(person);
		};

		$scope.selectMyProfile = function(){
			$scope.isMyProfileSelected = true;
			$scope.getMyProfile();
            $rootScope.isMyProfileClicked=true;
		};

		$scope.selectContact = function(contact){
			$rootScope.$broadcast('closeAddUnrecognizedContact');
			$scope.isMyProfileSelected = false;
            $scope.showContact(contact);
		};

		$scope.getMyProfile = function(){

			var url = PathService.getBaseApiUrl() + $rootScope.currentAccount + '/mindframe/person/' + $scope.authenticationService.credentials.clientAccounts[0].currentPersonId;
			$http({
				method: 'GET',
				url: url
			}).success(function (data, status) {
					window.clearTimeout(window.timoutSearch);
					if (data.data) {
						var plist = data.data;

							var profile = plist;
							if(profile.username == $scope.authenticationService.credentials.user){
								profile.displayName = profile.firstName+" "+profile.lastName;
								profile.personId = profile.id;
								profile.groups = [];
								profile.phones = [];

								var isFound = $scope.findAndSetStatusByContacts(profile);
								if (!isFound) {
									try { //after setting the scope.personsList , we add quickcontact in order to get presence
										JabberService.quickContact(profile.username);
										console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^adding a jid quick contact" + profile.username + " presence:" + presence);
									} catch(ex) {
									}
								}

								(profile.username && profile.username !== '') ?
									profile.key = profile.username :
									profile.key = profile.id;

								if (profile.id) {
									profile.image = PathService.getUserAvatar.get(profile.id,  $scope.authenticationService.credentials.accessToken);
								} else {
									profile.image = null;
								}

								profile.phones = groupContactPhones(profile.accounts[0]);
								if (profile.phones.length==1){
									profile.selectedPhone = {};
									profile.selectedPhone.number = profile.phones[0].number;
									profile.selectedPhone.type = profile.phones[0].type;
								}
								$scope.showContact(profile);

								return;
							}

					}
				}).error(function (data, status) {
					window.clearTimeout(window.timoutSearch);
					console.log("error: "+data);
				});
		};

		$scope.getMyPersonId = function(){
            $scope.authenticationService.whoiam($rootScope.currentAccount, function(data){
                $rootScope.myPersonId = data.data;
            });
		};

		$scope.onClickDisableContact = function (e, contact, group) {
			e.preventDefault();
			var removeContact = new Contact();
			removeContact.contacts =  [{ jabberId : contact.jabberId, type: 'remove' }];
			removeContact.$create({account: $scope.currentAccount, id: 'sync'}, function (e) {
				console.log('success! contact deleted');
                $scope.removeContact(contact);
				$rootScope.$broadcast('addContactToDisable', contact);
				$scope.mindframeContacts.contacts = removeContact.contacts;
			});
		};

		$scope.onClickEditContact = function (e, contact, group) {
			e.preventDefault();
            e.stopPropagation();
            //$rootScope.editGenericContact = true;
            $rootScope.addNewContactsVisible = !$rootScope.addNewContactsVisible;
            $scope.deleteContactMenuToggle = -1;
			//$rootScope.addContactToUpdate(contact, group);
            $timeout(function(){
                $rootScope.$broadcast('onEditContactInRoster', contact, group);
            });
		};


		$scope.onClickRemoveGenericContact = function(e, contact){
			e.preventDefault();
			var removeContact = new Contact();
			removeContact.contacts =  [{ jabberId : contact.jabberId, type: 'remove' }];
			removeContact.$create({account: $scope.currentAccount, id: 'sync'}, function (e) {
				console.log('success! contact deleted');

                $scope.removeContact(contact);

				$scope.mindframeContacts.contacts = removeContact.contacts;


			});
		};

        $scope.isGenericContact = function(contact) {
            if (contact['class'] == 'GenericContact')
               return true;
            if (contact.jabberId && contact.jabberId.indexOf('generic-contact') != -1)
               return true;
            return false;
        };

        $rootScope.getGenericContactsFromMindFrame = function(){

            $scope.getGenericContacFromServer = $http.get(PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/genericContact/search?max=1000", {cache: false, headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }});
            $scope.getContactsFromServer = $http.get(PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/contacts", {'cache': false, headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }});

            $scope.getContactsFromServer.then(function(payloadContacts){
                $.each(payloadContacts.data.contacts.slice(), function(index, contact){
                     if($scope.isGenericContact(contact)){
                            contact.selectedPhone = {number:''};
                            contact.createdBy = {id:''};
                            contact.id = contact.mindframeId;
                            contact.firstName  = contact.name.split(' ')[0];
                            contact.lastName = contact.name.split(' ')[1];
                            contact.visibility = contact.visibility;
                            if(contact.groups == null || contact.groups.length == 0 ){ contact.groups = ['']; }
                            //$scope.temp_generic_groups.push(contact.groups[0]);

                            var phones = groupContactPhones(contact)

                            contact.phones=phones;
                            contact.selectedPhone = contact.phones[0];
                            contact.displayName = (!contact.firstName?'':contact.firstName) + " " + (!contact.lastName?'':contact.lastName);
                            $scope.contactsList.push(contact);
                            $scope.addToGroup(contact);
                        }
			    });

                //Get permissions
                $scope.getGenericContacFromServer.then(function(payloadGenericContacts){
                   $rootScope.myGenericsUser = payloadGenericContacts.data.data;
                   var contacts = $scope.contactsList;
                   for(var i=0; i< $rootScope.myGenericsUser.length; i++){
                       for(var x = 0; x < contacts.length; x++){
                           if($rootScope.myGenericsUser[i].id == contacts[x].mindframeId){
                               contacts[x].createdBy.id = $rootScope.myPersonId;
                               contacts[x].visibility = $rootScope.myGenericsUser[i].visibility;
                               contacts[x].companyName = $rootScope.myGenericsUser[i].companyName;
                               break;
                           }
                       }
                   }
                });
            //});
        });

        };


		$scope.getMyGenericsContacts = function(){
		return	$http({
				method: 'GET',
				url: PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/genericContact/search?max=1000",
				headers: {'Access-Token': $scope.authenticationService.credentials.accessToken }
			})
			.success(function (response, status) {
				$rootScope.myGenericsUser = response.data;
				var contacts = $scope.contactsList;
				for(var i=0; i< response.data.length; i++){
					for(var x = 0; x < contacts.length; x++){
						if(response.data[i].id == contacts[x].mindframeId){
							contacts[x].createdBy.id = $rootScope.myPersonId;
							break;
						}
					}
				}
			})
			.error(function (data, status, headers, config) {
				console.log('Error to get my generics contacts - ' + data);
			});
		};

		$scope.getContactInfo = function () {

			if (angular.isDefined(interval)) return;
            if (!$rootScope.currentAccount) return;
            interval =  $interval(function(){
                if (localStorage.CallContactName == '' && localStorage.CallInProgress == 'true' && localStorage.IsContactInfo == 'false') {
                    $http({
                        method: 'GET',
                        url: PathService.getBaseApiUrl() + $rootScope.currentAccount + "/mindframe/person/search?query=" + localStorage.DialNumber + "&max=1&offset=0"
                        //headers: {'Access-Token': $rootScope.credentials.accessToken }
                    }).success(function (response, status) {
                            if (response.data.length > 0) {
                                localStorage.CallContactName = response.data[0].firstName + ' ' + response.data[0].lastName;
                            }
                            localStorage.IsContactInfo = 'true';
                            console.log(response.data);
                        }).error(function (data, status, headers, config) {
                            console.log('Error to get contact - ' + data);
                        });
                }},1000);
		};
}]);