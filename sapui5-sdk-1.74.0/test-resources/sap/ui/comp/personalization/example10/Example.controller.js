sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/personalization/Util',
	'test/sap/ui/comp/personalization/Util',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/base/util/merge'
], function(
	Controller,
	PersonalizationController,
	PersonalizationUtil,
	TestUtil,
	PersonalizableInfo,
	ODataModel,
	merge
) {
	"use strict";

	return Controller.extend("root.Example", {

		// Init JSON structure which will be persisted in LRep as a variant
		oPersistentData: {},

		onInit: function() {
			TestUtil.startMockServer({
				rootUri: "testsuite.personalization.example10/",
				metadataUrl: "mockserver/metadata.xml",
				mockdataSettings: "mockserver/"
			});

			var oModel = new ODataModel("testsuite.personalization.example10", true);
			this.getView().setModel(oModel);

			this.oP13nDialogController = new PersonalizationController({
				table: this.getView().byId("IDMTable"),
				resetToInitialTableState: false,
				afterP13nModelDataChange: this.onAfterP13nModelDataChange.bind(this)
			});

			this._initVariantManagement(this.getView().byId("IDMTable"), this.oP13nDialogController);
		},

		_initVariantManagement: function(oControl, oController) {
			var that = this;
			var oSmartVariant = this.getView().byId("IDSmartVariant");

			oControl.fetchVariant = function() {
				return merge({}, that.oPersistentData);
			};
			oControl.applyVariant = function(oVariantJSON) {
				if (jQuery.isEmptyObject(oVariantJSON)) {
					oController.setPersonalizationData(null);
				} else {
					oController.setPersonalizationData(merge({}, oVariantJSON));
				}
				that._setDirtyFlag(false);
			};
			oSmartVariant.attachSave(function() {
				oController.setPersonalizationData(that.oPersistentData);
				that._setDirtyFlag(false);
			});

			oControl._fnDummy = function() {
			};
			oSmartVariant.addPersonalizableControl(new PersonalizableInfo({
				type: "table",
				keyName: "id",
				dataSource: "TODO",
				control: oControl
			}));
			oSmartVariant.initialise(oControl._fnDummy, oControl);
		},

		onP13nDialogPress: function() {
			this.oP13nDialogController.openDialog();
		},

		onAfterP13nModelDataChange: function(oEvent) {
			this.oPersistentData = oEvent.getParameter("persistentData");

			this._setDirtyFlag(PersonalizationUtil.hasChangedType(oEvent.getParameter("persistentDataChangeType")));

			TestUtil.updateSortererFromP13nModelDataChange(oEvent.oSource.getTable(), oEvent.getParameter("runtimeDeltaData"));
			TestUtil.updateFiltererFromP13nModelDataChange(oEvent.oSource.getTable(), oEvent.getParameter("runtimeDeltaData"));
		},

		_setDirtyFlag: function(bIsChanged) {
			this.getView().byId("IDSmartVariant").currentVariantSetModified(bIsChanged);
		}
	});

});
