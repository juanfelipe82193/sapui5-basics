///*!
// * SAP APF Analysis Path Framework
// *
// * (c) Copyright 2012-2018 SAP SE. All rights reserved
// */
///* global sap, jQuery, QUnit, sinon */
//
//sap.ui.define([
//	"sap/apf/core/utils/filter",
//	"sap/apf/demokit/mockserver",
//	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
//	"sap/apf/testhelper/config/representationHelper",
//	"sap/apf/testhelper/doubles/createUiApiAsPromise",
//	"sap/apf/ui/representations/RepresentationInterfaceProxy",
//	"sap/apf/ui/representations/treeTable",
//	"sap/apf/utils/filter",
//	"sap/ui/table/SelectionMode",
//	"sap/ui/table/VisibleRowCountMode",
//	"sap/ui/model/odata/v2/ODataModel",
//	"sap/ui/table/TreeTable",
//	"sap/ui/core/util/MockServer"
//], function(
//	CoreFilter,
//	MockServer,
//	BaseUI5ChartRepresentationTestHelper,
//	RepresentationHelper,
//	createUiApiAsPromise,
//	RepresentationInterfaceProxy,
//	TreeTable,
//	Filter,
//	SelectionMode,
//	VisibleRowCountMode,
//	ODataModel,
//	UITreeTable,
//	CoreMockServer
//) {
//	'use strict';
//
//	/*BEGIN_COMPATIBILITY*/
//	CoreFilter = CoreFilter || sap.apf.core.utils.Filter;
//	Filter = Filter || sap.apf.utils.Filter;
//	/*END_COMPATIBILITY*/
//
//	function clickRow(tableId, Index){
//		jQuery("#" + tableId + "-rowsel" + Index).click();
//	}
//	var _mockServer = MockServer("../../../../../resources/sap/apf/demokit/");
//	function entityTypeMetadata(singleSelection) {
//		return {
//			getEntityTypeMetadata : function(sProperty) {
//				return {
//					label : sProperty
//				};
//			},
//			getPropertyMetadata : function(sProperty) {
//				var oLabel = {
//					label : sProperty,
//					text : "Customer_NodeText",
//					"hierarchy-node-for" : sProperty
//				};
//				if (singleSelection) {
//					oLabel["filter-restriction"] = "single-value";
//				}
//				if (sProperty === "Revenue") {
//					oLabel["aggregation-role"] = "measure";
//				}
//				return oLabel;
//			}
//		};
//	}
//	function _placeTableAtDom(oDataTableScrollContainer) {
//		var divToPlaceTable = document.createElement("div");
//		divToPlaceTable.setAttribute('id', "idTreeTable");
//		document.body.appendChild(divToPlaceTable);
//		oDataTableScrollContainer.placeAt("idTreeTable");
//		sap.ui.getCore().applyChanges();
//	}
//	function _getOApi() {
//		return {
//			getEventCallback : function() {
//				return {
//					bind : function(value) {
//						return value;
//					}
//				};
//			},
//			getTextNotHtmlEncoded : function() {
//				return {};
//			},
//			getExits : function() {
//			}
//		};
//	}
//	function _checkForTreeTableInstanceAfterDestroy(assert, oTreeTableRepresentation) {
//		assert.strictEqual(oTreeTableRepresentation.oParameters, null, "After destroy parameter is null");
//		assert.strictEqual(oTreeTableRepresentation.oTreeTableModel, null, " After destroy oTreeTableModel is null");
//		assert.strictEqual(oTreeTableRepresentation.oTreeTableControlObject, null, " After destroy oTreeTableControlObject is null");
//		assert.strictEqual(oTreeTableRepresentation.metadata, null, " After destroy metadata is null");
//	}
//	function commonSetup (assert, context, singleSelection, bFilter){
//		return new Promise(function(resolve){
//			var done = assert.async();
//			createUiApiAsPromise().done(function(instances) {
//				context.instances = instances;
//				_mockServer.mockHierarchyService();
//				context.interfaceProxy = new RepresentationInterfaceProxy(instances.oCoreApi, instances.oUiApi);
//				context.oTreeTableRepresentation = new TreeTable(context.interfaceProxy, context.oRequiredParameter);
//				var oModel = new ODataModel("/tmp/demokit/hierarchy.xsodata");
//				function onRequestSent() {
//					assert.strictEqual(context.oTreeTableRepresentation.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").getBusy(), true, "then the busy indicator on step contaner is set to true");
//					oModel.detachBatchRequestSent(onRequestSent);
//				}
//				function onComplete() {
//					assert.strictEqual(context.oTreeTableRepresentation.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").getBusy(), false, "then the busy indicator on step contaner is set to false");
//					oModel.detachBatchRequestCompleted(onComplete);
//					resolve();
//					done();
//				}
//				var controlObject = {
//					path : "/RevenueHryQuery(P_Currency=%27USD%27)/Results",
//					parameters : {
//						select : "Customer,Customer_NodeID,Customer_ParentID,Customer_Level,Customer_Drillstate,Customer_NodeText,Customer_NodeIDExt,Country",
//						operationMode : "Server",
//						useServerSideApplicationFilters : true,
//						treeAnnotationProperties : {
//							hierarchyNodeFor : "Customer_NodeID",
//							hierarchyParentNodeFor : "Customer_ParentID",
//							hierarchyLevelFor : "Customer_Level",
//							hierarchyDrillStateFor : "Customer_Drillstate",
//							hierarchyNodeExternalKeyFor : "Customer_NodeIDExt"
//						}
//					}
//				};
//				if(bFilter){
//					// add filter so 2 nodes are visible
//					var filter = new CoreFilter(instances.oCoreApi.getMessageHandler(), "Customer_ParentID", "eq", "Customer: CG05");
//					controlObject.filters = [ filter.mapToSapUI5FilterExpression() ];
//				}
//				context.oTreeTableRepresentation.updateTreetable(controlObject, oModel, entityTypeMetadata(singleSelection));
//				context.mainContent = context.oTreeTableRepresentation.getMainContent("TreeTable");
//				context.spyAttachBatchRequestCompleted = sinon.spy(oModel, "attachBatchRequestCompleted");
//				oModel.attachBatchRequestCompleted(onComplete);
//				oModel.attachBatchRequestSent(onRequestSent);
//				_placeTableAtDom(context.mainContent);
//			});
//		});
//	}
//	function commonTeardown(context){
//		context.oTreeTableRepresentation.destroy();
//		context.spyAttachBatchRequestCompleted.restore();
//		_mockServer.teardownMockserver();
//		CoreMockServer.stopAll();
//		CoreMockServer.destroyAll();
//		context.instances.oComponent.destroy();
//		context.instances.oCompContainer.destroy();
//	}
//
//	BaseUI5ChartRepresentationTestHelper.run(TreeTable);
//
//	QUnit.module("Tree Table Unit Tests - with a required filter", {
//		beforeEach : function(assert) {
//			var that = this;
//			var representationHelper = RepresentationHelper.prototype;
//			that.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilter();
//			that.oEvent = {
//				getSource: function(){
//					return {
//						getFocusDomRef: function(){
//							return undefined;
//						}
//					};
//				},
//				getParameter: function(name){
//					if (name === "userInteraction") {
//						return true;
//					}
//					if (name === "rowIndex") {
//						return 0;
//					}
//					return undefined;
//				}
//			};
//			commonSetup(assert, this, false, true).then(function(){
//				that.spySelectionChanged = sinon.spy(that.oTreeTableRepresentation.oApi, "selectionChanged");
//				that.spyCreateFilterFromSelectedValues = sinon.spy(that.oTreeTableRepresentation.oRepresentationFilterHandler, "createFilterFromSelectedValues");
//				var originalSelectRowInTreeTable = that.oTreeTableRepresentation._selectRowInTreeTable;
//				that.stubSelectRowInTreeTable = sinon.stub(that.oTreeTableRepresentation, "_selectRowInTreeTable", function(oEvent){
//					var originalGetParameter = oEvent.getParameter.bind(oEvent);
//					function getParameter(name){
//						if (name === "userInteraction") {
//							return true;
//						}
//						return originalGetParameter(name);
//					}
//					oEvent.getParameter = getParameter;
//					originalSelectRowInTreeTable(oEvent);
//				});
//			});
//		},
//		afterEach : function() {
//			this.spySelectionChanged.restore();
//			this.spyCreateFilterFromSelectedValues.restore();
//			this.stubSelectRowInTreeTable.restore();
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("When click on selectable row in a tree table ", function(assert) {
//		assert.expect(11); // more in beforeEach
//		// Prove that the click event calls _selectRowInTreeTable and uiInstance.selectionChanged.
//		//arrange
//		var oExpectedParameter = this.oTreeTableRepresentation.getParameter();
//		assert.deepEqual(this.oRequiredParameter, oExpectedParameter, "Then correct parameter is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getSelectionMode(), SelectionMode.MultiToggle, "Then selection mode is set according to required filter in the tree table");
//		assert.strictEqual(this.spyAttachBatchRequestCompleted.called, true, "then spyAttachBatchRequestCompleted is called for the treetable");
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act - select a row
//		clickRow(tableId, 0);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 1, "THEN stubSelectRowInTreeTable is called ");
//		assert.strictEqual(this.spySelectionChanged.callCount, 1, "AND in turn spySelectionChanged is called ");
//		//act - select a second row
//		clickRow(tableId, 1);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 2, "THEN stubSelectRowInTreeTable is called again");
//		assert.strictEqual(this.spySelectionChanged.callCount, 2, "AND in turn spySelectionChanged is called again");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 2, "Then Filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[1], "Customer: CG04", "Then Filter expression CG04 is set on the tree table");
//	});
//	QUnit.test("When click on selectable row AND reversing by clicking again ", function(assert) {
//		assert.expect(5); // more in beforeEach
//		// Prove that both click events reverse the selection
//		//arrange
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act - select a row
//		clickRow(tableId, 0);
//		//act - select reverse
//		clickRow(tableId, 0);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 2, "THEN stubSelectRowInTreeTable is called 3 times");
//		assert.strictEqual(this.spySelectionChanged.callCount, 2, "AND in turn spySelectionChanged is called 3 times");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0,
//			"Then Filter expression is removed from the tree table");
//	});
//	QUnit.test("When click on row 0, click row 1 AND reversing by click row 0", function(assert) {
//		assert.expect(6); // more in beforeEach
//		//arrange
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act - select a row
//		clickRow(tableId, 0);
//		clickRow(tableId, 1);
//		//act - select reverse
//		clickRow(tableId, 0);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 3, "THEN stubSelectRowInTreeTable is called 3 times");
//		assert.strictEqual(this.spySelectionChanged.callCount, 3, "AND in turn spySelectionChanged is called 3 times");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then Filter expression is removed from the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG04", "Then Filter expression CG04 is left on the tree table");
//	});
//	QUnit.test("When setSelectedIndex and addSelectionInterval", function(assert) {
//		assert.expect(13); // more in beforeEach
//		// prove that the event handler _selectRowInTreeTable is called.
//		// Prove that calling _selectRowInTreeTable creates corresponding filter values.
//		// arrange
//		var oExpectedParameter = this.oTreeTableRepresentation.getParameter();
//		assert.deepEqual(this.oRequiredParameter, oExpectedParameter, "Then correct parameter is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getSelectionMode(), SelectionMode.MultiToggle, "Then selection mode is set according to required filter in the tree table");
//		assert.strictEqual(this.spyAttachBatchRequestCompleted.called, true, "then spyAttachBatchRequestCompleted is called for the treetable");
//		//act - select a row
//		this.oTreeTableRepresentation.oTreeTable.setSelectedIndex(0);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 1, "THEN stubSelectRowInTreeTable is called ");
//		assert.strictEqual(this.spySelectionChanged.callCount, 1, "then spySelectionChanged is called ");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then Filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG01", "Then Filter expression CG01 is set on the tree table");
//		assert.strictEqual(this.spyCreateFilterFromSelectedValues.called, false, "then createFilterFromSelectedValues is not called from the selection event");
//		//act - select a second row
//		this.oTreeTableRepresentation.oTreeTable.addSelectionInterval(0,1);
//		//assert
//		assert.strictEqual(this.stubSelectRowInTreeTable.callCount, 2, "THEN stubSelectRowInTreeTable is called again");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 2, "Then Filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[1], "Customer: CG04", "Then Filter expression CG04 is set on the tree table");
//		// //act - toggle the selection
//		// this.oTreeTableRepresentation.oTreeTable.removeSelectionInterval(0,1);
//		// this.oTreeTableRepresentation.oTreeTable.setSelectedIndex(1);
//		// //assert
//		// assert.strictEqual(this.spySelectionChanged.callCount, 3, "then selectionChanged is called ");
//		// assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then Filter expression is removed from the tree table");
//		// assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG04", "Then Filter expression CG04 is left on the tree table");
//	});
//	QUnit.test("When filter property label to be fetched from metadata", function(assert) {
//		//action
//		var sFilterLabel = this.oTreeTableRepresentation.getSelectedFilterPropertyLabel("Customer");
//		assert.strictEqual(sFilterLabel, "Customer", "then it returns customer hierarchy node");
//	});
//	QUnit.module("Tree Table Unit Tests - with a required single filter with display option as text", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilter();
//			commonSetup(assert, this, true, true);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("When selection is changed in the treetable - single selection", function(assert) {
//		assert.expect(12); // 1 in beforeEach
//		//arrange
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		var oExpectedParameter = this.oTreeTableRepresentation.getParameter();
//		var spySelectionChanged = sinon.spy(this.oTreeTableRepresentation.oApi, "selectionChanged");
//		assert.deepEqual(this.oRequiredParameter, oExpectedParameter, "Then correct parameter is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getSelectionMode(), SelectionMode.Single, "Then selection mode is single");
//		assert.strictEqual(this.spyAttachBatchRequestCompleted.called, true, "then spyAttachBatchRequestCompleted is called for the treetable");
//		//act - select a row
//		//act
//		clickRow(tableId, 0);
//		sap.ui.getCore().applyChanges();
//		//assert
//		assert.strictEqual(spySelectionChanged.called, true, "then spySelectionChanged is called when selection is changed");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then Filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG01", "Then Filter expression CG01 is set on the tree table");
//		//act - select a second row
//		clickRow(tableId, 1);
//		//assert
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then second selection replaced first selection");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG04", "Then Filter expression CG04 is set on the tree table");
//		sap.ui.getCore().applyChanges();
//		//act - toggle the selection
//		clickRow(tableId, 1);
//		//assert
//		assert.strictEqual(spySelectionChanged.called, true, "then selectionChanged is called when selection is changed");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then Filter expression is removed from the tree table");
//		spySelectionChanged.restore();
//	});
//	QUnit.module("Tree Table Unit Tests - without a required filter with display option as key", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRep();
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("When treeTable without a required filter is initialized", function(assert) {
//		// arrange
//		var oExpectedParameter = this.oTreeTableRepresentation.getParameter();
//		// assert
//		assert.strictEqual(this.spyAttachBatchRequestCompleted.called, true, "then spyAttachBatchRequestCompleted is called for the treetable");
//		assert.deepEqual(this.oRequiredParameter, oExpectedParameter, "Then correct parameter is set on the tree table");
//		//check the header for tree table
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[0].getLabel().getText(), entityTypeMetadata().getPropertyMetadata("Customer").label, "Then correct header is set to the first column");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[1].getLabel().getText(), entityTypeMetadata().getPropertyMetadata("Customer_NodeText").label, "Then correct header is set to the second column");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[2].getLabel().getText(), entityTypeMetadata().getPropertyMetadata("Revenue").label, "Then correct header is set to the third column");
//		//check columns for tree table
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[0].getTemplate().getBindingPath("text"), "Customer_NodeIDExt", "Then correct property bound to the first column");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[1].getTemplate().getBindingPath("text"), "Customer_NodeText", "Then correct property bound to the second column");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[2].getTemplate().getBindingPath("text"), "Revenue", "Then correct property bound to the third column");
//		//selection mode of treetable
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getSelectionMode(), SelectionMode.None, "Then selection mode is set according to required filter in the tree table");
//		//check the header for table
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[0].getHAlign(), "Begin", "Then since Customer is a dimension property so HAlign is set it as Begin");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getColumns()[2].getHAlign(), "End", "Then since Revenue is a measure property so HAlign is set it as End");
//		//visible row count mode
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getVisibleRowCountMode(), VisibleRowCountMode.Auto, "then correct visible count row mode is set to the table");
//		assert.strictEqual(this.oTreeTableRepresentation.oTreeTable.getSelectionMode(), SelectionMode.None, "Then selection mode is set to None");
//	});
//	QUnit.test("When getPrintContent is called for the treeTable", function(assert) {
//		var printContent = this.oTreeTableRepresentation.getPrintContent();
//		assert.strictEqual(printContent.oRepresentation instanceof UITreeTable, true, "Then getPrintContent returns a treetable");
//	});
//	QUnit.test("When treeTable is destroyed", function(assert) {
//		//act
//		this.oTreeTableRepresentation.destroy();
//		//assert
//		_checkForTreeTableInstanceAfterDestroy(assert, this.oTreeTableRepresentation);
//	});
//	QUnit.test("When treeTable is destroyed and onAfterRendering is called for treeTable", function(assert) {
//		//arrange
//		//act
//		this.oTreeTableRepresentation.destroy();
//		this.mainContent.rerender();
//		//assert
//		_checkForTreeTableInstanceAfterDestroy(assert, this.oTreeTableRepresentation);
//	});
//	QUnit.module("Get Filter", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilter();
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("No selection", function(assert) {
//		//act
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.ok(filter.getInternalFilter().isEmpty(), "Filter is empty");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then no filter expression is set on the tree table");
//	});
//	QUnit.test("Selection set in UI", function(assert) {
//		assert.expect(6); // more in beforeEach
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act
//		clickRow(tableId, 0);
//		//assert
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on tree table");
//	});
//	QUnit.test("Selection set in from selection validation request", function(assert) {
//		//setup
//		this.oTreeTableRepresentation.removeAllSelection();
//		var spySelectionChanged = sinon.spy(this.oTreeTableRepresentation.oApi, "selectionChanged");
//		this.oTreeTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection([ "Customer: CG05" ]);
//		//assert setup
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on the tree table");
//		//act
//		this.oTreeTableRepresentation.setFilterValues([ {
//			"Customer_NodeID" : "Customer: CG02"
//		} ]);
//		filter = this.oTreeTableRepresentation.getFilter();
//		//asert
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG02%27)", "Filter value from selection validation request is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then two filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG02", "Then correct filter is set on the tree table");
//		spySelectionChanged.restore();
//	});
//	QUnit.test("Selection handed over when switching representations", function(assert) {
//		var secondTreeTable = new TreeTable(this.interfaceProxy, this.oRequiredParameter);
//		this.oTreeTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection([ "Customer: CG01" ]);
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG01%27)", "TreeTable 1 has a value selected");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then two filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG01", "Then correct filter is set on tree table");
//		var secondFilter = secondTreeTable.getFilter();
//		assert.strictEqual(secondFilter.getInternalFilter().toUrlParam(), "", "TreeTable 2 has no value selected");
//		//act
//		secondTreeTable.adoptSelection(this.oTreeTableRepresentation);
//		//assert
//		secondFilter = secondTreeTable.getFilter();
//		assert.strictEqual(secondFilter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG01%27)", "TreeTable 2 has adopted the selection");
//	});
//	QUnit.test("Remove selection", function(assert) {
//		//act
//		this.oTreeTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection([ "Customer: CG05", "Customer: CG01" ]);
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "((Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)%20or%20(Customer_NodeID%20eq%20%27Customer%3a%20CG01%27))", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 2, "Then two filter expression is set on the tree table");
//		//remove selection
//		this.oTreeTableRepresentation.removeAllSelection();
//		assert.strictEqual(this.oTreeTableRepresentation.getFilter().getInternalFilter().toUrlParam(), "", "No filter is available");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then no filter expression is set on the tree table");
//	});
//	QUnit.module("Update TreeTable and bind rows", {
//		beforeEach : function() {
//			var that = this;
//			this.bindRowsCalled = false;
//			var oApi = _getOApi();
//			this.treeTable = new TreeTable(oApi, {
//				requiredFilters : []
//			});
//			this.treeTable.oTreeTable = {
//				bindRows : function() {
//					that.bindRowsCalled = true;
//				}
//			};
//		}
//	});
//	QUnit.test("Called with changed filter", function(assert) {
//		this.treeTable.updateTreetable("ControlObject", "ODataModel", "Metadata", true);
//		assert.strictEqual(this.bindRowsCalled, true, "BindRows on treeTable called");
//		assert.strictEqual(this.treeTable.oTreeTableModel, "ODataModel", "oDataModel set to treeTable");
//		assert.strictEqual(this.treeTable.oTreeTableControlObject, "ControlObject", "ControlObject set to treeTable");
//		assert.strictEqual(this.treeTable.metadata, "Metadata", "Metadata set to treeTable");
//	});
//	QUnit.test("Called without changed filter", function(assert) {
//		this.treeTable.updateTreetable("ControlObject", "ODataModel", "Metadata", false);
//		assert.strictEqual(this.bindRowsCalled, false, "BindRows on treeTable not called");
//		assert.strictEqual(this.treeTable.oTreeTableModel, "ODataModel", "oDataModel set to treeTable");
//		assert.strictEqual(this.treeTable.oTreeTableControlObject, "ControlObject", "ControlObject set to treeTable");
//		assert.strictEqual(this.treeTable.metadata, "Metadata", "Metadata set to treeTable");
//	});
//	QUnit.module("Get Filter - UI selection event", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilterText();
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("No selection", function(assert) {
//		//act
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.ok(filter.getInternalFilter().isEmpty(), "Filter is empty");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then no filter expression is set on the tree table");
//	});
//	QUnit.test("Selection set in UI", function(assert) {
//		assert.expect(8); // 2 in beforeEach
//		//arrange
//		var spy = sinon.spy(this.oTreeTableRepresentation.oPaginationDisplayOptionHandler, "getDisplayNameForPaginatedFilter");
//		var aSelectedValue = [ {
//			"id" : "Customer: CG05",
//			"text" : "All Customers"
//		} ];
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act
//		clickRow(tableId, 0);
//		//assert
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on tree table");
//		assert.deepEqual(this.oTreeTableRepresentation.getSelections(), aSelectedValue, "text value is set for selection");
//		assert.ok(spy.args[0][4].getPropertyMetadata, "THEN entity metadata has been handed over when calling getDisplayNameForPaginatedFilter");
//		spy.restore();
//	});
//	QUnit.module("Get Selections without requiredFilterOptions", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilterText();
//			delete this.oRequiredParameter.requiredFilterOptions;
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("Selection set in UI", function(assert) {
//		assert.expect(8); // more in beforeEach
//		//arrange
//		var spy = sinon.spy(this.oTreeTableRepresentation.oPaginationDisplayOptionHandler, "getDisplayNameForPaginatedFilter");
//		var aSelectedValue = [ {
//			"id" : "Customer: CG05",
//			"text" : "CG05"
//		} ];
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act
//		clickRow(tableId, 0);
//		//assert
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on tree table");
//		assert.deepEqual(this.oTreeTableRepresentation.getSelections(), aSelectedValue, "Then the displayProperty Value is used for the selectionInformation");
//		assert.ok(spy.args[0][4].getPropertyMetadata, "THEN entity metadata has been handed over when calling getDisplayNameForPaginatedFilter");
//		spy.restore();
//	});
//	QUnit.module("Get Filter - with Text display option", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilterText();
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("No selection", function(assert) {
//		//act
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.ok(filter.getInternalFilter().isEmpty(), "Filter is empty");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then no filter expression is set on the tree table");
//	});
//	QUnit.test("Selection set in from selection validation request", function(assert) {
//		//arrange
//		var aSelectedValue = [ {
//			"id" : "Customer: CG02",
//			"text" : "All Customers"
//		} ];
//		this.oTreeTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection([ "Customer: CG05" ]);
//		//assert setup
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on tree table");
//		//act
//		this.oTreeTableRepresentation.setFilterValues([ {
//			"Customer_NodeID" : "Customer: CG02",
//			"Customer_NodeText" : "All Customers"
//		} ]);
//		filter = this.oTreeTableRepresentation.getFilter();
//		//asert
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG02%27)", "Filter value from selection validation request is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then two filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG02", "Then correct filter is set on tree table");
//		assert.deepEqual(this.oTreeTableRepresentation.getSelections(), aSelectedValue, "text value is set for selection");
//	});
//	QUnit.module("Get Filter - with Key/Text display option", {
//		beforeEach : function(assert) {
//			var representationHelper = RepresentationHelper.prototype;
//			this.oRequiredParameter = representationHelper.representatationDataForTreeTableRepWithFilterKeyText();
//			commonSetup(assert, this, false);
//		},
//		afterEach : function() {
//			commonTeardown(this);
//		}
//	});
//	QUnit.test("No selection", function(assert) {
//		//act
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.ok(filter.getInternalFilter().isEmpty(), "Filter is empty");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 0, "Then no filter expression is set on the tree table");
//	});
//	QUnit.test("Selection set in UI", function(assert) {
//		assert.expect(7); // more in beforeEach
//		//arrange
//		var aSelectedValue = [ {
//			"id" : "Customer: CG05",
//			"text" : "All Customers (CG05)"
//		} ];
//		var tableId = this.oTreeTableRepresentation.oTreeTable.sId;
//		//act
//		clickRow(tableId, 0);
//		//assert
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on the tree table");
//		assert.deepEqual(this.oTreeTableRepresentation.getSelections(), aSelectedValue, "text value is set for selection");
//	});
//	QUnit.test("Selection set in from selection validation request", function(assert) {
//		//arrange
//		this.oTreeTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection([ "Customer: CG05" ]);
//		//assert setup
//		var filter = this.oTreeTableRepresentation.getFilter();
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Filter value from selection is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then one filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG05", "Then correct filter is set on the tree table");
//		//act
//		this.oTreeTableRepresentation.setFilterValues([ {
//			"Customer_NodeID" : "Customer: CG02",
//			"Customer_NodeText" : "All Customers",
//			"Customer_NodeIDExt" : "CG02"
//		} ]);
//		var aSelectedValue = [ {
//			"id" : "Customer: CG02",
//			"text" : "All Customers (CG02)"
//		} ];
//		filter = this.oTreeTableRepresentation.getFilter();
//		//asert
//		assert.ok(filter instanceof Filter, "Filter object returned");
//		assert.strictEqual(filter.getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG02%27)", "Filter value from selection validation request is returned");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues().length, 1, "Then two filter expression is set on the tree table");
//		assert.strictEqual(this.oTreeTableRepresentation.oRepresentationFilterHandler.getFilterValues()[0], "Customer: CG02", "Then correct filter is set on the tree table");
//		assert.deepEqual(this.oTreeTableRepresentation.getSelections(), aSelectedValue, "text value is set for selection");
//	});
//	QUnit.module("Integration with pathUpdate and hierarchical step");
//	QUnit.test("test", function(assert) {
//		var done = assert.async();
//		var apfTreeTable, setFilterValuesSpy, api, instances, oModel, ui5TreeTable;
//		//setup is done in test, because separating it messes with the mockserver
//		setup();
//		function setup(){
//			createUiApiAsPromise().done(function(oInstances) {
//				instances = oInstances;
//				api = instances.oApi;
//				_mockServer.mockHierarchyService();
//				api.createStep("hierarchicalStep", function(){
//					var hierarchicalStep = api.getSteps()[0];
//					apfTreeTable = hierarchicalStep.getBinding().getSelectedRepresentation();
//					assert.deepEqual(apfTreeTable.oTreeTableControlObject, {
//						"parameters": {
//							"operationMode": "Server",
//							"select": "Customer,Customer_NodeID,Customer_NodeIDExt,Customer_ParentID,Customer_Level,Customer_Drillstate,Revenue,Customer_NodeText",
//							"treeAnnotationProperties": {
//								"hierarchyDrillStateFor": "Customer_Drillstate",
//								"hierarchyLevelFor": "Customer_Level",
//								"hierarchyNodeExternalKeyFor": "Customer_NodeIDExt",
//								"hierarchyNodeFor": "Customer_NodeID",
//								"hierarchyParentNodeFor": "Customer_ParentID"
//							},
//							"useServerSideApplicationFilters": true
//						},
//						"path": "/RevenueHryQuery(P_Currency=%27USD%27)/Results",
//						"sorter": undefined
//					}, "ControlObject in pathUpdate (when creating step) correctly set");
//					var mainContent = apfTreeTable.getMainContent();
//					ui5TreeTable = apfTreeTable.oTreeTable;
//					oModel = ui5TreeTable.getModel();
//					var onComplete = function() {
//						oModel.detachBatchRequestCompleted(onComplete);
//						actAndAssert();
//					};
//					oModel.attachBatchRequestCompleted(onComplete);
//					_placeTableAtDom(mainContent);
//					sap.ui.getCore().applyChanges();
//				}, "treeTable");
//			});
//		}
//		function actAndAssert(){
//			apfTreeTable.setFilterValues([{
//				"Customer_NodeID" : "1007" //Leaf that is not inside US
//			}, {
//				"Customer_NodeID" : "Customer: CG05" //node
//			}]);
//			//assert initial filter state
//			assert.strictEqual(apfTreeTable.getFilter().getInternalFilter().toUrlParam(), "((Customer_NodeID%20eq%20%271007%27)%20or%20(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27))", "Correct filter initially returned from getFilter");
//
//			setFilterValuesSpy = sinon.spy(apfTreeTable, "setFilterValues");
//			//trigger path update with new filter
//			var filter = api.createFilter();
//			filter.getTopAnd().addExpression({
//				name : "Country",
//				value : "US",
//				operator : "EQ"
//			});
//			api.addPathFilter(filter);
//			oModel.attachBatchRequestCompleted(teardown);
//			api.updatePath(function(){
//				assert.deepEqual(setFilterValuesSpy.getCalls()[0].args[0], [{
//					"Customer_NodeID" : "Customer: CG05",
//					"Customer_NodeText" : "All Customers",
//					"Customer_NodeIDExt": "CG05",
//					"__metadata": {
//						"id": "/tmp/demokit/hierarchy.xsodata/RevenueHryQueryResults('95233199766078517')",
//						"type": "tmp.demokit.demokit.RevenueHryQueryResultsType",
//						"uri": "/tmp/demokit/hierarchy.xsodata/RevenueHryQueryResults('95233199766078517')"
//					}
//				}], "Filter values from selectionValidationRequest set correctly");
//				assert.strictEqual(apfTreeTable.getFilter().getInternalFilter().toUrlParam(), "(Customer_NodeID%20eq%20%27Customer%3a%20CG05%27)", "Correct filter returned from getFilter");
//				assert.deepEqual(apfTreeTable.getSelections(), [{
//					id : "Customer: CG05",
//					text : "All Customers (CG05)"
//				}], "Correct selection information returned");
//			});
//		}
//		function teardown(){
//			setTimeout(function(){
//				assert.deepEqual(ui5TreeTable.getSelectedIndices(), [0], "First entry is selected in ui");
//				setFilterValuesSpy.restore();
//				_mockServer.teardownMockserver();
//				apfTreeTable.destroy();
//				instances.oComponent.destroy();
//				instances.oCompContainer.destroy();
//				done();
//			}, 100);
//		}
//	});
//});
