angular.module('path.service', [])

    .factory('PathService', [
        '$rootScope',
        'PATHS', 'CALL_MANAGER', '$http',
        function ($rootScope, PATHS, CALL_MANAGER, $http) {

            var baseApiUrl = PATHS.BASE_SERVICE_API_URL;

            var baseResourceURL = baseApiUrl.replace(/:([^\/])/, '\\:$1');

            var baseCurrentAccountURL = function () {
                return baseApiUrl + $rootScope.currentAccount;
            };

            var PathService = {
            	
                getBaseApiUrl: function () {
                    return baseApiUrl;
                },
                getAppId: function () {
                    return PATHS.APP_ID;
                },
                getContactImageUrl: function () {
                	return PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.RES_CONTACT_IMAGE;
                },
                getJabberHost: function () {
                    return PathService.getUrlsFromServer.getJabberHost();
                },
                getJabberDomain: function () {
                    return PathService.getUrlsFromServer.getJabberDomain();
                },
                getAccessTokenUrl: function () {
                    return PATHS.BASE_SERVICE_API_URL + PATHS.ACCESS_TOKEN_URL;
                },
                getAccessMeUrl: function () {
                    return PATHS.BASE_SERVICE_API_URL + PATHS.ACCESS_ME_URL;
                },
                getMindFramePersonSearchUrl: function () {
                    return PATHS.BASE_SERVICE_API_URL + $rootScope.currentAccount + PATHS.PERSON_SEARCH_URL;
                },
                getPersonResourceUrl: function() {
                    return PATHS.BASE_SERVICE_API_URL + PATHS.PERSON_SEARCH_URL2;
                },
                getContactResoruceUrl: function () {
                    return baseResourceURL + PATHS.RES_CONTACT;
                },
                getUserResoruceUrl: function () {
                    return baseResourceURL + PATHS.RES_USER;
                },
                getAccountConfigUrl: function () {
                    return baseCurrentAccountURL() + PATHS.RES_ACCOUNT_CONFIG;
                },
                getContentGroupsUrl:function () {
                    return baseCurrentAccountURL() + PATHS.CONTENT_GROUPS;
                },

                //Call manager
                getCallManagerUrl: function () {
                    return PathService.getUrlsFromServer.getCallManagerUrl();
                },

                // Notes
                getNoteResoruceUrl: function () {
                    return baseResourceURL + PATHS.RES_NOTE;
                },
                getShareNoteUrl: function () {
                    return baseResourceURL + PATHS.RES_NOTE;
                },
                getNoteSearchResoruceUrl: function () {
                    return baseResourceURL + PATHS.RES_NOTE_SEARCH;
                },
                getNoteSearchPersonResoruceUrl: function () {
                    return baseResourceURL + PATHS.RES_NOTE_PERSON_SEARCH;
                },

                // --------------------------

                // Tasks
                getTaskResourceUrl: function () {
                    return baseResourceURL + PATHS.RES_TASK;
                },
                getShareTaskUrl: function () {
                    return baseResourceURL + PATHS.RES_TASK_SHARE;
                },
                getTaskSearchResourceUrl: function () {
                    return baseResourceURL + PATHS.RES_TASK_SEARCH;
                },
                getTaskSearchPersonResourceUrl: function () {
                    return baseResourceURL + PATHS.RES_TASK_PERSON_SEARCH;
                },

                //-----------------------------
                //File transfer
                getAWSFileTransferFormsParams: function () {
                    return baseResourceURL + PATHS.RES_AWS_S3;
                },
                getAWSFileTransferSignedUrl: function () {
                    return baseResourceURL + PATHS.RES_AWS_S3_SIGNED_URL;
                },


                //Get Urls from server
                getUrlsFromServer : {
                    get: function () {
                        return $http({
                            method: 'GET',
                            url: PathService.getAccountConfigUrl()
                        }).success(function (response) {
                            $rootScope.serverUrlsConfig = response.data.urlsConfig;
                            $rootScope.webExConfigs = response.data.webExConfigs;
                        }).error(function (error) {
                            console.log("Get URL Config Error: " + error);
                        });
                    },
                    getJabberHost: function () {
                        var urls = $rootScope.serverUrlsConfig;
                        if (urls != null && urls.jabberBindingUrl != '') {
                            return urls.jabberBindingUrl;
                        }
                    },
                    getJabberDomain: function () {
                        var urls = $rootScope.serverUrlsConfig;
                        if (urls != null && urls.jabberDomainUrl != '') {
                            return urls.jabberDomainUrl;
                        }
                    },
                    getCallManagerUrl: function () {
                        var urls = $rootScope.serverUrlsConfig;
                        if (urls != null && urls.callManagerUrl != '') {
                            return urls.callManagerUrl;
                        }
                    }
                },

                getSocketUrl :function(){
                    return  PATHS.SOCKET_URL;
                },

                //Get avatar from server
                getUserAvatar : {
                    get: function (personId, accesToken) {
                        var url = "";
                        if(personId != null && personId != undefined && personId != "") {
                            var random = Math.floor((Math.random() * 10000) + 1);
                            url = PathService.getContactImageUrl().replace(':personId', personId);
                            url += "?rdm=" + random + "&accessToken=" + encodeURIComponent(accesToken);
                        }
                        return url;
                    }
                }
                // --------------------------
            }



            return PathService;
        }
    ]);