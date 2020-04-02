QUnit.module('Request Test Double', {
	beforeEach : function(assert) {
		var that = this;
		this.aDataFromSendCallback = undefined;
		this.sendCallback = function(oResponse) {
			that.aDataFromSendCallback = oResponse.data;
		};
		
		this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck();
		this.saveCore = sap.apf.core.check;
		sap.apf.core.check = function(booleExpr, sMessage, sCode) {
			if (!booleExpr) {
				throw new Error(sMessage);
			}
		};   
	},
	afterEach : function(assert) {
		sap.apf.core.check = this.saveCore;
	}
});
QUnit.test('Get instance', function(assert) {
	var oRequestConfiguration = sap.apf.testhelper.config.getSampleConfiguration().requests[0];
	assert.ok(sap.apf.testhelper.doubles.Request({}, oRequestConfiguration), 'Configuration double instance expected');
});
QUnit.test('Do Request with selection', function(assert) {
	var oRequestConfiguration = sap.apf.testhelper.config.getSampleConfiguration().requests[0];
	var oRequestTestDouble = sap.apf.testhelper.doubles.Request({messageHandler : this.oMessageHandler}, oRequestConfiguration);
	// define filter 
	var oFilterAll = new sap.apf.core.utils.Filter(this.oMessageHandler, "SAPClient", sap.apf.core.constants.FilterOperators.EQ, '777');
	oFilterAll.addAnd('CompanyCode', sap.apf.core.constants.FilterOperators.EQ, '1000');
	var oFilterCustomer = new sap.apf.core.utils.Filter(this.oMessageHandler, "Customer", sap.apf.core.constants.FilterOperators.EQ, "1001");
	oFilterCustomer.addOr(new sap.apf.core.utils.Filter(this.oMessageHandler, "Customer", sap.apf.core.constants.FilterOperators.EQ, "1002"));
	oFilterCustomer.addOr(new sap.apf.core.utils.Filter(this.oMessageHandler, "Customer", sap.apf.core.constants.FilterOperators.EQ, "1004"));
	oFilterAll.addAnd(oFilterCustomer);
	oRequestTestDouble.sendGetInBatch(oFilterAll, this.sendCallback);
	var aData = this.aDataFromSendCallback;
	var bHasData = aData.length > 0;
	assert.equal(bHasData, true, "received data from request callback double");
	// now test, whether 3 data sets have been received with correct customer numbers;
	assert.equal(aData.length, 3, "three customers have been selected");
});