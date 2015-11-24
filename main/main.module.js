'use strict';

angular.module('main.module', [])

.controller('MainController', 
	['$scope',
    '$rootScope',
    '$window',
    '$log',
    'PathService',
    'AuthenticationService',
    'PopupService',
	'SETTINGS',
    'ANALYTICS',
    'PostmessageService',
	function($scope, $rootScope, $window, $log, PathService, AuthenticationService, PopupService, SETTINGS, ANALYTICS, PostmessageService){
        
        $rootScope.viewSettings = false;
        $rootScope.viewContactContent = true; // TBD
        $rootScope.appExpanded = false;

        $rootScope.showMergeTransferBackground = false;

        $scope.isVideoCall = false;
        $scope.authenticationService = AuthenticationService;
        $scope.toggleTabbedContent = [];

        $rootScope.showContacts = true;
        $scope.isSettingsCloseByVideoMute = false;

        $rootScope.noJabberConnect = false;
        $rootScope.firstTimeLogin = true;

        //handling-bar
        $scope.disableMergeBtn = true;
        $scope.showMergeList = false;
        $scope.conferenceList = [];

        $scope.disableTransferBtn = true;
        $scope.showTransferList = false;
        $scope.transferList = [];

        $scope.isVideoInactive = false;
        $scope.isVideoDisabled = true;

        $scope.isResumeBlink = false;


        $scope.toggleContactsList = function() {
            $rootScope.showContacts = !$rootScope.showContacts;
        }

        $scope.onClickModule = function(){
            if($('.float-container').hasClass("visible")){
                $('.float-container').removeClass("visible");
            }
            $rootScope.openAddContact=false;

            //merge button click beyond
            $scope.showMergeList = false;
            $scope.showTransferList = false;

            var scope = angular.element($(".main-wrapper")).scope();
            scope.$$childHead.addLinksVisible = false;


            // Close Phone types
            var phoneType = angular.element($(".add-contact-include")).scope();
            if(phoneType != undefined){
                phoneType.$$childHead.phoneType.work.isToggle = false;
                phoneType.$$childHead.phoneType.mobile.isToggle = false;
                phoneType.$$childHead.phoneType.home.isToggle = false;
            }

            $rootScope.viewMainPhoneSelector = false;
            $rootScope.statusSelectorToggle = false;
            $rootScope.addNewContactsVisiblePopUp = false;

            $rootScope.isOpenUnknownSearchPanel = false; //adding contact search panel
            $rootScope.isOpenAddUnrecognizedMenu = false; //adding contact popup menu
            $rootScope.openAddUnrecognizedPanel = false;//adding contact to existing contact

            $rootScope.isShowNoteInfo = false;
            $rootScope.deleteNoteContextual = false;
            $rootScope.showDatePicker = false;
            $rootScope.deleteTaskContextual = false;
            $rootScope.isShowTaskInfo = false;
            $rootScope.isShowTaskPriority = false;

        }


        $scope.selectTabbedContent = function(tab){
            $rootScope.selectedTabbedContent = tab;
            // compatibility: remove selected tag from content. Change following code when
            // top bar is moved to angular.
            $('.subscriber-list ul > li.active a').removeClass( 'background-active' );
            $('.subscriber-list ul > li.active').removeClass('active');
            // Reset user content status.
            $('section.content-subscriber')
                .attr({
                    'class': 'content-subscriber mf-ui-hidden mf-ui-element mf-ui-animate-out-left',
                    'style': 'display: none'
                });


            $('#wrap > div.user-content.content-module.ng-scope').removeAttr('style');

        }

        $scope.firstTimeShowSettings = function() {
            $rootScope.statusShowHideMF=true;
            $rootScope.showContacts=false;//hide contacts pane
            $rootScope.viewSettings=true;
            $rootScope.firstTimeLogin=false;//close the connect setup UI

        }

        $scope.imContactFromHandlingBar = function (e) {
            e.preventDefault();
            var contact = $rootScope.selectedContact;
            if (!contact.key) {
                console.log("jid is not defined , could not chat.");
                return;
            };

            if(!$rootScope.imSelectedContactMap[contact.key]){
                $rootScope.imSelectedContactMap[contact.key] = contact;
            }

            var data = { 
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
            var accessObject = { 'urlServer': mf.services.url.personSearch, 'accessToken': $scope.authenticationService.credentials.accessToken };
            localStorage.setItem('accessObject', JSON.stringify(accessObject));
            analytics.trackTag(ANALYTICS.ON_CHAT);
            PopupService.openWindow(windowName, window, 'chat.html', data, SETTINGS.WINDOW_SIZE.WIDTH_CHAT_WINDOW, SETTINGS.WINDOW_SIZE.HEIGHT);
        }

        $scope.mergeButtonClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($scope.disableMergeBtn)
                return;
            //check if there's more than 2 options for merge
            var count = $scope.conferenceList.length;
            $log.warn('calls can be merged count is'+count);

            if (count==1) {
                var joinId = $scope.conferenceList[0].callId;
                $window.conferenceButtonClickNew(joinId);
                $log.warn('merge call into '+joinId);
            }

            //show the merge choice
            else if (count >1) {
                $scope.showMergeList = !$scope.showMergeList;
                if ($scope.showMergeList)

                    $rootScope.showMergeTransferBackground = true;
                else

                    $rootScope.showMergeTransferBackground = false;
            }

        }

        $scope.mergeListClick = function(joinId) {
            $log.warn('conference call merging process:  id'+joinId);
            $scope.showMergeList = false;
            $rootScope.showMergeTransferBackground = false;
            $window.conferenceButtonClickNew(joinId);

        }

        $scope.transferButtonClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($scope.disableTransferBtn)
                return;
            //check if there's more than 2 options for merge
            var count = $scope.transferList.length;

            if (count==1) {
                var transferId = $scope.transferList[0].callId;
                $window.transferButtonClickNew(transferId);
                $log.warn('trans call into '+transferId);
            }
            //show the merge choice
            else if (count >1) {
                $scope.showTransferList = !$scope.showTransferList;
                if ($scope.showTransferList)
                    $rootScope.showMergeTransferBackground = true;
                else
                    $rootScope.showMergeTransferBackground = false;
            }
        }

        $scope.transferListClick = function(transferId) {
            $log.warn('conference call transfer process:  id'+transferId);
            $scope.showTransferList = false;
            $rootScope.showMergeTransferBackground = false;

            $window.transferButtonClickNew(transferId);
        }

        $scope.toggleSettings = function() {

            $rootScope.viewSettings = !$rootScope.viewSettings;
            
            if(!$rootScope.viewSettings){
                //if ($rootScope.selectedContact) {
                    $rootScope.statusShowHideMF = true;
                    //mute video before
                    if ($scope.isSettingsCloseByVideoMute) {
                        $scope.unmuteVideo();
                        $scope.isSettingsCloseByVideoMute = false;
                    }
                //} else {
                  //$rootScope.statusShowHideMF = false;
                  //PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT );
                //}
            }else{

                //MF-611 begin
                clearTimeout(mf.timeouts['showVideoView']);
                mf.timeouts['showVideoView'] = setTimeout(function(){
                    var $vedioDiv = $('#settings .video-audio-settings');
                    if ($vedioDiv.is(":visible")) {
                        $vedioDiv.show();
                        $(document).cwic('addPreviewWindow',{previewWindow: 'localSettingsPreviewVideo' });
                    }
                }, 450);
                //MF-611 End

                $scope.viewContactContent = false;
                //before showing settings , we need to mute video if video exiting
                if (mf.elements.callContainer.is(':visible')) {
                    $scope.muteVideo();
                    $scope.isSettingsCloseByVideoMute = true;
                }
                if ($rootScope.statusShowHideMF==false) {
                    $rootScope.statusShowHideMF = true;
                    PostmessageService.setAppWindowSize( SETTINGS.WINDOW_SIZE.WIDTH_CHAT + SETTINGS.WINDOW_SIZE.WIDTH_CUES );
                }
            }  
        }

        $scope.muteUnmuteVideo = function() {
            var currentCall = $window.calls.getSelectedCall();
            var $callcontainer = $('#callcontainer');

            if ($scope.isVideoDisabled) return;

            if($scope.isVideoInactive){
                var currentCall = $window.calls.getSelectedCall();
                if (currentCall.videoDirection === "RecvOnly" || currentCall.videoDirection ===  "Inactive"){
                    $window.calls.getCallDiv().cwic('updateConversation', {'videoDirection': 'SendRecv'});
                    showVideoUI();
                }else if (currentCall.videoDirection === "SendRecv" || currentCall.videoDirection === "SendOnly"){
                    $window.calls.getCallDiv().cwic('updateConversation', "unmuteVideo");
                };

                $callcontainer.css('display','block');
                $scope.isSettingsCloseByVideoMute = false;
            }else {

                $(document).cwic('removePreviewWindow',{previewWindow: 'localPreviewVideo' });

                $window.calls.getCallDiv().cwic('updateConversation', "muteVideo");

                $callcontainer.css('display','none');

            };

            $scope.isVideoInactive = !$scope.isVideoInactive;
        }

        $scope.unmuteVideo = function() {
            var currentCall = $window.calls.getSelectedCall();
            var $callcontainer = $('#callcontainer');
            if ($scope.isVideoDisabled) return;
            if($scope.isVideoInactive){
                var currentCall = $window.calls.getSelectedCall();
                if (currentCall.videoDirection === "RecvOnly" || currentCall.videoDirection ===  "Inactive"){
                    $window.calls.getCallDiv().cwic('updateConversation', {'videoDirection': 'SendRecv'});
                    showVideoUI();
                }else if (currentCall.videoDirection === "SendRecv" || currentCall.videoDirection === "SendOnly"){
                    $window.calls.getCallDiv().cwic('updateConversation', "unmuteVideo");
                };

                $callcontainer.css('display','block');
            }
            $scope.isVideoInactive = !$scope.isVideoInactive;
        }

        $scope.openDialPad = function () {
            //$scope.dialPadPopup.isOpen = !$scope.dialPadPopup.isOpen ? true : false;
            //if ($scope.dialPadPopup.isOpen) {
            childWindow = null;
            var relativePath = 'dialpad.html';
            var width = 253;
            var height = 480;
            var windowName = 'child';
            var path = window.location.pathname;
            if (!childWindow || childWindow.closed) {
                childWindow = window.open(path + relativePath +'?version=' + localStorage.version , windowName, "width=253, height=420, location=0, menubar=0, scrollbars=0, status=0, toolbar=0");
            }
            if (childWindow) {
                setTimeout(function() {

                    try {
                        childWindow.postMessage({
                            messageType: 'phoneready',
                            message: localStorage.getItem('IsPhoneReady')
                        },'*');
                    } catch (e) {
                        console.log("dial pad window is not longer alive... ");
                        childWindow = null;
                    }

                },500);

            }
            if (typeof Awesome != 'undefined' && typeof Awesome.OpenInternalWindow != 'undefined') {
                Awesome.OpenInternalWindow(windowName, relativePath, width, height);
            }

            //}
            //else {
            //    localStorage.DialNumber = '';
            //    childWindow.close();
            //}
        };

        $scope.muteVideo = function() {
            var currentCall = $window.calls.getSelectedCall();
            var $callcontainer = $('#callcontainer');
            if ($scope.isVideoDisabled) return;
            $(document).cwic('removePreviewWindow',{previewWindow: 'localPreviewVideo' });

            if(!$scope.isVideoInactive){
                $window.calls.getCallDiv().cwic('updateConversation', "muteVideo");
                $callcontainer.css('display','none');
            }
            $scope.isVideoInactive = !$scope.isVideoInactive;
        }

        $scope.splitFullName = function(fullname){
            var output = {firstName:'', lastName: ''};
            var nameArr = $rootScope.selectedContact.displayName.split(' ');
            output.firstName = nameArr[0];
            if(nameArr[1]) output.lastName = nameArr[1];
            return output;
        }
        
        // COMPATIBILITY /////////////////
        $scope.$watch('selectedTabbedContent', function(newVal, oldVal){
            (newVal) ?
                $('.user-content .subscribers-contents').addClass(mf.cssClasses.HIDDEN) :
                $('.user-content .subscribers-contents').removeClass(mf.cssClasses.HIDDEN);            
        })
        //////////////////////////////////

        AuthenticationService.onLoad();

}]) // end main.controller


