mfApp.controller('showNoteShareDialogCtrl',
    ['$scope',
    '$rootScope',
    '$window',
    '$log',
    '$timeout',
    function($scope, $rootScope, $window, $log, $timeout){

        $scope.metaData = {title:'', desc:'', btnOK:'SHARE', btnCancel:'CANCEL', isHideTags:false, isHideFooter:false};


        $scope.$on('confirmShare', function(event, note) {
            if (!note) {
                $log.error('note sending to me is null');
                return;
            }
            $log.debug('note sending to me in dialog , id is '+note.id);

            $scope.metaData.isHideTags = true;
            $scope.metaData.isHideFooter = true;
            $scope.metaData.title = mfMessages.notesTaskShare.title;
            $scope.metaData.desc = mfMessages.notesTaskShare.descNoteConfirm;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnOK;

        });
        $scope.$on('blankShare', function(event, note) {
            if (!note) {
                $log.error('note sending to me is null');
                return;
            }
            $log.debug('note sending to me in dialog , id is '+note.id);

            $scope.metaData.isHideTags = false;
            $scope.metaData.isHideFooter = false;
            $scope.metaData.title = mfMessages.notesTaskShare.title;
            $scope.metaData.desc = mfMessages.notesTaskShare.descNoteAskBlank;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnShare;

        });
        $scope.$on('remindShare', function(event, note) {
            if (!note) {
                $log.error('note sending to me is null');
                return;
            }
            $log.debug('note sending to me in dialog , id is '+note.id);

            $scope.metaData.isHideTags = false;
            $scope.metaData.isHideFooter = false;
            $scope.metaData.title = mfMessages.notesTaskShare.titleChanges;
            $scope.metaData.desc = mfMessages.notesTaskShare.descNoteAsk;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnShare;

        });


        $scope.onClickModal = function(e) {
            e.stopPropagation();

        };

        $scope.shareBtnClick = function(e) {
            e.stopPropagation();
            if (!$scope.selectedNote.id){
                return;
            }
            if ($scope.metaData.isHideTags==true) {

            }
            else {

                $timeout(function(){ $rootScope.isShowNoteDialog = false; },200);

                $rootScope.$broadcast('shareFromDialog', $scope.selectedNote);

            }
        };

        $scope.cancelBtnClick = function(e) {
            e.stopPropagation();
            $rootScope.isShowNoteDialog = false;
        };

        $scope.init();

    }])