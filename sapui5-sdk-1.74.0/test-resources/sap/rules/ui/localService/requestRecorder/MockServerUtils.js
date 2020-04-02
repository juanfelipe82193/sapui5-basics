sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		
		'use strict';
		var Utils = function(){};
		Utils.prototype.getQueryStringParams = function() {
		        var params = {};
		        var URL = jQuery(window.location).attr('href');	        
		        var paramsIndex = URL.indexOf('?');
		        
		        if (paramsIndex > -1) {
					var paramsString = URL.slice(paramsIndex + 1);
					var paramsArray = paramsString.split('&');

		            for (var i=0, len=paramsArray.length; i < len; ++i) {
		                var param = paramsArray[i].split('=');
		                if (param.length > 1) {
							params[param[0]] = param[1];
		                }
		            }
		        }
		                
		        return params;
		};
		
		Utils.prototype.getMockUrl = function(sApplicationName){

			//TODO - remove the hard coded name mock.json
			if (sApplicationName){
				return sApplicationName;
			}
			var queryStringParams = this.getQueryStringParams();
			var pathToMockFile = "../localService/data/recorded/" + queryStringParams.mockdata + ".json";
			return pathToMockFile;
		};
	
		Utils.prototype.isJsonString = function (str) {
		        try {
		            JSON.parse(str);
		        } catch (e) {
		            return false;
		        }
		        return true;
		};
	
		Utils.prototype.encodeRequestURIToMock = function(uri){			
				var encodedURI = uri.replace(/\?/g, "\\?");
				encodedURI = encodedURI.replace(/\$/g, "\\$");
				encodedURI = encodedURI.replace(/\(/g, "\\(");
				encodedURI = encodedURI.replace(/\)/g, "\\)");
				encodedURI = encodedURI.replace(/&ts=\d{12}/g, "(&ts=\d{12})?"); // requests (from localhost) with timestamp will also get 'caught'
				encodedURI = encodedURI.replace(/\\\?ts=\d{12}/g, "(\\?ts=\d{12})?");
				return encodedURI;
		};	
	
		window.Utils = Utils;
		return Utils;
	});