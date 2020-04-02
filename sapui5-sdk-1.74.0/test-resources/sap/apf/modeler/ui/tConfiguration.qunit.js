/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tConfiguration');

jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';

	var arrayWithOneElement = [ 1 ];
	var arrayWithTwoElements = [ 1, 2 ];
	var arrayWithFiveElements = [ 1, 2, 3, 4, 5 ];

	var newApplicationId = "apf1972-appA";
	var existingApplicationId = "1111AAAA1111";
	var newConfigurationId = "newConfig 0";
	var existingConfigurationId = "1111CCCC1111";
	var existingAnalyticalConfigurationName = "test config A";

	var notExistingAnalyticalConfiguration;
	var existingAnalyticalConfiguration = {
			Application : existingApplicationId,
			AnalyticalConfiguration : existingConfigurationId,
			AnalyticalConfigurationName : existingAnalyticalConfigurationName
	};
	function _doNothing() {
	}
	/**
	 * instantiates the stubs and the configuration view
	 * @param settings.analyticalConfiguration
	 * @param settings.analyticalConfigurationId
	 * @param settings.applicationId
	 * @param settings.configurationEditor
	 * @param settings.bShowSemanticObject
	 * @param assert
	 */
	function _instantiateView(context, settings, assert) {
		var oConfigurationController = sap.ui.controller("sap.apf.modeler.ui.controller.configuration");
		var onInitSpy = sinon.spy(oConfigurationController, "onInit");
		var setDetailDataSpy = sinon.spy(oConfigurationController, "setDetailData");

		if (settings.configurationEditor) {
			context.spyOnConfigEditorSetIsUnsaved = sinon.spy(settings.configurationEditor, "setIsUnsaved");
			context.spyOnGetCategories = sinon.spy(settings.configurationEditor, "getCategories");
			context.spyOnGetSteps = sinon.spy(settings.configurationEditor, "getSteps");
			context.spyOnGetFilterOption = sinon.spy(settings.configurationEditor, "getFilterOption");
			context.spyOnSetFilterOption = sinon.spy(settings.configurationEditor, "setFilterOption");
			context.spyOnIsDataLostOnFilterOptionChange = sinon.spy(settings.configurationEditor, "isDataLostByFilterOptionChange");
		}
		var getText = function(key) {
			return key;
		};
		var coreApi = {
				showSemanticObject : function() {
					return settings.bShowSemanticObject;
				}
		};
		var applicationHandler = {
				getApplication : function () {
					return { SemanticObject: "semObjA" };
				}
		};
		var getApplicationSpy = sinon.spy(applicationHandler, "getApplication");
		var textPool = {
				setTextAsPromise : function() {
					return sap.apf.utils.createPromise(sap.apf.utils.createPseudoGuid());
				}
		};
		var configurationHandler = {
				getConfiguration : function() {
					return settings.analyticalConfiguration;
				},
				getTextPool : function() {
					return textPool;
				},
				setConfiguration : function() {
					return settings.analyticalConfigurationId;
				},
				loadConfiguration : function(configId, callback) {
					callback(settings.configurationEditor);
				}
		};
		context.spyOnGetConfiguration = sinon.spy(configurationHandler, "getConfiguration");
		var oView = sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.configuration",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oConfigurationController,
			viewData : {
				oCoreApi : coreApi,
				updateSelectedNode : _doNothing, //usage will be spied
				updateTitleAndBreadCrumb : _doNothing, //usage will be spied
				oConfigurationHandler : configurationHandler,
				oApplicationHandler : applicationHandler,
				oConfigurationEditor : settings.configurationEditor,
				getText : getText,
				updateTree : _doNothing,
				oParams : {
					name : "configuration",
					arguments : {
						appId : settings.applicationId,
						configId : settings.analyticalConfigurationId
					}
				}
			}
		});
		assert.strictEqual(onInitSpy.calledOnce, true, "then configuration's onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then configuration's setDetailData function is called");
		assert.strictEqual(getApplicationSpy.calledOnce, true, "then getApplication is called");
		assert.strictEqual(getApplicationSpy.calledWith(settings.applicationId), true, "then getApplication is called with expected application id");
		getApplicationSpy.restore();
		setDetailDataSpy.restore();
		onInitSpy.restore();
		return oView;
	}
	function _pressButtonOnFilterOptionChangeDialog(assert, buttonNumber, continuation) {
		var filterOptionChangeDialog = sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons");
		filterOptionChangeDialog.getButtons()[buttonNumber].firePress();
		assert.strictEqual(sap.ui.getCore().byId("idFilterOptionChangeFragment--idDialogWithTwoButtons"), undefined, "then filter option dialog is destroyed");
		continuation();
	}
	function _pressEscapeButtonOnFilterOptionChangeDialog (assert, continuation){
		var filterOptionChangeDialog = sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons");
		filterOptionChangeDialog.attachAfterClose(function(){
			assert.strictEqual(sap.ui.getCore().byId("idFilterOptionChangeFragment--idDialogWithTwoButtons"), undefined, "then filter option dialog is destroyed");
			continuation();
		});
		filterOptionChangeDialog.close();
	}
	function _destroyResources(context, oConfigEditor) {
		if (oConfigEditor) {
			context.spyOnConfigEditorSetIsUnsaved.restore();
			context.spyOnGetCategories.restore();
			context.spyOnGetSteps.restore();
			context.spyOnGetFilterOption.restore();
			context.spyOnSetFilterOption.restore();
			context.spyOnIsDataLostOnFilterOptionChange.restore();
		}

		context.spyOnGetConfiguration.restore();
		context.configurationView.destroy();
	}
	QUnit.module("Configuration Unit Tests - New configuration", {
		beforeEach : function(assert) {
			var configEditorForUnsavedConfig = {
					filterOption : { none : true },
					getCategories : function() {
						return arrayWithTwoElements;
					},
					getSteps : function() {
						return arrayWithFiveElements;
					},
					getFacetFilters : function() {
						if (this.filterOption.facetFilter) {
							return [ 1 ];
						}
						return [];
					},
					getSmartFilterBar : function() {
						return {};
					},
					getFilterOption : function() {
						return this.filterOption;
					},
					setApplicationTitle : function (title) {},
					setFilterOption : function(filterOption) {
						this.filterOption = filterOption;
					},
					setIsUnsaved : function() {},
					isDataLostByFilterOptionChange : function() { return false; }
			};
			var settings = {
					analyticalConfiguration : notExistingAnalyticalConfiguration,
					analyticalConfigurationId : newConfigurationId,
					applicationId : newApplicationId,
					bShowSemanticObject : true,
					configurationEditor : configEditorForUnsavedConfig
			};

			this.configurationView = _instantiateView(this, settings, assert);
		},
		afterEach : function() {
			_destroyResources(this);
		}
	});
	QUnit.test("When configuration page is initialised", function(assert) {
		//arrange
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(this.configurationView.byId("idConfigTitle").getValue(), "", "Configuration title is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "", "Number of categories is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "", "Number of steps is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getValue(), "semObjA", "Semantic object is set");
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getVisible(), true, "THEN semantic object field is visible");
		assert.strictEqual(this.configurationView.byId("idSemanticObjectLabel").getVisible(), true, "THEN label for semantic object field is visible");
		assert.strictEqual(this.configurationView.getController().getValidationState(), false, "then configuration is not in valid state");
		assert.strictEqual(this.spyOnGetConfiguration.calledWith(newConfigurationId), true, "then the configuration is called with the new configuration Id");
		assert.strictEqual(this.spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getEnabled(), false, "then the filter type radio group is disabled");
		//cleanup
		this.configurationView.destroy();
	});
	QUnit.test("When adding configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test new configuration";
		this.configurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(this.configurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(this.configurationView.getViewData(), "updateSelectedNode");
		var expectedContext = {
				appId : newApplicationId
		};
		var expectedConfigInfo = {
				name : sConfigTitle
		};
		// act
		this.configurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo, expectedContext), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		// assertions on UI
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "", "Number of categories are zero set for new configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "", "Number of steps are zero for new configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
	});
	QUnit.test("When configuration page is in valid state", function(assert) {
		// arrange
		this.configurationView.byId("idConfigTitle").setValue("test new configuration");
		//assert
		assert.strictEqual(this.configurationView.getController().getValidationState(), true, "then configuration is in valid state");
	});
	QUnit.module("Configuration Unit Tests - Unsaved existing configuration", {
		beforeEach : function(assert) {

			this.configEditorForUnsavedConfig = {
					filterOption : { facetFilter : true },
					getCategories : function() {
						return arrayWithTwoElements;
					},
					getSteps : function() {
						return arrayWithFiveElements;
					},
					getFacetFilters : function() {
						if (this.filterOption.facetFilter) {
							return [ 1 ];
						}
						return [];
					},
					getSmartFilterBar : function() {
						return {};
					},
					getFilterOption : function() {
						return this.filterOption;
					},
					setApplicationTitle : function (title) {},
					setFilterOption : function(filterOption) {
						this.filterOption = filterOption;
					},
					setIsUnsaved : function() {},
					isDataLostByFilterOptionChange : function() { return true; }
			};
			var settings = {
					analyticalConfiguration : existingAnalyticalConfiguration,
					analyticalConfigurationId : existingConfigurationId,
					applicationId : newApplicationId,
					bShowSemanticObject : true,
					configurationEditor : this.configEditorForUnsavedConfig
			};
			this.configurationView = _instantiateView(this, settings, assert);
		},
		afterEach : function() {
			_destroyResources(this, this.configurationEditorForUnsavedConfig);
		}
	});
	QUnit.test("When configuration page is initialised ", function(assert) {
		// assert
		assert.strictEqual(this.configurationView.byId("idConfigTitle").getValue(), "test config A", "Configuration title is set for existing configuration");
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), existingConfigurationId, "Configuration ID is set for existing configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories is set for existing configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "5", "Number of steps is not set for new configuration");
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getValue(), "semObjA", "Semantic object is set");
		assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getEnabled(), true, "then the filter type radio group is enabled");
		assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue(), "facetFilter", "then the filter type is facet filter");
		assert.strictEqual(this.configurationView.getController().getValidationState(), true, "then configuration is in valid state");
		assert.strictEqual(this.spyOnGetConfiguration.calledWith(existingConfigurationId), true, "then the configuration is called with the correct config Id");
		assert.strictEqual(this.spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(this.spyOnGetConfiguration.returnValues.length, 1, "then the configuration is loaded");
		assert.strictEqual(this.spyOnGetCategories.calledOnce, true, "then the categories are fetched");
		assert.strictEqual(this.spyOnGetSteps.calledOnce, true, "then the steps are fetched");
		assert.strictEqual(this.spyOnGetFilterOption.calledOnce, true, "then the filter option is fetched");
	});
	QUnit.test("When changing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test edit configuration";
		this.configurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(this.configurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(this.configurationView.getViewData(), "updateSelectedNode");
		var expectedConfigInfo = {
				name : sConfigTitle
		};
		// act
		this.configurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		// assertions on UI
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), existingConfigurationId, "Configuration ID is set for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories are available for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "5", "Number of steps are available for configuration");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
	});
	QUnit.test("When clearing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "";
		this.configurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(this.configurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(this.configurationView.getViewData(), "updateSelectedNode");

		var expectedConfigInfo = {
				name : sConfigTitle
		};
		// act
		this.configurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, false, "then the title and breadcrumb is not called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), false, "then the title and breadcrumb is not updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), false, "then the configuration node is not updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, false, "then the configuration node is not called once");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// assertions on UI
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), existingConfigurationId, "Configuration ID is set for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories are available for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "5", "Number of steps are available for configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
	});
	QUnit.test("When changing filter option type to smart filter and press Continue in the filter option change dialog", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("smartFilterBar"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 0, function() {
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
			assert.strictEqual(this.spyOnSetFilterOption.calledWith({
				smartFilterBar : true
			}), true, "then setFilterOption is called with smartFilterBar");
			assert.strictEqual(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, 0, "then no facet filters are available");
			assert.ok(this.configurationView.getViewData().oConfigurationEditor.getSmartFilterBar(), "then smart filter bar is available");
		}.bind(this));
	});
	QUnit.test("When changing filter option type to smart filter and press Cancel in the filter option change dialog", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("smartFilterBar"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 1, function() {
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(this.spyOnSetFilterOption.calledWith({
				smartFilterBar : true
			}), false, "then setFilterOption is not called with smartFilterBar");
			assert.ok(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
		}.bind(this));
	});
	QUnit.test("When changing filter option type to none and press Continue in the filter option change dialog", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("none"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 0, function() {
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
			assert.strictEqual(this.spyOnSetFilterOption.calledWith({
				none : true
			}), true, "then setFilterOption is called with none");
			assert.strictEqual(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, 0, "then no facet filters are available");
		}.bind(this));
	});
	QUnit.test("When changing filter option type to none and press Cancel in the filter option change dialog", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("none"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 1, function() {
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(this.spyOnSetFilterOption.calledWith({
				none : true
			}), false, "then setFilterOption is not called with none");
			assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getSelectedButton(), this.configurationView.byId("facetFilter"), "Then facet filter button is still selected");
			assert.ok(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
		}.bind(this));
	});
	QUnit.test("When changing filter option type to none and press escape in the filter option change dialog", function(assert) {
		var done = assert.async();
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("none"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		_pressEscapeButtonOnFilterOptionChangeDialog(assert, function(){
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getSelectedButton(), this.configurationView.byId("facetFilter"), "Then facet filter button is still selected");
			assert.ok(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
			done();
		}.bind(this));
	});
	QUnit.test("When changing filter option type to smart filter and press escape in the filter option change dialog", function(assert) {
		var done = assert.async();
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("smartFilterBar"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		_pressEscapeButtonOnFilterOptionChangeDialog(assert, function(){
			assert.strictEqual(this.spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getSelectedButton(), this.configurationView.byId("facetFilter"), "Then facet filter button is still selected");
			assert.ok(this.configurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
			done();
		}.bind(this));
	});
	QUnit.module("Configuration Unit Tests - Saved configuration", {
		beforeEach : function(assert) {
			this.textPool = {
					getText : function(key) {
						return key;
					},
					setTextAsPromise : function(textElement) {
						return sap.apf.utils.createPromise(sap.apf.utils.createPseudoGuid());
					}
			};
			this.configEditorForSavedConfig = {
					filterOption : {
						smartFilterBar : true
					},
					getCategories : function() {
						return [];
					},
					getSteps : function() {
						return [];
					},
					getFacetFilters : function() {
						if (this.filterOption.facetFilter) {
							return arrayWithOneElement;
						}
						return [];
					},
					getSmartFilterBar : function() {
						return {};
					},
					getFilterOption : function() {
						return this.filterOption;
					},
					setApplicationTitle : function (title) {},
					setFilterOption : function(filterOption) {
						this.filterOption = filterOption;
					},
					setIsUnsaved : function() {},
					isDataLostByFilterOptionChange : function() { return false; }
			};

			var settings = {
					analyticalConfiguration : existingAnalyticalConfiguration,
					analyticalConfigurationId : existingConfigurationId,
					applicationId : newApplicationId,
					bShowSemanticObject : true,
					configurationEditor : this.configEditorForSavedConfig
			};
			this.configurationView = _instantiateView(this, settings, assert);
		},
		afterEach : function() {
			_destroyResources(this, this.configEditorForSavedConfig);
		}
	});
	QUnit.test("When configuration page is initialised ", function(assert) {
		//arrange
		this.configurationView.placeAt("contentOfConfiguration");
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(this.configurationView.byId("idConfigTitle").getValue(), existingAnalyticalConfigurationName, "Configuration title is set for existing configuration");
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), existingConfigurationId, "Configuration ID not set for existing configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "0", "Number of categories are not available for existing configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "0", "Number of steps are not available for new configuration");
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getValue(), "semObjA", "Semantic object is set");
		assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getEnabled(), true, "then the filter type radio group is enabled");
		assert.strictEqual(this.configurationView.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue(), "smartFilterBar", "then the filter type is smart filter");
		assert.strictEqual(this.configurationView.getController().getValidationState(), true, "then configuration is in valid state");
		assert.strictEqual(this.spyOnGetConfiguration.calledWith(existingConfigurationId), true, "then the configuration is called with the correct config Id");
		assert.strictEqual(this.spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(this.spyOnGetConfiguration.returnValues.length, 1, "then the configuration is loaded");
		assert.strictEqual(this.spyOnGetCategories.calledOnce, true, "then the categories are fetched");
		assert.strictEqual(this.spyOnGetSteps.calledOnce, true, "then the steps are fetched");
		assert.strictEqual(this.spyOnGetFilterOption.calledOnce, true, "then the filter option is fetched");
		this.configurationView.destroy();
	});
	QUnit.test("When changing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test edit configuration";
		this.configurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(this.configurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(this.configurationView.getViewData(), "updateSelectedNode");
		var expectedConfigInfo = {
				name : sConfigTitle
		};
		// act
		this.configurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// assertions on UI
		assert.strictEqual(this.configurationView.byId("idConfigurationId").getValue(), existingConfigurationId, "Configuration ID is available for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfCategories").getValue(), "0", "Number of categories are not available for configuration");
		assert.strictEqual(this.configurationView.byId("idNoOfSteps").getValue(), "0", "Number of steps are not available for configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
	});
	QUnit.test("When changing filter option type to none and there is no data lost", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("none"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(this.spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
		assert.strictEqual(this.spyOnSetFilterOption.calledWith({
			none : true
		}), true, "then setFilterOption is called with none");
	});
	QUnit.test("When changing filter option type to facetFilter and there is no data lost", function(assert) {
		// arrange
		this.configurationView.byId("idFilterTypeRadioGroup").setSelectedButton(this.configurationView.byId("facetFilter"));
		// act
		this.configurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(this.spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(this.spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
		assert.strictEqual(this.spyOnSetFilterOption.calledWith({
			facetFilter : true
		}), true, "then setFilterOption is called with facetFilter");
	});
	QUnit.module("WHEN semantic object shall not be shown for new analytical configuration", {
		beforeEach : function(assert) {
			var settings = {
					analyticalConfiguration : notExistingAnalyticalConfiguration,
					analyticalConfigurationId : newConfigurationId,
					applicationId : newApplicationId,
					bShowSemanticObject : false
			};
			this.configurationView = _instantiateView(this, settings, assert);
		},
		afterEach : function() {
			_destroyResources(this);
		}
	});
	QUnit.test("When configuration page is initialised", function(assert) {
		//arrange
		this.configurationView.placeAt("contentOfConfiguration");
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getVisible(), false, "THEN semantic object field is NOT visible");
		assert.strictEqual(this.configurationView.byId("idSemanticObjectLabel").getVisible(), false, "THEN label for semantic object field is NOT visible");
		//cleanup
		this.configurationView.destroy();
	});
	QUnit.module("WHEN semantic object shall not be shown for existing analytical configuration", {
		beforeEach : function(assert) {
			this.configEditorForSavedConfig = {
					filterOption : {
						smartFilterBar : true
					},
					getCategories : function() {
						return [];
					},
					getSteps : function() {
						return [];
					},
					getFacetFilters : function() {
						if (this.filterOption.facetFilter) {
							return arrayWithOneElement;
						}
						return [];
					},
					getSmartFilterBar : function() {
						return {};
					},
					getFilterOption : function() {
						return this.filterOption;
					},
					setApplicationTitle : function (title) {},
					setFilterOption : function(filterOption) {
						this.filterOption = filterOption;
					},
					setIsUnsaved : function() {},
					isDataLostByFilterOptionChange : function() { return false; }
			};
			var settings = {
					analyticalConfiguration : existingAnalyticalConfiguration,
					analyticalConfigurationId : existingConfigurationId,
					applicationId : existingApplicationId,
					bShowSemanticObject : false,
					configurationEditor : this.configEditorForSavedConfig
			};
			this.configurationView = _instantiateView(this, settings, assert);
		},
		afterEach : function() {
			_destroyResources(this, this.configEditorForSavedConfig);
		}
	});
	QUnit.test("When configuration page is initialised", function(assert) {
		//arrange
		this.configurationView.placeAt("contentOfConfiguration");
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(this.configurationView.byId("idSemanticObject").getVisible(), false, "THEN semantic object field is NOT visible");
		assert.strictEqual(this.configurationView.byId("idSemanticObjectLabel").getVisible(), false, "THEN label for semantic object field is NOT visible");
		//cleanup
		this.configurationView.destroy();
	});
}());