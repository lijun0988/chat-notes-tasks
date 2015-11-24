'use strict';

angular.module('notes.module', ['resources','popup.service'])
.controller('NotesPopupController',['$scope', '$rootScope', '$timeout', 'PATHS', 'ANALYTICS', 'NoteResource',
    function($scope, $rootScope, $timeout, PATHS, ANALYTICS, NoteResource) {

    $scope.on = false;

    $scope.editSubject = false;
    $scope.editText = false;
    $scope.timeouts = [];
    $scope.noteReady = false;

    // Notes edition
    $scope.enableEditSubject = function(e){
        $scope.editSubject = true;
        setTimeout(function(){$(e.target).next('.edit').focus()}, 20);
    }

    $scope.enableEditText = function(e){
        $scope.editText = true;
        setTimeout(function(){$(e.target).next('.edit').focus()}, 20);
    }

    $scope.setNote = function(personId, personName, contentId, contentName) {
        var personName = $rootScope.selectedContact.displayName
        $scope.noteAdd = {
            title: 'Conversation with ' + personName,
            text: '',
            createdFor: {id: personId, name: personName},
            content: {id: contentId},
            personal: true,
            isSaved: true
        };

        $timeout(function(){$scope.noteReady = true}, 100);
    }

    $scope.saveNote = function () {
        analytics.trackTag(ANALYTICS.ON_NOTE_CREATE);
        if($scope.noteAdd.isSaved) return;
        $scope.noteReady = false;
        $scope.on = false;
        NoteResource.add($scope.noteAdd, function(data) {});
        $scope.noteAdd = {};
    }

    $scope.getNowTime = function() {
        return new Date().getTime();
    }
    $scope.remove = function(){
        $scope.on = false;
        $scope.noteReady = false;
    }

    $scope.getTabName = function(tabId) {
        if(tabId == undefined){
            return "General"
        }
        return $.grep($rootScope.selectedPersonContent, function(e){ return e.id == tabId; })[0].name;
    }

    $scope.$watch('noteAdd.title', function(newValue, oldValue){
        if (newValue != oldValue && $scope.noteReady) {
            $scope.noteAdd.isSaved = false;
        };
    });

    $scope.$watch('noteAdd.text', function(newValue, oldValue){
        if (newValue != oldValue && $scope.noteReady) {
            $scope.noteAdd.isSaved = false;
        };
    });

}])

.controller('NotesController',
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
	'NoteResource',
    'PopupService',
    function($scope, $rootScope, $http, $log, $timeout, $sce, $q, PATHS, ANALYTICS,  Resource, NoteResource, PopupService){

        var parentScope;


        $scope.selectedNote = {};
        $scope.previousNote = {};
        $scope.notes = []; //search notes

        $scope.editSubject = false;
        $scope.editText = false;
        $scope.timeouts = [];
        $rootScope.isShowNoteInfo = false;

        $scope.isAllSelected = true;

        $scope.strTipsAll = "";
        $scope.strTipsMy = "";

        $scope.popupData = {
            CreatedFor: '',
            CreatedBy: '',
            SearchString : '',
            CurrentNote: []
        };

        $scope.noteSelectedFromParent = {id: 0, selectedNotes: null};

        $scope.init = function() {
            if (!$scope.isPopWindow)
                $scope.selectedNote = undefined;
            else {

                $rootScope.dataParent = window.opener.getProfileForPopup();
                parentScope = $rootScope.dataParent.rootScopeVar;
                if (!$rootScope.dataParent.selectedPersonContent) return;
                $rootScope.myPersonId = parentScope.myPersonId;
                $rootScope.credentials = parentScope.credentials;
                $rootScope.selectedContact = parentScope.selectedContact;
                $rootScope.notesNotifications = parentScope.notesNotifications;
                $rootScope.currentAccount = parentScope.currentAccount;
                $http.defaults.headers.common['Access-Token']=parentScope.credentials.accessToken;
            }


            $scope.getNotes();
            $timeout(function() {
                mf.ui.fitElementsHeight($('.notes-module [data-fixed-heigth]'));
            },300);

        }

        $scope.toggleFilter = function(isAll) {
            if (isAll=='true') {
                $scope.isAllSelected = true;

            } else {
                $scope.isAllSelected = false;

            }
        }


        $scope.selectNote = function(note){
            if (!note) {
                $scope.selectedNote = undefined;
            } else {
                /* MF-1361 the cursor problem can't be solved
                if($scope.selectedNote.isEditable) {
                    $scope.editText = true;
                }*/
                setNoteShareListOnUI(note, note);
                $scope.selectedNote = note;
                $scope.previousNote.title = note.title;
                $scope.previousNote.text = note.text;
                $scope.previousNote.personal = note.personal;
                $scope.selectedNote.isEditable = $scope.isEditable($scope.selectedNote);
                //to disable the tags list component
                if ($scope.selectedNote.isEditable==false || !($scope.selectedNote.createdBy.id==$rootScope.myPersonId)) {
                    $('tags-input input').attr('disabled', true);
                    for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                        $scope.selectedNote.sharelist[i].canRemove = true;
                    }
                }else {
                    $('tags-input input').removeAttr('disabled');
                    for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                        $scope.selectedNote.sharelist[i].canRemove = false;
                    }
                }
            }
        }

        $scope.$on('shareFromDialog', function (event, note) {
            //call share publish ws
            var url = PATHS.BASE_SERVICE_API_URL  + $rootScope.currentAccount + "/mindframe/sharenote/publish/" +$scope.selectedNote.id;

            $http.post(url).then(function(successResp){
                $log.debug('Server http response of publish note successful:'+ successResp);
                var noteResp = successResp.data.data;
                if (noteResp.id) {
                    for (var n=0;n<$scope.notes.length;n++) {
                        if ($scope.notes[n].id == noteResp.id) {
                            $scope.notes[n].isNeededPublish = noteResp.isNeededPublish;
                            $scope.notes[n].lockedBy = {};
                            $scope.notes[n].personal = noteResp.personal;
                            break;
                        }
                    }
                    if ($scope.selectedNote && $scope.selectedNote.id == noteResp.id) {
                        $scope.selectedNote.isNeededPublish = noteResp.isNeededPublish;
                        $scope.selectedNote.lockedBy = {};
                        $scope.selectedNote.personal = noteResp.personal;
                    }
                    if(!$scope.$$phase){$scope.$apply()};
                    sendMsgToParent();
                    sendMsgToPopup();
                }
            }, function(errResponse) {
                $log.error('Server http response of publish   err:'+ errResponse);

            })
        });

        $scope.isDraft= function(note) {
            if (!note||!note.id) return false;
            var hasShareList = false;
            if ((note.sharedPeopleList && note.sharedPeopleList.length>0)||(note.sharedGroupsList && note.sharedGroupsList.length>0)) {
                hasShareList = true;
            }
            var isLockedByMe = false;
            if (note.lockedBy&&note.lockedBy.id &&note.lockedBy.id==$rootScope.myPersonId)
                isLockedByMe = true;
            if (isLockedByMe && hasShareList) {
                return true;
            }
            return false;
        }

        $scope.shareNote = function(e) {
            e.stopPropagation();
            if ($scope.selectedNote.isEditable==false) return;
            if (!$scope.selectedNote||!$scope.selectedNote.id) {
                $log.debug('sharing note with people , but selectedNote null');
                return;
            }
            $log.debug('sharing note with people , note id:'+$scope.selectedNote.id);
            $rootScope.isShowNoteDialog = true;
            if ($scope.selectedNote.sharelist && $scope.selectedNote.sharelist.length>0) {
                $rootScope.$broadcast('confirmShare', $scope.selectedNote);
                $timeout(function(){ $rootScope.isShowNoteDialog = false; },1500);
                //call share publish ws
                var url = PATHS.BASE_SERVICE_API_URL  + $rootScope.currentAccount + "/mindframe/sharenote/publish/" +$scope.selectedNote.id;
                $http.post(url).then(function(successResp){
                    $log.debug('Server http response of publish note successful:'+ successResp);
                    var noteResp = successResp.data.data;
                    if (noteResp.id) {
                        for (var n=0;n<$scope.notes.length;n++) {
                            if ($scope.notes[n].id == noteResp.id) {
                                $scope.notes[n].isNeededPublish = noteResp.isNeededPublish;
                                $scope.notes[n].lockedBy = {};
                                $scope.notes[n].personal = noteResp.personal;
                                break;
                            }
                        }
                        if ($scope.selectedNote && $scope.selectedNote.id == noteResp.id) {
                            $scope.selectedNote.isNeededPublish = noteResp.isNeededPublish;
                            $scope.selectedNote.lockedBy = {};
                            $scope.selectedNote.personal = noteResp.personal;
                        }
                        if(!$scope.$$phase){$scope.$apply()};
                        sendMsgToParent();
                        sendMsgToPopup();
                    }
                }, function(errResponse) {
                    $log.error('Server http response of publish   err:'+ errResponse);

                })

            }
            else if (!$scope.selectedNote.sharelist || $scope.selectedNote.sharelist.length==0) {
                $rootScope.$broadcast('blankShare', $scope.selectedNote);
            }
        }

        $scope.showNoteInfo = function(e) {
            e.stopPropagation();
            $rootScope.isShowNoteInfo = !$rootScope.isShowNoteInfo;
            if ($rootScope.isShowNoteInfo) {
                $rootScope.deleteNoteContextual = false;
            }
        }

        $scope.showNoteInfoDiv = function(e) {
            e.stopPropagation();
            $rootScope.isShowNoteInfo = true;
        }
        function setNoteShareListOnUI(note, noteUI) {
            if (note.sharelist && note.sharelist.length>0) return;
            noteUI.sharelist = [];
            if (note.sharedGroupsList && note.sharedGroupsList.length>0) {
                for (var i=0;i<note.sharedGroupsList.length;i++) {
                    noteUI.sharelist.push({displayName:note.sharedGroupsList[i]});
                }
            }
            if (note.sharedPeopleList && note.sharedPeopleList.length>0) {
                for (var i=0;i<note.sharedPeopleList.length;i++) {
                    noteUI.sharelist.push({displayName:note.sharedPeopleList[i].firstName+' '+note.sharedPeopleList[i].lastName, id:note.sharedPeopleList[i].id});
                }
            }
        }

        $scope.$on('saveShareList', function (event, note) {
            $scope.onTagsAddRemove();
        });

        $scope.onTagsAddRemove = function() {
            $log.debug('sharelist is changing.....');
            //change opacity of popup dialog opacity from 0.5 to 1 (damit ng-class not work)
            if ($scope.selectedNote.sharelist && $scope.selectedNote.sharelist.length>0) {
                $('section.share-popup footer .right').addClass('enable');
                $('section.share-popup footer .right').attr('disabled', false);
            } else {
                $('section.share-popup footer .right').removeClass('enable');
                $('section.share-popup footer .right').attr('disabled', 'disabled');
            }
            if ($scope.selectedNote) {
                if (!$scope.selectedNote.sharelist){
                    $scope.selectedNote.sharelist = [];
                }

                $log.debug('Saving sharelist in note '+$scope.selectedNote.id+" sharelist count is "+ $scope.selectedNote.sharelist.length);
                //call ws to save the sharelist
                var url = PATHS.BASE_SERVICE_API_URL  + $rootScope.currentAccount + "/mindframe/note/" +$scope.selectedNote.id;
                var payloadForShareList = {sharedGroupsList:[], sharedPeopleList:[]};
                if ($scope.selectedNote.sharelist && $scope.selectedNote.sharelist.length>0) {
                    for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                        if ($scope.selectedNote.sharelist[i].id) {
                            payloadForShareList.sharedPeopleList.push($scope.selectedNote.sharelist[i].id);
                        } else {
                            payloadForShareList.sharedGroupsList.push($scope.selectedNote.sharelist[i].displayName);
                        }
                    }
                }
                $log.debug('The http request to save share list : '+JSON.stringify(payloadForShareList));
                $http.put(url, payloadForShareList).then(function(response) {
                    $log.debug('Server http response of share list save successful:'+ response);
                    var note = response.data.data;
                    for (var i=0;i<$scope.notes.length;i++) {
                        if ($scope.notes[i] && $scope.notes[i].id==note.id) {
                            $scope.notes[i] = note;
                        }
                    }
                    if ($scope.selectedNote.id == note.id) {

                        note.sharelist = $scope.selectedNote.sharelist;//backup share list in order to solve the order of share list destroyed by server
                        $scope.selectNote(note);
                    }
                    sendMsgToParent();
                    sendMsgToPopup();

                }, function(errResp) {
                    $log.error('Server http response of share list save fail:'+ errResp);
                    if (errResp&&errResp.data && errResp.data.data) {
                        var note = errResp.data.data;
                        for (var i=0;i<$scope.notes.length;i++) {
                            if ($scope.notes[i].id==note.noteid) {
                                $scope.notes[i].lockedBy = note.lockedBy;
                                break;
                            }
                        }
                        if ($scope.selectedNote.id == note.noteid) {
                            $scope.selectedNote.lockedBy = note.lockedBy;
                            //disable editing of share list
                            $scope.selectedNote.isEditable = $scope.isEditable($scope.selectedNote);
                            //to disable the tags list component
                            if ($scope.selectedNote.isEditable==false) {
                                $('tags-input input').attr('disabled', true);
                                for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                                    $scope.selectedNote.sharelist[i].canRemove = true;
                                }
                            }else {
                                $('tags-input input').removeAttr('disabled');
                                for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                                    $scope.selectedNote.sharelist[i].canRemove = false;
                                }
                            }
                        }

                    }
                });

            }
        }
        //show auto complete contacts+groups : should not have duplicate names
        $scope.loadTags = function(query) {
            var resultsArray = [];
            var removeRepeatMap = {};
            if ($rootScope.availableServerGroups) {
                for (var i=0;i<$rootScope.availableServerGroups.length;i++) {
                    var r = new RegExp(query, "ig");
                    var matches = $rootScope.availableServerGroups[i].match(r);
                    if (matches && matches.length>0) {
                        if (!removeRepeatMap[$rootScope.availableServerGroups[i]]) {
                            resultsArray.push({displayName:$rootScope.availableServerGroups[i], type:"group"});
                            removeRepeatMap[$rootScope.availableServerGroups[i]]='Already Having';
                        }else {
                            removeRepeatMap[$rootScope.availableServerGroups[i]]='Already Having';
                        }
                    }
                }
            }
            var d = $q.defer();
            clearTimeout(window.timoutSearch);
            window.timoutSearch = window.setTimeout( function () {
                var url = PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.PERSON_SEARCH_URL+"?query="+query+"&max=50&includeDisabled=false";
                var personsearch = $http.get(url, {'cache': false, headers: {'Access-Token': $rootScope.credentials.accessToken }});
                personsearch.then(function(resp) {
                    clearTimeout(window.timoutSearch);
                    var persons = resp.data.data;
                    if (persons && persons.length>0) {
                        for (var i=0;i<persons.length;i++) {
                            persons[i].displayName = persons[i].firstName + ' ' + persons[i].lastName;
                            persons[i].isGroup = false;
                            if (!removeRepeatMap[persons[i].displayName]) {
                                resultsArray.push({id:persons[i].id, displayName:persons[i].displayName, type:"contacts"});
                                removeRepeatMap[persons[i].displayName]='Already Having';
                            }else {
                                removeRepeatMap[persons[i].displayName]='Already Having';
                            }
                        }
                    }
                    //var resultsArray = !persons?groups:groups.concat(persons);
                    console.log('results find in search by:'+query+' length is:'+resultsArray.length);
                    d.resolve(resultsArray);

                }, function(resp) {
                    console.log('no results find in search by:'+query);
                    clearTimeout(window.timoutSearch);
                    d.resolve(resultsArray);
                });
            },300);

            return d.promise;

        };


        $scope.isEditable = function(note) {
            var rootId = $rootScope.credentials.clientAccounts[0].currentPersonId;

            if (!$scope.selectedNote.lockedBy || !$scope.selectedNote.lockedBy.id)
                return true;
            if ($scope.selectedNote.lockedBy.id==rootId)
                return true;
            return false;
        }

        $scope.getNotes = function(){
            $scope.search();
        }

        $scope.addNote = function() {
            analytics.trackTag(ANALYTICS.ON_NOTE_CREATE);
            var pName = $rootScope.selectedContact.displayName;
            var noteAdd = {
                title: 'Conversation with ' + pName,
                text: '',
                personal: true
            };
            $scope.noteSearchTerm = '';

            NoteResource.add(noteAdd, function(data) {
                if (data && data.data) {
                    var noteAdd = data.data;
                    $scope.notes.unshift(noteAdd);
                    $scope.selectNote(noteAdd);

                    sendMsgToPopup();
                    sendMsgToParent();

                } else {
                    $log.error("Adding note result exception");
                }
            });

        }

        //auto saving or lose focus of current note
        $scope.updateNote = function(){
            console.log('perform $scope.updateNote()');
            console.log($scope.selectedNote);
            $scope.previousNote.title = $scope.selectedNote.title;
            $scope.previousNote.text = $scope.selectedNote.text;
            $scope.previousNote.personal = $scope.selectedNote.personal;
            $scope.doingNoteUpdate = true;
            NoteResource.update($scope.selectedNote, function(resp) {
                if (resp && resp.data) {
                    $scope.doingNoteUpdate = false;
                    console.log(resp.data);
                    //selectedNote may change to another one if user click the another one before ajax return
                    for (var i=0;i<$scope.notes.length;i++) {
                        if ($scope.notes[i].id==resp.data.id) {
                            $scope.notes[i].updatedAt = resp.data.updatedAt;
                            //new share
                            $scope.notes[i] = resp.data;
                            break;
                        }
                    }
                    if ($scope.selectedNote.id == resp.data.id) {
                        $scope.selectNote(resp.data);
                    }

                    sendMsgToPopup();
                    sendMsgToParent();

                }else{
                    $scope.doingNoteUpdate = false;
                    console.log('Error occurrend in notes.module > $scope.updateNote');
                    console.log(resp);
                }
            }, function(errResp){
                console.log(errResp);
                if (errResp&&errResp.data && errResp.data.data) {
                    var note = errResp.data.data;
                    for (var i=0;i<$scope.notes.length;i++) {
                        if ($scope.notes[i].id==note.noteid) {
                            $scope.notes[i].lockedBy = note.lockedBy;
                            break;
                        }
                    }
                    if ($scope.selectedNote.id == note.noteid) {
                        $scope.selectedNote.lockedBy = note.lockedBy;
                        //disable editing of share list
                        $scope.selectedNote.isEditable = $scope.isEditable($scope.selectedNote);
                        //to disable the tags list component
                        if ($scope.selectedNote.isEditable==false) {
                            $('tags-input input').attr('disabled', true);
                            for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                                $scope.selectedNote.sharelist[i].canRemove = true;
                            }
                        }else {
                            $('tags-input input').removeAttr('disabled');
                            for (var i=0;i<$scope.selectedNote.sharelist.length;i++) {
                                $scope.selectedNote.sharelist[i].canRemove = false;
                            }
                        }
                    }
                }
				
			});
        }

        $scope.askDeleteNote = function(e){
            e.stopPropagation();
            if(!$scope.selectedNote.isEditable) return;
            $rootScope.deleteNoteContextual = !$rootScope.deleteNoteContextual;
            if ($rootScope.deleteNoteContextual)
                $rootScope.isShowNoteInfo = false;
        }

        $scope.deleteNote = function(){
            $rootScope.deleteNoteContextual = false;
            if($scope.doingNoteDelete) return;
            $scope.doingNoteDelete = true;
            var removedNoteId = $scope.selectedNote.id;
            NoteResource.remove($scope.selectedNote, function(data) {
                console.log('removed Note');
                console.log(data);
                $scope.doingNoteDelete = false;
                if(data.success){
                    for (var i = 0; i < $scope.notes.length; i++) {
                        if($scope.notes[i].id === removedNoteId){
                            $scope.notes.splice(i,1);
                            break;
                        }
                    };
                    var noteLatest = $scope.findLatestUpdateNote();
                    $scope.selectNote(noteLatest);

                    sendMsgToPopup();
                    sendMsgToParent();
                }
            }, function(){
                $scope.doingNoteDelete = false;
            } );
        }

        // Notes edition
        $scope.enableEditSubject = function(e){
            if(!$scope.selectedNote.isEditable) return;
            $scope.editSubject = true;
            setTimeout(function(){
                $(e.target).next('.edit').focus();
                var text = $(e.target).next('.edit').val();
                var len = !text?0:text.length;
                createSelection($(e.target).next('.edit').get(0), 0 , len);

                if($scope.selectedNote.highlight){
                    var index = $rootScope.notesNotifications.notesId.indexOf($scope.selectedNote.id+'');
                    $rootScope.notesNotifications.notesId.splice(index,1);
                    $scope.selectedNote.highlight = false;
                }
            }, 50);
        }

        $scope.enableEditText = function(e){
            if(!$scope.selectedNote.isEditable) return;
            $scope.editText = true;
            setTimeout(function(){

                $(e.target).next('.edit').focus()
                //var kk = $(e.target).next('.edit')
                //var sc = kk.textrange();
                var text = $(e.target).next('.edit').val();
                $(e.target).next('.edit').val('');
                $(e.target).next('.edit').val(text);

                if($scope.selectedNote.highlight){
                    var index = $rootScope.notesNotifications.notesId.indexOf($scope.selectedNote.id+'');
                    $rootScope.notesNotifications.notesId.splice(index,1);
                    $scope.selectedNote.highlight = false;
                }

            }, 50);
        }

        //note update by event keyup and blur (every 5 seconds auto-save)
        $scope.noteUpdated = function(e){

            function doUpdateNote(){
                if( ($scope.selectedNote.title !== $scope.previousNote.title)
                    || ($scope.selectedNote.text !== $scope.previousNote.text)){

                    if($scope.selectedNote.title === ''){
                        $scope.selectedNote.title = "Untitled Note";
                    }
                    $scope.updateNote();
                    mf.ui.fitElementsHeight($('.notes-module [data-fixed-heigth]'));
                }
            }

            if(!e){
                doUpdateNote();
                return;
            }

            if(e.type === 'keyup'){
                $timeout.cancel($scope.timeouts['updateNote']);
                $scope.timeouts['updateNote'] = $timeout(function(){
                    doUpdateNote();
                },5000)
            }else if(e.type === 'blur'){
                doUpdateNote();
            }
        }


        $scope.getSearchUrlString = function() {
            var params = "?";
            if (!$scope.noteSearchTerm||$scope.noteSearchTerm.trim().length==0) {
                params+="query=";
            }else {
                params+="query="+$scope.noteSearchTerm.trim();
            }
            if ($rootScope.selectedContact && $rootScope.myPersonId && $rootScope.selectedContact.id == $rootScope.myPersonId) {
                $scope.strTipsAll = "Everyone's notes associated with me";
                $scope.strTipsMy = "My notes associated with me";                
            } else {
                params+="&createdForId="+$rootScope.selectedContact.id;
                $scope.strTipsAll = "Everyone's notes shared with "+$rootScope.selectedContact.displayName;
                $scope.strTipsMy = "My notes associated with "+$rootScope.selectedContact.displayName;
            }
            $scope.strLocked = "This note is currently being edited by someone else.";

            return params;
        }

        // Notes Search
        $scope.search = function(){
            window.clearTimeout(window.timoutSearch);
            window.timoutSearch = window.setTimeout(function(){
                var urlBase = PATHS.BASE_SERVICE_API_URL  + $rootScope.currentAccount + "/mindframe/note/search" + $scope.getSearchUrlString();
                $http({
                    method: 'POST',
                    url: urlBase,
                    headers: {
                        'Access-Token': $rootScope.credentials.accessToken
                    }
                }).success(function (data, status) {
                        if (data && data.data) {
                            $scope.notes = data.data;
                            if ($scope.notes.length>0) {
                                if ($scope.isPopWindow && $scope.noteSelectedFromParent.selectedNote !== null) {
                                    $scope.selectNote($scope.noteSelectedFromParent.selectedNote);
                                } else {
                                    var findNoteSelected = _.find($scope.notes, function(note){ return note.id==$scope.selectedNote.id; } );
                                    if (findNoteSelected) {
                                        $scope.selectNote(findNoteSelected);
                                    } else {
                                        var noteSelect = $scope.findLatestUpdateNote();
                                        $scope.selectNote(noteSelect);
                                    }
                                }

                            } else {
                                $scope.selectedNote = undefined;
                            }
                        }
                });

            }, 300);
        }

        $scope.clearSearch = function(){
            $scope.noteSearchTerm = '';
            $scope.search();
        }

        $scope.filterByTab = function(){
            return function(note) {
                if ($scope.isAllSelected) return true;

                if (note.createdBy && note.createdBy.id == $rootScope.myPersonId) {
                    return true;
                }
                return false;
            }
        }

        $scope.markKeyword = function(str) {
            if (!str||str.trim().length==0)
                return;
            var keyword = $scope.noteSearchTerm;
            if (!keyword || keyword.trim().length <= 0) {
                return $sce.trustAsHtml(str);
            };
            var newStr = replaceAll(str, keyword.trim(), "<mark>"+keyword.trim()+"</mark>");

            return $sce.trustAsHtml(newStr);
        }

		$scope.notesListLoaded = function(){
            console.log('notesListLoaded');

        }

        $scope.findLatestUpdateNote = function() {
            if (!$scope.notes || $scope.notes.length==0) return null;
            var noteMax = _.max($scope.notes, function(note){return new Date(note.updatedAt)});
            if (_.isEmpty(noteMax)) { //_.max may return -Infinity , use isEmpty to guard
                noteMax = $scope.notes[0];
            }
            return noteMax;
        }

        $scope.popOutNotes = function () {
            var popTimeStamp = new Date().getTime();
            var windowName = 'popnote-' + popTimeStamp + $rootScope.selectedContact.id;
            console.log('PopupService.openWindow = ' + windowName);
            $scope.popupData.SearchString = $scope.noteSearchTerm;
            $scope.popupData.CreatedFor = $rootScope.selectedContact.personId;
            $scope.popupData.CurrentNote =  $scope.selectedNote;
            PopupService.openWindow(windowName, $scope, 'popnotes.html' + '?version=' + localStorage.version, null, 900, 400);
            setTimeout(function(){PopupService.sendMessage(windowName, 'notespop', $scope.popupData)},2000);

        }

        // Initializarion
        $scope.$watch('viewContactNotes',
            function (newValue, oldValue) {
                if (newValue) {
                    $scope.getNotes();
                }
            }
        );

        $scope.$on('$destroy', function() {
            $timeout.cancel($scope.timeouts['updateNote']);
        });

        $scope.$on('refreshNotesForMe', function() {
            //$scope.enableSearchFilter('CreatedBy');
            if ($rootScope.selectedContact&&$rootScope.selectedContact.id==$rootScope.myPersonId) {
                $scope.search();
            }
        });

        $scope.onClickModulePopup = function(){
            $rootScope.isShowNoteInfo = false;
            $rootScope.deleteNoteContextual = false;

        }

        function sendMsgToPopup() {
            if (!$scope.isPopWindow) {
                $scope.popupData.SearchString = $scope.noteSearchTerm;
                $scope.popupData.CreatedFor = $rootScope.selectedContact.personId;
                $scope.popupData.CurrentNote =  $scope.selectedNote;
                var windowName = 'popnote-'+ $rootScope.selectedContact.id;
                PopupService.sendMessage(windowName, 'notespop', $scope.popupData);
            }
        }

        function sendMsgToParent() {
            if ($scope.isPopWindow) {
                var popupData={};
                popupData.SearchString = $scope.noteSearchTerm;
                popupData.CreatedFor = $scope.dataParent.selectedPerson.id;
                popupData.CurrentNote =  $scope.selectedNote;
                window.opener.postMessage(popupData, '*');
            }
        }

        $scope.init();
}])
.factory('NoteResource', function ( $rootScope, $http, Resource, Note, NoteSearch, NotePersonSearch ) {

    return {

        list: function (success, error) {
            var selectedPerson = $rootScope.selectedContact;
            NotePersonSearch.query({account: $rootScope.currentAccount, id:selectedContact.id, max:99, offset:0}, success, error);

        },

        search: function( searchParams, success, error) {
            //NoteSearch.query({account: $rootScope.currentAccount ,query:term,  max:99, offset:0},  success, error);
            NoteSearch.search(searchParams,  success, error);

        },

        add: function (note, success, error) {
            var noteRes = new Note(note);
            if (note.createdFor && note.createdFor.id) {

            }else if ($rootScope.selectedContact &&$rootScope.selectedContact.id) {
                noteRes.createdFor = {};
                noteRes.createdFor.id=$rootScope.selectedContact.id;
            }
            noteRes.$create({account:$rootScope.currentAccount},  success, error);

        },

        update: function(note, success, error) {
            var params = {id: note.id, account:$rootScope.currentAccount};
            var noteNew = {};
            noteNew.createdFor = note.createdFor;
            noteNew.id = note.id;
            noteNew.sharedGroupsList = note.sharedGroupsList;
            noteNew.sharedPeopleList = [];
            if (note.sharedPeopleList && note.sharedPeopleList.length>0) {
                for (var i=0;i<note.sharedPeopleList.length;i++) {
                    noteNew.sharedPeopleList.push(note.sharedPeopleList[i].id);
                }
            }
            noteNew.title = note.title;
            noteNew.text = note.text;
            noteNew.personal = note.personal;

            var noteRes = new Note(noteNew);
            noteRes.$update(params, success, error);
        },

        remove: function (note, success, error) {
            var noteRes = new Note(note);
            var params = {'id': note.id, account:$rootScope.currentAccount};
            noteRes.$remove(params, success, error);
            return;
        }

    };
})
    .directive('highlightNote',function($rootScope){
        return{
            restrict: 'A',
            scope : {},
            link: function (scope, element, attrs, ngModelCtrl) {
                if($rootScope.notesNotifications && $rootScope.notesNotifications.notesId.indexOf(scope.$parent.note.id+'') != -1){
                    scope.$parent.note.highlight = true;
                }

                element.bind('click', function(){
                    if(scope.$parent.note.highlight && $rootScope.notesNotifications){
                        var index = $rootScope.notesNotifications.notesId.indexOf(scope.$parent.note.id+'');
                        $rootScope.notesNotifications.notesId.splice(index,1);
                        scope.$parent.note.highlight = false;
                    }
                });
            }
        };
    });