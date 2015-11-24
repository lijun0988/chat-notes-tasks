var mainWindow = window.opener;
window.addEventListener("message", receiveMessage, false);
var ctrlScope = function() {
    return angular.element($('[data-ng-controller="ChatWindowController"]')).scope();
}
var rootScope = function() {
    return angular.element($('html')).scope();
}

var currentUser = getParameterByName('currentUser') ? getParameterByName('currentUser') : '';
var chatWith = getParameterByName('jid');
var chatWithName = getParameterByName('name');

var newMessage = getParameterByName('message');
var myStatus = getParameterByName('myStatus') ? getParameterByName('myStatus') : 'available';
var theirStatus = getParameterByName('theirStatus') ? getParameterByName('theirStatus') : 'available';

var myAvatar = getParameterByName('myAvatar');
var theirAvatar = getParameterByName('theirAvatar');
var pageNumber = 0;

var numOfRecords = 50;

var keysHistory = chatWith+'-'+currentUser;
var keysHistoryNames = chatWith+'-'+currentUser+'-names';
var keysHistoryFileNames = store.get(keysHistoryNames);
var popupFileNames = {};

var chatContent = $('#chatContent');
var messageList = $('#messageList', chatContent);

var awsSignedUrl =  null;
var awsFormParamsUrl =  null;



function receiveMessage( event ) {
    console.log('receiveMessage');
    if ( !jQuery.isEmptyObject(event.data.message.type)){
        if (event.data.message.type == 'chat') {
            var data = event.data;
            var message = data.message.message;
            if (data.messageType == "theirpresence") {
                if (data.message.status){
                  theirStatus = data.message.status;
                   _.each(ctrlScope().chatMessageList, function(msg, index){if (msg.sender!=currentUser){ msg.status=statuses[theirStatus];} })
                }                
            }
            else if(data.messageType == "data"){
                if (data.message.theirStatus){
                    theirStatus = data.message.theirStatus;
                     _.each(ctrlScope().chatMessageList, function(msg, index){if (msg.sender!=currentUser){ msg.status=statuses[theirStatus];} })
                }
            }
            //TODO: if the message is null, it means we're receiving a
            //message that the other user is in the process of typing a message.
            if ( message ) {
                var from = chatWith;
                var user = chatWith;

                var time = new Date();
				setTimeout(function(){
				    logMessage(from,user,message,time);
				},1000);
                //first time receving a message , awesomium namespace loading has 0.5 sec delay, put message should happen later
                setTimeout(function(){
                    putMessage(from, user, message, time, theirStatus);
                    var isChatSound = getSettingsFromParent('settings.alertSounds.chatSound');
                    if(typeof Awesome != 'undefined' && isChatSound)
                    {
                        Awesome.playSentChatSound();
                    }
                },900);
                enableChatWindow();
            }
        }
        else if (event.data.message.type == 'mypresence') {
            console.log('mypresence received = ' + event.data.message.status);
            myStatus = event.data.message.status;
            _.each(ctrlScope().chatMessageList, function(msg, index){if (msg.sender==currentUser){ msg.status=statuses[event.data.message.status];} })

        } else if (event.data.message.type == 'theirpresence') {
            console.log('theirpresence: ' + event.data.message.status);
            if (statuses[event.data.message.status] != 'status-offline') {
                enableChatWindow();
            }
            else {
                disableChatWindow();
            }

            if (event.data.message.status) {
                _.each(ctrlScope().chatMessageList, function(msg, index){if (msg.sender!=currentUser){ msg.status=statuses[event.data.message.status];} })
                theirStatus = event.data.message.status;
            }
        }
        else if(event.data.message.type == 'presence'){
            console.log(event.data.message.key);
            var liId = 'li-id-'+event.data.message.key;
            $('.presence-undefined').each(function(){
                var myId = this.id;
                if(myId == liId)
                {
                    $(this).removeClass('presence-undefined').addClass('presence-'+event.data.message.status);
                }
            });
        }
    }
    else if(event.data.messageType == 'fileTransferUrls'){
        if(event.data.message.formsParamsUrl && event.data.message.signedUrl){
            awsSignedUrl =  event.data.message.signedUrl;
            awsFormParamsUrl =  event.data.message.formsParamsUrl;
        }
    }
    if (!ctrlScope().$$phase) { ctrlScope().$apply() }
    return;
}

function sendMessage(text, needShowOrLog){
    var data = {'from': currentUser, 'user': chatWith, 'message': text, 'time': new Date()};
    if (!needShowOrLog) {
        putMessage(currentUser, chatWith, text, new Date(), myStatus);
        logMessage(currentUser,chatWith,text,data.time);
    }
    if (theirStatus && theirStatus.toLowerCase()!="unavailable") {
        mainWindow.postMessage({'type':'sendchat', 'chat':data}, '*');
    } else {
        if (!theirStatus || theirStatus.toLowerCase()=='unavailable') {
            var nameChat = getParameterByName('name');
            var $messageOffline = $('<li style="margin-right:10px;"><p id="hintMsg" class="hint"><img src="./tasks/img/priority-exclamation.svg" class="hint-img"/><span class="hint-info">'+nameChat+' is offline and cannot receive messages.</span></p></li>');
            $('#messageList').append($messageOffline);
        }
    }

    $('#chatmessage').val("");
    $('#chatmessage').empty().text('');
}


function loadHistory() {
    /*
    if (typeof Awesome != 'undefined') {
        if (typeof Awesome.handleEventWithCallback != 'undefined') {
            var messageObj = { CurrentUserJid: currentUser, UserJid: chatWith.toLowerCase(), PageNumber: pageNumber, NumberOfRecords: numOfRecords };
            Awesome.handleEventWithCallback('GetChatHistory', JSON.stringify(messageObj), onGetChatHistoryFromAwesome);
            pageNumber++;

        }
    } else {
    */
    console.log('first time load localStorage first, scroll action to load history');
    var msgQueue = store.get(keysHistory);
    if (msgQueue && msgQueue.length>0) {
        rootScope().$broadcast('addMessagesHistory',msgQueue)
    }
    if (msgQueue && msgQueue.length<numOfRecords && keysHistoryFileNames && keysHistoryFileNames.length && keysHistoryFileNames.length>0) {
        var lastOne = keysHistoryFileNames.length-1;
        var name = keysHistoryFileNames[lastOne];
        popupFileNames[name] = name;
        var msgQueue1 = store.get(name);
        if (msgQueue1 && msgQueue1.length>0) {
            rootScope().$broadcast('addMessagesHistory',msgQueue1)
        }
    }
    setTimeout(function(){
        chatContent.stop().animate({ scrollTop: messageList.height() }, 500);
    },300);
    //}
}

function onGetChatHistoryFromAwesome(result) {
    if (result != null && result != '') {
        var log = JSON.parse(result);
        if (log != null) {
            fillChatWindowHistoryFromAwesome(log);
        }
    }
}

function fillChatWindowHistoryFromAwesome(log) {
    var len = log.length;
    var chatDate = "";
    var messages = [];
    for (var i = 0; i < len; i++) {
        var msg = {};
        var chatTimestamp;
        if (typeof (log[i][2]) === "number") {
            chatTimestamp = log[i][2];
        }
        else {
            chatTimestamp = parseInt(log[i][2]);
        }
        msg.time = chatTimestamp;
        msg.body = log[i][1];

        //chatDate = new Date(chatTimestamp)
        msg.chatWith = chatWith;
        if (log[i][0] == chatWith) {
            //putMessage(chatWith, chatWith, log[i][1], chatTimestamp, theirStatus, true);
            msg.sender = chatWith;

        } else {
            msg.sender = currentUser;
            //putMessage(currentUser, chatWith, log[i][1], chatTimestamp, myStatus, true);
        }
        messages.push(msg);
    }
    rootScope().$broadcast('addMessagesHistory', messages);


    setTimeout(function(){
        if (pageNumber > 1 && len>0) {
            var scrollingTo = (len * 30) * 2;
            chatContent.stop().animate({ scrollTop: scrollingTo }, 500);
        } else {
            chatContent.stop().animate({ scrollTop: messageList.height() }, 500);
        }
    },500);

}


function disableChatWindow() {
    $('#chatmessage').attr('disabled', 'disabled').attr('contenteditable', 'false').blur();
    ctrlScope().chatteeOffline = true;
}

function enableChatWindow() {
    $('#chatmessage').removeAttr('disabled').attr('contenteditable', 'true').focus();
    ctrlScope().chatteeOffline = false;
}


function putMessage(from, user, message, time, status) {
    var messageNew = {};
    messageNew.sender = from;
    messageNew.chatWith = user;
    messageNew.body = message;
    messageNew.time = time;

    rootScope().$broadcast('addMessage',messageNew);
}

function logMessage(from, user, message, time) {
    /*
    if (typeof Awesome != 'undefined') {
        if (typeof Awesome.handleEvent != 'undefined') {
            var messageObj = { currentUserJid: currentUser, userJid: user, senderJid: from, message: message, timestamp: Number(time) };
            Awesome.handleEvent('SaveChatMessage', JSON.stringify(messageObj));
        }
    }
    else {
    */
        console.log('log message in browser.');
        var msg = {};
        msg.sender = from;
        msg.chatWith = user;
        msg.body = message;
        msg.time = time;
        if (!store.has(keysHistory)) store.set(keysHistory, [msg]);
        else {
            var msgQueue = store.get(keysHistory);
            if (!msgQueue||msgQueue.length>=numOfRecords) {
                uploadFileWS(keysHistory,msgQueue);
                msgQueue=[];
            }
            msgQueue.push(msg);
            store.set(keysHistory, msgQueue);
        }
    //}
};

function uploadFileWS(key, msgQueue){
    if (!key||!msgQueue||msgQueue.length<numOfRecords) return;
    //save queue key names first locally
    keysHistoryFileNames=store.get(keysHistoryNames);//every time need to get from cache !!!
    if (!keysHistoryFileNames) keysHistoryFileNames = [];
    var keyQueueThisTime = getRandomId();
    keysHistoryFileNames.push(keyQueueThisTime);
    store.set(keysHistoryNames, keysHistoryFileNames);
    popupFileNames[keyQueueThisTime] = keyQueueThisTime;
    //upload to server
    //sendWS(keyQueueThisTime, msgQueue);
    store.set(keyQueueThisTime, msgQueue);
}


function extract_email_links_in_text(text) {
    text = text.replace('<','< ').replace('>', ' >');
    var urlRegex = /((http:\/\/|https:\/\/|www\.)[^\s]+)/g;
    var emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    var phoneRegex = /((\+[0-9]{1,2})?\s?(\([1-9]{3}\)|((\+)?[0-9]{1,2}(-|\s|.))?[1-9]{3})(-|\s|.)[0-9]{3}(-|\s|.)[0-9]{4}|(\+[0-9]{1,2})?\s?[0-9]{4,11})/ig;

    var result = text;

    result = result.replace(urlRegex, function(url) {
        return '<a href="#" class="link-link" data-value="' + url + '">' + url + '</a>';
    });

    if(result == text){
        result = result.replace(emailRegex, function(email){
            return '<a href="#" class="email-link" data-value="' + email + '">' + email + '</a>';
        });
    }

    if(result == text){
        result = result.replace(phoneRegex, function(phone){
            return '<a href="#" class="phone-link" data-value="' + phone + '">' + phone + '</a>';
        });
    }

    result = nl2br(result, true);
    return result;
}

function isWebExUrl(message){
    if (!message || message.indexOf('WEBEX-URL')==-1) return false;
    return true;
}
function htmlWebExUrl(message){
    var strUrlPrefix = "WEBEX-URL", strNumberPrefix="WEBEX-NUM", strPasswordPrefix="WEBEX-PWD";
    var indUrl = message.indexOf(strUrlPrefix);
    var indNum = message.indexOf(strNumberPrefix);
    var indPwd = message.indexOf(strPasswordPrefix);
    if (indUrl==-1 ||indNum==-1 ||indPwd==-1)
        return message;
    var strUrl = message.substring(indUrl+9,indNum);
    var strNum = message.substring(indNum+9,indPwd);
    var strPwd = message.substring(indPwd+9);
    console.log('webex url:'+strUrl+", number:"+strNum+", pwd:"+strPwd);

    var html = '<a href="#" class="link-link webex-link" data-value="' + message + '">Join my WebEX Meeting</a>' +
               '<br><span class="webex-number">Number:</span><span class="webex-number-content">'+strNum.trim()+'</span>' +
               '<br><span class="webex-password">Password:</span><span class="webex-password-content">'+strPwd.trim()+'</span>';


    return html;
}

function hasTextFileTransferProtocol(text){
    var fileTransferRegex = /mf-filetransfer:/g;

    var fileTransfers = text.match(fileTransferRegex);
    return (fileTransfers != null);
}

function extract_file_transfer_in_text(text) {
    var result = text;

    var fileTransferNameRegex = /((mf-filetransfer:mf-name:)[^,]+)/g;
    var fileTransferUrlRegex = /((mf-url:)[^\s]+)/g;

    var fileTransferNameMatch = text.match(fileTransferNameRegex);
    var fileTransferUrlMatch = text.match(fileTransferUrlRegex);

    var filetransfer_name = fileTransferNameMatch[0].replace("mf-filetransfer:mf-name:","");
    var filetransfer_url = fileTransferUrlMatch[0].replace("mf-url:","");

    result = '<a href="#" class="link-link" data-value="' + filetransfer_url + '">' + filetransfer_name + '</a>';

    result = nl2br(result, true);
    return result;
}

function handlePhone(){
    $('.phone-call-tooltip').remove();//remove is exists a previous one
    var phone = $(this).attr('data-value');
    var handler = $('<span class="phone-call-tooltip"><h3>' + phone + '</h3><a href="#" class="call-number">Call Number</a><span class="arrow"></span></span>');
    $('#chatWindow').append(handler);
    handler.find('.call-number').attr('data-value', phone);
    var pos = $(this).offset();
    handler.css({
        top: (pos.top - $(this).height() - handler.height() - 4) + 'px',
        left: (pos.left + $(this).width() / 2 - handler.width() / 2) + 'px'
    });
    var handler_width = handler.width();
    var arrow_width = handler.find('.arrow').width()//this is the width of the arrow
    handler.find('.arrow').css({
        top: handler.height() + 'px',
        left: (handler_width / 2 - arrow_width / 2) + 'px'
    });

    $(document).unbind('click').on('click', function(e){
        if($(e.target).hasClass('call-number')){
            mainWindow.postMessage({'type':'call_from_chat', 'number': $(e.target).attr('data-value')}, '*');
        }
        if(!$(e.target).parent().hasClass('phone-call-tooltip')) {
            $('.phone-call-tooltip').remove();
        }
        e.stopPropagation();
    });

    $('#chatContent').unbind('scroll').on('scroll', function(){
        $('.phone-call-tooltip').remove();
    });
    return false;
}

function handleChatLinks(){
    var url = $(this).attr('data-value');
    if(typeof Awesome !== 'undefined' && url !== ''){
        Awesome.openBrowser(url);
    }
    return false;
}
function handleChatEmails(){
    var email = $(this).attr('data-value');
    if(typeof Awesome !== 'undefined' && email !== ''){
        Awesome.openEmail(email);
    }
    return false;
}

//set link handlers
$('#messageList').on('click', '.phone-link', handlePhone);
$('#messageList').on('click', '.email-link', handleChatEmails);
$('#messageList').on('click', '.link-link', handleChatLinks);


function nl2br (str) {
    return str.replace(/(\r\n|\n\r|\r|\n)/g, "<br />");
}

var openChatWindows = function () {
    var ocw = getFromLocal('openChatWindows');
    if ( jQuery.isEmptyObject(ocw)){
        return [];
    }
    return ocw;
};
var closeChatWindow = function (e) {
    e.preventDefault();
    var openWindows = openChatWindows();
    var index = $.inArray(chatWith, openWindows);
    openWindows.splice(index,1);
    addToLocal('openChatWindows', openWindows);
}
jQuery(window).on('beforeunload', closeChatWindow);

function parseMessageInput(msg) {
    msg = msg.replace(/^\s+|\s+$/g,'');
    // Reeplace br to nl
    msg = msg.replace(/<br\s*[\/]?>/gi, '\n');
    // Remove extra tags
    msg = msg.replace(/<\/?[^>]+(>|$)/g, '');
    //remove &nbsp;
    msg = msg.replace(/&nbsp;/g, ' ');
    return msg;
}

function sync_heights_message_and_chat(){
    $('#chatContent').stop().animate({ scrollTop: $('#messageList').height() }, 500);
    var h_message = $('footer').height();
    if(h_message > initial_message_height) {
        $('#chatContent').height(initial_chat_content_height - (h_message - initial_message_height) - 5);
    }else{
        $('#chatContent').height(initial_chat_content_height - 5);
    }
}


function getSettingsFromParent(key){
    try{
        if (!localStorage.getItem('accessObject')) return false;
        var retrievedObject = JSON.parse(localStorage.getItem('accessObject'));
        var userKey = retrievedObject.loginUser;
        if (!userKey) return  null;
        key = userKey+'.'+key;
        var output;
        var returnValue = localStorage.getItem(key);
        try{
            output = JSON.parse(returnValue);
            return output;
        }catch(ex){
            return returnValue;
        }
    }catch(ex){
        mf.console.error(ex, 'getSettingsFromParent');
    }
};

$(document).ready(function(){
    var chatContentWrapper = $('#chatContent');
    var header = $('header');
    var footer = $('footer');

    function calculateHeight(){
        return $(window).height() - (header.height() + footer.height());
    }

    chatContentWrapper.height( calculateHeight() );

    $(window).bind('resize', function(){
        clearTimeout(window.timeoutResize);
        window.timeoutResize = setTimeout(function(){
            chatContentWrapper.height( calculateHeight() );
            window.initial_chat_content_height = chatContentWrapper.height();
            window.initial_message_height = footer.height();
        }, 200);
    });

    window.initial_chat_content_height = chatContentWrapper.height();
    window.initial_message_height = footer.height();
    $('#chatmessage').focus();
    console.log('chat document ready called');

    $(document).bind('dragover drop', function(event){
        event.preventDefault();
        return false;
    });



    mainWindow.postMessage({'type':'get_contact_phones', 'contactJid': chatWith}, '*');

});

window.onload= function(){
    //setTimeout(function() {
        loadHistory();
    //},500);

};

// Paging the messages loaded into the chatContent window. 
$("#chatContent").on('scroll', function () {
    if ($("#chatContent").scrollTop() == 0) {
         /*
        if(typeof Awesome != 'undefined') {
            loadHistory();
        }
        else {
        */
        var name;
        if (keysHistoryFileNames&&keysHistoryFileNames.length>0) {
          for (var i=keysHistoryFileNames.length-1;i>=0;i--) {
            var popName = keysHistoryFileNames[i];
            if (popupFileNames[popName]==popName) continue;
            else {
                name = popName;
                popupFileNames[popName]=popName;
                break;
            }
          }
        }
        if (name) {
            var msgQueue = store.get(name);
            if (msgQueue && msgQueue.length>0) {
                rootScope().$broadcast('addMessagesHistory',msgQueue)
                var scrollingTo = (50 * 30);
                setTimeout(function(){
                    var top = $('#messageList li:nth-child(50)').position().top;
                    chatContent.stop().animate({ scrollTop: top }, 200);
                },500)

            }
        }
    }
    //}
});

