'use strict';


window.addEventListener("message", receiveNoteMessage, false);

function receiveNoteMessage(event) {
    if (event.data && event.data.messageType==='notespop') {

        console.log("****************parent window sending refresh to child");
        var scope = angular.element($(".notes-module")).scope();

        scope.$apply(function(){
            scope.isPopWindow = true;
            scope.noteSearchTerm = event.data.message.SearchString;
            scope.noteSelectedFromParent.selectedNote = event.data.message.CurrentNote;

            setTimeout(function(){scope.selectedNote = event.data.message.CurrentNote;},500);


            if (event.data.message.CurrentNote)
                scope.noteSelectedFromParent.id = event.data.message.CurrentNote.id;
            scope.init();

        })
    }

}
/* App Module */
var mfApp = angular.module('mfAppPopup', [
    'path.service', 'ngResource', 'resources','notes.module', 'ngTagsInput'
]);

mfApp.controller('NotesPopoutController',
    [   '$scope',
        '$rootScope',
        function($scope, $rootScope){

}]);






 
