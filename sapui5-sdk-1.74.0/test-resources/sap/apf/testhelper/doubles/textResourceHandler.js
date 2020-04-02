jQuery.sap.declare("sap.apf.testhelper.doubles.textResourceHandler");
(function() {
	'use strict';
	
	sap.apf.testhelper.doubles.TextResourceHandler = function() {
		this.getTextNotHtmlEncoded = function(oLabel, aParameters){
			return oLabel;
		};
		this.getTextHtmlEncoded = function(oLabel, aParameters){
			return oLabel;
		};
		this.getMessageText = function(key){
			return key;
		};
		this.loadTextElements = function(textElements) {		
		};

		this.registerTextWithKey = function(key, text) {
			
		};
	};
}());