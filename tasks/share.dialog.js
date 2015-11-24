mfApp.controller('showShareDialogCtrl',
    ['$scope',
    '$rootScope',
    '$window',
    '$log',
    '$timeout',
    function($scope, $rootScope, $window, $log, $timeout){

        $scope.metaData = {title:'', desc:'', btnOK:'SHARE', btnCancel:'CANCEL', isHideTags:false, isHideFooter:false};


        $scope.$on('confirmShare', function(event, task) {
            if (!task) {
                $log.error('task sending to me is null');
                return;
            }
            $log.debug('task sending to me in dialog , id is '+task.id);

            $scope.metaData.isHideTags = true;
            $scope.metaData.isHideFooter = true;
            $scope.metaData.title = mfMessages.notesTaskShare.title;
            $scope.metaData.desc = mfMessages.notesTaskShare.descTaskConfirm;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnOK;

        });
        $scope.$on('blankShare', function(event, task) {
            if (!task) {
                $log.error('task sending to me is null');
                return;
            }
            $log.debug('task sending to me in dialog , id is '+task.id);

            $scope.metaData.isHideTags = false;
            $scope.metaData.isHideFooter = false;
            $scope.metaData.title = mfMessages.notesTaskShare.title;
            $scope.metaData.desc = mfMessages.notesTaskShare.descTaskAskBlank;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnShare;

        });
        $scope.$on('remindShare', function(event, task) {
            if (!task) {
                $log.error('task sending to me is null');
                return;
            }
            $log.debug('task sending to me in dialog , id is '+task.id);

            $scope.metaData.isHideTags = false;
            $scope.metaData.isHideFooter = false;
            $scope.metaData.title = mfMessages.notesTaskShare.titleChanges;
            $scope.metaData.desc = mfMessages.notesTaskShare.descTaskAsk;
            $scope.metaData.btnOK = mfMessages.notesTaskShare.btnShare;

        });


        $scope.onClickModal = function(e) {
            e.stopPropagation();

        };

        $scope.shareBtnClick = function(e) {
            e.stopPropagation();

            if (!$scope.selectedTask.id){
                return;
            }

            if ($scope.metaData.isHideTags==true) {

            }
            else {

              $timeout(function(){ $rootScope.isShowTaskDialog = false; },200);
              $rootScope.$broadcast('shareFromDialog', $scope.selectedTask);
            }
        };

        $scope.cancelBtnClick = function(e) {
            e.stopPropagation();
            $rootScope.isShowTaskDialog = false;
        };

        $scope.init();

    }])