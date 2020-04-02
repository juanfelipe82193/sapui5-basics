/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartchart/SmartChart",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/variants/VariantManagement",
	"sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement"

], function(SmartTable, FilterBar, SmartFilterBar, SmartField, SmartChart, SmartLink, VariantManagement, SmartVariantManagement, SmartForm, Group, GroupElement){
	"use strict";

	QUnit.module("sap.ui.comp.smarttable.SmartTable", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				id: "__xmlview3--LineItemsSmartTable"
			});
		},
		teardown: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Read desingtime annotations for SmartTable", function(assert) {
		var oControlMetadata = sap.ui.getCore().byId("__xmlview3--LineItemsSmartTable").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar", {
		beforeEach: function() {
			this.oSmartFilterBar = new SmartFilterBar({
				id: "__xmlview3--LineItemsSmartFilterBar"
			});
		},
		teardown: function() {
			this.oSmartFilterBar.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartFilterBar", function(assert) {
		var oControlMetadata = sap.ui.getCore().byId("__xmlview3--LineItemsSmartFilterBar").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartfield.SmartField", {
		beforeEach: function() {
			this.oSmartField = new SmartField({
				id: "__xmlview3--LineItemsSmartField"
			});
		},
		teardown: function() {
			this.oSmartField.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartField", function(assert) {
		var oControlMetadata = sap.ui.getCore().byId("__xmlview3--LineItemsSmartField").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.smartchart.SmartChart", {
		beforeEach: function() {
			this.oSmartChart = new SmartChart({
				id: "__xmlview3--LineItemsSmartChart"
			});
		},
		teardown: function() {
			this.oSmartChart.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartChart", function(assert) {
		var oControlMetadata = sap.ui.getCore().byId("__xmlview3--LineItemsSmartChart").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
		beforeEach: function() {
			this.oSmartLink = new SmartLink({
				id: "__xmlview3--LineItemsSmartLink"
			});
		},
		teardown: function() {
			this.oSmartLink.destroy();
		}
	});

	QUnit.test("Read designtime annotations for SmartLink", function(assert) {
		var oControlMetadata = sap.ui.getCore().byId("__xmlview3--LineItemsSmartLink").getMetadata();
		assert.ok(oControlMetadata.loadDesignTime().then(function(mDesignTimeMetadata) {
			return mDesignTimeMetadata.annotations;
		}));
	});


	QUnit.module("sap.ui.comp.smart.controls", {

		beforeEach: function() {
		   this.aControls = [
				new SmartField(),
				new SmartChart(),
				new SmartLink(),
				new SmartForm(),
				new Group(),
				new GroupElement(),
				new FilterBar(),
				new SmartFilterBar(),
				new VariantManagement(),
				new SmartVariantManagement(),
				new SmartTable()];
		},
		afterEach: function() {

			this.aControls.forEach(function(oSmartControl) {
				oSmartControl.destroy();
			});
		}
	});
	QUnit.test("XCheck if all properties are declared in design time file", function(assert) {

		var iIndex = 0;
		var fnDone = assert.async();

		this.aControls.forEach(function(oSmartControl) {

			var mProperties = oSmartControl.getMetadata()._mProperties;
			assert.ok(mProperties, "Properties loaded for " + oSmartControl.getMetadata().getName());

			var aProperties = Object.keys(mProperties);

			oSmartControl.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
				assert.ok(oDesignTimeMetadata, "Metadatafile present for " + oSmartControl.getMetadata().getName());
				assert.ok(oDesignTimeMetadata.properties, "Properties present for " + oSmartControl.getMetadata().getName());

				//all properties defined in the class of the control are defined in designtime metadata (there are also inherited properties)
				aProperties.forEach(function(element) {
					assert.ok(oDesignTimeMetadata.properties[element], oSmartControl.getMetadata().getName() + " property \"" + element + "\"");
				});

				iIndex++;

				if (iIndex == this.aControls.length) {
					fnDone();
				}
			}.bind(this));

		}.bind(this));

	});

	QUnit.start();

});