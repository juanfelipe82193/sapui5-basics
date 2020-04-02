sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame",
	"sap/ui/base/ManagedObject"
], function(ChartContainerContent, ChartContainer, VizFrame, ManagedObject) {
	"use strict";

	// This function deletes cached information within VizFrame about themes and rendering.
	// We are not testing the VizFrame rendering part. We only need the VizFrame for testing ChartContainer Logic.
	// To avoid failing tests, we stub the function to avoid empty caches.
	sinon.stub(VizFrame.prototype, "_clearVariables");

	QUnit.module("Public aggregation getters/setters", {
		beforeEach : function() {
			this.oVizFrameContent = new ChartContainerContent("chartContainerContentAggregationGettersSetters",{
				content : new VizFrame("vizFrameAggregationGettersSetters")
			});
			this.oChartContainer = new ChartContainer("chartContainerAggregationGettersSetters", {
				content : this.oVizFrameContent
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("SetToolbar returns if no toolbar value is passed", function(assert) {
		var sToolbar = null;

		var stubGetToolbar = sinon.stub(this.oChartContainer, "getToolbar");
		var stubSetAggregation = sinon.stub(this.oChartContainer, "setAggregation");
		var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");

		var oChartContainer = this.oChartContainer.setToolbar(sToolbar);

		assert.ok(stubGetToolbar.notCalled, "getToolbar not called");
		assert.ok(stubSetAggregation.notCalled, "setAggregation not called");
		assert.ok(stubInvalidate.notCalled, "invalidate not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetToolbar returns if a toolbar value is passed, but placeholder position isn't set", function(assert) {
		var sToolbar = "testToolbar";

		var stubGetToolbarPlaceHolderPosition = sinon.stub(this.oChartContainer, "_getToolbarPlaceHolderPosition").returns(-1);
		var stubGetToolbar = sinon.stub(this.oChartContainer, "getToolbar");
		var stubSetAggregation = sinon.stub(this.oChartContainer, "setAggregation");
		var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");

		var oChartContainer = this.oChartContainer.setToolbar(sToolbar);

		assert.ok(stubGetToolbarPlaceHolderPosition.called, "_getToolbarPlaceHolderPosition called");
		assert.ok(stubGetToolbarPlaceHolderPosition.calledWith(sToolbar), "_getToolbarPlaceHolderPosition called with the passed toolbar value");
		assert.ok(stubGetToolbar.notCalled, "getToolbar not called");
		assert.ok(stubSetAggregation.notCalled, "setAggregation not called");
		assert.ok(stubInvalidate.notCalled, "invalidate not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetToolbar updates the aggregation properly if valid/new value is passed", function(assert) {
		var sToolbar = "testToolbar";
		var sToolbarContent = "testToolbarContent";
		var oToolbar = {
			getContent: function() {
				return sToolbarContent;
			}
		};

		var stubGetToolbarPlaceHolderPosition = sinon.stub(this.oChartContainer, "_getToolbarPlaceHolderPosition");
		var stubGetToolbar = sinon.stub(this.oChartContainer, "getToolbar").returns(oToolbar);
		var spyGetContent = sinon.spy(oToolbar, "getContent");
		var stubSetAggregation = sinon.stub(this.oChartContainer, "setAggregation");
		var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");

		var oChartContainer = this.oChartContainer.setToolbar(sToolbar);

		assert.ok(stubGetToolbarPlaceHolderPosition.called, "_getToolbarPlaceHolderPosition called");
		assert.ok(stubGetToolbarPlaceHolderPosition.calledWith(sToolbar), "_getToolbarPlaceHolderPosition called with the passed toolbar value");
		assert.ok(stubGetToolbar.called, "getToolbar called");
		assert.ok(stubGetToolbar.calledThrice, "getToolbar called thrice");
		assert.ok(stubSetAggregation.called, "setAggregation called");
		assert.ok(stubSetAggregation.calledWith("toolbar", sToolbar), "aggregation setter called properly");
		assert.ok(spyGetContent.called, "getContent on the toolbar called");
		assert.equal(this.oChartContainer._aToolbarContent, sToolbarContent, "toolbar content has been set properly");
		assert.equal(this.oChartContainer._bHasApplicationToolbar, true, "property _bHasApplicationToolbar has been updated properly");
		assert.ok(stubInvalidate.called, "invalidate called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetToolbar updates the properties correctly if the same value is passed", function(assert) {
		var sToolbarContent = "testToolbarContent";
		var oToolbar = {
			getContent: function() {
				return sToolbarContent;
			}
		};

		var stubGetToolbarPlaceHolderPosition = sinon.stub(this.oChartContainer, "_getToolbarPlaceHolderPosition");
		var stubGetToolbar = sinon.stub(this.oChartContainer, "getToolbar").returns(oToolbar);
		var spyGetContent = sinon.spy(oToolbar, "getContent");
		var stubSetAggregation = sinon.stub(this.oChartContainer, "setAggregation");
		var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");

		var oChartContainer = this.oChartContainer.setToolbar(oToolbar);

		assert.ok(stubGetToolbarPlaceHolderPosition.called, "_getToolbarPlaceHolderPosition called");
		assert.ok(stubGetToolbarPlaceHolderPosition.calledWith(sinon.match(oToolbar)), "_getToolbarPlaceHolderPosition called with the passed toolbar value");
		assert.ok(stubGetToolbar.called, "getToolbar called");
		assert.ok(stubGetToolbar.calledThrice, "getToolbar called thrice");
		assert.ok(stubSetAggregation.notCalled, "setAggregation not called");
		assert.ok(spyGetContent.called, "getContent on the toolbar called");
		assert.equal(sToolbarContent, this.oChartContainer._aToolbarContent, "toolbar content has been set properly");
		assert.equal(true, this.oChartContainer._bHasApplicationToolbar, "property _bHasApplicationToolbar has been updated properly");
		assert.ok(stubInvalidate.called, "invalidate called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("GetDimensionSelectors returns dimension slectors property", function(assert) {
		var sDimensionSelectors = "testDimensionSelectors";
		this.oChartContainer._aDimensionSelectors = sDimensionSelectors;

		var sRetrievedDimensionSelectors = this.oChartContainer.getDimensionSelectors();

		assert.equal(sDimensionSelectors, sRetrievedDimensionSelectors, "The _aDimensionSelectors returned correctly");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("IndexOfDimensionSelector returns the correct index if it's found", function(assert) {
		var sDimensionSelectors = "testDimensionSelectors";
		this.oChartContainer._aDimensionSelectors = [sDimensionSelectors];
		var iActualDimensionSelectorIndex = this.oChartContainer._aDimensionSelectors.indexOf(sDimensionSelectors);

		var iDimensionSelectorIndex = this.oChartContainer.indexOfDimensionSelector(sDimensionSelectors);

		assert.equal(iActualDimensionSelectorIndex, iDimensionSelectorIndex, "The dimension selector index was found correctly");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("IndexOfDimensionSelector returns -1 if the passed dimension slector isn't found", function(assert) {
		var sDimensionSelectors = "testDimensionSelectors";
		this.oChartContainer._aDimensionSelectors = [{},{},{}];

		var iDimensionSelectorIndex = this.oChartContainer.indexOfDimensionSelector(sDimensionSelectors);

		assert.equal( -1, iDimensionSelectorIndex, "The dimension selector index was found correctly");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("AddDimensionSelector adds the passed dimension selector", function(assert) {
		var sDimensionSelector = "testDimensionSelectors";
		this.oChartContainer._aDimensionSelectors = [{},{},{}];

		var oChartContainer = this.oChartContainer.addDimensionSelector(sDimensionSelector);

		var iDimensionSelectorIndex = this.oChartContainer._aDimensionSelectors.indexOf(sDimensionSelector);
		assert.ok(iDimensionSelectorIndex > -1, "The dimension selector was added correctly");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("InsertDimensionSelector return without adding a dimension selector for a faulty value", function(assert) {
		var oDimensionSelector = null;
		var aCurrDimensionSelectorCount = this.oChartContainer._aDimensionSelectors.length;

		var oChartContainer = this.oChartContainer.insertDimensionSelector(oDimensionSelector);

		assert.equal(aCurrDimensionSelectorCount, this.oChartContainer._aDimensionSelectors.length, "Old and new dimension selector count matches");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("InsertDimensionSelector inserts the new dimension selector at the specified index", function(assert) {
		var sDimensionSelector = "testSelector";
		var iIndex = 2;
		// create some dummy dimension selectors
		this.oChartContainer._aDimensionSelectors = ["dummy1", "dummy2", "dummy3"];

		var oChartContainer = this.oChartContainer.insertDimensionSelector(sDimensionSelector, iIndex);

		assert.equal(iIndex, this.oChartContainer._aDimensionSelectors.indexOf(sDimensionSelector), "New dimension selector added at the correct index");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("InsertDimensionSelector inserts the new dimension selector at the end if the index exceeds selector length", function(assert) {
		var sDimensionSelector = "testSelector";
		var iIndex = 12;
		// create some dummy dimension selectors
		this.oChartContainer._aDimensionSelectors = ["dummy1", "dummy2", "dummy3"];

		var oChartContainer = this.oChartContainer.insertDimensionSelector(sDimensionSelector, iIndex);

		assert.equal(this.oChartContainer._aDimensionSelectors.length - 1, this.oChartContainer._aDimensionSelectors.indexOf(sDimensionSelector), "New dimension selector added at end of the array");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");

		this.oChartContainer._aDimensionSelectors = null;
	});

	QUnit.test("DestroyDimensionSelectors destroys all available dimension selectors", function(assert) {
		// create a dummy dimension selectors
		var spyDestroy = sinon.spy();
		var oDimensionSelector = {
			destroy: spyDestroy
		};
		this.oChartContainer._aDimensionSelectors = [oDimensionSelector, oDimensionSelector, null];
		var iDimensionSelectorCount = this.oChartContainer._aDimensionSelectors.length - 1;
		// create a dummy toolbar
		var oRemoveContentSpy = sinon.spy();
		var oToolbar = {
			removeContent: oRemoveContentSpy
		};
		this.oChartContainer._oToolBar = oToolbar;

		var oChartContainer = this.oChartContainer.destroyDimensionSelectors();

		assert.ok(spyDestroy.called, "destroy on dimension selector called");
		assert.equal(iDimensionSelectorCount, spyDestroy.callCount, "destroy on dimension selector call count equals valid dimension selector length");
		assert.ok(oRemoveContentSpy.called, "removeContent on toolbar called");
		assert.equal(iDimensionSelectorCount, spyDestroy.callCount, "removeContent on toolbar call count equals valid dimension selector length");
		assert.equal(0, this.oChartContainer._aDimensionSelectors.length, "dimension selector array is empty");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");

		this.oChartContainer._aDimensionSelectors = null;
		this.oChartContainer._oToolBar = null;
	});

	QUnit.test("RemoveDimensionSelector removes the specified dimension selector", function(assert) {
		// create a dummy dimension selectors
		var sDimensionSelector = "testDimensionSelector";
		this.oChartContainer._aDimensionSelectors = ["dummy1", "dummy2", sDimensionSelector];
		var iOldDimensionSelectorCount = this.oChartContainer._aDimensionSelectors.length;
		// create a dummy toolbar
		var oRemoveContentSpy = sinon.spy();
		var oToolbar = {
			removeContent: oRemoveContentSpy
		};
		this.oChartContainer._oToolBar = oToolbar;

		var oIndexOfDimensionSelectorSpy = sinon.spy(this.oChartContainer, "indexOfDimensionSelector");

		var sRemovedDimensionSelector = this.oChartContainer.removeDimensionSelector(sDimensionSelector);

		assert.ok(oRemoveContentSpy.called, "removeContent on toolbar called");
		assert.ok(oRemoveContentSpy.calledWith(sDimensionSelector), "removeContent on toolbar called with the passed dimension selector");
		assert.ok(oIndexOfDimensionSelectorSpy.called, "indexOfDimensionSelector called");
		assert.ok(oIndexOfDimensionSelectorSpy.calledWith(sDimensionSelector), "indexOfDimensionSelector called with the passed dimension selector");
		assert.equal(iOldDimensionSelectorCount - 1, this.oChartContainer._aDimensionSelectors.length, "dimension selector count is reduced by one");
		assert.equal(-1, this.oChartContainer._aDimensionSelectors.indexOf(sDimensionSelector), "the passed dimension selector is not part of the array anymore");
		assert.equal(sRemovedDimensionSelector, sDimensionSelector, "The removed dimension selector is returned");

		oIndexOfDimensionSelectorSpy.restore();

		this.oChartContainer._aDimensionSelectors = null;
		this.oChartContainer._oToolBar = null;
	});

	QUnit.test("RemoveDimensionSelector returns null if the specified dimension selector isn't found", function(assert) {
		// create a dummy dimension selectors
		var sDimensionSelector = "testDimensionSelector";
		this.oChartContainer._aDimensionSelectors = ["dummy1", "dummy2"];
		var iOldDimensionSelectorCount = this.oChartContainer._aDimensionSelectors.length;
		// create a dummy toolbar
		var oRemoveContentSpy = sinon.spy();
		var oToolbar = {
			removeContent: oRemoveContentSpy
		};
		this.oChartContainer._oToolBar = oToolbar;

		var oIndexOfDimensionSelectorSpy = sinon.spy(this.oChartContainer, "indexOfDimensionSelector");

		var removedDimensionSelector = this.oChartContainer.removeDimensionSelector(sDimensionSelector);

		assert.ok(oRemoveContentSpy.called, "removeContent on toolbar called");
		assert.ok(oRemoveContentSpy.calledWith(sDimensionSelector), "removeContent on toolbar called with the passed dimension selector");
		assert.ok(oIndexOfDimensionSelectorSpy.called, "indexOfDimensionSelector called");
		assert.ok(oIndexOfDimensionSelectorSpy.calledWith(sDimensionSelector), "indexOfDimensionSelector called with the passed dimension selector");
		assert.equal(iOldDimensionSelectorCount, this.oChartContainer._aDimensionSelectors.length, "dimension selector count is the same as befor the method call");
		assert.equal(removedDimensionSelector, null, "Null is returned");

		oIndexOfDimensionSelectorSpy.restore();

		this.oChartContainer._aDimensionSelectors = null;
		this.oChartContainer._oToolBar = null;
	});

	QUnit.test("RemoveDimensionSelector returns null if no dimension selector is passed", function(assert) {
		var oIndexOfDimensionSelectorSpy = sinon.spy(this.oChartContainer, "indexOfDimensionSelector");
		this.oChartContainer._adjustSelectorDisplay();

		var removedDimensionSelector = this.oChartContainer.removeDimensionSelector();

		assert.ok(oIndexOfDimensionSelectorSpy.notCalled, "indexOfDimensionSelector not called");
		assert.equal(removedDimensionSelector, null, "Null is returned");

		oIndexOfDimensionSelectorSpy.restore();
	});

	QUnit.test("RemoveAllDimensionSelectors removes all dimension selectors", function(assert) {
		// create a dummy dimension selectors
		this.oChartContainer._aDimensionSelectors = ["dummy1", "dummy2", null];
		var aOldDimensionSelectors = this.oChartContainer._aDimensionSelectors.slice();
		// create a dummy toolbar
		var oRemoveContentSpy = sinon.spy();
		var oToolbar = {
			removeContent: oRemoveContentSpy
		};
		this.oChartContainer._oToolBar = oToolbar;

		var aRemovedDimensionSelectors = this.oChartContainer.removeAllDimensionSelectors();

		assert.ok(oRemoveContentSpy.called, "removeContent on toolbar called");
		assert.ok(oRemoveContentSpy.calledTwice, "removeContent called twice");
		assert.ok(oRemoveContentSpy.calledWith("dummy1"), "removeContent on toolbar called with the first dimension selector");
		assert.ok(oRemoveContentSpy.calledWith("dummy2"), "removeContent on toolbar called with the second dimension selector");
		assert.equal(0, this.oChartContainer._aDimensionSelectors.length, "dimension selector array is empty");
		assert.deepEqual(aOldDimensionSelectors, aRemovedDimensionSelectors, "The whole removed array is returned");

		this.oChartContainer._aDimensionSelectors = null;
		this.oChartContainer._oToolBar = null;
	});

	QUnit.test("AddContent adds the passed content aggregation properly", function(assert) {
		var sContent = "testContent";

		this.oChartContainer._bChartContentHasChanged = false;

		var stubAddAggregation = sinon.stub(this.oChartContainer, "addAggregation");

		var oChartContainer = this.oChartContainer.addContent(sContent);

		assert.ok(stubAddAggregation.called, "addAggregation called");
		assert.ok(stubAddAggregation.calledWith("content", sContent), "addAggregation called with the string 'content' and the passed content");
		assert.equal(true, this.oChartContainer._bChartContentHasChanged, "_bChartContentHasChanged flag has been set to true");
		assert.deepEqual(this.oChartContainer, oChartContainer, "Reference to 'this' returned");
	});

	QUnit.test("InsertContent inserts the passed content aggregation properly at the specified index", function(assert) {
		var sContent = "testContent";
		var iContentIndex = 5;

		this.oChartContainer._bChartContentHasChanged = false;

		var stubInsertAggregation = sinon.stub(this.oChartContainer, "insertAggregation");

		var oChartContainer = this.oChartContainer.insertContent(sContent, iContentIndex);

		assert.ok(stubInsertAggregation.called, "insertAggregation called");
		assert.ok(stubInsertAggregation.calledWith("content", sContent, iContentIndex), "insertAggregation called with the string 'content' and the passed content and the index");
		assert.equal(true, this.oChartContainer._bChartContentHasChanged, "_bChartContentHasChanged flag has been set to true");
		assert.deepEqual(this.oChartContainer, oChartContainer, "Reference to 'this' returned");
	});

	QUnit.test("UpdateAggregation calls updateAggregation for content properly", function(assert) {
		this.oChartContainer._bChartContentHasChanged = false;

		var stubUpdateAggregation = sinon.stub(this.oChartContainer, "updateAggregation");

		this.oChartContainer.updateContent();

		assert.ok(stubUpdateAggregation.called, "updateAggregation called");
		assert.ok(stubUpdateAggregation.calledWith("content"), "updateAggregation called with the string 'content' and the passed content");
		assert.equal(true, this.oChartContainer._bChartContentHasChanged, "_bChartContentHasChanged flag has been set to true");
	});

	QUnit.test("AddAggregation calls addDimensionSelector for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var sObject = "testObject";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubAddDimensionSelector = sinon.stub(this.oChartContainer, "addDimensionSelector").returns(sReturnValue);
		var stubAddAggregation = sinon.stub(ManagedObject.prototype, "addAggregation");

		var sActualReturnValue = this.oChartContainer.addAggregation(sAggregationName, sObject, bSuppressInvalidate);

		assert.ok(stubAddDimensionSelector.called, "addDimensionSelector called");
		assert.ok(stubAddDimensionSelector.calledWith(sObject), "addDimensionSelector called the passed object");
		assert.ok(stubAddAggregation.notCalled, "addAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "addDimensionSelector return value is returned");

		stubAddAggregation.restore();
	});

	QUnit.test("AddAggregation calls addAggregation for non-dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var sObject = "testObject";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubAddDimensionSelector = sinon.stub(this.oChartContainer, "addDimensionSelector");
		var stubAddAggregation = sinon.stub(ManagedObject.prototype, "addAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.addAggregation(sAggregationName, sObject, bSuppressInvalidate);

		assert.ok(stubAddDimensionSelector.notCalled, "addDimensionSelector not called");
		assert.ok(stubAddAggregation.called, "addAggregation for ManagedObject called");
		assert.ok(stubAddAggregation.calledWith(sAggregationName, sObject, bSuppressInvalidate), "addAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "addAggregation return value is returned");

		stubAddAggregation.restore();
	});

	QUnit.test("GetAggregation calls getDimensionSelectors for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var sDefaultForCreation = "testObject";
		var sReturnValue = "testReturnValue";

		var stubGetDimensionSelectors = sinon.stub(this.oChartContainer, "getDimensionSelectors").returns(sReturnValue);
		var stubGetAggregation = sinon.stub(ManagedObject.prototype, "getAggregation");

		var sActualReturnValue = this.oChartContainer.getAggregation(sAggregationName, sDefaultForCreation);

		assert.ok(stubGetDimensionSelectors.called, "addDimensionSelector called");
		assert.ok(stubGetAggregation.notCalled, "getAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "addDimensionSelector return value is returned");

		stubGetAggregation.restore();
	});

	QUnit.test("GetAggregation calls getAggregation for non-dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var sDefaultForCreation = "testObject";
		var sReturnValue = "testReturnValue";

		var stubGetDimensionSelectors = sinon.stub(this.oChartContainer, "getDimensionSelectors");
		var stubGetAggregation = sinon.stub(ManagedObject.prototype, "getAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.getAggregation(sAggregationName, sDefaultForCreation);

		assert.ok(stubGetDimensionSelectors.notCalled, "getDimensionSelectors not called");
		assert.ok(stubGetAggregation.called, "getAggregation for ManagedObject called");
		assert.ok(stubGetAggregation.calledWith(sAggregationName, sDefaultForCreation), "getAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "getAggregation return value is returned");

		stubGetAggregation.restore();
	});

	QUnit.test("IndexOfAggregation calls getDimensionSelectors for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var sObject = "testObject";
		var sReturnValue = "testReturnValue";

		var stubIndexOfDimensionSelector = sinon.stub(this.oChartContainer, "indexOfDimensionSelector").returns(sReturnValue);
		var stubIndexOfAggregation = sinon.stub(ManagedObject.prototype, "indexOfAggregation");

		var sActualReturnValue = this.oChartContainer.indexOfAggregation(sAggregationName, sObject);

		assert.ok(stubIndexOfDimensionSelector.called, "indexOfDimensionSelector called");
		assert.ok(stubIndexOfDimensionSelector.calledWith(sObject), "indexOfDimensionSelector called with the passed object");
		assert.ok(stubIndexOfAggregation.notCalled, "indexOfAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "indexOfAggregation return value is returned");

		stubIndexOfAggregation.restore();
	});

	QUnit.test("IndexOfAggregation calls getAggregation for non-dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var sObject = "testObject";
		var sReturnValue = "testReturnValue";

		var stubIndexOfDimensionSelector = sinon.stub(this.oChartContainer, "indexOfDimensionSelector");
		var stubIndexOfAggregation = sinon.stub(ManagedObject.prototype, "indexOfAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.indexOfAggregation(sAggregationName, sObject);

		assert.ok(stubIndexOfDimensionSelector.notCalled, "indexOfDimensionSelector not called");
		assert.ok(stubIndexOfAggregation.called, "indexOfAggregation for ManagedObject called");
		assert.ok(stubIndexOfAggregation.calledWith(sAggregationName, sObject), "indexOfAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "indexOfAggregation return value is returned");

		stubIndexOfAggregation.restore();
	});

	QUnit.test("InsertAggregation calls getDimensionSelectors for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var sObject = "testObject";
		var iIndex = 4;
		var bSuppressInvalidate;
		var sReturnValue = "testReturnValue";

		var stubInsertDimensionSelector = sinon.stub(this.oChartContainer, "insertDimensionSelector").returns(sReturnValue);
		var stubInsertAggregation = sinon.stub(ManagedObject.prototype, "insertAggregation");

		var sActualReturnValue = this.oChartContainer.insertAggregation(sAggregationName, sObject, iIndex, bSuppressInvalidate);

		assert.ok(stubInsertDimensionSelector.called, "insertDimensionSelector called");
		assert.ok(stubInsertDimensionSelector.calledWith(sObject, iIndex), "insertDimensionSelector called with the passed object and index");
		assert.ok(stubInsertAggregation.notCalled, "insertAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "indexOfAggregation return value is returned");

		stubInsertAggregation.restore();
	});

	QUnit.test("InsertAggregation calls getAggregation for non-dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var sObject = "testObject";
		var iIndex = 4;
		var bSuppressInvalidate;
		var sReturnValue = "testReturnValue";

		var stubInsertDimensionSelector = sinon.stub(this.oChartContainer, "insertDimensionSelector");
		var stubInsertAggregation = sinon.stub(ManagedObject.prototype, "insertAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.insertAggregation(sAggregationName, sObject, iIndex, bSuppressInvalidate);

		assert.ok(stubInsertDimensionSelector.notCalled, "insertDimensionSelector not called");
		assert.ok(stubInsertAggregation.called, "insertAggregation for ManagedObject called");
		assert.ok(stubInsertAggregation.calledWith(sAggregationName, sObject, iIndex, bSuppressInvalidate), "insertAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "insertAggregation return value is returned");

		stubInsertAggregation.restore();
	});

	QUnit.test("DestroyAggregation calls destroyDimensionSelectors for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubDestroyDimensionSelectors = sinon.stub(this.oChartContainer, "destroyDimensionSelectors").returns(sReturnValue);
		var stubDestroyAggregation = sinon.stub(ManagedObject.prototype, "destroyAggregation");

		var sActualReturnValue = this.oChartContainer.destroyAggregation(sAggregationName, bSuppressInvalidate);

		assert.ok(stubDestroyDimensionSelectors.called, "destroyDimensionSelectors called");
		assert.ok(stubDestroyAggregation.notCalled, "destroyAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "destroyAggregation return value is returned");

		stubDestroyAggregation.restore();
	});

	QUnit.test("DestroyAggregation calls getAggregation for dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubDestroyDimensionSelectors = sinon.stub(this.oChartContainer, "destroyDimensionSelectors");
		var stubDestroyAggregation = sinon.stub(ManagedObject.prototype, "destroyAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.destroyAggregation(sAggregationName, bSuppressInvalidate);

		assert.ok(stubDestroyDimensionSelectors.notCalled, "destroyDimensionSelectors not called");
		assert.ok(stubDestroyAggregation.called, "destroyAggregation for ManagedObject called");
		assert.ok(stubDestroyAggregation.calledWith(sAggregationName, bSuppressInvalidate), "destroyAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "destroyAggregation return value is returned");

		stubDestroyAggregation.restore();
	});

	QUnit.test("RemoveAggregation calls removeAggregation for dimensionSelectors", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var sObject = "testObject";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubRremoveDimensionSelector = sinon.stub(this.oChartContainer, "removeDimensionSelector").returns(sReturnValue);
		var stubRemoveAggregation = sinon.stub(ManagedObject.prototype, "removeAggregation");

		var sActualReturnValue = this.oChartContainer.removeAggregation(sAggregationName, sObject, bSuppressInvalidate);

		assert.ok(stubRremoveDimensionSelector.called, "removeDimensionSelector called");
		assert.ok(stubRremoveDimensionSelector.calledWith(sObject), "insertDimensionSelector called with the passed object");
		assert.ok(stubRemoveAggregation.notCalled, "removeAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "removeAggregation return value is returned");

		stubRemoveAggregation.restore();
	});

	QUnit.test("RemoveAggregation calls getAggregation for non-dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var sObject = "testObject";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubRemoveDimensionSelector = sinon.stub(this.oChartContainer, "removeDimensionSelector");
		var stubRemoveAggregation = sinon.stub(ManagedObject.prototype, "removeAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.removeAggregation(sAggregationName, sObject, bSuppressInvalidate);

		assert.ok(stubRemoveDimensionSelector.notCalled, "removeDimensionSelector not called");
		assert.ok(stubRemoveAggregation.called, "removeAggregation for ManagedObject called");
		assert.ok(stubRemoveAggregation.calledWith(sAggregationName, sObject, bSuppressInvalidate), "removeAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "removeAggregation return value is returned");

		stubRemoveAggregation.restore();
	});

	QUnit.test("RemoveAllAggregation calls removeAllDimensionSelectors for non-dimensionSelectos", function(assert) {
		var sAggregationName = "dimensionSelectors";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubRemoveAllDimensionSelectors = sinon.stub(this.oChartContainer, "removeAllDimensionSelectors").returns(sReturnValue);
		var stubRemoveAllAggregation = sinon.stub(ManagedObject.prototype, "removeAllAggregation");

		var sActualReturnValue = this.oChartContainer.removeAllAggregation(sAggregationName, bSuppressInvalidate);

		assert.ok(stubRemoveAllDimensionSelectors.called, "removeAllDimensionSelectors called");
		assert.ok(stubRemoveAllAggregation.notCalled, "removeAllAggregation for ManagedObject not called");
		assert.equal(sReturnValue, sActualReturnValue, "removeAllAggregation return value is returned");

		stubRemoveAllAggregation.restore();
	});

	QUnit.test("RemoveAllAggregation calls removeAllAggregation for dimensionSelectors", function(assert) {
		var sAggregationName = "someOtherAggregation";
		var bSuppressInvalidate = true;
		var sReturnValue = "testReturnValue";

		var stubRemoveAllDimensionSelectors = sinon.stub(this.oChartContainer, "removeAllDimensionSelectors");
		var stubRemoveAllAggregation = sinon.stub(ManagedObject.prototype, "removeAllAggregation").returns(sReturnValue);

		var sActualReturnValue = this.oChartContainer.removeAllAggregation(sAggregationName, bSuppressInvalidate);

		assert.ok(stubRemoveAllDimensionSelectors.notCalled, "removeAllDimensionSelectors not called");
		assert.ok(stubRemoveAllAggregation.called, "removeAllAggregation for ManagedObject called");
		assert.ok(stubRemoveAllAggregation.calledWith(sAggregationName, bSuppressInvalidate), "removeAllAggregation for ManagedObject called with the passed arguments");
		assert.equal(sReturnValue, sActualReturnValue, "removeAllAggregation return value is returned");

		stubRemoveAllAggregation.restore();
	});

	QUnit.test("RemoveAllAggregation with the argument content removes all content from the content aggregation", function(assert) {
		var sAggregationName,
			bSuppressInvalidate,
			stubRemoveAllAggregation;

		sAggregationName = "content";
		bSuppressInvalidate = true;
		stubRemoveAllAggregation = sinon.stub(ManagedObject.prototype, "removeAllAggregation");
		this.oChartContainer.removeAllAggregation(sAggregationName, bSuppressInvalidate);

		assert.ok(stubRemoveAllAggregation.calledWith(sAggregationName, bSuppressInvalidate), "removeAllAggregation for ManagedObject called with the passed arguments");

		stubRemoveAllAggregation.restore();
	});

});
