sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel"
], function (Controller, MockServer, BindingMode, ODataModel, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartmultiinput.withBinding.SmartMultiInput", {
		onInit: function () {
			var that = this;
			this.oMockServer = new MockServer({
				rootUri: "smartmultiinput.SmartMultiInputWithBinding/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/");

			// mock version of enriching the created entity with neccessary data on backend
			this.oMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.POST, function(oEvent) {
				var oEntity = oEvent.getParameter("oEntity"),
					sCategoryId = oEntity.CategoryId,
					oCategoryValueHelpObject = that.oMockServer.getEntitySetData("CategoriesVH").filter(function(oCategory) {
						return oCategory.CategoryId === sCategoryId;
					})[0];

				if (oCategoryValueHelpObject) {
					oEntity.Description = oCategoryValueHelpObject.Description;
					oEntity.Price = oCategoryValueHelpObject.Price;
				}
			});

			this.oMockServer.start();
			var oModel = new ODataModel("smartmultiinput.SmartMultiInputWithBinding");

			oModel.setDefaultBindingMode(BindingMode.TwoWay);
			var oView = this.getView();
			oView.setModel(oModel);

			oView.byId("idSmartMultiInput1").bindElement("/Products('1')");
			oView.byId("idSmartMultiInput1").bindProperty("value", {path: "to_Categories/CategoryId", groupId:"TEST"});

			oView.byId("idSmartMultiInput2").bindElement("/Products('2')");
			oView.byId("idSmartMultiInput2").bindProperty("value", {path: "to_Categories/CategoryId", mode:"OneWay"});

			oView.byId("idSmartMultiInput3").bindElement("/Products('3')");
			oView.byId("idSmartMultiInput3").bindProperty("value", {path: "to_Categories/CategoryId", mode:"OneTime"});

			oView.byId("idSmartMultiInput4").bindElement("/Products('1')");
			oView.byId("idSmartMultiInput4").attachBeforeCreate(function(oEvent) {
				var oData = oEvent.getParameter("oData"); // parameter oData for sap.ui.model.odata.v2.ODataModel.create call

				// if SmartMultiInput is bound against non key entity property
				// key property has to be add either here in beforeCreate event or backend has to handle it
					oData.CategoryId = Math.random().toString().slice(2,6);

				// other parameters can be add or edit as well
				oData.Description = "custom description";
			});

			oView.byId("idSmartMultiInput5").bindElement("/Products('1')");

			var oUtilModel = new JSONModel({
				deferred: false
			});
			oView.setModel(oUtilModel, "util");
			oModel.setChangeGroups({
				"Category": {
					groupId: "testgroupid"
				}
			});
		},

		onSelect: function(oEvent) {
			var bDeferred = oEvent.getParameter("selected"),
				 oModel = this.getView().getModel(),
				aDeferredGroups = oModel.getDeferredGroups();

			if (bDeferred) {
				aDeferredGroups = aDeferredGroups.concat(["testgroupid"]);
			} else {
				aDeferredGroups = aDeferredGroups.slice(0, aDeferredGroups.length - 1);
			}

			oModel.setDeferredGroups(aDeferredGroups);
			oModel.submitChanges();
		},

		onSubmit: function() {
			this.getView().getModel().submitChanges();
		},

		onExit: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
		}
	});
});
