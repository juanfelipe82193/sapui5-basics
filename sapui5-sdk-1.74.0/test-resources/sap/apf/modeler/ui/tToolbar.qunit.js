sap.ui.define("sap.apf.modeler.ui.tToolbar.qunit",[
	"sap/apf/testhelper/modelerUIHelper",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",
	"sap/ui/qunit/qunit-coverage"
],function(modelerUIHelper) {
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFRouter');
	jQuery.sap.require('sap.apf.modeler.ui.utils.navigationHandler');
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFTree');

	'use strict';
	function doNothing() {
	}
	QUnit.module("Toolbar unit tests", {
		beforeEach : function(assert) {
			var that = this;
			var done1 = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				that.oModelerInstance = oModelerInstance;//Modeler instance from callback
				oModelerInstance.textPool.setTextAsPromise = function(sTitle) {
					var deferred = jQuery.Deferred();
					setTimeout(function() {
						deferred.resolve(sTitle);
					}, 1);
					return deferred;
				};
				that.oGetRouterStub = function() {
					var obj = {};
					obj.navTo = doNothing;
					return obj;
				};
				that.navigateToDifferntViewStub = doNothing;
				that.isSavedStub = function() {
					return true;
				};
				that.getSPathFromURLStub = function(params) {
					var obj = {};
					if (params.arguments.stepId) {
						obj.sPath = "/aConfigDetails/0/configData/1/categories/0/steps/0/representations/1";
					} else {
						obj.sPath = "/aConfigDetails/0/configData/1/categories/0/steps/1";
					}
					return obj;
				};
				that.oGetViewStub = function() {
					var obj = {};
					obj.byId = function(param) {
						if (param === "idConfigDetailData") {
							return new sap.ui.layout.Grid({
								content : [ sap.ui.view({
									viewName : "sap.apf.modeler.ui.view.configuration",
									type : "XML",
									viewData : {
										oCoreApi : that.oModelerInstance.modelerCore,
										updateConfigTree : that.oModelerInstance.updateConfigTree,
										updateTree : that.oModelerInstance.updateTree,
										updateTitleAndBreadCrumb : that.oModelerInstance.updateTitleAndBreadCrumb,
										oConfigurationHandler : that.oModelerInstance.configurationHandler,
										oApplicationHandler : that.oModelerInstance.applicationHandler,
										oConfigurationEditor : that.oModelerInstance.configurationEditorForUnsavedConfig,
										getText : that.oModelerInstance.modelerCore.getText,
										oParams : {
											name : "configuration",
											arguments : {
												appId : that.oModelerInstance.applicationCreatedForTest,
												configId : that.oModelerInstance.tempUnsavedConfigId
											}
										}
									}
								}) ]
							});
						}
					};
					obj.addDependent = function() {
						return null;
					};
					return obj;
				};
				that.deleteCalled = false;
				var oSelf = that;
				that.handleConfirmDeletionStub = function() {
					oSelf.deleteCalled = true;
				};
				that.oConfigurationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.configurationList");
				sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
				sinon.stub(sap.ui.core.UIComponent, "getRouterFor", that.oGetRouterStub);
				sinon.stub(that.oConfigurationListController, "getView", that.oGetViewStub);
				sinon.stub(that.oConfigurationListController, "navigateToDifferntView", that.navigateToDifferntViewStub);
				sinon.stub(that.oConfigurationListController, "handleConfirmDeletion", that.handleConfirmDeletionStub);
				sinon.stub(that.oModelerInstance.configurationEditorForUnsavedConfig, "isSaved", that.isSavedStub);
				sinon.stub(that.oConfigurationListController, "getSPathFromURL", that.getSPathFromURLStub);
				that.oTreeInstance = new sap.apf.modeler.ui.utils.APFTree();
				that.oTreeInstance.setMode("SingleSelectMaster");
				that.oModel = new sap.ui.model.json.JSONModel({
					aConfigDetails : [ {
						AnalyticalConfiguration : that.oModelerInstance.tempUnsavedConfigId,
						Application : that.oModelerInstance.applicationCreatedForTest,
						bIsLoaded : true,
						bToggleState : false,
						expanded : false,
						hasExpander : true,
						isSelected : false,
						name : "test config A",
						selectable : true,
						type : "configuration",
						configData : [ {
							expanded : false,
							selectable : false,
							name : "Facet Filters",
							filters : [ {
								expanded : false,
								id : "FacetFilter-1",
								isSelected : false,
								name : "From Date",
								selectable : true,
								type : "facetFilter"
							}, {
								expanded : false,
								id : "FacetFilter-2",
								isSelected : false,
								name : "To Date",
								selectable : true,
								type : "facetFilter"
							} ]
						}, {
							expanded : false,
							selectable : false,
							name : "Categories",
							categories : [ {
								expanded : false,
								id : "Category-1",
								isSelected : false,
								name : "test category A",
								selectable : true,
								type : "category",
								steps : [ {
									expanded : false,
									id : "Step-1",
									isSelected : false,
									name : "step A",
									selectable : true,
									type : "step",
									representations : [ {
										expanded : false,
										icon : "sap-icon://column-chart",
										id : "Step-1-Representation-1",
										isSelected : false,
										name : "Column Chart",
										selectable : true,
										type : "representation"
									}, {
										expanded : false,
										icon : "sap-icon://pie-chart",
										id : "Step-1-Representation-2",
										isSelected : false,
										name : "Pie Chart",
										selectable : true,
										type : "representation"
									}, {
										expanded : false,
										icon : "sap-icon://table-chart",
										id : "Step-1-Representation-3",
										isSelected : false,
										name : "Table Representation",
										selectable : true,
										type : "representation"
									} ]
								}, {
									expanded : false,
									id : "Step-2",
									isSelected : false,
									name : "step B",
									selectable : true,
									type : "step",
									representations : []
								} ]
							}, {
								expanded : false,
								id : "Category-2",
								isSelected : false,
								name : "test category B",
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
						AnalyticalConfiguration : that.oModelerInstance.tempSavedConfigId,
						Application : that.oModelerInstance.applicationCreatedForTest,
						bIsLoaded : true,
						bToggleState : false,
						expanded : false,
						hasExpander : true,
						isSelected : false,
						name : "test config B",
						selectable : true,
						type : "configuration",
						configData : []
					} ]
				});
				that.oTreeInstance.setModel(that.oModel);
				var oTreeNodeTemplate = new sap.m.StandardTreeItem({});
				oTreeNodeTemplate.bindProperty("title", "name");
				oTreeNodeTemplate.bindProperty("icon", "icon");
				that.oTreeInstance.bindAggregation("items", "/aConfigDetails", oTreeNodeTemplate);
				that.oTreeInstance.setTranslationFunction(that.oModelerInstance.modelerCore.getText);
				that.oTreeInstance.setDefaultRepresentationType("Column Chart");
				that.oConfigListInstance = {
					oCoreApi : that.oModelerInstance.modelerCore,
					configurationHandler : that.oModelerInstance.configurationHandler,
					configEditor : that.oModelerInstance.configurationEditorForUnsavedConfig,
					getView : function() {
						return that.oConfigurationListController.getView();
					},
					oTreeInstance : that.oTreeInstance,
					oTextPool : that.oModelerInstance.textPool,
					oModel : that.oModel,
					appId : that.oModelerInstance.applicationCreatedForTest,
					navigateToDifferntView : that.navigateToDifferntViewStub,
					handleConfirmDeletion : that.handleConfirmDeletionStub,
					getSPathFromURL : that.getSPathFromURLStub,
					_setNavigationTargetName : function() {}
				};
				that.toolbarView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.toolbar",
					type : "XML",
					viewData : {
						oConfigListInstance : that.oConfigListInstance
					}
				});
				that.toolbarController = that.toolbarView.getController();
				done1();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			sap.ui.core.UIComponent.getRouterFor.restore();
			this.oConfigurationListController.getView.restore();
			this.oConfigurationListController.navigateToDifferntView.restore();
			this.oConfigurationListController.getSPathFromURL.restore();
			this.oModelerInstance.configurationEditorForUnsavedConfig.isSaved.restore();
			if (this.toolbarController.addMenu) {
				this.toolbarController.addMenu.destroy(true);
			}
			if (this.toolbarController.addExistingStepDialog) {
				this.toolbarController.addExistingStepDialog.destroy(true);
			}
			if (this.toolbarController.confirmationDialog) {
				this.toolbarController.confirmationDialog.destroy(true);
			}
		}
	});
	QUnit.test("Test availability of toolbar view and controller", function(assert) {
		assert.ok(this.toolbarView, "Step view is Available");
		assert.ok(typeof this.toolbarView.getController === "function", "Toolbar controller is available");
	});
	QUnit.test("Test availability of API's", function(assert) {
		assert.ok(typeof this.toolbarController.onInit === "function", "onInit function available in toolbar controller");
		assert.ok(typeof this.toolbarController.enableCopyDeleteButton === "function", "enableCopyDeleteButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController.disableCopyDeleteButton === "function", "disableCopyDeleteButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._enableDisableAddMenuItems === "function", "_enableDisableAddMenuItems function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handlePressAddButton === "function", "_handlePressAddButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handleAddMenuItemPress === "function", "_handleAddMenuItemPress function available in toolbar controller");
		assert.ok(typeof this.toolbarController._copyConfiguration === "function", "_copyConfiguration function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handlePressCopyButton === "function", "_handlePressCopyButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handlePressDeleteButton === "function", "_handlePressDeleteButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._openDeleteConfirmationDialog === "function", "_openDeleteConfirmationDialog function available in toolbar controller");
		assert.ok(typeof this.toolbarController.closeDialog === "function", "closeDialog function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handlePressMoveUpButton === "function", "_handlePressMoveUpButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handlePressMoveDownButton === "function", "_handlePressMoveDownButton function available in toolbar controller");
		assert.ok(typeof this.toolbarController._moveUpOrDown === "function", "_moveUpOrDown function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handleAddExistingStepPress === "function", "_handleAddExistingStepPress function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handleExistingStepDialogOK === "function", "_handleExistingStepDialogOK function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handleExistingStepDialogSearch === "function", "_handleExistingStepDialogSearch function available in toolbar controller");
		assert.ok(typeof this.toolbarController._handleExistingStepDialogClose === "function", "_handleExistingStepDialogClose function available in toolbar controller");
		assert.ok(typeof this.toolbarController._getRepresentationIcon === "function", "_getRepresentationIcon function available in toolbar controller");
	});
	QUnit.test("Test to enable copy or delete button", function(assert) {
		this.toolbarView.byId("idCopyButton").setEnabled(false);
		this.toolbarView.byId("idDeleteButton").setEnabled(false);
		this.toolbarController.enableCopyDeleteButton();
		assert.equal(this.toolbarView.byId("idCopyButton").getEnabled(), true, "Copy button is enabled");
		assert.equal(this.toolbarView.byId("idDeleteButton").getEnabled(), true, "Delete button is enabled");
	});
	QUnit.test("Test to disable copy or delete button", function(assert) {
		this.toolbarView.byId("idCopyButton").setEnabled(true);
		this.toolbarView.byId("idDeleteButton").setEnabled(true);
		this.toolbarController.disableCopyDeleteButton();
		assert.equal(this.toolbarView.byId("idCopyButton").getEnabled(), false, "Copy button is disabled");
		assert.equal(this.toolbarView.byId("idDeleteButton").getEnabled(), false, "Delete button is disabled");
	});
	QUnit.test("Test enable disable add menu items", function(assert) {
		var addMenu, aAddMenuItems;
		addMenu = new sap.ui.xmlfragment("idAddMenuFragment", "sap.apf.modeler.ui.fragment.addMenu", this);
		aAddMenuItems = addMenu.getItems();
		var oSelectedTreeNodeDetails = null;
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled(), true, "If selected node is null, add configuration in add menu is enabled");
		assert
				.equal(aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled() && aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), false,
						"If selected node is null, all menu items except add configuration is disabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled(), true, "If selected node is a configuration, add configuration, add facet filter and add category in add menu is enabled");
		assert.equal(aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), false, "If selected node is a configuration, add step and add representation is disabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled(), true, "If selected node is a facet filter, add configuration and add facet filter in add menu is enabled");
		assert.equal(aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), false, "If selected node is a facet filter, add category, add step and add representation is disabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled() && aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), true,
				"If selected node is a category, all menu items except add representation is enabled in add menu");
		assert.equal(aAddMenuItems[5].getEnabled(), false, "If selected node is a category add representation alone is disabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled() && aAddMenuItems[3].getEnabled(), true,
				"If selected node is a navigation target, all menu items except add representation is enabled in add menu");
		assert.equal(aAddMenuItems[4].getEnabled() && aAddMenuItems[5].getEnabled(), false, "If selected node is a navigation target, add step and add representation is disabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled() && aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), true,
				"If selected node is a step, all menu items are enabled in add menu");
		oSelectedTreeNodeDetails = {
			nodeObjectType : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION
		};
		this.toolbarController._enableDisableAddMenuItems(oSelectedTreeNodeDetails, addMenu);
		assert.equal(aAddMenuItems[0].getEnabled() && aAddMenuItems[1].getEnabled() && aAddMenuItems[2].getEnabled() && aAddMenuItems[3].getEnabled() && aAddMenuItems[4].getEnabled(), true,
				"If selected node is a representation, all menu items are enabled in add menu");
		addMenu.destroy(true);
	});
	QUnit.test("Test handleAddExistingStepPress", function(assert) {
		var oAddButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		this.oConfigListInstance.oTreeInstance.setSelectedItem(this.oConfigListInstance.oTreeInstance.getItems()[0]);
		this.toolbarController._handlePressAddButton(oAddButtonStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/1");
		//this.oConfigListInstance.oTreeInstance.setSelectedItem(this.oConfigListInstance.oTreeInstance.getItems()[6]);
		var oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idExistingStep";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.toolbarController.addExistingStepDialog.getModel().aBindings[0].sPath = '/existingStepData';
		this.toolbarController.addExistingStepDialog.getModel().updateBindings();
		var existingStepDialog = sap.ui.getCore().byId(jQuery(".sapMDialog")[0].getAttribute("id"));
		assert.equal(this.toolbarController.addExistingStepDialog.getTitle(), this.oModelerInstance.modelerCore.getText("existingStepDialogTitle"), "The title for existing step dialog is set");
		assert.equal(existingStepDialog.getButtons().length, 2, "The OK and Cancel buttons are available");
		assert.equal(this.toolbarController.addExistingStepDialog.getItems().length, this.oConfigListInstance.configEditor.getStepsNotAssignedToCategory("Category-2").length, "List of unassigned steps to category is created");
		assert.equal(this.toolbarController.addExistingStepDialog.getItems().length, 4, "List of unassigned steps to category is created");
	});
	QUnit.test("Test _handleExistingStepDialogOK", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		//this.oConfigListInstance.oTreeInstance.setSelectedItem(this.oConfigListInstance.oTreeInstance.getItems()[6]);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/1");
		var aStepsNotAssignedToCategory = [ {
			id : "Step-1",
			name : "step A",
			icon : "sap-icon://bar-chart"
		}, {
			id : "Step-2",
			name : "step B",
			icon : "sap-icon://bar-chart"
		} ];
		var oModelDialog = new sap.ui.model.json.JSONModel({
			existingStepData : aStepsNotAssignedToCategory
		});
		var existingStepList = new sap.m.StandardListItem();
		existingStepList.setModel(oModelDialog);
		var oEventStub = {
			getParameters : function() {
				var obj = {};
				obj.selectedItems = [ "item1" ];
				obj.selectedContexts = [ {
					sPath : "/existingStepData/0"
				} ];
				return obj;
			},
			getSource : function() {
				return existingStepList;
			}
		};
		this.toolbarController._handleExistingStepDialogOK(oEventStub);
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[1].steps[0].name, "step A", "The selected existing step is added to the tree");
	});
	QUnit.test("Test handlePressAddButton", function(assert) {
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		var oEvtStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.toolbarController._handlePressAddButton(oEvtStub);
		assert.equal(this.toolbarController.addMenu.bOpen, true, "Add menu is open");
	});
	//Existing step tests are covered separately
	QUnit.test("Test handleAddMenuItemPress", function(assert) {
		var oAddButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.setSelectedItem(this.oConfigListInstance.oTreeInstance.getItems()[0]);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		this.toolbarController._handlePressAddButton(oAddButtonStub);
		var oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewConfig";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems().length, 3, "New configuration node was added on press of add configuration option in add menu");
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[2].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newConfiguration") + " >", "The new node has the text <New Configuration>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewFacetFilter";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[4].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newFacetFilter") + " >", "The new node has the text <New Facet Filter>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewCategory";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[10].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newCategory") + " >", "The new node has the text <New Category>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewStep";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[9].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newStep") + " >", "The new node has the text <New Step>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idHierarchicalStep";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[9].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newStep") + " >", "The new node has the text <New Step>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewRepresentation";
				return obj;
			}
		};
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(4);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[11].getTitle(), "Column Chart", "The new node has the text Column Chart");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/2");
		oEvtStub = {
			getParameters : function() {
				var obj = {};
				obj.id = "idAddMenuFragment--idNewNavigationTarget";
				return obj;
			}
		};
		this.oConfigListInstance.oTreeInstance.setSelectedItem(this.oConfigListInstance.oTreeInstance.getItems()[0]);
		this.toolbarController._handleAddMenuItemPress(oEvtStub);
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		assert.equal(this.oConfigListInstance.oTreeInstance.getItems()[16].getTitle(), "< " + this.oModelerInstance.modelerCore.getText("newNavigationTarget") + " >", "The new node has the text <New Navigation Target>");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/2");
	});
	QUnit.test("Test handle press copy button for configuration", function(assert) {
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		this.oConfigListInstance.modelUpdateDeferred = {};
		this.toolbarController._handlePressCopyButton(oCopyButtonStub);
		assert.equal(this.oModel.getData().aConfigDetails[2].name, "< " + this.oModelerInstance.modelerCore.getText("copyOf") + "  test config A >", "The selected configuration node is copied");
		delete this.oConfigListInstance.modelUpdateDeferred;
	});
	QUnit.test("Test handle press copy button for facet filter", function(assert) {
		var done = assert.async();
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/0/filters/0");
		this.toolbarController._handlePressCopyButton(oCopyButtonStub).done(function() {
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[0].filters[2].name, "< " + this.oModelerInstance.modelerCore.getText("copyOf") + "  From Date >", "The selected facet filter node is copied");
			this.oModelerInstance.configurationEditorForUnsavedConfig.removeFacetFilter(this.oModel.getData().aConfigDetails[0].configData[0].filters[2].id);
			done();
		}.bind(this));
	});
	QUnit.test("Test handle press copy button for category", function(assert) {
		var done = assert.async();
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0");
		this.toolbarController._handlePressCopyButton(oCopyButtonStub).done(function() {
			this.toolbarController._handlePressCopyButton(oCopyButtonStub);
			assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[2].name, "< " + this.oModelerInstance.modelerCore.getText("copyOf") + "  test category A >", "The selected category node is copied");
			this.oModelerInstance.configurationEditorForUnsavedConfig.removeCategory(this.oModel.getData().aConfigDetails[0].configData[1].categories[2].id);
			done();
		}.bind(this));
	});
	QUnit.test("Test handle press copy button for step", function(assert) {
		var done = assert.async();
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0");
		this.toolbarController._handlePressCopyButton(oCopyButtonStub).done(function() {
			assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[2].name, "< " + this.oModelerInstance.modelerCore.getText("copyOf") + "  step A >", "The selected step node is copied");
			//Remove the step:
			this.oModelerInstance.configurationEditorForUnsavedConfig.removeCategoryStepAssignment(this.oModelerInstance.categoryIdUnsaved, this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[2].id);
			done();
		}.bind(this));
	});
	QUnit.test("Test handle press copy button for representation", function(assert) {
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(4);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0/representations/0");
		this.toolbarController._handlePressCopyButton(oCopyButtonStub);
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[3].name, "Column Chart", "The selected representation node is copied");
		var existingRepresentation = this.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[3];
		var copiedRepresentation = this.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[3];
		//compare the dimensions/measures for copied representation
		assert.deepEqual(existingRepresentation.getDimensions(), copiedRepresentation.getDimensions(), "Dimensions for existing and copied representation are same");
		assert.deepEqual(existingRepresentation.getMeasures(), copiedRepresentation.getMeasures(), "Measures for existing and copied representation are same");
		//compare the label for corner texts of copied representation
		assert.equal(existingRepresentation.getLeftLowerCornerTextKey(), copiedRepresentation.getLeftLowerCornerTextKey(), "Left lower corner text key for existing and copied representation are same");
		assert.equal(existingRepresentation.getLeftUpperCornerTextKey(), copiedRepresentation.getLeftUpperCornerTextKey(), "Left upper corner text key  for existing and copied representation are same");
		assert.equal(existingRepresentation.getRightLowerCornerTextKey(), copiedRepresentation.getRightLowerCornerTextKey(), "Right lower corner text key  for existing and copied representation are same");
		assert.equal(existingRepresentation.getRightUpperCornerTextKey(), copiedRepresentation.getRightUpperCornerTextKey(), "Right upper corner text key  for existing and copied representation are same");
		//compare the label for copied representation
		assert.equal(existingRepresentation.getDimensionTextLabelKey("dimension1"), copiedRepresentation.getDimensionTextLabelKey("dimension1"), "Label for dimension1 for existing and copied representation are same");
		this.oModelerInstance.unsavedStepWithoutFilterMapping.removeRepresentation(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[3].id);
	});
	QUnit.test("Test handle press copy button for navigation target", function(assert) {
		var spy = sinon.spy(this.oConfigListInstance, "_setNavigationTargetName");
		var oCopyButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/0");
		this.toolbarController._handlePressCopyButton(oCopyButtonStub);
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[2].navTargets[2].name, "< " + this.oModelerInstance.modelerCore.getText("copyOf") + "  Execute APF Configuration >", "The selected navigation target node is copied");
		assert.strictEqual(spy.calledOnce, true, "THEN navigation target name was updated");
		var expectedArgs = [{
			configIndexInTree : "0"
		}];
		assert.deepEqual(spy.getCall(0).args, expectedArgs, "THEN argument as expected");
		this.oModelerInstance.configurationEditorForUnsavedConfig.removeNavigationTarget(this.oModel.getData().aConfigDetails[0].configData[2].navTargets[2].id);
	});
	QUnit.test("Test handlePressDeleteButton for configuration", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getTitle(), this.oModelerInstance.modelerCore.getText("confirmation"), "Confirmation dialog tetx is set");
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmDeletion", [ this.oModelerInstance.modelerCore.getText("configuration"), "test config A" ]),
				"Confirmation dialog text for delete configuration is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test handlePressDeleteButton for facet filter", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/0/filters/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmDeletion", [ this.oModelerInstance.modelerCore.getText("facetFilter"), "From Date" ]),
				"Confirmation dialog text for delete facet filter is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test handlePressDeleteButton for category", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmDeletion", [ this.oModelerInstance.modelerCore.getText("category"), "test category A" ]),
				"Confirmation dialog text for delete category is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test handlePressDeleteButton for step", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmStepDeletion", [ "step A" ]), "Confirmation dialog text for delete step is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test handlePressDeleteButton for representation", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(4);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0/representations/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmDeletion", [ this.oModelerInstance.modelerCore.getText("representation"), "Column Chart" ]),
				"Confirmation dialog text for delete representation is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test handlePressDeleteButton for navigation target", function(assert) {
		var oDeleteButtonStub = {
			getSource : function() {
				return new sap.m.Button();
			}
		};
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/0");
		this.toolbarController._handlePressDeleteButton(oDeleteButtonStub);
		assert.equal(this.toolbarController.confirmationDialog.getContent()[0].mProperties.text, this.oModelerInstance.modelerCore.getText("confirmDeletion", [ this.oModelerInstance.modelerCore.getText("navigationTarget"),
				"Execute APF Configuration" ]), "Confirmation dialog text for delete navigation target is seen");
		this.toolbarController.confirmationDialog.getBeginButton().firePress();
		assert.equal(this.deleteCalled, true, "Pressing the delete button calls the handleDeleteConfirmation API at configuration list controller");
		this.toolbarController.closeDialog();
	});
	QUnit.test("Test _handlePressMoveUpButton for facet filter", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/0/filters/1");
		this.toolbarController._handlePressMoveUpButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[0].filters[0].name, "To Date", "Facet Filter is moved up in the tree");
	});
	QUnit.test("Test _handlePressMoveUpButton for category", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/1");
		this.toolbarController._handlePressMoveUpButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].name, "test category B", "Category is moved up in the tree");
	});
	QUnit.test("Test _handlePressMoveUpButton for step", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/1");
		this.toolbarController._handlePressMoveUpButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].name, "step B", "Step is moved up in the tree");
	});
	QUnit.test("Test _handlePressMoveUpButton for representation", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(4);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0/representations/1");
		this.toolbarController._handlePressMoveUpButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[0].name, "Pie Chart", "representation is moved up in the tree");
	});
	QUnit.test("Test _handlePressMoveUpButton for navigation target", function(assert) {
				this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/1");
		this.toolbarController._handlePressMoveUpButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[2].navTargets[0].name, "UserInputSemanticObject", "Navigation target is moved up in the tree");
	});
	QUnit.test("Test _handlePressMoveDownButton for facet filter", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
	    this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/0/filters/0");
		this.toolbarController._handlePressMoveDownButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[0].filters[1].name, "From Date", "Facet Filter is moved down in the tree");
	});
	QUnit.test("Test _handlePressMoveDownButton for category", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0");
		this.toolbarController._handlePressMoveDownButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[1].name, "test category A", "Category is moved down in the tree");
	});
	QUnit.test("Test _handlePressMoveDownButton for step", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(3);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0");
		this.toolbarController._handlePressMoveDownButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[1].name, "step A", "Step is moved down in the tree");
	});
	QUnit.test("Test _handlePressMoveDownButton for representation", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(4);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/1/categories/0/steps/0/representations/0");
		this.toolbarController._handlePressMoveDownButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[1].name, "Column Chart", "Representation is moved down in the tree");
	});
	QUnit.test("Test _handlePressMoveDownButton for navigation target", function(assert) {
		this.oConfigListInstance.oTreeInstance.setMode("SingleSelectMaster");
		this.oConfigListInstance.oTreeInstance.expandToLevel(2);
		this.oConfigListInstance.oTreeInstance.setSelectionOnTree("/aConfigDetails/0/configData/2/navTargets/0");
		this.toolbarController._handlePressMoveDownButton();
		assert.equal(this.oModel.getData().aConfigDetails[0].configData[2].navTargets[1].name, "Execute APF Configuration", "Navigation target is moved down in the tree");
	});
	QUnit.test("Test getRepresentationIcon", function(assert) {
		var icon = this.toolbarController._getRepresentationIcon("ColumnChart");
		assert.equal(icon, "sap-icon://bar-chart", "Representation icon is returned for column chart");
	});
});
