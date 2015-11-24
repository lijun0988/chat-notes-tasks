/* Mindfraself Piwik Analytics */
var analytics = new function () {
	var self = this;

    this.trackPageView = function(page){
		if (window._paq) {
            window._paq.push(['trackPageView', page]);
        } else {
            console.warn("WARNING: tracking tool not ready or failing");
        }
	}

	this.trackLink = function(linkString){
		self.trackPageView(linkString);
	}

    this.trackTag = function (tag) {
        var tracking = 'tag:' + tag;
        self.trackPageView(tracking);
    }

    this.trackError = function (error) {
        var tracking = 'error:' + error;
        self.trackPageView(tracking);
    }

    this.trackSuccess = function (success) {
        var tracking = 'success:' + success;
        self.trackPageView(tracking);
    }

    this.init = function () {
        $('body').off('click.track').on('click.track', '*', function () {
            if ($(this).data('track-info')) {
                self.trackTag($(this).data('track-info'));
            }
        });
    };
};