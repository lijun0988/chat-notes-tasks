var fileShareApp = angular.module('fileShareApp', [ 'ui.bootstrap', 'ngResource','angularFileUpload']);

fileShareApp.factory('appSettings', function($location) {    
    return {
        getApiPath : function() {
            return 'https://nabu.fidelus.com/mindframe-backend/api/mindframe';
        }
    };
});

fileShareApp.factory('AWS', function($http, appSettings) {
    return {
        getFormParams : function(success, error) {
            $http.get(appSettings.getApiPath() + '/s3/formparams')
            .success(function(response) {
                success(response);
            })
            .error(function(response) {
                error(response);
            });
        },
        getSignedUrl : function(fileKey, success, error) {
            $http.get(appSettings.getApiPath() + '/s3/signedurl?key=' + fileKey)
            .success(function(response) {
            	if (success){
                    success(response);            		
            	}
            })
            .error(function(response) {
            	console.log(response);
            	if (error){
            		error(response);            		
            	}
            });
        }
    
    };
});


fileShareApp.controller('FileUploadController', function($scope, $upload, $http, AWS) {

	$scope.uploadedFiles = [];
	
	$scope.onFileUploaded = function (data, formData){
        console.log(data);
        var file = data.config.file;
        var fileKey = formData.key;
        
        AWS.getSignedUrl(fileKey, function (signedUrlResponse){
        	$scope.uploadedFiles.push ({name:file.name, url:signedUrlResponse.signedUrl});	
        });                
	}
	
	$scope.onFileSelect = function($files) {

		for (var i = 0; i < $files.length; i++) {
			 var $file = $files[i];
			
			 AWS.getFormParams(function(response){
				 
				 var thatScope = $scope;
				 
	             var formData = {
	                 key: response.key,
	                 AWSAccessKeyId: response.awsAccessKeyId,
	                 acl: response.acl,
	                 success_action_redirect: "#",
	                 policy: response.policy,
	                 signature: response.signature,
	                 'Content-Type': $file.type
	             };
	            
	             $scope.upload = $upload.upload({
	                 method: 'POST',
	                 url: response.awsUrl,
	                 headers: {Authorization: ""},
	                 data: formData,
	                 file: $file
	             })
	             .progress(function(evt) {
	                 console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	             })
	             .then(function (data){
	            	 thatScope.onFileUploaded(data, formData);
	             });
	         }, function(){
	             alert("failed to download policy file");
	         });
		}
	};
});