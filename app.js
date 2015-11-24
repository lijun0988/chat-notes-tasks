'use strict';

/* App Module */
var mfApp = angular.module('mfApp', [
    'resources',
    'ngRoute',
    'contacts.module',
    'login.module',
    'main.module',
    'notes.module',
    'tasks.module',
    'settings.module',
    'content.module',
    'contactPane.module',
    'authentication.service',
    'callmanager.authentication.service',
    'path.service',
    'encoding.service',
    'storage.service',
    'postmessage.service',
    'ui.bootstrap',
    'findContacts.module',
    'unrecognizedContact.module',
    'socketIO.service',
    'message.service',
    'ngTagsInput'
]);

// Use following code to execute code on controller change.
mfApp.run(function ($rootScope, $socket, $location, $timeout, $window, PathService, StorageService) {

    $rootScope.taskNotifications = {
        createdForId: '',
        tasksId: []
    };
    //'829','830'
    $rootScope.notesNotifications = {
        createdForId: '',
        notesId: []
    };

    //TODO Note Share
    $rootScope.$watch('selectedTabbedContent', function(newValue,oldValue){
        if (oldValue=='notes' && newValue!='notes') {
            console.debug('notes: lost notes UI focus .');
        }
    });

    //Listeners for notification from nodejs
    if ($socket !== undefined) {

        var heartBeat = function(){

            if ($socket.socket.disconnected === true) {
                $socket.socket.connect(PathService.getSocketUrl());
            }

            $socket.emit('heartBeat', {data: 'socket alive'});
            setTimeout(heartBeat, 30000);
        };

        heartBeat();

        $socket.on('connected', function (socket_id) {
            $rootScope.$on('user_initializated', function () {
                $socket.emit('activate_notifications', { 'socket_id': socket_id, 'user_id': mf.login.user.person_id });
            });

        });



        $socket.on('OnNotifiedTask_created', function (data) {
            console.log(data);
            $rootScope.taskNotifications.createdForId = data.createdForId;
            var taskIdNotif = data.taskId.trim();
            if ($rootScope.taskNotifications.tasksId.length == 0 || $rootScope.taskNotifications.tasksId.indexOf(taskIdNotif) == -1) {
                $rootScope.$broadcast('refreshTaskForMe');
                $rootScope.taskNotifications.tasksId.push(taskIdNotif);
                /* don't need to clear queue, only user click the remove the queue items
                $timeout(function () {
                    $rootScope.taskNotifications = {
                        createdForId: '',
                        tasksId: []
                    };
                }, 300000);*/
            }

            if (typeof Awesome != 'undefined' && Awesome.handleEvent != 'undefined') {
                var isNoteAndTaskSoundNeeded = StorageService.userGet('settings.alertSounds.noteAndTaskSound');
                if(isNoteAndTaskSoundNeeded)
                     Awesome.handleEvent('NewTaskAssignedToMe', JSON.stringify(data), isNoteAndTaskSoundNeeded);
            }
        });

        $socket.on('OnNotifiedTask_updated', function (data) {
            console.log(data);
            $rootScope.taskNotifications.createdForId = data.createdForId;
            var taskIdNotif = data.taskId.trim();
            if ($rootScope.taskNotifications.tasksId.length == 0 || $rootScope.taskNotifications.tasksId.indexOf(taskIdNotif) == -1) {
                $rootScope.$broadcast('refreshTaskForMe');
                $rootScope.taskNotifications.tasksId.push(taskIdNotif);
            }

            if (typeof Awesome != 'undefined' && Awesome.handleEvent != 'undefined') {
                var isNoteAndTaskSoundNeeded = StorageService.userGet('settings.alertSounds.noteAndTaskSound');
                if(isNoteAndTaskSoundNeeded)
                    Awesome.handleEvent('TaskAssignedToMeUpdated', JSON.stringify(data), isNoteAndTaskSoundNeeded);
            }
        });

        $socket.on('OnNotifiedTask_deleted', function (data) {
            console.log(data);
        });

        $socket.on('OnNotifiedNote_created', function (data) {
            console.log(data);
            $rootScope.notesNotifications.createdForId = data.createdForId;
            var noteIdNotif = data.noteId.trim();
            if ($rootScope.notesNotifications.notesId.length == 0 || $rootScope.notesNotifications.notesId.indexOf(noteIdNotif) == -1){
                $rootScope.$broadcast('refreshNotesForMe');
                $rootScope.notesNotifications.notesId.push(noteIdNotif);
                /*
                $timeout(function () {
                    $rootScope.notesNotifications = {
                        createdForId: '',
                        notesId: []
                    };
                }, 300*1000);*/
            }

            if (typeof Awesome != 'undefined' && Awesome.handleEvent != 'undefined') {
                var isNoteAndTaskSoundNeeded = StorageService.userGet('settings.alertSounds.noteAndTaskSound');
                if(isNoteAndTaskSoundNeeded)
                     Awesome.handleEvent('NewNoteAssignedToMe', JSON.stringify(data), isNoteAndTaskSoundNeeded);
            }
        });

        $socket.on('OnNotifiedNote_updated', function (data) {
            console.log(data);
            $rootScope.notesNotifications.createdForId = data.createdForId;
            var noteIdNotif = data.noteId.trim();
            if ($rootScope.notesNotifications.notesId.length == 0 ||  $rootScope.notesNotifications.notesId.indexOf(noteIdNotif) == -1) {
                $rootScope.$broadcast('refreshNotesForMe');
                $rootScope.notesNotifications.notesId.push(noteIdNotif)
            }

            if (typeof Awesome != 'undefined' && Awesome.handleEvent != 'undefined') {
                var isNoteAndTaskSoundNeeded = StorageService.userGet('settings.alertSounds.noteAndTaskSound');
                if(isNoteAndTaskSoundNeeded)
                    Awesome.handleEvent('NoteAssignedToMeUpdated', JSON.stringify(data), isNoteAndTaskSoundNeeded);
            }
        });

        $socket.on('OnNotifiedNote_deleted', function (data) {
            console.log(data);
        });
    }
});

// Global definitions
var global = {};
global.timeOuts = [];