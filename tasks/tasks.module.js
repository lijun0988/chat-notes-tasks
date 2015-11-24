'use strict';

angular.module('tasks.module', ['resources', 'popup.service'])

.controller('TasksPopupController',
	['$scope', '$rootScope', '$timeout', 'PATHS', 'ANALYTICS', 'TaskResource',
	function ($scope, $rootScope, $timeout, PATHS, ANALYTICS, TaskResource) {

	    $scope.on = false;

	    $scope.editSubject = false;
	    $scope.editText = false;
	    $scope.timeouts = [];
	    $scope.taskReady = false;
	    
	    // Task edition
	    $scope.enableEditSubject = function (e) {
	        $scope.editSubject = true;
	        setTimeout(function () { $(e.target).next('.edit').focus() }, 20);
	    }

	    $scope.enableEditText = function (e) {
	        $scope.editText = true;
	        setTimeout(function () { $(e.target).next('.edit').focus() }, 20);
	    }

	    $scope.setTask = function (personId, personName, contentId, contentName) {
	        var personName = $rootScope.selectedContact.displayName
	        $scope.taskAdd = {
	            title: 'New Task',
	            text: '',
	            createdFor: { id: personId, name: personName },
	            content: { id: contentId },
	            personal: true,
	            isSaved: true
	        };

	        $timeout(function () { $scope.taskReady = true }, 100);
	    }

	    $scope.saveTask = function () {
	        analytics.trackTag(ANALYTICS.ON_TASK_CREATE);
	        if ($scope.taskAdd.isSaved) return;
	        $scope.taskReady = false;
	        $scope.on = false;
	        TaskResource.add($scope.taskAdd, function (data) { });
	        $scope.taskAdd = {};
	    }

	    $scope.getNowTime = function () {
	        return new Date().getTime();
	    }
	    $scope.remove = function () {
	        $scope.on = false;
	        $scope.taskReady = false;
	    }

	    $scope.getTabName = function (tabId) {
	        if (tabId == undefined) {
	            return "General"
	        }
	        return $.grep($rootScope.selectedPersonContent, function (e) { return e.id == tabId; })[0].name;
	    }

	    $scope.$watch('taskAdd.title', function (newValue, oldValue) {
	        if (newValue != oldValue && $scope.taskReady) {
	            $scope.taskAdd.isSaved = false;
	        };
	    });

	    $scope.$watch('taskAdd.text', function (newValue, oldValue) {
	        if (newValue != oldValue && $scope.taskReady) {
	            $scope.taskAdd.isSaved = false;
	        };
	    });


	}])


.controller('TasksController', 
	['$scope',
    '$rootScope',
    '$http',
    '$log',
    '$timeout',
    '$sce',
    '$q',
    'PATHS',
    'ANALYTICS',    
    'Resource',    
    'TaskResource',
    'PopupService',
    'PathService',
	function ($scope, $rootScope, $http, $log, $timeout, $sce, $q, PATHS, ANALYTICS, Resource, TaskResource, PopupService, PathService) {

	    var parentScope;

        $scope.selectedTask = {};
        $scope.previousTask = {};
        $scope.tasksList = [];

        $scope.editSubject = false;
        $scope.editText = false;
        $scope.timeouts = [];
        $rootScope.isShowTaskInfo = false;

        $scope.isAllTaskSelected = true;

        $scope.strTipsAll = "";
        $scope.strTipsMy = "";

        $scope.taskGroups = [
            {groupName: 'New', visible: true, tasks:[]},
            {groupName: 'Overdue', visible: true, tasks:[]},
            {groupName: 'Today', visible: true, tasks:[]},
            {groupName: 'Tomorrow', visible: true, tasks:[]},
            {groupName: 'Future', visible: true, tasks:[]},
            {groupName: 'Completed', visible: true, tasks:[]}];
        $scope.taskGroupsIndexes = [];
        
        $scope.taskGroupsIndexes['New']         = 0;
        $scope.taskGroupsIndexes['Overdue']     = 1;
        $scope.taskGroupsIndexes['Today']       = 2;
        $scope.taskGroupsIndexes['Tomorrow']    = 3;
        $scope.taskGroupsIndexes['Future']      = 4;
        $scope.taskGroupsIndexes['Completed']   = 5;
        
        $scope.allowUpdate = true;
        $scope.priorities = [];
        $scope.priorities['NONE'] = {text:'None', level: []};
        $scope.priorities['NORMAL'] = {text:'Normal', level: [1]};
        $scope.priorities['MEDIUM'] = {text:'Medium', level: [1,1]};
        $scope.priorities['HIGH'] = {text:'High', level: [1,1,1]};
        $scope.status = {
            INPROGRESS: 'INPROGRESS',
            COMPLETED: 'COMPLETED'
        };

        $rootScope.taskFilters = [];
        $rootScope.taskFilters['scope'] = false;
        $rootScope.taskFilters['tabs'] = false;
        $rootScope.taskFilters['personal'] = false;

        $rootScope.taskSearchFilter = [];
        $scope.taskSearchFilter['CreatedFor'] = true;
        $scope.taskSearchFilter['CreatedBy'] = false;
        $scope.taskSearchFilter['HideComplete'] = false;
        $scope.today = '';
        $scope.dateOptions = {
            formatDay: "'dd'",
            formatMonth: "'mm'",
            formatYear: "'yy'",
            datepickerPopup: "'yyyy-MM-dd'"
        };

        $rootScope.deleteTaskContextual = false;
        $scope.dataParent = {};

        $scope.popupData = {
                CreatedFor: '',
                CreatedBy: '',
                SearchString : '',
                HideComplete :'',
                CurrentTask: []
        };

        $scope.taskSelectedFromParent =
        {
            id: 0,
            task: null,
            selectedTask: null
        };

        $scope.init = function() {
            if (!$scope.isPopWindow)
                $scope.selectedTask = undefined;
            else {
                $rootScope.dataParent = window.opener.getProfileForPopup();
                parentScope = $rootScope.dataParent.rootScopeVar;
                if (!$rootScope.dataParent.selectedPersonContent) return;
                $rootScope.myPersonId = parentScope.myPersonId;
                $rootScope.credentials = parentScope.credentials;
                $rootScope.selectedContact = parentScope.selectedContact;
                $rootScope.taskNotifications = parentScope.taskNotifications;
                $rootScope.currentAccount = parentScope.currentAccount;
                $http.defaults.headers.common['Access-Token'] = parentScope.credentials.accessToken;
            }

            $scope.getTasks();
            $scope.today = $scope.getDefaultDueAt();
            $timeout(function () {
                mf.ui.fitElementsHeight($('.tasks-module [data-fixed-heigth]'));
            }, 300);
        }

        $scope.toggleFilter = function (isAll) {
            if (isAll == 'true') {
                $scope.isAllTaskSelected = true;

            } else {
                $scope.isAllTaskSelected = false;

            }
            $scope.clearGroups();
            $scope.search();
        }

        $scope.selectTask = function (task) {
            if (!task) {
                $scope.selectedTask = undefined;
            } else {
                setTaskShareListOnUI(task, task);
                $scope.selectedTask = task;

                $scope.previousTask.title = task.title;
                $scope.previousTask.text = task.text;
                $scope.previousTask.personal = task.personal;
                $scope.selectedTask.isEditable = $scope.isEditable($scope.selectedTask);
                $scope.selectedTask.status = task.status;

                //to disable the tags list component
                if ($scope.selectedTask.isEditable == false || !($scope.selectedTask.createdBy.id == $rootScope.myPersonId)) {
                    $('tags-input input').attr('disabled', true);
                    for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                        $scope.selectedTask.sharelist[i].canRemove = true;
                    }
                } else {
                    $('tags-input input').removeAttr('disabled');
                    for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                        $scope.selectedTask.sharelist[i].canRemove = false;
                    }
                }
            }
        }

	    $scope.isTaskDraft = function (task) {
            if (!task || !task.id) return false;

            var needToBeDraftBySharePeople = false;

            if (task.sharelist && task.sharelist.length == 1 && task.sharedPeopleList && task.sharedPeopleList.length == 1
                || (!task.sharelist && task.sharedPeopleList && task.sharedPeopleList.length == 1)
                || (task.sharelist && task.sharelist.length == 1 && task.sharedPeopleList && task.sharedPeopleList.length == 0)) {
                needToBeDraftBySharePeople = true;
            }

            var isLockedByMe = false;
            if (task.lockedBy && task.lockedBy.id && task.lockedBy.id == $rootScope.myPersonId) {
                isLockedByMe = true;
            }

            if (isLockedByMe && needToBeDraftBySharePeople || task.isAddTask) {
                return true;
            }

            return false;
        }

        $scope.shareTask = function (e) {
            e.stopPropagation();
            if ($scope.selectedTask.isEditable == false) return;
            if (!$scope.selectedTask || !$scope.selectedTask.id) {
                $log.debug('sharing task with people , but selectedTask is null');
                return;
            }
            $log.debug('sharing task with people , task id:' + $scope.selectedTask.id);
            $rootScope.isShowTaskDialog = true;
            if ($scope.selectedTask.sharelist && $scope.selectedTask.sharelist.length > 0) {
                $rootScope.$broadcast('confirmShare', $scope.selectedTask);
                $timeout(function () { $rootScope.isShowTaskDialog = false; }, 1500);
                //call share publish ws
                var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/sharetask/publish/" + $scope.selectedTask.id;
                $http.post(url).then(function (successResp) {
                    $log.debug('Server http response of publish task successful:' + successResp);
                    var tasksResp = successResp.data.data;
                    if (tasksResp.id) {
                        for (var n = 0; n < $scope.tasksList.length; n++) {
                            if ($scope.tasksList[n].id == tasksResp.id) {
                                $scope.tasksList[n].isNeededPublish = tasksResp.isNeededPublish;
                                $scope.tasksList[n].lockedBy = {};
                                $scope.tasksList[n].personal = tasksResp.personal;
                                break;
                            }
                        }

                        if ($scope.selectedTask && $scope.selectedTask.id == tasksResp.id) {
                            $scope.selectedTask.isNeededPublish = tasksResp.isNeededPublish;
                            $scope.selectedTask.lockedBy = {};
                            $scope.selectedTask.personal = tasksResp.personal;
                            $scope.selectedTask.isAddTask = false;
                        }

                        $scope.groupTasks($scope.tasksList, true);

                        if (!$scope.$$phase) { $scope.$apply() };
                        sendMsgToParent();
                        sendMsgToPopup();
                    }
                }, function (errResponse) {
                    $log.error('Server http response of publish   err:' + errResponse);
                })
                $scope.selectedTask.personal = false;
            }
            else if (!$scope.selectedTask.sharelist || $scope.selectedTask.sharelist.length == 0) {
                $rootScope.$broadcast('blankShare', $scope.selectedTask);
            }
        }

        $scope.showTaskInfo = function (e) {
            e.stopPropagation();
            $rootScope.isShowTaskInfo = !$rootScope.isShowTaskInfo;
            if ($rootScope.isShowTaskInfo) {
                $scope.unShownAllExcept('taskinfo');
            }
        }
        $scope.showTaskInfoDiv = function (e) {
            e.stopPropagation();
            $rootScope.isShowTaskInfo = true;
        }

        function setTaskShareListOnUI(task, taskUI) {
            if (task.sharelist && task.sharelist.length > 0) return;
            taskUI.sharelist = [];
            if (task.sharedPeopleList && task.sharedPeopleList.length > 0) {
                for (var i = 0; i < task.sharedPeopleList.length; i++) {
                    taskUI.sharelist.push({ displayName: task.sharedPeopleList[i].firstName + ' ' + task.sharedPeopleList[i].lastName, id: task.sharedPeopleList[i].id });
                }
            }
        }

        $scope.$on('saveShareList', function (event, task) {
            $scope.onTagsAddRemove();
        });

        $scope.onTagsAddRemove = function () {
            $log.debug('sharelist is changing.....');
            //change opacity of popup dialog opacity from 0.5 to 1 (damit ng-class not work)
            if ($scope.selectedTask.sharelist && $scope.selectedTask.sharelist.length > 0) {
                $('section.share-popup footer .right').addClass('enable');
                $('section.share-popup footer .right').attr('disabled', false);
            } else {
                $('section.share-popup footer .right').removeClass('enable');
                $('section.share-popup footer .right').attr('disabled', 'disabled');
            }
            if ($scope.selectedTask) {
                if (!$scope.selectedTask.sharelist) {
                    $scope.selectedTask.sharelist = [];
                }
                
                $scope.selectedTask.sharedPeopleList = [];

                $log.debug('Saving sharelist in tasks ' + $scope.selectedTask.id + " sharelist count is " + $scope.selectedTask.sharelist.length);
                //call ws to save the sharelist
                var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/task/" + $scope.selectedTask.id;
                var payloadForShareList = { sharedGroupsList: [], sharedPeopleList: [] };
                if ($scope.selectedTask.sharelist && $scope.selectedTask.sharelist.length == 1) {
                    for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                        if ($scope.selectedTask.sharelist[i].id) {
                            payloadForShareList.sharedPeopleList.push($scope.selectedTask.sharelist[i].id);
                        } else {
                            payloadForShareList.sharedGroupsList.push($scope.selectedTask.sharelist[i].displayName);
                        }
                    }
                }
                $log.debug('The http request to save share list : ' + JSON.stringify(payloadForShareList));
                $http.put(url, payloadForShareList).then(function (response) {
                    $log.debug('Server http response of share list save successful:' + response);
                    var task = response.data.data;

                    for (var i = 0; i < $scope.tasksList.length; i++) {
                        if ($scope.tasksList[i] && $scope.tasksList[i].id == task.id) {
                            $scope.tasksList[i] = task;
                            break;
                        }
                    }

                    if ($scope.selectedTask.sharelist.length == 0) {
                        $scope.isDeletingContact = true;
                    }

                    if ($scope.selectedTask.id == task.id) {
                        task.sharelist = $scope.selectedTask.sharelist;
                        if ($scope.selectedTask.sharelist && $scope.selectedTask.sharelist.length > 0) {
                            if ($scope.selectedContact.personId != task.sharelist[0].id) {
                                if ($scope.selectedContact.personId != $rootScope.myPersonId) { //if it's my profile , no need search (search will cause another round of set selectedTask)
                                    //$scope.search();
                                    removeTaskFromUI(task);
                                }
                            }
                        }

                        $scope.selectTask(task);
                    }

// KL:  Not sure if i need the line below
                  if (!$scope.$$phase) { $scope.$apply() };

                    sendMsgToParent();
                    sendMsgToPopup();

                }, function (errResp) {
                    $log.error('Server http response of share list save fail:' + errResponse);

                    if (errResp && errResp.data && errResp.data.data) {
                        var task = errResp.data.data;
                        for (var i = 0; i < $scope.tasksList.length; i++) {
                            if ($scope.tasksList[i].id == task.id) {
                                $scope.tasksList[i].lockedBy = task.lockedBy;
                                break;
                            }
                        }
                        if ($scope.selectedTask.id == task.id) {
                            $scope.selectedTask.lockedBy = task.lockedBy;
                            //disable editing of share list
                            $scope.selectedTask.isEditable = $scope.isEditable($scope.selectedTask);
                            //to disable the tags list component
                            if ($scope.selectedTask.isEditable == false) {
                                $('tags-input input').attr('disabled', true);
                                for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                                    $scope.selectedTask.sharelist[i].canRemove = true;
                                }
                            } else {
                                $('tags-input input').removeAttr('disabled');
                                for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                                    $scope.selectedTask.sharelist[i].canRemove = false;
                                }
                            }
                        }
                    }
                });

            }
        }

	    //show auto complete contacts+groups : should not have duplicate names
        $scope.loadTags = function (query) {
            var resultsArray = [];
            var removeRepeatMap = {};

            var d = $q.defer();
            clearTimeout(window.timoutSearch);
            window.timoutSearch = window.setTimeout(function () {
               
                var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.PERSON_SEARCH_URL + "?query=" + query + "&max=50&includeDisabled=false";

                var personsearch = $http.get(url, { 'cache': false, headers: { 'Access-Token': $rootScope.credentials.accessToken } });

                personsearch.then(function (resp) {
                    clearTimeout(window.timoutSearch);
                    var persons = resp.data.data;
                    if (persons && persons.length > 0) {
                        for (var i = 0; i < persons.length; i++) {
                            persons[i].displayName = persons[i].firstName + ' ' + persons[i].lastName;
                            persons[i].isGroup = false;
                            if (!removeRepeatMap[persons[i].displayName]) {
                                resultsArray.push({ id: persons[i].id, displayName: persons[i].displayName, type: "contacts" });
                                removeRepeatMap[persons[i].displayName] = 'Already Having';
                            } else {
                                removeRepeatMap[persons[i].displayName] = 'Already Having';
                            }
                        }
                    }
                    //var resultsArray = !persons?groups:groups.concat(persons);
                    console.log('results find in search by:' + query + ' length is:' + resultsArray.length);
                    d.resolve(resultsArray);

                }, function (resp) {
                    console.log('no results find in search by:' + query);
                    clearTimeout(window.timoutSearch);
                    d.resolve(resultsArray);
                });
            }, 300);

            return d.promise;
        };

        $scope.isEditable = function (task) {            
            var rootId = $rootScope.credentials.clientAccounts[0].currentPersonId;
            if (!$scope.selectedTask.lockedBy || !$scope.selectedTask.lockedBy.id)
                return true;
            if ($scope.selectedTask.lockedBy.id == rootId)
                return true;

            return false;
        }

        $scope.getTasks = function () {
            $scope.search();
        }

        $scope.addTask = function () {
            analytics.trackTag(ANALYTICS.ON_TASK_CREATE);

            var pName = $rootScope.selectedContact.displayName;
            var defaultDate = new Date();

            var newTask = {
                title: "New Task",
                text: "",
                personal: true,
                createdFor: { id: $rootScope.selectedContact.personId },
                createdAt: defaultDate,
                updatedAt: defaultDate,
                dueAt: null,
                dueAtUi: null,
                isAddTask: true,
                status: $scope.status.INPROGRESS,
                priority: "NONE",
                priorityLabel: "Priority"
            };

            if (!newTask.createdBy) {
/*              newTask.createdBy = { id: $scope.authenticationService.credentials.clientAccounts[0].currentPersonId };
                newTask.createdBy.firstName = $scope.authenticationService.credentials.firstName;
                newTask.createdBy.lastName = $scope.authenticationService.credentials.lastName;
                */
                newTask.createdBy = { id: $rootScope.credentials.clientAccounts[0].currentPersonId };
                newTask.createdBy.firstName = $rootScope.credentials.firstName;
                newTask.createdBy.lastName = $rootScope.credentials.lastName;
            }

            if (!newTask.createdFor.firstName) {
                var name = $scope.splitFullName($rootScope.selectedContact.displayName);
                newTask.createdFor.firstName = name.firstName;
                newTask.createdFor.lastName = name.lastName;
            }

            newTask.isEditable = true;

            $scope.isDeletingContact = false;

            if ($scope.selectedContact.displayName) {
                newTask.sharelist = [];
                newTask.sharelist.push({ displayName: $scope.selectedContact.displayName, id: $scope.selectedContact.personId });
            }

            if (newTask.sharelist && newTask.sharelist.length > 0) {
                newTask.sharedPeopleList = [];
                newTask.sharedPeopleList.push(newTask.sharelist[0].id);
            }


            TaskResource.add(newTask, function (resp) {
                $scope.doingTaskUpdate = false;
                console.log("Task add: " + resp);
                if (resp && resp.data) {
                    var newTask = resp.data;
                   
                    // Add the new task to the first place of the list.
                    $scope.tasksList.unshift(newTask);
                    $scope.taskGroups[0].tasks.unshift($scope.tasksList[0]);
                    // Select as current task
                    $scope.selectTask(newTask);

                    $scope.selectedTask.isDueDateChanged = false;

                    sendMsgToPopup();
                    sendMsgToParent();

                } else {
                    $log.error("Adding task result exception");
                }
            }, function (resp) {
                $log.error('An error occurrend while trying to create a new task');
                console.log(resp);
                $scope.doingTaskUpdate = false;
            });
        }

	    // auto saving or lose focus of current task
        $scope.updateTask = function (task) {
            console.log('Perform $scope.updateTask()');
            console.log($scope.selectedTask);

            $scope.previousTask.title = $scope.selectedTask.title;
            $scope.previousTask.text = $scope.selectedTask.text;
            $scope.previousTask.personal = $scope.selectedTask.personal;

            $scope.doingTaskUpdate = true;

            if (typeof $scope.selectedTask.dueAt != "string") {
                $scope.selectedTask.dueAt = $scope.convertDateToString($scope.selectedTask.dueAt);
            } else if ($scope.selectedTask.dueAt.indexOf('-') != -1) {
                $scope.selectedTask.dueAt = $scope.formatDate($scope.selectedTask.dueAt);
            }

            if (typeof $scope.selectedTask.dueAtUi != "string") {
                $scope.selectedTask.dueAtUi = $scope.convertDateToString($scope.selectedTask.dueAtUi);
            } else if ($scope.selectedTask.dueAtUi.indexOf('-') != -1) {
                $scope.selectedTask.dueAtUi = $scope.formatDate($scope.selectedTask.dueAtUi);
            }

            $scope.previousTask.dueAt = $scope.selectedTask.dueAt;
            $scope.previousTask.dueAtUi = $scope.selectedTask.dueAtUi;

            TaskResource.update($scope.selectedTask, function (resp) {
                if (resp && resp.data) {
                    $scope.doingTaskUpdate = false;
                    console.log(resp.data);
                    //selectedNote may change to another one if user click the another one before ajax return
                    for (var i = 0; i < $scope.tasksList.length; i++) {
                        if ($scope.tasksList[i].id == resp.data.id) {
                            $scope.tasksList[i].updatedAt = resp.data.updatedAt;
                            $scope.selectedTask.isNeededPublish = resp.data.isNeededPublish;
                            $scope.selectedTask.lockedBy = resp.data.lockedBy;
                            $scope.selectedTask.personal = resp.data.personal;
                            //new share
                            $scope.tasksList[i] = resp.data;
                            break;
                        }
                    }
                    if ($scope.selectedTask.id == resp.data.id) {
                        $scope.selectTask(resp.data);
                    }

                    if (!$scope.$$phase) {
                        $scope.$apply()
                    }

                    sendMsgToPopup();
                    sendMsgToParent();

                } else {
                    $scope.doingTaskUpdate = false;
                    console.log('Error occurrend in tasks.module > $scope.updateTask');
                    console.log(resp);
                }
            }, function (errResp) {
                console.log(errResp);
                if (errResp && errResp.data && errResp.data.data) {
                    var task = errResp.data.data;
                    for (var i = 0; i < $scope.tasksList.length; i++) {
                        if ($scope.tasksList[i].id == task.id) {
                            $scope.tasksList[i].lockedBy = task.lockedBy;
                            break;
                        }
                    }
                    if ($scope.selectedTask.id == task.id) {
                        $scope.selectedTask.lockedBy = task.lockedBy;
                        //disable editing of share list
                        $scope.selectedTask.isEditable = $scope.isEditable($scope.selectedTask);
                        //to disable the tags list component
                        if ($scope.selectedTask.isEditable == false) {
                            $('tags-input input').attr('disabled', true);
                            for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                                $scope.selectedTask.sharelist[i].canRemove = true;
                            }
                        } else {
                            $('tags-input input').removeAttr('disabled');
                            for (var i = 0; i < $scope.selectedTask.sharelist.length; i++) {
                                $scope.selectedTask.sharelist[i].canRemove = false;
                            }
                        }
                    }
                }

            });
        }
        
        $scope.splitFullName = function (fullname) {
            var output = { firstName: '', lastName: '' };
            var nameArr = $rootScope.selectedContact.displayName.split(' ');
            output.firstName = nameArr[0];
            if (nameArr[1]) output.lastName = nameArr[1];
            return output;
        }
        
        $scope.askDeleteTask = function (e) {
            e.stopPropagation();

            if (!$scope.selectedTask.isEditable) return;            
            
            // TO DO: KL Need to revise the logic in the following two lines
            $rootScope.deleteTaskContextual = !$rootScope.deleteTaskContextual;
            if ($rootScope.deleteTaskContextual)
                $scope.unShownAllExcept('deletetask');
        }

        $scope.deleteTask = function () {
            $rootScope.deleteTaskContextual = false;
            if ($scope.doingTaskDelete) return;
            $scope.doingTaskDelete = true;
            var removedTaskId = $scope.selectedTask.id;

            TaskResource.remove($scope.selectedTask, function (data) {
                console.log('removed Task');
                console.log(data);
                $scope.doingTaskDelete = false;
                if (data.success) {
                    for (var i = 0; i < $scope.tasksList.length; i++) {
                        if ($scope.tasksList[i].id === removedTaskId) {
                            $scope.tasksList.splice(i, 1);
                            break;
                        }
                    };
                    //clear from groups
                    removeTaskFromUI($scope.selectedTask)

                    sendMsgToPopup();
                    sendMsgToParent();
                }
            }, function () {
                $scope.doingTaskDelete = false;
            });            
        }

	    // Tasks edition
        $scope.enableEditSubject = function (e) {
            if (!$scope.selectedTask.isEditable && typeof $scope.selectedTask.id != 'undefined') return;
            $scope.editSubject = true;

            setTimeout(function () {
                $(e.target).next('.edit').focus();
                var text = $(e.target).next('.edit').val();
                var len = !text ? 0 : text.length;
                createSelection($(e.target).next('.edit').get(0), 0, len);

                if ($scope.selectedTask.highlight) {
                    var index = $rootScope.taskNotifications.id.indexOf($scope.selectedTask.id + '');
                    $rootScope.taskNotifications.id.splice(index, 1);
                    $scope.selectedTask.highlight = false;
                }
            }, 50);

        }

        $scope.enableEditText = function (e) {
            if (!$scope.selectedTask.isEditable && typeof $scope.selectedTask.id != 'undefined') return;
            $scope.editText = true;
            setTimeout(function () {
                $(e.target).next('.edit').focus()
                var text = $(e.target).next('.edit').val();
                $(e.target).next('.edit').val('');
                $(e.target).next('.edit').val(text);

                if ($scope.selectedTask.highlight) {
                    var index = $rootScope.tasksNotifications.id.indexOf($scope.selectedTask.id + '');
                    $rootScope.taskNotifications.id.splice(index, 1);
                    $scope.selectedTask.highlight = false;
                }
            }, 50);
        }

	    // task update by event keyup and blur (every 5 seconds auto-save)
        $scope.taskUpdated = function (e) {
            function doUpdateTask() {

                if (($scope.selectedTask.title !== $scope.previousTask.title)
                    || ($scope.selectedTask.text !== $scope.previousTask.text)) {

                    if ($scope.selectedTask.title === '') {
                        $scope.selectedTask.title = "Untitled Task";
                    }

                    $scope.updateTask();
                    mf.ui.fitElementsHeight($('.tasks-module [data-fixed-heigth]'));
                }
            }

            if (!e) {
                doUpdateTask();
                return;
            }

            if (e.type === 'keyup') {
                $timeout.cancel($scope.timeouts['updateTask']);
                $scope.timeouts['updateTask'] = $timeout(function () {
                    doUpdateTask();
                    $scope.groupTasks($scope.tasksList, true);
                }, 5000)
            } else if (e.type === 'blur') {
                doUpdateTask();
            }
        }

        $scope.getSearchUrlString = function () {
            var params = "?";
            if (!$scope.taskSearchTerm || $scope.taskSearchTerm.trim().length == 0) {
                params += "query=";
            } else {
                params += "query=" + $scope.taskSearchTerm.trim();
            }
            $scope.showFilter = false;

            if ($rootScope.selectedContact && $rootScope.myPersonId && $rootScope.selectedContact.id == $rootScope.myPersonId) {
                if (!$scope.isAllTaskSelected) {
                    params += "&byandfor=true";
                }
                $scope.strTipsAll = "All tasks I created and all tasks assigned to me";
                $scope.strTipsMy = "Tasks assigned to me";
                $scope.showFilter = true;
            } else {
                params += "&createdFor=";
                params += "&byandfor=true";
            }
            params += "&max=5000";
            if ($scope.taskSearchFilter['HideComplete']) {
                params += "&status=INPROGRESS";
            }
            $scope.strLocked = "This task is currently being edited by someone else.";

            return params;
        }

	    // Tasks Search
        $scope.search = function () {
            window.clearTimeout(window.timoutTasksSearch);
            window.timoutTasksSearch = window.setTimeout(function () {         
                var urlBase = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + "/mindframe/task/search" + $scope.getSearchUrlString();
                
                $http({
                    method: 'POST',
                    url: urlBase,
                    headers: {
                         'Access-Token': $rootScope.credentials.accessToken
                    }
                }).success(function (resp, status) {
                    if (resp.data && resp.data.length > 0) {

                        $scope.tasksList = $scope.parseTasksList(resp.data);
                        $scope.groupTasks($scope.tasksList, true);
                        // Select task
                        for (var i = 0; i < $scope.taskGroups.length; i++) {
                            if ($scope.taskGroups[i].tasks.length > 0) {
                                $scope.allowUpdate = false;
                                setTimeout(function () { $scope.allowUpdate = true }, 1000);
                                $scope.selectedTask = $scope.taskGroups[i].tasks[0];
                                $scope.selectedTask.dueAtUi = $scope.selectedTask.dueAt;
                                $scope.selectedTask.defaultDateForDatePicker = $scope.selectedTask.dueAt;
                                $scope.selectedTask.isEditable = $scope.isEditable($scope.taskGroups[i].tasks[0]);
                                $scope.selectedTask.isNeededPublish = $scope.taskGroups[i].tasks[0].isNeededPublish;
                                $scope.selectedTask.lockedBy = $scope.taskGroups[i].tasks[0].lockedBy;
                                $scope.selectedTask.personal = $scope.taskGroups[i].tasks[0].personal;
                                $scope.selectedTask.status = $scope.taskGroups[i].tasks[0].status;

                                break;
                            }
                        }

                      if ($scope.isPopWindow && $scope.taskSelectedFromParent.selectedTask !== null) {
                          $scope.selectTask($scope.taskSelectedFromParent.selectedTask);
                          $scope.taskSelectedFromParent.selectedTask = null;
                        } else {
                            var findTaskSelected = _.find($scope.tasksList, function (task) { return task.id == $scope.selectedTask.id; });
                            if (findTaskSelected) {
                                $scope.selectTask(findTaskSelected);
                            } else {
                                var taskSelect = $scope.findLatestUpdateTask();
                                $scope.selectTask(taskSelect);
                            }
                        }
                    } else {
                        $scope.selectedTask = undefined;
                        $scope.clearGroups();
                    }
                });
            }, 500);
        }

        $scope.clearSearch = function () {
            $scope.taskSearchTerm = '';
            $scope.search();
        }

        $scope.filterByTab = function () {
            return function (task) {
                if ($scope.isAllTaskSelected) return true;

                if (task.createdBy && task.createdBy.id == $rootScope.myPersonId) {
                    return true;
                }
                return false;
            }
        }

        $scope.markKeyword = function (str) {
            if (!str || str.trim().length == 0) return;

            var keyword = $scope.taskSearchTerm;
            if (!keyword || keyword.trim().length <= 0) {
                return $sce.trustAsHtml(str);
            };
            var newStr = replaceAll(str, keyword.trim(), "<mark>"+keyword.trim()+"</mark>");

            return $sce.trustAsHtml(newStr);
        }

        $scope.tasksListLoaded = function () {
            console.log('tasksListLoaded');
        }

        $scope.findLatestUpdateTask = function () {
            
            if (!$scope.tasksList || $scope.tasksList.length == 0) return null;
            var taskMax = $scope.tasksList[0];
            for (var i = 0; i < $scope.tasksList.length; i++) {
                var task = $scope.tasksList[i];
                var d1 = new Date(task.dueAt);
                var d2 = new Date(taskMax.dueAt);
                if (d1 - d2 > 0)
                    taskMax = task;
            }
            return taskMax;
        }

        $scope.popOutTasks = function () {
            var popTimeStamp = new Date().getTime();
            var windowName = 'popuptask-' + popTimeStamp  + $rootScope.selectedContact.id;
            console.log('PopupService.openWindow = ' + windowName);
            $scope.popupData.SearchString = $scope.taskSearchTerm;
            $scope.popupData.CreatedFor = $scope.taskSearchFilter['CreatedFor'] ? $rootScope.selectedContact.personId : '';
            $scope.popupData.CreatedBy = ($scope.taskSearchFilter['CreatedBy']);
            $scope.popupData.HideComplete = $scope.taskSearchFilter['HideComplete'];
            $scope.popupData.CurrentTask = $scope.selectedTask;

            PopupService.openWindow(windowName, $scope, 'popuptasks.html?version=' + localStorage.version, null, 900, 550);

            setTimeout(function () { PopupService.sendMessage(windowName, 'taskpopup', $scope.popupData) }, 2000);
        };

	    // Initialization
        $scope.$watch('selectedTabbedContent',
            function (newValue, oldValue) {
                if (newValue === 'tasks') {
                    $scope.getTasks();
                }
            }
        );

	    $scope.$on('refreshTaskForMe', function () {
            if ($rootScope.selectedContact && $rootScope.myPersonId && $rootScope.selectedContact.personId == $rootScope.myPersonId) {
                $scope.search();
            }
        });

	    $scope.onClickModule = function () {
           
	        $rootScope.taskFilters['scope'] = false;
	        $rootScope.showDatePicker = false;
	        $rootScope.isShowTaskPriority = false;
	        $rootScope.isShowTaskInfo = false;
	        $rootScope.deleteTaskContextual = false;

	        if ($scope.selectedTask && typeof $scope.selectedTask.createdFor.id == "undefined") $scope.autoassign();
	    }
        
	    function sendMsgToPopup() {
	        if (!$scope.isPopWindow) {
	            $scope.popupData.SearchString = $scope.taskSearchTerm;
	            $scope.popupData.CreatedFor = $rootScope.selectedContact.personId;
	            $scope.popupData.CurrentTask = $scope.selectedTask;
	            var windowName = 'poptask-' + $rootScope.selectedContact.id;
	            PopupService.sendMessage(windowName, 'taskpopup', $scope.popupData);
	        }
	    }

	    function sendMsgToParent() {
	        if ($scope.isPopWindow) {
	            var popupData = {};
	            popupData.SearchString = $scope.taskSearchTerm;
	            popupData.CreatedFor = $scope.$parent.selectedContact.id;
	            popupData.CurrentTask = $scope.selectedTask;
	            window.opener.postMessage(popupData, '*');
	        }
	    }

        $scope.toggleDatePicker = function(e){
            e.stopPropagation();
            if(!$scope.selectedTask.isEditable) return;
            $rootScope.showDatePicker = !$rootScope.showDatePicker;
            // Prevent the datepicker to be closed when you click on it.
            if ($rootScope.showDatePicker) {
                setTimeout(function(){
                    $(".tasks-module [datepicker]").bind("click", function(e) {
                        e.stopPropagation();
                    })
                }, 250);
            }
            if ($rootScope.showDatePicker)
                $scope.unShownAllExcept('datepicker')
        }
       
        $scope.getDefaultDueAt = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 
            var today = mm +'/'+dd+'/'+yyyy;
            return today;
        }

       
        $scope.togglePriorityMenu = function(e){
            e.stopPropagation();
            if ($scope.selectedTask.isEditable==false) return;
            $rootScope.isShowTaskPriority = !$rootScope.isShowTaskPriority;

            if ($rootScope.isShowTaskPriority)
                $scope.unShownAllExcept('taskpriority')
        }


        $scope.toggleStatus = function(task,e){
            e.stopPropagation();
            if(task.lockedBy&&task.lockedBy.id&&task.lockedBy.id!=$rootScope.myPersonId) return false;

            (task.status == $scope.status.COMPLETED) ?
                task.status = $scope.status.INPROGRESS :
                task.status = $scope.status.COMPLETED;
            $scope.doingTaskUpdate = false;

           $scope.selectedTask = task;            
           $scope.updateTask();
           $scope.search();
        }

        $scope.setPriority = function(e, priority){
            e.stopPropagation();

            $scope.selectedTask.priority = priority;
            $scope.selectedTask.priorityLabel = undefined;
            $scope.updateTask();

            var len = $scope.tasksList.length;
            for (var i = 0; i < len; i++) {
                if ($scope.tasksList[i].id === undefined || !$scope.tasksList[i].id) continue;
                if ($scope.tasksList[i].id === $scope.selectedTask.id) {
                    $scope.tasksList[i].priority = priority;
                }
            }

            if (!$scope.$$phase) {
                $scope.$apply()
            }
        }
       
        $scope.groupTasks = function(tasks, isTimeToPushToFuture){
            $scope.clearGroups();
            var len = tasks.length;
            for (var i = 0; i < len; i++) {

                if (!tasks[i].id) {
                    $scope.taskGroups[0].tasks.push(tasks[i]);
                    continue;
                }

                var added = false;
                tasks[i].isOverdue = false;
                if(tasks[i].status == $scope.status.COMPLETED){
                    $scope.taskGroups[ $scope.taskGroupsIndexes['Completed'] ].tasks.push(tasks[i]);
                    added = true;
                };
                if(!added){
                    try{
                        var today = new Date();
                        if(!tasks[i].dueAt){
                            if(!isTimeToPushToFuture && tasks[i].id == $scope.selectedTask.id) {
                                $scope.taskGroups[ $scope.taskGroupsIndexes['New'] ].tasks.push(tasks[i]);
                            }else{
                                $scope.taskGroups[ $scope.taskGroupsIndexes['Future'] ].tasks.push(tasks[i]);
                            }
                            tasks[i].defaultDateForDatePicker = today;

                        }else{
                            var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                            today = today.setHours(0,0,0,0);
                            tomorrow = tomorrow.setHours(0,0,0,0);
                            var taskDueAt = new Date(tasks[i].dueAt).setHours(0,0,0,0);
                            var diff = today - taskDueAt;
                            if( diff > 0){
                                tasks[i].isOverdue = true;
                                $scope.taskGroups[ $scope.taskGroupsIndexes['Overdue'] ].tasks.push(tasks[i]);
                            }else if( diff === 0 ){
                                $scope.taskGroups[ $scope.taskGroupsIndexes['Today'] ].tasks.push(tasks[i]);
                            }else if( (tomorrow - taskDueAt) === 0 ){
                                $scope.taskGroups[ $scope.taskGroupsIndexes['Tomorrow'] ].tasks.push(tasks[i]);
                            }else if(diff < 0){
                                $scope.taskGroups[ $scope.taskGroupsIndexes['Future'] ].tasks.push(tasks[i]);
                            }
                            tasks[i].defaultDateForDatePicker = tasks[i].dueAt;
                        }



                    }catch(ex){
                        $log.error('An error occurred trying to create date from string for task: ' + tasks[i].title);
                        continue;
                    }    
                }
            };

            // Open groups (but first one)
            for (var i = 1; i < $scope.taskGroups.length; i++) {
                $scope.taskGroups[i].visible = true;
            };
        }

        $scope.clearGroups = function(){
            for (var i = 0; i < $scope.taskGroups.length; i++) {
                $scope.taskGroups[i].tasks = [];
            };
        }

        $scope.openGroup = function(task){
            if(typeof task == 'undefined') return;
            for (var i = 0; i < $scope.taskGroups.length; i++) {
                for (var j = 0; j < $scope.taskGroups[i].tasks.length; j++) {
                    if($scope.taskGroups[i].tasks[j].id === task.id){
                        $scope.taskGroups[i].visible = true;
                        break;
                    }
                };
            };
        }

        $scope.toggleGroup = function(group){
            group.visible = !group.visible;
        }

        

        $scope.convertDateToString = function(date){
            if(date){
                var month = String(date.getMonth() + 1);
                var day = String(date.getDate());
                if(month.length === 1) month = '0' + month;
                if(day.length === 1) day = '0' + day;
                return month + '/' + day + '/' + date.getFullYear();
            }
            return "";

        }

        $scope.formatDate = function(date){
            return date.split('T')[0].replace(/-/g, '/');
        }

        function removeTaskFromUI(task) {
            if (!task || !task.id) return;
            //remove the tasks
            for (var i = 0; i < $scope.taskGroups.length; i++) {
                for (var j = 0; j < $scope.taskGroups[i].tasks.length; j++) {
                    if (!$scope.taskGroups[i].tasks[j].id) continue;
                    if($scope.taskGroups[i].tasks[j].id === task.id){
                        $scope.taskGroups[i].tasks.splice(j,1);
                        var tasksList = $scope.taskGroups[i].tasks;
                        if ($scope.taskGroups[i].tasks.length>0) {
                            $timeout(function(){
                                var taskMax = $scope.findLatestUpdateTask(tasksList);
                                $scope.selectTask(taskMax);
                            },200);
                        }
                        else{
                            $scope.selectedTask = undefined;
                        }
                        break;
                    }
                };
            };
            //clear from taskslist
            var len = $scope.tasksList.length;
            for (var i = 0; i < len; i++) {
                if ($scope.tasksList[i].id === undefined || !$scope.tasksList[i].id) continue;
                if($scope.tasksList[i].id === task.id){
                    $scope.tasksList.splice(i,1);
                    break;
                }
            };
        }


        $scope.parseTasksList = function(input){
            var len = input.length;
            var output = [];
            for (var i = 0; i < len; i++) {
                // Parse date
                if(typeof input[i].dueAt != "string" ){
                    input[i].dueAt = $scope.convertDateToString(input[i].dueAt);
                }else if(input[i].dueAt.indexOf('-') != -1){
                    input[i].dueAt = $scope.formatDate(input[i].dueAt);
                }
                input[i].dueAtUi = input[i].dueAt;
                if (!input[i].updatedAt) input[i].updatedAt=input[i].createdAt;
                output.push(input[i]);
            };
            return output;
        }
        
        $scope.getMarkedShortDesc = function(task){
            if(!task.text || !$scope.taskSearchTerm ) return;
            var word = $scope.taskSearchTerm;
            word = escapeRegEx(word);
            var index = task.text.indexOf(word);
            var shortDesc;
            if(index !== -1){
                var low = index - 10;
                if(low < 0) low = 0;
                var high = index + word.length + 10;
                if(task.text.charAt(high) == '') high = task.text.length - 1;
                shortDesc = task.text.substring(low, high);
                if(shortDesc && shortDesc !== ''){
                    if(low !== 0) shortDesc = '...' + shortDesc;
                    if(high < task.text.length - 1) shortDesc = shortDesc + '...';
                    var r = new RegExp(word,"i");
                    shortDesc = shortDesc.replace(r,"<mark>" + word + "</mark>");
                    task.shortDesc = shortDesc;
                    return $sce.trustAsHtml(shortDesc);
                }
            }
        }
        
        $scope.clearShortDesc = function(){
            for (var i = 0; i < $scope.taskGroups.length; i++) {
                var len = $scope.taskGroups[i].tasks.length;
                for (var j = 0; j < len; j++) {
                    if($scope.taskGroups[i].tasks[j].shortDesc){
                        $scope.taskGroups[i].tasks[j].shortDesc = undefined;
                    }
                };
            };
        }

		
        // Assignee search
        $scope.removeAssignee = function(e){
            if(!$scope.selectedTask.isEditable) return;
            e.stopPropagation();
            $scope.selectedTask.createdFor = {};
        }

        $scope.autoassign = function(task){
            var task = task || $scope.selectedTask;
            if(task){
                task.createdFor = {};
                task.createdFor.id = task.createdBy.id;
                task.createdFor.firstName = $scope.credentials.firstName;
                task.createdFor.lastName = $scope.credentials.lastName;
            }
        }

        $scope.searchAssignee = function(){
            if($scope.createdForSearchTerm.length < 1) $scope.assignees = [];
            if($scope.createdForSearchTerm.length < 2) return;
            $timeout.cancel($scope.timeoutSearch);
            $scope.timeoutSearch = $timeout(function(){               
                var url = PathService.getMindFramePersonSearchUrl()+"?query="+$scope.createdForSearchTerm+"&includeDisabled=false";
                var personsearch = $http.get(url, {'cache': false, headers: {'Access-Token': $rootScope.credentials.accessToken }});
                personsearch.then(function(resp) {
                    var persons = resp.data.data;
                    if (persons) {
                        $scope.assignees = persons;
                    } else {

                    }
                });

            }, 500);
        }

        $scope.selectAssignee = function(assignee){
            $scope.selectedTask.createdFor.id = assignee.id;
            $scope.selectedTask.createdFor.firstName = assignee.firstName;
            $scope.selectedTask.createdFor.lastName = assignee.lastName;
            $scope.assignees = [];
            $scope.createdForSearchTerm = '';
            $scope.updateTask();
        }

        $scope.selectTaskDate = function(dt){
            $scope.selectedTask.dueAt = $scope.selectedTask.defaultDateForDatePicker;
            $scope.selectedTask.dueAtUi = $scope.selectedTask.defaultDateForDatePicker;
            $scope.updateTask();
        }
        
         $scope.showTaskPriorityDiv = function(e) {
            e.stopPropagation();
            $rootScope.isShowTaskPriority = true;
        }
        
        $scope.unShownAllExcept = function(name) {
            $scope.onClickModule();
            if (name=='taskinfo') {
                $rootScope.isShowTaskInfo = true;
            } else if (name=='datepicker') {
                $rootScope.showDatePicker = true;
            } else if (name == 'deletetask') {
                $rootScope.deleteTaskContextual = true;
            } else if (name=='taskpriority') {
                $rootScope.isShowTaskPriority = true;
            }
        }

        $scope.init();

	}])

.factory('TaskResource', function ($rootScope, $http, Resource, Task, TaskRes, TaskSearchRes, TaskPersonSearchRes) {

    return {
            list: function (success, error) {
                var selectedPerson = $rootScope.selectedContact;
                TaskPersonSearchRes.query({ account: $rootScope.currentAccount, id: selectedContact.id, max: 99, offset: 0 }, success, error);
            },

            search: function (searchParams, success, error) {
                TaskSearchRes.search(searchParams, success, error);
            },

            add: function (task, success, error) {
                var taskRes = new TaskRes(task);
                if (task.createdFor && task.createdFor.id) {

                } else if ($rootScope.selectedContact && $rootScope.selectedContact.id) {
                    taskRes.createdFor = {};
                    taskRes.createdFor.id = $rootScope.selectedContact.id;
                }
                taskRes.$create({ account: $rootScope.currentAccount }, success, error);
            },

            update: function (task, success, error) {
                var params = { id: task.id, account: $rootScope.currentAccount };
                var taskNew = {};
                taskNew.createdFor = task.createdFor;
                taskNew.id = task.id;
                taskNew.sharedGroupsList = task.sharedGroupsList;
                taskNew.sharedPeopleList = [];
                if (task.sharedPeopleList && task.sharedPeopleList.length > 0) {
                    for (var i = 0; i < task.sharedPeopleList.length; i++) {
                        taskNew.sharedPeopleList.push(task.sharedPeopleList[i].id);
                    }
                }
                taskNew.title = task.title;
                taskNew.text = task.text;
                taskNew.personal = task.personal;
                taskNew.priority = task.priority;
                taskNew.dueAt = task.dueAt;
                taskNew.dueAtUi = task.dueAtUi;
                taskNew.status = task.status;
                
                var taskRes = new TaskRes(taskNew);
                taskRes.$update(params, success, error);
            },

            remove: function (task, success, error) {
                var taskRes = new TaskRes(task);
                var params = { 'id': task.id, account: $rootScope.currentAccount };
                taskRes.$remove(params, success, error);
                return;
            }
        };  
    })

.directive('highlightTask',function($rootScope){
    return{
        restrict: 'A',
        scope : {},
        link: function (scope, element, attrs, ngModelCtrl) {

            if($rootScope.taskNotifications &&  $rootScope.taskNotifications.tasksId.indexOf(scope.$parent.task.id+'') != -1){
                scope.$parent.task.highlight = true;
            }

            element.bind('click', function(){
                if(scope.$parent.task.highlight && $rootScope.taskNotifications){
                    var index = $rootScope.taskNotifications.tasksId.indexOf(scope.$parent.task.id+'');
                    $rootScope.taskNotifications.tasksId.splice(index,1);
                    scope.$parent.task.highlight = false;
                }
            });
        }
    };
});