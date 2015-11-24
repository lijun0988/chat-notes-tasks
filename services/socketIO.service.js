angular.module('socketIO.service', [])
    .factory('$socket', function ($rootScope, PathService) {
    var socket
    if (typeof io !== 'undefined') {
    	console.log(PathService.getSocketUrl());
        socket = io.connect(PathService.getSocketUrl(), {'reconnect': true, 'reconnection delay': 10000});
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args;
                    args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args;
                    args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },

            'socket': socket
        };
    } else {
        return undefined;
    }
});