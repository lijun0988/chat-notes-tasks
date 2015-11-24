'use strict';

var profile = angular.module('profile', ['flow', 'toastr', 'blockUI']);

profile.config(['flowFactoryProvider', function (flowFactoryProvider) {
	flowFactoryProvider.defaults = {
		permanentErrors: [404, 500, 501],
		maxChunkRetries: 1,
		simultaneousUploads: 1,
		singleFile: true,
		testChunks: false
	};

	flowFactoryProvider.on('catchAll', function (event) {
      console.log(event);
    });
}]);

profile.config(['blockUIConfigProvider', function (blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
}]);

profile.controller('ProfileController',
	['$scope',
	'$rootScope',
	'$http',
	'PATHS',
	'AuthenticationService',
    'PathService',
	'blockUI',
	'$location',
	function($scope, $rootScope, $http, PATHS, AuthenticationService, PathService, blockUI, $location ){
		/**
		 *  Comunication with the server to get the profile image
		 */
		var apiCall = function(method, filename) {
			var url = PATHS.BASE_SERVICE_API_URL + 'akkadian/userImage/' + $rootScope.credentials.clientAccounts[0].currentPersonId,
				fd = new FormData();

			fd.append('image', filename);
			var promise = $http({
				method: method,
				url: url,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity,
				data: fd
			});
			return promise;
		};

		/**
		 * @param imagePath {string} image
		 * @param silent {boolean} if it's true the notifications are hidden
		 */
		var deleteImage = function(imagePath, silent) {
			var $deferred;
			silent = silent ? silent : false;

			if(!silent) {
				$deferred = apiCall('DELETE', $scope.image);
				$deferred.success(function (response, silent) {
					if(typeof response.message === 'string') {
						if(response.success) {
							toastr.success(response.message);
						}
						else {
							toastr.warning(response.message);
						}
					}
				})
				.error(function (error, silent) {
					toastr.warning(error);
				});
			}
		};

		$scope.image = null;
		$scope.authenticationService = AuthenticationService;
		$scope.btnText = $scope.image === null ? 'Add Image' : 'Edit Image';

		// event to get the profile image when the module starts
		$rootScope.$on('auth:credentials', function(event, data) {

           $scope.authenticationService.whoiam($rootScope.currentAccount, function(data){
               $scope.image = PathService.getUserAvatar.get(data.data, $scope.authenticationService.credentials.accessToken);
            });

            $rootScope.me.image = $scope.image;
            $scope.btnText = 'Edit Image';

		});

		$scope.showImage =  function() {
			return $scope.image !== null;
		}

		$scope.remove = function() {
			if($scope.image) {
				$scope.$flow.cancel();
				deleteImage($scope.image, false);
				$scope.btnText = 'Add Image';
				$scope.image = null;
				$rootScope.me.image = null;
			}
		}

		/**
		 * Event triggered by flow.js when the photo is uploaded
		 * we avoid that flow.js ($flow.upload()) send the image and we do that manually
		 */
		$scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {
			event.preventDefault();
			// check if it is the same file
			if(flowFile.length > 0) {
				blockUI.start();

				var file = flowFile[0].file,
					random = '?rdm=' + Math.floor((Math.random() * 10000) + 1),
					$deferred = apiCall('POST', file);
					$deferred.success(function (response) {
						if(typeof response.data === 'object' && response.data.hasOwnProperty('currentPersonId')) {
							//deleteImage($scope.image, true);
                            var img = PathService.getUserAvatar.get(response.data.currentPersonId, $scope.authenticationService.credentials.accessToken);
                            $scope.btnText = 'Edit Image';
                            $scope.image = img;
                            $rootScope.me.image = img;

							toastr.info('Image successfully uploaded');
						}
						else if(typeof response.message === 'string') {
							if(response.success) {
								toastr.success(response.message);
							}
							else {
								toastr.warning(response.message);
							}
						}
						blockUI.stop();
					})
					.error(function (error) {
						toastr.warning('Ups! Something is wrong with the server.');
						blockUI.stop();
					});
			}
		});

}]);
