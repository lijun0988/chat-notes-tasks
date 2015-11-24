'use strict';

mfApp.filter('formatDate', function () {
    return function (input) {
        if (input) {
            if(input.indexOf('T')){
            	return input.split('T')[0].replace(/-/g,'/');	
            }
        }
    }
})
    .filter('highlightKeyword', function ($sce) {
        return function (input, keyword) {
            if (input && keyword && keyword.trim().length>0) {
                var r = new RegExp(keyword,"igm");
                var strNew = str.replace(r,"<mark>"+keyword+"</mark>");

                return $sce.trustAsHtml(strNew);
            }
        }
    })
    .filter('object2Array', function() {
        return function(input) {
            var out = [];
            for(var i in input){
                out.push(input[i]);
            }
            return out;
        }
    })