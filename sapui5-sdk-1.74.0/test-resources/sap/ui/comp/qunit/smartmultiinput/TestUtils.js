/*global QUnit,sinon*/

sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer"
], function (ODataModel, MockServer) {
	"use strict";
	return {
		createMockServer: function() {
			var oUriParameters = jQuery.sap.getUriParameters();

			var oMockServer = new MockServer({
				rootUri: "/smartmultiinput.SmartMultiInput/"
			});

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 10)
			});

			oMockServer.simulate(
				"test-resources/sap/ui/comp/qunit/smartmultiinput/mockserver/metadata.xml",
				"test-resources/sap/ui/comp/qunit/smartmultiinput/mockserver/");

			var aRequests = oMockServer.getRequests();

			aRequests.forEach(function (oRequest) {
				var fnOldResponse = oRequest.response;
				if (oRequest.method === "DELETE") {
					oRequest.response = function (oXhr, sEntitySetName, sKeys, sNavProp, sUrlParams) {
						if (sKeys === "CategoryId='LT',ProductId='1'") {
							oXhr.respondJSON(500, {}, "cannot delete this entity");

							return true;
						} else {
							return fnOldResponse.apply(null, arguments);
						}
					};
				} else if (oRequest.method === "POST") {
					oRequest.response = function (oXhr, sEntitySetName, sKeys, sNavProp, sUrlParams) {
						if (JSON.parse(oXhr.requestBody).CategoryId === "SS") {
							oXhr.respondJSON(500, {}, "cannot add this entity");

							return true;
						} else {
							return fnOldResponse.apply(null, arguments);
						}
					};
				}
			});


			oMockServer.setRequests(aRequests);

			oMockServer.start();

			return oMockServer;
		},

		createDataModel: function () {
			var that = this;

			this.oModel = new ODataModel("/smartmultiinput.SmartMultiInput", {useBatch:false});
			this.oModel.setDefaultBindingMode("TwoWay");

			return new Promise(function(resolve, reject) {
				that.oModel.metadataLoaded().then(function() {
					resolve(that.oModel);
				});
			});

		},

		initCommonTests: function() {
			QUnit.test("_getDescriptionFieldName", function (assert) {
				assert.equal(this.oSmartMultiInput._getDescriptionFieldName(), "Description");
			});

			QUnit.test("_getPropertyName", function (assert) {
				assert.equal(this.oSmartMultiInput._getPropertyName(), "CategoryId");
			});

			QUnit.test("_getEntitySetName", function (assert) {
				assert.equal(this.oSmartMultiInput._getEntitySetName(), "Categories");
			});

			QUnit.test("_getValueListAnnotation", function (assert) {
				assert.equal(this.oSmartMultiInput._getValueListAnnotation(), "SmartMultiInput.Category/CategoryId");
			});

			QUnit.test("attachChange", function (assert) {
				var sValue = "test";

				sinon.stub(this.oSmartMultiInput, "_validateValueOnChange");

				this.oSmartMultiInput._oMultiInput.fireChange({
					value: sValue
				});

				assert.ok(this.oSmartMultiInput._validateValueOnChange.calledOnce);
				assert.equal(this.oSmartMultiInput._validateValueOnChange.args[0][0], sValue);
			});

			QUnit.test("attachSuggestionItemSelected", function (assert) {
				var sValue = "test";

				sinon.stub(this.oSmartMultiInput, "_validateValueOnChange");

				this.oSmartMultiInput._oMultiInput.setValue("test");
				this.oSmartMultiInput._oMultiInput.fireSuggestionItemSelected();

				assert.ok(this.oSmartMultiInput._validateValueOnChange.calledOnce);
				assert.equal(this.oSmartMultiInput._validateValueOnChange.args[0][0], sValue);
			});
		}
	};
});


