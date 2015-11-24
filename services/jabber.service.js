JWA = {};

angular.module('jabber.service', [])

.factory('JabberService', function ($rootScope, AuthenticationService, PathService) {
	var jabberService = this;

	this.connect = function(user, password){
		window.mXmppApp = new JWA.Application();
		mXmppApp.connect(user, password);
	}

	this.connectFromSettings = function(user, password, loginFromSettings){
		mXmppApp.connect(user, password, loginFromSettings);
	}

	this.disconnect = function(){
		mXmppApp.disconnect();
	}

	this.offline = function(){
		mXmppApp.offline();
	}

	this.startChatSession = function(contact){}

	this.deleteContact = function(contact){
		mXmppApp.rosterController.deleteContact(contact.email);
		return;
	}

	this.sendPresence = function (show, status) {
		console.log('jabberService.sendPresence(show = ' + show + ' | status = ' + status + ')');
		mXmppApp.client.sendPresence(show, status);
	}

	this.getPrimaryPresenceForEntity = function (jid) {
		console.log('jabberService.getPrimaryPresenceForEntity(jid = ' + jid + ')');
		return mXmppApp.client.getPrimaryPresenceForEntity(jid);
	}

	this.addContact = function (jid, nickname, groups, callback) {
		//mXmppApp.rosterController.addContact(jid, nickname, groups, callback);
		mXmppApp.rosterController._updateContact(jid, nickname, groups, callback, true);

	}

	this.updateContact = function(jid, nickname, groups, callback)
	{
		mXmppApp.rosterController.updateContact(jid, nickname, groups, callback);
	}

	this.getContacts = function(user,password, jid){
		window.mXmppApp = new JWA.Application();
		mXmppApp.connect(user, password);
		mXmppApp.getContacts();
	}

	this.quickContact = function (jid){
		mXmppApp.client.controllers.quickContact.subscribe(jid);
	}

	this.getAllGroups = function () {
		return mXmppApp.client.entitySet.getAllGroups();
	}

	this.renameContactsGroup = function(oldGroupName, newGroupName, contacts){
		var contactGroups = [];
		for (var i = 0; i < contacts.length; i++) {
			contactGroups = contacts[i].getGroups();
			for (var j = 0; j < contactGroups.length; j++) {
				if(contactGroups[j] == oldGroupName){
					contactGroups[j] = newGroupName;
				}
			};
			contacts[i].setGroups(contactGroups);
		};
	}

	this.removeGroupFromContacts = function(groupName, contacts){
		var contactGroups = [];
		for (var i = 0; i < contacts.length; i++) {
			contactGroups = contacts[i].getGroups();
			console.log(contactGroups);
			for (var j = 0; j < contactGroups.length; j++) {
				if(contactGroups[j] == groupName){
					contactGroups.splice(j, 1);
				}
			};
			console.log(contactGroups);
			contacts[i].setGroups(contactGroups);
		};
	}

	this.enableReceibePresence = function(){
		allowReceiveContactsPresence = true;
	}

	var getSendMessage = function () {
		var data = event.data;
		if ( typeof data.type != 'undefined' &&
				data.type == 'sendchat' ) {
			//$rootScope.$broadcast('jabberGetSendMessage', data.chat);
			var jid,
			valid = true;
			try {
				jid = jabberwerx.JID.asJID(data.chat.user);
			} catch (e) {
				valid = false;
				jabberwerx.util.debug.warn("This is not a valid JID or node");
				jabberwerx.util.debug.warn(data.chat);
			}

			if ( valid ) {
                var t = new Date().getTime();
				mXmppApp.client.sendMessage(jid.toString(), data.chat.message,t, "chat");
				console.log('message to ' + jid + ': ' + data.chat.message);
			}

			//sendMessage (data.chat.user, data.chat.message, data.chat.time);
		}
		else if(typeof data.type != 'undefined' && data.type == 'presence'){
			var data = event.data;
			var presence = mXmppApp.client.getPrimaryPresenceForEntity(data.jid);
			if(presence == null)
			{
				mXmppApp.client.controllers.quickContact.subscribe(data.jid);
			}
			$rootScope.$broadcast('groupChatPresence', data);
		}
		else if(typeof data.type != 'undefined' && data.type == 'call_from_chat'){
			var data = event.data;
			$rootScope.$broadcast('callFromChat', data);
		}
		else if(typeof data.type != 'undefined' && data.type == 'groupchatInvite'){
			var data = event.data;
			var chatRoomJid = data.key;

			var room = mXmppApp.mucController.room(chatRoomJid);

			var enterRoomArgs = { errorCallback: function(err, aborted){
				console.log('Error entering room: ' + err.message);
				room.destroy();
				room = null;
			} };

			try {
				if(room != null && room.me == null) {
					room.enter(mXmppApp.client.connectedUser.jid.getNode(), enterRoomArgs);
					//mXmppApp.client.controllers.quickContact.subscribe(room.jid);
				}
			} catch(ex) {
				console.log("The following error occurred while attempting to enter the room: " + ex.message);
			}

			if(room != null) {
				//console.log(room);
				if(room.isActive()) {
					room.invite(data.jid);
				}
				$rootScope.$broadcast('updateMUCRoom', room);
			}
		}
		else if(typeof data.type != 'undefined' && data.type == 'groupchat'){
			var data = event.data;
			var chatRoomJid = data.chat.user;

			var room = mXmppApp.mucController.room(chatRoomJid);

			if(room != null && room.isActive()) {
				try {
					room.sendBroadcast(data.chat.message);
					//$rootScope.$broadcast('updateMUCRoom', room);
				} catch(ex) {
					console.log("The following error occurred while attempting to send a message to the room: " + ex.message);
				}
			}
		}
	}


	window.addEventListener("message", getSendMessage, false);

	var allowChangeMyPresence = true;
	var allowReceiveContactsPresence = false;

	// XMPP Plugin ****************************************

	//TODO: fetch roster is broken, the JIDs are already in the entity set ....
	//TODO: sometimes the roster is not showing up in the HTML
	JWA.Application = jabberwerx.JWModel.extend({

		/**
		 * Creates a client, user and server objects.
		 * Registers for important events
		 */
		init: function() {
			this._super();
			this.reconnected = false;
			// create a new Client object for this resource
			jabberwerx._config.httpBindingURL = PathService.getJabberHost();
			this.client = new jabberwerx.Client('sampleclient' + Math.random().toString(36).substring(7));
			// create a new instance of the RosterController
			this.mucController = new jabberwerx.MUCController(this.client);
			this.rosterController = this.client.controllers.roster || new jabberwerx.RosterController(this.client);
			this.quickcontactController = this.client.controllers.quickContact || new jabberwerx.cisco.QuickContactController(this.client);
			var rosterController = this.rosterController;
			rosterController.autoaccept = jabberwerx.RosterController.AUTOACCEPT_ALWAYS;
			//this.offline = false;
			// TODO: complete this
			// register callbacks for events
			with (this.client) {
				event("clientStatusChanged").bind(this.invocation("onStatusChanged"));
			}

			jabberwerx.globalEvents.bind("discoInitialized", this.invocation("onDiscoInit"));
			jabberwerx.globalEvents.bind("batchUpdateStarted", this.invocation("onBatchStarted"));
			jabberwerx.globalEvents.bind("batchUpdateEnded", this.invocation("onBatchEnded"));
			jabberwerx.globalEvents.bind("entityCreated", this.invocation("onEntityAdded"));

			jabberwerx.globalEvents.bind("entityDestroyed", this.invocation("onEntityDestroyed"));
			jabberwerx.globalEvents.bind("entityUpdated", this.invocation("onEntityUpdated"));
			jabberwerx.globalEvents.bind("entityRenamed", this.invocation("onEntityRenamed"));
			jabberwerx.globalEvents.bind("messageReceived", this.invocation("onMessageReceived"));
			jabberwerx.globalEvents.bindWhen("presenceReceived", ":not([type]),[type=unavailable]", this.invocation("onPresenceReceived"));
			jabberwerx.globalEvents.bind("primaryPresenceChanged", this.invocation("onPrimaryPresenceUpdated"));
			jabberwerx.globalEvents.bind("resourcePresenceChanged", this.invocation("onResourcePresenceUpdated"));
			jabberwerx.globalEvents.bind("beforeIqReceived", this.invocation("_handleStanzaReceived"));
			jabberwerx.globalEvents.bind("beforeMessageReceived", this.invocation("_handleStanzaReceived"));
			jabberwerx.globalEvents.bind("beforePresenceReceived", this.invocation("_handleStanzaReceived"));
			jabberwerx.globalEvents.bind("iqSent", this.invocation("_handleStanzaSent"));
			jabberwerx.globalEvents.bind("messageSent", this.invocation("_handleStanzaSent"));
			jabberwerx.globalEvents.bind("presenceSent", this.invocation("_handleStanzaSent"));
			jabberwerx.globalEvents.bind("roomEntered", this.invocation("onMUCRoom"));
			jabberwerx.globalEvents.bind("roomExited", this.invocation("onMUCRoom"));
			jabberwerx.globalEvents.bind("roomBroadcastReceived", this.invocation("onMUCRoom"));
			jabberwerx.globalEvents.bind("roomSubjectChanged", this.invocation("onMUCRoom"));
			jabberwerx.globalEvents.bind("errorEncountered", this.invocation("onErrorEncountered"));
		},

		/**
		 * Connect a user to the BOSH service
		 */
		connect: function(user, password, loginFromSettings) {
			var self = this;

			// Setup username and password
			if (!user||!password) {
				console.log("*********no jabber account info passed");
				return;
			}

			var currentDomain = PathService.getJabberDomain();

			// check if the user has a domain
			this.username = (user.indexOf('@') >= 0) ? user : user + '@' + currentDomain;
			this.password = password;

			var jabberConfig = {
				domain: currentDomain, //the domain specified for your CUP server
				httpBindingURL: PathService.getJabberHost(), //the BOSH url for your server
				// there isn't secundary
				httpBindingURL_secondary: PathService.getJabberHost(), //the BOSH url for your server
				unsecureAllowed: true //unsecureAllowed should be true if plaintext authentication is allowed over unencrypted or unsecured HTTP channels
			};

			jabberwerx._config.unsecureAllowed = jabberConfig.unsecureAllowed;

			var arg = {
				httpBindingURL: jabberConfig.httpBindingURL,
				successCallback: function success() {
					console.log("Client Jabber: connection successful");
					self.getContacts();
					$rootScope.$broadcast('jabberSuccessConnected', this);
					if(self.reconnected){
						self.reconnected = false;
					}
				},
				errorCallback:  function(err) {
					var tstr = jabberwerx.util.serializeXML(err);
					jabberwerx.util.debug.warn(tstr);
					console.log("Client Jabber: could not connect: " + tstr);
					$rootScope.$broadcast('jabberConnectionError', 'Could not connect to jabber.');

				}
			};

			console.log('connecting to jabber');
			console.log(jabberConfig);
			this.client.connect(this.username, this.password, arg);
		},

		getContacts: function(){
			this.client.entitySet.each(function(entity) {
				//check the entities type, allow only jabberwerx.Contact
				if (entity instanceof jabberwerx.Contact) {
					// do something, like show the contact in a user interface
					console.log(entity.displayName);
					console.log(entity.groups);
				}
			});

			/*this.client.entitySet.event("entityCreated").bind(function(evt) {
				console.log('entityCreated llega bien');
			});

			this.client.entitySet.event("entityUpdated").bind(function(evt) {
				console.log('entityUpdated llega bien');
			});*/
		},

		/**
		 * Disconnect a user to the BOSH service
		 */
		disconnect: function() {
			this.client.disconnect();
			$rootScope.$broadcast('jabberDisconnect', 'Could not connect to jabber' );
		},

		/**
		 * Set everything offline
		 */
		offline: function() {
			this.reconnected = true;
			this.client.disconnect();
			$rootScope.$broadcast('jabberOffline');
		},

		addRosterItem: function(contact) {
			// get the contact nickname
			var displayName = contact.getDisplayName();
			if ( 'from' == contact.properties.subscription ) {
				console.log("User " + displayName + " is not on my roster, but I'm on theirs");
				console.log(contact);
				return false;
			}
			// create a list of groups which the contacts belong to
			var groups = jabberwerx.$.map(contact.getGroups(), function(group) {
				return "[" + group + "]";
			}).join(" ");

			// get the subscription/ask attributes
			var subscr = contact.properties.subscription || "";
			var ask = contact.properties.ask || "";
			var tsub = contact.properties.temp_sub;

			// update the roster HTML UI with the contact details
			var id = "roster_item_" + contact._guid;
			//jabberwerx.util.debug.log("updating UI for " + id);

			// Attach info to object
			contact.displayName = displayName;
			contact.id = id;
			contact.groups = groups;
			contact.subscr = subscr;
			contact.ask = ask;
			contact.tsub = tsub;
			if ( 'undefined' == typeof contact.status ) {
				contact.status = "unavailable";
				contact.statusShow = "Unavailable";
			}

			contact.email = contact.jid.getBareJIDString();
			contact.username = contact.jid.getNode();

			//console.log('addRosterItem: contact.username -> ' + contact.username + ' | contact.displayName -> ' + contact.displayName);
			//console.log(contact.getPrimaryPresence());

			$rootScope.$broadcast('jabberAddedContactItem', contact);
		},

		/**
		 * Handle a roster update event to update the HTML UI to display the contact details
		 *
		 * @param {jabberwerx.Contact} contact The updated contact in the roster
		 */
		updateRosterItem: function(contact) {

			// get the contact nickname
			var displayName = contact.getDisplayName();

			// create a list of groups which the contacts belong to
			var groups = jabberwerx.$.map(contact.getGroups(), function(group) {
				return "[" + group + "]";
			}).join(" ");

			// get the subscription/ask attributes
			var subscr = contact.properties.subscription || "";
			var ask = contact.properties.ask || "";
			var tsub = contact.properties.temp_sub;

			// update the roster HTML UI with the contact details
			var id = "roster_item_" + contact._guid;
			//jabberwerx.util.debug.log("updating UI for " + id);

			// Attach info to object
			contact.displayName = displayName;
			contact.id = id;
			contact.groups = groups;
			contact.subscr = subscr;
			contact.ask = ask;
			contact.tsub = tsub;
			if ('undefined' == typeof contact.status) {
				contact.status = "unavailable";
				contact.statusShow = "Unavailable";
			}

			contact.email = contact.jid.getBareJIDString();
			contact.username = contact.jid.getNode();

			console.log('updateRosterItem: contact.username -> ' + contact.username + ' | contact.displayName -> ' + contact.displayName);
			console.log(contact.getPrimaryPresence());

			//$rootScope.$broadcast('jabberAddedContactItem', contact);
		},

		/**
		 * Set the status to offline
		 *
		 * @param {jabberwerx.Contact} contact The updated contact in the roster
		 */
		updateOfflineRosterItem: function(contact) {
			contact.status = "offline";
			contact.statusShow = "Offline";
			//$rootScope.$broadcast('jabberRemovedContactItem', contact);
		},

		/**
		 * Handle a roster item deleted event to update the HTML UI
		 *
		 * @param {jabberwerx.Contact} contact The deleted contact in the roster
		 */
		removeRosterItem: function(contact) {
			// get the jid of the deleted contact
			var jid = contact.jid;
			// update the roster HTML UI by removing the contact
			var id = "roster_item_" + contact._guid;
			jabberwerx.util.debug.log("removing UI for " + id);
			//jabberwerx.$(".roster #roster-list").find("#" + id).remove();
			$rootScope.$broadcast('jabberRemovedContactItem', contact);
		},

		addMUCRoom: function(room) {
			var jid = room.jid.toString();
			var name = room.getDisplayName();
			$rootScope.$broadcast('addMUCRoom', room);
		},

		updateMUCRoom: function(room) {
			var jid = room.jid.toString();
			var name = room.getDisplayName();

			var subject = room.properties.subject;

			var groups = jabberwerx.$.map(room.getGroups(), function(group) {
				return "[" + group + "]";
			}).join(" ");

			var id = "muc_room_" + room._guid;
			var item = jabberwerx.$("#" + id);
			if (item.length == 0) {
				var that = this;

				item = jabberwerx.$(".muc #muc-room-item .muc-room").clone();
				item.attr("id", id);
				item.appendTo(".muc #muc-room-list");

				var that = this;
				item.find(".actions #enter-muc-room").bind("click", function() {
					var nick = window.prompt(
						"Type your nickname",
						that.client.connectedUser.jid.getNode());

					room.enter(nick);
				});
				item.find(".actions #delete-muc-room").bind("click", function() {
					room.remove();
				});
				item.find(".actions #change-nick").bind("click", function() {
					var nick = room.me.getNickname();
					nick = prompt("Enter new nickname:", nick);
					if (nick && nick != room.me.getNickname()) {
						room.changeNickname(nick);
					}
				});
				item.find(".actions #change-subject").bind("click", function() {
					var subject = room.properties.subject;
					subject = prompt("Enter the new room subject:", subject);
					if (subject != null) {
						room.changeSubject(subject);
					}
				});
				item.find(".actions #send-broadcast").bind("click", function() {
					var bcast = prompt("Enter the message to broadcast to " + room.jid);
					if (bcast != null) {
						room.sendBroadcast(bcast);
					}
				});
			}
			item.children(".jid").text(jid);
			item.children(".name").text(name || "\u00a0");
			item.children(".groups").text(groups || "\u00a0");
			item.children(".props").text((subject && subject) || "\u00a0");

			$rootScope.$broadcast('updateMUCRoom', room);
		},
		removeMUCRoom: function(room) {
			var id = "muc_room_" + room._guid;
			jabberwerx.$(".muc #muc-room-list").find("#" + id).remove();
		},

		/**
		 * Start a chat session
		 *
		 * @param {jabberwerx.jid} jid The jid to start a chat with
		 */
		startChat: function(jid) {
			// create a new instance of ChatController
			var chatController = new jabberwerx.ChatController(this.client);
			return chatController.openSession(jid);
		},

		/**
		 * Send a chat message as part of a chat session
		 *
		 * @param {jabberwerx.ChatSession} chatSession The active chat session
		 * @param {String} message The message to send
		 */
		sendChatMessage: function(chatSession, message) {
			chatSession.sendMessage(message);
		},

		/**
		 * Handle the user's status changed event to update the UI
		 *
		 * @param {jabberwerx.EventNotifier} event The status changed event
		 */
		onStatusChanged: function(event) {

			console.log('onStatusChanged');
			//console.log(event);

			// get the associated jabberwerx.Client object
			var client = event.source;

			// get the previous and next status values
			var prev = client.getClientStatusString(event.data.previous);
			var next = client.getClientStatusString(event.data.next);

			if (event.data.error) {
				// report error!
				log("client", "ERROR!! " + event.data.error.xml);
			}
			// update the console HTML UI with the status update
			log("client", "status " + prev + " ===> " + next);
		},

		onDiscoInit: function(event) {
			log("disco", "disco initialized!");
		},
		onBatchStarted: function(event) {
			this._bstarted = new Date();
			log("entity", "Entity cache batch update started");

			jabberwerx.globalEvents.unbind("entityCreated", this.invocation("onEntityAdded"));
			jabberwerx.globalEvents.unbind("entityDestroyed", this.invocation("onEntityDestroyed"));
			jabberwerx.globalEvents.unbind("entityUpdated", this.invocation("onEntityUpdated"));
			jabberwerx.globalEvents.unbind("entityRenamed", this.invocation("onEntityRenamed"));
		},
		onBatchEnded: function(event) {
			log("entity", "Entity cache batch update completed in " +
				(new Date() - this._bstarted) + "ms with " +
				event.data.length + " events.");
			delete this._bstarted;
			//walk event data array and fire appropriate event handlers
			var events = event.data;

			for (var i = 0; i < events.length; ++i) {
				var evtObj =
					new jabberwerx.EventObject(this.client.entitySet.event(events[i].name),
						events[i].data);
				if (evtObj.name == "entitycreated") {
					this.onEntityAdded(evtObj);
				} else if (evtObj.name == "entitydestroyed") {
					this.onEntityDestroyed(evtObj);
				} else if (evtObj.name == "entityupdated") {
					this.onEntityUpdated(evtObj);
				}else if (evtObj.name == "entityrenamed") {
					this.onEntityRenamed(evtObj);
				}

			}
			jabberwerx.globalEvents.bind("entityCreated", this.invocation("onEntityAdded"));
			jabberwerx.globalEvents.bind("entityDestroyed", this.invocation("onEntityDestroyed"));
			jabberwerx.globalEvents.bind("entityUpdated", this.invocation("onEntityUpdated"));
			jabberwerx.globalEvents.bind("entityRenamed", this.invocation("onEntityRenamed"));
		},

		/**
		 * Callback for the "entityAdded" event
		 *
		 * @param {jabberwerx.EventNotifier} event The entity added event
		 */
		onEntityAdded: function(event) {
			// get the associated jabberwerx.Entity object
			var entity = event.data;
			// update the console HTML UI
			log("entity", "added "  + entity);

			// if the entity is a contact, then trigger the roster UI update
			if (entity instanceof jabberwerx.Contact) {
				//if (entity.properties.subscription && entity.properties.subscription=='to')
				  this.addRosterItem(entity);
			} else if (entity instanceof jabberwerx.MUCRoom) {
				this.addMUCRoom(entity);
			}
		},

		/**
		 * Callback for the "entityUpdated" event
		 *
		 * @param {jabberwerx.EventNotifier} event The entity updated event
		 */
		onEntityUpdated: function(event) {
			// get the associated jabberwerx.Entity object
			var entity = event.data;

			// update the console HTML UI
			log("entity", "updated " + entity);

			// if the entity is a contact, then trigger the roster UI update
			if (entity instanceof jabberwerx.Contact) {

				  this.addRosterItem(entity);
			} else if (entity instanceof jabberwerx.MUCRoom) {
				this.updateMUCRoom(entity);
			}
		},
		/**
		 *
		 */
		onEntityRenamed: function(event) {
			var entity = event.data.entity;

			log("entity", "renamed " + entity + " from " + event.data.jid + " to " + entity.jid);
		},

		/**
		 * Callback for the "entityDestroyed" event
		 *
		 * @param {jabberwerx.EventNotifier} event The entity deleted event
		 */
		onEntityDestroyed: function(event) {
			// get the associated jabberwerx.Entity object
			var entity = event.data;

			// update the console HTML UI
			log("entity", "deleted "  + entity);

			// if the entity is a contact, then trigger the roster UI update
			if (entity instanceof jabberwerx.Contact) {
				if(this.reconnected) {
					this.updateOfflineRosterItem(entity);
				} else {
					// if there is offline mode always
					// probably this will be deprecated
					this.removeRosterItem(entity);
				}
			} else if (entity instanceof jabberwerx.MUCRoom) {
				this.removeMUCRoom(entity);
			}
		},

		/**
		 * Callback for "messageReceived" event
		 *
		 * @param {jabberwerx.EventNotifier} event The message received event
		 */
		onMessageReceived: function(event) {
			console.log('Jabber: onMessageReceived');
			console.log(event);
			var message = event.data;
            var isDuplicated = false;
            var getLastMsgFromLocalStorage = JSON.parse(localStorage.getItem('lastMsgReceived'));
            getLastMsgFromLocalStorage = getLastMsgFromLocalStorage != null ? getLastMsgFromLocalStorage : [];

            if(message.getBody() != null){

                if(getLastMsgFromLocalStorage.length == 0){
                    getLastMsgFromLocalStorage.push({timeSpan : [event.data.getSubject()], from : event.data.getFromJID().getBareJIDString()});
                }else{
                    for(var i = 0; i < getLastMsgFromLocalStorage.length; i++){
                        if(getLastMsgFromLocalStorage[i].from ==  event.data.getFromJID().getBareJIDString()){
                            for(var x = 0; x < getLastMsgFromLocalStorage[i].timeSpan.length; x++){
                                if(getLastMsgFromLocalStorage[i].timeSpan[x] == event.data.getSubject()){
                                    isDuplicated = true;
                                    break;
                                }
                            }
                            if(!isDuplicated){
                                getLastMsgFromLocalStorage[i].timeSpan.push(event.data.getSubject());
                                break;
                            }
                        }else{
                            getLastMsgFromLocalStorage.push({timeSpan : [event.data.getSubject()], from : event.data.getFromJID().getBareJIDString()});
                            break
                        }
                    }
                }

                localStorage.setItem('lastMsgReceived', JSON.stringify(getLastMsgFromLocalStorage));

                if(true){
                    var messageData = {
                        body: message.getBody(),
                        sender: message.getFromJID().getBareJIDString()
                    };

                    console.log('message from ' + messageData.sender + ': ' + messageData.body);

                    if (messageData.body) {
                        $rootScope.$broadcast('jabberMessageReceived', messageData);
                    }

                }else{
                    console.log('Error : Message duplicated - Msg: '+ message.getBody() + ' From: '+ message.getFromJID().getBareJIDString());
                }
            }
		},

		/**
		 * Callback for "presenceReceived" event
		 *
		 * @param {jabberwerx.EventNotifier} event The presence received event
		 */
		onPresenceReceived: function(event) {
			// get the associated jabberwerx.Presence object
			var presence = event.data,
				image = null;
			//console.log('Jabber: onPresenceReceived');
		   // console.log(presence);

			var presenceType = presence.getType() || "available";
			var presenceShow = presence.getShow() || "chat";
			if(presenceType == 'unavailable'){presenceShow = presenceType;}

			// if the presence event relates to the currently logged-in user, update the presence status HTML UI
			// MY PRESENCE
			var isMine = false;

			var nodeName = this.client.connectedUser.jid != null ? this.client.connectedUser.jid._node : 'unavailable';
			var presenceNodeName = presence.getFromJID().getNode();
			if (nodeName == presenceNodeName) {

				if(!allowChangeMyPresence) return;
				if(presenceType == 'unavailable'){
					mXmppApp.client.sendPresence($rootScope.me.show, $rootScope.me.statusShow);
                    return;
				};

				isMine = true;
				image = typeof($rootScope.me.image) === 'string' ? $rootScope.me.image : null;
			}

			var presenceData = {
				//type: presence.getType() || "available",
				type: presenceType,
				image: image,
				//show: presence.getShow() || presence.getType() || "available",
				show: presenceShow,
				status: presence.getStatus(),
				priority: String(presence.getPriority()),
				key: presence.getFromJID().getBareJIDString(),
				guid: presence._guid,
				username: presence.getFromJID().getNode(),
				isMine: isMine
			};

			if(allowReceiveContactsPresence || isMine){
				console.log('JabberService presence received for ' + presenceData.username + ' | status = ' + presence.getStatus() + ' | show = ' + presence.getShow() + ' | priority = ' + presence.getPriority() );
				$rootScope.$broadcast('jabberPresenceReceived', presenceData, presence);
			}

		},

		/**
		 * Callback for "primaryPresenceChanged" event
		 *
		 * @param {jabberwerx.EventNotifier} event The primary presence updated event
		 */
		onPrimaryPresenceUpdated: function(event) {
			// get the associated jabberwerx.Presence object
			var presence = event.data.presence;

			// TODO: what is the algorithm here?
			var show = (presence && (presence.getType() || presence.getShow() || "available")) || "unknown";
			var status = (presence && presence.getStatus());
			var priority = presence && presence.getPriority();
			var resource = event.data.fullJid.getResource();

			priority = (priority && "[" + priority + "]") || "";
			status = (status && "(" + status + ")") || "";

			//update the console HTML UI
			log("entity", "primary presence for " + event.source.jid + " now " + show + " at " + resource);

            //MF-1306
            presence.getType() || "available";
            var presenceType = presence.getType() || "available";
            var presenceShow = presence.getShow() || "chat";
            if(presenceType == 'unavailable'){presenceShow = presenceType;}
            // if the presence event relates to the currently logged-in user, update the presence status HTML UI
            // MY PRESENCE
            var isMine = false;
            var nodeName = this.client.connectedUser.jid != null ? this.client.connectedUser.jid._node : 'unavailable';
            var presenceNodeName = presence.getFromJID().getNode();
            if (nodeName == presenceNodeName) {
                isMine = true;
                image = typeof($rootScope.me.image) === 'string' ? $rootScope.me.image : null;
            }

            var presenceData = {
                type: presenceType,
                image: null,
                show: presenceShow,
                status: presence.getStatus(),
                priority: String(presence.getPriority()),
                key: presence.getFromJID().getBareJIDString(),
                guid: presence._guid,
                username: presence.getFromJID().getNode(),
                isMine: false
            };
            console.log('JabberService onPrimaryPresenceUpdated presence received for ' + presenceData.username + ' | status = ' + presence.getStatus() + ' | show = ' + presence.getShow() + ' | priority = ' + presence.getPriority() );
            $rootScope.$broadcast('jabberPresenceReceived', presenceData, presence);
		},


		/**
		 * Callback for "resourcePresenceUpdated" event
		 */
		onResourcePresenceUpdated: function(event) {
			// get the associated jabberwerx.Presence object
			var presence = event.data.presence;

			// TODO: what is the algorithm here?
			var show = (presence && (presence.getType() || presence.getShow() || "available")) || "unknown";
			var status = (presence && presence.getStatus());
			var priority = presence && presence.getPriority();
			var resource = event.data.fullJid.getResource();

			priority = (priority && "[" + priority + "]") || "";
			status = (status && "(" + status + ")") || "";

			//update the console HTML UI
			log("entity", "resource presence for " + event.source.jid + " now " + show + " at " + resource);
            //MF-1306
            presence.getType() || "available";
            var presenceType = presence.getType() || "available";
            var presenceShow = presence.getShow() || "chat";
            if(presenceType == 'unavailable'){presenceShow = presenceType;}
            // if the presence event relates to the currently logged-in user, update the presence status HTML UI
            // MY PRESENCE
            var isMine = false;
            var nodeName = this.client.connectedUser.jid != null ? this.client.connectedUser.jid._node : 'unavailable';
            var presenceNodeName = presence.getFromJID().getNode();
            if (nodeName == presenceNodeName) {
                isMine = true;
                image = typeof($rootScope.me.image) === 'string' ? $rootScope.me.image : null;
            }

            var presenceData = {
                type: presenceType,
                image: null,
                show: presenceShow,
                status: presence.getStatus(),
                priority: String(presence.getPriority()),
                key: presence.getFromJID().getBareJIDString(),
                guid: presence._guid,
                username: presence.getFromJID().getNode(),
                isMine: false
            };
            console.log('JabberService onResourcePresenceUpdated presence received for ' + presenceData.username + ' | status = ' + presence.getStatus() + ' | show = ' + presence.getShow() + ' | priority = ' + presence.getPriority() );
            $rootScope.$broadcast('jabberPresenceReceived', presenceData, presence);

		},

		onMUCRoom: function(evt) {
			var name = evt.name.substring("room".length);
			var data = "";
			var replace = function(input) {
				if (!input) {
					return input;
				}

				return input.replace(/[<>&]/g, function(str) {
					switch (str) {
						case "<":   return "&lt;";
						case ">":   return "&gt;";
						case "&":   return "&amp;";
					}

					return str;
				});
			};
			if (evt.data) {
				if (evt.data instanceof jabberwerx.Message) {
					var subject = evt.data.getSubject();
					var body = evt.data.getBody();
					var from = evt.data.getFromJID().getResource();
					data = (subject && "subject by " + from + ": " + replace(subject)) ||
						(body && "broadcast from " + from + ": " + replace(body));
				} else {
					data = evt.data;
				}
				data = " (" + data + ")";
			}
			log("room", name + " on " + evt.source.jid + data);
		},
		onErrorEncountered: function(event) {
			var name;
			if (event.source instanceof jabberwerx.MUCRoom) {
				name = "room " + event.source.jid + " errored";
			} else if (event.source instanceof jabberwerx.RosterController) {
				name = "roster errored";
			}
			var op = (event.data.operation && "on " + event.data.operation) || "";
			var err = (event.data.error && "(" + event.data.error.xml + "") || "";
			log("error", jabberwerx.$.trim(op + " " + err));
		},

		_handleStanzaSent: function(evt) {
			var stanza = evt.data;
			log(stanza.pType(), "SENT: " + stanza.xml());
		},
		_handleStanzaReceived: function(evt) {
			var stanza = evt.data;
			log(stanza.pType(), "RECV: " + stanza.xml());
		}
	}, "JWA.Application");


	var chatSessions = {};
	function log(type, details) {
		//console.log("*********XMPP:"+type+","+details);
	}
	function chatReceived(eventObj) {
		var msg = eventObj.data;
		var log = jabberwerx.$("#im-message .message").clone();
		log.children(".from").text(msg.getFrom() + ":    ");
		log.children(".text").text(msg.getBody());
		log.appendTo(".chat #message-display table");
		with (jabberwerx.$(".chat #message-display")[0]) {
			scrollTop = scrollHeight;
		}
	}
	function startChatSession(jid) {
		var chatSession = chatSessions[jid];
		if(!chatSession) {
			chatSession = mXmppApp.startChat(jid);
			chatSession.event('chatReceived').bind(chatReceived);
			chatSessions[jid] = chatSession;
		}
	}
	function newChatSession(eventObj) {
		jabberwerx.$(".chat").show();
		var chatSession = eventObj.data.chatSession;
		var jid = chatSession.jid.getBareJIDString();

		var testChatSession = chatSessions[jid];
		if(!testChatSession) {
			chatSession.event('chatReceived').bind(chatReceived);
			chatSessions[jid] = chatSession;

			with (jabberwerx.$(".chat #outgoing-message")) {
				find(":input[name=to]").val(jid);
			}
		}
	}

	return jabberService;
});
