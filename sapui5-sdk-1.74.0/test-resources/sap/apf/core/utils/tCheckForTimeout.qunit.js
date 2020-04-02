sap.ui.define("sap/apf/core/utils/tCheckForTimeout", [
	"sap/apf/core/messageObject",
	"sap/apf/core/utils/checkForTimeout"
], function(MessageObject, checkForTimeout){
	"use strict";
	QUnit.module('Check Http Response for a Timeout');
	QUnit.test('Error status 303, 401 and 403', function( assert ) {
		//Error status for OData
		var aHeaders = [];
		aHeaders['x-sap-login-page'] = "url";
		
		var oMessage = checkForTimeout({
			status  : 200,
			headers : aHeaders 
		});
		assert.equal(oMessage.getCode(), '5021');
		
		oMessage = checkForTimeout({
			status : 303
		});
		assert.equal(oMessage.getCode(), '5021');
		
		oMessage = checkForTimeout({
			status : 401
		});
		assert.equal(oMessage.getCode(), '5021');
		
		oMessage = checkForTimeout({
			status : 403
		});
		assert.equal(oMessage.getCode(), '5021');
		
		//Error status for Ajax
		oMessage = checkForTimeout({
			response : {
				statusCode : 303
			}
		});
		assert.equal(oMessage.getCode(), '5021');
		
		oMessage = checkForTimeout({
			response : {
				statusCode : 401
			}
		});
		assert.equal(oMessage.getCode(), '5021');
		
		oMessage = checkForTimeout({
			response : {
				statusCode : 403
			}
		});
		assert.equal(oMessage.getCode(), '5021');
	});
});