var domain = location.hostname;
var subdomain = domain.split('.');
if(subdomain[0] === 'local' || subdomain[0] === 'localhost') {
	domain = 'nabu.fidelus.com:8080';
}

var BASE_SERVER =  location.protocol+'//'+ domain + (location.port ? ':'+location.port : '');
var jabberConfig = {
	domain: "fidelus-dev.com", //the domain specified for your CUP server
	httpBindingURL: BASE_SERVER + "/httpbinding/", //the BOSH url for your server
	//httpBindingURL: "http://localhost/httpbinding/", //the BOSH url for your server
	//httpBindingURL: "proxy.php", //the BOSH url for your server
	//httpBindingURL: "https://192.168.110.205:7335/httpbinding", //the BOSH url for your server
	unsecureAllowed: true, //unsecureAllowed should be true if plaintext authentication is allowed over unencrypted or unsecured HTTP channels
	maxGraphAge: 5,
	atSymbolAllowed: false,
	logPersistence: false,
	serviceDiscoveryEnabled: false,
	httpBindingURL_secondary: "/httpbinding/"
};
jabberwerx._config.unsecureAllowed = jabberConfig.unsecureAllowed;

var userNames = {};
userNames.getName = function ( key ) {
	if (!jQuery.isEmptyObject(this[key])){
		return this[key];
	} else {
		return key;
	}
}
userNames.creaves = "Chris Reaves";
userNames.cmccrank = "Christopher McCrank";
userNames.cyuen = "Christopher Yuen";
userNames.ddiaz = "Daniella Diaz";
userNames.dchav = "Dara Chav";
userNames.ddistenfield = "David Distenfield";
userNames.ddave = "Desktop Dave";
userNames.dharloff = "Don Harloff";
userNames.edeocampo = "Edward Deocampo";
userNames.eguliyev = "Emin Guliyev";
userNames.eyap = "Emmanuel Yap";
userNames.enimako = "Evans Nimako";
userNames.esteven = "Even Steven";
userNames.fdelgado = "Felix Delgado";
userNames.gturner = "Geoffrey Turner";
userNames.gbrokaw = "George Brokaw";
userNames.jperez = "Jennifer Perez";
userNames.jlove = "Jerry Love";
userNames.jjoseph = "Jins Joseph";
userNames.jniles = "Joanna Niles";
userNames.jhong = "Jonathan Hong";
userNames.jreinmann = "Josh Reinmann";
userNames.jli = "Jun Li";
userNames.kchahine = "Kamal Chahine";
userNames.kbrown = "Kate Brown";
userNames.kchiang = "Keith Chiang";
userNames.koleary = "Kirsten O'Leary";
userNames.kzimmerman = "Kris Zimmerman";
userNames.lpenney = "Lauren Penney";
userNames.lsauchelli = "Lorenzo Sauchelli";
userNames.lhazan = "Lynn Hazan";
userNames.mkalmenson = "Matt Kalmenson";
userNames.mshinwari = "Mehtab Shinwari";
userNames.malcaide = "Michael Alcaide";
userNames.mmagil = "Michael Magil";
userNames.ntesla = "Nikola Tesla";
userNames.pkeane = "Patrick Keane";
userNames.pbogo = "Pavel Bogomolyni";
userNames.pma = "Peter Ma";
userNames.pmakeyev = "Peter Makeyev";
userNames.rrosansky = "Ron Rosansky";
userNames.sdooley = "Shawn Dooley";
userNames.sweisberg = "Stephanie Weisberg";
userNames.smcgoff =  "Steven McGoff";
userNames.sperez = "Suehaily Perez";
userNames.tearley = "Thomas Earley";
userNames.treaves = "Timothy Reaves";
userNames.tbamert = "Tom Bamert";
userNames.vkumar = "Vishvas Kumar";
userNames.vhrabrov = "Vladimir Hrabrov";
userNames.wpowers = "Will Powers";
userNames.tbaum = "Todd Baum";
userNames.bhardy = "Bernard Hardy";
userNames.irodriguez = "Ignacio Rodriguez";
userNames.lhornyak = "Lindsay Hornyak";
userNames.lnovak = "Luke Novak";
userNames.ksteuber = "Kathy Steuber";
userNames.eamir = "Eran Amir";
userNames.dgalati = "David Galati";
userNames.kbastart = "Kalib Bastart";
userNames.aamato = "Ariel Amato";
userNames.bmancuso = "Bob Mancuso";
userNames.mbrolio = "Mariano Brolio";
userNames.drodriguez = "Daniel Pagan";
userNames.jmchugh = "Jeffrey McHugh";
userNames.lherrero = "Leonardo Herrero";
userNames.scolussi = "Sergio Colussi";



//Shows a modal window with the chosen message. Can choose different types of messages: default, primary, success,info,warning y danger.
var bootAlert = function (text, type ) {
	if ( !type) {
		type = 'primary';
	}
	$html = $('<div class="modal fade alertDialog"><div class="modal-dialog"><div class="modal-content panel-'+ type +'"><div class="modal-body panel-heading"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + text + '</h4></div><div class="modal-footer"><button type="button" class="btn btn-'+type+'" data-dismiss="modal">OK</button></div></div></div></div>');
	$html.on('hidden.bs.modal', function (e) {
		$html.remove();
	});
	return $html.modal();
}

var isLoading = function (){
	$('#loading').fadeIn();
}
var noLoading = function () {
	$('#loading').fadeOut();
}

var imgURL = location.protocol+'//' + location.hostname + (location.port ? ':' + location.port : '') + "/photos/";

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

//Each user should look like this: username, name, lastname, status, number, email
var users = { };
users.list = getFromLocal('userlist');
users.add = function (userkey, user) {
    this.list[userkey] = user;
}
users.update = function (userkey, key, value) {
    if (this.list[userkey]) {
        this.list[userkey][key] = value
    }
}


var currentUser = getFromLocal('userInfo');
currentUser.status = 'available';

var client;
var chatLogin = function (username, password, userinput) {
	try {
		isLoading();
		currentUser.username = username;
		currentUser.password = password;
		addToLocal('userInfo', currentUser);

		//specify the BOSH url, and the success and error callback functions that will be passed to the connect method
		var arg = {
			httpBindingURL: jabberConfig.httpBindingURL,
			successCallback: function success() {
				console.log('connection successful');
				if (userinput){ bootAlert('Connection successful'); }
				$('#userName').text(username);
				$('#loggedOut').hide();
				$('#loggedIn').show();
				noLoading();
				this; //The client
			},
			errorCallback: function (err) {
				var tstr = jabberwerx.util.serializeXML(err);
				jabberwerx.util.debug.warn(tstr);
				console.warn('Could not connect: ' + tstr);
				if (userinput){ bootAlert("Could not connect: " + tstr, 'danger') };
				noLoading();
				$('#loggedOut').show();
				$('#loggedIn').hide();
			}
		}
		//connect to server using username, password and arguments specified above
		return client.connect(username + "@" + jabberConfig.domain, password, arg);
	} catch (ex) {
		jabberwerx.util.debug.warn(ex.message);
		console.log('error, could not connect: ' + ex.message);
		console.log('error logging in user ' + username);
		if (userinput){ bootAlert('Error logging in user ' + username, 'danger') };
		noLoading();
		$('#loggedOut').show();
		$('#loggedIn').hide();
	}
}

var chatLogOut = function () {
	$('#loggedOut').show();
	$('#loggedIn').hide();
	deleteFromLocal('userInfo');
	client.disconnect();
}

var roster;
var rosterList = { 'connected': {}, 'disconnected': {}, 'users':{} };
var listPeople = $('#listPeople');

//Get all necessary data for user
var setUpUser = function (key, status, email) {
	if (!users.list[key]) {
        var user = { 'username': key, 'preferredname': false, 'status': status, 'number': false, 'email': email };
        users.add(key, user);
        addToLocal('userlist', users.list);
    }
}

//states for user status.
var states = {
    offline: ['grey', 'Offline', 'status_offline'],
    donotdisturb: ['red', 'Do not disturb', 'status_dnd'],
    available: ['green', 'Available', 'status_online'],
    away: ['yellow', 'Away', 'status_away']
}
var statuses = {'available': 'status-online', 'away':'status-unavailable', 'donotdisturb':'status-busy', 'offline':'status-offline'};

var createUser = function (username, status, email) {
	var online = status != 'offline' ? 'user_online' : 'user_offline';
	var user = users.list[username];

	//If the user is empty, there was an error, we won't do anything else here, but will log the error.
	if (jQuery.isEmptyObject(user)) {
        console.error('empty user');
        return false;
    }


	var state = states[status];



	var html = '<li class="clearfix list-group-item user_contact ' + state[2] + '" id="usercontact_' + username + '" data-user="' + username + '" data-state="' + user.status + '" class="user_contact ' + online + '" data-number="' + user.number + '"> \
		<div class="description col-sm-9"> \
			<span class="state glyphicon glyphicon-user"></span> \
			<b>' + userNames.getName(username) + '</b> \
		</div> \
		<div class="actions  col-sm-3"> \
			<a target="_blank" href="mailto:' + user.email + '" class="email glyphicon glyphicon-envelope"></a> \
			<a href="xmpp:'+ user.email + '" class="message glyphicon glyphicon-comment"></a>\
		</div> \
	</li>';
    return jQuery(html);

}


//Function to be executed when presence information is received.
var onPresenceReceived = function (event) {
    var entity;
    var presence = event.data;
    var type = presence.getType();
    var show = presence.getShow();
    var state;
    console.log('JID');
    console.log(presence.getFromJID().getNode());
    console.log('type: ' + type);
    console.log('show: ' + show);
    //if (!type || type == 'unavailable') {
	key = presence.getFromJID().getNode();
    var bareJidStr = presence.getFromJID().getBareJIDString();
    if (bareJidStr && bareJidStr != client.connectedUser.jid.getBareJIDString()) {


        if (type && type == 'unavailable') {
            // If the type of the presence stanza is unavailabe then we want
            // to remove the corresponding entity presence property (if the
            // entity for the bare jid exists)
            entity = client.entitySet.entity(bareJidStr);
            if (entity) {
                entity.updatePresence(presence);
            } else {
				entity = client._findOrCreateEntity(bareJidStr);
			}
            console.log('Disconnected:' + bareJidStr);
            rosterList.disconnected[key] = entity;
            delete rosterList.connected[key];

			if (users.list[key]) {
				users.list[key].status = 'offline';
			}

            var user = jQuery('#usercontact_' + key, listPeople);
            if (user.length > 0) {
                user.attr('data-state', 'offline').removeClass('status_offline status_online status_away status_dnd').addClass('status_offline');
				jQuery('#unavailableUsers', listPeople).append(user);
            } else {
                setUpUser(key, 'offline', bareJidStr);
				jQuery('#unavailableUsers', listPeople).append(createUser(key, 'offline', bareJidStr));
            }
            jQuery("#chatContainer .chat_with_" + key)
                .removeClass('status_online', 'status_away', 'status_dnd')
                .addClass('status_offline')
                .find('header .state .text').text('Offline');

        } else {

            entity = client._findOrCreateEntity(bareJidStr);
            rosterList.connected[key] = entity;
            delete rosterList.disconnected[key];

            var statename = 'available';
            switch (show) {
                case 'away':
                    statename = 'away'
                    break;
                case 'dnd':
                case 'xa':
                    statename = 'donotdisturb';
                    break;
                case '':
                case 'chat':
                default:
                    statename = 'available';
                    break;
            }

            state = states[statename];

            var user = jQuery('#usercontact_' + key, listPeople);
            if (user.length > 0) {
                user.attr('data-state', 'available').removeClass('status_offline status_online status_away status_dnd').addClass(state[2]).find('.state .text').text(state[1]);
				jQuery('#availableUsers', listPeople).append(user);
            } else {
                setUpUser(key, state[1], bareJidStr);
                jQuery('#availableUsers', listPeople).append(createUser(key, statename, bareJidStr));
            }
			if ( !jQuery.isEmptyObject(users.list[key])) {
				users.list[key].status = statename;
			}
            jQuery("#chatContainer .chat_with_" + key)
                .removeClass('user_offline user_online user_away user_dnd')
                .addClass(state[2])
                .find('header .state .text').text(state[1]);
        }

		rosterList.users[key] = entity;
		console.log(key + ' entity: ' + entity);
    }
}
var onPresenceReceivedChat = function (event) {
	var presence = event.data;
	var type = presence.getType();
    var show = presence.getShow();
	var bareJidStr = presence.getFromJID().getBareJIDString();
    if (bareJidStr && bareJidStr != client.connectedUser.jid.getBareJIDString()) {
		var key = presence.getFromJID().getNode();
		if ( chatWith == key ) {
			var doChange = false;
			if (type && type == 'unavailable') {
				if (users.list[key]) {
					users.list[key].status = 'offline';
					doChange = true;
				}
			} else {
				var statename = 'available';
				switch (show) {
					case 'away':
						statename = 'away'
						break;
					case 'dnd':
					case 'xa':
						statename = 'donotdisturb';
						break;
					case '':
					case 'chat':
					default:
						statename = 'available';
						break;
				}
				if ( users.list[key].status != statename ) {
					doChange = true;
				}
				users.list[key].status = statename;
			}
			if ( doChange ) {
				messageList.find('li.counterpart figure').attr('class', '').addClass(statuses[statename]);
			}
		}
	} else {
		var statename = 'available';
		switch (show) {
			case 'away':
				statename = 'away'
				break;
			case 'dnd':
			case 'xa':
				statename = 'donotdisturb';
				break;
			case '':
			case 'chat':
			default:
				statename = 'available';
				break;
		}
		if ( currentUser.status != statename ) {
			currentUser.status = statename;
			messageList.find('li.me figure').attr('class', '').addClass(statuses[statename]);
		}
	}
}


var chatLogs = {};
var chatWith;
var openChatWindows = function () {
	var ocw = getFromLocal('openChatWindows');
	if ( jQuery.isEmptyObject(ocw)){
		return [];
	}
	return ocw;
};



var createChatWindow = function (user) {
	var openWindows = openChatWindows();
	if (  $.inArray(user.username, openWindows) == -1 ) {
		openWindows.push(user.username);
		addToLocal('openChatWindows', openWindows);
		window.open('chat.html?user=' + user.username, user.username, "height=480,width=400");
	}
}
var closeChatWindow = function (e) {
	e.preventDefault();
	var openWindows = openChatWindows();
	var index = $.inArray(chatWith, openWindows);
	openWindows.splice(index,1);
	addToLocal('openChatWindows', openWindows);
}
var chatContent = $('#chatContent');
var messageList = $('#messageList', chatContent);

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
	var $html = $('<li class="hidden chat-item '+who+'">\
		<figure class="'+ status +'">\
			<img src="' + img + '" alt="" />\
			<div class="cover"></div>\
		</figure>\
		<div class="chat-item-content">\
			<p>'+ message +'</p>\
			<time class="chat-item-datetime mf-ui-light" datetime="'+ datetime +'">' + showtime + '</time>    \
		</div>\
	</li>');
	$html.find('figure img').error ( function () {
		$(this).unbind("error").attr("src", altimg);
	});
	$html.appendTo(messageList).fadeIn();
	chatContent.stop().animate({ scrollTop: messageList.height() }, 500);


}

var logMessage = function (from, user, message, time) {
	console.log('logging message: ' + message);
	var saved = chatLogs[user];
	var local = getFromLocal('chat-log-' + user);

	if (from == currentUser.username) {
		status = currentUser.status;
	} else {
		if ( users.list[from] ) {
			status = users.list[from].status;
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
	//var log = getFromLocal(key);
	//log.push(msg);
	addToLocal(key, chatLogs[user]);

	putMessage(from, user, message, time, status);

}
var messageReceived = function (evt) {
	var message = evt.data;
	var body = message.getBody();
	if (body) {
		var sender = message.getFromJID().getNode();
		//var chatWindow = createChatWindow(users.list[sender]);
		//var chatWindow = jq191('.chat_with_'+sender);
		console.log('message from ' + sender + ': ' + body);
		logMessage(sender, sender, body, new Date());
		createChatWindow(users.list[sender]);
	}
}

var messageReceivedChat = function (evt) {
	console.log(evt);
	var message = evt.data;
	var body = message.getBody();
	var sender = message.getFromJID().getNode();
	if (body && sender == chatWith) {
		console.log('message from ' + sender + ': ' + body);
		logMessage(chatWith, chatWith, body, new Date());
	}
}
var sendMessage = function (text){
	try {
		var jid = jabberwerx.JID.asJID(chatWith);
		console.log(jid);
		if (!jid.getNode() && !jid.getResource()) {
			jid = jabberwerx.JID.asJID(jid.toString() + '@' + jabberConfig.domain + '/' + client.resourceName);
		}
		//send message
		client.sendMessage(jid.toString(), text);
		console.log('message to ' + jid + ': ' + text);
		var from = client.connectedUser.jid.getBareJID().getNode();
		logMessage( from, chatWith, text, new Date() );

	} catch (ex) {
		jabberwerx.util.debug.warn("This is not a valid JID or node");
	}
}

var buildMessagesFromLocal = function () {
	var key = 'chat-log-' + chatWith;
	var log = getFromLocal(key);
	var len = log.length;

	for ( var i = 0; i < len; i++ ) {
		if (log[i][0] == chatWith) {
			var currentStatus;
			try {
				currentStatus = users.list[chatWith].status;
			} catch (e){
				currentStatus = 'offline';
				console.error("Couldn't get actual presence from user, setting it to offline");
				console.error(e);
			}

			putMessage(chatWith, chatWith, log[i][1], new Date(log[i][2]), currentStatus);
		} else {
			putMessage(currentUser.username, chatWith, log[i][1], new Date(log[i][2]), currentUser.status);
		}
	}
}


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
var _handleSubReceive = function (evt) {
        console.log('handleSubReceive');
        var contact = evt.data.stanza.getFromJID();
        console.log(contact);
        // Handled
        return true;
    }
var _connected = function (evt) {
	if (!roster) {
		roster = client.controllers.roster || new jabberwerx.RosterController(client);
		roster.autoaccept_in_domain = true;
		roster.event('subscriptionReceived').bindWhen(function (data) {
			console.log('subscriptionReceived :' + data);
			if (!data.handled) {
				return data;
			} else {
				return false;
			}
		}, _handleSubReceive);
		roster.event("rosterFetched").bind(function (evt) {
			console.log('rosterFetched');
			console.log(evt);
			console.log(client.entitySet.toArray());
			// no special event data
			// walk client.entitySet to process...
		});

	}
}

jabberwerx.$(document).ready(function() {
	var randomID = Math.random().toString(36).substring(7);
	client = new jabberwerx.Client('Akkadian' + randomID);
	client.event("clientStatusChanged").bind(_connected);

	//If it's the main window, we lo
	if ( 'mainWindow' == jQuery('body').attr('id') ) {
		jabberwerx.globalEvents.bind("presenceReceived", onPresenceReceived);

		$('#loginForm').on('submit', function(e) {
			e.preventDefault();
			$('#loginModal').modal('hide');
			var loginUser = $('#loginUser').val();
			var loginPassword = $('#loginPassword').val();

			chatLogin(loginUser, loginPassword, true);
		});

		$('#logOutBtn').on('click', function(e) {
			chatLogOut();
		});
		var chatType = 'browserChat';

		listPeople.on('click', '.message', function (e) {
			if ('browserChat' == chatType) {
				e.preventDefault();
				var username = jQuery(this).parents('.user_contact').attr('data-user');
				var user = users.list[username];
				console.log('messaging: ' + username);
				console.log(user);
				createChatWindow(user);
			}
		});
		client.event("messageReceived").bind(messageReceived);
		$('#loggedIn .availability .btn-success').on('click',function(e){
			try {
				client.sendPresence('chat', 'chat');
			} catch ( e ) {
				console.error(e);
			}
			$('#loggedUserInfo').removeClass('btn-success btn-warning btn-danger').addClass('btn-success');
			currentUser.status = 'available';
		});
		$('#loggedIn .availability .btn-warning').on('click',function(e){
			try {
				client.sendPresence('away', 'away');
			} catch ( e ) {
				console.error(e);
			}
			$('#loggedUserInfo').removeClass('btn-success btn-warning btn-danger').addClass('btn-warning');
			currentUser.status = 'away';
		});
		$('#loggedIn .availability .btn-danger').on('click',function(e){
			try {
				client.sendPresence('dnd', 'dnd');
			} catch ( e ) {
				console.error(e);
			}
			$('#loggedUserInfo').removeClass('btn-success btn-warning btn-danger').addClass('btn-danger');
			currentUser.status = 'donotdisturb';

		});


	} else {
		jabberwerx.globalEvents.bind("presenceReceived", onPresenceReceivedChat);

		chatWith = getParameterByName('user');


		$('#chat>header strong').text(userNames.getName(chatWith));

		var date = getDate();
		$('#startime').attr('datetime', date[0]).text(date[1]);
		client.event("messageReceived").bind(messageReceivedChat);
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

		var openWindows = openChatWindows();
		if (  $.inArray(chatWith, openWindows) == -1 ) {
			openWindows.push(chatWith);
			addToLocal('openChatWindows', openWindows);
		}
		jQuery(window).on('unload', closeChatWindow);

		buildMessagesFromLocal();


	}
	chatLogin(currentUser.username, currentUser.password, false);


});