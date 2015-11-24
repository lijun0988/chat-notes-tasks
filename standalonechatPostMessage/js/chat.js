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

var statuses = {'available': 'status-online', 'away':'status-unavailable', 'donotdisturb':'status-busy', 'offline':'status-offline'};
var currentUser = {};
currentUser.username = '';
var imgURL = location.protocol+'//' + location.hostname + (location.port ? ':' + location.port : '') + "/photos/";
var chatContent = $('#chatContent');
var messageList = $('#messageList', chatContent);

var chatWith = getParameterByName('user');
var newMessage = getParameterByName('message');

$('#chat>header strong').text( getParameterByName('fullname'));

var myStatus = 'available';
var theirStatus = 'available';

var mainWindow;


var getDate = function () {
	var time   	= new Date();
	var day    	= time.getDay();
	var days   	= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	day 		= days[day];
	
	var month  	= time.getMonth();
	var months 	= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'];
	month		= months[month];
	
	var date = day + " " + month + " " + time.getDate() + ", " + time.getFullYear();
	var dt = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate();
	
	return [dt, date];
}
var date = getDate();
$('#startime').attr('datetime', date[0]).text(date[1]);

var receiveMessage = function ( event ) {
	if ( !jQuery.isEmptyObject(event.data.type)){
		if (event.data.type == 'chat') {
			var data = event.data;
			var from = chatWith;
			var user = chatWith;
			var message = data.message;
			var time = new Date();
			putMessage(from, user, message, time, theirStatus);
		} else if (event.data.type == 'mypresence') {
			messageList.find('li.me figure').attr('class', '').addClass(statuses[event.data.status]);
		} else if (event.data.type == 'theirpresence') {
			messageList.find('li.counterpart figure').attr('class', '').addClass(statuses[event.data.status]);
		}
	}
}

var putMessage = function( from, user, message, time, status) {
	var hour  = time.getHours();
	var minute= time.getMinutes();
	var desc  = 'AM';
	if (hour > 12) {
		hour = hour-12;
		desc = 'PM';
	}
	if ( hour < 10 ) {
		hour = "0"+hour;
	}
	if (minute < 10) {
		minute = "0"+minute;
	}
	var datetime = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate() + ':' + time.getHours() + ':' + time.getMinutes() ;
	var showtime = hour + ':' +minute + ' ' +desc;
	
	var status = statuses[status];
	var who;
	if (from == currentUser.username) {
		who = 'me';
	} else {
		who = 'counterpart';
	}
	
	var img = imgURL + from + '.png'; 
	var altimg = 'img/profile.png';
	var $html = $('<li class="hidden chat-item '+who+'">'+
		'<figure class="'+ status +'">'+
			'<img src="' + img + '" alt="" />'+
			'<div class="cover"></div>'+
		'</figure>'+
		'<div class="chat-item-content">'+
			'<p>'+ message +'</p>'+
			'<time class="chat-item-datetime mf-ui-light" datetime="'+ datetime +'">' + showtime + '</time>'+
		'</div>'+
	'</li>');
	$html.find('figure img').error ( function () {
		$(this).unbind("error").attr("src", altimg);
	});
	$html.appendTo(messageList).fadeIn();
	chatContent.stop().animate({ scrollTop: messageList.height() }, 500);	
}

var sendMessage = function (text){
	var logMessage = {'from': currentUser.username, 'user': chatWith, 'message': text, 'time': new Date()};
	mainWindow.postMessage({'type':'sendchat', 'chat':logMessage}, 'http://localhost');
	putMessage(currentUser.username, chatWith, text, new Date(), myStatus)
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
	var key = 'chat-log-' + chatWith;
	var log = getFromLocal(key);
	var len = log.length;	
	for ( var i = 0; i < len; i++ ) {
		if (log[i][0] == chatWith) {
			
			putMessage(chatWith, chatWith, log[i][1], new Date(log[i][2]), theirStatus);//(users.list[chatWith]? users.list[chatWith].status : statuses['unavailable']) );
		} else {
			putMessage(currentUser.username, chatWith, log[i][1], new Date(log[i][2]), currentUser.status);
		}
	}
	if ( !jQuery.isEmptyObject(newMessage) && typeof newMessage == 'string'){
		newMessage = newMessage.replace(/(^\s+|\s+$)/g,'')
		if (newMessage.length > 0 ) {
			putMessage(chatWith, chatWith, newMessage, new Date(), theirStatus)
		}
	}
}



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

var statMessage = function(event) {
	console.log(event);
	mainWindow = event.source;
	currentUser = event.data.currentUser;
	myStatus = currentUser.status;
	theirStatus = event.data.theirStatus;
	
	window.removeEventListener("message", statMessage, false);
	window.addEventListener("message", receiveMessage, false);
	buildMessagesFromLocal();
}
window.addEventListener("message", statMessage, false);