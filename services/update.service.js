angular.module('update.service', [])

.factory('UpdateService',  ['$http', '$location', function($http, $location) {

	var stripQueryStringAndHashFromPath = function (url) {
		return url.split("?")[0].split("#")[0];
	}
	
	var getMajorVersion = function (version) {
		return version.split("-")[0];
	}
	
	var updateService = {
		checkForUpdates : function(callback) {
			var randomString = Math.floor((Math.random() * 1000000000) + 1);
			$http({
				method : 'GET',
				url : 'constants/version.json?uid=' + randomString
			}).success(function(response) {				
				if (response.appVersion)
				{					
					var isNewVersion = response.appVersion !== localStorage.version;
					var majorExistingVersion = getMajorVersion(localStorage.version);
					var majorNewVersion = getMajorVersion(response.appVersion);
					var isMajorUpdate = majorExistingVersion !== majorNewVersion;					
					callback(response, isNewVersion, isMajorUpdate);					
				}
			}).error(function(error) {
				console.log('updateService.error getting new version=' + error);
			});
		},
		updateToVersion : function(version) {
			var appBaseUrl = stripQueryStringAndHashFromPath(window.location.href);
			window.location.assign(appBaseUrl + '?version=' + version);
		}
	};

	return updateService;
}]);