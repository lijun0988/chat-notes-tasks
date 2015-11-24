//Check if browser supports html5 localStorage.
var supports_html5_storage = function () {
    try {
        document.domain = document.domain; //Workaround to ensure compability with iframe.
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
var supportsStorage = supports_html5_storage();

//Add a value to a localStorage key.
var addToLocal = function (key, value) {
    if (!supportsStorage) {
        return false;
    }
    localStorage[key] = JSON.stringify(value);
    return value;
}

//Get the value of a localStorage key.
var getFromLocal = function (key) {
    if (!supportsStorage) {
        return false;
    }
    if (localStorage[key]) {
        return JSON.parse(localStorage[key]);
    }
    return {};
}
//Remove a localStorage key.
var deleteFromLocal = function (key) {
    localStorage.removeItem(key);
}
var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var statuses = {
        'available': 'status-online', 
        'Available': 'status-online',
        'Unavailable': 'status-offline',
        'unavailable': 'status-offline',
        'chat': 'status-online',
        'away':'status-unavailable', 
        'Away':'status-unavailable', 
        'xa': 'status-unavailable', 
        'donotdisturb':'status-busy', 
        'dnd':'status-busy', 
        'Do not disturb':'status-busy', 
        'offline':'status-offline',
        'Offline':'status-offline',
        'In a Meeting': 'status-unavailable',
        'In a meeting': 'status-unavailable',
        'In a WebEx meeting': 'status-unavailable',
        'Presenting': 'status-busy',

        'On a call':'status-unavailable',
        'on a call':'status-unavailable'

    };
var currentUser = getParameterByName('currentUser') ? getParameterByName('currentUser') : '';

var imgURL = getParameterByName('avatar');
var chatContent = $('#chatContent');
var messageList = $('#messageList', chatContent);

var chatWith = getParameterByName('jid');
var newMessage = getParameterByName('message');

//$('#chat>header strong').text( getParameterByName('name'));

var myStatus = getParameterByName('myStatus') ? getParameterByName('myStatus') : 'available';
var theirStatus = getParameterByName('theirStatus') ? getParameterByName('theirStatus') : 'available';

var mainWindow;
if ( 'undefined' == typeof mainWindow ){
    mainWindow = window.opener;
}

var getDate = function (dateTo) {
    var time    = new Date();
    var isToday = false;
    var isYesterday = false;
    var actualYear = time.getFullYear();
    if(dateTo != null){
        if(time.toLocaleDateString() == dateTo.toLocaleDateString())
        {
            isToday = true;
        }
        else
        {
            var yesterday = new Date();
            yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
            if(yesterday.toLocaleDateString() == dateTo.toLocaleDateString()){
                isYesterday = true;
            }
        }
        time    = dateTo;
    }
    var day     = time.getDay();
    var days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    day         = days[day];

    var month   = time.getMonth();
    var months  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    month       = months[month];

    var date = "";
    if(isToday){
        date = "Today"
    }
    else if(isYesterday){
        date = "Yesterday" + ", " + month + " " + time.getDate();
    }
    else{
        date = day + ", " + month + " " + time.getDate()  + (time.getFullYear() == actualYear ? (""):(", "+time.getFullYear()));
    }

    var dt = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate();

    return [dt, date, time];
}

var receiveMessage = function ( event ) {
    console.log('receiveMessage');
    console.log(event);

    if(event.data.messageType == 'ready'){
        readyMessageReceived(event.data.message);
        return;
    }
    else if ( !jQuery.isEmptyObject(event.data.message.type)){
        if (event.data.message.type == 'chat') {
            var data = event.data;
            var message = data.message.message;

            if(data.messageType == "theirpresence"){
                if (data.message.status)
                  theirStatus = data.message.status;
            }

            else if(data.messageType == "data"){
                if (data.message.theirStatus)
                    theirStatus = data.message.theirStatus;
            }

            //TODO: if the message is null, it means we're receiving a 
            //message that the other user is in the process of typing a message. 
            if ( message ) {
                //Replace links, emails with actual links
                message = extract_email_links_in_text(message);
                var from = chatWith;
                var user = chatWith;
                /*
                if (!theirStatus || theirStatus=='Unavailable'||theirStatus=='unavailable'||theirStatus=='Offline'||theirStatus=='offline') {
                    var nameChat = getParameterByName('name');
                    var $messageOffline = $('<li style="margin-right:10px;"><p id="hintMsg" class="hint"><img src="./tasks/img/priority-exclamation.svg" class="hint-img"/><span class="hint-info">'+nameChat+' is offline and cannot receive messages.</span></p></li>');
                    $('#messageList').append($messageOffline);
                    return;
                }*/
                var time = new Date();
                logMessage(from,user,message,time);
                putMessage(from, user, message, time, theirStatus);
                enableChatWindow(statuses[theirStatus]);

            }
        }
        else if (event.data.message.type == 'mypresence') {
            console.log('mypresence received = ' + event.data.message.status);
            messageList.find('li.me figure').attr('class', '').addClass(statuses[event.data.message.status]);
            myStatus = event.data.message.status;

        } else if (event.data.message.type == 'theirpresence'|| (event.data.messageType == "data"&&event.data.message.theirStatus)) {
            console.log('theirpresence');
            messageList.find('li.counterpart figure').attr('class', '').addClass(statuses[event.data.message.theirStatus]);
            if (event.data.message.theirStatus)
                theirStatus = event.data.message.theirStatus;
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
    return;
}

var readyMessageReceived = function(messageObject){
    console.log('status of the contact is ' + messageObject.contact.theirStatus);
    if (!messageObject|| !messageObject.contact.theirStatus) {
        return;
    }
    var theirsClass = statuses[messageObject.contact.theirStatus];
    var myClass = statuses[messageObject.contact.myStatus];
    if(messageObject.contact.theirStatus.toLowerCase() == 'unavailable'){
        disableChatWindow();
    }else{
        enableChatWindow(theirsClass, myClass);
    }
}

var disableChatWindow = function(){
    $('#notification').removeClass('hidden').text('This user is offline and unable to communicate with you at this time.');
    $('#chatmessagesubmit, #chatmessage').attr('disabled','disabled');
}

var enableChatWindow = function(status, myStatus){
    $('#notification').addClass('hidden').text('');
    $('#chatmessagesubmit, #chatmessage').removeAttr('disabled');
    // Update status for the contact
    if(status){
        //$('.chat-item.counterpart figure').attr('class','').addClass(status);
    }
    if (myStatus) {
        //$('.chat-item.me figure').attr('class','').addClass(myStatus);
    }
    
}

var updateCounterpartStatus = function(status){

}

var putMessage = function( from, user, message, time, status) {

    console.log('putMessage from ' + from);
    console.log('putMessage user ' + user);
    console.log('putMessage status ' + status);

    var hour  = time.getHours();
    var minute= time.getMinutes();
    var desc  = 'AM';
    if (hour >= 12) {
        if (hour>12)
            hour = hour-12;
        desc = 'PM';
    }
    /*if ( hour < 10 ) {
        hour = "0"+hour;
    }*/
    if (minute < 10) {
        minute = "0"+minute;
    }
    var datetime = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + ':' + time.getHours() + ':' + time.getMinutes() ;
    var showtime = hour + ':' +minute + ' ' +desc;

    var who;
    if (from == currentUser) {
        who = 'me';
        status = statuses[myStatus];
    } else {
        who = 'counterpart';
        status = statuses[theirStatus];
    }
    var objToday = $('time:contains("Today")');
    if(objToday != null && objToday.length == 0){
        var date = new Date();
        if(time.toLocaleDateString() == date.toLocaleDateString()){
            var $html = $('<time class="main-time" datetime="' + datetime + '">Today</time>');
            $html.appendTo(messageList).fadeIn();
        }
    }

    var img = imgURL;
    var altimg = 'contacts/img/default.png';
    var $html = $('<li class="hidden chat-item '+who+'">'+
        '<figure class="'+ status +'">'+
            '<img src="' + img + '" alt="" />'+
            '<div class="cover"></div>'+
        '</figure>'+
        '<div class="chat-item-content" >'+
            '<p></p>'+
            '<time class="chat-item-datetime mf-ui-light" datetime="'+ datetime +'">' + showtime + '</time>'+
        '</div>'+
    '</li>');
    $html.find('p').append(message);
    $html.find('p').append( "<i class='pointer'></i>");

    $html.find('figure img').error ( function () {
        $(this).unbind("error").attr("src", altimg);
    });
    $html.appendTo(messageList).fadeIn();
    chatContent.stop().animate({ scrollTop: messageList.height() }, 500);   
}

var chatLogs = {};
var logMessage = function (from, user, message, time) {
    console.log('logging message: ' + message);
    user = user.toLowerCase();
    var saved = chatLogs[user];
    var local = getFromLocal('chat-log-' + user);

    if (from == currentUser) {
        status = myStatus;
    } else {
        if ( theirStatus ) {
            status = theirStatus;
        } else {
            status = 'offline';
        }
    }
    
    var msg = [from, message, Number(time)];
    if (!jQuery.isEmptyObject(local)) {
        local.push(msg);
        chatLogs[user] = local;
    } else {
        chatLogs[user] = Array(msg);
    }
    var key = 'chat-log-' + user;
    console.log('Chat log key ' + key);
    //var log = getFromLocal(key);
    //log.push(msg);
    addToLocal(key, chatLogs[user]);    
};

function extract_email_links_in_text(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    var result = nl2br(text, true);
    result = result.replace(urlRegex, function(url) {
        return '<a href="javascript:handleChatLinks(\'' + url + '\');">' + url + '</a>';
    });
    result = result.replace(emailRegex, function(email){
        return '<a href="javascript:handleChatEmails(\'' + email + '\');">' + email + '</a>';
    });
    return result;
}

function handleChatLinks(url){
    if(typeof Awesome !== 'undefined'){
        Awesome.openBrowser(url);
    }
}
function handleChatEmails(email){
    if(typeof Awesome !== 'undefined'){
        Awesome.openEmail(email);
    }
}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

var sendMessage = function (text){
    //Replace links, emails with actual links
    text = extract_email_links_in_text(text);
    var data = {'from': currentUser, 'user': chatWith, 'message': text, 'time': new Date()};

    putMessage(currentUser, chatWith, text, new Date(), myStatus);
    logMessage(currentUser,chatWith,text,data.time);

    if (theirStatus && theirStatus.toLowerCase()!="unavailable") {
        mainWindow.postMessage({'type':'groupchat', 'chat':data}, '*');
    } else {
        if (!theirStatus || theirStatus.toLowerCase()=='unavailable') {
            var nameChat = getParameterByName('name');
            var $messageOffline = $('<li style="margin-right:10px;"><p id="hintMsg" class="hint"><img src="./tasks/img/priority-exclamation.svg" class="hint-img"/><span class="hint-info">'+nameChat+' is offline and cannot receive messages.</span></p></li>');
            $('#messageList').append($messageOffline);

        }
    }

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


var buildMessagesFromLocal = function () {

    var currentDate="";
    var key = 'chat-log-' + chatWith.toLowerCase();
    var log = getFromLocal(key);
    var len = log.length;   
    for ( var i = 0; i < len; i++ ) {

        var chatDate = new Date(log[i][2])
        var chatDateArr = getDate(chatDate);
        //$('#startime').attr('datetime', chatDateArr[0]).text(chatDateArr[1]);
        if(currentDate != chatDateArr[1]) {
            var $html = $('<time class="main-time" datetime="' + chatDateArr[0] + '">' + chatDateArr[1] + '</time>');
            $html.appendTo(messageList).fadeIn();
            currentDate = chatDateArr[1]
        }
        if (log[i][0] == chatWith) {
            putMessage(chatWith, chatWith, log[i][1], chatDate, theirStatus);
            //(users.list[chatWith]? users.list[chatWith].status : statuses['unavailable']) );
        } else {
            putMessage(currentUser, chatWith, log[i][1], chatDate, myStatus);
        }
    }
    if ( !jQuery.isEmptyObject(newMessage) && typeof newMessage == 'string'){
        newMessage = newMessage.replace(/(^\s+|\s+$)/g,'')
        if (newMessage.length > 0 ) {
            putMessage(chatWith, chatWith, newMessage, new Date(), theirStatus)
        }
    }
}


$('#chatmessage').on('keyup', function(e) {
    if (e.which == 13 && ! e.shiftKey) {
        $('#chatmessagesubmit').trigger('click');
        e.preventDefault();
    }
});
$('#sendMessageForm').on('submit', function (e) {
    e.preventDefault();

    var chatmessage = $('#chatmessage');
    var msg = chatmessage.val();
    msg = msg.replace(/^\s+|\s+$/g,'');
    console.log(msg);

    if(msg.length){
        sendMessage(msg);
    }
    chatmessage.val('');


});

var startMessage = function(event) {
    console.log('startMessage');
    console.log(event);
    if ( event.data ) {
        data = event.data;
        if (data.currentUser) {
            currentUser = data.currentUser;    
        }
        if ( data.myStatus ) {
            myStatus = data.status;    
        }
        if ( data.theirStatus ){
            theirStatus = data.theirStatus;    
        }            
    }
    mainWindow = event.source;
        
    window.removeEventListener("message", startMessage, false);
    window.addEventListener("message", receiveMessage, false);
    buildMessagesFromLocal();
}


if ( mainWindow ) {
    console.log('Chat window load.');
    window.addEventListener("message", receiveMessage, false);
    buildMessagesFromLocal();
} else {
    window.addEventListener("message", startMessage, false);
}


/* Text selection */
function selectElementContents(el) {
    console.log('selectElementContents');
    var range;
    if (window.getSelection && document.createRange) {
        range = document.createRange();
        var sel = window.getSelection();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

$('.chat-window .chat-content .chat-item p').on('dblclick', function(){
    selectElementContents(this);
})

$(document).ready(function(){
    var chatContentWrapper = $('#chatContent');
    var header = $('header');
    var footer = $('footer');
    
    function calculateHeight(){
        return $(window).height() - (header.height() + footer.height()+20);
    }

    chatContentWrapper.height( calculateHeight() );

    $(window).bind('resize', function(){
        clearTimeout(window.timeoutResize);
        window.timeoutResize = setTimeout(function(){
            chatContentWrapper.height( calculateHeight() );
        }, 200);
    });

    $("a#toggle").click(function()
    {
        $("#contact").slideToggle();
        if($("#toggle").hasClass("collapsed")){
            $("#toggle").removeClass("collapsed");
        }
        else{
            $("#toggle").addClass("collapsed");
        }
        return false;
    });
})


$(".chat-window").click(function(){
    if($('#searchContactId').hasClass("visible")){
        $("#searchContactId").removeClass("visible");
    }

});

$("#searchContactId").click(function(event){
    $("#searchContactId").addClass("visible");
    event.stopPropagation();
});

$("#openSearch").click(function(event){
    if($('#searchContactId').hasClass("visible")){
        $("#searchContactId").removeClass("visible");
    }
    else{
        $("#searchContactId").addClass("visible");
        $('#input-search-text').focus();
    }
    event.stopPropagation();
});

$( "#input-search-text" ).keyup(function() {
    clearTimeout(window.timoutSearch);
    window.timoutSearch = window.setTimeout( function () {
        var iQueryVal = $('#input-search-text').val();
        if(iQueryVal.length > 1){
            search(iQueryVal);
        }
        if(iQueryVal.length == 0){
            $('#contactList').html('<ul></ul>');
            $('#clearSearch').removeClass("visible");
        }
    },500);
});

function search(iQueryVal){
    console.log(iQueryVal);
    $('#showLoadingSearch').toggle();
    $('#clearSearch').removeClass("visible");
    // Retrieve the object from storage
    var retrievedObject = JSON.parse(localStorage.getItem('accessObject'));
    //console.log('retrievedObject: ', retrievedObject);

    if(retrievedObject != null){
        $.ajax({
            type: 'GET',
            url: retrievedObject.urlServer+"?"+'query='+iQueryVal.trim()+'&max=99',
            headers: {
                'Access-Token': retrievedObject.accessToken
            }
        }).success(function (data, status) {
            window.clearTimeout(window.timoutSearch);
            $('#showLoadingSearch').toggle();
            $('#clearSearch').addClass("visible");

            var personsList = [];
            var listHtml =$('<ul>');
            var plist = data.data;

            for (var i=0;i<plist.length;i++) {
                if (plist[i]) { //weird: some accounts from server will not have username (account)
                    personsList.push(plist[i]);
                }
            }
            personsList.sort(SortByName);
            for (var i=0;i< personsList.length;i++) {
                var person = personsList[i];
                person.displayName = person.firstName+" "+person.lastName;
                person.personId = person.id;
                person.groups = [];
                //console.log("succcess: " + person.displayName);
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

                mainWindow.postMessage({'type':'presence', 'jid':person.username, 'key':chatWith}, '*');
                var phoneClass = person.phones.length > 0 ? 'call' : 'hidden-phone';

                listHtml.append('<li style="position: relative; width: 100%; height: 35px;"><div>' +
                    '<div style="float: left; padding-left: 10px; cursor: pointer;" onclick="javascript:SendInvitationChat(\''+person.username+'\');">'+
                        '<img style="" class="presence-undefined" id="li-id-'+person.username+'">'+
                        '<p class="name">'+person.displayName+'</p>'+
                    '</div>' +
                    '<div style="float: right; margin-top: 7px;" >' +
                        '<a href="" class="'+phoneClass+'" data-phone-number="'+person.selectedPhone+'" data-ng-click="(person.phones.length > 1) ? togglePersonPhoneSelector($index) : callContact(person)">call</a>'+
                    '</div>'+
                    '<div style="float: right; margin-top: 7px;" >' +
                        '<a href="" class="chat">chat</a>' +
                    '</div>');
                //}
                listHtml.append('</div></li>');

            }
            if(personsList.length > 0)
            {
                listHtml.append('</ul>');
            }
            else{
                listHtml.append('<span class="name" style="padding: 10px;">No User Found</span>');
            }

            $('#contactList').html(listHtml);

        }).error(function (data, status) {
            console.log("error: " + data);
            $('#showLoadingSearch').toggle();
            $('#clearSearch').addClass("visible");
        });
    }
    else
    {
        console.log('cannot load retrievedObject from localstorage');
    }
}

function SendInvitationChat(jid)
{
    mainWindow.postMessage({'type':'groupchatInvite', 'jid':jid, 'key':chatWith}, '*');
    clearSearch();
    $("#searchContactId").removeClass("visible");
    event.stopPropagation();
}

function clearSearch(){
    $( "#input-search-text").val('');
    $('#contactList').html('<ul></ul>');
    $('#clearSearch').removeClass("visible");
}

function SortByName(a, b){
    a.displayName = a.firstName+" "+a.lastName;
    b.displayName = b.firstName+" "+b.lastName;
    var aName = a.displayName.toLowerCase();
    var bName = b.displayName.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function groupContactPhones(mfContact){
    if (mfContact.phones && mfContact.phones.length>0) {
        if (mfContact.phones[0].type && mfContact.phones[0].number)
            return mfContact.phones;
    }

     var phones = [];
     if(mfContact.phones){
         for (var i = 0; i < mfContact.phones.length; i++) { //here , the .phones should be office phones when search person
             var phone = {};
             phone.number = mfContact.phones[i];
             phone.type = 'office-phone';
             if (phone.number.toString().length<=4)
                 phones.unshift(phone);
             else
                 phones.push(phone);
         }
     }
     if(mfContact.mobilePhones){
         for (var i = 0; i < mfContact.mobilePhones.length; i++) {
             var phone = {};
             phone.number = mfContact.mobilePhones[i];
             phone.type = 'mobile-phone';
             phones.push(phone);
         }
     }
     if(mfContact.homePhones){
         for (var i = 0; i < mfContact.homePhones.length; i++) {
             var phone = {};
             phone.number = mfContact.homePhones[i];
             phone.type = 'home-phone';
             phones.push(phone);
         }
     }

     return phones;
 }