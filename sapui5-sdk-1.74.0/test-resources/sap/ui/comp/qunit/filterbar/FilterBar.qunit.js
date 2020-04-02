/* globals QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/core/Control",
	"sap/ui/core/CustomData",
	"sap/ui/comp/filterbar/FilterItem",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/ui/comp/filterbar/VariantConverterFrom",
	"sap/ui/comp/state/UIState",
	'sap/ui/comp/util/IdentifierUtil',
	"sap/m/library",
	"sap/m/Dialog",
	"sap/m/CheckBox",
	"sap/m/SearchField",
	"sap/m/Input",
	"sap/m/CustomListItem",
	"sap/m/ToolbarSeparator",
	"sap/m/ListMode",
	"sap/m/List",
	"sap/m/Link",
	"sap/ui/layout/form/Form",
	"sap/ui/layout/Grid",
	"sap/ui/Device",
	"sap/base/i18n/ResourceBundle"
], function(
	FilterBar,
	Control,
	CustomData,
	FilterItem,
	FilterGroupItem,
	VariantConverterFrom,
	UIState,
	IdentifierUtil,
	mLibrary,
	Dialog,
	CheckBox,
	SearchField,
	Input,
	CustomListItem,
	ToolbarSeparator,
	ListMode,
	List,
	Link,
	Form,
	Grid,
	Device,
	ResourceBundle
) {
	"use strict";

	var _countMatchedFilters = function(oForm) {
		var n = 0;

		var aFormContainer = oForm.getFormContainers();

		for (var i = 1; i < aFormContainer.length; i++) {
			var aFormElements = aFormContainer[i].getFormElements();

			for (var j = 0; j < aFormElements.length; j++) {
				var aFields = aFormElements[j].getFields();
				if (aFields.length === 2) {
					if (aFormElements[j].getVisible()) {
						n++;
					}
				}
			}
		}

		return n;
	},

	_createFilterItem = function(sName, sLabel) {

		var oFilterItem = new FilterItem();

		var oCtrl = new Control();

		oFilterItem.setControl(oCtrl);
		oFilterItem.setName(sName);
		oFilterItem.setLabel(sLabel);

		return oFilterItem;
	},

	_createFilterGroupItem = function(sName, sTitle, sItemName, sItemLabel) {

		var oFilterGroupItem = new FilterGroupItem();
		oFilterGroupItem.setGroupName(sName);
		oFilterGroupItem.setGroupTitle(sTitle);

		var oCtrl = new Control();

		oFilterGroupItem.setControl(oCtrl);
		oFilterGroupItem.setName(sItemName);
		oFilterGroupItem.setLabel(sItemLabel);
		return oFilterGroupItem;
	},

	_createVariant = function(oFilterBar, assert) {
		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = _createFilterItem("ITEM2", "Item 2");
		oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM3", "Item 3");
		oFilterGroupItem.setVisibleInFilterBar(true);
		oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM4", "Item 4");
		// oFilterGroupItem.setVisibleInFilterBar(true);
		oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM5", "Item 5");
		oFilterGroupItem.setVisibleInFilterBar(true);
		oFilterBar.addFilterGroupItem(oFilterGroupItem);

		sinon.stub(oFilterBar, "_fetchVariantFiltersData").returns({});

		var oVariant = oFilterBar.fetchVariant();
		assert.ok(oVariant);
		assert.ok(oVariant.filterbar);

		return oVariant;
	},

	_createFieldInBasicArea = function(oFilterBar, oField) {
		oField.factory = function() {
			var oFilterItem = new FilterItem({
				controlTooltip: oField.quickInfo,
				label: oField.label,
				name: oField.name,
				visible: oField.visible,
				control: oField.control
			});
			if (oField.isCustomFilterField) {
				oFilterItem.data("isCustomField", true);
			}
			oFilterBar.addFilterItem(oFilterItem);
		};

		// FilterBar needs this information
		oField.groupName = FilterBar.INTERNAL_GROUP;

		return oField;
	};

	var _createFieldInAdvancedArea = function(oFilterBar, sGroupName, sGroupLabel, oField) {
		oField.factory = function() {
			var oFilterGroupItem = new FilterGroupItem({
				label: oField.label,
				controlTooltip: oField.quickInfo,
				name: oField.name,
				groupName: sGroupName,
				groupTitle: sGroupLabel,
				visible: oField.visible,
				visibleInAdvancedArea: oField.visibleInAdvancedArea,
				control: oField.control
			});
			if (oField.isCustomFilterField) {
				oFilterGroupItem.data("isCustomField", true);
			}
			oFilterBar.addFilterGroupItem(oFilterGroupItem);
		};

		// FilterBar needs this information
		oField.groupName = sGroupName;
		oField.groupTitle = sGroupLabel;

		return oField;
	};

	QUnit.module("sap.ui.comp.filterbar.FilterBar", {
		beforeEach: function() {
			this.oFilterBar = new FilterBar();
		},
		afterEach: function() {
			this.oFilterBar.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oFilterBar, "shall not be null");
	});

	QUnit.test("Checking the creation of VariantManagement", function(assert) {
		assert.ok(this.oFilterBar._oVariantManagement);
	});

	QUnit.test("Checking the property 'persistencyKey'", function(assert) {

		assert.equal(this.oFilterBar._oVariantManagement.getVisible(), false, "expecting 'false'");

		this.oFilterBar.setPersistencyKey("HUGO");
		assert.equal(this.oFilterBar.getPersistencyKey(), "HUGO", "not the expected persistencyKey value retrieved");

		assert.equal(this.oFilterBar._oVariantManagement.getVisible(), true, "expecting 'true'");
	});

	QUnit.test("Checking the method setSearchEnabled", function(assert) {

		assert.equal(this.oFilterBar._oSearchButton.getEnabled(), true, "initially the 'Search' should be enabled");

		this.oFilterBar.setSearchEnabled(false);
		assert.equal(this.oFilterBar._oSearchButton.getEnabled(), false, "search expected as disabled");

		this.oFilterBar.setSearchEnabled(true);
		assert.equal(this.oFilterBar._oSearchButton.getEnabled(), true, "search expected as enabled");
	});

	QUnit.test("Checking the aggregation addFilterItem", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");

		this.oFilterBar.addFilterItem(oFilterItem);
		assert.ok(this.oFilterBar._aBasicAreaSelection);

		assert.equal(this.oFilterBar._aBasicAreaSelection.length, 1, "the internal array should contain one entry");
	});

	QUnit.test("Checking the aggregation addFilterItem", function(assert) {

		this.oFilterBar.setSimplifiedMode(true);

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);
		assert.ok(this.oFilterBar._aBasicAreaSelection);
		assert.ok(this.oFilterBar._mAdvancedAreaFilter);

		assert.equal(this.oFilterBar._aBasicAreaSelection.length, 1, "the internal array basic should contain one entry");
		assert.equal(Object.keys(this.oFilterBar._mAdvancedAreaFilter).length, 1, "the internal array advanced should contain one entry");

	});

	QUnit.test("Checking the aggregation addFilterItem with two items", function(assert) {

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);

		assert.ok(this.oFilterBar._aBasicAreaSelection);

		assert.equal(this.oFilterBar._aBasicAreaSelection.length, 2, "the internal array should contain two entry");
	});

	QUnit.test("Checking the remove of the aggregation FilterItem", function(assert) {

		var oFilterItem1, oFilterItem2, oFilterBar = this.oFilterBar;

		oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		oFilterBar.addFilterItem(oFilterItem1);

		oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		oFilterBar.addFilterItem(oFilterItem2);

		oFilterBar.removeAllFilterItems();

		assert.equal(oFilterBar._aBasicAreaSelection, null, "expecting null for the _aBasicAreaSelection");
		assert.equal(oFilterBar._mAdvancedAreaFilter, null, "expecting null for the _mAdvancedAreaFilter");
		assert.equal(oFilterBar.getFilterItems().length, 0, "expecting empty filterItems aggregation");

	});

	QUnit.test("Checking the aggregation addFilterGroupItem", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		assert.ok(this.oFilterBar._mAdvancedAreaFilter);
		assert.equal(Object.keys(this.oFilterBar._mAdvancedAreaFilter).length, 1, "the internal map should contain one entry");
	});

	QUnit.test("Checking the aggregation addFilterGroupItem with two groups", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		assert.ok(this.oFilterBar._mAdvancedAreaFilter);
		assert.equal(Object.keys(this.oFilterBar._mAdvancedAreaFilter).length, 2, "the internal map should contain two entry");
	});

	QUnit.test("Checking the removeFilterItem method", function (assert) {

		var	oFilterItem1, oFilterItem2, oRemovedItem,
			oFilterBar = this.oFilterBar;

		assert.equal(oFilterBar.removeFilterItem(), null, "Return if there is no argument provided");

		oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);

		oRemovedItem = oFilterBar.removeFilterItem(0);
		assert.equal(oFilterItem1, oRemovedItem, "The removed item should be returned");

		oFilterBar.removeFilterItem(oFilterItem2);
		assert.equal(oFilterBar.getFilterItems().length, 0, "FilterGroupItem aggregation should be empty");
		assert.equal(oFilterBar._aBasicAreaSelection, null, "Basic area selection should be empty");
		assert.equal(oFilterBar._mAdvancedAreaFilter, null, "The internal advanced map should be empty");

	});



	QUnit.test("Checking the removeFilterGroupItem method with invalid arguments", function (assert) {

		var oFilterGroupItem1, nIndex,
			oFilterBar = this.oFilterBar;
		assert.equal(oFilterBar.removeFilterGroupItem(), null, "Return if there is no argument provided");
		assert.equal(oFilterBar.removeFilterGroupItem("stringId"), null, "Return if there are no FilterGroupItems");

		oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		assert.equal(oFilterBar.removeFilterGroupItem("stringId"), null, "Return if there is no item with this id");

		nIndex = oFilterBar.getFilterGroupItems().length;
		assert.equal(oFilterBar.removeFilterGroupItem(-1), null, "Index can't be less than 0");
		assert.equal(oFilterBar.removeFilterGroupItem(nIndex), null, "Index can't be greater than or equal " +
			"to FilterGroupItems aggregation's length (" + nIndex + ")" );

	});


	QUnit.test("Checking the removeFilterGroupItem method", function (assert) {

		var	oFilterGroupItem1, oFilterGroupItem2, oFilterGroupItem3, sId, oRemovedItem,
			oFilterBar = this.oFilterBar;

		oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		oFilterGroupItem2 = _createFilterGroupItem("GROUP1", "Group 2", "ITEM2", "Item 2");
		oFilterBar.addFilterGroupItem(oFilterGroupItem2);


		oFilterGroupItem3 = _createFilterGroupItem("GROUP2", "Group 3", "ITEM3", "Item 3");
		oFilterBar.addFilterGroupItem(oFilterGroupItem3);

		oRemovedItem = oFilterBar.removeFilterGroupItem(0);
		assert.equal(oFilterGroupItem1, oRemovedItem, "The removed item should be returned");

		sId = oFilterGroupItem2.getId();
		assert.equal(oFilterBar._mAdvancedAreaFilter["GROUP1"].filterItem.getId(), sId, "Group1 FilterItem should now be oFilterGroupItem2");

		oFilterBar.removeFilterGroupItem(sId);
		assert.equal(Object.keys(oFilterBar._mAdvancedAreaFilter).length, 1, "The internal advanced map should have only 1 group");


		oFilterBar.removeFilterGroupItem(oFilterGroupItem3);
		assert.equal(oFilterBar.getFilterGroupItems().length, 0, "FilterGroupItem aggregation should be empty");
		assert.equal(oFilterBar._mAdvancedAreaFilter, null, "The internal advanced map should be empty");

	});

	QUnit.test("Checking the remove of the aggregation GroupFilterItem", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		this.oFilterBar.removeAllFilterGroupItems();

		assert.equal(this.oFilterBar._mAdvancedAreaFilter, null, "expecting an empty advancedFilterBar");
		assert.equal(this.oFilterBar.getFilterGroupItems().length, 0, "expecting an empty filterGroupItems aggregation");
	});

	QUnit.test("Checking the getAllFilterItems method", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);

		assert.ok(this.oFilterBar.getAllFilterItems().length === 4, "expecting four elements");
		assert.ok(this.oFilterBar.getAllFilterItems(true).length === 2, "expecting two elements");

		oFilterItem1.setVisible(false);
		assert.ok(this.oFilterBar.getAllFilterItems(true).length === 1, "expecting three elements");

		oFilterGroupItem1.setVisible(false);
		assert.ok(this.oFilterBar.getAllFilterItems(true).length === 1, "expecting two elements");

	});

	QUnit.test("Checking the registerFetchData method", function(assert) {

		var fFetchCallBack = function() {
			return {
				name: "TEST"
			};
		};

		this.oFilterBar.registerFetchData(fFetchCallBack);
		var oReturn = this.oFilterBar._fetchVariantFiltersData();

		assert.ok(oReturn, "expecting an object");
		assert.ok(oReturn.name, "expecting the property 'name'");
		assert.equal(oReturn.name, "TEST", "expecting the value 'TEST'");

	});

	QUnit.test("Checking the registerApplyData method", function(assert) {

		var oReturn = null;

		var fApplyCallBack = function(oJson) {
			oReturn = oJson;
		};

		this.oFilterBar.registerApplyData(fApplyCallBack);

		this.oFilterBar._applyVariantFields({
			name: "TEST"
		});

		assert.ok(oReturn, "expecting an object");
		assert.ok(oReturn.name, "expecting the property 'name'");
		assert.equal(oReturn.name, "TEST", "expecting the value 'TEST'");

	});

	QUnit.test("Checking the _createAddRemoveFiltersDialog method", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._createAddRemoveFiltersDialog("GROUP1");

		assert.ok(this.oFilterBar._aListItems, " 'aListItems' may not be null");
		assert.equal(this.oFilterBar._aListItems.length, 1);

		assert.equal(this.oFilterBar._aListItems[0].getVisible(), true, "item expected to be visible");

		oStub.restore();
	});

	QUnit.test("Checking the _createAddRemoveFiltersDialog method with Cancel", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._createAddRemoveFiltersDialog("GROUP1");

		assert.ok(!oFilterGroupItem.getPartOfCurrentVariant());

		oFilterGroupItem.setPartOfCurrentVariant(true);
		assert.ok(oFilterGroupItem.getPartOfCurrentVariant());

		this.oFilterBar._cancelAddRemoveFiltersDialog("GROUP1");

		assert.ok(!oFilterGroupItem.getPartOfCurrentVariant());

		oStub.restore();
	});

	QUnit.test("Checking the determineControlByFilterItem method", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		var oControl1 = oFilterGroupItem1.getControl();
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		var oControl2 = oFilterItem2.getControl();
		this.oFilterBar.addFilterItem(oFilterItem2);

		assert.strictEqual(this.oFilterBar.determineControlByFilterItem(oFilterGroupItem1), oControl1, "not the expected control for filter field returned");
		assert.strictEqual(this.oFilterBar.determineControlByFilterItem(oFilterItem2), oControl2, "not the expected control for select field returned");

	});

	QUnit.test("Checking the determineControlByName method", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEMG1", "Item 1");
		var oControl1 = oFilterGroupItem1.getControl();
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEMG2", "Item 2");
		var oControl2 = oFilterGroupItem2.getControl();
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		var oStub = sinon.stub(this.oFilterBar, "_determineGroupNameByName");
		oStub.withArgs("ITEMG1").returns("GROUP1");
		oStub.withArgs("ITEMG2").returns("GROUP2");

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		var oControl3 = oFilterItem2.getControl();
		this.oFilterBar.addFilterItem(oFilterItem2);

		assert.strictEqual(this.oFilterBar.determineControlByName("ITEMG1", "GROUP1"), oControl1);
		assert.strictEqual(this.oFilterBar.determineControlByName("ITEMG1"), oControl1);

		assert.strictEqual(this.oFilterBar.determineControlByName("ITEMG2"), oControl2);
		assert.strictEqual(this.oFilterBar.determineControlByName("ITEM2"), oControl3);

	});

	QUnit.test("Checking the determineLabelByName method", function(assert) {

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEMG1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEMG2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		var oStub = sinon.stub(this.oFilterBar, "_determineGroupNameByName");
		oStub.withArgs("ITEMG1").returns("GROUP1");
		oStub.withArgs("ITEMG2").returns("GROUP2");

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);

		var oLabel = this.oFilterBar.determineLabelByName("ITEMG1", "GROUP1");
		assert.ok(oLabel);
		assert.strictEqual(oLabel.getId(), this.oFilterBar.getId() + "-filterItem-GROUP1-ITEMG1");

		oLabel = this.oFilterBar.determineLabelByName("ITEMG2", "GROUP2");
		assert.ok(oLabel);
		assert.strictEqual(oLabel.getId(), this.oFilterBar.getId() + "-filterItem-GROUP2-ITEMG2");

		oLabel = this.oFilterBar.determineLabelByName("ITEM2");
		assert.ok(oLabel);
		assert.strictEqual(oLabel.getId(), this.oFilterBar.getId() + "-filterItem-___INTERNAL_-ITEM2");

	});

	QUnit.test("Checking Advanced Mode", function(assert) {

		assert.ok(this.oFilterBar.hasStyleClass("sapContrastPlus"));

		this.oFilterBar._afterVariantsLoad();

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem1.setVisibleInFilterBar(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		assert.ok(!this.oFilterBar.getAdvancedMode(), "initialy expecting the mode to be 'false'");

		if (this.oFilterBar._isPhone() || this.oFilterBar._isTablet()) {
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
		} else {
			assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
		}

		this.oFilterBar.setAdvancedMode(true);
		assert.ok(!this.oFilterBar.hasStyleClass("sapContrastPlus"));
		assert.ok(this.oFilterBar.getAdvancedMode(), "expecting the mode to be 'true'");
		assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible(), "expecting the mode to be 'false'");

		this.oFilterBar.setAdvancedMode(false);
		assert.ok(this.oFilterBar.hasStyleClass("sapContrastPlus"));
		assert.ok(!this.oFilterBar.getAdvancedMode(), "expecting the mode to be 'false'");

		var bExpanded = this.oFilterBar.getFilterBarExpanded();
		if (bExpanded) {
			assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible(), "expecting the mode to be 'true'");
		} else {
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible(), "expecting the mode to be 'false'");
		}
	});

	QUnit.test("Checking fireInitialise with SmartVariantControl with Flex", function(assert) {

		var bInitCalled = false;
		this.oFilterBar.attachInitialise(function() {
			bInitCalled = true;
		});

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(true);

		this.oFilterBar.fireInitialise();
		assert.ok(bInitCalled);

	});

	QUnit.test("Checking fireInitialise with SmartVariantControl with UI2", function(assert) {

		var bInitCalled = false;
		this.oFilterBar.attachInitialise(function() {
			bInitCalled = true;
		});

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(false);

		this.oFilterBar.fireInitialise();
		assert.ok(bInitCalled);

	});

	QUnit.test("Checking fireInitialise with SmartVariantControlUi2", function(assert) {

		var bInitCalled = false;
		this.oFilterBar.attachInitialise(function() {
			bInitCalled = true;
		});

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(false);

		this.oFilterBar.fireInitialise();

		assert.ok(bInitCalled);

	});

	QUnit.test("addFilter(Group)Item", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		oFilterItem = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem);

		assert.ok(this.oFilterBar._aBasicAreaSelection);
		assert.equal(this.oFilterBar._aBasicAreaSelection.length, 2, "the internal basic array should contain two entries");

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		assert.ok(this.oFilterBar._mAdvancedAreaFilter);
		assert.equal(Object.keys(this.oFilterBar._mAdvancedAreaFilter).length, 3, "the internal advanced map should contain three entries");

		assert.ok(this.oFilterBar._mAdvancedAreaFilter["__$INTERNAL$"]);
		assert.ok(this.oFilterBar._mAdvancedAreaFilter["__$INTERNAL$"].items);
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["__$INTERNAL$"].items.length, 2, "group '__$INTERNAL$' should contain two entries.");

	});

	QUnit.test("visibleInAdvancedArea handling", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem.setVisibleInAdvancedArea(false);

		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		this.oFilterBar._rerenderItem = sinon.stub();
		this.oFilterBar._rerenderAA = sinon.stub();

		assert.ok(this.oFilterBar._mAdvancedAreaFilter);
		assert.ok(this.oFilterBar._mAdvancedAreaFilter["GROUP1"]);
		assert.ok(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items);
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items.length, 1, "group 'GROUP1' should contain one entries.");
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items[0].filterItem.getVisibleInAdvancedArea(), false, "expected 'false' for the property 'visibleInAdvancedArea'.");
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items[0].filterItem.getVisibleInFilterBar(), false, "expected 'false' for the property 'visibleInFilterBar'.");

		oFilterGroupItem.setVisibleInAdvancedArea(true);

		assert.equal(this.oFilterBar._rerenderItem.called, true, "expecting _rerenderItem() to be executed");
		assert.equal(this.oFilterBar._rerenderAA.called, false, "expecting _rerenderAA() to be NOT executed");
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items[0].filterItem.getVisibleInAdvancedArea(), true, "expected 'true' for the property 'visibleInAdvancedArea'.");
		assert.equal(this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items[0].filterItem.getVisibleInFilterBar(), true, "expected 'true' for the property 'visibleInFilterBar'.");

	});

	QUnit.test("checking method _filterItemChange", function(assert) {

		var oSpy = sinon.spy(this.oFilterBar, "_filterItemChange");
		var oSpy2 = sinon.spy(this.oFilterBar, "_determineItemByName");

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		assert.ok(this.oFilterBar._mAdvancedAreaFilter, "'_mAdvancedAreaFilter' may not be null");
		assert.ok(this.oFilterBar._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP], "'_mAdvancedAreaFilter['internalGroup']' may not be null");
		assert.ok(this.oFilterBar._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items, "'_mAdvancedAreaFilter['internalGroup'].items' may not be null");
		assert.equal(this.oFilterBar._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items.length, 1, "expecting one etry");
		var oGroupFilterItem = this.oFilterBar._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0].filterItem;
		assert.ok(oGroupFilterItem, "expecting a group item");

		assert.equal(oGroupFilterItem.getVisible(), oFilterItem.getVisible(), "expecting the the same visibility on both items 'true'");

		oFilterItem.setVisible(false);
		assert.equal(oGroupFilterItem.getVisible(), oFilterItem.getVisible(), "expecting the the same visibility on both items 'false'");

		assert.equal(oSpy.calledOnce, true, "expecting the '_filterItemChange' to be called once");
		assert.equal(oSpy2.calledTwice, true, "expecting the '_determineItemByName' to be called twice");
	});

	QUnit.test("checking _reapplyVisibility method", function(assert) {

		var oFilterItemX = _createFilterItem("ITEMX", "Item X");
		oFilterItemX.setEntitySetName("EntitySet");
		this.oFilterBar.addFilterItem(oFilterItemX);
		oFilterItemX = this.oFilterBar.determineFilterItemByName("ITEMX");

		var oFilterItemY = _createFilterItem("ITEMY", "Item Y");
		oFilterItemY.setEntityTypeName("EntityType");
		this.oFilterBar.addFilterItem(oFilterItemY);
		oFilterItemY = this.oFilterBar.determineFilterItemByName("ITEMY");

		var oFilterItem = _createFilterItem("ITEM0", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM0");

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		assert.equal(oFilterItemX.getVisibleInFilterBar(), true, "expecting 'ITEMX' to be visible in advanced area");
		assert.equal(oFilterItemY.getVisibleInFilterBar(), true, "expecting 'ITEMY' to be visible in advanced area");
		assert.equal(oFilterGroupItem1.getVisibleInFilterBar(), false, "expecting 'Group 1:ITEM1' to be invisible in advanced area");
		assert.equal(oFilterGroupItem2.getVisibleInFilterBar(), false, "expecting 'Group 2:ITEM1' to be invisible in advanced area");

		var aVisibleFields = [
			{
				group: "GROUP1",
				name: "ITEM1"
			}, {
				group: "__$INTERNAL$",
				name: "ITEM0",
				visibleInFilterBar: false,
				partOfCurrentVariant: true
			}, {
				group: "EntitySet",
				name: "ITEMX",
				visibleInFilterBar: false,
				partOfCurrentVariant: true
			}, {
				group: "EntityType",
				name: "ITEMY",
				visibleInFilterBar: false,
				partOfCurrentVariant: true
			}
		];

		this.oFilterBar._reapplyVisibility(aVisibleFields);
		assert.equal(oFilterGroupItem1.getVisibleInFilterBar(), true, "expecting 'Group 1:ITEM1' to be visible in advanced area");
		assert.equal(oFilterGroupItem2.getVisibleInFilterBar(), false, "expecting 'Group 2:ITEM1' to be still invisible in advanced area");
		assert.equal(oFilterItemX.getVisibleInFilterBar(), false, "expecting 'ITEMX' to be invisible in advanced area");
		assert.equal(oFilterItemY.getVisibleInFilterBar(), false, "expecting 'ITEMY' to be invisible in advanced area");
		assert.equal(oFilterItem.getVisibleInFilterBar(), false);

		aVisibleFields = [
			{
				group: "GROUP1",
				name: "ITEM1"
			}, {
				group: "__$INTERNAL$",
				name: "ITEM0",
				visibleInFilterBar: true,
				partOfCurrentVariant: true
			}
		];

		this.oFilterBar._reapplyVisibility(aVisibleFields);
		assert.equal(oFilterGroupItem1.getVisibleInFilterBar(), true, "expecting 'Group 1:ITEM1' to be visible in advanced area");
		assert.equal(oFilterGroupItem2.getVisibleInFilterBar(), false, "expecting 'Group 2:ITEM1' to be still invisible in advanced area");
		assert.equal(oFilterItem.getVisibleInFilterBar(), true);
	});

	QUnit.test("checking _flattenMap method", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var aControls = this.oFilterBar._flattenMap();
		assert.ok(aControls);
		assert.ok(aControls.length === 5);

		assert.ok(aControls[0].filterItem);
		assert.ok(aControls[0].control === null);
		assert.equal(aControls[0].filterItem.getGroupName(), "GROUP1", "expecting the group name 'GROUP1' for first item");

		assert.ok(aControls[1].filterItem);
		assert.ok(aControls[1].control);
		assert.equal(aControls[1].filterItem.getName(), "ITEM1", "expecting the group name 'ITEM1' for second item");

		assert.ok(aControls[2].filterItem);
		assert.ok(aControls[2].control);
		assert.equal(aControls[2].filterItem.getName(), "ITEM2", "expecting the group name 'ITEM2' for third item");

		assert.ok(aControls[3].filterItem);
		assert.ok(aControls[3].control === null);
		assert.equal(aControls[3].filterItem.getGroupName(), "GROUP2", "expecting the group name 'GROUP1' for fourth item");

		assert.ok(aControls[4].filterItem);
		assert.ok(aControls[4].control);
		assert.equal(aControls[4].filterItem.getName(), "ITEM1", "expecting the group name 'ITEM1' for fifth item");
	});

	QUnit.test("checking _triggerSearch method", function(assert) {
		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem.setLabelTooltip("tooltip");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);
		var bFound = false;
		var oList = new List({
			mode: mLibrary.ListMode.MultiSelect
		});
		this.oFilterBar._generateListItems("GROUP1", oList);
		this.oFilterBar._aListItems = oList.getItems();
		assert.ok(this.oFilterBar._aListItems, "expecting entries");
		assert.equal(this.oFilterBar._aListItems.length, 1);
		this.oFilterBar._aListItems[0].setVisible = function(bFlag) {
			if (bFlag) {
				bFound = true;
			}
		};

		var oParameters = {
			newValue: ""
		};
		var oEvent = {
			getParameters: function() {
				return oParameters;
			}
		};

		oParameters.newValue = "hugo";
		this.oFilterBar._triggerSearch(oEvent);
		assert.equal(bFound, false, "should not find 'hugo'");

		bFound = false;
		oParameters.newValue = "item";
		this.oFilterBar._triggerSearch(oEvent);
		assert.equal(bFound, true, "should find 'item'");

		bFound = false;
		oParameters.newValue = "tip";
		this.oFilterBar._triggerSearch(oEvent);
		assert.equal(bFound, true, "should find 'tip'");
	});

	QUnit.test("checking determineMandatoryFilterItems method", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var aMandatoryFilters = null;

		aMandatoryFilters = this.oFilterBar.determineMandatoryFilterItems();
		assert.equal(aMandatoryFilters.length, 0, "no mandatory fields expected");

		oFilterItem.setMandatory(true);
		aMandatoryFilters = this.oFilterBar.determineMandatoryFilterItems();
		assert.equal(aMandatoryFilters.length, 1, "one mandatory field expected (basic item)");
		assert.equal(aMandatoryFilters[0].getName(), oFilterItem.getName(), "expacting basic item");

		oFilterGroupItem.setMandatory(true);
		aMandatoryFilters = this.oFilterBar.determineMandatoryFilterItems();
		assert.equal(aMandatoryFilters.length, 2, "two mandatory field expected");
		assert.equal(aMandatoryFilters[0].getName(), oFilterItem.getName(), "expacting basic item");
		assert.equal(aMandatoryFilters[1], oFilterGroupItem, "expacting advanced item");

		oFilterItem.setVisible(false);
		aMandatoryFilters = this.oFilterBar.determineMandatoryFilterItems();
		assert.equal(aMandatoryFilters.length, 1, "one mandatory field expected (advanced field)");
		assert.equal(aMandatoryFilters[0], oFilterGroupItem, "expacting advanced item");

		oFilterGroupItem.setVisibleInAdvancedArea(false);
		oFilterGroupItem.setPartOfCurrentVariant(false);
		aMandatoryFilters = this.oFilterBar.determineMandatoryFilterItems();
		assert.equal(oFilterGroupItem.getVisibleInAdvancedArea(), true, "mandatory fields without value are always visible in filter bar");

		// assert.equal(aMandatoryFilters.length, 0, "mandatory fields should be not considered, based on visiblity/inarea=false");
	});

	QUnit.test("checking _selectionChangedInAddFiltersDialog method", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		var oControl = oFilterGroupItem.getControl();
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oItem = this.oFilterBar._determineItemByName("ITEM1", "GROUP1");
		assert.ok(oItem);

		var oCheckBox = new CheckBox();
		oCheckBox.setSelected(true);
		oItem.checkbox = oCheckBox;

		var oParams = null;
		this.oFilterBar.attachFilterChange(function(oEvent) {
			if (oEvent) {
				oParams = oEvent.getParameters();
			}
		});

		this.oFilterBar._selectionChangedInAddFiltersDialog(oCheckBox, oItem);

		assert.ok(oParams, "1. should not be null");
		assert.ok(oParams.added, "attribute 'added' should exists");
		assert.equal(oParams.added, oControl, "not the expected 'added' Control");

		oParams = null;

		oCheckBox.setSelected(false);
		this.oFilterBar._selectionChangedInAddFiltersDialog(oCheckBox, oItem);

		assert.ok(oParams, "2. should not be null");
		assert.ok(oParams.deleted, "attribute 'deleted' should exists");
		assert.equal(oParams.deleted, oControl, "not the expected 'deleted' Control");
		oCheckBox.destroy();
		oCheckBox = null;
	});

	QUnit.test("checking rerenderFilters method with different mode", function(assert) {

		var oSpy = sinon.spy(this.oFilterBar, "_rerenderFilters");

		this.oFilterBar.rerenderFilters(true);
		assert.ok(oSpy.called === true, "expecting '_rerenderFilters' to be called");
	});

	QUnit.test("checking search method", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		sinon.stub(this.oFilterBar, "fireSearch");
		sinon.stub(this.oFilterBar, "_retrieveCurrentSelectionSet").returns("TEST");

		this.oFilterBar.search();

		assert.ok(this.oFilterBar._retrieveCurrentSelectionSet.calledOnce, "expecting '_retrieveCurrentSelectionSet' to be called");
		assert.ok(this.oFilterBar.fireSearch.calledOnce, "expecting 'fireSearch' to be called");
	});

	QUnit.test("checking clear method", function(assert) {

		sinon.stub(this.oFilterBar, "fireClear");
		sinon.stub(this.oFilterBar, "_retrieveCurrentSelectionSet").returns([]);
		sinon.stub(this.oFilterBar, "_clearErrorState");

		this.oFilterBar.clear();

		assert.ok(this.oFilterBar._retrieveCurrentSelectionSet.calledOnce, "expecting '_retrieveCurrentSelectionSet' to be called");
		assert.ok(this.oFilterBar.fireClear.calledOnce, "expecting 'fireClear' to be called");
	});

	QUnit.test("checking reset method", function(assert) {

		sinon.stub(this.oFilterBar, "fireReset");
		sinon.stub(this.oFilterBar, "_retrieveCurrentSelectionSet").returns([]);

		sinon.stub(this.oFilterBar, "_resetFilterBarSearch");

		this.oFilterBar.reset();

		assert.ok(this.oFilterBar._retrieveCurrentSelectionSet.called, "expecting '_retrieveCurrentSelectionSet' to be called");
		assert.ok(this.oFilterBar.fireReset.calledOnce, "expecting 'fireReset' to be called");
	});

	QUnit.test("checking _applyVariant method", function(assert) {
		var oVariant = {
			getItemValue: function(s) {
				return s;
			}
		};

		var that = this;
		var bModifyFlag;
		this.oFilterBar.attachAfterVariantLoad(function() {
			bModifyFlag = that.oFilterBar._getConsiderFilterChanges();
		});

		sinon.stub(this.oFilterBar, "_applyVariantFields");
		sinon.stub(this.oFilterBar, "_reapplyVisibility");
		sinon.spy(this.oFilterBar, "fireAfterVariantLoad");

		assert.ok(this.oFilterBar._getConsiderFilterChanges());
		this.oFilterBar._applyVariant(oVariant);
		assert.ok(this.oFilterBar._getConsiderFilterChanges());

		assert.ok(this.oFilterBar._applyVariantFields.calledOnce);
		assert.ok(this.oFilterBar._reapplyVisibility.calledOnce);
		assert.ok(this.oFilterBar.fireAfterVariantLoad.calledOnce);
		assert.ok(!bModifyFlag);

	});

	QUnit.test("checking applyVariant method", function(assert) {

		sinon.stub(this.oFilterBar, "_applyVariant");

		this.oFilterBar.applyVariant({});

		assert.ok(this.oFilterBar._applyVariant.calledOnce);

	});

	QUnit.test("checking fetchVariant/applyVariant method - full mode", function(assert) {

		var oVariant = _createVariant(this.oFilterBar, assert);
		assert.equal(oVariant.filterbar.length, 5);
		assert.equal(oVariant.filterbar[0].group, "__$INTERNAL$");
		assert.equal(oVariant.filterbar[0].name, "ITEM1");
		assert.ok(oVariant.filterbar[0].visibleInFilterBar);
		assert.ok(oVariant.filterbar[0].partOfCurrentVariant);

		assert.equal(oVariant.filterbar[1].group, "__$INTERNAL$");
		assert.equal(oVariant.filterbar[1].name, "ITEM2");
		assert.ok(oVariant.filterbar[1].visibleInFilterBar);
		assert.ok(oVariant.filterbar[1].partOfCurrentVariant);

		assert.equal(oVariant.filterbar[2].group, "GROUP1");
		assert.equal(oVariant.filterbar[2].name, "ITEM3");
		assert.ok(oVariant.filterbar[2].visibleInFilterBar);
		assert.ok(oVariant.filterbar[2].partOfCurrentVariant);

		assert.equal(oVariant.filterbar[3].group, "GROUP1");
		assert.equal(oVariant.filterbar[3].name, "ITEM4");
		assert.ok(!oVariant.filterbar[3].visibleInFilterBar);
		assert.ok(!oVariant.filterbar[3].partOfCurrentVariant);

		assert.equal(oVariant.filterbar[4].group, "GROUP2");
		assert.equal(oVariant.filterbar[4].name, "ITEM5");
		assert.ok(oVariant.filterbar[4].visibleInFilterBar);
		assert.ok(oVariant.filterbar[4].partOfCurrentVariant);

		var oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM4");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(!oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM5");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oVariant.filterbar[0].visibleInFilterBar = false;
		oVariant.filterbar[0].partOfCurrentVariant = false;

		oVariant.filterbar[3].visibleInFilterBar = true;
		oVariant.filterbar[3].partOfCurrentVariant = true;

		oVariant.filterbar[4].visibleInFilterBar = false;
		oVariant.filterbar[4].partOfCurrentVariant = false;

		this.oFilterBar.applyVariant(oVariant);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM4");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM5");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(!oFilterItem.getPartOfCurrentVariant());

	});

	QUnit.test("checking fetchVariant/applyVariant method - full mode - new filters", function(assert) {

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(true);
		var oVariant = _createVariant(this.oFilterBar, assert);

		assert.equal(oVariant.filterbar.length, 5);

		var oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM2");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());
		oFilterItem.setVisibleInFilterBar(false);
		oFilterItem.setPartOfCurrentVariant(false);

		oFilterItem = _createFilterItem("ITEM_NEW", "Item New");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM_NEW");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		this.oFilterBar.applyVariant(oVariant);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM2");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM_NEW");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

	});

	QUnit.test("checking fetchVariant/applyVariant method - full mode - move filters", function(assert) {

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(true);
		var oVariant = _createVariant(this.oFilterBar, assert);
		assert.equal(oVariant.filterbar.length, 5);

		this.oFilterBar.removeAllFilters();

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = _createFilterItem("ITEM3", "Item 3");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = _createFilterItem("ITEM4", "Item 4");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = _createFilterItem("ITEM40", "Item 40");
		this.oFilterBar.addFilterItem(oFilterItem);

		this.oFilterBar.applyVariant(oVariant);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM2");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM3");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM4");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM40");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());
	});

	QUnit.test("checking fetchVariant/applyVariant method - delta mode", function(assert) {

		sinon.stub(this.oFilterBar, "_isTINAFScenario").returns(true);
		var oStandardVariant = _createVariant(this.oFilterBar, assert);

		sinon.stub(this.oFilterBar, "_getStandardVariant").returns(oStandardVariant);

		sinon.stub(this.oFilterBar, "_isDeltaHandling").returns(true);
		sinon.stub(this.oFilterBar, "_isStandardVariant").returns(false);

		var oVariant = this.oFilterBar.fetchVariant();
		assert.ok(oVariant);
		assert.ok(oVariant.filterbar);
		assert.equal(oVariant.filterbar.length, 0);

		var oFilterItem = _createFilterItem("ITEM_NEW", "Item New");
		this.oFilterBar.addFilterItem(oFilterItem);
		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM_NEW");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		this.oFilterBar.applyVariant(oVariant);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM4");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(!oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM5");
		assert.ok(oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM_NEW");
		assert.ok(!oFilterItem.getVisibleInFilterBar());
		assert.ok(oFilterItem.getPartOfCurrentVariant());
	});

	QUnit.test("checking fetchVariant method", function(assert) {

		var fFetchCallBack = function() {
			return "TEST";
		};

		this.oFilterBar.registerFetchData(fFetchCallBack);

		var oVariant = this.oFilterBar.fetchVariant();

		assert.ok(oVariant);
		assert.equal(oVariant.filterBarVariant, "TEST");
	});

	QUnit.test("checking _determineGroupNameByName method", function(assert) {

		var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		oFilterItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM3", "Item 3");
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		oFilterItem = _createFilterItem("ITEM4", "Item 4");
		this.oFilterBar.addFilterItem(oFilterItem);

		var sGroupName = this.oFilterBar._determineGroupNameByName("ITEM2");
		assert.equal(sGroupName, "GROUP1");

		sGroupName = this.oFilterBar._determineGroupNameByName("ITEM3");
		assert.equal(sGroupName, "GROUP2");

		sGroupName = this.oFilterBar._determineGroupNameByName("ITEM4");
		assert.ok(!sGroupName);

		this.oFilterBar._aFields = [
			{
				name: "ITEM2",
				groupName: "GROUP1"
			}
		];
		sGroupName = this.oFilterBar._determineGroupNameByName("ITEM2");
		assert.equal(sGroupName, "GROUP1");

	});

	QUnit.test("checking the removeage of an filter field", function(assert) {

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterGroupItem.setVisibleInAdvancedArea(true);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oItem = this.oFilterBar._determineItemByName(oFilterGroupItem.getName(), oFilterGroupItem.getGroupName());
		assert.ok(oItem, "expecting the correspondning item for the filter");
		assert.ok(oItem.container, "expecting container of the filter");
		assert.ok(oItem.container.getVisible(), "expecting container to be visible");
		assert.ok(oItem.container.getVisible(), "expecting container to be visible");

		var aContent = oItem.container.getContent();
		assert.ok(aContent, "expecting container content");
		assert.ok(oFilterGroupItem.getVisibleInAdvancedArea(), "expecting filter to be visible");

	});

	QUnit.test("checking fireAfterVariantLoad  method", function(assert) {
		this.oFilterBar._rerenderFilters = sinon.stub();

		this.oFilterBar.fireEvent = sinon.stub();

		this.oFilterBar.fireAfterVariantLoad();

		assert.ok(this.oFilterBar._rerenderFilters.calledOnce);
		assert.ok(this.oFilterBar.fireEvent.calledOnce);
	});

	QUnit.test("Checking group title adaption", function(assert) {

		var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		this.oFilterBar.setConsiderGroupTitle(true);
		this.oFilterBar._adaptGroupsTitle();

		var oLabel = oFilterItem.getLabelControl();
		assert.ok(oLabel);

		assert.equal(oLabel.getText(), "Item 1 (Group 1)");

		this.oFilterBar.setConsiderGroupTitle(false);
		this.oFilterBar._adaptGroupsTitle();
		assert.equal(oLabel.getText(), "Item 1");
	});

	QUnit.test("Checking _mandatoryFilterChange", function(assert) {

		var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterItem.setMandatory(true);
		var oControl = oFilterItem.getControl();

		oFilterItem.setVisibleInFilterBar(true);
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		var oItem = {
			filterItem: oFilterItem,
			checkbox: new CheckBox({
				enabled: true
			})
		};

		var oParams = {
			oSource: oControl
		};

		var oEvent = {
			getParameters: function() {
				return oParams;
			}
		};

		sinon.stub(this.oFilterBar, "_getFiltersWithValues").returns([]);
		sinon.stub(this.oFilterBar, "_determineByControl").returns(oItem);
		sinon.stub(this.oFilterBar, "_checkFilterForValue").returns(false);

		this.oFilterBar._mandatoryFilterChange(oEvent);

		assert.equal(oItem.checkbox.getEnabled(), false);

	});
	QUnit.test("Checking retrieveFiltersWithValues", function(assert) {
		var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterItem);
		oFilterItem.setVisibleInFilterBar(true);

		var oFilterItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterItem1);
		oFilterItem1.setVisibleInFilterBar(false);

		var oFilterItem2 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM3", "Item 3");
		this.oFilterBar.addFilterGroupItem(oFilterItem2);
		oFilterItem2.setVisibleInFilterBar(true);

		sinon.stub(this.oFilterBar, "_getFiltersWithValues").returns([
			oFilterItem, oFilterItem1, oFilterItem2
		]);

		var aFilters = this.oFilterBar.retrieveFiltersWithValues();
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);
		assert.equal(aFilters[0], "Item 1");
		assert.equal(aFilters[1], "Item 3");

	});

	QUnit.test("Checking determineNotAssignedFiltersCount", function(assert) {

		var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterItem);
		oFilterItem.setVisibleInFilterBar(true);

		oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterItem);
		oFilterItem.setVisibleInFilterBar(false);

		assert.equal(this.oFilterBar._determineNotAssignedFiltersCount("GROUP1"), 1);

		oFilterItem.setPartOfCurrentVariant(true);
		assert.equal(this.oFilterBar._determineNotAssignedFiltersCount("GROUP1"), 0);

	});

	QUnit.test("Checking _createFilters", function(assert) {
		var fnDone = assert.async();
		// just to load the Form and Layout
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			this.oFilterBar._oFilterDialog.attachAfterClose(function() {
				var nIdx;

				var oFilterItem = _createFilterItem("ITEM1", "Item 1");
				this.oFilterBar.addFilterItem(oFilterItem);

				oFilterItem = _createFilterItem("ITEM2", "Item 1");
				this.oFilterBar.addFilterItem(oFilterItem);

				oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
				this.oFilterBar.addFilterGroupItem(oFilterItem);

				oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
				this.oFilterBar.addFilterGroupItem(oFilterItem);

				var oForm = this.oFilterBar._createFilters();
				assert.ok(oForm);

				var aFormContainer = oForm.getFormContainers();
				assert.ok(aFormContainer);
				assert.equal(aFormContainer.length, 3);

				// aFormContainer[0] contains the variant management control

				assert.equal(aFormContainer[1].getTitle().getText(), this.oFilterBar._oRb.getText("FILTER_BAR_BASIC_GROUP"));
				var aFormElements = aFormContainer[1].getFormElements();
				assert.ok(aFormElements);
				if (this.oFilterBar._isPhone()) {
					assert.equal(aFormElements.length, 2);

					nIdx = 0;
				} else {
					assert.equal(aFormElements.length, 2); // + AddToFilterBar title
					var oToolbar = aFormContainer[1].getToolbar();
					assert.ok(oToolbar, "FormContainer has Toolbar");
					assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
					assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
					assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");

					nIdx = 1;
				}

				var aFields = aFormElements[nIdx].getFields();
				assert.ok(aFields);
				assert.equal(aFields.length, 2); // input + CheckBox

				aFields = aFormElements[nIdx].getFields();
				assert.ok(aFields);
				assert.equal(aFields.length, 2);

				assert.equal(aFormContainer[2].getTitle().getText(), "Group 1");
				aFormElements = aFormContainer[2].getFormElements();
				assert.ok(aFormElements);
				assert.equal(aFormElements.length, 3);

				aFields = aFormElements[2].getFields();
				assert.ok(aFields);
				assert.equal(aFields.length, 1);

				assert.ok(aFields[0] instanceof Link);

				fnDone();
			}.bind(this));

			this.oFilterBar._oFilterDialog.close();
		}.bind(this));
	});

	QUnit.test("Checking _showFilterDialog", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oStub = sinon.stub(Dialog.prototype, "open");

		var fnDone = assert.async();
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);
			var oForm = aDialogContent[0];
			assert.ok(oForm);

			assert.ok(oForm instanceof Form);

			var aFormContainer = oForm.getFormContainers();
			assert.ok(aFormContainer);
			assert.equal(aFormContainer.length, 3);

			assert.equal(aFormContainer[1].getTitle().getText(), this.oFilterBar._oRb.getText("FILTER_BAR_BASIC_GROUP"));
			var aFormElements = aFormContainer[1].getFormElements();
			assert.ok(aFormElements);

			if (this.oFilterBar._isPhone()) {
				assert.equal(aFormElements.length, 1);
			} else {
				assert.equal(aFormElements.length, 1); // + AddToFilterBar title
				var oToolbar = aFormContainer[1].getToolbar();
				assert.ok(oToolbar, "FormContainer has Toolbar");
				assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
				assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
				assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");
			}

			assert.equal(aFormContainer[2].getTitle().getText(), "Group 1");
			aFormElements = aFormContainer[2].getFormElements();
			assert.ok(aFormElements);
			assert.equal(aFormElements.length, 2);

			this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _showFilterDialog with Cancel", function(assert) {

		var oFilterItem = _createFilterItem("ITEM0", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);
		oFilterGroupItem.setVisibleInFilterBar(true);

		sinon.spy(this.oFilterBar, "fireCancel");

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			assert.ok(oFilterGroupItem.getVisibleInFilterBar());
			assert.ok(oFilterGroupItem.getPartOfCurrentVariant());

			oFilterGroupItem.setVisibleInFilterBar(false);
			oFilterGroupItem.setPartOfCurrentVariant(false);
			assert.ok(!oFilterGroupItem.getVisibleInFilterBar());
			assert.ok(!oFilterGroupItem.getPartOfCurrentVariant());

			this.oFilterBar._bDirtyViaDialog = true;
			this.oFilterBar._cancelFilterDialog(false);

			assert.ok(this.oFilterBar.fireCancel.calledOnce);

			assert.ok(oFilterGroupItem.getVisibleInFilterBar());
			assert.ok(oFilterGroupItem.getPartOfCurrentVariant());
			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("checking dynamic mandatory handling with open FiltersDialog", function(assert) {

		var oFilterItem = _createFilterItem("ITEM0", "Item X");
		oFilterItem.setVisibleInFilterBar(false);
		this.oFilterBar.addFilterItem(oFilterItem);

		sinon.spy(this.oFilterBar, "_adaptMandatoryForFilter");

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var oFilterItem0 = this.oFilterBar.determineFilterItemByName("ITEM0");
			assert.ok(oFilterItem0);
			assert.ok(!oFilterItem0.getVisibleInFilterBar());

			oFilterItem.setMandatory(true);

			assert.ok(oFilterItem0.getMandatory());

			if (!this.oFilterBar._isPhone()) {
				assert.ok(oFilterItem0.getVisibleInFilterBar());
			} else {
				assert.ok(!oFilterItem0.getVisibleInFilterBar());
			}

			assert.ok(this.oFilterBar._adaptMandatoryForFilter.calledOnce);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _closeDialogAndRestoreFilterBar", function(assert) {
		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);
			var oForm = aDialogContent[0];

			sinon.spy(this.oFilterBar, "_recreateBasicAreaContainer");

			this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);

			assert.ok(this.oFilterBar._recreateBasicAreaContainer.calledOnce);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _closeDialogAndRestoreFilterBar with liveMode", function(assert) {

		var oForm = {
			removeAllFormContainers: function() {
			}
		};

		sinon.stub(this.oFilterBar, "search");
		sinon.stub(this.oFilterBar, "_recreateBasicAreaContainer");
		sinon.stub(this.oFilterBar, "_deleteProperties");
		sinon.stub(this.oFilterBar, "_adaptGroupsTitle");
		sinon.stub(this.oFilterBar, "_updateToolbarText");

		this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
		assert.ok(!this.oFilterBar.search.called);

		var bFlag = false;
		this.oFilterBar.isLiveMode = function() {
			return bFlag;
		};

		this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
		assert.ok(!this.oFilterBar.search.called);

		bFlag = true;
		this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
		assert.ok(!this.oFilterBar.search.called);

	});


	QUnit.test("Checking _dialogSearch", function(assert) {
		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);

			sinon.spy(this.oFilterBar, "search");
			sinon.spy(this.oFilterBar._oFilterDialog, "close");

			this.oFilterBar._dialogSearch();

			assert.ok(this.oFilterBar.search.calledOnce);
			assert.ok(this.oFilterBar._oFilterDialog.close.called);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _dialogSearch with liveMode", function(assert) {
		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		this.oFilterBar.isLiveMode = function() {
			return true;
		};

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);

			sinon.spy(this.oFilterBar, "search");
			sinon.spy(this.oFilterBar._oFilterDialog, "close");

			this.oFilterBar._dialogSearch();

			assert.ok(!this.oFilterBar.search.calledOnce);
			assert.ok(this.oFilterBar._oFilterDialog.close.called);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _triggerSearchInFilterDialog", function(assert) {

		var oEvent = {
			getParameters: function() {
				return {
					newValue: "TEST"
				};
			}
		};

		sinon.stub(this.oFilterBar, "_triggerSearchByValueInFilterDialog");
		this.oFilterBar._triggerSearchInFilterDialog(oEvent);

		assert.equal(this.oFilterBar._sSearchCriteriaInFiltersDialog, "TEST");
		assert.ok(this.oFilterBar._triggerSearchByValueInFilterDialog.calledOnce);
	});

	QUnit.test("Checking _triggerSearchByValueInFilterDialog", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item Y");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);
		oFilterGroupItem.setPartOfCurrentVariant(true);

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);
			var oForm = aDialogContent[0];
			assert.ok(oForm);

			this.oFilterBar._triggerSearchByValueInFilterDialog("IteM");
			var nFiltersFound = _countMatchedFilters(oForm);
			assert.equal(nFiltersFound, 2);

			this.oFilterBar._triggerSearchByValueInFilterDialog("x");
			nFiltersFound = _countMatchedFilters(oForm);
			assert.equal(nFiltersFound, 1);

			this.oFilterBar._triggerSearchByValueInFilterDialog("y");
			nFiltersFound = _countMatchedFilters(oForm);
			assert.equal(nFiltersFound, 1);

			this.oFilterBar._triggerSearchByValueInFilterDialog("NiX");
			nFiltersFound = _countMatchedFilters(oForm);
			assert.equal(nFiltersFound, 0);

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Checking _rerenderGroup", function(assert) {

		var oItem = {
			formelement: {}
		};

		sinon.stub(this.oFilterBar, "_rerenderItem");

		var oFilterGroupItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem1);

		var oFilterGroupItem2 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem2);

		var bContainerVisible = false;
		this.oFilterBar._mAdvancedAreaFilter["GROUP1"].formcontainer = {
			setVisible: function(flag) {
				bContainerVisible = flag;
			}
		};

		this.oFilterBar._rerenderGroup(oItem, "GROUP1");
		assert.ok(bContainerVisible);

		oFilterGroupItem1.setVisible(false);
		this.oFilterBar._rerenderGroup(oItem, "GROUP1");
		assert.ok(bContainerVisible);

		oFilterGroupItem2.setVisible(false);
		this.oFilterBar._rerenderGroup(oItem, "GROUP1");
		assert.ok(!bContainerVisible);
	});

	QUnit.test("Checking _selectionChangedInFilterDialog", function(assert) {

		var oCheckBox = new CheckBox();
		oCheckBox.setSelected(true);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		assert.ok(!oFilterGroupItem.getVisibleInFilterBar());

		this.oFilterBar._selectionChangedInFilterDialog(oCheckBox, oFilterGroupItem);
		assert.ok(oFilterGroupItem.getVisibleInFilterBar());

		oCheckBox.setSelected(false);
		this.oFilterBar._selectionChangedInFilterDialog(oCheckBox, oFilterGroupItem);
		assert.ok(!oFilterGroupItem.getVisibleInFilterBar());

		oCheckBox.destroy();
		oCheckBox = null;
	});

	QUnit.test("Checking setFilterBarExpanded", function(assert) {
		assert.ok(!this.oFilterBar._oHideShowButton.getEnabled());

		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
			assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		} else {
			if (this.oFilterBar._isTablet()) {
				assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_SHOW"));
			} else {
				assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_HIDE"));
			}

			assert.ok(this.oFilterBar._oHideShowButton.getVisible());

			this.oFilterBar.setFilterBarExpanded(true);
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
			assert.ok(!this.oFilterBar._oHideShowButton.getEnabled());
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
			assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_HIDE"));

			this.oFilterBar.setFilterBarExpanded(false);
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
			assert.ok(!this.oFilterBar._oHideShowButton.getEnabled());
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
			assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_SHOW"));
		}
	});

	QUnit.test("Checking setFilterBarExpanded with filters", function(assert) {

		this.oFilterBar._afterVariantsLoad();

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		} else {

			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
			assert.ok(this.oFilterBar._oHideShowButton.getEnabled());

			if (this.oFilterBar._isTablet()) {
				assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_SHOW"));
			} else {
				assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_HIDE"));
			}

			this.oFilterBar.setFilterBarExpanded(true);
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
			assert.ok(this.oFilterBar._oHideShowButton.getEnabled());
			assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
			assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_HIDE"));

			this.oFilterBar.setFilterBarExpanded(false);
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
			assert.ok(this.oFilterBar._oHideShowButton.getEnabled());
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
			assert.equal(this.oFilterBar._oHideShowButton.getText(), this.oFilterBar._oRb.getText("FILTER_BAR_SHOW"));
		}
	});

	QUnit.test("Checking setFilterBarExpanded on phone", function(assert) {

		sinon.stub(this.oFilterBar, "_isPhone").returns(true);

		this.oFilterBar.setFilterBarExpanded(true);
		assert.ok(!this.oFilterBar._oHideShowButton.getVisible());

		this.oFilterBar.setFilterBarExpanded(false);
		assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
	});

	QUnit.test("Checking _variantSavePressed", function(assert) {

		sinon.stub(this.oFilterBar._oVariantManagement, "_openSaveAsDialog");
		this.oFilterBar._variantSavePressed();

		assert.ok(this.oFilterBar._oVariantManagement._openSaveAsDialog.calledOnce);
	});

	QUnit.test("Checking _retrieveCurrentSelectionSet ", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);
		oFilterGroupItem.setVisibleInFilterBar(true);

		var aCurrentSelection = this.oFilterBar._retrieveCurrentSelectionSet();

		assert.ok(aCurrentSelection);
		assert.ok(aCurrentSelection.length);
		assert.equal(aCurrentSelection.length, 2);
	});

	QUnit.test("Checking _determineByControl", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item X");
		var oCtrl1 = oFilterItem.getControl();
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		var oCtrl2 = oFilterGroupItem.getControl();
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var oItem = this.oFilterBar._determineByControl(oCtrl2);
		assert.ok(oItem);
		assert.equal(oItem, this.oFilterBar._mAdvancedAreaFilter["GROUP1"].items[0]);

		oItem = this.oFilterBar._determineByControl(oCtrl1);
		assert.ok(oItem);
		assert.equal(oItem, this.oFilterBar._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0]);

		oItem = this.oFilterBar._determineByControl(new Control());
		assert.ok(!oItem);
	});

	QUnit.test("Checking Go button", function(assert) {

		assert.ok(this.oFilterBar.getShowGoOnFB());
		assert.ok(this.oFilterBar._oSearchButton.getVisible());

		this.oFilterBar.setShowGoOnFB(false);
		assert.ok(!this.oFilterBar.getShowGoOnFB());
		assert.ok(!this.oFilterBar._oSearchButton.getVisible());

		this.oFilterBar.setShowGoOnFB(true);
		assert.ok(this.oFilterBar.getShowGoOnFB());
		assert.ok(this.oFilterBar._oSearchButton.getVisible());
	});

	QUnit.test("Checking Clear button", function(assert) {

		assert.ok(!this.oFilterBar.getShowClearOnFB());
		assert.ok(!this.oFilterBar._oClearButtonOnFB.getVisible());

		this.oFilterBar.setShowClearOnFB(true);
		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar.getShowClearOnFB());
		} else {

			assert.ok(this.oFilterBar.getShowClearOnFB());
			assert.ok(this.oFilterBar._oClearButtonOnFB.getVisible());

			this.oFilterBar.setShowClearOnFB(false);
			assert.ok(!this.oFilterBar.getShowClearOnFB());
			assert.ok(!this.oFilterBar._oClearButtonOnFB.getVisible());
		}
	});

	QUnit.test("Checking Restore button", function(assert) {

		assert.ok(!this.oFilterBar.getShowRestoreOnFB());
		assert.ok(!this.oFilterBar._oRestoreButtonOnFB.getVisible());

		this.oFilterBar.setShowRestoreOnFB(true);
		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar.getShowRestoreOnFB());
		} else {

			assert.ok(this.oFilterBar.getShowRestoreOnFB());
			assert.ok(this.oFilterBar._oRestoreButtonOnFB.getVisible());

			this.oFilterBar.setShowRestoreOnFB(false);
			assert.ok(!this.oFilterBar.getShowRestoreOnFB());
			assert.ok(!this.oFilterBar._oRestoreButtonOnFB.getVisible());
		}
	});

	QUnit.test("Checking getCurrentVariantId", function(assert) {

		sinon.spy(this.oFilterBar._oVariantManagement, "getCurrentVariantId");

		var sKey = this.oFilterBar.getCurrentVariantId();
		assert.equal(sKey, "");
		assert.ok(this.oFilterBar._oVariantManagement.getCurrentVariantId.calledOnce);
	});

	QUnit.test("Checking setCurrentVariantId", function(assert) {

		var spy = sinon.spy(this.oFilterBar._oVariantManagement, "setCurrentVariantId");
		spy.withArgs("test");

		this.oFilterBar.setCurrentVariantId("test");
		assert.ok(spy.withArgs("test").calledOnce);
	});

	QUnit.test("Checking getCurrentVariant", function(assert) {

		var sShouldResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "ITEM0",
					"PropertyValue": "2012"
				}, {
					"PropertyName": "ITEM3",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}, {
					"PropertyName": "ITEM5",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "ITEM1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}
					]
				}, {
					"PropertyName": "ITEM2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2014-12-09T23:00:00.000Z",
							"High": "2014-12-19T23:00:00.000Z"
						}
					]
				}
			]
		};
		var sShouldResultWithInvisibleFilter = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "ITEM0",
					"PropertyValue": "2012"
				}, {
					"PropertyName": "ITEM3",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}, {
					"PropertyName": "ITEM5",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "ITEM1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}
					]
				}, {
					"PropertyName": "ITEM2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2014-12-09T23:00:00.000Z",
							"High": "2014-12-19T23:00:00.000Z"
						}
					]
				}, {
					"PropertyName": "ITEM4",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "54000",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "34555",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1600",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1010",
							"High": null
						}
					]
				}
			]
		};
		var oInternalFormat = {
			"ITEM5": "2014-12-11T23:00:00.000Z",
			"ITEM0": {
				"value": "2012",
				"ranges": [],
				"items": []
			},
			"ITEM1": {
				"value": "",
				"ranges": [],
				"items": [
					{
						"key": "F001",
						"text": "Tools Inc. Europe (F001)"
					}
				]
			},
			"ITEM2": {
				"low": "2014-12-09T23:00:00.000Z",
				"high": "2014-12-19T23:00:00.000Z"
			},
			"ITEM3": "2014-12-11T23:00:00.000Z",
			"ITEM4": {
				"value": null,
				"ranges": [],
				"items": [
					{
						"key": "54000",
						"text": "54000"
					}, {
						"key": "34555",
						"text": "34555"
					}, {
						"key": "1600",
						"text": "1600"
					}, {
						"key": "1010",
						"text": "1010"
					}
				]
			}
		};

		this.oFilterBar.getFilterDataAsString = function(bConsider) {
			return JSON.stringify(oInternalFormat);
		};

		this.oFilterBar.getAnalyticParamatersMetadata = function() {
			return [];
		};

		this.oFilterBar.getFilterBarViewMetadata = function() {
			var aMetaData = [];
			var aFields = [];

			aFields.push({
				fieldName: "ITEM0",
				filterRestriction: "single"
			}, {
				fieldName: "ITEM1",
				filterRestriction: "multiple"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM2",
				filterRestriction: "interval"
			}, {
				fieldName: "ITEM3",
				filterRestriction: "single"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM4",
				filterRestriction: "multiple"
			}, {
				fieldName: "ITEM5",
				filterRestriction: "auto"
			}, {
				fieldName: "ITEM6",
				filterRestriction: "auto"
			});
			aMetaData.push({
				fields: aFields
			});

			return aMetaData;
		};

		var oFilterItem = _createFilterItem("ITEM0", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		oFilterItem = _createFilterItem("ITEM1", "Item Y");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM3", "Item 3");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM4", "Item 4");
		oFilterGroupItem.setVisible(false);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM5", "Item 5");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		sinon.spy(this.oFilterBar._oVariantManagement, "getCurrentVariantId");

		var sSuite = this.oFilterBar.getDataSuiteFormat();
		assert.ok(sSuite);
		assert.equal(sSuite, JSON.stringify(sShouldResult));

		sSuite = this.oFilterBar.getDataSuiteFormat(true);
		assert.ok(sSuite);
		assert.equal(sSuite, JSON.stringify(sShouldResultWithInvisibleFilter));

	});

	QUnit.test("Checking getDataSuiteFormat(true)", function(assert) {

		var sShouldResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "ITEM0",
					"PropertyValue": "2012"
				}, {
					"PropertyName": "ITEM3",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}, {
					"PropertyName": "ITEM5",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "ITEM1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}
					]
				}, {
					"PropertyName": "ITEM2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2014-12-09T23:00:00.000Z",
							"High": "2014-12-19T23:00:00.000Z"
						}
					]
				}, {
					"PropertyName": "ITEM4",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "54000",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "34555",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1600",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1010",
							"High": null
						}
					]
				}
			]
		};
		var oInternalFormat = {
			"ITEM5": "2014-12-11T23:00:00.000Z",
			"ITEM0": {
				"value": "2012",
				"ranges": [],
				"items": []
			},
			"ITEM1": {
				"value": "",
				"ranges": [],
				"items": [
					{
						"key": "F001",
						"text": "Tools Inc. Europe (F001)"
					}
				]
			},
			"ITEM2": {
				"low": "2014-12-09T23:00:00.000Z",
				"high": "2014-12-19T23:00:00.000Z"
			},
			"ITEM3": "2014-12-11T23:00:00.000Z",
			"ITEM4": {
				"value": null,
				"ranges": [],
				"items": [
					{
						"key": "54000",
						"text": "54000"
					}, {
						"key": "34555",
						"text": "34555"
					}, {
						"key": "1600",
						"text": "1600"
					}, {
						"key": "1010",
						"text": "1010"
					}
				]
			}
		};

		this.oFilterBar.getFilterDataAsString = function(bConsider) {
			return JSON.stringify(oInternalFormat);
		};

		this.oFilterBar.getAnalyticParamatersMetadata = function(assert) {
			return [];
		};
		this.oFilterBar.getFilterBarViewMetadata = function() {
			var aMetaData = [];
			var aFields = [];

			aFields.push({
				fieldName: "ITEM0",
				filterRestriction: "single"
			}, {
				fieldName: "ITEM1",
				filterRestriction: "multiple"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM2",
				filterRestriction: "interval"
			}, {
				fieldName: "ITEM3",
				filterRestriction: "single"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM4",
				filterRestriction: "multiple"
			}, {
				fieldName: "ITEM5",
				filterRestriction: "auto"
			}, {
				fieldName: "ITEM6",
				filterRestriction: "auto"
			});
			aMetaData.push({
				fields: aFields
			});

			return aMetaData;
		};

		var oFilterItem = _createFilterItem("ITEM0", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		oFilterItem = _createFilterItem("ITEM1", "Item Y");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM3", "Item 3");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM4", "Item 4");
		oFilterGroupItem.setVisible(false);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM5", "Item 5");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		sinon.spy(this.oFilterBar._oVariantManagement, "getCurrentVariantId");

		var sSuite = this.oFilterBar.getDataSuiteFormat(true);
		assert.ok(sSuite);
		assert.equal(sSuite, JSON.stringify(sShouldResult));

	});

	QUnit.test("Checking setCurrentVariant", function(assert) {
		var sShouldResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "ITEM0",
					"PropertyValue": "2012"
				}, {
					"PropertyName": "ITEM3",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}, {
					"PropertyName": "ITEM5",
					"PropertyValue": "2014-12-11T23:00:00.000Z"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "ITEM1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}
					]
				}, {
					"PropertyName": "ITEM2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2014-12-09T23:00:00.000Z",
							"High": "2014-12-19T23:00:00.000Z"
						}
					]
				}, {
					"PropertyName": "ITEM4",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "54000",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "34555",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1600",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "1010",
							"High": null
						}
					]
				}
			]
		};
		var oInternalFormat = {
			"ITEM5": "2014-12-11T23:00:00.000Z",
			"ITEM0": {
				"value": "2012",
				"ranges": [],
				"items": []
			},
			"ITEM1": {
				"value": "",
				"ranges": [],
				"items": [
					{
						"key": "F001",
						"text": "Tools Inc. Europe (F001)"
					}
				]
			},
			"ITEM2": {
				"low": "2014-12-09T23:00:00.000Z",
				"high": "2014-12-19T23:00:00.000Z"
			},
			"ITEM3": "2014-12-11T23:00:00.000Z",
			"ITEM4": {
				"value": null,
				"ranges": [],
				"items": [
					{
						"key": "54000",
						"text": "54000"
					}, {
						"key": "34555",
						"text": "34555"
					}, {
						"key": "1600",
						"text": "1600"
					}, {
						"key": "1010",
						"text": "1010"
					}
				]
			}
		};

		this.oFilterBar.getFilterDataAsString = function(bConsider) {
			return JSON.stringify(oInternalFormat);
		};

		this.oFilterBar.getAnalyticParamatersMetadata = function() {
			return [];
		};
		this.oFilterBar.getFilterBarViewMetadata = function() {
			var aMetaData = [];
			var aFields = [];

			aFields.push({
				fieldName: "ITEM0",
				filterRestriction: "single"
			}, {
				fieldName: "ITEM1",
				filterRestriction: "multiple"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM2",
				filterRestriction: "interval"
			}, {
				fieldName: "ITEM3",
				filterRestriction: "single"
			});
			aMetaData.push({
				fields: aFields
			});

			aFields = [];
			aFields.push({
				fieldName: "ITEM4",
				filterRestriction: "multiple"
			}, {
				fieldName: "ITEM5",
				filterRestriction: "auto"
			}, {
				fieldName: "ITEM6",
				filterRestriction: "auto"
			});
			aMetaData.push({
				fields: aFields
			});

			return aMetaData;
		};

		var oFilterItem = _createFilterItem("ITEM0", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		oFilterItem = _createFilterItem("ITEM1", "Item Y");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM3", "Item 3");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM4", "Item 4");
		oFilterGroupItem.setVisible(false);
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		oFilterGroupItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM5", "Item 5");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		sinon.spy(this.oFilterBar._oVariantManagement, "getCurrentVariantId");

		this.oFilterBar.setDataSuiteFormat(JSON.stringify(sShouldResult));

		var sResult = this.oFilterBar.getDataSuiteFormat(true);
		assert.equal(sResult, JSON.stringify(sShouldResult));

	});

	QUnit.test("checking _variantSave method", function(assert) {

		sinon.spy(this.oFilterBar, "fireBeforeVariantSave");

		this.oFilterBar._variantSave();

		assert.ok(this.oFilterBar.fireBeforeVariantSave.calledOnce);
	});

	QUnit.test("checking _afterVariantSave method", function(assert) {

		sinon.spy(this.oFilterBar, "fireAfterVariantSave");

		this.oFilterBar._afterVariantSave();

		assert.ok(this.oFilterBar.fireAfterVariantSave.calledOnce);
	});

	QUnit.test("checking setBasicSearch method", function(assert) {

		var oSearchField = new SearchField();

		assert.ok(!this.oFilterBar._oBasicSearchField);

		this.oFilterBar.setBasicSearch(oSearchField);

		assert.ok(this.oFilterBar._oBasicSearchField);
	});

	QUnit.test("checking afterVariantLoad event context", function(assert) {

		var sContext = null;
		this.oFilterBar.attachAfterVariantLoad(function(oEvent) {
			var oParams = oEvent.getParameters();
			sContext = oParams.context;
		});

		var oVariant = {
			content: {
				filterBarVariant: "",
				filterbar: ""
			}
		};

		sinon.stub(this.oFilterBar, "_applyVariantFields");
		sinon.stub(this.oFilterBar, "_reapplyVisibility");
		sinon.stub(this.oFilterBar, "_resetFilterBarSearch");

		this.oFilterBar.applyVariant(oVariant);
		assert.ok(sContext === undefined);

		sinon.stub(this.oFilterBar._oVariantManagement, "getSelectionKey").returns("X");
		sinon.stub(this.oFilterBar._oVariantManagement, "getVariantContent").returns(oVariant);
		this.oFilterBar._resetVariant();
		assert.ok(sContext === "RESET");

		this.oFilterBar._bDirtyViaDialog = true;
		this.oFilterBar._oInitialVariant = {
			key: "x",
			content: oVariant,
			modified: false
		};
		sinon.stub(this.oFilterBar._oVariantManagement, "_setSelectionByKey");
		this.oFilterBar._cancelFilterDialog(false);
		assert.ok(sContext === "CANCEL");

	});

	QUnit.test("checking setDataSuiteFormat method", function(assert) {
		var oSuite = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "id1",
			"Text": "",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "KeyDate",
					"PropertyValue": "2015-04-14T10:48:44.932Z"
				}
			],
			"SelectOptions": []
		};

		var oFilterItem = {
			getGroupName: function() {
				return "GROUP";
			}
		};

		// functionality of the smart filter bar
		this.oFilterBar.getAnalyticParamatersMetadata = function() {
			return [];
		};

		this.oFilterBar.getFilterBarViewMetadata = function() {
			return [];
		};

		this.oFilterBar._bIsInitialized = true;

		sinon.stub(this.oFilterBar, "determineFilterItemByName").returns(oFilterItem);
		sinon.stub(this.oFilterBar, "determineControlByFilterItem").returns(new Control());
		sinon.stub(this.oFilterBar, "_setFilterVisibility");

		sinon.spy(this.oFilterBar._oVariantManagement, "setInitialSelectionKey");

		this.oFilterBar.setDataSuiteFormat(JSON.stringify(oSuite));

		assert.ok(this.oFilterBar._oVariantManagement.setInitialSelectionKey.calledOnce);
		assert.ok(this.oFilterBar._setFilterVisibility.called);

		assert.equal(this.oFilterBar._oVariantManagement.getInitialSelectionKey(), "id1");

	});

	QUnit.test("checking setDataSuiteFormat with pageVariant method", function(assert) {
		var oSuite = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "id1",
			"Text": "",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "KeyDate",
					"PropertyValue": "2015-04-14T10:48:44.932Z"
				}
			],
			"SelectOptions": []
		};

		var oFilterItem = {
			getGroupName: function() {
				return "GROUP";
			}
		};

		// functionality of the smart filter bar
		this.oFilterBar.getAnalyticParamatersMetadata = function() {
			return [];
		};

		this.oFilterBar.getFilterBarViewMetadata = function() {
			return [];
		};

		this.oFilterBar._bIsInitialized = true;

		sinon.stub(this.oFilterBar, "determineFilterItemByName").returns(oFilterItem);
		sinon.stub(this.oFilterBar, "determineControlByFilterItem").returns(new Control());

		sinon.stub(this.oFilterBar._oVariantManagement, "isPageVariant").returns(true);
		sinon.spy(this.oFilterBar._oVariantManagement, "setInitialSelectionKey");

		this.oFilterBar._oVariantManagement._selectVariant = function(s) {
		};
		sinon.stub(this.oFilterBar._oVariantManagement, "_selectVariant");

		this.oFilterBar.setDataSuiteFormat(JSON.stringify(oSuite));

		assert.ok(this.oFilterBar._oVariantManagement.setInitialSelectionKey.calledOnce);
		assert.ok(this.oFilterBar._oVariantManagement._selectVariant.called);

		assert.equal(this.oFilterBar._oVariantManagement.getInitialSelectionKey(), "id1");

	});

	QUnit.test("checking fireBeforeVariantSave method without context", function(assert) {

		var that = this;
		var bConsiderChange = false;
		var sContext = null;

		this.oFilterBar._setConsiderFilterChanges(true);

		var fCallBack = function(oEvent) {
			bConsiderChange = that.oFilterBar._getConsiderFilterChanges();
			sContext = oEvent.getParameter("context");
		};

		this.oFilterBar.attachBeforeVariantSave(fCallBack);

		this.oFilterBar.fireBeforeVariantSave();

		assert.ok(bConsiderChange);

		assert.equal(sContext, undefined);

	});

	QUnit.test("checking fireBeforeVariantSave method with context", function(assert) {

		var that = this;
		var bConsiderChange = false;
		var sContext = null;

		this.oFilterBar._setConsiderFilterChanges(true);

		var fCallBack = function(oEvent) {
			bConsiderChange = that.oFilterBar._getConsiderFilterChanges();
			sContext = oEvent.getParameter("context");
		};

		this.oFilterBar.attachBeforeVariantSave(fCallBack);

		this.oFilterBar.fireBeforeVariantSave("STANDARD");

		assert.ok(!bConsiderChange);
		assert.equal(sContext, "STANDARD");

	});

	QUnit.test("checking _handleVisibilityOfToolbar", function(assert) {

		this.oFilterBar._handleVisibilityOfToolbar();
		assert.ok(this.oFilterBar._oToolbar.getVisible());

		this.oFilterBar._oSearchButton.setVisible(false);
		this.oFilterBar._oHideShowButton.setVisible(false);
		this.oFilterBar._handleVisibilityOfToolbar();
		assert.ok(this.oFilterBar._oToolbar.getVisible());

		this.oFilterBar.setAdvancedMode(true);
		this.oFilterBar._oSearchButton.setVisible(false);
		this.oFilterBar._oHideShowButton.setVisible(false);
		this.oFilterBar._handleVisibilityOfToolbar();
		assert.ok(!this.oFilterBar._oToolbar.getVisible());

		var oBasicSearch = new SearchField({
			showSearchButton: false
		});
		this.oFilterBar.setBasicSearch(oBasicSearch);
		this.oFilterBar._handleVisibilityOfToolbar();
		assert.ok(this.oFilterBar._oToolbar.getVisible());

		this.oFilterBar.setBasicSearch(null);
		this.oFilterBar._handleVisibilityOfToolbar();
		assert.ok(!this.oFilterBar._oToolbar.getVisible());

	});

	QUnit.test("checking _mergeVariants", function(assert) {
		var oBase = {
			not: true
		}, oDelta = {
			exec: true
		};
		oBase.filterbar = [
			{
				group: "G0",
				name: "A",
				base: true
			}, {
				group: "G0",
				name: "B",
				base: true
			}, {
				group: "G1",
				name: "A",
				base: true
			}, {
				group: "G1",
				name: "B",
				base: true
			}
		];
		oDelta.filterbar = [
			{
				group: "G0",
				name: "C",
				base: false
			}, {
				group: "G1",
				name: "B",
				base: false
			}
		];

		var oMerge = this.oFilterBar.mergeVariant(oBase, oDelta);
		assert.ok(oMerge);
		assert.equal(oMerge.filterbar.length, 4);
		assert.equal(oMerge.filterbar[0].base, true);
		assert.equal(oMerge.filterbar[1].base, true);
		assert.equal(oMerge.filterbar[2].base, true);
		assert.equal(oMerge.filterbar[3].base, true);

		assert.equal(oMerge.exec, true);
		assert.ok(!oMerge.not);

	});

	QUnit.test("checking _mergeVariants V2", function(assert) {
		var oBase = {}, oDelta = {};
		oBase.filterbar = [
			{
				group: "G0",
				name: "A",
				base: true
			}, {
				group: "G0",
				name: "B",
				base: true
			}, {
				group: "G1",
				name: "A",
				base: true
			}, {
				group: "G1",
				name: "B",
				base: true
			}
		];
		oDelta.filterbar = [
			{
				group: "G0",
				name: "C",
				base: false
			}, {
				group: "G1",
				name: "B",
				base: false
			}
		];
		oDelta.version = "V2";

		var oMerge = this.oFilterBar.mergeVariant(oBase, oDelta);
		assert.ok(oMerge);
		assert.equal(oMerge.filterbar.length, 5);
		assert.equal(oMerge.filterbar[0].name, "A");
		assert.equal(oMerge.filterbar[0].base, true);
		assert.equal(oMerge.filterbar[1].name, "B");
		assert.equal(oMerge.filterbar[1].base, true);
		assert.equal(oMerge.filterbar[2].name, "A");
		assert.equal(oMerge.filterbar[2].base, true);
		assert.equal(oMerge.filterbar[3].name, "C");
		assert.equal(oMerge.filterbar[3].base, false);
		assert.equal(oMerge.filterbar[4].name, "B");
		assert.equal(oMerge.filterbar[4].base, false);
	});

	QUnit.test("checking  _isDeltaHandling", function(assert) {

		sinon.stub(this.oFilterBar, "_isUi2Mode").returns(false);

		assert.ok(this.oFilterBar._isDeltaHandling());

		this.oFilterBar.setDeltaVariantMode(false);

		assert.ok(!this.oFilterBar._isDeltaHandling());

	});

	QUnit.test("checking delta variant handling for applyVariant", function(assert) {

		sinon.stub(this.oFilterBar, "mergeVariant").returns({});
		sinon.stub(this.oFilterBar, "_applyVariant");
		sinon.stub(this.oFilterBar, "_getStandardVariant");

		this.oFilterBar.applyVariant({});
		assert.ok(!this.oFilterBar.mergeVariant.called);

		this.oFilterBar.applyVariant({
			version: "V2"
		});
		assert.ok(this.oFilterBar.mergeVariant.called);
	});

	QUnit.test("checking delta variant handling for fetchVariant", function(assert) {

		sinon.stub(this.oFilterBar, "_determineVariantFiltersInfo").returns([]);
		sinon.stub(this.oFilterBar, "_fetchVariantFiltersData").returns({});
		sinon.stub(this.oFilterBar, "_isUi2Mode").returns(false);
		sinon.stub(this.oFilterBar, "_isStandardVariant").returns(true);

		this.oFilterBar.setDeltaVariantMode(false);
		var oVariantContent = this.oFilterBar.fetchVariant();
		assert.ok(oVariantContent);
		assert.ok(!oVariantContent.version);
		assert.ok(!this.oFilterBar._isStandardVariant.called);

		this.oFilterBar.setDeltaVariantMode(true);
		oVariantContent = this.oFilterBar.fetchVariant();
		assert.ok(oVariantContent);
		assert.ok(!oVariantContent.version);
		assert.ok(this.oFilterBar._isStandardVariant.called);

		this.oFilterBar._isStandardVariant.restore();
		sinon.stub(this.oFilterBar, "_isStandardVariant").returns(false);
		oVariantContent = this.oFilterBar.fetchVariant();
		assert.ok(oVariantContent);
		assert.ok(oVariantContent.version);
		assert.equal(oVariantContent.version, "V3");
		assert.ok(this.oFilterBar._isStandardVariant.called);
	});

	QUnit.test("checking _determineVariantFiltersInfo method", function(assert) {

		sinon.stub(this.oFilterBar, "_isUi2Mode").returns(false);

		var oFilterItem0 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		oFilterItem0.setVisibleInFilterBar(true);
		this.oFilterBar.addFilterGroupItem(oFilterItem0);

		var oFilterItem1 = _createFilterGroupItem("GROUP1", "Group 1", "ITEM2", "Item 2");
		oFilterItem1.setVisibleInFilterBar(true);
		this.oFilterBar.addFilterGroupItem(oFilterItem1);

		var oFilterItem2 = _createFilterGroupItem("GROUP2", "Group 2", "ITEM1", "Item 1");
		oFilterItem2.setVisibleInFilterBar(true);
		this.oFilterBar.addFilterGroupItem(oFilterItem2);

		var oStandardVariant = {
			filterbar: []
		};

		oStandardVariant.filterbar.push({
			group: oFilterItem0.getGroupName(),
			name: oFilterItem0.getName(),
			visibleInFilterBar: oFilterItem0.getVisibleInFilterBar(),
			partOfCurrentVariant: oFilterItem0.getPartOfCurrentVariant(),
			visible: oFilterItem0.getVisible()
		});
		oStandardVariant.filterbar.push({
			group: oFilterItem1.getGroupName(),
			name: oFilterItem1.getName(),
			visibleInFilterBar: oFilterItem1.getVisibleInFilterBar(),
			partOfCurrentVariant: oFilterItem1.getPartOfCurrentVariant(),
			visible: oFilterItem1.getVisible()
		});
		oStandardVariant.filterbar.push({
			group: oFilterItem2.getGroupName(),
			name: oFilterItem2.getName(),
			visibleInFilterBar: oFilterItem2.getVisibleInFilterBar(),
			partOfCurrentVariant: oFilterItem2.getPartOfCurrentVariant(),
			visible: oFilterItem2.getVisible()
		});

		sinon.stub(this.oFilterBar, "_getStandardVariant").returns(oStandardVariant);

		this.oFilterBar.setDeltaVariantMode(true);
		var aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, true);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 3);

		aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, false);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 0);

		oStandardVariant.filterbar[2].partOfCurrentVariant = false;
		aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, false);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 1);

		oStandardVariant.filterbar[1].visibleInFilterBar = false;
		aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, false);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 2);

		this.oFilterBar.setDeltaVariantMode(false);
		aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, false);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 3);

		oFilterItem0.setVisibleInFilterBar(true);
		oFilterItem0.setPartOfCurrentVariant(true);
		oFilterItem1.setVisibleInFilterBar(true);
		oFilterItem1.setPartOfCurrentVariant(true);
		oFilterItem2.setVisibleInFilterBar(true);
		oFilterItem2.setPartOfCurrentVariant(true);

		oStandardVariant.filterbar[0].partOfCurrentVariant = oFilterItem0.getPartOfCurrentVariant();
		oStandardVariant.filterbar[1].partOfCurrentVariant = oFilterItem1.getPartOfCurrentVariant();
		oStandardVariant.filterbar[2].partOfCurrentVariant = oFilterItem2.getPartOfCurrentVariant();

		oStandardVariant.filterbar[0].visibleInFilterBar = oFilterItem0.getVisibleInFilterBar();
		oStandardVariant.filterbar[1].visibleInFilterBar = oFilterItem1.getVisibleInFilterBar();
		oStandardVariant.filterbar[2].visibleInFilterBar = oFilterItem2.getVisibleInFilterBar();

		oFilterItem2.setVisible(false);

		this.oFilterBar.setDeltaVariantMode(true);
		aVisibleFilters = this.oFilterBar._determineVariantFiltersInfo(true, false);
		assert.ok(aVisibleFilters);
		assert.ok(aVisibleFilters.length === 1);
	});

	QUnit.test("checking _setCollectiveSearch  method", function(assert) {

		this.oFilterBar.setAdvancedMode(true);

		assert.ok(this.oFilterBar._oVariantManagement);
		assert.ok(!this.oFilterBar._oCollectiveSearch);

		var oCollectiveSearch = new Control();
		this.oFilterBar._setCollectiveSearch(oCollectiveSearch);

		assert.ok(!this.oFilterBar._oVariantManagement);
		assert.ok(this.oFilterBar._oCollectiveSearch);
		assert.equal(this.oFilterBar._oCollectiveSearch, oCollectiveSearch);
	});
	QUnit.test("checking _isStandardVariant  method", function(assert) {

		assert.ok(this.oFilterBar._isStandardVariant());

		sinon.stub(this.oFilterBar, "getCurrentVariantId").returns("2");

		assert.ok(this.oFilterBar._isStandardVariant());

		this.oFilterBar._oVariantManagement._oStandardVariant = {};
		assert.ok(!this.oFilterBar._isStandardVariant());

		sinon.stub(this.oFilterBar._oVariantManagement, "getStandardVariantKey").returns("2");

		assert.ok(this.oFilterBar._isStandardVariant());
	});

	QUnit.test("checking _showHintText  method", function(assert) {

		assert.ok(!this.oFilterBar._oHintText.getVisible());
		assert.ok(!this.oFilterBar._oAdvancedPanel.getVisible());
		assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) < 0);

		this.oFilterBar._fireInitialiseEvent();
		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHintText.getVisible());
			assert.ok(!this.oFilterBar._oAdvancedPanel.getVisible());
			assert.ok(!this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
		} else {
			assert.ok(this.oFilterBar._oHintText.getVisible());
			assert.ok(this.oFilterBar._oAdvancedPanel.getVisible());
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
		}

		var oFilterItem = _createFilterItem("ITEM0", "Item X");
		this.oFilterBar.addFilterItem(oFilterItem);

		assert.ok(!this.oFilterBar._oHintText.getVisible());
		assert.ok(!this.oFilterBar._oAdvancedPanel.getVisible());

		oFilterItem.setVisibleInFilterBar(false);
		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHintText.getVisible());
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) === -1);
		} else {
			assert.ok(this.oFilterBar._oHintText.getVisible());
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
		}

		oFilterItem.setVisibleInFilterBar(true);
		assert.ok(!this.oFilterBar._oHintText.getVisible());

		if (this.oFilterBar._isPhone()) {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) === -1);
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
		} else {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
			if (this.oFilterBar._isTablet()) {
				assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
			} else {
				assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
			}
		}

		this.oFilterBar.setFilterBarExpanded(false);
		assert.ok(!this.oFilterBar._oHintText.getVisible());
		if (this.oFilterBar._isPhone()) {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) === -1);
		} else {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
		}
		assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());

		this.oFilterBar.setFilterBarExpanded(true);
		assert.ok(!this.oFilterBar._oHintText.getVisible());

		if (this.oFilterBar._isPhone()) {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) === -1);
			assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
		} else {
			assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
			assert.ok(this.oFilterBar._oBasicAreaLayout.getVisible());
		}

		var fnDone = assert.async();
		var oStub = sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			oFilterItem.setVisibleInFilterBar(false);
			if (this.oFilterBar._isPhone()) {
				assert.ok(!this.oFilterBar._oHintText.getVisible());
				assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.ok(!this.oFilterBar._oAdvancedPanel.getVisible());
			} else {
				assert.ok(this.oFilterBar._oHintText.getVisible());
				assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
				assert.ok(!this.oFilterBar._oBasicAreaLayout.getVisible());
				assert.ok(this.oFilterBar._oAdvancedPanel.getVisible());
			}

			this.oFilterBar._oFilterDialog.close();
			if (this.oFilterBar._isPhone()) {
				assert.ok(!this.oFilterBar._oHintText.getVisible());
			} else {
				assert.ok(this.oFilterBar._oHintText.getVisible());
				assert.ok(this.oFilterBar._oAdvancedPanel.indexOfContent(this.oFilterBar._oHintText) > -1);
			}

			oStub.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("checking _createVisibleFilters method", function(assert) {

		var aFields = [];
		var iLen = this.oFilterBar._oBasicAreaLayout.getContent().length;

		var oField0 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field0",
			visible: true,
			control: new Control()
		};

		aFields.push(_createFieldInBasicArea(this.oFilterBar, oField0));

		var oField1 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field1",
			visible: true,
			visibleInAdvancedArea: false,
			control: new Control()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField1));

		var oField2 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field2",
			visible: true,
			visibleInAdvancedArea: true,
			control: new Control()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField2));

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);

		this.oFilterBar._createVisibleFilters();

		assert.equal(this.oFilterBar._oBasicAreaLayout.getContent().length - iLen, 2);

		var oFilterItem = this.oFilterBar.determineFilterItemByName("field2");
		assert.equal(oField2.control.getTooltip(), oFilterItem.getControlTooltip());
		assert.equal(oFilterItem.getLabelControl("test").getTooltip(), oFilterItem.getLabelTooltip());
	});

	QUnit.test("checking destroy method with lazy load", function(assert) {

		this.oFilterBar._oVariantManagement.destroy();
		this.oFilterBar._oVariantManagement = null;

		var oSpy = sinon.spy(Input.prototype, "destroy");

		var aFields = [];

		var oField0 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field0",
			visible: true,
			control: new Input()
		};

		aFields.push(_createFieldInBasicArea(this.oFilterBar, oField0));

		var oField1 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field1",
			visible: true,
			visibleInAdvancedArea: false,
			control: new Input()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField1));

		var oField2 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field2",
			visible: true,
			visibleInAdvancedArea: true,
			control: new Input()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField2));

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);

		this.oFilterBar._createVisibleFilters();

		this.oFilterBar.destroy();

		assert.ok(oSpy.calledThrice);
		oSpy.restore();

	});

	QUnit.test("checking destroy method with non visible filters", function(assert) {

		this.oFilterBar._oVariantManagement.destroy();
		this.oFilterBar._oVariantManagement = null;

		var oSpy = sinon.spy(Input.prototype, "destroy");

		var aFields = [];

		var oField0 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field0",
			visible: true,
			control: new Input()
		};

		aFields.push(_createFieldInBasicArea(this.oFilterBar, oField0));

		var oField1 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field1",
			visible: true,
			visibleInAdvancedArea: false,
			control: new Input()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField1));

		var oField2 = {
			quickInfo: "tooltip",
			label: "label",
			name: "field2",
			visible: true,
			visibleInAdvancedArea: true,
			control: new Input()
		};

		aFields.push(_createFieldInAdvancedArea(this.oFilterBar, "group", "title", oField2));

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);

		this.oFilterBar._createVisibleFilters();
		this.oFilterBar._ensureFilterLoaded(null);

		this.oFilterBar.destroy();

		assert.ok(oSpy.calledThrice);
		oSpy.restore();

	});

	QUnit.test("checking toolbar with content", function(assert) {

		var aContent = this.oFilterBar._oToolbar.getContent();

		this.oFilterBar._bHostedVariantManagement = true;
		this.oFilterBar.setHeader("Header");

		var aContentWithHeaderAndSeparator = this.oFilterBar._oToolbar.getContent();
		assert.equal(aContentWithHeaderAndSeparator.length, aContent.length + 2);

		var oSearchField = new SearchField();
		this.oFilterBar.setBasicSearch(oSearchField);

		aContent = this.oFilterBar._oToolbar.getContent();

		if (this.oFilterBar._isPhone()) {
			assert.equal(aContent.length, aContentWithHeaderAndSeparator.length);
		} else {
			assert.equal(aContent.length, aContentWithHeaderAndSeparator.length + 1);
		}

	});

	QUnit.test("checking _replaceVariantManagement", function(assert) {

		sinon.stub(this.oFilterBar, "_unregisterVariantManagement");
		sinon.stub(this.oFilterBar, "_registerVariantManagement");
		sinon.stub(this.oFilterBar, "_adaptNewFilterBarDesign");

		var oVM = new sinon.stub();
		this.oFilterBar._replaceVariantManagement(oVM);

		assert.ok(this.oFilterBar._unregisterVariantManagement.calledOnce);
		assert.ok(this.oFilterBar._registerVariantManagement.calledOnce);
		assert.ok(this.oFilterBar._adaptNewFilterBarDesign.calledOnce);
		assert.strictEqual(this.oFilterBar._oVariantManagement, oVM);
	});

	QUnit.test("checking _adaptNewFilterBarDesign", function(assert) {

		sinon.stub(this.oFilterBar, "_isNewFilterBarDesign").returns(true);

		assert.ok(this.oFilterBar._oToolbar);
		assert.ok(this.oFilterBar._oHintText);

		this.oFilterBar.setUseToolbar(true);
		this.oFilterBar._adaptNewFilterBarDesign();
		assert.ok(this.oFilterBar._oToolbar);
		assert.ok(!this.oFilterBar._oHintText);
		assert.equal(this.oFilterBar._oToolbar.getContent().length, 0);

		this.oFilterBar.setUseToolbar(false);
		this.oFilterBar._adaptNewFilterBarDesign();
		assert.ok(!this.oFilterBar._oToolbar);
	});

	QUnit.test("checking applySettings", function(assert) {

		var mSettings = {
			customData: []
		};

		mSettings.customData.push(new CustomData({
			key: "pageVariantPersistencyKey",
			value: "4711"
		}));

		this.oFilterBar._oVariantManagement.setPersistencyKey = new sinon.stub();
		sinon.stub(this.oFilterBar, "_possibleToChangeVariantManagement").returns(true);

		this.oFilterBar.applySettings(mSettings);

		assert.ok(this.oFilterBar._bHostedVariantManagement);

	});

	QUnit.test("checking _setFilterVisibility method", function(assert) {

		var oStandardVariant = {
			filterbar: [
				{
					group: "__$INTERNAL$",
					name: "ITEM4",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "__$INTERNAL$",
					name: "ITEM5",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "GROUP1",
					name: "ITEM1.1",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "GROUP1",
					name: "ITEM1.2",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "GROUP2",
					name: "ITEM2.1",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "GROUP2",
					name: "ITEM2.2",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}, {
					group: "GROUP3",
					name: "ITEM3.1",
					partOfCurrentVariant: true,
					visibleInFilterBar: true
				}
			],
			filterBarVariant: {}
		};

		var oVariant = {
			version: "V2",
			filterbar: [
				{
					group: "__$INTERNAL$",
					name: "ITEM4",
					partOfCurrentVariant: false,
					visibleInFilterBar: false
				}
			],
			filterBarVariant: {}
		};

		sinon.stub(this.oFilterBar._oVariantManagement, "getSelectionKey").returns("");
		sinon.stub(this.oFilterBar._oVariantManagement, "getVariantContent").returns(oVariant);
		sinon.stub(this.oFilterBar, "_getStandardVariant").returns(oStandardVariant);

		this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEM1.1", "Item 1"));
		this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEM1.2", "Item 2"));
		this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP2", "Group 2", "ITEM2.1", "Item 3"));
		this.oFilterBar.addFilterItem(_createFilterItem("ITEM4", "Item 4"));

		assert.ok(this.oFilterBar.determineFilterItemByName("ITEM4").getVisibleInFilterBar());
		assert.ok(!this.oFilterBar.determineFilterItemByName("ITEM1.1").getVisibleInFilterBar());
		assert.ok(!this.oFilterBar.determineFilterItemByName("ITEM1.2").getVisibleInFilterBar());
		assert.ok(!this.oFilterBar.determineFilterItemByName("ITEM2.1").getVisibleInFilterBar());

		this.oFilterBar._setFilterVisibility("HUGO");

		assert.ok(!this.oFilterBar.determineFilterItemByName("ITEM4").getVisibleInFilterBar());
		assert.ok(this.oFilterBar.determineFilterItemByName("ITEM1.1").getVisibleInFilterBar());
		assert.ok(this.oFilterBar.determineFilterItemByName("ITEM1.2").getVisibleInFilterBar());
		assert.ok(this.oFilterBar.determineFilterItemByName("ITEM2.1").getVisibleInFilterBar());
	});

	QUnit.test("checking _initialiseVariants method", function(assert) {

		this.oFilterBar._oVariantManagement.currentVariantSetModified(true);

		assert.ok(this.oFilterBar._oVariantManagement.currentVariantGetModified());

		this.oFilterBar._initialiseVariants();

		assert.ok(!this.oFilterBar._oVariantManagement.currentVariantGetModified());
	});

	QUnit.test("checking _ensureFilterLoaded method with filters", function(assert) {

		sinon.spy(this.oFilterBar, "_instanciateFilterItem");

		this.oFilterBar._aFields = [
			{
				fieldName: "F1.1",
				groupName: "G1",
				groupEntityType: "G1Type",
				factory: function() {
				}
			}, {
				fieldName: "F1.2",
				groupName: "G1",
				groupEntityType: "G1Type",
				factory: function() {
				}
			}, {
				fieldName: "F1.3",
				groupName: "G1",
				groupEntityType: "G1Type",
				factory: function() {
				}
			}, {
				fieldName: "F2.1",
				groupName: "G2",
				groupEntityType: "G2Type",
				factory: function() {
				}
			}
		];

		this.oFilterBar._ensureFilterLoaded([
			{
				name: "F1.2",
				group: "G1"
			}, {
				name: "F2.1",
				group: "G2"
			}
		]);

		assert.ok(this.oFilterBar._instanciateFilterItem.calledTwice);

		this.oFilterBar._instanciateFilterItem.reset();

		this.oFilterBar._ensureFilterLoaded([
			{
				name: "F1.3",
				group: "G1Type"
			}
		]);

		assert.ok(this.oFilterBar._instanciateFilterItem.calledOnce);
	});

	QUnit.test("checking setUseToolbar", function(assert) {

		sinon.stub(this.oFilterBar, "_adaptNewFilterBarDesign");

		this.oFilterBar.setUseToolbar(false);

		assert.ok(this.oFilterBar._adaptNewFilterBarDesign.called);
	});

	QUnit.test("checking retrieveFiltersWithValuesAsText", function(assert) {

		sinon.stub(this.oFilterBar, "_isPhone").returns(false);

		sinon.stub(this.oFilterBar, "retrieveFiltersWithValues").returns(null);

		var oStub = sinon.stub(this.oFilterBar._oRb, "getText");
		oStub.withArgs("FILTER_BAR_ASSIGNED_FILTERS_ZERO").returns("OK");
		oStub.withArgs("FILTER_BAR_ASSIGNED_FILTERS").returns("OK2");
		oStub.withArgs("FILTER_BAR_ASSIGNED_FILTERS_MOBILE").returns("OK3");

		var sText = this.oFilterBar.retrieveFiltersWithValuesAsText();
		assert.equal(sText, "OK");

		this.oFilterBar.retrieveFiltersWithValues.restore();
		sinon.stub(this.oFilterBar, "retrieveFiltersWithValues").returns([
			"A", "B"
		]);
		sText = this.oFilterBar.retrieveFiltersWithValuesAsText();
		assert.equal(sText, "OK2");

		this.oFilterBar.retrieveFiltersWithValues.restore();
		sinon.stub(this.oFilterBar, "retrieveFiltersWithValues").returns([
			"A", "B", "C", "D", "E", "F"
		]);
		sText = this.oFilterBar.retrieveFiltersWithValuesAsText();
		assert.equal(sText, "OK2, ...");

		this.oFilterBar._isPhone.restore();
		sinon.stub(this.oFilterBar, "_isPhone").returns(true);

		sText = this.oFilterBar.retrieveFiltersWithValuesAsText();
		assert.equal(sText, "OK3");

	});

	QUnit.test("checking _rerenderAA ", function(assert) {

		this.oFilterBar.setAdvancedMode(true);
		var fnDone = assert.async();
		sap.ui.require([
			"sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout"
		], function() {
			this.oFilterBar.addFilterItem(_createFilterItem("ITEM4", "Item 4"));

			sinon.spy(this.oFilterBar, "_layOutAASingleGroup");
			sinon.spy(this.oFilterBar, "_layOutAAMultipleGroup");

			this.oFilterBar._rerenderAA();
			assert.ok(this.oFilterBar._layOutAASingleGroup.called);
			assert.ok(this.oFilterBar._layOutAAMultipleGroup.called);

			this.oFilterBar._layOutAASingleGroup.reset();
			this.oFilterBar._layOutAAMultipleGroup.reset();

			this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEM1.1", "Item 1"));

			assert.ok(!this.oFilterBar._layOutAASingleGroup.called);
			assert.ok(this.oFilterBar._layOutAAMultipleGroup.called);
			fnDone();
		}.bind(this));
	});

	QUnit.test("checking showFilterConfiguration property ", function(assert) {

		assert.ok(this.oFilterBar._oFiltersButton.getVisible());

		this.oFilterBar.setShowFilterConfiguration(false);
		assert.ok(!this.oFilterBar.getShowFilterConfiguration());

		if (this.oFilterBar._isPhone()) {
			assert.ok(this.oFilterBar._oFiltersButton.getVisible());
		} else {
			assert.ok(!this.oFilterBar._oFiltersButton.getVisible());
		}

		this.oFilterBar.setShowFilterConfiguration(true);
		assert.ok(this.oFilterBar.getShowFilterConfiguration());

	});

	QUnit.test("checking showFilterConfiguration property and _createFilters method", function(assert) {

		var fnDone = assert.async();
		// just to load the Form and Layout
		this.oFilterBar._showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			this.oFilterBar._oFilterDialog.attachAfterClose(function() {
				var oToolbar;
				this.oFilterBar.addFilterItem(_createFilterItem("ITEM0", "Item 0"));
				this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEM1.1", "Item 1.1"));
				var oFilterItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1.2", "Item 1.2");
				this.oFilterBar.addFilterGroupItem(oFilterItem);

				var oForm = this.oFilterBar._createFilters();
				assert.ok(oForm);

				// //aFormContainer[0] contains the variant management control
				var aFormContainer = oForm.getFormContainers();
				assert.ok(aFormContainer);
				assert.equal(aFormContainer.length, 3);

				var aFormElements = aFormContainer[1].getFormElements();
				assert.ok(aFormElements);
				if (this.oFilterBar._isPhone()) {
					assert.equal(aFormElements.length, 1);
				} else {
					assert.equal(aFormElements.length, 1); // + AddToFilterBar title
					oToolbar = aFormContainer[1].getToolbar();
					assert.ok(oToolbar, "FormContainer has Toolbar");
					assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
					assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
					assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");
				}

				aFormElements = aFormContainer[2].getFormElements();
				assert.ok(aFormElements);
				assert.equal(aFormElements.length, 3); // + More Link

				this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
				oForm.destroy();

				this.oFilterBar.setShowFilterConfiguration(false);

				oForm = this.oFilterBar._createFilters();
				assert.ok(oForm);

				// //aFormContainer[0] contains the variant management control
				aFormContainer = oForm.getFormContainers();
				assert.ok(aFormContainer);
				assert.equal(aFormContainer.length, 3);

				aFormElements = aFormContainer[1].getFormElements();
				if (this.oFilterBar._isPhone()) {
					assert.equal(aFormElements.length, 1);
				} else {
					assert.equal(aFormElements.length, 1); // + AddToFilterBar title
					oToolbar = aFormContainer[1].getToolbar();
					assert.ok(oToolbar, "FormContainer has Toolbar");
					assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
					assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
					assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");
				}
				aFormElements = aFormContainer[2].getFormElements();
				assert.ok(aFormElements);
				assert.equal(aFormElements.length, 3);
				assert.ok(!aFormElements[0].getVisible()); // Item1.1
				assert.ok(!aFormElements[1].getVisible()); // Item1.2
				assert.ok(aFormElements[2].getVisible()); // More Link

				this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
				oForm.destroy();

				oFilterItem.setPartOfCurrentVariant(true);
				oForm = this.oFilterBar._createFilters();
				assert.ok(oForm);

				// //aFormContainer[0] contains the variant management control
				aFormContainer = oForm.getFormContainers();
				assert.ok(aFormContainer);
				assert.equal(aFormContainer.length, 3);

				aFormElements = aFormContainer[1].getFormElements();
				if (this.oFilterBar._isPhone()) {
					assert.equal(aFormElements.length, 1);
				} else {
					assert.equal(aFormElements.length, 1); // + AddToFilterBar title
					oToolbar = aFormContainer[1].getToolbar();
					assert.ok(oToolbar, "FormContainer has Toolbar");
					assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
					assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
					assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");
				}

				aFormElements = aFormContainer[2].getFormElements();
				assert.ok(aFormElements);
				assert.equal(aFormElements.length, 3);
				assert.ok(!aFormElements[0].getVisible()); // Item1.1
				assert.ok(aFormElements[1].getVisible()); // Item1.2
				assert.ok(aFormElements[2].getVisible()); // More Link

				this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
				oForm.destroy();

				oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1.1");
				assert.ok(oFilterItem);
				oFilterItem.setPartOfCurrentVariant(true);

				oForm = this.oFilterBar._createFilters();
				assert.ok(oForm);

				aFormContainer = oForm.getFormContainers();
				assert.ok(aFormContainer);

				aFormElements = aFormContainer[1].getFormElements();
				if (this.oFilterBar._isPhone()) {
					assert.equal(aFormElements.length, 1);
				} else {
					assert.equal(aFormElements.length, 1); // + AddToFilterBar title
					oToolbar = aFormContainer[1].getToolbar();
					assert.ok(oToolbar, "FormContainer has Toolbar");
					assert.equal(oToolbar.getContent().length, 3, "Toolbar has 3 items");
					assert.ok(oToolbar.getContent()[0].isA("sap.m.Title"), "Toolbar first item is Title");
					assert.ok(oToolbar.getContent()[2].isA("sap.m.Label"), "Toolbar first item is Label");
				}

				aFormElements = aFormContainer[2].getFormElements();
				assert.ok(aFormElements);
				assert.equal(aFormElements.length, 3);
				assert.ok(aFormElements[0].getVisible()); // Item1.1
				assert.ok(aFormElements[1].getVisible()); // Item1.2
				assert.ok(aFormElements[2].getVisible()); // Change Filters link

				this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);
				oForm.destroy();
				fnDone();
			}.bind(this));

			this.oFilterBar._oFilterDialog.close();
		}.bind(this));
	});

	QUnit.test("checking clearVariantSelection method", function(assert) {
		sinon.spy(this.oFilterBar._oVariantManagement, "clearVariantSelection");
		this.oFilterBar.clearVariantSelection();
		assert.ok(this.oFilterBar._oVariantManagement.clearVariantSelection.called);
	});

	QUnit.test("checking _addBasicSearchToBasicArea  method", function(assert) {
		sinon.spy(this.oFilterBar._oVariantManagement, "clearVariantSelection");
		this.oFilterBar._addBasicSearchToBasicArea(new SearchField());
		assert.ok(this.oFilterBar._oBasicSearchFieldContainer);

		this.oFilterBar._addBasicSearchToBasicArea(new SearchField());
		assert.ok(this.oFilterBar._oBasicSearchFieldContainer);
	});

	QUnit.test("Checking do not addFilters to basic area, when filters dialog is open", function(assert) {
		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		var aContent = this.oFilterBar._oBasicAreaLayout.getContent();
		assert.ok(aContent);

		sinon.stub(Dialog.prototype, "open");
		this.oFilterBar._showFilterDialog();
		var fnDone = assert.async();
		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			assert.ok(this.oFilterBar._oFilterDialog);
			assert.ok(this.oFilterBar._oFilterDialog.bDoNotAddToBasicArea);

			var aDialogContent = this.oFilterBar._oFilterDialog.getContent();
			assert.ok(aDialogContent);
			assert.equal(aDialogContent.length, 1);
			var oForm = aDialogContent[0];
			assert.ok(oForm);

			oFilterItem = _createFilterItem("ITEM2", "Item 2");
			this.oFilterBar.addFilterItem(oFilterItem);

			// simulate attachBeforeClose
			delete this.oFilterBar._oFilterDialog.bDoNotAddToBasicArea;
			assert.ok(!this.oFilterBar._oFilterDialog.bDoNotAddToBasicArea);

			this.oFilterBar._closeDialogAndRestoreFilterBar(oForm);

			var aContentNew = this.oFilterBar._oBasicAreaLayout.getContent();
			assert.ok(aContentNew);
			assert.ok(aContent.length + 1, aContentNew.length);

			Dialog.prototype.open.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("checking hideGoButton method", function(assert) {

		assert.ok(this.oFilterBar._oSearchButton.getVisible());
		this.oFilterBar.hideGoButton();
		assert.ok(!this.oFilterBar._oSearchButton.getVisible());

	});

	QUnit.test("checking restoreGoButton method", function(assert) {

		this.oFilterBar._oSearchButton.setVisible(false);
		this.oFilterBar.restoreGoButton();
		assert.ok(this.oFilterBar._oSearchButton.getVisible());

		this.oFilterBar._oSearchButton.setVisible(false);
		this.oFilterBar.setShowGoOnFB(false);
		this.oFilterBar.restoreGoButton();
		assert.ok(!this.oFilterBar._oSearchButton.getVisible());

	});

	QUnit.test("checking _addParameter method", function(assert) {

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem1);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);

		var oBeforeParam = this.oFilterBar._oBasicAreaLayout.getContent();
		assert.ok(oBeforeParam);

		var oParam = _createFilterGroupItem(this.oFilterBar.INTERNAL_GROUP, "", "PARAM1", "Param 1");
		this.oFilterBar._addParameter(oParam);

		var sBasicGroup = FilterBar.INTERNAL_GROUP;

		assert.ok(this.oFilterBar._mAdvancedAreaFilter[sBasicGroup]);
		assert.equal(this.oFilterBar._mAdvancedAreaFilter[sBasicGroup].items.length, 3);
		assert.equal(this.oFilterBar._mAdvancedAreaFilter[sBasicGroup].items[0].filterItem, oParam);
		assert.equal(this.oFilterBar._mAdvancedAreaFilter[sBasicGroup].items[1].filterItem.getName(), oFilterItem1.getName());
		assert.equal(this.oFilterBar._mAdvancedAreaFilter[sBasicGroup].items[2].filterItem.getName(), oFilterItem2.getName());

		var oAfterParam = this.oFilterBar._oBasicAreaLayout.getContent();
		assert.ok(oAfterParam);
		assert.equal(oAfterParam.length, oBeforeParam.length + 1);

		assert.equal(oAfterParam[1], oBeforeParam[0]);
		assert.equal(oAfterParam[2], oBeforeParam[1]);

	});

	QUnit.test("checking hidden filters", function(assert) {

		var aLen = this.oFilterBar._oBasicAreaLayout.getContent().length;

		var oFilterItem1 = _createFilterItem("ITEM1", "Item 1");
		oFilterItem1.setHiddenFilter(true);
		this.oFilterBar.addFilterItem(oFilterItem1);
		assert.equal(aLen, this.oFilterBar._oBasicAreaLayout.getContent().length);

		var oFilterItem2 = _createFilterItem("ITEM2", "Item 2");
		this.oFilterBar.addFilterItem(oFilterItem2);
		assert.equal(aLen + 1, this.oFilterBar._oBasicAreaLayout.getContent().length);

		var aFilters = this.oFilterBar.getFilterItems();
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);

		assert.ok(aFilters[0].getHiddenFilter());
		assert.ok(!aFilters[1].getHiddenFilter());
	});

	QUnit.test("XCheck if all properties are declared in design time file", function(assert) {
		var mProperties = this.oFilterBar.getMetadata()._mProperties;
		assert.ok(mProperties);

		var done = assert.async();

		this.oFilterBar.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
			var aProperties = Object.keys(mProperties);
			assert.equal(Object.keys(oDesignTimeMetadata.properties).length, aProperties.length);

			aProperties.forEach(function(element) {
				assert.ok(oDesignTimeMetadata.properties[element]);
			});

			done();
		});
	});

	QUnit.test("ShowHide button visibility with no filters", function(assert) {

		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		} else {
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
		}
		assert.ok(!this.oFilterBar._oHideShowButton.getEnabled());

		this.oFilterBar.setAdvancedMode(true);
		assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		assert.ok(!this.oFilterBar._oHideShowButton.getEnabled());

	});

	QUnit.test("ShowHide button visibility with filters", function(assert) {

		this.oFilterBar.addFilterItem(_createFilterItem("ITEM1", "Item 1"));

		var oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM1");
		assert.ok(oFilterItem);

		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		} else {
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
		}
		assert.ok(this.oFilterBar._oHideShowButton.getEnabled());

		this.oFilterBar.setAdvancedMode(true);
		if (this.oFilterBar._isPhone()) {
			assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		} else {
			assert.ok(this.oFilterBar._oHideShowButton.getVisible());
		}
		assert.ok(this.oFilterBar._oHideShowButton.getEnabled());

		oFilterItem.setVisible(false);
		this.oFilterBar.setAdvancedMode(true);
		assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		assert.ok(this.oFilterBar._oHideShowButton.getEnabled());

		oFilterItem.setVisible(true);
		oFilterItem.setHiddenFilter(true);
		this.oFilterBar.setAdvancedMode(true);
		assert.ok(!this.oFilterBar._oHideShowButton.getVisible());
		assert.ok(this.oFilterBar._oHideShowButton.getEnabled());

	});

	QUnit.test("check isCurrentVariantStandard", function(assert) {

		assert.ok(this.oFilterBar.isCurrentVariantStandard());

		sinon.stub(this.oFilterBar._oVariantManagement, "_getSelectedItem").returns({
			getKey: function() {
				return "HUGO";
			}
		});
		this.oFilterBar._oVariantManagement._setSelectionByKey("HUGO");
		assert.ok(!this.oFilterBar.isCurrentVariantStandard());

		this.oFilterBar._oVariantManagement.setStandardVariantKey("HUGO");
		assert.ok(this.oFilterBar.isCurrentVariantStandard());
	});

	QUnit.test("check public api showFilterDialog", function(assert) {

		var oFilterItem = _createFilterItem("ITEM1", "Item 1");
		this.oFilterBar.addFilterItem(oFilterItem);

		var oFilterGroupItem = _createFilterGroupItem("GROUP1", "Group 1", "ITEM1", "Item 1");
		this.oFilterBar.addFilterGroupItem(oFilterGroupItem);

		sinon.spy(this.oFilterBar, "_showFilterDialog");

		sinon.stub(Dialog.prototype, "open");

		var fnDone = assert.async();
		this.oFilterBar.showFilterDialog();

		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {

			assert.ok(this.oFilterBar._oFilterDialog);
// assert.ok(this.oFilterBar._showFilterDialog.calledOnce);

			this.oFilterBar._showFilterDialog.restore();
			sinon.spy(this.oFilterBar, "_showFilterDialog");
			this.oFilterBar.showFilterDialog();
			assert.ok(!this.oFilterBar._showFilterDialog.calledOnce);

			this.oFilterBar._showFilterDialog.restore();
			Dialog.prototype.open.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("check getNonVisibleCustomFilterNames/isVisibleInFilterBarByName, lazy", function(assert) {

		var aResults, aFields, oFilterBar = this.oFilterBar;

		var fCreateAnalyticParameter = function(sGroupName, sGroupLabel, oField) {
			oField.factory = function() {
				var oFilterItem = new FilterGroupItem({
					label: oField.label,
					name: oField.fieldName,
					groupName: sGroupName,
					groupTitle: sGroupLabel,
					mandatory: oField.isMandatory,
					visible: oField.isVisible,
					visibleInAdvancedArea: oField.visibleInAdvancedArea,
					control: new Input(),
					hiddenFilter: oField.hiddenFilter
				});
				if (oField.isCustomFilterField) {
					oFilterItem.data("isCustomField", true);
				}
				if (sGroupName === "__$INTERNAL$") {
					oFilterBar.addFilterItem(oFilterItem);
				} else {
					oFilterBar.addFilterGroupItem(oFilterItem);
				}
			};

			// FilterBar needs this information
			oField.groupName = sGroupName;
			oField.groupTitle = sGroupLabel;

			return oField;
		};

		aFields = [
			fCreateAnalyticParameter("G1", "LabelG1", {
				label: "Label A",
				fieldName: "A",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: false,
				hiddenFilter: false
			}), fCreateAnalyticParameter("__$INTERNAL$", "", {
				label: "Label I",
				fieldName: "I1",
				isMandatory: false,
				isVisible: true,
				hiddenFilter: false
			}), fCreateAnalyticParameter("G1", "LabelG1", {
				label: "Label B",
				fieldName: "B",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: true,
				hiddenFilter: false
			}), fCreateAnalyticParameter("G2", "LabelG2", {
				label: "Label C",
				fieldName: "C",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: false,
				hiddenFilter: false,
				isCustomFilterField: true
			})

		];

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);
		this.oFilterBar._getFilters();

		sinon.spy(this.oFilterBar, "_getNonVisibleCustomFilterNames");
		sinon.spy(this.oFilterBar, "_getLazyNonVisibleCustomFilterNames");

		this.oFilterBar._fireInitialiseEvent();
		aResults = this.oFilterBar.getNonVisibleCustomFilterNames();
		assert.ok(aResults);
		assert.equal(aResults.length, 1);
		assert.equal(aResults[0], "C");

		assert.ok(!this.oFilterBar._getNonVisibleCustomFilterNames.called);
		assert.ok(this.oFilterBar._getLazyNonVisibleCustomFilterNames.called);

		assert.ok(!this.oFilterBar.isVisibleInFilterBarByName(aResults[0]));
		assert.ok(!this.oFilterBar.isVisibleInFilterBarByName("A"));
		assert.ok(this.oFilterBar.isVisibleInFilterBarByName("B"));
		assert.ok(this.oFilterBar.isVisibleInFilterBarByName("I1"));

	});

	QUnit.test("check getNonVisibleCustomFilterNames/isVisibleInFilterBarByName, non lazy", function(assert) {

		var aResults, aFields, oFilterBar = this.oFilterBar;

		var fCreateAnalyticParameter = function(sGroupName, sGroupLabel, oField) {
			oField.factory = function() {
				var oFilterItem = new FilterGroupItem({
					label: oField.label,
					name: oField.fieldName,
					groupName: sGroupName,
					groupTitle: sGroupLabel,
					mandatory: oField.isMandatory,
					visible: oField.isVisible,
					visibleInAdvancedArea: oField.visibleInAdvancedArea,
					control: new Input(),
					hiddenFilter: oField.hiddenFilter
				});
				if (oField.isCustomFilterField) {
					oFilterItem.data("isCustomField", true);
				}
				if (sGroupName === "__$INTERNAL$") {
					oFilterBar.addFilterItem(oFilterItem);
				} else {
					oFilterBar.addFilterGroupItem(oFilterItem);
				}
			};

			// FilterBar needs this information
			oField.groupName = sGroupName;
			oField.groupTitle = sGroupLabel;

			return oField;
		};

		aFields = [
			fCreateAnalyticParameter("G1", "LabelG1", {
				label: "Label A",
				fieldName: "A",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: false,
				hiddenFilter: false
			}), fCreateAnalyticParameter("__$INTERNAL$", "", {
				label: "Label I",
				fieldName: "I1",
				isMandatory: false,
				isVisible: true,
				hiddenFilter: false
			}), fCreateAnalyticParameter("G1", "LabelG1", {
				label: "Label B",
				fieldName: "B",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: true,
				hiddenFilter: false
			}), fCreateAnalyticParameter("G2", "LabelG2", {
				label: "Label C",
				fieldName: "C",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: false,
				hiddenFilter: false,
				isCustomFilterField: true
			})

		];

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);
		this.oFilterBar._getFilters();

		this.oFilterBar._ensureFilterLoaded(null);

		sinon.spy(this.oFilterBar, "_getNonVisibleCustomFilterNames");
		sinon.spy(this.oFilterBar, "_getLazyNonVisibleCustomFilterNames");

		this.oFilterBar._fireInitialiseEvent();
		aResults = this.oFilterBar.getNonVisibleCustomFilterNames();
		assert.ok(aResults);
		assert.equal(aResults.length, 1);
		assert.equal(aResults[0], "C");

		assert.ok(this.oFilterBar._getNonVisibleCustomFilterNames.called);
		assert.ok(!this.oFilterBar._getLazyNonVisibleCustomFilterNames.called);

		assert.ok(!this.oFilterBar.isVisibleInFilterBarByName(aResults[0]));
		assert.ok(!this.oFilterBar.isVisibleInFilterBarByName("A"));
		assert.ok(this.oFilterBar.isVisibleInFilterBarByName("B"));
		assert.ok(this.oFilterBar.isVisibleInFilterBarByName("I1"));

	});

	QUnit.test("getAllFilterItems with hiddenFilters", function(assert) {

		this.oFilterBar.addFilterItem(_createFilterItem("ITEM1", "Item 1"));
		this.oFilterBar.addFilterItem(_createFilterItem("ITEM2", "Item 2"));

		var oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM2");
		assert.ok(oFilterItem);
		oFilterItem.setHiddenFilter(true);

		this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEMG1", "Item G1"));
		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEMG1");
		assert.ok(oFilterItem);
		oFilterItem.setHiddenFilter(true);

		var aFilters = this.oFilterBar.getAllFilterItems(true);
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);

		oFilterItem.setPartOfCurrentVariant(true);
		aFilters = this.oFilterBar.getAllFilterItems(true);
		assert.ok(aFilters);
		assert.equal(aFilters.length, 3);

	});

	QUnit.test("checking _searchRequested method", function(assert) {

		var oValueState = {};

		this.oFilterBar._oFiltersSearchField = {
			getValue: function() {
			}
		};

		this.oFilterBar.isLiveMode = function() {
			return true;
		};
		this.oFilterBar.verifySearchAllowed = function() {
			return oValueState;
		};
		this.oFilterBar._oFilterDialog = {
			close: function() {
			}
		};

		sinon.spy(this.oFilterBar._oFilterDialog, "close");

		sinon.stub(this.oFilterBar, "_activateMainContent");

		this.oFilterBar._searchRequested();
		assert.ok(this.oFilterBar._bOKFiltersDialogTriggered);
		assert.ok(this.oFilterBar._oFilterDialog.close.calledOnce);

		oValueState = {
			error: true
		};
		this.oFilterBar._searchRequested();
		assert.ok(!this.oFilterBar._bOKFiltersDialogTriggered);

		oValueState = {
			mandatory: true
		};
		this.oFilterBar._searchRequested();
		assert.ok(!this.oFilterBar._bOKFiltersDialogTriggered);

		oValueState = {
			pending: true
		};
		this.oFilterBar._searchRequested();
		assert.ok(!this.oFilterBar._bOKFiltersDialogTriggered);

		delete this.oFilterBar.verifySearchAllowed;
		this.oFilterBar._searchRequested();
		assert.ok(this.oFilterBar._bOKFiltersDialogTriggered);
		assert.ok(this.oFilterBar._oFilterDialog.close.calledTwice);

		delete this.oFilterBar.isLiveMode;
		this.oFilterBar._searchRequested();
		assert.ok(this.oFilterBar._bOKFiltersDialogTriggered);
		assert.ok(this.oFilterBar._oFilterDialog.close.calledThrice);

		this.oFilterBar._oFilterDialog.close.restore();
		this.oFilterBar._oFilterDialog = null;
	});

	QUnit.test("checking isCurrentVariantExecuteOnSelectEnabled method", function(assert) {

		assert.ok(!this.oFilterBar.isCurrentVariantExecuteOnSelectEnabled());

		sinon.stub(this.oFilterBar._oVariantManagement, "getEnabled").returns(true);
		sinon.stub(this.oFilterBar._oVariantManagement, "getExecuteOnSelectForStandardVariant").returns(true);

		assert.ok(this.oFilterBar.isCurrentVariantExecuteOnSelectEnabled());

		this.oFilterBar._oVariantManagement.getExecuteOnSelectForStandardVariant.restore();
		sinon.stub(this.oFilterBar._oVariantManagement, "getExecuteOnSelectForStandardVariant").returns(false);

		assert.ok(!this.oFilterBar.isCurrentVariantExecuteOnSelectEnabled());

		var oStb = sinon.stub(this.oFilterBar._oVariantManagement, "getItemByKey");
		oStb.withArgs("executeOnSelection").returns({
			getExecuteOnSelection: function() {
				return true;
			}
		});
		oStb.withArgs("noExecuteOnSelection").returns({
			getExecuteOnSelection: function() {
				return false;
			}
		});

		sinon.stub(this.oFilterBar, "getCurrentVariantId").returns("executeOnSelection");
		assert.ok(this.oFilterBar.isCurrentVariantExecuteOnSelectEnabled());

		this.oFilterBar.getCurrentVariantId.restore();
		sinon.stub(this.oFilterBar, "getCurrentVariantId").returns("noExecuteOnSelection");
		assert.ok(!this.oFilterBar.isCurrentVariantExecuteOnSelectEnabled());

	});

	QUnit.test("checking determineFilterItemByName method", function(assert) {

		var oFilterBar = this.oFilterBar;

		var fCreateFilters = function(sGroupName, sGroupLabel, oField) {
			oField.factory = function() {
				var oFilterItem = new FilterGroupItem({
					label: oField.label,
					name: oField.fieldName,
					groupName: sGroupName,
					groupTitle: sGroupLabel,
					mandatory: oField.isMandatory,
					visible: oField.isVisible,
					visibleInAdvancedArea: oField.visibleInAdvancedArea,
					control: new Input(),
					hiddenFilter: oField.hiddenFilter
				});
				if (sGroupName === "__$INTERNAL$") {
					oFilterBar.addFilterItem(oFilterItem);
				} else {
					oFilterBar.addFilterGroupItem(oFilterItem);
				}
			};

			// FilterBar needs this information
			oField.groupName = sGroupName;
			oField.groupTitle = sGroupLabel;

			return oField;
		};

		var aFields = [
			fCreateFilters("G1", "LabelG1", {
				label: "Label A",
				fieldName: "A",
				isMandatory: false,
				isVisible: true,
				visibleInAdvancedArea: false,
				hiddenFilter: false
			}), fCreateFilters("__$INTERNAL$", "", {
				label: "Label I",
				fieldName: "I1",
				isMandatory: false,
				isVisible: true,
				hiddenFilter: false
			})
		];

		sinon.stub(this.oFilterBar, "_getFilterInformation").returns(aFields);
		this.oFilterBar._getFilters();

		this.oFilterBar.addFilterItem(_createFilterItem("ITEM0", "Item 1"));
		this.oFilterBar.addFilterGroupItem(_createFilterGroupItem("GROUP1", "Group 1", "ITEMG1", "Item G1"));

		var oFilterItem = this.oFilterBar.determineFilterItemByName("ITEM0");
		assert.ok(oFilterItem);
		assert.equal(oFilterItem.getName(), "ITEM0");
		assert.equal(oFilterItem.getGroupName(), FilterBar.INTERNAL_GROUP);

		oFilterItem = this.oFilterBar.determineFilterItemByName("ITEMG1");
		assert.ok(oFilterItem);
		assert.equal(oFilterItem.getName(), "ITEMG1");
		assert.equal(oFilterItem.getGroupName(), "GROUP1");

		oFilterItem = this.oFilterBar.determineFilterItemByName("I1");
		assert.ok(oFilterItem);
		assert.equal(oFilterItem.getName(), "I1");
		assert.equal(oFilterItem.getGroupName(), FilterBar.INTERNAL_GROUP);

		oFilterItem = this.oFilterBar.determineFilterItemByName("A");
		assert.ok(oFilterItem);
		assert.equal(oFilterItem.getName(), "A");
		assert.equal(oFilterItem.getGroupName(), "G1");

	});

	QUnit.test("checking setDataSuiteFormat method with empty payload", function(assert) {

		var oObject = {
			"SelectionVariantID": "id_1486369265497_348_page"
		};
		this.oFilterBar._bIsInitialized = true;
		this.oFilterBar.setFilterDataAsString = sinon.stub();
		this.oFilterBar.getFilterBarViewMetadata = sinon.stub();
		this.oFilterBar._oVariantManagement._selectVariant = sinon.stub();

		sinon.stub(this.oFilterBar._oVariantManagement, "isPageVariant").returns(true);

		this.oFilterBar.setDataSuiteFormat(JSON.stringify(oObject));
		assert.ok(this.oFilterBar._oVariantManagement._selectVariant.calledOnce);
		assert.ok(!this.oFilterBar.setFilterDataAsString.called);

	});

	QUnit.test("checking _filterSetInErrorState", function(assert) {

		this.oFilterBar._filterSetInErrorState();
		assert.ok(!this.oFilterBar._oVariantManagement.currentVariantGetModified());

		sinon.stub(this.oFilterBar._oVariantManagement, "getVisible").returns(true);

		sinon.stub(Dialog.prototype, "open");
		this.oFilterBar.showFilterDialog();
		var fnDone = assert.async();
		sap.ui.require([
			"sap/m/Dialog", "sap/m/OverflowToolbarLayoutData", "sap/ui/layout/form/Form", "sap/ui/layout/form/FormContainer", "sap/ui/layout/form/FormElement", "sap/ui/layout/form/ResponsiveGridLayout", "sap/m/Title"
		], function() {
			sinon.stub(this.oFilterBar._oFilterDialog, "isOpen").returns(true);

			var oButtonRestore = sap.ui.getCore().byId(this.oFilterBar.getId() + "-btnRestoreFilterDialog");
			assert.ok(oButtonRestore);
			assert.ok(!oButtonRestore.getEnabled());

			this.oFilterBar._filterSetInErrorState();

			assert.ok(this.oFilterBar._oVariantManagement.currentVariantGetModified());
			assert.ok(oButtonRestore.getEnabled());

			Dialog.prototype.open.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("checking getFilterDialogContent", function(assert) {

		var aContent = [
			new Input()
		];

		var oFilterDialog = {
			getContent: function() {
				return aContent;
			}
		};

		this.oFilterBar._oFilterDialog = oFilterDialog;

		var aFilterContent = this.oFilterBar.getFilterDialogContent();
		assert.ok(aFilterContent);
		assert.equal(aFilterContent.length, 1);

		aContent.push(new Input());
		aFilterContent = this.oFilterBar.getFilterDialogContent();
		assert.ok(aFilterContent);
		assert.equal(aFilterContent.length, 2);

		this.oFilterBar._oFilterDialog = null;
	});

	QUnit.test("checking addFilterDialogContent", function(assert) {

		var oContent = new Input();

		var aContent = [
			oContent
		];

		var oFilterDialog = {
			getContent: function() {
				return aContent;
			},
			addContent: function(oContent) {
				aContent.push(oContent);
			},
			indexOfContent: function(oContent) {
				var nIdx = -1;
				aContent.some(function(oElem, idx) {
					if (oContent === oElem) {
						nIdx = idx;
						return true;
					}
					return false;
				});

				return nIdx;
			}
		};

		this.oFilterBar._oFilterDialog = oFilterDialog;

		this.oFilterBar.addFilterDialogContent(oContent);
		var aFilterContent = this.oFilterBar.getFilterDialogContent();
		assert.ok(aFilterContent);
		assert.equal(aFilterContent.length, 1);
		assert.ok(oContent.getVisible());

		var oContent2 = new Input();
		this.oFilterBar.addFilterDialogContent(oContent2);
		aFilterContent = this.oFilterBar.getFilterDialogContent();
		assert.ok(aFilterContent);
		assert.equal(aFilterContent.length, 2);
		assert.ok(!oContent.getVisible());
		assert.ok(oContent2.getVisible());

		this.oFilterBar._oFilterDialog = null;
	});

	QUnit.test("checking _applyVariant method without/with liveMode", function(assert) {

		var oVariant = {
			filterBar: [],
			filterBarVariant: []
		};

		sinon.stub(this.oFilterBar, "search");

		this.oFilterBar._applyVariant(oVariant);
		assert.ok(!this.oFilterBar.search.called);

		this.oFilterBar.getLiveMode = function() {
			return true;
		};
		this.oFilterBar._applyVariant(oVariant);
		assert.ok(this.oFilterBar.search.called);
	});

	QUnit.test("checking getBasicSearchName", function(assert) {

		var sBasicSearchName = this.oFilterBar.getBasicSearchName();
		assert.ok(!sBasicSearchName);

		this.oFilterBar._oBasicSearchField = {};
		sBasicSearchName = this.oFilterBar.getBasicSearchName();
		assert.ok(!sBasicSearchName);

		this.oFilterBar.getEntitySet = function() {
			return "BASICSearchField";
		};
		sBasicSearchName = this.oFilterBar.getBasicSearchName();
		assert.ok(sBasicSearchName);
		assert.equal(sBasicSearchName, "$BASICSearchField.basicSearch");

	});

	QUnit.test("checking getUiState", function(assert) {

		var oUiState, oSelectionVariant, oValueState;

		sinon.stub(this.oFilterBar, "_getDataSuiteFormat").returns("{ \"_getDataSuiteFormat\": 1}");

		oUiState = this.oFilterBar.getUiState();
		assert.ok(oUiState);
		oSelectionVariant = oUiState.getSelectionVariant();
		assert.ok(oSelectionVariant);
		assert.equal(oSelectionVariant._getDataSuiteFormat, 1);
		oValueState = oUiState.getValueTexts();
		assert.ok(!oValueState);

		sinon.stub(UIState.prototype, "getValueTexts").returns({
			_getValueTexts: 2
		});

		oUiState = this.oFilterBar.getUiState({
			valueState: true
		});
		assert.ok(oUiState);
		oSelectionVariant = oUiState.getSelectionVariant();
		assert.ok(oSelectionVariant);
		assert.equal(oSelectionVariant._getDataSuiteFormat, 1);
		oValueState = oUiState.getValueTexts();
		assert.ok(oValueState);
		assert.equal(oValueState._getValueTexts, 2);

		UIState.prototype.getValueTexts.restore();

	});

	QUnit.test("checking setUiState", function(assert) {

		var oUiState = new UIState();
		oUiState.setSelectionVariant({});

		sinon.stub(VariantConverterFrom.prototype, "convert").returns({
			payload: JSON.stringify({
				one: 1
			})
		});
		sinon.stub(UIState, "enrichWithValueTexts");

		this.oFilterBar.setFilterDataAsString = function() {
		};

		this.oFilterBar.setUiState(oUiState);
		assert.ok(!UIState.enrichWithValueTexts.called);

		oUiState.setValueTexts({});

		this.oFilterBar.setUiState(oUiState);
		assert.ok(UIState.enrichWithValueTexts.called);
	});

	QUnit.test("setUiState calls the _setDataSuiteFormat with correct parameters when no params are passed", function (assert) {
		var oSetDataSuiteFormatSpy = this.spy(this.oFilterBar, "_setDataSuiteFormat");

		// Act & Assert
		this.oFilterBar.setUiState(undefined);
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], false, "calls the _setDataSuiteFormat with replace false");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], true, "calls the _setDataSuiteFormat with strictMode true");

		oSetDataSuiteFormatSpy.restore();
	});

	QUnit.test("setUiState calls the _setDataSuiteFormat with correct parameters when empty object is passed as parameter", function (assert) {
		var oSetDataSuiteFormatSpy = this.spy(this.oFilterBar, "_setDataSuiteFormat");

		// Act & Assert
		this.oFilterBar.setUiState(undefined, {});
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], false, "calls the _setDataSuiteFormat with replace false");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], true, "calls the _setDataSuiteFormat with strictMode true");

		oSetDataSuiteFormatSpy.restore();
	});

	QUnit.test("setUiState calls the _setDataSuiteFormat with correct parameters when only replace is passed", function (assert) {
		var oSetDataSuiteFormatSpy = this.spy(this.oFilterBar, "_setDataSuiteFormat");

		// Act & Assert
		this.oFilterBar.setUiState(undefined, { replace: false });
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], false, "{ replace: false } and calls the _setDataSuiteFormat with replace: false");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], true, "{ replace: false } and calls the _setDataSuiteFormat with strictMode: true");

		oSetDataSuiteFormatSpy.reset();

		// Act & Assert
		this.oFilterBar.setUiState(undefined, { replace: true });
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], true, "{ replace: true } and calls the _setDataSuiteFormat with replace: true");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], true, "{ replace: true } and calls the _setDataSuiteFormat with strictMode: true");

		oSetDataSuiteFormatSpy.restore();
	});

	QUnit.test("setUiState calls the _setDataSuiteFormat with correct parameters when only strictMode is passed", function (assert) {
		var oSetDataSuiteFormatSpy = this.spy(this.oFilterBar, "_setDataSuiteFormat");

		// Act & Assert
		this.oFilterBar.setUiState(undefined, { strictMode: false });
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], false, "{ strictMode: false } and calls the _setDataSuiteFormat with replace: false");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], false, "{ strictMode: false } and calls the _setDataSuiteFormat with strictMode: false");

		oSetDataSuiteFormatSpy.reset();

		// Act & Assert
		this.oFilterBar.setUiState(undefined, { strictMode: true });
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[1], false, "{ strictMode: true } and calls the _setDataSuiteFormat with replace: false");
		assert.equal(oSetDataSuiteFormatSpy.getCall(0).args[2], true, "{ strictMode: true } and calls the _setDataSuiteFormat with strictMode: true");

		oSetDataSuiteFormatSpy.restore();
	});

	QUnit.test("checking _filterGroupItemChange call", function(assert) {

		this.oFilterBar.ensureLoadedValueHelpList = function(s) {
			assert.equal(s, "ITEM2");
		};

		sinon.spy(this.oFilterBar, "ensureLoadedValueHelpList");

		var oFilterItem = _createFilterGroupItem("GROUP2", "Group 2", "ITEM2", "Item 2");
		this.oFilterBar.addFilterGroupItem(oFilterItem);

		oFilterItem.setPartOfCurrentVariant(true);

		assert.ok(this.oFilterBar.ensureLoadedValueHelpList.calledOnce);

	});

	QUnit.test("checking useSnapshot", function(assert) {

		sinon.stub(this.oFilterBar, "applyVariant");
		this.oFilterBar._oInitialVariant = {
			content: {}
		};

		assert.equal(this.oFilterBar.getUseSnapshot(), undefined);

		this.oFilterBar.reset();
		assert.ok(this.oFilterBar.applyVariant.called);

		this.oFilterBar.applyVariant.restore();
		sinon.stub(this.oFilterBar, "applyVariant");

		this.oFilterBar.setUseSnapshot(false);
		assert.equal(this.oFilterBar.getUseSnapshot(), false);

		this.oFilterBar.reset();
		assert.ok(!this.oFilterBar.applyVariant.called);
	});

	QUnit.test("checking setUiStateAsVariant", function(assert) {

		sinon.spy(this.oFilterBar, "setUiState");

		this.oFilterBar.setUiStateAsVariant(new UIState());

		assert.ok(this.oFilterBar.setUiState.called);
	});

	QUnit.test("checking adding quickinfo as tooltip on filter control", function(assert) {
		var oControl0 = new Input(), oControl1 = new Input();

		var oFilterItem0 = new FilterGroupItem({
			name: "ITEM0",
			groupName: "GROUP",
			groupTitle: "Group",
			visible: true,
			control: oControl0,
			controlTooltip: "This is a test",
			label: "label0"
		});

		this.oFilterBar.addFilterGroupItem(oFilterItem0);

		var oFilterItem1 = new FilterGroupItem({
			name: "ITEM1",
			groupName: "GROUP",
			groupTitle: "Group",
			visible: true,
			control: oControl1,
			label: "label1"
		});

		this.oFilterBar.addFilterGroupItem(oFilterItem1);

		var aContent = this.oFilterBar._mAdvancedAreaFilter["GROUP"].items[0].container.getContent();
		assert.equal(aContent.length, 2);
		assert.ok(aContent[0].isA("sap.m.Label"));
		assert.ok(aContent[1].isA("sap.m.Input"));
		assert.equal(aContent[0].getTooltip(), "label0");
		assert.equal(oControl0.getTooltip(), "This is a test");

		aContent = this.oFilterBar._mAdvancedAreaFilter["GROUP"].items[1].container.getContent();
		assert.equal(aContent.length, 2);
		assert.ok(aContent[0].isA("sap.m.Label"));
		assert.ok(aContent[1].isA("sap.m.Input"));
		assert.equal(aContent[0].getTooltip(), "label1");
		assert.ok(!oControl1.getTooltip());
	});

	QUnit.test("checking setFilterContainerWidth/getFilterContainerWidth method", function(assert) {

		assert.equal(this.oFilterBar.getFilterContainerWidth(), "12rem");
		assert.equal(this.oFilterBar.getFilterContainerWidth(), this.oFilterBar._oBasicAreaLayout.getMinItemWidth());
		this.oFilterBar.setFilterContainerWidth("20rem");

		assert.equal(this.oFilterBar.getFilterContainerWidth(), "20rem");
		assert.equal(this.oFilterBar.getFilterContainerWidth(), this.oFilterBar._oBasicAreaLayout.getMinItemWidth());
	});

	QUnit.module("Init", {
		beforeEach: function () {
			// Store initial device status
			this._bOriginalDevicePhoneStatus = Device.system.phone;
			this._bOriginalDeviceTabletStatus = Device.system.tablet;
			this._bOriginalDeviceDesktopStatus = Device.system.desktop;
		},
		simulateDesktop: function () {
			Device.system.phone = false;
			Device.system.tablet = false;
			Device.system.desktop = true;
		},
		simulatePhone: function () {
			Device.system.phone = true;
			Device.system.tablet = false;
			Device.system.desktop = false;
		},
		restoreDeviceSimulation: function () {
			Device.system.phone = this._bOriginalDevicePhoneStatus;
			Device.system.tablet = this._bOriginalDeviceTabletStatus;
			Device.system.desktop = this._bOriginalDeviceDesktopStatus;
		}
	});

	QUnit.test("Init - generic", function (assert) {
		// Arrange
		var oGridInitSpy = sinon.spy(Grid.prototype, "init"),
			oSetHSpacingSpy = sinon.spy(FilterBar.prototype, "setHSpacing"),
			sDefaultFilterContainerWidth,
			oBasicAreaLayout,
			oAdvancedPanel,
			oFB;

		this.simulateDesktop(); // Simulate desktop for this test

		// Act
		oFB = new FilterBar();

		// Assert
		assert.strictEqual(oGridInitSpy.callCount, 1, "Grid init method is called");
		assert.strictEqual(oSetHSpacingSpy.callCount, 1, "setHSpacing called once");
		assert.ok(oSetHSpacingSpy.calledWithExactly(0), "setHSpacing called with '0' as argument");
		assert.ok(oFB._oRb instanceof ResourceBundle, "Internal ResourceBundle initialized");
		assert.ok(oFB.oModel.isA("sap.ui.model.json.JSONModel"), "Internal model initialized");

		// Assert - Toolbar
		assert.ok(oFB._oToolbar.isA("sap.m.Toolbar"), "Internal Toolbar created");
		assert.strictEqual(oFB.indexOfAggregation("content", oFB._oToolbar), 0,
			"Toolbar is inserted as first item in the 'content' aggregation");

		// Assert - BasicAreaLayout
		oBasicAreaLayout = oFB._oBasicAreaLayout;
		sDefaultFilterContainerWidth = oFB.getMetadata().getProperty("filterContainerWidth").getDefaultValue();

		assert.ok(oBasicAreaLayout.isA("sap.ui.layout.AlignedFlowLayout"),
			"Correct type of BasicAreaLayout created");
		assert.strictEqual(oFB.indexOfAggregation("content", oBasicAreaLayout), 1,
			"BasicAreaLayout is second item in the 'content' aggregation");
		assert.strictEqual(oBasicAreaLayout.getLayoutData().getSpan(), "L12 M12 S12",
			"BasicAreaLayout correct layout data applied");
		assert.strictEqual(oBasicAreaLayout.getMinItemWidth(), sDefaultFilterContainerWidth,
			"Min item width should be set to the default value of 'filterContainerWidth' property");
		assert.strictEqual(oBasicAreaLayout.getMaxItemWidth(), sDefaultFilterContainerWidth,
			"Max item width should be set to the default value of 'filterContainerWidth' property");

		// Assert - AdvancedPanel
		oAdvancedPanel = oFB._oAdvancedPanel;
		assert.ok(oAdvancedPanel.isA("sap.m.Panel"),
			"Correct type of AdvancedPanel created");
		assert.strictEqual(oFB.indexOfAggregation("content", oAdvancedPanel), 2,
			"AdvancedPanel is third item in the 'content' aggregation");
		assert.strictEqual(oAdvancedPanel.getLayoutData().getSpan(), "L12 M12 S12",
			"AdvancedPanel correct layout data applied");

		// Assert - Hint text
		assert.ok(oFB._oHintText.isA("sap.m.Text"), "Correct internal hint text control created");
		assert.ok(oFB._oHintText.hasStyleClass("sapUiCompFilterBarHint"), "Correct CSS class applied to control");

		// Cleanup
		oGridInitSpy.restore();
		oFB.destroy();
		this.restoreDeviceSimulation();
	});

	QUnit.test("Init - CSS classes", function (assert) {
		// Arrange
		var oFB = new FilterBar();

		// Assert classes applied
		assert.ok(oFB.hasStyleClass("sapUiCompFilterBar"), "sapUiCompFilterBar class is applied to the control");
		assert.ok(oFB.hasStyleClass("sapUiCompFilterBarNonPhone"),
			"sapUiCompFilterBarNonPhone class is applied to the control");
		assert.ok(oFB.hasStyleClass("sapUiCompFilterBarMarginBottom"),
			"sapUiCompFilterBarMarginBottom class is applied to the control");
		assert.ok(oFB.hasStyleClass("sapUiCompFilterBarPaddingPanel"),
			"sapUiCompFilterBarPaddingPanel class is applied to the control");
		assert.ok(oFB.hasStyleClass("sapContrastPlus"), "sapContrastPlus class is applied to the control");

		// Cleanup
		oFB.destroy();
	});

	QUnit.test("Init - phone simulation", function (assert) {
		// Arrange
		var oSetFilterBarExpandedSpy = sinon.spy(FilterBar.prototype, "setFilterBarExpanded"),
			oFB;

		this.simulatePhone();

		// Act
		oFB = new FilterBar();

		// Assert
		assert.ok(oFB.hasStyleClass("sapUiCompFilterBarPhone"),
			"sapUiCompFilterBarPhone class is applied to the control");
		assert.notOk(oFB.hasStyleClass("sapUiCompFilterBarNonPhone"),
			"sapUiCompFilterBarNonPhone class is not applied to the control");
		assert.strictEqual(oSetFilterBarExpandedSpy.callCount, 1, "setFilterBarExpanded called once");
		assert.ok(oSetFilterBarExpandedSpy.calledWithExactly(false), "setFilterBarExpanded called with correct arguments");

		// Cleanup
		oSetFilterBarExpandedSpy.restore();
		oFB.destroy();
		this.restoreDeviceSimulation();
	});

	QUnit.module("Internal methods", {
		beforeEach: function () {
			this._oFB = new FilterBar();
		},
		afterEach: function () {
			this._oFB.destroy();
		}
	});

	QUnit.test("_createToolbar", function (assert) {
		// Arrange
		var oToolBar;

		this._oFB._oToolbar.destroy(); // Toolbar generated on init should be destroyed (duplicate ID issue)!

		// Act
		oToolBar = this._oFB._createToolbar(true /* Ignore Variant Management */);

		// Assert
		assert.ok(oToolBar.isA("sap.m.Toolbar"), "Toolbar created is of correct type");
		assert.strictEqual(oToolBar.getLayoutData().getSpan(), "L12 M12 S12", "Correct layout data is applied to ToolBar");

		// Cleanup
		oToolBar.destroy();
	});

	QUnit.test("_cancelFilterDialog should call _deleteValidatingTokenFlag method to delete the __bValidatingToken flag", function (assert) {
		// Arrange
		var oDeleteValidatingTokenFlag = this.spy(this._oFB, "_deleteValidatingTokenFlag");
		this._oFB._oInitialVariant = {
			content: "{}"
		};
		this._oFB._bDirtyViaDialog = true;

		// Act
		this._oFB._cancelFilterDialog();

		// Assert
		assert.equal(oDeleteValidatingTokenFlag.callCount, 1, "the _deleteValidatingTokenFlag method should be called once");

		// Cleanup
		oDeleteValidatingTokenFlag.restore();
	});

	QUnit.test("_resetVariant should call _deleteValidatingTokenFlag method to delete the __bValidatingToken flag", function (assert) {
		// Arrange
		var oDeleteValidatingTokenFlag = this.spy(this._oFB, "_deleteValidatingTokenFlag");

		// Act
		this._oFB._resetVariant();

		// Assert
		assert.equal(oDeleteValidatingTokenFlag.callCount, 1, "the _deleteValidatingTokenFlag method should be called once");

		// Cleanup
		oDeleteValidatingTokenFlag.restore();
	});

	QUnit.test("_deleteValidatingTokenFlag should remove __bValidatingToken flag from the controls passed to the method", function (assert) {
		// Arrange
		var aSelectionSetStub = [{ __bValidatingToken: true }, { __bValidatingToken: false }];

		// Act
		this._oFB._deleteValidatingTokenFlag(aSelectionSetStub);

		// Assert
		assert.notOk(aSelectionSetStub[0].hasOwnProperty("__bValidatingToken"), "The first control in the selection set should NOT have _bValidatingToken property set");
		assert.notOk(aSelectionSetStub[1].hasOwnProperty("__bValidatingToken"), "The second control in the selection set should NOT have _bValidatingToken property set");
	});

	QUnit.test("_generateListItems should generate controls with stable IDs inside it", function (assert) {
		testGenerateListItemsIDGeneration.call(this, assert, "groupName", "itemName");
	});

	QUnit.test("_generateListItems should generate escape properly groupName and ItemName for the IDs", function (assert) {
		testGenerateListItemsIDGeneration.call(this, assert, "Group Name with a Space and specials {'/}", "Item Name with a Space and specials {'/}");
	});

	QUnit.test("_checkForFilterInfo", function (assert) {
		var oFilterItem = {
		    getName: function() { return "F"; },
		    getGroupName : function() { return "ES"; },
		    getEntitySetName: function() { return "ES"; },
		    getEntityTypeName: function() { return "ET"; }
		};

		var aList = [{ group: "G1", name: "A"}, {group: "G1", name: "B"}, {group: "G1", name: "F"}, {group: "ES", name: "F"}];

		var oEntry = this._oFB._checkForFilterInfo(aList, oFilterItem);
		assert.ok(oEntry);
		assert.deepEqual(oEntry, {group: "ES", name: "F"});
	});

	function testGenerateListItemsIDGeneration(assert, sGroupName, sItemName) {
		// Arrange
		function returnTrue() { return true; }
		function returnText() { return "some text"; }
		var sGroupName = sGroupName,
			sItemName = sItemName,
			sExpectedListItemId = IdentifierUtil.replace(sGroupName + "-" + sItemName + "-selectFiltersItem"),
			sExpectedLabelId = sExpectedListItemId + "-label",
			oList = new List({
				mode: ListMode.MultiSelect
			}),
			oMockedItem = {
				filterItem: {
					getName: function () {
						return sItemName;
					},
					getHiddenFilter: function () {
						return false;
					},
					getVisible: returnTrue,
					getPartOfCurrentVariant: returnTrue,
					getVisibleInFilterBar: returnTrue,
					getMandatory: returnTrue,
					getControlTooltip: returnText,
					getLabel: returnText
				}
			};
		this._oFB._mAdvancedAreaFilter = {};
		this._oFB._mAdvancedAreaFilter[sGroupName] = {};
		this._oFB._mAdvancedAreaFilter[sGroupName].items = [oMockedItem];

		// Act
		this._oFB._generateListItems(sGroupName, oList);

		// Assert
		assert.equal(oList.getItems()[0].getId(), sExpectedListItemId, "listItem id should be " + sExpectedListItemId);
		assert.equal(oList.getItems()[0].getContent()[0].getId(), sExpectedLabelId, "label id should be " + sExpectedLabelId);

		// Cleanup
		oList.destroy();
	}

	QUnit.start();
});
