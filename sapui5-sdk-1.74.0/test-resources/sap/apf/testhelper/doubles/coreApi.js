jQuery.sap.declare('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.core.instance');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.utils.startParameter');
/**
 * @description Constructor, simply clones the configuration object and sets
 * @param oBindingConfig
 */
sap.apf.testhelper.doubles.CoreApi = function(oInject, oConfig) {
	var oSavedContextFilter;
	var oStartParameter = new sap.apf.utils.StartParameter();
	this.doubleCreateFilter = function() {
		this.createFilter = function(arg1, arg2, arg3) {
			return new sap.apf.utils.Filter(oInject.instances.messageHandler, arg1, arg2, arg3);
		};
		return this;
	};
	this.doubleMessaging = function() {
		this.check = function(oBooleExpr) {
			oInject.instances.messageHandler.check(oBooleExpr);
		};
		this.putMessage = function(oMessageObject) {
			oInject.instances.messageHandler.putMessage(oMessageObject);
		};
		this.createMessageObject = function(oConf) {
			return oInject.instances.messageHandler.createMessageObject(oConf);
		};
		return this;
	};
	this.doubleCumulativeFilter = function() {
		this.getCumulativeFilter = function() {
			if (oSavedContextFilter) {
				return jQuery.Deferred().resolve(oSavedContextFilter);
			}
			return jQuery.Deferred().resolve(new sap.apf.core.utils.Filter(oInject.instances.messageHandler));
		};
		this.setCumulativeFilter = function(oFilter) {
			oSavedContextFilter = oFilter;
		};
		return this;
	};
	this.getSmartFilterBarAsPromise = function(){
		var deferred = jQuery.Deferred().resolve(null);
		return deferred.promise();
	};
	this.getStartParameterFacade = function() {
		return oStartParameter;
	};
};
sap.apf.testhelper.doubles.CoreApi.prototype = new sap.apf.testhelper.interfaces.IfCoreApi();
sap.apf.testhelper.doubles.CoreApi.prototype.constructor = sap.apf.testhelper.doubles.CoreApi;