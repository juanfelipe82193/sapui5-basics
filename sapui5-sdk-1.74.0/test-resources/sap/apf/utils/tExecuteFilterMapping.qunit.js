sap.ui.define("sap/apf/utils/tExecuteFilterMapping", [
	"sap/apf/utils/executeFilterMapping",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/core/utils/filter",
	"sap/apf/utils/filter"
], function(executeFilterMapping, DoubleMessageHandler, Filter, UtilsFilter){
	"use strict";
	QUnit.module('FilterMapping', {
		beforeEach : function(assert) {
			var that = this;
			this.oMessageHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.spySendGetInBatch = undefined;
			this.letRequestFail = false;
			this.oMappingRequest = {
				sendGetInBatch : function(oFilter, fnCallback, oRequestOptions) {
					if (typeof (that.spySendGetInBatch) === "function") {
						//callback for checking oFilter and oConfig in test
						that.spySendGetInBatch(oFilter);
					}
					if (that.letRequestFail) {
						fnCallback(new sap.apf.core.MessageObject({
							code : "5001"
						}));
						return;
					}
					that.oResponse = {
						data : [ {
							targetProperty1 : "A",
							targetProperty2 : "B"
						}, {
							targetProperty1 : "C",
							targetProperty2 : "D"
						} ]
					};
					fnCallback(that.oResponse);
				}
			};
			jQuery.extend(this, UtilsFilter.getOperators());
			this.oInputFilter = new Filter(this.oMessageHandler, "property1", this.EQ, "A");
		}
	});
	QUnit.test('WHEN executeFilterMapping THEN the mapping request is called with the right filter', function(assert) {
		assert.expect(1);
		var expectedUrlParam = this.oInputFilter.toUrlParam();
		this.spySendGetInBatch = function(oFilter) {
			assert.equal(oFilter.toUrlParam(), expectedUrlParam, "the expected filter is used for the mapping request");
		};
		executeFilterMapping(this.oInputFilter, this.oMappingRequest, [], function() {
			return null;
		}, this.oMessageHandler); //CUT
	});
	QUnit.test('WHEN executeFilterMapping with failing mapping request THEN the error is logged and returned', function(assert) {
		assert.expect(2);
		var that = this;
		this.letRequestFail = true;
		function fnCallback(oMappedFilter, oMessageObject) {
			assert.ok(oMessageObject, "a message object is returned");
			assert.equal(that.oMessageHandler.spyResults.putMessage.getCode(), "5001", "The error from the failed filter mapping request is logged");
		}
		executeFilterMapping(this.oInputFilter, this.oMappingRequest, [], fnCallback, this.oMessageHandler);
	});
	QUnit.test('WHEN executeFilterMapping with one target property and succeeding mapping request THEN the right result filter is returned', function(assert) {
		var that = this;
		assert.expect(3);
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addOr(oFilter2);
		function fnCallback(oMappedFilter, oMessageObject, oResponseData) {
			assert.ok(!oMessageObject, "no message object is returned");
			assert.equal(oMappedFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "the right filter is returned to the callback from executeFilterMapping");
			assert.deepEqual(oResponseData, that.oResponse.data, "Callback is called with responseData");
		}
		executeFilterMapping(this.oInputFilter, this.oMappingRequest, [ "targetProperty1" ], fnCallback, this.oMessageHandler); //CUT
	});
	QUnit.test('WHEN executeFilterMapping with with two target properties and succeeding mapping request THEN the right result filter is returned', function(assert) {
		var that = this;
		assert.expect(3);
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		function fnCallback(oMappedFilter, oMessageObject, oResponseData) {
			assert.ok(!oMessageObject, "no message object is returned");
			assert.equal(oMappedFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "the right filter is returned to the callback from executeFilterMapping");
			assert.deepEqual(oResponseData, that.oResponse.data, "Callback is called with responseData");
		}
		executeFilterMapping(this.oInputFilter, this.oMappingRequest, [ "targetProperty1", "targetProperty2" ], fnCallback, this.oMessageHandler); //CUT
	});
});