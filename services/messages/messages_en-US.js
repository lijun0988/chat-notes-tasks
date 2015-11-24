var mfMessages = {
	authentication:{
		wrongEmail: 'The email or password you entered is incorrect.',
		wrongPassword: 'The email or password you entered is incorrect.',
		fail: 'Failed to connect to aMF server.',
		wrongUserOrPassword: 'The email or password you entered is incorrect.',
	},
	callManager:{
		connected: 'Successfully connected. Please select a device',
		connectedDevice: 'Connected to __DEVICE__ successfully!',
		invalidCredentials: 'Invalid credentials provided.',
		authenticationFailed: 'Authentication failed, please try again!.',
		unableToLogin: 'Unable to login to call manager.',
		invalidUsername: 'Username is not right.',
		invalidPassword: 'Password is not right.',
        invalidLogin : 'Invalid Username or Password',
        successfullConected : 'Successfully connected!'
	},
    jabber:{
        invalidLogin : 'Invalid Username or Password',
        connected: 'Successfully connected!'
    },

    notesTaskShare: {
        btnOK: 'OK',
        btnShare: 'SHARE',
        btnCancel: 'CANCEL',

        title: 'Share',
        titleChanges:'Share Changes',

        descNoteConfirm : 'Your note has been shared.',
        descNoteAsk: 'Do you want to share the changes to this note with the following contacts?',
        descNoteAskBlank: 'Who do you want to share this note with? ',

        descTaskConfirm : 'Your task has been shared.',
        descTaskAsk: 'Do you want to share the changes to this task with the following contacts?',
        descTaskAskBlank: 'Who do you want to share this task with? '
    }
}
 // Keep a map of cwic code / local error that we want to display.
 var errorCWICMap = {
    16: 'In case TFTP is blocked, allow the browser application in the firewall, or turn it off.'
 };
