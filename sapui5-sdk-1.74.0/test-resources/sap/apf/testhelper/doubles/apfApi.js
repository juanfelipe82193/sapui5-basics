jQuery.sap.declare('sap.apf.testhelper.doubles.apfApi');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfApfApi');
jQuery.sap.require('sap.apf.utils.utils');
/**
 * @description Constructor, simply clones the configuration object and sets
 * @param oBindingConfig
 */
sap.apf.testhelper.doubles.ApfApi = function(oInject) {
	var that = this;
	var oCoreApi = oInject.instances.coreApi;
	this.doubleCreateRepresentation = function() {
		oCoreApi.createRepresentation = function(RepresentationConstructor, oConfig) {
			var Representation = sap.apf.utils.extractFunctionFromModulePathString(RepresentationConstructor);
			return new Representation(that, oConfig);
		};
		return this;
	};
	this.doubleCreateFilter = function() {
		this.createFilter = function(arg1, arg2, arg3) {
			return new sap.apf.utils.Filter(oInject.messageHandler, arg1, arg2, arg3);
		};
		return this;
	};
	this.doubleStandardMethods = function() {
		this.check = function(oExpr) {
			oCoreApi.check(oExpr);
		};
		this.putMessage = function(oMessage) {
			return oCoreApi.putMessage(oMessage);
		};
		this.createMessageObject = function(oConfig) {
			return oCoreApi.createMessageObject(oConfig);
		};
		this.activateOnErrorHandling = function(bHandling) {
			return oCoreApi.activateOnErrorHandling(bHandling);
		};
		this.setCallbackForMessageHandling = function(fnCallback) {
			return oCoreApi.setCallbackForMessageHandling(fnCallback);
		};
		return this;
	};
};
sap.apf.testhelper.doubles.ApfApi.prototype = new sap.apf.testhelper.interfaces.IfApfApi();
sap.apf.testhelper.doubles.ApfApi.prototype.constructor = sap.apf.testhelper.doubles.ApfApi;