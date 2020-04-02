jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.require("sap.apf.modeler.ui.utils.APFTree");
jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
sap.ui.getCore().loadLibrary('sap.m');
(function() {
	'use strict';
	QUnit.module("APFTree - Unit Test", {
		beforeEach : function() {
			var persistenceConfiguration = {};
			this.oCoreApi = new sap.apf.modeler.core.Instance(persistenceConfiguration);
			this.oTreeInstance = new sap.apf.modeler.ui.utils.APFTree();
			this.oTreeInstance.setMode("SingleSelectMaster");
			this.oModel = new sap.ui.model.json.JSONModel({
				aConfigDetails : [ {
					AnalyticalConfiguration : "configId",
					Application : "appId",
					bIsLoaded : true,
					bToggleState : false,
					expanded : false,
					hasExpander : true,
					isSelected : false,
					name : "Test Configuration 1",
					selectable : true,
					type : "configuration",
					configData : [ {
						expanded : false,
						selectable : true,
						name : "Facet Filters",
						filters : [ {
							expanded : false,
							id : "facetFilterid",
							isSelected : true,
							name : "From Date",
							selectable : true,
							type : "facetFilter"
						} ]
					}, {
						expanded : false,
						selectable : false,
						name : "Categories",
						categories : [ {
							expanded : false,
							id : "categoryid",
							isSelected : false,
							name : "Time",
							selectable : true,
							type : "category",
							steps : [ {
								expanded : false,
								id : "stepId",
								isSelected : false,
								name : "Revenue Over Time",
								selectable : true,
								type : "step",
								representations : [ {
									expanded : false,
									icon : "sap-icon://bar-chart",
									id : "repId",
									isSelected : false,
									name : "Column Chart",
									selectable : true,
									type : "representation"
								} ]
							} ]
						}, {
							expanded : false,
							id : "categoryid1",
							isSelected : false,
							name : "Revenue",
							selectable : true,
							type : "category",
							steps : []
						} ]
					}, {
						expanded : false,
						selectable : false,
						name : "navTargets",
						navTargets : [ {
							expanded : false,
							id : "NavigationTarget-1",
							isSelected : false,
							name : "Execute APF Configuration",
							selectable : true,
							type : "navigationTarget"
						}, {
							expanded : false,
							id : "NavigationTarget-2",
							isSelected : false,
							name : "UserInputSemanticObject",
							selectable : true,
							type : "navigationTarget"
						} ]
					} ]
				}, {
					AnalyticalConfiguration : "configId1",
					Application : "appId1",
					bIsLoaded : true,
					bToggleState : false,
					expanded : false,
					hasExpander : true,
					isSelected : false,
					name : "Test Configuration 2",
					selectable : true,
					type : "configuration",
					configData : []
				} ]
			});
			this.oTreeInstance.setModel(this.oModel);
			var oTreeNodeTemplate = new sap.m.StandardTreeItem({});
			oTreeNodeTemplate.bindProperty("title", "name");
			oTreeNodeTemplate.bindProperty("icon", "icon");
			this.oTreeInstance.bindAggregation("items", "/aConfigDetails", oTreeNodeTemplate);
			this.oTreeInstance.placeAt("content");
		},
		afterEach : function() {
			return;
		}
	});
	QUnit.test("Availability of tree instance", function(assert) {
		assert.ok(this.oTreeInstance, "APFTree Instance available");
	});
	QUnit.test("Test availability of API's exposed by APFTree control", function(assert) {
		assert.ok(typeof this.oTreeInstance.setTranslationFunction === "function", "setTranslationFunction function available");
		assert.ok(typeof this.oTreeInstance.setDefaultRepresentationType === "function", "setDefaultRepresentationType function available");
		assert.ok(typeof this.oTreeInstance.getAPFTreeNodeContext === "function", "getAPFTreeNodeContext function available");
		assert.ok(typeof this.oTreeInstance.getParentNodeContext === "function", "getParentNodeContext function available");
		assert.ok(typeof this.oTreeInstance.isConfigurationSwitched === "function", "isConfigurationSwitched function available");
		assert.ok(typeof this.oTreeInstance.removeSelectionOnTree === "function", "removeSelectionOnTree function available");
		assert.ok(typeof this.oTreeInstance.setSelectionOnTree === "function", "setSelectionOnTree function available");
		assert.ok(typeof this.oTreeInstance._scrollTreeToNewNode === "function", "_scrollTreeToNewNode function available");
		assert.ok(typeof this.oTreeInstance.setSelectedNode === "function", "setSelectedNode function available");
		//assert.ok(typeof this.oTreeInstance._getObjectNodesArray === "function", "_getObjectNodesArray function available");
		assert.ok(typeof this.oTreeInstance.addNodeInTree === "function", "addNodeInTree function available");
		assert.ok(typeof this.oTreeInstance._addconfiguration === "function", "_addconfiguration function available");
		assert.ok(typeof this.oTreeInstance._addfacetFilter === "function", "_addfacetFilter function available");
		assert.ok(typeof this.oTreeInstance._addcategory === "function", "_addcategory function available");
		assert.ok(typeof this.oTreeInstance._addstep === "function", "_addstep function available");
		assert.ok(typeof this.oTreeInstance._addrepresentation === "function", "_addrepresentationa function available");
	});
	QUnit.test("setTranslationFunction Test", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		assert.equal(this.oTreeInstance.fnTranslationFunction, this.oCoreApi.getText, "Translation function available for APFTree");
	});
	QUnit.test("setDefaultRepresentationType Test", function(assert) {
		this.oTreeInstance.setDefaultRepresentationType("Column Chart");
		assert.equal(this.oTreeInstance.defaultRepresentationType, "Column Chart", "Default representation set correctly");
	});
	QUnit.test("getAPFTreeNodeContext Test - with invalid node ", function(assert) {
		var nodeContext = this.oTreeInstance.getAPFTreeNodeContext(undefined);
		assert.equal(nodeContext, null, "Node context is null when node passed to getAPFTreeNodeContext method is invalid");
	});
	QUnit.test("getAPFTreeNodeContext Test - with valid Configuration node ", function(assert) {
		var expectedContext = {
			nodeAPFId : "configId",
			nodeContext : "/aConfigDetails/0",
			nodeObjectType : "configuration",
			nodeTitle : "Test Configuration 1",
			oNode : this.oTreeInstance.getItems()[0]
		};
		var oNode = this.oTreeInstance.getItems()[0];
		var nodeContext = this.oTreeInstance.getAPFTreeNodeContext(oNode);
		assert.deepEqual(nodeContext, expectedContext, "Correct node context returned for the configuration node");
	});
	QUnit.test("getAPFTreeNodeContext Test - with any valid subview node ", function(assert) {
		this.oTreeInstance.expandToLevel(2);
		var expectedContext = {
			nodeAPFId : "categoryid",
			nodeContext : "/aConfigDetails/0/configData/1/categories/0",
			nodeObjectType : "category",
			nodeTitle : "Time",
			oNode : this.oTreeInstance.getItems()[4]
		};
		var nodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[4]);
		assert.deepEqual(nodeContext, expectedContext, "Correct node context returned for the subview node(Eg - category node)");
	});
	QUnit.test("getParentNodeContext Test - by passing null context details to the method", function(assert) {
		var parentNodeContext = this.oTreeInstance.getParentNodeContext(null);
		assert.deepEqual(parentNodeContext, undefined, "Parent Node context is undefined when null node details are passed");
	});
	QUnit.test("getParentNodeContext Test - by passing configuration node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var configNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[0]);
		var configParentNodeContext = this.oTreeInstance.getParentNodeContext(configNodeContext);
		assert.deepEqual(configParentNodeContext, expectedContext, "Proper Parent Node context of configuration node returned");
	});
	QUnit.test("getParentNodeContext Test - by passing facet filter node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			facetFilterId : "facetFilterid",
			configId : "configId",
			configurationName : "Test Configuration 1",
			facetFilterName : "From Date"
		};
		var expand = this.oTreeInstance.expandToLevel(2);
		var facetFilterNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[2]);
		var facetFilterParentNodeContext = this.oTreeInstance.getParentNodeContext(facetFilterNodeContext);
		assert.deepEqual(facetFilterParentNodeContext, expectedContext, "Proper Parent Node context of facet filter node returned");
	});
	QUnit.test("getParentNodeContext Test - by passing category node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			categoryId : "categoryid",
			configId : "configId",
			configurationName : "Test Configuration 1",
			categoryName : "Time"
		};
		var expand = this.oTreeInstance.expandToLevel(2);
		var categoryNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[4]);
		var categoryParentNodeContext = this.oTreeInstance.getParentNodeContext(categoryNodeContext);
		assert.deepEqual(categoryParentNodeContext, expectedContext, "Proper Parent Node context of category node returned");
	});
	QUnit.test("getParentNodeContext Test - by passing step node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			configId : "configId",
			categoryId : "categoryid",
			stepId : "stepId",
			configurationName : "Test Configuration 1",
			categoryName : "Time",
			stepName : "Revenue Over Time"
		};
		var expand = this.oTreeInstance.expandToLevel(3);
		var stepNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[5]);
		var stepParentNodeContext = this.oTreeInstance.getParentNodeContext(stepNodeContext);
		assert.deepEqual(stepParentNodeContext, expectedContext, "Proper Parent Node context of step node returned");
	});
	QUnit.test("getParentNodeContext Test - by passing representation node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			categoryId : "categoryid",
			categoryName : "Time",
			configId : "configId",
			configurationName : "Test Configuration 1",
			representationId : "repId",
			representationName : "Column Chart",
			stepId : "stepId",
			stepName : "Revenue Over Time"
		};
		var expand = this.oTreeInstance.expandToLevel(4);
		var repNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[6]);
		var repParentNodeContext = this.oTreeInstance.getParentNodeContext(repNodeContext);
		assert.deepEqual(repParentNodeContext, expectedContext, "Proper Parent Node context of representation node returned");
	});
	QUnit.test("getParentNodeContext Test - by passing navigation target node details  ", function(assert) {
		var expectedContext = {
			appId : "appId",
			configId : "configId",
			configurationName : "Test Configuration 1",
			navTargetId : "NavigationTarget-1",
			navTargetName : "Execute APF Configuration"
		};
		var expand = this.oTreeInstance.expandToLevel(2);
		var navigationTargetNodeContext = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getItems()[7]);
		var navigationTargetParentNodeContext = this.oTreeInstance.getParentNodeContext(navigationTargetNodeContext);
		assert.deepEqual(navigationTargetParentNodeContext, expectedContext, "Proper Parent Node context of navigation target node returned");
	});
	QUnit.test("isConfigurationSwitched Test - when current node and previous selected node are same", function(assert) {
		var currentSelectedNode = this.oTreeInstance.getItems()[0];
		var previousSelectedNode = this.oTreeInstance.getItems()[0];
		var isConfigSwitched = this.oTreeInstance.isConfigurationSwitched(previousSelectedNode, currentSelectedNode);
		assert.deepEqual(isConfigSwitched, false, "Configuration is not switched when current selected node and previous selected node are same");
	});
	QUnit.test("isConfigurationSwitched Test - when current node and previous selected node are different", function(assert) {
		var currentSelectedNode = this.oTreeInstance.getItems()[1];
		var previousSelectedNode = this.oTreeInstance.getItems()[0];
		var isConfigSwitched = this.oTreeInstance.isConfigurationSwitched(previousSelectedNode, currentSelectedNode);
		assert.deepEqual(isConfigSwitched, true, "Configuration is switched when current selected node and previous selected node are different.");
	});
	QUnit.test("removeSelectionOnTree Test - when no selected node is passed to the function", function(assert) {
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[0]);
		this.oTreeInstance.removeSelectionOnTree();
		assert.deepEqual(this.oTreeInstance.getSelectedItem(), null, "Selection has been removed from the tree");
	});
	QUnit.test("removeSelectionOnTree Test - when selected node is passed to the function", function(assert) {
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[0]);
		this.oTreeInstance.removeSelectionOnTree(this.oTreeInstance.getItems()[0]);
		assert.deepEqual(this.oTreeInstance.getSelectedItem(), null, "Selection has been removed from the tree");
		assert.deepEqual(this.oTreeInstance.getItems()[0].isSelected(), false, "Selection property of selected node has been set to false");
	});
	QUnit.test("setSelectionOnTree Test", function(assert) {
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[1]);//config node 1 is already selected
		this.oTreeInstance.setSelectionOnTree(this.oTreeInstance.getItems()[0].getBindingContext().sPath);//select config node 0
		assert.deepEqual(this.oTreeInstance.getSelectedItem(), this.oTreeInstance.getItems()[0], "Selection set properly on the tree");
	});
	QUnit.test("setSelectedNode Test", function(assert) {
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[1]);
		assert.deepEqual(this.oTreeInstance.getSelectedItem(), this.oTreeInstance.getItems()[1], "Selection set correctly on to the tree");
	});
	QUnit.test("addNodeInTree Test - Adding a configuration node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[0]);
		this.oTreeInstance.addNodeInTree("configuration", {});
		assert.equal(this.oModel.getData().aConfigDetails.length, 3, "A new configuration added successfully into the tree");
	});
	QUnit.test("addNodeInTree Test - Adding a  facet filter node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(2);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[1]);
		this.oTreeInstance.addNodeInTree("facetFilter", {});
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[0].filters.length, 2, "A new facetfilter node added successfully into the tree");
	});
	QUnit.test("addNodeInTree Test - Adding a category node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(2);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[3]);
		this.oTreeInstance.addNodeInTree("category", {});
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories.length, 3, "A new category added successfully into the tree");
	});
	QUnit.test("addNodeInTree Test - Adding a new step node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(3);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[5]);//to add a step selection on tree should be a category
		this.oTreeInstance.addNodeInTree("step", false, false);
		var aStepsInConfig = this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps;
		assert.equal(aStepsInConfig.length, 2, "A new step added successfully into the tree");
		assert.equal(aStepsInConfig[aStepsInConfig.length - 1].bIsHierarchicalStep, false, "then the type is not set to hierarchical");
	});
	QUnit.test("addNodeInTree Test - Adding a new hierarchical step node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(3);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[5]);//to add a step selection on tree should be a category
		this.oTreeInstance.addNodeInTree("step", false, true);
		var aStepsInConfig = this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps;
		assert.equal(aStepsInConfig.length, 2, "A new hierarchical step added successfully into the tree");
		assert.equal(aStepsInConfig[aStepsInConfig.length - 1].bIsHierarchicalStep, true, "then the type is set to hierarchical");
	});
	QUnit.test("addNodeInTree Test - Adding an existing step into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(2);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[5]);//to add a step selection on tree should be a category
		var params = {
			aExistingStepsToBeAdded : [ {
				noOfReps : 1,
				representations : [ {
					id : "repId",
					name : "Column Chart"
				} ],
				step : {
					id : "stepId",
					name : "Revenue Over Time"
				}
			} ],
			noOfSteps : 1
		};
		this.oTreeInstance.addNodeInTree("step", params);
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[1].steps.length, 1, "An existing step with representation added successfully into the the second category of first configuration");
	});
	QUnit.test("addNodeInTree Test - Adding a representation node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(4);
		this.oTreeInstance.setDefaultRepresentationType("Column Chart");
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[6]);//to add a representation selection on tree should be a step
		this.oTreeInstance.addNodeInTree("representation", undefined);
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations.length, 2, "A new representation added successfully into the tree");
	});
	QUnit.test("addNodeInTree Test - Adding a navigation target node into the tree", function(assert) {
		this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
		this.oTreeInstance.expandToLevel(2);
		this.oTreeInstance.setSelectedItem(this.oTreeInstance.getItems()[7]);
		this.oTreeInstance.addNodeInTree("navigationTarget", {});
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[2].navTargets.length, 3, "A new navigation target added successfully into the tree");
	});
}());