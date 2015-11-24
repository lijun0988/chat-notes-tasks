function escapeRegEx(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegEx(find), 'ig'), replace);
}

function getRandomId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

//todo contact.phones  is different with person.accounts[0].phones , be careful
function groupContactPhones(mfContact){
    if (mfContact.phones && mfContact.phones.length>0) {
        if (mfContact.phones[0].type && mfContact.phones[0].number)
            return mfContact.phones;
    }

    var phones = [];
    if(mfContact.phones){
        for (var i = 0; i < mfContact.phones.length; i++) { //here , the .phones should be office phones when search person
            var phone = {};
            phone.number = mfContact.phones[i];
            phone.type = 'office-phone';
            if (phone.number.toString().length<=4)
                phones.unshift(phone);
            else
                phones.push(phone);
        }
    }
    if(mfContact.mobilePhones){
        for (var i = 0; i < mfContact.mobilePhones.length; i++) {
            var phone = {};
            phone.number = mfContact.mobilePhones[i];
            phone.type = 'mobile-phone';
            phones.push(phone);
        }
    }
    if(mfContact.homePhones){
        for (var i = 0; i < mfContact.homePhones.length; i++) {
            var phone = {};
            phone.number = mfContact.homePhones[i];
            phone.type = 'home-phone';
            phones.push(phone);
        }
    }

    return phones;
}


function createSelection(field, start, end) {
    if( field.createTextRange ) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}


/* Text selection */
function selectElementContents(el) {
    console.log('selectElementContents');
    var range;
    if (window.getSelection && document.createRange) {
        range = document.createRange();
        var sel = window.getSelection();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

function setCursorToEnd(ele)
{
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(ele, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    ele.focus();
}

// When changing this statuses array change also the same array in contacts.module.js
var statuses = {
    'available': 'status-online',
    'Available': 'status-online',
    'Unavailable': 'status-offline',
    'unavailable': 'status-offline',
    'chat': 'status-online',
    'away':'status-unavailable',
    'Away':'status-unavailable',
    'xa': 'status-unavailable',
    'donotdisturb':'status-busy',
    'dnd':'status-busy',
    'Do not disturb':'status-busy',
    'offline':'status-offline',
    'Offline':'status-offline',
    'In a Meeting': 'status-unavailable',
    'In a meeting': 'status-unavailable',
    'In a WebEx meeting': 'status-unavailable',
    'Presenting': 'status-busy',
    'Custom Available':'status-online',
    'Custom Away':'status-unavailable',
    'Custom do not disturb':'status-busy',
    'On a call':'status-unavailable',
    'on a call':'status-unavailable'
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}