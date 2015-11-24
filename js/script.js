var thiswindow = window;
var globalreg = null;

var childWindow;//dialpad
var mDevices=null;
var mDeviceSelected;

window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
},false);

window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
},false);

window.onload = function(){
    if (typeof Awesome != 'undefined')
        Awesome.handleEvent('HideSplash','');
};

function getProfileForPopup() {
    var rootScope = mf.angular.rootScope();
    var person = {selectedPerson: rootScope.selectedContact ,
                  selectedPersonContent:rootScope.selectedPersonContent,
                  rootScopeVar: rootScope};
    return person;
}


window.addEventListener("message", receiveNoteMessage, false);

function receiveNoteMessage(event) {
    if (event.data && event.data.CreatedFor) {
        console.log("****************received child personId changing:"+event.data.personId);
        var scope = angular.element($(".notes-module")).scope();
        var personId = event.data.CreatedFor;
        if(scope !== undefined){
            scope.$apply(function(){
                if (personId  && personId==scope.selectedContact.id) {
                    scope.notesList = [];
                    scope.noteSearchTerm =  event.data.noteSearchTerm;

                    if (scope.noteSelectedFromParent) {
                        if(event.data.CurrentNote){
                            scope.noteSelectedFromParent.id = event.data.CurrentNote.id;
                            scope.noteSelectedFromParent.note = event.data.CurrentNote;
                        }else{
                            scope.noteSelectedFromParent.note = null;
                            scope.noteSelectedFromParent.id = 0;
                        }
                    }
                    scope.init();
                }
            })
        }
    }
}

window.addEventListener("message", receiveTaskMessage, false);

function receiveTaskMessage(event) {
    if (event.data && event.data.CreatedFor) {
        console.log("****************received child personId changing:" + event.data.CreatedFor);
        var scope = angular.element($(".tasks-module")).scope();
        var personId = event.data.CreatedFor;
        if (scope !== undefined) {
            scope.$apply(function () {
                if (personId && personId == scope.selectedContact.id) {
                    scope.clearGroups();
                    scope.tasksList = [];
                    scope.taskSearchTerm = event.data.taskSearchTerm;
                    scope.taskSearchFilter['CreatedFor'] = event.data.createdFor;
                    scope.taskSearchFilter['CreatedBy'] = event.data.createdBy;
                    scope.taskSearchFilter['HideComplete'] = event.data.hideComplete;

                    if (scope.taskSelectedFromParent) {
                        if (event.data.CurrentTask) {
                            scope.taskSelectedFromParent.id = event.data.CurrentTask.id;
                            scope.taskSelectedFromParent.task = event.data.CurrentTask;
                        } else {
                            scope.taskSelectedFromParent.task = null;
                            scope.taskSelectedFromParent.id = 0;
                        }
                    }
                    scope.init();
                }
            });
        }
    }
}

/**
 * These settings are passed into the 'init' method.
 */
var settings = {
    ready: phoneReadyCallback, /* Callback when phone is ready for use */
    error: phoneErrorCallback, /* Error callback */
    encodeBase64: ciscobase.util.crypto.b64Encode,
    verbose: true,
    log: function (msg, context) {
        //console.trace();
        if (typeof console !== "undefined" && console.log) {
            var current = new Date();
            var timelog = current.getDate() + "/" +
                            ('0' + (current.getMonth()+1)).slice(-2)  + "/" +
                            current.getFullYear() + " " +
                            ('0' + current.getHours()).slice(-2) + ":" +
                            ('0' + current.getMinutes()).slice(-2) + ":" +
                            ('0' + current.getSeconds()).slice(-2) + "." +
                            ('00' + current.getMilliseconds()).slice(-3) + " ";
            console.log(timelog + msg)
            if (context) {
                if(console.dir) {
                    console.log(context);
                } else if(typeof JSON !== "undefined" && JSON.stringify) {
                    console.log(JSON.stringify(context,null,2));
                } else {
                    console.log(context);
                }
            }
        };
    },
    contactLookupJsonpHost: ""
};

// Array containing DTMF characters that we want to allow
var dtmfchars = { '0' : '0', '1' : '1', '2':'2', '3':'3', '4':'4', '5':'5', '6':'6', '7':'7', '8':'8', '9':'9', '#':'#', '*':'*' };

/*
 * Multiple-call settings
 */
var calls = multiCallContainer('call', 'calllist');

var videoObject = null;
var previewVideoObject = null;
var previewSettingsVideoObject = null;
var popupwindow = null;
var showLocalVideo = false;
var hideVideo = false;
// Used to track a conversation id that does not yet have a video window to associate to
var delayedVideoConversation = null;


/**
 * This callback is invoked when the phone plugin is available for use.
 */
function phoneReadyCallback(defaults,phoneRegistered, phoneMode) {
    $('#remotevideocontainer').cwic('createVideoWindow',{id: 'videocallobject', success: function(id) {
        videoObject = document.getElementById(id);
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^success '+id+videoObject);
        if (delayedVideoConversation) {
            // The update for the conversation that video is ready can occur before the createVideoWindow() call
            // returns asynchronously on some browsers, especially on Safari and background tabs.  Add the video
            // window to the call now.
            calls.getCallDiv(delayedVideoConversation.callId).cwic('updateConversation',{'addRemoteVideoWindow':videoObject});
            delayedVideoConversation = null;
        }
    }});

    setupUIHandlers();
    //refreshMMDevices();
    mf.callManager.isReady = true;

    mf.angular.settingScope().phoneIsReady = true;
};

function refreshMMDevices(){
    var ngSettingsScope = mf.angular.settingScope();
    window.setTimeout( function() {
            ngSettingsScope.$apply(function() {
            ngSettingsScope.getMultimediaDevices();
        });
    },50);
}

function phoneErrorCallback(error, exception) {
    if (error) {
        settings.log('phone error: ', error);
        var about = $().cwic('about');

        var msg = 'ERROR: cannot initialize phone: ' + error.message + ' (code ' + error.code + ')<br>';
        msg += 'cwic javascript version is ' + about.javascript.version + '<br>';

        if (about.upgrade) {
            if (about.upgrade.plugin) { msg += 'plugin upgrade ' + about.upgrade.plugin + '<br>'; }
            if (about.upgrade.javascript) { msg += 'cwic javascript upgrade ' + about.upgrade.javascript + '<br>'; }
        }

        $('#msgcontainer').empty().html('<b style="color:red">' + msg + '</b>');
    }

    if (exception) {
        settings.log('exception: ',exception);
    }
}


function handleMMDeviceChange() {
    refreshMMDevices();
}

/*
 * When page is loaded, initialize the plugin.
 */
$(document).ready(function() {

    // -----------------------------------------
    // Initialization
    $('#calllist').click(calls.callListClick);

    $('#mode').change(function() {
        $('#auth').attr('disabled', $(this).val() === 'DeskPhone');
    });
    $('#phonecontainer').cwic('init', settings);

    /**
    * Add handlers for conversationStart and conversationIncoming events
    */
    $('#phonecontainer')
        .bind('conversationStart.cwic', handleConversationStart)
        .bind('conversationIncoming.cwic', handleConversationIncoming)
        /**
         * Handle system events - these are issued when the webphone plugin is handling things like
         * IP address changes.
         */
        .bind('system.cwic', handleSystemEvent);
    $('#phonecontainer').bind('mmDeviceChange.cwic', refreshMMDevices);

    $(document).bind('error.cwic', handleError);

    console.log("MF: init null of mDevice and globalreg in Document ready **************");
    mDevices==null;
    globalreg==null;


    mf.elements.body = $('body');
    mf.elements.body.bind('click', function(e){
        var target = $(e.target);
        // Remove any cue info box in the page.
        $('.content-cue-description').remove();

        // Close search bar
        if(!target.parents('#search-on-call').length && !target.is('.search')){
            mf.elements.handlingBar.searchForm.trigger('closeMe');
        }
    })

    mf.elements.content = {
        container: $('.user-content')
    };


    // -----------------------------------------
    // Handling Bar setup
    mf.elements.handlingBar = $('#handling-bar');
    mf.elements.handlingBarControls = mf.elements.handlingBar.find('#call-control');

    // Handling Bar > Add Person
    mf.elements.addCallBtn = $('.call-action.addcall', mf.elements.handlingBar);

    // Handling Bar > Pause
    mf.elements.pauseBtn = $('.call-action.pause', mf.elements.handlingBar);
    mf.elements.pauseBtn.bind('click', function(e){
        e.preventDefault();
        var link = $(this);

        if(link.hasClass( mf.cssClasses.DISABLED )) return;

        if(link.is('.resume')){
            calls.getCallDiv().cwic('updateConversation', 'resume');

            link.removeClass('resume').addClass('hold');
            link.attr('title', link[0].getAttribute('data-title-pause'));
            link.text(link[0].getAttribute('data-title-pause'));

            mf.ui.handleCallButtonsVisibility(mf.call.events.RESUME);
        }else if(link.is('.hold')){
            calls.getCallDiv().cwic('updateConversation', 'hold');

            link.removeClass('hold').addClass('resume');
            link.attr('title', link[0].getAttribute('data-title-resume'));
            link.text(link[0].getAttribute('data-title-resume'));

            mf.ui.handleCallButtonsVisibility(mf.call.events.PAUSE);
        }
    });

    // Handling Bar > cues position
    mf.elements.cuesPosition = $('.cues-position', mf.elements.handlingBar);
    mf.elements.cuesPosition.bind('click', function(e){
        e.preventDefault();
        var link = $(this);
        if(link.is('.top')){
            link.removeClass('top').addClass('bottom');
        }else if(link.is('.bottom')){
            link.removeClass('bottom').addClass('left');
        }else if(link.is('.left')){
            link.removeClass('left').addClass('top');
        }
    });

    // Handling Bar > Call
    mf.elements.callBtnCall = mf.elements.handlingBar.find('.call-main-action.call');
    mf.elements.callBtnCall.bind('click', function(e){
        e.preventDefault();
        if($(this).hasClass( mf.cssClasses.DISABLED )) return;

        var rootscope = mf.angular.rootScope();
        if (!rootscope.selectedContact || !rootscope.selectedContact.selectedPhone)
            return;
        var currentInputVal = rootscope.selectedContact.selectedPhone.number;

        callButtonClick(currentInputVal);

    });

    // Handling Bar > End call
    mf.elements.callBtnEnd = mf.elements.handlingBar.find('.call-main-action.end');
    mf.elements.callBtnEnd.bind('click', function(e){
        e.preventDefault();

        if($(this).hasClass( mf.cssClasses.DISABLED )) return;

        endButtonClick();
    });

    // Handling Bar > Answer incoming call
    mf.elements.callBtnAnswer = mf.elements.handlingBar.find('.call-main-action.answer');
    mf.elements.callBtnAnswer.bind('click', function(e){
        e.preventDefault();
        if($(this).hasClass( mf.cssClasses.DISABLED )) return;

        localStorage.setItem("IsContactInfo", true);
        incomingAnswerClick();
        mf.ui.enableHandlingBarButtons();
        mf.ui.handleCallButtonsVisibility( mf.call.events.ANSWER );
    });

    // Handling Bar > Decline incoming call
    mf.elements.callBtnDecline = mf.elements.handlingBar.find('.call-main-action.decline');
    mf.elements.callBtnDecline.bind('click', function(e){
        e.preventDefault();
        if($(this).hasClass( mf.cssClasses.DISABLED )) return;
        //endButtonClick();
        incomingDivertClick();
        mf.ui.disableHandlingBarButtons();
        mf.ui.handleCallButtonsVisibility( mf.call.events.DECLINE );
    });


    // Handling Bar > Mute
    mf.elements.muteBtn = mf.elements.handlingBar.find('.call-action.mute');
    mf.elements.muteBtn.bind('click', function(e){
        e.preventDefault();
        var link = $(this);

        if(link.hasClass( mf.cssClasses.DISABLED )) return;

        if(link.is('.unmuted')){
            // Do mute action
            link.removeClass('unmuted').addClass('muted')
                .attr('title', link[0].getAttribute('data-text-unmute'));
            calls.getCallDiv().cwic('updateConversation', 'muteAudio');

        }else if(link.is('.muted')){
            // Do unmute action
            link.removeClass('muted').addClass('unmuted')
                .attr('title', link[0].getAttribute('data-text-mute'));
            calls.getCallDiv().cwic('updateConversation', 'unmuteAudio');

        };
    })

    // Handling Bar > search
     mf.elements.handlingBar.searchForm = mf.elements.handlingBar.find('#search-on-call');
    mf.elements.handlingBar.closeSearchBtn = mf.elements.handlingBar.searchForm.find('.close');
    mf.elements.handlingBarSearchInput = mf.elements.handlingBar.find('#search-on-call #dntodial2');

    // TDB: this is temporal, show contact list on hover
    mf.elements.contactList = mf.elements.handlingBar.find('.contacts-list');

    // -----------------------------------------
    // Settings
    mf.elements.settingsBtn = $('#settingsToggle');
    mf.elements.settings = {};
    mf.elements.settings.container = $('#settings');


    // Settings > Account
    mf.elements.settings.account = {
        username: $('#username_settings', mf.elements.settings.container),
        password: $('#password_settings', mf.elements.settings.container),
        loginBtn: $('#loginbtn-settings', mf.elements.settings.container),
        logoutBtn: $('#logoutbtn', mf.elements.settings.container),
        error: $('.account-settings .error', mf.elements.settings.container),
        info: $('.logininfo', '#settings'),
        devicemodeSelector: $('#devicemode', mf.elements.settings.container),
        devicesSelector: $('#devices', mf.elements.settings.container),
        loaderLogin: $('.loader-login', mf.elements.settings.container),
        loaderDevice: $('.loader.loader-device', mf.elements.settings.container),
        cucm: $('#cucm', mf.elements.settings.container)
    };

    // -----------------------------------------
    // Mindframe Login
    mf.elements.loginContainer = $('.login');
    mf.elements.login = {
        loginBtn: $('#loginbtn', mf.elements.loginContainer),
        info: $('.logininfo'), // TBD: add context
        username: $('#username', mf.elements.loginContainer),
        password: $('#password', mf.elements.loginContainer),
        rememberPasswordChk: $('#chk_remember_password', mf.elements.loginContainer),
        loaderIcon: $('.loader', mf.elements.loginContainer),
        error: $('.error', mf.elements.loginContainer)
    };
    mf.modal.init( mf.elements.loginContainer );

    // Bind Enter Key event to submit
    mf.elements.login.password.add(mf.elements.login.username)
        .unbind('keypress')
        .bind('keypress', function(){
        if (event.which == 13 || event.keyCode == 13) {
            event.preventDefault();
            mf.elements.login.loginBtn.trigger('click');
        }
    });


    // -----------------------------------------
    // Mindframe Logout
    mf.elements.logoutWrapper = $('.logout-wrapper');
    mf.elements.logoutbtn = $('#logout');
    mf.elements.logoutbtn.bind('click', function(e){
        e.preventDefault();
        logout();
    })


}); // end document ready.

function unbindCallHandlers() {
    $('#callbtn').unbind();
    $('#callcontainer').unbind();
    $('#callcontainer :button').unbind();
    $('#webExcontainer :button').unbind();
}


function exitMindframe(){
    try {
        var ngSettingsScope = mf.angular.settingScope();
        ngSettingsScope.doJabberLogout();
    }catch(ex){
        return ex;
    }
    return "";
}
/**
 * Logout
 */
function logout(){
    console.log('doing logout');
    try {
        var ngSettingsScope = mf.angular.settingScope();
        ngSettingsScope.doJabberLogout();

        mDeviceSelected = null;
        globalreg==null;
        // Clear saved data
        if(mf.elements.logoutWrapper != undefined){
            mf.elements.logoutWrapper.removeClass( mf.cssClasses.HIDDEN ).css({opacity:1});
        }

        /*
        var scope = angular.element($('.login-module')).scope();
        scope.$apply(function(){
            scope.authenticationService.logout();
        });
        */
        mf.storage.removeItem('accessToken');
        //mf.storage.clear();

        mf.storage.removeItem('user.firstName');
        mf.storage.removeItem('user.lastName');
        mf.storage.removeItem('user.username');
        mf.storage.removeItem('login.accessToken');
        mf.storage.removeItem('user.account');

        mf.user.preferences.clear();
        setTimeout(function(){
            window.location.reload(true);
        }, 1000);
    }catch(ex){
        return ex;
    }

    return "";
}



/* Still used by handleSystemEvent */
function handleLoggedOut() {
    calls.removeAll();
    globalreg = null;
    mDevices = null;

}



/**
* Set up the UI's handlers for clicks and cwic events. Doing this once prevents bugs from multiple
* events being fired
*/
function setupUIHandlers() {

    $('#callcontainer .holdresumebtn').click(holdResumeButtonClick);
    $('#callcontainer .muteaudiobtn').click(muteButtonClick);
    $('#callcontainer .mutevideobtn').click(muteButtonClick);
    $('#callcontainer .escalatebtn').click(escalateButtonClick);

    $('#dntodial2').keypress( function (event) {
        event.stopPropagation();
        var conversation = calls.getSelectedCall();
        if(conversation && conversation.capabilities.canSendDigit) {
            var char = String.fromCharCode(event.charCode || event.keyCode);
            if(dtmfchars[char]) {
                calls.getCallDiv().cwic('sendDTMF', char);
            }
        }
    });

    $('#callcontainer .endbtn').click(endButtonClick);

    // WebEx handlers
    $('#callcontainer .webExbtn').click( function() {
        $('#webExcontainer').show();
    });

    $('#webExcontainer .webExclosebtn').click( function() {
        $('#webExcontainer').hide();
     });

    $('#webExcontainer .applybtn').click(function() {
        WebEx.password = $('#webExpassword').val();
                    WebEx.username = $('#webExusername').val();
                    WebEx.site = $('#webExaddress').val();
                    $('#msgcontainer').text("Signing in...");
                                var backupURL = window.location.toString();
                                $('#backupURL,#imbackupURL').val(backupURL.replace('/sample.html','/bu.html'));
                    loginURL();
    });
    $('#webExcontainer .startMeeting').click(function() {
        $('#tckt').val(WebEx.ticket);
        $('#wbxid').val(WebEx.username);
        $('#impromptuMeeting').attr('action','https://'+WebEx.site+'.webex.com/'+WebEx.site+'/m.php');
        $('#impromptuMeeting').submit();
    });

    $('#mmDevices .refreshMMDevices').click(function() {
        refreshMMDevices();
    });


};


/**
 * Set the UI state to logged in
 */
function setUILoggedIn() {
    $('#dntodial2').attr('disabled', false);
};



function updateConversationInfo(conversation, callcontainer){
    console.log('Conversation: ');
    console.log(conversation);

    //use local storage
    if (typeof(Storage) != "undefined") {
        // lost conversation
        if(conversation === undefined){
            localStorage.CallInProgress = false;
            localStorage.IsContactInfo = false;
            localStorage.CallContactName = '';
        }
    }

    if(!calls.getSelectedCall() || calls.getSelectedCall().callId !== conversation.callId) {
        return;
    }

    var $callcontainer = $(callcontainer);
    updateTransferConferenceLists(conversation);

    if(conversation.isConference) {
        $callcontainer.find('.remotename').text("Conference");
    }
    else if(conversation.callType === "Outgoing") {
        $callcontainer.find('.remotename').text(conversation.calledPartyDirectoryNumber);

    }
    else if (conversation.callType === "Incoming") {
        $callcontainer.find('.remotename').text(conversation.callingPartyDirectoryNumber);
    }

    $callcontainer.find('.callinfo').text(conversation.callState);

    if (conversation.callState === 'Hold' || conversation.callState === 'RemHold') { //Deskphone mode , need to control from remote
        mf.ui.enableHandlingBarButtons();
        mf.ui.handleCallButtonsVisibility(mf.call.events.PAUSE);
        mf.ui.handleCallButtonsVisibility(mf.call.events.ANSWER);
        $callcontainer.find('.holdresumebtn').attr('disabled', !conversation.capabilities.canResume).html('<img src="img/resume.png">').addClass('held');
    } else {
        if (conversation && conversation.callState === "Connected" || conversation && conversation.callState ===  "RemInUse") {
            mf.ui.enableHandlingBarButtons();
            mf.ui.handleCallButtonsVisibility(mf.call.events.RESUME);
            if (conversation && conversation.callState ===  "RemInUse" && globalreg.mode!="DeskPhone") {
                mf.ui.handleCallButtonsVisibility(mf.call.events.END);
            } else {
                mf.ui.handleCallButtonsVisibility(mf.call.events.ANSWER);
            }
        }

        $callcontainer.find('.holdresumebtn').attr('disabled', !conversation.capabilities.canHold).html('<img src="img/pause.png">').removeClass('held');

    }

    $callcontainer.find('.endbtn').attr('disabled', !conversation.capabilities.canEndCall);
    if (!conversation.capabilities.canEndCall) { //can't press 'end' when hold status
        mf.elements.callBtnEnd.addClass( mf.cssClasses.DISABLED );
    } else {
        mf.elements.callBtnEnd.removeClass( mf.cssClasses.DISABLED );
        //mf.angular.mainScope().isResumeBlink = false;
    }

    //
    //MF-403,408
    if (conversation.callState==='RemInUse' || conversation.callState==='RemHold') {
        if (globalreg.mode=="DeskPhone") {
            console.log('remote deskphone is in use #############');
            mf.ui.handleCallButtonsVisibility( mf.call.events.ANSWER );
            mf.elements.muteBtn.addClass( mf.cssClasses.DISABLED ); //when remote deskphone mode, can't mute phone
        }
    }

    if (conversation.state === 'Reorder') {
        $callcontainer.find('.callinfo').text('Call failed');
    }
    if(conversation && conversation.callState === "Connected" && (conversation.videoDirection === "RecvOnly" ||  conversation.videoDirection === "SendRecv") ){
        //mf.elements.callBtnMain.removeClass('makecall').removeClass('answer').addClass('hangup');
        console.log('####################################### video status:'+conversation.callState);
        videoObject = document.getElementById('videocallobject');
        if (videoObject) {
                console.log('####################################### conversation.videoDirection:'+conversation.videoDirection);
                calls.getCallDiv().cwic('updateConversation',{'addRemoteVideoWindow':videoObject});
                showVideoUI();
        }else {
            console.log("#######################################Delayed video conversation, videoObject is null");
            delayedVideoConversation = conversation;
        }
    }

    if(conversation.audioMuted) {
        $callcontainer.find('.muteaudiobtn').attr('disabled', !conversation.capabilities.canUnmuteAudio);
        $callcontainer.find('.muteaudiobtn').text('Unmute Audio').addClass('muted');
    } else {
        $callcontainer.find('.muteaudiobtn').attr('disabled', !conversation.capabilities.canMuteAudio);
        $callcontainer.find('.muteaudiobtn').text('Mute Audio').removeClass('muted');
    }

    if(conversation.videoMuted) {
        $callcontainer.find('.mutevideobtn').attr('disabled', !conversation.capabilities.canUnmuteVideo);
        $callcontainer.find('.mutevideobtn').text('Unmute Video').addClass('muted');
    } else {
        $callcontainer.find('.mutevideobtn').attr('disabled', !conversation.capabilities.canMuteVideo);
        $callcontainer.find('.mutevideobtn').text('Mute Video').removeClass('muted');
    }

    if(conversation.videoDirection === "Inactive" || conversation.videoDirection === "RecvOnly") {
        $callcontainer.find('.escalatebtn').text('Escalate').attr('disabled',!conversation.capabilities.canUpdateVideoCapability);
    } else {
        $callcontainer.find('.escalatebtn').text('De-escalate').attr('disabled',!conversation.capabilities.canUpdateVideoCapability);
    }

}


function getCwicClasses(el) {
    var classes = jQuery(el).attr('class');
    var classestoadd = [];
    if(classes) {
        classes = classes.split(' ');
        for(var i=0;i<classes.length;i++) {
            if(classes[i].substring(4,0) === 'cwic') {
                classestoadd.push(classes[i]);
            }
        }
    }
    return classestoadd.join(' ');
}

function handleConversationStart(event, conversation, containerdiv) {
    calls.addCall(conversation, containerdiv);
    updateConversationInfo(conversation, '#callcontainer');
    var ngScope = mf.angular.rootScope();

    if(typeof Awesome != 'undefined' ){
      if ( !ngScope.statusShowHideMF) {
            ngScope.statusShowHideMF = true;
            ngScope.viewSettings = false; // hide settings
            Awesome.resizeWindow(1152);
            Awesome.restoreWindow();
      } else {
          ngScope.viewSettings = false; // hide settings
          Awesome.restoreWindow();
      }
    }
}

function handleConversationIncoming(event, conversation, containerdiv) {

    calls.addCall(conversation, containerdiv);
    //jun: set incoming call as the current selected call
    calls.setSelectedCall(conversation.id);

    //get info from server
    //var remoteNumber = conversation.callingPartyNumber;
    mf.ui.handleCallButtonsVisibility( mf.call.events.INCOMING );

    var ngScope = mf.angular.rootScope();
    if(typeof Awesome != 'undefined' ){
        if ( !ngScope.statusShowHideMF) {
            ngScope.statusShowHideMF = true;
            ngScope.viewSettings = false; // hide settings
            Awesome.resizeWindow(1152);
            Awesome.restoreWindow();
        } else {
            ngScope.viewSettings = false; // hide settings
            Awesome.restoreWindow();
        }
    }
}


function handleSystemEvent(event) {
    var reason = event.phone.status || null;
    settings.log('system event with reason=' + reason);
    settings.log('system event phone.ready=' + event.phone.ready);

	if(event.phone.ready){
		mf.ui.enableCallButton();
        localStorage.setItem('IsPhoneReady', 'true');
        if (childWindow && !childWindow.closed) {
            childWindow.postMessage({
                messageType: 'phoneready',
                message: true
            },'*');
        }
	}else{
        mf.ui.disableCallButton();
        localStorage.setItem('IsPhoneReady', 'false');
        if (childWindow && !childWindow.closed) {
            childWindow.postMessage({
                messageType: 'phoneready',
                message: false
            },'*');
        }
	}

    if (reason == 'eRecoveryPending') {
        settings.log('recovery pending, end any active call and disable make call');

        $('#msgcontainer').empty().text('System recovery is pending ...');

    }
    else if (reason == 'eIdle') {
        handleLoggedOut();
    }
    else if (reason == 'eReady') {
        $('#msgcontainer').empty();
        settings.log('phone is ready, enable make call');

    }
    else if (reason == 'ePhoneModeChanged') {
        //$('#mode').val(event.phone.registration.mode);
    }
    else if (reason == 'eConnectionTerminated') {
        $('#msgcontainer').empty().text("Logged in elsewhere - disconnecting....");
        //logoutCallManager();
    }
    else {
        settings.log('ignoring system.cwic event with reason=' + reason);
    }
}

function handleError(error) {
    var msg = (error.message || '') + '<br>';
    msg += error.details.join('<br>');

    try {
        if (error.nativeError) {
            msg += '<br> native error: ' + (typeof JSON !== 'undefined' && JSON.stringify) ? JSON.stringify(error.nativeError) : error.nativeError;
        }
    }
    catch(e) {
        if(typeof console !== "undefined" && console.trace) {
            console.trace();
        }
    }

    $('#msgcontainer').empty().html(msg);
}

function incomingAnswerClick() {

    var videodirection = $('#videocall').is(':checked');

    var $call = calls.getCallDiv();

    var answerObject = $call.data('cwic');
    var isVideoOpen = $('input[name=videoaudio-mode]:checked').val();

    if (isVideoOpen==="true"){
        analytics.trackTag("on_calls_inbound_video");
        answerObject.videoDirection = 'SendRecv';
    } else {
        analytics.trackTag("on_calls_inbound");
        answerObject.videoDirection = 'RecvOnly';
    }
    answerObject.remoteVideoWindow = 'videocallobject';

    if (typeof(Storage) != "undefined") {
        localStorage.setItem("CallInProgress", true);
        localStorage.setItem("IsContactInfo", true);
        localStorage.setItem("CallContactName", '');
    }

    $call.cwic('startConversation', answerObject);
}

function incomingDivertClick() {

    calls.getCallDiv().cwic('endConversation',true);
}

function switchModeClick(){
    var modechange;
    if($('#mode').val()=='SoftPhone') {
        modechange="DeskPhone";
    }
    else {
        modechange='SoftPhone';
    }
    authNeeded = ($('#mode').val() === "DeskPhone" || $('#auth').attr('checked'));
    $('#callbtn').attr('disabled', true);
    $('#switchmodebtn').attr('disabled', true);
    var forcereg = $('#forcereg').attr('checked');
    $('#switchmodebtn').cwic('switchPhoneMode', {
        mode: modechange,
        error: handlePhoneRegistrationFailure,
        forceRegistration: forcereg
    });
    calls.removeAll();
}

function holdResumeButtonClick() {
    if($(this).hasClass('held')) {
        calls.getCallDiv().cwic('updateConversation', 'resume');
    } else {
        calls.getCallDiv().cwic('updateConversation', 'hold');
    }
}

// TBD: remove this old function.
function muteButtonClick() {
    var muteIsAudio = true;
    if($(this).hasClass('mutevideobtn')) {
        muteIsAudio = false;
    }
    if($(this).hasClass('muted')) {
        calls.getCallDiv().cwic('updateConversation', muteIsAudio? 'unmuteAudio' : 'unmuteVideo');
    } else {
        calls.getCallDiv().cwic('updateConversation', muteIsAudio? 'muteAudio' : 'muteVideo');
    }
}

function endButtonClick() {
    //get data from local storage
    if (typeof(Storage) != "undefined") {
        localStorage.CallInProgress = false;
        localStorage.IsContactInfo = false;
        localStorage.CallContactName = '';
    }
    calls.getCallDiv().cwic('endConversation');
}

function handleConversationUpdate(event, conversation, container) {
    settings.log('conversationUpdate Event for conversation:'+conversation.callId+' on Dom node: ' + event.target.id, conversation);
    calls.addCall(conversation, container);
    updateConversationInfo(conversation, $('#callcontainer'));
}


function handleConversationEnd(event, conversation) {
    calls.removeCall(conversation.callId);
    settings.log('conversationEnd Event for conversation:'+conversation.callId);
    delayedVideoConversation = null;

}

function handlePhoneRegistrationFailure(error) {

    mf.elements.settings.account.loaderLogin.addClass( mf.cssClasses.HIDDEN );
    mf.elements.settings.account.loaderDevice.addClass( mf.cssClasses.HIDDEN );

    mf.elements.settings.account.loginBtn.removeClass( mf.cssClasses.WORKING );
    mf.elements.settings.account.loaderLogin.removeClass( mf.cssClasses.WORKING );

    var msg = 'Unable to login: ' + error.message+' ';
    msg += error.details.join(', ');

    if (error.code==22) {
        mf.elements.login.error.text("CUCM User name or password incorrect !");
        return;
    }
    if (error.code==20) {
        mf.elements.login.error.text("CUCM authentication failed, please try again!");
        return;
    }
    if (error.code == '18') {
    }
    mf.elements.settings.account.info.text('');
    mf.elements.settings.account.error.text(msg);
    mf.callManager.isUserLoggedIn = false;
    mf.callManager.loginInProgress = false;
}

function transferButtonClickNew(trId) {
    var currentCall = calls.getSelectedCall();
    if(currentCall.callId !== trId) {
        calls.getCallDiv().cwic('updateConversation', {'transferCall':trId});
    }
}

function conferenceButtonClick() {
    var joinCallId = $("#conferencelist option:selected").val();
    var joinCall = calls.getCall(joinCallId);
    var currentCall = calls.getSelectedCall();

    if(!joinCall || !currentCall) {
        settings.log("Call does not exist");
        return;
    }
    var currentParticipants = (currentCall.isConference ? currentCall.participants.length : 1);
    var joinParticipants = (joinCall.isConference ? joinCall.participants.length : 1);
    // if 2 conference calls are joined, we get a conference with n+1 participants one of whom is a conference, not n+m participants
    if(currentCall.isConference && joinCall.isconference) {
        joinParticipants = 1;
    }
    // maxParticipants is either 0 (if not a conference), a positive number if the call is a conference, or -1 if it cannot be determined
    // if -1, we attempt to conference anyway - at worst it just won't conference and the calls are left as is
    if((joinCall.isConference && joinCall.maxParticipants > 0 && (currentParticipants + joinParticipants > joinCall.maxParticipants)) || (currentCall.isConference && currentCall.maxParticipants > 0 && (currentParticipants + joinParticipants > currentCall.maxParticipants))) {
        settings.log("Cannot join calls, max participants exceeded.");
        return;
    }
    calls.getCallDiv().cwic('updateConversation', {'joinCall':joinCallId});
}

function conferenceButtonClickNew(joinCallId) {
    var joinCall = calls.getCall(joinCallId);
    var currentCall = calls.getSelectedCall();

    if(!joinCall || !currentCall) {
        settings.log("Call does not exist");
        return;
    }
    var currentParticipants = (currentCall.isConference ? currentCall.participants.length : 1);
    var joinParticipants = (joinCall.isConference ? joinCall.participants.length : 1);
    // if 2 conference calls are joined, we get a conference with n+1 participants one of whom is a conference, not n+m participants
    if(currentCall.isConference && joinCall.isconference) {
        joinParticipants = 1;
    }
    // maxParticipants is either 0 (if not a conference), a positive number if the call is a conference, or -1 if it cannot be determined
    // if -1, we attempt to conference anyway - at worst it just won't conference and the calls are left as is
    if((joinCall.isConference && joinCall.maxParticipants > 0 && (currentParticipants + joinParticipants > joinCall.maxParticipants)) || (currentCall.isConference && currentCall.maxParticipants > 0 && (currentParticipants + joinParticipants > currentCall.maxParticipants))) {
        settings.log("Cannot join calls, max participants exceeded.");
        return;
    }
    calls.getCallDiv().cwic('updateConversation', {'joinCall':joinCallId});
}

function updateTransferConferenceLists(conversation) {
    var mainScope = mf.angular.mainScope();
    var existingCalls = calls.getCalls();
    var text = '';
    $('#conferencelist').empty();
    $('#transferlist').empty();
    mainScope.conferenceList = [];
    mainScope.transferList = [];

    var conferenceAvailable = false;
    var transferAvailable = false;
    if(conversation && conversation.callState === "Connected") {
        for(var call in existingCalls) {
            if(existingCalls.hasOwnProperty(call)) {
                if(conversation.capabilities.canJoinAcrossLine && existingCalls[call].callId !== conversation.callId && existingCalls[call].capabilities.canJoinAcrossLine) {
                    if(existingCalls[call].isConference) {
                        text = "Conference";
                    } else if(existingCalls[call].callType === "Outgoing") {
                        text=existingCalls[call].calledPartyDirectoryNumber;
                    } else {
                        text=existingCalls[call].callingPartyDirectoryNumber;
                    }
                    $('#conferencelist').append("<option value='" + existingCalls[call].callId + "'>" + text + "</option>");

                    var displayName = calls.getCallsNames(text.replace(/[^0-9*#+]/g, ''));
                    if (displayName)
                        existingCalls[call].displayName=displayName;
                    else
                        existingCalls[call].displayName = text;

                    mainScope.conferenceList.push(existingCalls[call]);

                    conferenceAvailable = true;
                }
                if(conversation.capabilities.canDirectTransfer && existingCalls[call].callId !== conversation.callId && existingCalls[call].capabilities.canDirectTransfer) {
                    if(existingCalls[call].isConference) {
                        text = "Conference";
                    } else if(existingCalls[call].callType === "Outgoing") {
                        text=existingCalls[call].calledPartyDirectoryNumber;
                    } else {
                        text=existingCalls[call].callingPartyDirectoryNumber;
                    }
                    $('#transferlist').append("<option value='" + existingCalls[call].callId + "'>" + text + "</option>");

                    var displayName = calls.getCallsNames(text.replace(/[^0-9*#+]/g, ''));
                    if (displayName)
                        existingCalls[call].displayName=displayName;
                    else
                        existingCalls[call].displayName = text;

                    mainScope.transferList.push(existingCalls[call]);

                    transferAvailable = true;
                }
            }
        }
    }
    $('#conferencebtn').attr('disabled', !conferenceAvailable);
    $('#transferbtn').attr('disabled', !transferAvailable);


    mainScope.disableMergeBtn = !conferenceAvailable;
    mainScope.disableTransferBtn = !transferAvailable;

}

function escalateButtonClick() {
    var currentCall = calls.getSelectedCall();
    var $callcontainer = $('#callcontainer');
    if (currentCall.videoDirection === "Inactive" || currentCall.videoDirection === "RecvOnly") {
        calls.getCallDiv().cwic('updateConversation', {videoDirection:'SendRecv'});
        $callcontainer.find('.escalatebtn').text('De-escalate');
    }
    else if (currentCall.videoDirection === "SendRecv") {
        calls.getCallDiv().cwic('updateConversation', {videoDirection:'RecvOnly'});
        $callcontainer.find('.escalatebtn').text('Escalate');
    }
    else if (currentCall.videoDirection === "SendOnly") {
        calls.getCallDiv().cwic('updateConversation', {videoDirection:'RecvOnly'});
        $callcontainer.find('.escalatebtn').text('Escalate');
    }
    else {
        alert("invalid value for video direction!");
    }
}

// make a audio/video call
function callButtonClick(dn) {
    if (!dn) return;
    dn = dn.replace(/[^0-9*#+]/g, ''); // remove special characters before call.
    console.log(" callButtonClick : phone number is "+dn);
    var videodirection = 1;
    var originateObject = null;
    var isVideoOpen = $('input[name=videoaudio-mode]:checked').val();

    if (isVideoOpen==="false") {
        analytics.trackTag("on_calls_outbound");
        originateObject = { participant: {recipient: dn}, media:'audio'};
    }else {
        analytics.trackTag("on_calls_outbound_video");
        originateObject = {participant: {recipient: dn}, videoDirection: (videodirection ? 'SendRecv':(jQuery(document).cwic('about').capabilities.video ? 'RecvOnly' : 'Inactive')),remoteVideoWindow: 'videocallobject'};
    }

    $('#phonecontainer').cwic('startConversation',originateObject);
    mf.ui.enableHandlingBarButtons();
    mf.ui.handleCallButtonsVisibility( mf.call.events.CALL );

}


// handle the click to expand event
function handler(event){
    var target = $(event.target);
    if (target.is('li')){
        target.children().toggle('slow');
    }
}


function showVideoUI() {
    //mf.elements.settings.container.trigger('closeMe');
    //if deskphone mode, the video actually can't be shown on computer, the video is shown on desk phone
    if (globalreg.mode=="DeskPhone") {
        return;
    }
	//If someone has selected to hide the video, we should probably not show it.
    if (mf.angular.mainScope().isVideoInactive) {
        return;
    }

    var isVideoOpen = $('input[name=videoaudio-mode]:checked').val();
    if (isVideoOpen==='false') {
        return;
    }

    $(document).cwic('addPreviewWindow',{previewWindow: 'localPreviewVideo' });
    mf.angular.mainScope().isVideoCall  = true;
    $("#callcontainer").css('display','block');
    $('#callcontainer').show();
    $('#videocontainer').show();

    //data-video-heigh-adjust : adjust height in video
    mf.ui.fitElementsHeight($('[data-video-heigh-adjust]'));


    $('#callcontainer').resizable();
    $('#callcontainer').bind('resize', function(e)
    {

        var hWindow = $(window).height();
        //we should set the video size by percent , not the actual integer size.
        $("#callcontainer").width('100%');
        var hVideo = $("#callcontainer").height();
        var ratioHeight = hVideo/hWindow;
        var vvv = ratioHeight*100 +'%';
        if (ratioHeight<0.9) {
          $("#callcontainer").height(vvv);
        }
        else {
          $("#callcontainer").height('80%');
        }

    });

}

// Show Calling bar
function adjustBars() {

    mf.elements.handlingBar.show();

    $("#callcontainer").hide();
    $('#videocontainer').hide();

    // Show user content
    mf.elements.content.container.removeClass( mf.cssClasses.HIDDEN );

}

function restoreUI() {
    $(document).cwic('removePreviewWindow',{previewWindow: 'localPreviewVideo' });

    $("#callcontainer").hide();
    $('#videocontainer').hide();
}


function reConnect(){
   var scope =  angular.element($('.main-wrapper')).scope();
   angular.element($('.contacts-module')).scope().connectToJabber(scope.$parent.jabberLogin.username, scope.$parent.jabberLogin.password)
};

function onReconnectAfterHibernate(){
    angular.element($('.contacts-module')).scope().onReconnectAfterHibernate();
}


