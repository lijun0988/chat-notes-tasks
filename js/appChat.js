'use strict';

/* App Module */
//
var mfApp = angular.module('chatApp', ['ui.bootstrap', 'ngResource','angularFileUpload','encoding.service'
]);

mfApp.controller('ChatWindowController',
    [   '$scope',
        '$rootScope',
        '$http',
        '$log','$window','$filter','$timeout','PATHS', 'EncodingService',
        function($scope, $rootScope, $http, $log, $window,$filter, $timeout, PATHS, EncodingService){

            $scope.isShowMultiPhones = false;
            $scope.enableInput = true;
            $scope.chatMessageInput="";
            $scope.chatMessageList = [];
            $scope.offlineDesc = "This user is offline and unable to communicate with you at this time.";
            $scope.chatWithName = $window.chatWithName;


            $scope.isMe = function(message){
                return message.sender == $window.currentUser;
            }
            $scope.getImgClass = function(message) {
                if ($scope.isMe(message)) return statuses[myStatus];
                return statuses[theirStatus];
            }
            $scope.getImgUrl = function(message) {
                if ($scope.isMe(message)) return myAvatar;
                return theirAvatar;
            }
            $scope.formatTime = function(time, isDayOrTime) {
                var result = $window.formatTime(time,isDayOrTime);
                return result;
            }
            $scope.onEnter = function(e) {
                if (e.which == 13 && ! e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.onSubmit(e);
                }else{
                    sync_heights_message_and_chat();
                }

            }
            //call MF server (get back 2 urls response), open host url, send joinUrl to peer
            $scope.webExClick = function(e){
                e.stopPropagation();
                //get the webex credentials first and then call ws start webex
                var parentScope = mainWindow.mf.angular.rootScope();
                var cred = 'jli' + ':' + 'Leezhang3';
                var credentials64 = EncodingService.encode(cred);
                var attendees = [];
                attendees.push({name:$window.chatWithName, email:$window.chatWith});
                var webexURL = PATHS.BASE_SERVICE_API_URL + parentScope.currentAccount + PATHS.WEBEX_MEETING;
                var dataJson = {};
                dataJson.credentials = credentials64;
                dataJson.attendees = attendees;
                var req = {
                    method: 'POST',
                    url: webexURL,
                    cache:false,
                    headers: {
                        'Access-Token': parentScope.credentials.accessToken
                    },
                    data: JSON.stringify(dataJson)
                }
                $http(req).success(function(successResp){
                    $log.debug("webex meeting ws:"+successResp);
                    //send join url
                    var joinUrl = 'https://fidelus.webex.com/mw0401l/mywebex/default.do?service=1&siteurl=fidelus&nomenu=true&main_url=%2Fmc0901l%2Fe.do%3Fsiteurl%3Dfidelus%26AT%3DMI%26EventID%3D303200147%26UID%3D2114163122%26Host%3D32fe32b25d427c23383e%26FrameSet%3D2%26MTID%3Dm1a4c018d23196dcbda9371ef44be1c5d';
                    var meetingNumber='1234567';
                    var meetingPwd = "1234";
                    var messageWebEx = 'WEBEX-URL'+joinUrl+' WEBEX-NUM'+meetingNumber+' WEBEX-PWD'+meetingPwd;
                    sendMessage(messageWebEx, true);

                    //open host url
                    var hostUrl = joinUrl;
                    if(typeof Awesome !== 'undefined'){
                        Awesome.openBrowser(hostUrl);
                    }else {

                    }

                }).error(function(failResp){
                        $log.error("webex meeting ws:"+failResp);
                        //send join url
                        var joinUrl = 'https://fidelus.webex.com/mw0401l/mywebex/default.do?service=1&siteurl=fidelus&nomenu=true&main_url=%2Fmc0901l%2Fe.do%3Fsiteurl%3Dfidelus%26AT%3DMI%26EventID%3D303200147%26UID%3D2114163122%26Host%3D32fe32b25d427c23383e%26FrameSet%3D2%26MTID%3Dm1a4c018d23196dcbda9371ef44be1c5d';
                        var meetingNumber='1234567';
                        var meetingPwd = "1234";
                        var messageWebEx = 'WEBEX-URL'+joinUrl+' WEBEX-NUM'+meetingNumber+' WEBEX-PWD'+meetingPwd;
                        sendMessage(messageWebEx, true);

                        //open host url
                        var hostUrl = joinUrl;
                        if(typeof Awesome !== 'undefined'){
                            Awesome.openBrowser(hostUrl);
                        }else {

                        }
                });

            }
            $scope.hasHistory = function(){
                if (!names||names.length==0) return false;
                return true;
            }

            $scope.callContact = function(e) {
                e.preventDefault();e.stopPropagation();
                var phones = $scope.getParentContactPhones();
                if (!phones) {
                    $scope.isShowMultiPhones = false;
                    return;
                }
                if (phones.length>1) {
                    $scope.isShowMultiPhones = !$scope.isShowMultiPhones;
                    return;
                }
                var contacts = mainWindow.mf.angular.contactScope().contactsList;
                var contact = _.find(contacts, function(contact){
                    if (contact.jid && contact.jid==$window.chatWith) {
                        return true;
                    }
                });
                mainWindow.mf.angular.contactScope().callContact(contact);
            }
            $scope.viewContact = function(e){
                e.preventDefault();e.stopPropagation();
                var contacts = mainWindow.mf.angular.contactScope().contactsList;
                var contact = _.find(contacts, function(contact){
                    if (contact.jid && contact.jid==$window.chatWith) {
                        return true;
                    }
                });
                mainWindow.mf.angular.contactScope().$apply(function(){
                    mainWindow.mf.angular.contactScope().selectContact(contact);
                });
            }
            $scope.selectPhoneAndCall = function(e,contactPhone) {
                e.stopPropagation();
                var contacts = mainWindow.mf.angular.contactScope().contactsList;
                var contact = _.find(contacts, function(contact){
                    if (contact.jid && contact.jid==$window.chatWith) {
                        return true;
                    }
                });
                mainWindow.mf.angular.contactScope().selectPhoneAndCall(contact, contactPhone);
                $scope.isShowMultiPhones = false;
            }

            $scope.onClickModel = function(e) {
                $scope.isShowMultiPhones = false;
            }

            $scope.onDblClick = function(e){
                $window.selectElementContents(e.currentTarget);
            }
            $scope.onSubmit = function(e) {
                e.preventDefault();
                //var msg = $scope.chatMessageInput;
                var chatmessage = $('#chatmessage');
                var msg = chatmessage.html();
                msg = $window.parseMessageInput(msg);
                console.log(msg);

                if(msg.trim()!= '' && msg.length){
                    sendMessage(msg);
                    var isChatSound = getSettingsFromParent('settings.alertSounds.chatSound');
                    if (typeof Awesome != 'undefined' && isChatSound) {
                        Awesome.playSentChatSound();
                    }
                }
                chatmessage.val("");
                chatmessage.empty().text('');
                $scope.chatMessageInput = "";
                sync_heights_message_and_chat();
            }

            $scope.onPaste = function(e) {
                var element =  $('#chatmessage');
                $(element).focus();

                setTimeout(function () {
                    var msg = $(element).html();
                    msg = $window.parseMessageInput(msg);

                    $(element).empty().text(msg);

                    $window.setCursorToEnd($(element).get(0));

                    e.preventDefault();
                    e.stopPropagation();
                });
            }
            $scope.onBlur = function(e) {
                $('.phone-selector').hide();
                $scope.isShowMultiPhones = false;
            }


            $scope.getParentContactPhones = function(){
                var contacts = mainWindow.mf.angular.contactScope().contactsList;
                if (contacts==null||contacts.length==0) return [];
                var phones = [];
                _.each(contacts, function(contact){
                    if (contact.jid && contact.jid==$window.chatWith) {
                        phones = contact.phones;
                    }
                });
                return phones;
            }

            $scope.$on('addMessage', function(event, message) {
                $log.debug("############addMessage received:"+message);
                parseMsgTime(message);
                $scope.chatMessageList.push(message);
                appendFirstTime();
                if(!$scope.$$phase){$scope.$apply()}

                $timeout(function(){
                    chatContent.stop().animate({ scrollTop: messageList.height() }, 500);
                },500);

            });

            $scope.$on('addMessagesHistory', function(event, messages) {
                if (!messages||messages.length==0) return;
                for (var i=messages.length-1;i>=0;i--) {
                    parseMsgTime(messages[i]);
                    $scope.chatMessageList.unshift(messages[i]);
                }
                appendFirstTime();

                if(!$scope.$$phase){$scope.$apply()}

            });

            function parseMsgTime(message){
                //set parse time which is showing on UI
                var parseTime = $filter('date')(message.time, 'EEE, MMM d');
                var timeCurrent   = new Date();
                if($filter('date')(timeCurrent,'EEE, MMM d')== parseTime)
                {
                    parseTime = "Today";
                }
                var yesterday = new Date();
                yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
                if($filter('date')(yesterday,'EEE, MMM d')== parseTime){
                    parseTime = "Yesterday" ;
                }
                message.parseTime = parseTime;
            }

            function appendFirstTime() {
                //first item in the same day should be flagged
                var mapDayMsg = {};
                _.each($scope.chatMessageList, function(message){
                    if (!mapDayMsg[message.chatWith+'-'+message.parseTime]) {
                        message.appendTimeFlag = true;
                        mapDayMsg[message.chatWith+'-'+message.parseTime] = message.parseTime;
                    } else {
                        message.appendTimeFlag = false;
                    }
                });
            }



}]);

mfApp.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});
mfApp.directive('parsemessageelement', function() {
    return {
        restrict:'A',
        replace: false,
        link: function(scope, element, attrs) {
            var msg = attrs.value;
            var parsedMessage = msg;
            if (hasTextFileTransferProtocol(parsedMessage)) {
                parsedMessage=extract_file_transfer_in_text(parsedMessage);
            }
            else if (isWebExUrl(parsedMessage)){
                parsedMessage=htmlWebExUrl(parsedMessage);
            }
            else {
                parsedMessage=extract_email_links_in_text(parsedMessage);
            }
            var pointer = '<i class="pointer"></i>';

            element.html(parsedMessage+pointer);

        }
    }
});

mfApp.directive('contenteditable', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function () {
                scope.$apply(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                //var html = element.html();
                var html = element.text();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});

/*************************************************File Share test******************************************************/
mfApp.factory('AWS', function($http) {
    return {
        getFormParams : function(success, error) {
            $http.get(awsFormParamsUrl)
                .success(function(response) {
                    success(response);
                })
                .error(function(response) {
                    error(response);
                });
        },
        getSignedUrl : function(fileKey, success, error) {
            $http.get(awsSignedUrl  + '&key=' + fileKey)
                .success(function(response) {
                    if (success){
                        success(response);
                    }
                })
                .error(function(response) {
                    console.log(response);
                    if (error){
                        error(response);
                    }
                });
        }

    };
});


mfApp.controller('FileUploadController', function($scope, $upload, $http, AWS) {

    $scope.uploadedFiles = [];
    $scope.progressBar;
    $scope.textHolder = "";
    mainWindow.postMessage({'type':'get_file_transfer_url', 'contactJid': chatWith}, '*');

    $scope.onFileUploaded = function (data, formData){
        console.log(data);
        var file = data.config.file;
        var fileKey = formData.key;

        AWS.getSignedUrl(fileKey, function (signedUrlResponse){
            $scope.uploadedFiles.push ({name:file.name, url:signedUrlResponse.signedUrl});
            $scope.textHolder = $('#chatmessage').text();

            $('#chatmessage').html("mf-filetransfer:mf-name:" + file.name  +" ,mf-url:" + signedUrlResponse.signedUrl);
            $('#chatmessagesubmit').trigger('click');
            $('#chatmessage').html($scope.textHolder);
        });
    }

    $scope.onFileSelect = function($files,e) {



        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];

            AWS.getFormParams(function(response){

                var thatScope = $scope;

                var formData = {
                    key: response.key,
                    AWSAccessKeyId: response.awsAccessKeyId,
                    acl: response.acl,
                    success_action_redirect: "#",
                    policy: response.policy,
                    signature: response.signature,
                    'Content-Type': $file.type
                };

                $scope.upload = $upload.upload({
                    method: 'POST',
                    url: response.awsUrl,
                    headers: {Authorization: ""},
                    data: formData,
                    file: $file
                })
                    .progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                        var progress = parseInt(100.0 * evt.loaded / evt.total);
                        if($scope.progressBar != true) {
                            $scope.progressBar = true;
                        }
                    }).error(function(data){
                        console.log('error' + data);
                        $scope.progressBar = false;
                        $scope.errorAttachUI();
                    })
                    .then(function (data){
                        $scope.progressBar = false;
                        thatScope.onFileUploaded(data, formData);
                        $scope.successAttachUI();
                    });
            }, function(){
                $scope.errorAttachUI();
            });
        }

        e.preventDefault();
        e.stopPropagation();
    };

    $scope.$watch('progressBar',function(){
        if($scope.progressBar && $scope.progressBar == true){
            $scope.startProgressAttachUI();
        }else if( $scope.progressBar == false){
            $scope.stopProgressAttachUI();
        }
    });

    $scope.startProgressAttachUI = function(){

        $("#attach-selected").hide();
        $("#upload-progress-bar").show();

    };

    $scope.stopProgressAttachUI = function(){
        $("#upload-progress-bar").hide();
        $("#attach-selected").show();

    };

    $scope.errorAttachUI = function(){
        $(".file-message").show();

        $("#attach-selected").removeClass("attach-icon-selected");
        $("#attach-selected").removeClass("attach-icon");
        $("#filetransfer").removeClass("file-transfer-white");
        $("#attach-selected").addClass("failed-icon");
        $("#filetransfer").addClass("failed-filetransfer");

        setTimeout(function(){
            $(".file-message").hide();
        }, 4000);

        setTimeout(function(){
            $("#attach-selected").removeClass("failed-icon");
            $("#filetransfer").removeClass("failed-filetransfer");
            $("#attach-selected").addClass("attach-icon");
            $("#filetransfer").addClass("file-transfer");
        }, 2000);
    };

    $scope.successAttachUI = function(){

        $("#attach-selected").removeClass("attach-icon-selected");
        $("#attach-selected").removeClass("attach-icon");
        $("#filetransfer").removeClass("file-transfer-white");

        $("#attach-selected").addClass("success-icon");
        $("#filetransfer").addClass("succes-filetransfer");

        setTimeout(function(){
            $("#attach-selected").removeClass("success-icon");
            $("#filetransfer").removeClass("succes-filetransfer");
            $("#attach-selected").addClass("attach-icon");
            $("#filetransfer").addClass("file-transfer");
        }, 2000);
    };

    $scope.hoverInAttach = function(){
       // $(".file-transfer").css("opacity" , 1);
        $("#attach-selected").addClass("attach-icon-hover");
    };

    $scope.hoverOutAttach = function(){
        //$(".file-transfer").css("opacity" , 0.5);
        $("#attach-selected").removeClass("attach-icon-hover");
    };

    $scope.clickAttach = function($event){
        $("#filetransfer").removeClass("file-transfer");
        $("#filetransfer").addClass("file-transfer-white");
        $("#attach-selected").addClass("attach-icon-selected");
    };

});






 
