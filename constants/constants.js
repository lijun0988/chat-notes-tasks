'use strict';

var API_URL = '@APIURL@';
var SOCKET_URL = '@SOCKETURL@';

//place-holders were not being replaced by build server, use existing logic to get api url
if (API_URL.indexOf('http') === -1 || SOCKET_URL.indexOf('http') === -1){
	var subdomains = location.hostname.split('.');
	if(subdomains[0].indexOf('local')!=-1 || subdomains[0] === 'localhost') {
		//local, use defined services
		API_URL= 'https://ares.fidelus.com/mindframe-backend/api';
		SOCKET_URL = 'https://ares.fidelus.com:443';
        //API_URL= 'http://ares.fidelus.com:8080/mindframe-backend/api';
        //SOCKET_URL = 'http://ares.fidelus.com:3000';
	}			
	else {
		API_URL= location.protocol + '//'+ location.hostname + (location.port ? ':'+location.port : '') + '/mindframe-backend/api';
		SOCKET_URL = location.protocol + '//'+  location.hostname + ':3000';
	}
}

mfApp.constant('PATHS', {
	APP_ID: 'app://com.akkadian.mindframe',
	BASE_SERVICE_API_URL: API_URL + '/',
	RES_ACCOUNT_CONTENT_PROVIDER: ':account/mindframe/accountContent/:id',
	RES_CONTACT_IMAGE: '/userImage/:personId',
	RES_CONTACT: ':account/mindframe/contacts/:id',
	RES_NOTE: ':account/mindframe/note/:id',
    RES_NOTE_SHARE: ':account/mindframe/sharenote/:id',
	RES_NOTE_SEARCH: ':account/mindframe/note/search',
	RES_NOTE_PERSON_SEARCH: ':account/mindframe/note/person/:id',
	RES_TASK: ':account/mindframe/task/:id',
    RES_TASK_SHARE: ':account/mindframe/sharetask/:id',
	RES_TASK_SEARCH: ':account/mindframe/task/search',
	RES_TASK_PERSON_SEARCH: ':account/mindframe/task/person/:id',
	RES_USER: ':account/mindframe/person/:id',
	RES_ACCOUNT_CONFIG: "/account/getAccountConfig",
    RES_AWS_S3 : 'mindframe/s3/formparams',
    RES_AWS_S3_SIGNED_URL : 'mindframe/s3/signedurl',
	ACCESS_TOKEN_URL: 'user/getAccessToken',
	ACCESS_ME_URL: 'user/me',
	PERSON_SEARCH_URL: '/mindframe/person/search',
    PERSON_SEARCH_URL2: ':account/mindframe/person/search',
    WEBEX_MEETING: '/mindframe/webex/meeting',
    WEBEX_GETUSER_CONFIG: '/mindframe/webex/user/getWebExConfig',
    WEBEX_SETUSER_CONFIG: '/mindframe/webex/user/saveWebExConfig',
	SOCKET_URL : SOCKET_URL,
	CONTENT_GROUPS:"/mindframe/groups",
	JABBER: {
		DOMAIN: "fidelus.com", // TBD: make this dynamic
		HTTP_BINDING_URL: "https://im1.ciscowebex.com/http-bind"
	}
})
.constant('USER_STATUSES', {
	AVAILABLE: {value: 'available', text: 'Available'},
	AWAY: {value: 'away', text: 'Away'},
	XA: {value: 'xa', text: 'Extended away'},
	DND: {value: 'dnd', text: 'Do Not Disturb'},
	CHAT: {value: 'chat', text: 'Chat'}
})
.constant('SETTINGS', {
		WINDOW_SIZE : {
			WIDTH_CHAT:270,
			WIDTH_CUES:882,
			HEIGHT:768,
			WIDTH_CHAT_WINDOW: 400
		}
 })
.constant('ANALYTICS', {
	ON_LOGGED_IN: "on_logged_in",
	ON_CHAT : "on_chat",
	ON_CALLS_INBOUND : "on_calls_inbound",
	ON_CALLS_OUTBOUND : "on_calls_outbound",
	ON_CALLS_INBOUND_VIDEO : "on_calls_inbound_video",
	ON_CALLS_OUTBOUND_VIDEO : "on_calls_outbound_video",
	ON_PROFILE_ACCESS : "on_profile_access",
	ON_TABS_ACCESS : "on_tabs_access",
	ON_SEARCHES : "on_searches",
	ON_NOTE_CREATE : "on_note_create",
	ON_TASK_CREATE : "on_task_create"
})
.constant('CALL_MANAGER',{
	CUCM: 'nyc-cucm-pub'
});

