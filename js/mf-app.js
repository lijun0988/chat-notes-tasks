
// MINDFRAME
// base code for desktop application.

// --------------------------------------
// Namespace definition and base settings

if(!window.mf){
	var mf = {};
};

mf.elements = {};

mf.angular = {};
mf.angular.mainScope = function() {
    return angular.element($('[data-ng-controller="MainController"]')).scope();
}
mf.angular.rootScope = function() {
    return angular.element($('html')).scope();
}
mf.angular.settingScope = function() {
    return angular.element($(".settings-module")).scope();
}
mf.angular.contactScope = function() {
    return angular.element($('[data-ng-controller="ContactsController"]')).scope();
}

mf.debug = false;
mf.cssClasses = {
	HIDDEN: 'hidden',
	ACTIVE: 'active',
	DISABLED: 'disabled',
	SCREEN_HOME: 'screen-home',
	SCREEN_CALL: 'screen-call',
	POSITION_LEFT: 'position-left',
	POSITION_RIGHT: 'position-right',
	WORKING: 'working',
	AUTOCOMPLETE_LOADING: 'ui-autocomplete-loading',
	NO_USER_CONTENT: 'no-user-content',
	EVENT_INCOMING: 'event-incoming',
	EVENT_CALL: 'event-call',
	HANDLING_BAR_TOP: 'handling-bar-top'
};

mf.call = {
	number: '',
	events:{
		INCOMING: 'incoming',
		CALL: 'call',
		ANSWER: 'answer',
		DECLINE: 'decline',
		END: 'end',
		PAUSE: 'pause',
		RESUME: 'resume'
	},
	hasContent: false,
	serachTerm:'',
    hasCueComments: false
};

mf.settings = {
	animation: {
		speed: {
			ultrafast: 100,
			fast: 200,
			normal: 300,
			slow: 600,
			slower: 1000,
			ultraslow: 2000
		}
	},
    cucm: 'nyc-cucm-pub'
};

mf.intervals = [];
mf.timeouts = [];
mf.templates = {
	ajaxLoader: $('#tmpl-ajax-loader'),
	contactsList: $('#tmpl-contacts-list')
};

mf.login = {
	user:{},
	accessToken: undefined,
	source:{
		SETTINGS: 'settings'
	},
	phoneModes:{
		SOFT_PHONE: 'SoftPhone',
		DESK_PHONE: 'DeskPhone'
	},
	isInformationSavedFlow: false, // indicates if login flow is done with saved information.
	isSettingsLogin: false // indicates if the loging flow is been done directly from settings.
};

mf.events = {
	mouseOut: false
}

mf.callManager = {
	isReady: false,
	isUserLoggedIn: false,
	loginInProgress: false
}

mf.window = {
	lastHeight: 0
}

// --------------------------------------
// Mindframe User
mf.user = {
	selectedContact: {},
	selectedPhone: {},
	preferences:{
		init: function(){
			try{
				// Settings > General > Show content specific to
			    var settingsContentOrder = mf.user.preferences.get('settings.contentOrder');
			    if(!settingsContentOrder){
			        mf.user.preferences.set('settings.contentOrder', mf.elements.settings.general.contentOrderRadioGroup[0].value);
			    }else if(typeof settingsContentOrder == 'string'){
			        mf.elements.settings.general.contentOrderRadioGroup.removeAttr('checked');
			        for (var i = 0; i < mf.elements.settings.general.contentOrderRadioGroup.length; i++) {
			            if(mf.elements.settings.general.contentOrderRadioGroup[i].value == settingsContentOrder){
			                mf.elements.settings.general.contentOrderRadioGroup[i].checked = true;
			            }
			        };
			    };
			}catch(ex){
				mf.console.error(ex, 'mf.user.preferences.init');
			}
		},
		get: function(key){
			try{
				if(!key || key == '') throw Error('Invalid key');
				return mf.storage.getItem( mf.login.user.username + '.' + key);
			}catch(ex){
				mf.console.error(ex, 'mf.user.preferences.get');
			}
		},
		set: function(key, value){
			try{
				if(!key || key == '') throw Error('Invalid key');
				mf.storage.setItem( mf.login.user.username + '.' + key, value);
			}catch(ex){
				mf.console.error(ex, 'mf.user.preferences.set');
			}
		},
        clear: function() {
            try{
                mf.storage.removeItem(mf.login.user.username + '.' + 'settings.username');
                mf.storage.removeItem(mf.login.user.username + '.' + 'settings.password');
                mf.storage.removeItem(mf.login.user.username + '.' + 'settings.cucm' );
                mf.storage.removeItem(mf.login.user.username + '.' + 'settings.phoneMode' );
                mf.storage.removeItem(mf.login.user.username + '.' + 'settings.device' );

            }catch(ex){
                mf.console.error(ex, 'mf.user.preferences.set');
            }
        }
	}
};

// --------------------------------------
// Mindframe Services
mf.services = {
	url: {
		host: '',
		basePath: '',
		VOTE: '/__CLIENT_ACCOUNT__/mindframe/vote/__PERSON_ID__',
		FEED: '/__CLIENT_ACCOUNT__/mindframe/feed/__PERSON_ID__',
		CONTENT: '/__CLIENT_ACCOUNT__/mindframe/person/content/__PERSON_ID__',
		PERSONSEARCH: '/__CLIENT_ACCOUNT__/mindframe/person/search',
        PERSONCOMMENTS: '/__CLIENT_ACCOUNT__/mindframe/feed/content/__ACCOUNT_CONTENT_ID__/person/__PERSON_ID__'
	},
	udpateServicesUrl: function(accountName){
        mf.services.url.personComments = mf.services.url.apiPath + mf.services.url.PERSONCOMMENTS.replace('__CLIENT_ACCOUNT__', accountName);
		mf.services.url.personSearch = mf.services.url.apiPath + mf.services.url.PERSONSEARCH.replace('__CLIENT_ACCOUNT__', accountName);
		mf.services.url.content = mf.services.url.apiPath + mf.services.url.CONTENT.replace('__CLIENT_ACCOUNT__', accountName);
		mf.services.url.vote = mf.services.url.apiPath + mf.services.url.VOTE.replace('__CLIENT_ACCOUNT__', accountName);
		mf.services.url.feed = mf.services.url.apiPath + mf.services.url.FEED.replace('__CLIENT_ACCOUNT__', accountName);
	}
};


// --------------------------------------
// Namespace definition and base settings
// --------------------------------------
// Mindframe UI
(function(){
	mf.init = function(){
		$(document).ready(function(){
			mf.content.setEvents();
			mf.services.url.apiPath = API_URL;
			mf.elements.callContainer = $('#callcontainer');
			mf.elements.fixedHeigth = $('[data-fixed-heigth]');
			mf.ui.fitElementsHeight(mf.elements.fixedHeigth);
		});

		$(window).bind('resize', function(){
			clearTimeout(mf.timeouts['windowResizeFast']);
			mf.timeouts['windowResizeFast'] = setTimeout(function(){

                mf.ui.fitElementsHeight($('[data-fixed-heigth]'));

                mf.ui.draggableTabsNavigation();
                mf.ui.draggableSubTabsNavigation();
                mf.content.setColmnsHeight(true); // true indicates that is resize event

			}, 400);
		})
	}
})();

// --------------------------------------
// Mindframe Storage
(function(){
	mf.storage = {
		setItem: function(key, value){
			try{
				if(!key || key === undefined) throw Error('The key is not valid.');
				return localStorage[key] = value;
			}catch(ex){
				mf.console.error(ex, 'mf.storage.setItem');
			}
		},
		getItem: function(key){
			try{
				if(!key || key === undefined) throw Error('The key is not valid.');
				return localStorage[key];
			}catch(ex){
				mf.console.error(ex, 'mf.storage.getItem');
			}
		},
		removeItem: function(key){
			try{
				if(!key || key === undefined) throw Error('The key is not valid.');
				localStorage.removeItem(key);
			}catch(ex){
				mf.console.error(ex, 'mf.storage.removeItem');
			}
		},
		clear: function(){
			localStorage.clear();
		}
	}
})();

// --------------------------------------
// Mindframe UI
(function(){
	mf.ui = {
		hiddenClass: 'mf-ui-hidden',
	    restoreElement: function(elements){
	        elements.each(function(i, element){
	        	element = $(element);
	        	element.css({display:'block'});
	        	setTimeout(function(){ $(element).removeClass( mf.ui.hiddenClass ) }, 300);
	        })
	    },
	    hideElement: function(elements){
	        elements.each(function(i, element){
	        	element = $(element);
	        	element.addClass( mf.ui.hiddenClass );
	        	setTimeout(function(){ element.css({display:'none'}) }, 300);
	        })
	    },
	    enableHandlingBarButtons: function(){
	    	mf.elements.muteBtn.removeClass( mf.cssClasses.DISABLED );
	        mf.angular.mainScope().isVideoDisabled = false;
	    	mf.elements.addCallBtn.removeClass( mf.cssClasses.DISABLED );
	    	mf.elements.pauseBtn.removeClass( mf.cssClasses.DISABLED );
	    },
	    disableHandlingBarButtons: function(){
	    	mf.elements.muteBtn.addClass( mf.cssClasses.DISABLED );
	    	mf.angular.mainScope().isVideoDisabled = true;
	    	mf.elements.addCallBtn.addClass( mf.cssClasses.DISABLED );
	    	mf.elements.pauseBtn.addClass( mf.cssClasses.DISABLED );
	    },
	    disableCallButton: function(){
	    	mf.elements.callBtnAnswer.removeClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnDecline.removeClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnCall.addClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnEnd.addClass( mf.cssClasses.DISABLED );

	    },
		enableCallButton: function(){
	    	mf.elements.callBtnAnswer.removeClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnDecline.removeClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnCall.removeClass( mf.cssClasses.DISABLED );
			mf.elements.callBtnEnd.removeClass( mf.cssClasses.DISABLED );

	    },
	    fitElementsHeight: function(elements){
	    	elements.each(function(){
				var newHeight = ($(window).height() + (parseInt(this.getAttribute('data-fixed-heigth-adjust')) || 0 ));
				var selectors = this.getAttribute('data-fixed-heigth-selectors');
				if(selectors){
					var selectorsList = selectors.split(',');
					for (var i = 0; i < selectorsList.length; i++) {
						newHeight = newHeight - $(selectorsList[i]).last().height();
					}
				}
                //$('[data-video-heigh-adjust]')
                var videoH = 0 ;
                if (mf.angular.mainScope() && mf.angular.mainScope().isVideoCall && this.hasAttribute('data-video-heigh-adjust')) {
                    videoH = $('#callcontainer').height();
                    $(this).height(newHeight-videoH);
                } else {
				    $(this).height(newHeight);
                }

			});
	    },

	    handleCallButtonsVisibility: function(callEventType){
	    	if(!callEventType || callEventType === '') return;
	    	switch(callEventType){
	    		case mf.call.events.INCOMING:
	    			mf.ui.clearBodyEventClasses();
	    			mf.elements.callBtnAnswer.removeClass( mf.cssClasses.HIDDEN );
                    mf.elements.callBtnAnswer.focus();
	    			mf.elements.callBtnDecline.removeClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnCall.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnEnd.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.body.addClass( mf.cssClasses.EVENT_INCOMING );
	    			break;
	    		case mf.call.events.CALL:
	    		case mf.call.events.ANSWER:
	    			mf.ui.clearBodyEventClasses();
	    			mf.elements.callBtnAnswer.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnDecline.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnCall.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnEnd.removeClass( mf.cssClasses.HIDDEN );
                    mf.elements.callBtnEnd.focus();
	    			mf.elements.body.addClass( mf.cssClasses.EVENT_CALL );
	    			break;
	    		case mf.call.events.DECLINE:
	    		case mf.call.events.END:
	    			mf.ui.clearBodyEventClasses();
	    			mf.elements.callBtnAnswer.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnDecline.addClass( mf.cssClasses.HIDDEN );
	    			mf.elements.callBtnCall.removeClass( mf.cssClasses.HIDDEN );
                    mf.elements.callBtnCall.focus();
	    			mf.elements.callBtnEnd.addClass( mf.cssClasses.HIDDEN );
                    mf.angular.mainScope().isResumeBlink = false;
                    mf.elements.pauseBtn.removeClass('resume').addClass('hold');
                    mf.elements.pauseBtn.attr('title', mf.elements.pauseBtn[0].getAttribute('data-title-pause'));
                    mf.elements.pauseBtn.text(mf.elements.pauseBtn[0].getAttribute('data-title-pause'));
                    
	    			break;
	    		case mf.call.events.PAUSE:
	    			mf.elements.muteBtn.addClass( mf.cssClasses.DISABLED );
	    			mf.angular.mainScope().isVideoDisabled = true;
                    mf.elements.pauseBtn.removeClass('hold').addClass('resume');
                    mf.elements.pauseBtn.attr('title', mf.elements.pauseBtn[0].getAttribute('data-title-resume'));
                    mf.elements.pauseBtn.text(mf.elements.pauseBtn[0].getAttribute('data-title-resume'));
                    mf.angular.mainScope().isResumeBlink = true;
	    			break;
	    		case mf.call.events.RESUME:
	    			mf.elements.muteBtn.removeClass( mf.cssClasses.DISABLED );
	    			mf.angular.mainScope().isVideoDisabled = false;
                    mf.elements.pauseBtn.removeClass('resume').addClass('hold');
                    mf.elements.pauseBtn.attr('title', mf.elements.pauseBtn[0].getAttribute('data-title-pause'));
                    mf.elements.pauseBtn.text(mf.elements.pauseBtn[0].getAttribute('data-title-pause'));
                    mf.angular.mainScope().isResumeBlink = false;
                    break;
	    	};

	    },
	    clearBodyEventClasses: function(){
	    	mf.elements.body.removeClass( mf.cssClasses.EVENT_INCOMING );
	    	mf.elements.body.removeClass( mf.cssClasses.EVENT_CALL );
	    },


	    draggableTabsNavigation: function(){
	    	var tabsMenuContainer = mf.elements.content.container.find('.subscribers-navigation .subscriber-list > ul');
			if(!tabsMenuContainer.length) return;
			var totalContentItems = tabsMenuContainer.find('> li').length;
			var tabsMenuWidth = 0;
			var wrapperWidth = $('aside.content-wrapper').width();

			// Setup Tabs menus
			tabsMenuContainer.find('> li').each(function(i, listItem){
				tabsMenuWidth = tabsMenuWidth + $(listItem).outerWidth(true);
				if(i == totalContentItems-1){
					if(tabsMenuWidth > wrapperWidth || (wrapperWidth <= 877 && tabsMenuWidth >=550) ){
						// Draggable menu
						tabsMenuContainer.parent().addClass('draggable-wrapper');
						$(listItem).parent().width(tabsMenuWidth + 2000).css({'text-align':'left', 'position':'relative', 'left': '60px'});
						var extra = tabsMenuContainer.width() - wrapperWidth;
						var lastDragPosition = 0;
                        tabsMenuContainer.draggable();
						tabsMenuContainer
							.unbind('click')
							.unbind('mouseup')
							.draggable('destroy')
							.draggable({axis:'x',
								drag: function(event, ui){
									if(event.pageX < -200
									|| event.pageX > (window.innerWidth + 200)
									|| event.pageY  < 0
									|| event.pageY > window.innerHeight ) {
										ui.position.left = lastDragPosition;
									}else{
										lastDragPosition = ui.position.left;
									}
								}})
							.bind('mouseup', function(){
								if(tabsMenuContainer.position().left > 60){
									tabsMenuContainer.animate({'left': '60px'}, 1200, 'easeOutExpo');
								}else{
									if(tabsMenuContainer.position().left < (extra*-1) ){
										tabsMenuContainer.animate({'left': (extra*-1 - 60) + 'px'}, 1200, 'easeOutExpo');
									}
								}
							})
							.bind('click', function(e){
								console.log(e.pageX);
								if(e.pageX > (window.innerWidth - 100)){
									tabsMenuContainer.trigger('moveLeft');
								}else if(e.pageX < 390){
									tabsMenuContainer.trigger('moveRight');
								};
							})
							.bind('moveLeft', function(e){
								console.log('moveLeft');
								var targetPos = tabsMenuContainer.position().left - 200;
								if(targetPos < (extra*-1 - 40) ) targetPos = extra * -1 - 80;
								tabsMenuContainer.animate({'left': targetPos + 'px'}, 1200, 'easeOutExpo');
							})
							.bind('moveRight', function(e){
								console.log('moveRight');
								var targetPos = tabsMenuContainer.position().left + 2000;
								if(targetPos > 40 ) targetPos = 60;
								tabsMenuContainer.animate({'left': targetPos + 'px'}, 1200, 'easeOutExpo');
							})
					}else{
						// Normal flow
						tabsMenuContainer.parent().removeClass('draggable-wrapper');
                        tabsMenuContainer.draggable();
						if(tabsMenuContainer.hasClass('ui-draggable')){
							tabsMenuContainer.unbind('click').unbind('mouseup').removeAttr('style').draggable('destroy');
						}
					}
				}
			})
	    },

	    draggableSubTabsNavigation: function(wrapper){

	    	var wrapper = wrapper || mf.elements.content.container;
	    	var subTabsMenuContainer = wrapper.find('ul.content-tabbar-tabs');
			if(!subTabsMenuContainer.length) return;
			var wrapperWidth = $('aside.content-wrapper').width();

			// Setup Subtabs menus
			var subtabsMenuWidth = 0;
			var totalSubTabsContentItems = subTabsMenuContainer.find('> li').length;
			subTabsMenuContainer.find('> li').each(function(i, listItem){
				subtabsMenuWidth = subtabsMenuWidth + $(listItem).outerWidth(true);
				if(i == totalSubTabsContentItems-1){
					if(subtabsMenuWidth > wrapperWidth){
						// Draggable menu
						subTabsMenuContainer.parent().addClass('draggable-wrapper');
						$(listItem).parent().width(subtabsMenuWidth + 1000).css({'text-align':'left', 'position':'relative', 'left': '80px'});
						var extra = subTabsMenuContainer.width() - wrapperWidth;
						var lastDragPosition = 0;
                        subTabsMenuContainer.draggable();
						subTabsMenuContainer
							.unbind('click')
							.unbind('mouseup')
							.unbind('mousedown')
							.draggable('destroy')
							.draggable({axis:'x',
								drag: function(event, ui){
									if(event.pageX < -200
									|| event.pageX > (window.innerWidth + 200)
									|| event.pageY  < 0
									|| event.pageY > window.innerHeight ) {
										ui.position.left = lastDragPosition;
									}else{
										lastDragPosition = ui.position.left;
									}
								}})
							.bind('mouseup', function(){
								if(subTabsMenuContainer.position().left > 40){
									subTabsMenuContainer.animate({'left': '40px'}, 1200, 'easeOutExpo');
								}else{
									if(subTabsMenuContainer.position().left < (extra*-1) ){
										subTabsMenuContainer.animate({'left': (extra*-1 - 40) + 'px'}, 1200, 'easeOutExpo');
									}
								}
								setTimeout(function(){
									subTabsMenuContainer.removeClass('dragging');
								}, 200);
							})
							.bind('mousedown', function(){
								setTimeout(function(){
									subTabsMenuContainer.addClass('dragging');
								}, 200)
							})
							.bind('click', function(e){
								console.log(e.pageX);
								if(e.pageX > (window.innerWidth - 100)){
									subTabsMenuContainer.trigger('moveLeft');
								}else if(e.pageX < 390){
									subTabsMenuContainer.trigger('moveRight');
								};
							})
							.bind('moveLeft', function(e){
								console.log('moveLeft');
								var targetPos = subTabsMenuContainer.position().left - 200;
								if(targetPos < (extra*-1 - 40) ) targetPos = extra * -1 - 80;
								subTabsMenuContainer.animate({'left': targetPos + 'px'}, 1200, 'easeOutExpo');
							})
							.bind('moveRight', function(e){
								console.log('moveRight');
								var targetPos = subTabsMenuContainer.position().left + 200;
								if(targetPos > 40 ) targetPos = 60;
								subTabsMenuContainer.animate({'left': targetPos + 'px'}, 1200, 'easeOutExpo');
							})
					}else{
						// Normal flow
						subTabsMenuContainer.parent().removeClass('draggable-wrapper');
                        subTabsMenuContainer.draggable();
						if(subTabsMenuContainer.hasClass('ui-draggable')){
							subTabsMenuContainer.unbind('click').unbind('mouseup').removeAttr('style').draggable('destroy');
						}
					}
				}
			})
	    }
	}
})();

// --------------------------------------
// Mindframe Ajax
(function(){
	mf.ajax = {
		type:{
			POST: 'POST',
			GET: 'GET'
		},
	    doAjaxCall: function(options){
	    	try{
	    		var url = options.url || '';
	    		if(url === '') throw Error('No Ajax Url');
	    		var type = options.type || 'GET';
	    		var dataType = options.dataType || 'json';
	    		var callback = options.callback || null;
	    		var data = JSON.stringify(options.data) || {};
	    		var cache = true;
	    		if(options.cache !== undefined) cache = options.cache;

	    		$.ajax({
			        url: url,
			        type: type,
			        dataType: dataType,
			        data: data,
			        contentType:"application/json",
			        cache: cache,
			        success: function(response){
			            if(callback) callback.call(null, response);
			            if(mf.debug) mf.console.debug(response);
			        },
			        error: function(response){
			    		mf.console.error('Error in ajax call', 'mf.ui.doAjaxCall.error');
			    		if(callback) callback.call(null, response);
			        }
			    })
			}catch(ex){
		        mf.console.error(ex, 'mf.ui.doAjaxCall');
		    }
	    },
	    loadingIcon:{
	    	on: function(container){
	    		if(!container.length) return;
	    		$.tmpl( mf.templates.ajaxLoader ).appendTo( container );
	    	},
	    	off: function(container){
	    		container.find('.ajax-loader').remove();
	    	}
	    }
	}
})();

// --------------------------------------
// Mindframe Console
(function(){
	mf.console = {
		error: function(ex, module){
			var message;
			(typeof ex != 'string') ? message = ex.message : message = ex;
			var message
			console.log('----------------------------------');
			console.log('MF Error: ' + message);
			console.log('Module: ' + module);
			console.trace(ex);
			console.log('----------------------------------');
		},
		debug: function(object){
			console.log('----------------------------------');
			console.log('DEBUG -> mf.console.debug');
			console.log(object);
			console.log('----------------------------------');
		}
	}
})();



// --------------------------------------
// Mindframe User Content
(function(){
	mf.content = {
		templates: {
			userContent: $('#tmpl-user-content'),
			subscribersContents: $('#tmpl-subscribers-contents'),
 			subscribersNavigation: $('#tmpl-subscribers-navigation'),
			contentChild: $('#tmpl-content-child'),
			tmplContentTabForm: $('#tmpl-content-tab-form'),
			tmplContentCueInformation: $('#tmpl-content-cue-information'),
            tmplContentCueComment: $('#tmpl-content-cue-comment-written')
		},

		component:{
			list:{
				operation:{
					NONE: 'NONE',
					UP_NEUTRAL: 'THUMBS_UP_NEUTRAL',
					UP_DOWN_NEUTRAL: 'THUMBS_UP_DOWN_NEUTRAL',
					CHECKBOXES: 'CHECKBOXES'
				},
				cueType:{
					UP: 'UP',
					DOWN: 'DOWN',
					NEUTRAL: 'NEUTRAL'
				}
			}
		},

		getNextCueStatus: function(type, operation){
			if(operation === mf.content.component.list.operation.UP_NEUTRAL ||operation === mf.content.component.list.operation.CHECKBOXES ){
				switch(type){
					case mf.content.component.list.cueType.UP:
						return mf.content.component.list.cueType.NEUTRAL;
						break;
					case mf.content.component.list.cueType.NEUTRAL:
						return mf.content.component.list.cueType.UP;
						break;
				}
			}else if(operation === mf.content.component.list.operation.UP_DOWN_NEUTRAL){
				switch(type){
					case mf.content.component.list.cueType.UP:
						return mf.content.component.list.cueType.DOWN;
						break;
					case mf.content.component.list.cueType.DOWN:
						return mf.content.component.list.cueType.NEUTRAL;
						break;
					case mf.content.component.list.cueType.NEUTRAL:
						return mf.content.component.list.cueType.UP;
						break;
				}
			}
		},

		selectPerson: function(person){
			try{
				if(!person) throw Error('Wrong user object.');
				if(!person.id) throw Error('No user ID.');
				// Get votes to create the votes map.
				mf.content.getUserVotes(person);

                //MF-863 always set the notes as the default tab
                window.setTimeout(function(){
                    mf.angular.mainScope().$apply(function() {
                        mf.angular.mainScope().selectTabbedContent('notes');
                    });
                }, 100);


			}catch(ex){
				mf.console.error(ex, 'mf.content.selectPerson');
			};
		},

		getUserVotes: function(person){
			try{
				mf.ajax.doAjaxCall({
					url: mf.services.url.vote.replace('__PERSON_ID__',person.id),
					cache: false,
			        callback: function(response){
			        	var votes = [];
			        	try{
							if(response.data){
								// Create votes hash map
					        	for (var i = response.data.length - 1; i >= 0; i--) {
					        		votes[response.data[i].hash] = response.data[i].type;
					        	};
							};

				    		mf.content.getUserContent(person, votes);

						}catch(ex){
								mf.console.error(ex, 'mf.content.getUserContent (get person content callback)');
						};
					}
				});
			}catch(ex){
				mf.console.error(ex, 'mf.content.getUserVotes');
			};
		},

        getUserContent: function(person, votes){
			var url, contentOrder;
			try{
				url = mf.services.url.content.replace('__PERSON_ID__',person.id);

				contentOrder = mf.user.preferences.get('settings.general.contentOrder');
                if (!contentOrder) {
                    contentOrder = "caller";
                } else {
                    contentOrder = JSON.parse(contentOrder); //userSet saving json, need to parse
                }
				if(contentOrder && typeof contentOrder == 'string'){
					url += '?sort=' + contentOrder;
				};

				mf.ajax.doAjaxCall({
					url: url,
					cache: false,
					callback: function(response){
					try{
						if(!response.data && !response.data.content) throw Error('response.data.content is undefined');
							if(response.data.content.length > 0){
								mf.call.hasContent = true;
								mf.elements.body.removeClass( mf.cssClasses.NO_USER_CONTENT );
								response.data.person.votes = votes;
								if (person.status && person.status != '') response.data.person.status = person.status.toLowerCase();

								mf.content.render(response.data);
							}else{
								mf.call.hasContent = false;
								mf.elements.body.addClass( mf.cssClasses.NO_USER_CONTENT );
								mf.ajax.loadingIcon.off( mf.elements.content.container );
								mf.content.clear();
								mf.content.renderNavigation(response.data);
							};
						}catch(ex){
							// Remove ajax loading icon.
							mf.ajax.loadingIcon.off( mf.elements.content.container );
							mf.content.clear();
							mf.console.error(ex, 'mf.content.getUserContent (get person content callback)');
						};
					}
				});

			}catch(ex){
				mf.console.error(ex, 'mf.content.getUserContent');
			};
		},

        cuesReplace: function(contentEnd, namePerson){
            if (contentEnd && contentEnd.content && contentEnd.content.length>0) {
                for (var k=0;k<contentEnd.content.length;k++) {
                    mf.content.cuesReplace(contentEnd.content[k], namePerson);
                }
            } else {
                if  (contentEnd.componentType && contentEnd.componentType == "Cue") {
                    if (contentEnd.text)
                        contentEnd.text = contentEnd.text.replace(/{firstName}/g, namePerson);
                }
            }
        },

		render: function(data){
			var content = data.content;

            var rootScope = angular.element($('html')).scope();
            window.setTimeout(function(){
                rootScope.$apply(function() {
                    rootScope.selectedPersonContent = data.content;
                });
            }, 100);

            mf.content.clear();
			mf.content.renderNavigation(data);
			var parent;
			for (var i = content.length - 1; i >= 0; i--) {
				// Apply content subscriber template
				var indexdedContent = {
					content: content[i],
					index: i,
                    person: data.person
				};
                mf.content.cuesReplace(content[i],data.person.firstName);

				mf.elements.content.container.find('.subscribers-contents').prepend(
					$.tmpl( mf.content.templates.subscribersContents , indexdedContent )
				);

				// Render content
				if(content[i].content.length > 0){
					parent = $('#content-subscriber-' + content[i].id, mf.elements.content.container);
					if(i === 0) parent.css({'opacity':0});
					mf.content.renderChildren( content[i].content, parent.find('.user-content-subscriber'), data.person, indexdedContent.content.id );
					if(i === 0) setTimeout(function(){parent.css({'opacity':1}, 500)}, 1000);
				};
			};

			// Update header text (counterPart [true|false])
			this.updateHeaderText( mf.elements.content.container.find('section.active'), data.person );

			// Remove ajax loading icon.
			mf.ajax.loadingIcon.off( mf.elements.content.container );
		},

		renderNavigation: function(data){

			$.tmpl( mf.content.templates.subscribersNavigation , data )
				.appendTo( mf.elements.content.container.find('.subscribers-navigation') );


            /*
            if (phones.length>1) {
                mf.elements.content.container.find('.phone-selector').removeClass(mf.cssClasses.HIDDEN);

            } else if(phones.length==1){
                mf.elements.content.container.find('.phone-icon').removeClass(mf.cssClasses.HIDDEN);

            } else {

            }*/



            // Setup navigation
			mf.ui.draggableTabsNavigation();
		},

		renderChildren: function(children, wrapper, person, contentId){
            var isTemplateRendered = true;

            try{
                wrapper.append( $.tmpl( mf.content.templates.contentChild , children, {
                    orderData: function(data) {
                        return data;
                    }
                }));
            }catch(ex){
                mf.console.error(ex, ' mf.content.renderChildren (children, wrapper, person, contentId) : Something is wrong in the HTML content');
                isTemplateRendered = false;
            };

            if(isTemplateRendered)
            {
                // Contant > TabBar: Move the content for each tab to a separate container.
                wrapper.find('.content-tabbar').each(function(){
                    var tabContentWrapper = $('<div class="content-tabbar-contents"></div>');
                    $(this).find('.content-tabbar-tabs').after(tabContentWrapper);
                    $(this).find('.content-tabbar-tabs > li > .content-item').each(function(i, item){

                        //$(this).addClass( $(this).prev('a').attr('href').replace('#','') );
                        $(this).addClass( $(this).prev('a')[0].getAttribute('data-target') );
                        if(i!==0){
                            $(this).addClass( mf.cssClasses.HIDDEN )
                        };
                        $(this).appendTo(tabContentWrapper);
                    })
                });

                // Content > TabBar: Attach events for TabBar navigation.
                wrapper.find('.content-tabbar-tabs').each(function(){
                    $(this).find('li:first-child').addClass( mf.cssClasses.ACTIVE );
                    $(this).find('li > a').bind('click', function(e){
                        e.preventDefault();
                        if( $(this).closest('ul').hasClass('dragging') ) return;
                        //var targetItemClass = $(this).attr('href').replace('#','');
                        var targetItemClass = $(this)[0].getAttribute('data-target');
                        $(this).parent().addClass( mf.cssClasses.ACTIVE ).siblings().removeClass( mf.cssClasses.ACTIVE );
                        $(this).closest('.content-tabbar')
                            .find('.content-tabbar-contents > .content-item').addClass( mf.cssClasses.HIDDEN )
                            .end()
                            .find('.content-tabbar-contents > .content-item.' + targetItemClass)
                            .removeClass( mf.cssClasses.HIDDEN );
                    })
                });

                // This fix the issue when we have traits in all tabs and then all tabs are hidden.
                if( wrapper.find('.content-tabbar-tabs > li').length == 1&& !wrapper.find('.content-tabbar-tabs > li').hasClass('hidden') ){
                    wrapper.find('.content-tabbar-tabs > li').parent().css('margin', '0 0 35px 25px');
                    wrapper.find('.content-tabbar').css('margin','0');
                    wrapper.parent().find('.add-note-wrap').css('top','25px');
                }

                if( wrapper.find('.content-tabbar-tabs > li').length > 1 ){
                    wrapper.find('.content-tabbar-tabs > li').removeClass( mf.cssClasses.HIDDEN );
                    wrapper.find('.content-tabbar').css({'margin-top':0}).parent().prev().css({'top':25+'px'});
                }else{
                    wrapper.find('.content-tabbar-tabs-wrapper').addClass('mf-ui-no-border');
                    wrapper.find('.content-tabbar-contents').addClass('mf-ui-no-margin');
                };

                // Content > Cue > Vote
                wrapper.find('.content-cue a.vote').each(function(){
                    var link = $(this);
                    var voteItem = person.votes[link[0].getAttribute('data-hash')];
                    var operation = link.closest('.content-list')[0].getAttribute('data-operation');
                    if(voteItem){
                        link[0].setAttribute('data-type', voteItem);
                    };

                    link.bind('click', function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        var newType = mf.content.getNextCueStatus(link[0].getAttribute('data-type'), operation);
                        if(!newType || newType === '') return;
                        $(this)[0].setAttribute('data-type', newType);

                        var voteData = {
                            "person": {"id": person.id},
                            "accountContent":{"id": contentId},
                            "hash": link[0].getAttribute('data-hash'),
                            "type": newType
                        };

                        mf.ajax.doAjaxCall({
                            url: mf.services.url.vote.replace('__PERSON_ID__',person.id),
                            type: mf.ajax.type.POST,
                            data: voteData
                        });
                    });
                })

                // Content > Cue > Comment
                wrapper.find('.content-item.allows-notes .content-cue p span')
                        .bind('click', function(){
                            var listItem = $(this).closest('li');
                            var link = listItem.find('a.vote');

                            if( listItem.find('form').length > 0 ) return;

                            var formInfo = 'cue_' + listItem.find('a')[0].getAttribute('data-hash');
                            var formData = {
                                name: formInfo,
                                id: formInfo
                            };
                            listItem.append( $.tmpl( mf.content.templates.tmplContentTabForm , formData ));

                            // Attach cancel event.
                            listItem.find('button.cancel').bind('click', function(){
                                $(this).closest('.content-cue-comment').remove();
                                mf.content.setColmnsHeight();
                            });

                            // Attach submit event.
                            listItem.find('button[type="submit"]').bind('click', function(e){
                                e.preventDefault();
                                var commentData = {
                                    "person": {"id": person.id},
                                    "accountContent":{"id": contentId},
                                    "hash": link[0].getAttribute('data-hash'),
                                    "comment": $(this).closest('form').find('textarea').val()
                                };

                                mf.ajax.doAjaxCall({
                                    url: mf.services.url.feed.replace('__PERSON_ID__',person.id),
                                    type: mf.ajax.type.POST,
                                    data: commentData
                                });

                                //Display the icon comment after the comments is submited.
                                var iconComment = $(this).closest('li').find('a.icon-comment');
                                if(iconComment && iconComment != undefined) {
                                    $(iconComment).show();
                                }

                                $(this).closest('.content-cue-comment').remove();
                                mf.content.setColmnsHeight();

                            });

                            mf.content.setColmnsHeight();
                });

                // Content > Cue > Comment to read
                wrapper.find('.content-item.allows-notes .content-cue').each( function(){
                    var listItem = $(this).closest('li');

                    var link = listItem.find('a.icon-comment');

                    try{

                        link[0].setAttribute('data-cue-person-id', person.id);
                        link[0].setAttribute('data-cue-content-id', contentId);
                        mf.content.hasCueComment(person.id, contentId, link[0].getAttribute('data-cue-hash'), link);
                    }
                    catch (ex) {
                        mf.console.error(ex, ' mf.content.renderChildren (Content > Cue > Comment to read) : Something is wrong in the HTML content');
                    }                 
                });
            }

			// set Columns max height depending on space we have
			mf.content.columnsHeightDeduct = $('#handling-bar').height()
				+ mf.elements.content.container.find('nav').height()
				+ $('header.top-contact-info').height()
				+ $('.content-tabbar-tabs').height()
				+ 20; // extra space

			// Calculate columns height
			mf.content.setColmnsHeight();

		},

		clear: function(container){
			(container && !!container.length) ?
				container.empty() :
				mf.elements.content.container.find('.clear').empty();
			clearInterval(mf.intervals['columnsHeight']);
		},

		updateHeaderText: function(targetContent, person){
			try{
				//if(!targetContent.length) throw Error('targetContent is invalid');
				var newText = '';
				var textContainer = mf.elements.content.container.find('.user-name');
				//var isOtherPerson = targetContent[0].getAttribute('data-counterpart');
				if(!textContainer.length) return;

				newText += '<b>' + textContainer[0].getAttribute('data-first-name');
				newText += ' ' + textContainer[0].getAttribute('data-last-name') + '</b>';

				mf.elements.content.container.find('.user-phone').removeClass(mf.cssClasses.HIDDEN);

				mf.elements.content.container.find('.user-name').html(newText);

			}catch(ex){
				mf.console.error(ex, 'mf.content.updateHeaderText');
			}
		},

		setColmnsHeight: function(isResize){

				var currentWindowsHeight = $(window).height();

				function setMinHeight(element, h){
					$(element).css('min-height',h + 'px')
						.find('> .content-column-inner').css('min-height', (h - 4) + 'px');
				}

				if(!mf.elements.content.container.hasClass( mf.cssClasses.HIDDEN )){
					var extraHeight;
					(mf.elements.callContainer.is(':visible')) ?
						extraHeight = mf.elements.callContainer.height() :
						extraHeight = 0;
					var addNotesButtonHeight = 65;
					var maxHeight = currentWindowsHeight - mf.content.columnsHeightDeduct - extraHeight - addNotesButtonHeight;
					mf.elements.content.container.find('.content-column')
						.css({'max-height': maxHeight + 'px'})
						.find('> .content-column-inner').css({'max-height': (maxHeight - 4) + 'px'});

					// Same height for all sibling columns
					var columnsWrappers = document.getElementsByClassName('content-columns');
					for (var i = 0; i < columnsWrappers.length; i++) {
						if($(columnsWrappers[i]).is(':visible')){

							var columns = columnsWrappers[i].getElementsByClassName('content-column');
							var height = maxHeightIndex = 0;

							// Get max height
							for (var j = 0; j < columns.length; j++) {
								var currentHeight = $(columns[j]).height();
								if(currentHeight > height){
									maxHeightIndex = j;
									height = currentHeight;
								};
							};
							// Set height
							var currentMaxHeight;

							for (var j = 0; j < columns.length; j++) {

								var currentMaxHeight = parseFloat($('.content-column')[0].style.maxHeight.replace('px',''));

								if(currentMaxHeight && !isNaN(currentMaxHeight) && height > currentMaxHeight){
									height = currentMaxHeight;
								};

								if( !isResize || ( isResize && mf.helper.isElementOverflowed(columns[j]) ) ) {
									setMinHeight( columns[j], height );
								}

							}
						}
					}
				};

				mf.window.lastHeight = currentWindowsHeight;

		},

        renderCueComment: function(data, cueObj){

            $('.content-cue-comment-written').remove();

            $.tmpl( mf.content.templates.tmplContentCueComment , data).appendTo( $('body') );

            var link = cueObj;
            var iconOffset = link.offset();
            var currentInfo = $('.content-cue-comment-written');
            var infoPosition = {};

            var positionClass = '';
            var infoCss = {};
            var windowWidth = $(window).width();

            infoPosition.top = iconOffset.top - 10;

            if (iconOffset.left > (windowWidth / 2)) {
                positionClass = mf.cssClasses.POSITION_RIGHT;
                infoCss = {top: infoPosition.top + 'px', right: (windowWidth - iconOffset.left + 15) + 'px', 'z-index': '9999'};
            } else {
                positionClass = mf.cssClasses.POSITION_LEFT;
                infoCss = {top: infoPosition.top + 'px', left: ( iconOffset.left + 25) + 'px', 'z-index': '9999'};
            };

            // Bind tooltop kill event.
            currentInfo.css(infoCss)
                .addClass(positionClass);

            $('body').on('click', function (e){
                currentInfo.each(function () {
                    //the 'is' for buttons tst trigger popups
                    //the 'has' for icons within a button that triggers a popup
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.icon-comment').has(e.target).length === 0) {
                        $(this).remove();
                    }
                });
            });
        },

        getCommentCreatedAt: function(date){
            var commentDateTime = new Date(date);
            var currentDateTime = new Date();
            var timeToDisplay;

            if(commentDateTime.getDate() == currentDateTime.getDate()){
                var hours =  currentDateTime.getHours()  - commentDateTime.getHours();
                var minutes = currentDateTime.getMinutes() - commentDateTime.getMinutes();
                if(hours > 0){
                    timeToDisplay = hours;
                    timeToDisplay +=  " hours ago";
                }else{
                    timeToDisplay = minutes;
                    timeToDisplay +=  " min ago";
                }

            }else{
                var diffDate = currentDateTime.getDate() - commentDateTime.getDate();
                if(diffDate == 1){
                    timeToDisplay = "Yesterday";
                }else {
                    timeToDisplay = commentDateTime.toLocaleDateString();
                }
            }
            return timeToDisplay;

        },

		setEvents: function(){
			try{
				// Actions for tabs navigation.
				$(document).on('click', '.subscribers-navigation .subscriber-list a', function(e){
					e.preventDefault();

					if( $(this).closest('li').hasClass(mf.cssClasses.ACTIVE) ) return;

					// Assign active status
					//var targetContent = mf.elements.content.container.find( $(this).attr('href') );
					var targetContent = mf.elements.content.container.find( '#' + this.getAttribute('data-target') );
					if( !!targetContent.length ){

						// Unselect Notes, Tasks, Email tabs.
						var scope = angular.element($("html")).scope();
						scope.$apply(function(){
							scope.selectedTabbedContent = undefined;
						})

                        // remove hidden columns
                        //targetContent.find('.content-item.content-columns').removeClass('hidden');

						// Hide active content
						var activeContent = mf.elements.content.container.find('.content-subscriber.' + mf.cssClasses.ACTIVE);
						mf.ui.hideElement( activeContent );
						activeContent.removeClass( mf.cssClasses.ACTIVE );

                        mf.elements.content.container.find('.subscriber-list ul > li.active a').removeClass( 'background-active' );
						mf.elements.content.container.find('.subscriber-list .' + mf.cssClasses.ACTIVE).removeClass( mf.cssClasses.ACTIVE );


						// Show new content
						$(this).closest('li').addClass( mf.cssClasses.ACTIVE );

                        if($(this).closest('li a').hasClass('contact')){
                            $(this).closest('li a').addClass('background-active');
                        }

						targetContent.addClass( mf.cssClasses.ACTIVE );
						mf.ui.restoreElement( targetContent );

						// Update header text
                        //MF-478: mf.content.updateHeaderText( targetContent );

						// Calculate columns height
						mf.content.setColmnsHeight();

                        //Set height to container
                        var currentWindowsHeight = $(window).height();
                        targetContent.css('height', '80%');
                        targetContent.css('position', 'relative');

                        targetContent.parent().parent().css('height', '100%');

                        var columns = targetContent.find('div.content-item.content-columns').children();
                        var size = 0;
                        $.each(columns, function(index, value){
                           size = parseInt($(value).css('min-height').replace('px', '')) + size;
                        });

                        //targetContent.find('.user-content-subscriber').css('min-height', (size-(currentWindowsHeight-350))+'px');

						// Setup Subtabs
						mf.ui.draggableSubTabsNavigation(targetContent);

					}else{
						throw Error('No target element for content navigation (.subscriber-list a click event)');
					}
				});

                $(document).on('click', '.content-subscriber .add-note,.content-subscriber .add-note-icon', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var personId = $(this)[0].getAttribute('data-person-id');
                    var personName = $(this)[0].getAttribute('data-person-name');
                    var contentId = $(this)[0].getAttribute('data-content-id');
                    var contentName = $(this)[0].getAttribute('data-content-name');

                    var scope = angular.element($('[data-ng-controller="NotesPopupController"]')).scope();
                    scope.$apply(function(){
                        scope.on = true;
                        scope.setNote(parseInt(personId),personName, parseInt(contentId), contentName);
                    })
                });

				// Cue info tooltip
				$(document).on('click', '.content-cue .icon-info', function(e){
					e.preventDefault();
					e.stopPropagation();
					var link = $(this);
					var iconOffset = link.offset();
					var text = link[0].getAttribute('data-cue-description');
					if(text && text !== ''){
						$('.content-cue-description').remove();
						$.tmpl( mf.content.templates.tmplContentCueInformation , {description: text} )
							.appendTo( $('body') );

						var infoPosition = {};
						var currentInfo = $('.content-cue-description');
						var positionClass = '';
						var infoCss = {};
						var windowWidth = $(window).width();

						infoPosition.top = iconOffset.top - ( Math.round(currentInfo.height() / 2) );

						if(iconOffset.left > (windowWidth / 2) ){
							positionClass = mf.cssClasses.POSITION_RIGHT;
							infoCss = {top: infoPosition.top + 'px', right: (windowWidth - iconOffset.left + 15) + 'px', 'z-index':'9999'};
						}else{
							positionClass = mf.cssClasses.POSITION_LEFT;
							infoCss = {top: infoPosition.top + 'px', left: ( iconOffset.left + 25) + 'px', 'z-index':'9999'};
						};

						// Bind tooltop kill event.
						currentInfo.css( infoCss )
							.addClass( positionClass )
							.bind('click', function(){
								$(this).remove();
							});
					};
				});

                // Cue comment tooltip
                $(document).on('click', '.content-cue .icon-comment', function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    mf.content.getUserCueComment($(this));

                });

			}catch(ex){
				mf.console.error(ex, 'mf.content.setEvents');
			}
		},

        getUserCueComment: function(cueObj){
            var url;
            try{
                var link = cueObj;
                var personId = link[0].getAttribute('data-cue-person-id');
                var contentId = link[0].getAttribute('data-cue-content-id');
                var cueHash = link[0].getAttribute('data-cue-hash');

                url = mf.services.url.personComments.replace('__ACCOUNT_CONTENT_ID__',contentId).replace('__PERSON_ID__',personId);

                if(cueHash != null){
                    url += '?hash=' + encodeURIComponent(cueHash);
                };

                mf.ajax.doAjaxCall({
                    url: url,
                    cache: false,
                    callback: function(response){
                        try{

                            if(!response.data && !response.data.feed) throw Error('response.data.feed is undefined');
                            if(response.data.feed.length > 0){
                                mf.content.renderCueComment(response.data,cueObj);
                            };
                        }catch(ex){
                            mf.console.error(ex, 'mf.content.getUserCueComment (get person cue comment callback)');
                        };
                    }
                });

            }catch(ex){
                mf.console.error(ex, 'mf.content.getUserCueComment');
            };
        },

        hasCueComment: function(personId, contentId, cueHash, link){
            var url;
            try{

                var personId = personId;
                var contentId = contentId;
                var cueHash = cueHash;

                url = mf.services.url.personComments.replace('__ACCOUNT_CONTENT_ID__',contentId).replace('__PERSON_ID__',personId);

                if(cueHash != null){
                    url += '?hash=' + encodeURIComponent(cueHash);
                };

                mf.ajax.doAjaxCall({
                    url: url,
                    cache: false,
                    callback: function(response){
                        try{

                            if(!response.data && !response.data.feed) throw Error('response.data.feed is undefined');

                            if(response.data.feed.length > 0){
                                $(link[0]).show();
                            };
                        }catch(ex){
                            mf.console.error(ex, 'mf.content.getUserCueComment (get person cue comment callback)');
                        };
                    }
                });

            }catch(ex){
                mf.console.error(ex, 'mf.content.getUserCueComment');
            };
        }

	}
})();

// --------------------------------------
// Mindframe Modal
(function(){
	mf.modal = {
		cssClasses:{
			MODAL: 'mf-modal',
			MODAL_CONTENT: 'mf-modal-content'
		},
		init: function(element){
			element.bind('openMe', function(){
				$(this)
						.removeClass( mf.cssClasses.HIDDEN )
						.animate({'opacity':1}, 300, function(){
							element.find( '.' + mf.modal.cssClasses.MODAL_CONTENT )
								.removeClass( mf.cssClasses.HIDDEN )
								.animate({'opacity':1}, 300);
				});

                showSettingsByStorage();

                //bug fix: when the selection is "audio/video" in preference, click "Close" to exit preference and click "Settings"
                //to enter preference again , the preview video will disappear.
                //So, I guess the preview video must be shown after the Div been shown.
                clearTimeout(mf.timeouts['showVideoView']);
                mf.timeouts['showVideoView'] = setTimeout(function(){
                    $vedioDiv = element.find("#p-c-4");
                    if ($vedioDiv.is(":visible")) {
                        $vedioDiv.show();
                        $(document).cwic('addPreviewWindow',{previewWindow: 'localSettingsPreviewVideo' });

                    }
                }, 550);



            }).bind('closeMe', function(){
				element.find( '.' + mf.modal.cssClasses.MODAL_CONTENT ).addClass( mf.cssClasses.HIDDEN );
                element.addClass( mf.cssClasses.HIDDEN );


            });

			// Close icon
			element.find('.close-modal').bind('click', function(e){
				e.preventDefault();
				element.trigger('closeMe');

            });

			// Overlay click close
			if(element.hasClass('mf-modal-overlayclose')){
				element.bind('click', function(e){
					if( $(e.target).hasClass('mf-modal') ){
						element.trigger('closeMe');
					}
				})
			}

		}
	}
})();


// --------------------------------------
// Mindframe Helpers
(function(){
	mf.helper = {
		isElementOverflowed: function(element){
			return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
		}
	}
})();

mf.init();