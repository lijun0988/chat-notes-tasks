angular.module('storage.service', [])

.factory('StorageService', 
    function ($rootScope) {
        
        var storageService = {
            set: function(key, value){
                try{
                    if(!key || key === undefined) throw Error('The key is not valid.');
                    localStorage.setItem(key, value);
                }catch(ex){
                    mf.console.error(ex, 'storage.service.set()');
                }           
            },
            get: function(key){
                try{
                    if(!key || key === undefined) throw Error('The key is not valid.');
                    var output = localStorage.getItem(key);
                    return output;
                }catch(ex){
                    mf.console.error(ex, 'storage.service.get()');
                }
            },
            remove: function(key){
                try{
                    if(!key || key === undefined) throw Error('The key is not valid.');
                    localStorage.removeItem(key);
                }catch(ex){
                    mf.console.error(ex, 'storage.service.remove()');
                }
            },
            clear: function(){
                localStorage.clear();
            },

            // Specific for current user

            userSettingsInit: function(){
                try{

                    // TODO: check this code.

                    // Settings > General > Show content specific to
                    var settingsContentOrder = this.userGet('settings.contentOrder');
                    if(!settingsContentOrder){
                        mf.user.preferences.set('settings.contentOrder', mf.elements.settings.general.contentOrderRadioGroup[0].value);
                    }else if(typeof settingsContentOrder == 'string'){
                        mf.elements.settings.general.contentOrderRadioGroup.removeAttr('checked');
                        for (var i = 0; i < mf.elements.settings.general.contentOrderRadioGroup.length; i++) {
                            if(mf.elements.settings.general.contentOrderRadioGroup[i].value == settingsContentOrder){
                                mf.elements.settings.general.contentOrderRadioGroup[i].checked = true;
                            }
                        };
                    };
                }catch(ex){
                    mf.console.error(ex, 'storage.service.userSettingsInit()');
                }
            },
            userGet: function(key){
                if (!$rootScope.credentials || !$rootScope.credentials.user) return;
                try{
                    if(!key || key == '') throw Error('Invalid key');
                    var output; 
                    var returnValue = $rootScope.credentials.user != 'undefined' && $rootScope.credentials.user != undefined ? this.get($rootScope.credentials.user + '.' + key) : '';
                    try{
                        output = JSON.parse(returnValue);
                        return output;
                    }catch(ex){
                        return returnValue;
                    }
                }catch(ex){
                    mf.console.error(ex, 'storage.service.userGet()');
                }
            },
            userSet: function(key, value){
                if (!$rootScope.credentials || !$rootScope.credentials.user) return;
                try{
                    if(!key || key == '') throw Error('Invalid key');

                    this.set( $rootScope.credentials.user + '.' + key, JSON.stringify(value));
                }catch(ex){
                    mf.console.error(ex, 'storage.service.userSet()');
                }
            },
            userClear: function() {
                if (!$rootScope.credentials || !$rootScope.credentials.user) return;
                try{
                    this.remove($rootScope.credentials.user + '.' + 'settings.password');
                    this.remove($rootScope.credentials.user + '.' + 'settings.cucm' );
                    this.remove($rootScope.credentials.user + '.' + 'settings.phoneMode' );
                    this.remove($rootScope.credentials.user + '.' + 'settings.device' );

                }catch(ex){
                    mf.console.error(ex, 'storage.service.userClear()');
                }
            }
        };

        return storageService;
    }
);