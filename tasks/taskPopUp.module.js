'use strict';

window.addEventListener("message", receiveTaskMessage, false);

function receiveTaskMessage(event) {
    if (event.data && event.data.messageType === 'taskpopup') {
        console.log("****************parent window sending refresh to child");
        var scope = angular.element($(".tasks-module")).scope();

        scope.$apply(function () {
            scope.isPopWindow = true;
            scope.clearGroups();
            scope.tasksList = [];
            scope.taskSearchTerm = event.data.message.SearchString;
            scope.taskSelectedFromParent.selectedTask = event.data.message.CurrentTask;

            setTimeout(function () { scope.selectedTask = event.data.message.CurrentTask; }, 500);
            
            if (event.data.message.CurrentTask)
                scope.taskSelectedFromParent.id = event.data.message.CurrentTask.id;
            scope.init();
        })
    }
}

/* App Module */
var mfApp = angular.module('mfAppPopupTasks', [
    'path.service', 'ngResource', 'resources', 'tasks.module', 'storage.service', 'ui.bootstrap', 'ngTagsInput'
]);

mfApp.controller('TasksPopoutController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

}]);