/*
 * A class for performing UserAgent sniffing to detect mobile features in the browser.
 * Use the global object sapbi_Mobile.
 */ 
(function (global) {

    var apple_phone      = /iPhone/i,
        apple_ipod       = /iPod/i,
        apple_tablet     = /iPad/i,
        mobi_ipad     = /ipad/i,
        mobi_iphone     = /iphone/i,
        android_phone    = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,	// Match 'Android' AND 'Mobile'
        android_tablet   = /Android/i,
        windows_phone    = /IEMobile/i,
        windows_tablet   = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,		// Match 'Windows' AND 'ARM'. Note: Some Windows tablets have Intel processors
        other_blackberry = /BlackBerry/i,
        other_opera      = /Opera Mini/i,
        other_firefox    = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i;	// Match 'Firefox' AND 'Mobile'
    
      

    var SAPMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;

        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.android = {
            phone:  match(android_phone, ua),
            tablet: !match(android_phone, ua) && match(android_tablet, ua),
            device: match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        
        this.mobi = {
                android: match(android_phone, ua) || match(android_tablet, ua),
                iPhone:  matchQuery(mobi_iphone),
                iPad:    matchQuery(mobi_ipad),
                device:	matchQuery(android_tablet) || matchQuery(mobi_iphone)||  matchQuery(mobi_ipad)
            };
        
        
        this.other = {
            blackberry: match(other_blackberry, ua),
            opera:      match(other_opera, ua),
            firefox:    match(other_firefox, ua),
            device:     match(other_blackberry, ua) || match(other_opera, ua) || match(other_firefox, ua)
        };
        
        
  
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;
        this.mobile = this.apple.device || this.android.device || this.windows.device || this.other.device;
        
        /*
         * There is a bug in Chrome Desktop v36 whereby this returns 1 if there is external mouse plugged into a laptop which has a touchpad.
         * Google are aware of the issue.
         */ 
        if(navigator.maxTouchPoints){
			this.touchPoints = navigator.maxTouchPoints;
			this.touchEnabled = true;
		}
		else if(navigator.msMaxTouchPoints){
			this.touchPoints = navigator.msMaxTouchPoints;
			this.touchEnabled = true;
		}

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function() {
        var IM = new SAPMobileClass();
        IM.Class = SAPMobileClass;
        return IM;
    };
    
    var matchQuery = function(regex) {
    	var queryString = location.search;
        return regex.test(queryString);
    };
    
    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };
    
    global.sapbi_Mobile = instantiate();
    global.sapbi_isMobile = global.sapbi_Mobile.mobile;

    // This code if for an experimental feature to support a script event when the IPAD is rotated
    // It was not productized so far.
//	if (global.sapbi_isMobile === true) {
//		$(window).resize(function() {
//			// alert("resize");
//			var jqWindow = $(window);
//			var height = jqWindow.height();
//			var width = jqWindow.width();
//			var orientation = "";
//			if (width > height) {
//				orientation = "landscape";
//			} else {
//				orientation = "portrait";
//			}
//
//			if ((typeof zen_onorientationchanged != "undefined") && (zen_onorientationchanged != "")) {
//				var command = zen_onorientationchanged.replace("__ORIENTATION__", orientation);
//				eval(command);
//			}
//		});
//	}

})(this);