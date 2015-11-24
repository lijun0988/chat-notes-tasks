
/**
 * Helper object that manages UI-related multi call handling.
 */
var multiCallContainer = function(callPrefix, parentId) {
    var calls = {};
    var selectedCallId = null;

    var callsNameMap = [];

    var methods = {
        addCall: function(conversation, container) {
            var callIsNew = false;
            if(!(calls[conversation.callId])) {
                // no call or old call is not connected or not (Ringout || OffHook && canEndCall) and new one is something more active
                // entirely too complicated of a condition, but that's asynchronous multiple calls for you
                if(!selectedCallId ||
                    !calls[selectedCallId] ||
                    (calls[selectedCallId].callState !== "Ringout" &&
                        calls[selectedCallId].callState !== 'Connected' &&
                        (calls[selectedCallId].callState !== 'OffHook' || !calls[selectedCallId].capabilities.canEndCall) && (conversation.callState === 'Ringin' || conversation.callState === 'Ringout' || conversation.callState === 'OffHook'))) {
                    selectedCallId = conversation.callId;
                    $('ul#calllist li').removeClass('selected');
                }

                var $calls = $('#' + parentId);
                $calls.append($('<li' +(selectedCallId === conversation.callId ? ' class="selected"' : '') + ' id="' + callPrefix + '_' + conversation.callId + '">' +
                    //'<span class="controls"><button type="button" class="answerbtn">Answer</button> <button type="button" class="divertbtn">iDivert</button></span>' +
                    '<span class="name"></span>' +
                    '<span class="state"></span>'));//<b>' + conversation.participant.name + ':</b> ' + conversation.participant.recipient + '</li>'));

                //$calls[0].scrollTop = $calls[0].scrollHeight;
                $newCall = $('#'+callPrefix+'_'+conversation.callId);
                $newCall.find('.answerbtn').click(incomingAnswerClick);
                $newCall.find('.divertbtn').click(incomingDivertClick);
                $newCall.bind('conversationUpdate.cwic',handleConversationUpdate)
                        .bind('conversationEnd.cwic', handleConversationEnd);
                callIsNew = true;
                $('#switchmodebtn').attr('disabled',true);
            }
            calls[conversation.callId] = conversation;
            methods.updateCall(conversation, container);
            return callIsNew;
        },

        getCall: function(callid) {
            return calls[callid];
        },
        getCalls: function() {
            return calls;
        },
        removeCall: function(callid) {
            if(calls[callid]) {
                delete calls[callid];
                var $remove = $('#' + callPrefix + '_' + callid);
                $remove.find('.answerbtn').unbind();
                $remove.find('.divertbtn').unbind();
                $remove.unbind();
                $remove.remove();
            }

            selectedCallId = null;
            for(var call in calls) {
                if(calls.hasOwnProperty(call)) {
                    selectedCallId = calls[call].id;
                }
            }
            methods.setSelectedCall(selectedCallId);
            //no calls
            if(!selectedCallId) {
                //$(document).cwic('updateConversation', { 'removeRemoteVideoWindow':videoObject });
                $(document).cwic('removePreviewWindow',{previewWindow: 'localPreviewVideo' });

                //empty all tabs including hide ones
                $('#calllist').empty();

                $('#switchmodebtn').removeAttr('disabled');
                $('#callcontainer').hide();
                mf.angular.mainScope().isVideoCall  = false;
                mf.ui.fitElementsHeight($('[data-video-heigh-adjust]'));
                //when the conversation is End  , need to restore buttons for single call
                //but when it's multi calls, one conversation is End, shouldn't restore o
                mf.ui.disableHandlingBarButtons();
                mf.ui.handleCallButtonsVisibility( mf.call.events.END );

                if(popupwindow) {
                    popupwindow.close();
                }
            }
        },

        removeAll: function() {
            for(var call in calls) {
                if(calls.hasOwnProperty(call)) {
                    methods.removeCall(calls[call].id);
                }
            }
            selectedCallId = null;
            $('#switchmodebtn').attr('disabled',true);
            $('#callcontainer').hide();
            mf.angular.mainScope().isVideoCall  = false;
            mf.ui.fitElementsHeight($('[data-video-heigh-adjust]'));
            //empty all call list in case of some ones are hidden
            $('#calllist').empty();
        },

        updateCall: function(conversation,container) {
            var $update = $('#' + callPrefix + '_' + conversation.callId);
            var name = '';
            var title = '';
            var state = '';
            if(container) {
                var $container = $(container);
                var classes = getCwicClasses($container);
                var oldclasses = getCwicClasses($update);
                $container.removeClass(classes);
                $update.data('cwic',$container.data('cwic')).removeClass(oldclasses).addClass(classes);
            }

            if(conversation.callState === 'Reorder') {
                name = conversation.calledPartyNumber;
                state = 'Call Failed';
            } else {
                state = conversation.callState;
                state = state.toLowerCase();
                if (state=='offhook') state='calling';
                if (conversation.isConference) {
                    state = 'merged';
                    $update.find('.state').text(state).attr('class', 'state icons merged');
                    var mapParticipants = []; //multi header for conference with same id
                    for(var i=0;i<conversation.participants.length;i++) {
                        var number = conversation.participants[i].number;
                        mapParticipants[number] = conversation.participants[i];
                        if ($('#calllist span.name[title="'+number+'"]').length==0) {
                            var cloneItem = $update.clone();
                            number = number.replace(/[^0-9*#+]/g, '');
                            var nameShow = callsNameMap[number]?callsNameMap[number]:number;
                            cloneItem.find('.name').attr('title', number).text(nameShow);
                            $('#calllist').append(cloneItem);
                        }
                    }

                }
                else if (conversation.callType === "Outgoing") {
                    name = conversation.calledPartyName;
                    title = conversation.calledPartyDirectoryNumber;
                    title = title.replace(/[^0-9*#+]/g, '');
                    if (!name) name = title;
                    if (state.toUpperCase()=='RINGOUT')
                        state = 'calling';
                }
                else if (conversation.callType === "Incoming") {
                    name = conversation.callingPartyName;
                    title = conversation.callingPartyDirectoryNumber;
                    title = title.replace(/[^0-9*#+]/g, '');
                    if (!name) name = title;
                    if (state.toUpperCase()=='RINGIN')
                        state = 'calling';
                }

                //TODO: may has issues by remove the merged: if the same phone number header has multiple instance, just show one (conference call cloned the headers)
                if (title) {
                    var sameNumberItems = $('#calllist span.name[title="'+title+'"]');
                    if (sameNumberItems.length>1) {
                        for (var m=0;m<sameNumberItems.length;m++){
                            var eachItem = $(sameNumberItems[m]);
                            var hasMergedBefore = eachItem.parent().find('.state').hasClass('merged');
                            if (hasMergedBefore) {
                                eachItem.parent().remove();
                            }
                        }
                    }
                }
            }

            if(conversation.capabilities.canImmediateDivert || conversation.capabilities.canAnswerCall) {
                //$update.find('.divertbtn').attr('disabled', !conversation.capabilities.canImmediateDivert);
                //$update.find('.answerbtn').attr('disabled', !conversation.capabilities.canAnswerCall);
                //$update.find('.controls').show();
            } else {
                $update.find('.controls').hide();
                //TODO handle incoming event ?
            }


            if (!$update.find('.name').text())
            {
                $update.find('.name').text(name);
            }

            //set the icons of state
            if (!conversation.isConference) {
                  //$update.find('.name').text(name).attr('title',title);
                  $update.find('.name').attr('title',title);
                  $update.find('.state').text(state).attr('class', 'state icons ' + state);
            }
            //sometimes when a conference call only left 2 persons, need to show the correct header
            var isOriginalHeader = false;
            var oneHeaderUserPhone = $('.top-contact-info .left-right-nav .user-phone').text();
            oneHeaderUserPhone = oneHeaderUserPhone.replace(/[^0-9*#+]/g, '');
            var conversationNumber = title.replace(/[^0-9*#+]/g, '');
            if (conversationNumber) {
                if (conversationNumber==oneHeaderUserPhone) {
                    isOriginalHeader = true;
                }
                if(!selectedCallId || (!conversation.isConference && methods.getCallsCount()==1 && !isOriginalHeader)  ) {
                    if (!methods.isCallVoiceMail(conversationNumber)) {
                        methods.setSelectedCall(conversation.callId);
                    }
                }
            }
        },
        isCallVoiceMail: function(conversationNumber) {
            return conversationNumber=='6100';
        },

        getSelectedCall: function() {
            return calls[selectedCallId];
        },

        getCallDiv: function(callId) {
            if(!callId) {
                callId = selectedCallId;
            }
            return $('#'+callPrefix+'_'+callId);
        },
        setSelectedCall: function(callid, phoneNumber, nojumpProfile) {
            selectedCallId = callid;
            $('#calllist li').removeClass('selected');
            var $activeCallEle = $('#'+callPrefix+'_'+callid);
            //if there's phone number, we need find exactly parent li, cause when conference call there's same IDs existing
            if (phoneNumber) {
                $activeCallEle = $('#calllist').find('span[title="'+phoneNumber+'"]').parent();
            }
            $activeCallEle.addClass('selected');

            updateConversationInfo(calls[selectedCallId], '#callcontainer');

            var conversation = calls[selectedCallId];
            var name = null;
            if (conversation && conversation.callType === "Outgoing") {
                name = conversation.calledPartyName;
            }
            else if (conversation && conversation.callType === "Incoming") {
                name = conversation.callingPartyName;
            }
            clearTimeout(mf.timeouts['switchTab']);
            mf.timeouts['switchTab'] = setTimeout(function(){
                if (!phoneNumber)
                    phoneNumber = $activeCallEle.find('.name').attr('title');
                if (phoneNumber) {
                    phoneNumber = phoneNumber.replace(/[^0-9*#+]/g, '');
                    console.log("click tab conversation phone number is "+phoneNumber);

                    showMindFrameInfo(phoneNumber, name);
                }
            }, 200);

        },

		isCallListEmpty:function(){
			if ($('#calllist').children().size()) {
                return false;
			}
			return true;
		},

		setCallMap:function(conversation){
			calls[conversation.callId] = conversation;
		},

		getCallMap: function(conversationId) {
            return calls[conversationId];
        },

        callListClick: function(e) {
            if((e.target.id !== "calllist")) {
                var el = $(e.target);
                while(el.length && el[0].id.indexOf(callPrefix)) {
                    el = el.parent();
                }
                if(el.length) {
                    var selectedCallid = el[0].id.replace(callPrefix+"_","");
                    var phoneNumber = el.find('.name').attr('title');//design for conference because there's same IDs when merge calls.
                    methods.setSelectedCall(selectedCallid, phoneNumber);
                    settings.log('selected call id:' + selectedCallid+','+phoneNumber);
                    var call = methods.getSelectedCall();
                    settings.log('selected call:',call);
                    methods.updateCall(call);
                }
            }
        },
        replaceHeaderNames: function(number, displayName) {
            //if (methods.getCallsCount()<=1)
            //    return;
            if (number && displayName)
                callsNameMap[number] = displayName;
            //setTimeout(function(){
            if ($('#calllist li').length>1 ) {
                $('#calllist li').each(function(i,element){
                    element = $(element);
                    var num = element.find('.name').attr('title');
                    if (num) {
                        num = num.replace(/[^0-9*#+]/g, '');
                        if (num == number){
                            element.find('.name').text(displayName).attr('title',num);

                        }
                    }
                });
            }
            //}, 1000);
        },

        getCallsCount: function() {
            return Object.keys(calls).length;
        },
        getCallsNames:function(number) {
            return callsNameMap[number];
        }
    };

    return methods;
};

