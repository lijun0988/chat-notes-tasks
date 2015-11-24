var dialPadWindow;

$(document).ready(function () {

    $(document).bind('mainWindow', function (e, message) {

        switch (message){
            case 'close':
                angular.element($("#callbtn-dial-pad")).scope().dialPadPopup.isOpen = false;
                localStorage.DialNumber = '';
                break;
            case 'call':
                var currentInputVal = localStorage.DialNumber;
                if (typeof(Storage) != "undefined") {
                    localStorage.setItem("IsContactInfo", false);
                    localStorage.setItem("CallContactName", '');
                }
                showMindFrameInfo(currentInputVal);
                callButtonClick(currentInputVal);
                break;
            case 'end-call':
                mf.elements.callBtnEnd.click();
                localStorage.DialNumber = '';
                break;
            default :
                $("#dialPad-Number").val(message);
                var value = message.replace(/[^0-9*#+]/g, '');
                var char = DTMF.getCharFromString(value);
                DTMF.sendDTMFChar(char);
        }
    });

   /* $(document).bind('keypress', function (event) {
        event.stopPropagation();

        var value = String.fromCharCode(event.charCode || event.keyCode).replace(/[^0-9*#+]/g, '');
        var char = DTMF.getCharFromString(value);
        if (char !== '' && localStorage.CallInProgress == 'true') {
            DTMF.sendDTMFChar(char);
        }
    });*/


    var DTMF = {
        sendDTMFChar: function (char) {
            var conversation = calls.getSelectedCall();
            console.log("DTMF:" + conversation.state);
            if (conversation && conversation.state === 'Connected') {
                if (dtmfchars[char]) {
                    calls.getCallDiv().cwic('sendDTMF', char);
                }
            }
        },

        getCharFromString : function(value){
            return value.charAt(value.length - 1);
        }
    };
});