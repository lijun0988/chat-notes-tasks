'use strict';

var module = angular.module('resources', ['ngResource']);

module.factory('Resource', [ '$resource', function($resource) {
	return function(url, params, methods) {
		var defaults = {
		    get : {
				method : 'get',
	            transformResponse: function (data, headersGetter) {
	                var wrapped = angular.fromJson(data);
	            	if(wrapped.success){
	            		if(wrapped.payload){
	            			return wrapped[wrapped.payload];
	            		}else if(wrapped.data && !wrapped.total){
	            			return wrapped.data;
	            		}else{

	            			return wrapped;
	            		}
	            	}
	            }
		    },
            search: {
                method : 'post',
                transformResponse: function (data, headersGetter) {
                    var wrapped = angular.fromJson(data);
                    if(wrapped.success){
                        if(wrapped.payload){
                            return wrapped[wrapped.payload];
                        }else if(wrapped.data && !wrapped.total){
                            return wrapped.data;
                        }else{

                            return wrapped;
                        }
                    }
                }
            },
		    query : {
				method : 'get',
	            transformResponse: function (data, headersGetter) {
	                var wrapped = angular.fromJson(data);
	            	if(wrapped.success){
	            		if(wrapped.payload){
	            			return wrapped[wrapped.payload];
	            		}else if(wrapped.data&&!wrapped.total){
	            			return wrapped.data;
	            		}else{
	            			return wrapped;
	            		}
	            	}
	            }
		    },
			update : {
				method : 'put',
				isArray : false
			},
			create : {
				method : 'post'
			},
            remove : {
                method : 'delete'
            }
		};

		methods = angular.extend(defaults, methods);

		var resource = $resource(url, params, methods);
		resource.prototype.$save = function() {
            if (!this.id) {
                return this.$create();
            } else {
                return this.$update();
            }
        };
        return resource;
    };
} ]);


module.factory( 'User', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getUserResoruceUrl(), { id: '@id' , account : '@account' } );
}]);

module.factory( 'Contacts', [ 'Resource', 'PathService', function( $resource, PathService) {
    return $resource( PathService.getMindFrameContactsUrl(), { id: '@id' , account : '@account' } );
}]);

module.factory( 'Person', [ 'Resource', 'PathService', function( $resource, PathService) {
	var url = PathService.getPersonResourceUrl();
    return $resource( url , { account:'@account', query : '@query' } );
}]);

module.factory( 'Contact', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getContactResoruceUrl(), { id: '@id' , account : '@account', syncwithmindframe: '@syncwithmindframe' } );
}]);

// Notes
module.factory( 'Note', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getNoteResoruceUrl(), { id: '@id' , account : '@account' } );
}]);
module.factory( 'ShareNote', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getShareNoteUrl(), { id: '@id' , account : '@account' } );
}]);


module.factory( 'NoteSearch', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getNoteSearchResoruceUrl(), { account : '@account' } );
}]);

module.factory( 'NotePersonSearch', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getNoteSearchPersonResoruceUrl(), { id: '@id' ,account : '@account' } );
}]);

// Tasks
module.factory( 'TaskRes', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getTaskResourceUrl(), { id: '@id' , account : '@account' } );
}]);
module.factory( 'ShareTask', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getShareTaskUrl(), { id: '@id' , account : '@account' } );
}]);

module.factory( 'TaskSearchRes', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getTaskSearchResourceUrl(), { account : '@account' } );
}]);

module.factory( 'TaskPersonSearchRes', [ 'Resource', 'PathService', function($resource, PathService) {
    return $resource( PathService.getTaskSearchPersonResourceUrl(), { id: '@id' ,account : '@account' } );
}]);

module.factory('Task', function ( $rootScope, Resource, TaskRes, TaskSearchRes, TaskPersonSearchRes ) {

    return {

        add: function (task, success, error) {
            var task = new TaskRes(task);
            if( $rootScope.selectedContact && $rootScope.selectedContact.personId ) {
                task.createdFor = {
                	id: $rootScope.selectedContact.personId
                }
            }
            task.$create({account:$rootScope.currentAccount},  success, error);
        },

        get: function (success, error) {
            return TaskPersonSearchRes.query({account: $rootScope.currentAccount, id: $rootScope.selectedContact.id, max:99, offset:0}, success, error);
        },

        search: function( searchParams, success, error) {
            TaskSearchRes.search(searchParams,  success, error);
        },

        update: function(data, success, error) {
            var params = {id: data.id, account: $rootScope.currentAccount};
            var task = new TaskRes(data);
            var sharedPeopleList = [];

            if (task.sharedPeopleList && task.sharedPeopleList.length>0) {
                for (var i=0;i<task.sharedPeopleList.length;i++) {
                    if(!task.sharedPeopleList[i].id) {
                        sharedPeopleList.push(task.sharedPeopleList[i]);
                    }
                    else{
                        sharedPeopleList.push(task.sharedPeopleList[i].id);
                    }
                }
                task.sharedPeopleList = sharedPeopleList;
            }

            task.$update(params, success, error);
        },

        remove: function (data, success, error) {
            var task = new TaskRes(data);
            var params = {'id': task.id, account:$rootScope.currentAccount};
            task.$remove(params, success, error);
            return;
        }

    };
});

