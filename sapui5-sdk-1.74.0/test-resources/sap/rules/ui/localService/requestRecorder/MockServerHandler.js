sap.ui.define(['jquery.sap.global'],
	function(jQuery) {	
		
		'use strict';
		
		var UI_LIBRARY_PATH = '/sap/hrf/ui/app/<appName>/../../uilib';
	    var APPLICATION_PATH = '/sap/hrf/ui/app/<appName>';
	    var APP_NAME = '<appName>';
	    var MOCK_UI_LIBRARY = 'resources/sap/hrf/ui/uilib';
	    var MOCK_APPLICATION_PATH = '.';
	    
		/*
			sApplicationName String in format 'ruleEditor' \ 'ruleService'
		*/
		var MockServerHandler = function(oMockServer, oMockUtils, sApplicationName){	
			this.oMockServer = oMockServer.setRootUri("");
			this.oMockUtils = oMockUtils;
			this.sApplicationName = sApplicationName;
			this.sUilibPath = UI_LIBRARY_PATH.replace(APP_NAME, this.sApplicationName);
			this.sApplicationPath = APPLICATION_PATH.replace(APP_NAME, this.sApplicationName);

	    };

	    MockServerHandler.prototype.respond = function (oXHR) {
			var responseObj = this.httpObjects[oXHR.method + ' ' + oXHR.url];
			var response = responseObj ? responseObj.pop() : '';
	        oXHR.respond(response.status, { 'Content-Type' :  response.contentType }, response.responseText);
	    };

	    MockServerHandler.prototype.loadJsonFile = function(){
			var me = this;
			var callBackDeferred = new jQuery.Deferred();

			jQuery.ajax({		    	
		        crossDomain: true,
		        dataType: 'json',
		        url: this.oMockUtils.getMockUrl(me.sApplicationName),
		        async: false
			}).done(function(respond){
				me.httpObjects =  respond;
				callBackDeferred.resolve(getRequestsToMock.bind(me)(respond));
			});

			return callBackDeferred;
	 
	    };
	    
	    MockServerHandler.prototype.setRequests = function(aRequests){
			this.oMockServer.setRequests(aRequests); 
	    };
	    MockServerHandler.prototype.start = function(){
			this.oMockServer.start(); 
	    };
	    MockServerHandler.prototype.stop = function(){
			this.oMockServer.stop(); 
	    };
	    MockServerHandler.prototype.adaptRequestURIKey = function(uri, sMethod, sRequestKey){
	    //change relative path

			var uriAfterReplace = uri.replace(this.sUilibPath, MOCK_UI_LIBRARY);	
			uriAfterReplace = uriAfterReplace.replace(this.sApplicationPath, MOCK_APPLICATION_PATH);
			// Original requests (me were recorded from backend) with time stamp, will be saved without the time stamp. 
			uriAfterReplace = uriAfterReplace.replace(/&?\??ts=\d{12}/g, "");
			if (uriAfterReplace !== uri) {
				this.httpObjects[sMethod + " " + uriAfterReplace] = this.httpObjects[sRequestKey];
				delete this.httpObjects[sRequestKey];
			}			
			return uriAfterReplace;
		};	    	

	    function getRequestsToMock(oData){	        	
			var aRequests = Object.keys(oData);
			var aRequestObjects = [];
			var request,method,uri;
			
			for (var i = 0; i < aRequests.length; i++) {
				request =  aRequests[i];
				method = request.substring(0, request.indexOf(" "));
				uri = this.adaptRequestURIKey(request.substring(request.indexOf(" ")+1, request.length), method, request);
				uri = this.oMockUtils.encodeRequestURIToMock(uri);
				
				aRequestObjects.push({
					method: method,
					path: uri,	        			
					response: this.respond.bind(this)
				});
			}
			return aRequestObjects;
		}
	    
	    window.MockServerHandler = MockServerHandler;
	    
		return MockServerHandler;		
});