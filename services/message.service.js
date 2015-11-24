angular.module('message.service', [])

.factory('MessageService', function () {
        // We can just put the internalization logic here if it will be implemented in a future.
        var messageService = {
            getErrorMessageAdapted : function(cwicError) {
                var errorMessage = 'Unable to login: ';

                if (errorCWICMap[cwicError.code]) {
                    errorMessage += errorCWICMap[cwicError.code];
                } else {
                    //We keep the old logic if the message is not in the erroCwicMap:
                    errorMessage += cwicError.message;

                    if (cwicError.details) {
                        errorMessage += '. ' + cwicError.details.join(', ');
                    }
                }
                return errorMessage;
            }
        }

        return messageService;
 });
