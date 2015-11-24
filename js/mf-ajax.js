var mHost = location.protocol+'//' + location.hostname + (location.port ? ':'+location.port : '') + '/mindframe-backend/api';

var domain = location.hostname;
var subdomain = domain.split('.');
if(subdomain[0] === 'local' || subdomain[0] === 'localhost') {
	domain = 'nabu.fidelus.com';
}

//These are used later to build the url's below once we get the account names and auth Token.
var sPersonSearch = "/mindframe/person/search";
var mWsPersonSearch="";

/**
 * @TODO: I think this function is deprecated (13-08-2014)
 */
//This is used after we get the authentication response to add the account name
//to all of the webservice URLs
function updateServiceUrls(accountName){
	mWsPersonSearch = mHost + "/" + accountName + sPersonSearch;
}


function showMindFrameInfo(numberInfo, personName) {
    var $rootScope = mf.angular.rootScope();
    var $contactPaneScope = angular.element($('[data-ng-controller="ContactsController"]')).scope();
    if (!numberInfo) {
        mf.content.clear( mf.elements.content.container.find('.subscribers-contents') );
        mf.elements.body.addClass( mf.cssClasses.NO_USER_CONTENT );
        mf.ajax.loadingIcon.off( mf.elements.content.container );
        mf.content.clear();

        $rootScope.selectedContact.displayName = personName;
        $rootScope.selectedContact.selectedPhone = {};
        $rootScope.selectedContact.isUnrecognized = true;
        return;
    }

    numberInfo = numberInfo.replace(/[^0-9*#+]/g, '');
    mf.content.clear( mf.elements.content.container.find('.subscribers-contents') );
    mf.ajax.loadingIcon.off( mf.elements.content.container );
    //MF-1096 need to trim +1 added by call manager
    var queryNumberInfo = numberInfo.length>10?numberInfo.substring(numberInfo.length-10):numberInfo;
    $.ajax({
        url: mf.services.url.personSearch,
        type: "GET",
        dataType:"json",
        data: {"query": queryNumberInfo, "onlyExactMatchAndEndsWith": true, "includeDisabled":false},
        success: function (msg) {
          if (msg == null) return;
           console.log(msg);
           var persons = msg.data;

          $rootScope.statusShowHideMF = true;
          $rootScope.viewSettings = false; // hide settings

          if (persons==null||persons.length==0) {
               console.log("search: no persons return from server.");

               var personInfo = {};
               personInfo.content = [];
               personInfo.person = {};
               personInfo.person.selectedPhone = {};
               personInfo.person.selectedPhone.number = numberInfo;

               mf.call.hasContent = false;
               mf.elements.body.addClass( mf.cssClasses.NO_USER_CONTENT );
               mf.ajax.loadingIcon.off( mf.elements.content.container );
               mf.content.clear();

              // Now in Angular
              $rootScope.selectedContact = {};
              //$contactPaneScope.$apply(function(){
              $rootScope.selectedContact.selectedPhone = personInfo.person.selectedPhone;
              $rootScope.selectedContact.isUnrecognized = true;

              //replace conference call names
              window.calls.replaceHeaderNames(numberInfo, numberInfo);

              return;
          }

          var personSelect = null;
          //show content
          for (var i=0 ; i<persons.length ; i++) {
              if (persons[i]&&persons.length==1) {
                  personSelect = persons[i];
                  mf.content.selectPerson(persons[i]);//only show the content , not change $rootScope.selectedContact
                  break;
              } else {
                  if (personName) {
                      var lastName = personName.split(' ')[1];
                      if (lastName == persons[i].lastName) {
                          personSelect = persons[i];
                          mf.content.selectPerson(persons[i]);//only show the content , not change $rootScope.selectedContact
                          break;
                      }
                  }
              }
          };
          if (!personSelect) {
              personSelect = persons[0];
              mf.content.selectPerson(persons[0]);//only show the content , not change $rootScope.selectedContact
          }

          if(personSelect){
              //replace conference call names
              window.calls.replaceHeaderNames(numberInfo, personSelect.firstName+' '+personSelect.lastName);

              $rootScope.selectedTabbedContent = undefined; //when focus is on tasks/notes, we should switch to first cues tab
              numberInfo = numberInfo.replace(/[a-z\+\-\(\)\s]/g, ''); // remove special characters before call.
              //sometimes a incoming call from an unknown person , we need to show the header.
              if (!$rootScope.selectedContact||$rootScope.selectedContact.personId!=personSelect.id) {
                  personSelect.displayName = personSelect.firstName+' '+personSelect.lastName;
                  $rootScope.selectedContact = personSelect;
                  $rootScope.selectedContact.personId = personSelect.id;
                  $rootScope.selectedContact.phones = groupContactPhones(personSelect.accounts[0]);
                  var foundPhoneNumber = false;
                  for (var j = 0; j < $rootScope.selectedContact.phones.length; j++) {
                      var numberPhone = $rootScope.selectedContact.phones[j].number;
                      numberPhone = numberPhone.replace(/[a-z\+\-\(\)\s]/g, '');
                      if(numberPhone == numberInfo){
                          $rootScope.selectedContact.selectedPhone = $rootScope.selectedContact.phones[j];
                          foundPhoneNumber = true;
                          break;
                      }
                  }
                  if (!foundPhoneNumber) {
                       $rootScope.selectedContact.selectedPhone = $rootScope.selectedContact.phones[0];
                  }
              }
              //sometimes we need to find the person in contact list, in order to get the right presence
              for (var i = 0; i < $contactPaneScope.contactsList.length; i++) {
                  if(personSelect.username && $contactPaneScope.contactsList[i].key && $contactPaneScope.contactsList[i].key == personSelect.username){
                    $rootScope.selectedContact = $contactPaneScope.contactsList[i];
                    //in order to show the person content , set id to personId
                    $rootScope.selectedContact.personId = personSelect.id;
                    $rootScope.selectedContact.id = personSelect.id;
                    $rootScope.selectedContact.phones = groupContactPhones(personSelect.accounts[0]);
                    for (var j = 0; j < $rootScope.selectedContact.phones.length; j++) {
                        var numberPhone = $rootScope.selectedContact.phones[j].number;
                        numberPhone = numberPhone.replace(/[a-z\+\-\(\)\s]/g, '');
                        if(numberPhone == numberInfo){
                          $rootScope.selectedContact.selectedPhone = $rootScope.selectedContact.phones[j];
                          break;
                        }
                    }
                    break;
                  }
              }


              $rootScope.selectedContact.isUnrecognized = false;

              if(!$rootScope.$$phase){$rootScope.$apply()};
          }


        },
        error: function (msg) {
            console.log("error:"+msg);
        }
     });
}