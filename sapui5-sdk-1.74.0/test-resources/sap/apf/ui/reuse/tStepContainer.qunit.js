jQuery.sap.declare('test.sap.apf.ui.tStepContainer');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require('sap.apf.testhelper.doubles.createUiApiAsPromise');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require('sap.apf.testhelper.stub.activeStepStub');
//Pending - handlePressChartIcon,handleSelectionChartSwitchIcon,handlePressViewSettingsIcon needs to be done once we get solution from chart container
//Pending - Spy on removeAllSelection,thumbnailDraw method has to be done 
/* global Promise*/
(function() {
	"use strict";
	var analysisPathController = {
		apfDebugId : "hugo",
		refresh : function() {
		},
		callBackForUpdatePath : function() {
		},
		updateCustomListView : function(oCurrentStep, nIndex, bStepChanged){
		}
	};
	var getAnalysisPathStub = function() {
		var control = sap.ui.core.Control.extend("hugo", {});
		var analysisPath = new control();
		analysisPath.getCarouselView = function() {
			var carousel = {};
			carousel.getStepView = function(x) {
				var stepView = {};
				stepView.oThumbnailChartLayout = new sap.ui.layout.VerticalLayout();
				stepView.oThumbnailChartLayout.setBusy(true);
				stepView.getController = function() {
					var oController = {};
					oController.drawThumbnailContent = function() {
						return;
					};
					return oController;
				};
				return stepView;
			};
			return carousel;
		};
		analysisPath.getController = function() {
			return analysisPathController;
		};
		analysisPath.loaded = function() {
			return Promise.resolve(analysisPath);
		};
		analysisPath.oSavedPathName = {};
		analysisPath.oSavedPathName.setTitle = function() {
			return;
		};
		return analysisPath;
	};
	function _drawStepContent(context, currentActiveStep, assert) {
		var done = assert.async();
		sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
			context.oGlobalApi = api;
			context.oStepContainerView = context.oGlobalApi.oUiApi.getStepContainer();
			var oController = context.oStepContainerView.getController();
			sinon.stub(context.oGlobalApi.oCoreApi, 'getActiveStep', currentActiveStep);
			sinon.stub(context.oGlobalApi.oCoreApi, 'getPathFilterInformation', function() {
				return jQuery.Deferred().resolve("PathFilterInformation");
			});
			sinon.stub(context.oGlobalApi.oUiApi, 'getAnalysisPath', getAnalysisPathStub);
			oController.drawStepContent(true);
			done();
		});
	}
	QUnit.module('When step container has no steps', {
		beforeEach : function(assert) {
			_drawStepContent(this, undefined, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("When Step container initialized", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oInitialText = oController.byId("idInitialText");
		assert.strictEqual(this.oGlobalApi.oCoreApi.getActiveStep(), undefined, "then no active steps are available");
		assert.strictEqual(oInitialText.getVisible(), true, "then initial text label is visible");
		assert.strictEqual(oInitialText.getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('initialText'), "Text for initial text label is set");
	});
	QUnit.module('When drawing chart container with Chart representation with selection', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepWithSelectionStub, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("WHEN toolbar is initialized", function(assert){
		var oController = this.oStepContainerView.getController();
		var chartContainer =  oController.byId("idChartContainer");
		var toolbar = oController.byId("idChartContainerToolbar");
		assert.strictEqual(toolbar, chartContainer.getToolbar(), "THEN toolbar has a predefined id");
		assert.ok(toolbar, "THEN toolbar is not undefined OR null");
	});
	QUnit.test("When Chart container created with chart  representation with selection", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		assert.strictEqual(oChartContainer.getContent().length, 1, "Then Chart representation added into the content");
		assert.strictEqual(oChartContainer.getCustomIcons().length, 2, "Then Custom icon for chart and alternate representation added to the chart container");
		assert.strictEqual(oChartContainer.getToolbar().getContent().length, 8, "Then Custom content added in the left(current analysis step) & right(selected info and reset) of toolbar");
		assert.strictEqual(oController.byId("idStepLayout").getBusy(), false, "Then chart container drawn on step layout");
	});
	QUnit.test("When pressing selected property count link", function(assert) {
		var oController = this.oStepContainerView.getController();
		oController.handlePressSelectedPropertyCountLink();
		var selectionDisplayDialog = sap.ui.core.Fragment.byId("idSelectionDisplayFragment", "idSelectionDisplayDialog");
		assert.strictEqual(selectionDisplayDialog.isOpen(), true, "Dialog opened for showing selected property and selection count ");
		var selectionList = selectionDisplayDialog.getContent()[0];
		assert.strictEqual(selectionList.getItems().length, 1, "One item is displayed in dialog");
		var closeButton = selectionDisplayDialog.getButtons()[0];
		assert.strictEqual(closeButton.getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('close'), "Close Button is available");
		closeButton.firePress();
		assert.strictEqual(selectionDisplayDialog.isOpen(), null, "Dialog is closed");
		assert.strictEqual(selectionDisplayDialog.bIsDestroyed, true, "Dialog is destroyed");
	});
	QUnit.test("When pressing reset button", function(assert) {
		var oController = this.oStepContainerView.getController();
		oController.handlePressResetButton();
		assert.strictEqual(oController.byId("idReset").getVisible(), false, "Then reset button should be hided");
		assert.strictEqual(oController.byId("idSelPropertyAndCount").getVisible(), false, "Then selected property count should be hided");
		assert.strictEqual(oController.byId("idSelectedText").getVisible(), false, "Then selected text should be hided");
	});
	QUnit.module('When drawing chart container with Chart representation without selection', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepWithOutSelectionStub, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("When Chart container created with chart representation without selection", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		assert.strictEqual(oChartContainer.getContent().length, 1, "Then Chart representation added into the content");
		assert.strictEqual(oChartContainer.getCustomIcons().length, 2, "Then Custom icon for chart and alternate representation added to the chart container");
		assert.strictEqual(oChartContainer.getToolbar().getContent().length, 5, "Then Custom content added in the left(current analysis step) of toolbar");
		assert.strictEqual(oController.byId("idStepLayout").getBusy(), false, "Then chart container drawn on step layout");
	});
	QUnit.module('When drawing chart container with alternate Table representation', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepAlternateRep, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("When creating toggle representation instance", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oRepresentation = oController.oView.oViewData.oCoreApi.getActiveStep().getSelectedRepresentation();
		var orderby = {
			ascending : false,
			property : "SomeProperty"
		};
		var toggleInstance = oController.createToggleRepresentationInstance(oRepresentation, orderby);
		oRepresentation = oController.getCurrentRepresentation();
		assert.strictEqual(oRepresentation.type, "TableRepresentation", "then current representation type is table");
		assert.strictEqual(toggleInstance.type, "TableRepresentation", "Then table representation is created");
		assert.strictEqual(toggleInstance.oParameter.isAlternateRepresentation, true, "IsAlternateRepresentation parameter is set when creating table");
		assert.notStrictEqual(toggleInstance.getData(), undefined, "Then data has been setup to table representation");
		assert.notStrictEqual(toggleInstance.getMetaData(), undefined, "Then metadata has been setup to table representation");
		assert.strictEqual(toggleInstance.alternateRepresentation, undefined, "Then alternate representation should not have alternate representation");
		assert.strictEqual(toggleInstance.orderby, orderby, "Then alternate representation has correct sort condition");
	});
	QUnit.test("When creating toggle representation instance when representation doesn't have metadata (loading a path with alternate representation)", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oRepresentation = oController.oView.oViewData.oCoreApi.getActiveStep().getSelectedRepresentation();
		oRepresentation.getMetaData = function(){};
		var orderby = {
				ascending : false,
				property : "SomeProperty"
		};
		var toggleInstance = oController.createToggleRepresentationInstance(oRepresentation, orderby);
		oRepresentation = oController.getCurrentRepresentation();
		assert.strictEqual(oRepresentation.type, "TableRepresentation", "then current representation type is table");
		assert.strictEqual(toggleInstance.type, "TableRepresentation", "Then table representation is created");
		assert.strictEqual(toggleInstance.oParameter.isAlternateRepresentation, true, "IsAlternateRepresentation parameter is set when creating table");
		assert.strictEqual(toggleInstance.alternateRepresentation, undefined, "Then alternate representation should not have alternate representation");
		assert.strictEqual(toggleInstance.orderby, orderby, "Then alternate representation has correct sort condition");
	});
	QUnit.test("When pressing alternate representation icon", function(assert) {
		var oController = this.oStepContainerView.getController();
		var spyOnCreateToggleRepresentationInstance = sinon.spy(oController, "createToggleRepresentationInstance");
		var stubSelectionChanged = sinon.stub(oController.getView().getViewData().uiApi, "selectionChanged", selectionChangedStub);
		oController.handlePressAlternateRepIcon();
		var oRepresentation = oController.getCurrentRepresentation();
		assert.strictEqual(oRepresentation.type, "TableRepresentation", "then current representation type is table");
		function selectionChangedStub() {
			assert.strictEqual(spyOnCreateToggleRepresentationInstance.calledOnce, true, "Then alternate table representation is created");
			assert.strictEqual(stubSelectionChanged.calledOnce, true, "Then selection is changed");
			oController.getView().getViewData().uiApi.selectionChanged.restore();
		}
	});
	QUnit.test("When creating toggle representation with Key", function(assert) {
		var oController = this.oStepContainerView.getController();
		var requiredDimensions = sap.apf.testhelper.stub.activeStepStub.prototype.getActiveStepAlternateRep().getSelectedRepresentation().getParameter().dimensions;
		var oRepresentation = oController.oView.oViewData.oCoreApi.getActiveStep().getSelectedRepresentation();
		var toggleInstance = oController.createToggleRepresentationInstance(oRepresentation);
		var expectedDimensions = toggleInstance.getParameter().dimensions;
		assert.deepEqual(requiredDimensions, expectedDimensions, "Then correct dimension is set on table representation");
	});
	QUnit.test("Path Filter display button", function(assert) {
		var oController = this.oStepContainerView.getController();
		var pathFilterDisplayButton = oController.byId("idPathFilterDisplayButton");
		assert.ok(pathFilterDisplayButton, "Button is available");
		assert.strictEqual(pathFilterDisplayButton.getIcon(), "sap-icon://message-information", "Correct icon displayed");
		assert.strictEqual(pathFilterDisplayButton.getType(), "Transparent", "Icon type is transparent");
		assert.strictEqual(pathFilterDisplayButton.getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("pathFilterDisplayButton"), "Correct text");
		pathFilterDisplayButton.firePress();
		var dialogView = oController.byId("pathFilterDisplay");
		assert.ok(dialogView, "Dialog is created");
		assert.strictEqual(dialogView.getContent()[0].isOpen(), true, "Dialog is opened");
		assert.strictEqual(dialogView.getViewData().pathFilterInformation, "PathFilterInformation", "ViewData PathFilterInformation set correctly");
		assert.strictEqual(dialogView.getViewData().oCoreApi, this.oGlobalApi.oCoreApi, "ViewData oCoreApi set correctly");
		assert.strictEqual(dialogView.getViewData().oUiApi, this.oGlobalApi.oUiApi, "ViewData oUiApi set correctly");
		dialogView.destroy();
	});
	QUnit.test("Path Filter display button when stepContainer is busy", function(assert) {
		var oController = this.oStepContainerView.getController();
		var pathFilterDisplayButton = oController.byId("idPathFilterDisplayButton");
		oController.byId("idStepLayout").setBusy(true);
		pathFilterDisplayButton.firePress();
		var dialogView = oController.byId("pathFilterDisplay");
		assert.notOk(dialogView, "Dialog is not yet created");
		oController.byId("idStepLayout").setBusy(false);
		pathFilterDisplayButton.firePress();
		dialogView = oController.byId("pathFilterDisplay");
		assert.strictEqual(dialogView.getContent()[0].isOpen(), true, "Dialog is opened");
		dialogView.destroy();
	});
	QUnit.module('When drawing chart container with Table representation and without topN', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepTableRepWithOutTopNStub, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("When drawing chart container with Table representation and without topN", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		assert.strictEqual(oChartContainer.getContent().length, 1, "Then table representation added into the content");
		assert.strictEqual(oChartContainer.getCustomIcons().length, 2, "Then Custom icon for chart and alternate representation added to the chart container");
		assert.strictEqual(oChartContainer.getToolbar().getContent().length, 7, "Then Custom content added in the left(current analysis step) & right(selected info and reset) of toolbar");
		assert.strictEqual(oController.byId("idStepLayout").getBusy(), false, "Then chart container drawn on step layout");
	});
	QUnit.test("When pressing reset button", function(assert) {
		var oController = this.oStepContainerView.getController();
		oController.handlePressResetButton();
		assert.strictEqual(oController.byId("idReset").getVisible(), false, "Then reset button should be hided");
		assert.strictEqual(oController.byId("idSelPropertyAndCount").getVisible(), false, "Then selected property count should be hided");
		assert.strictEqual(oController.byId("idSelectedText").getVisible(), false, "Then selected text should be hided");
	});
	QUnit.module('When drawing chart container with Table representation and with topN', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepTableRepWithTopNStub, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("When Chart container created with table representation with topN", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		assert.strictEqual(oChartContainer.getContent().length, 1, "Then table representation added into the content");
		assert.strictEqual(oChartContainer.getCustomIcons().length, 1, "Then Custom icon for chart and alternate representation added to the chart container");
		assert.strictEqual(oChartContainer.getToolbar().getContent().length, 7, "Then Custom content added in the left(current analysis step) & right(selected info and reset");
		assert.strictEqual(oController.byId("idStepLayout").getBusy(), false, "Then chart container drawn on step layout");
	});
	QUnit.module("Draw StepContent", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			that.spy = {};
			that.activeStep = {
				getSelectedRepresentation : function() {
					return {
						chart : {},
						getSelections : function() {
							return [ {
								"selectedProperty" : "A"
							} ];
						},
						getSelectionFilterLabel : function() {
							return "selectedProperty";
						},
						getParameter : function() {
							return {
								requiredFilters : [ "selectedProperty" ]
							};
						},
						getMainContent : function() {
							return new sap.ui.core.Control("ChartContent");
						},
						createDataset : function() {
						}
					};
				},
				title : "title",
				getSelectedRepresentationInfo : function() {
					return {
						label : "Chart"
					};
				},
				getRepresentationInfo : function() {
					return that.representationInfo || [ "Chart" ];
				},
				setSelectedRepresentation : function() {
				}
			};
			var inject = {
				beforeStartupCallback : function() {
					var probe = this.getProbe();
					probe.coreApi.getActiveStep = function() {
						return that.activeStep;
					};
					probe.coreApi.getSteps = function() {
					return [that.activeStep];
					};
					probe.coreApi.getTextNotHtmlEncoded = function(){
						return "anna";
					};
					probe.uiApi.getAnalysisPath = getAnalysisPathStub;
					probe.uiApi.selectionChanged = function() {
						that.oStepContainerController.drawStepContent(false);
					};
				}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				that.oGlobalApi = api;
				that.oStepContainerView = that.oGlobalApi.oUiApi.getStepContainer();
				that.oStepContainerController = that.oStepContainerView.getController();
				that.oAnalysisPathController = that.oGlobalApi.oUiApi.getAnalysisPath().getController();
				//spy
				that.spy.updateCustomListView = sinon.spy(that.oAnalysisPathController, "updateCustomListView");
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function (member) {
				that.spy[member].restore();
			});
			that.oGlobalApi.oCompContainer.destroy();
			that.oStepContainerView.destroy();
			if(sap.ui.getCore().byId("stepList")){
				sap.ui.getCore().byId("stepList").destroy(); // created by Carousel
			}
		}
	});
	QUnit.test("Only redraw chartToolbarContent", function(assert) {
		var controller = this.oStepContainerController;
		controller.drawStepContent(false);
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.deepEqual(controller.byId("idChartContainer").getContent(), [], "Chart container is empty (chart is not drawn");
	});
	QUnit.test("Step was updated (path has changed)", function(assert) {
		var controller = this.oStepContainerController;
		controller.drawStepContent(true);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Step has changed", function(assert) {
		var controller = this.oStepContainerController;
		//change active step
		this.activeStep = jQuery.extend(true, {}, this.activeStep);
		controller.drawStepContent(false);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Switch to alternate representation", function(assert) {
		var controller = this.oStepContainerController;
		controller.handlePressAlternateRepIcon();
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Click chartSwitch when only one chart is available (refresh chart)", function(assert) {
		var that = this;
		assert.expect(5);
	//prep
		var controller = this.oStepContainerController;
		var expectedStepIndex = 0;
	//act
		controller.handlePressChartIcon();
	//check
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
		assert.strictEqual(that.spy.updateCustomListView.callCount, 1, "THEN the custom list view item is updated");
		assert.strictEqual(that.spy.updateCustomListView.getCall(0).args[1], expectedStepIndex, "AND the 1st step is updated");
		assert.strictEqual(that.spy.updateCustomListView.getCall(0).args[2], false, "AND the 1st step has not changed");
	});
	QUnit.test("Click chartSwitch when many charts are available", function(assert) {
		this.representationInfo = [ {
			label : "chart"
		}, {
			label : "newChart"
		} ]; // 2charts are available
		var switchEvent = {
			getParameter : function() {
				return {
					getCustomData : function() {
						return [ {
							getValue : function() {
								return {
									oRepresentationType : {
										representationId : "newChart"
									}
								};
							}
						} ];
					}
				};
			}
		};
		var chartIconEvent = {
			getParameter : function() {
				return this.oStepContainerView;
			}.bind(this)
		};
		var controller = this.oStepContainerController;
		// Simulate change of charts and draw new chart
		controller.handlePressChartIcon(chartIconEvent);
		controller.handleSelectionChartSwitchIcon(switchEvent);
		controller.drawStepContent(false);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Zoom and then draw chart", function(assert) {
		var controller = this.oStepContainerController;
		controller.byId("idChartContainer").fireCustomZoomInPress();
		controller.drawStepContent(true);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.module('When drawing chart container toggle button should be enabled', {
		beforeEach : function(assert) {
			var activeStep = sap.apf.testhelper.stub.activeStepStub.prototype;
			_drawStepContent(this, activeStep.getActiveStepWithSelectionStub, assert);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
		}
	});
	QUnit.test("Default values of toggle button", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		var ToggleDisplayButton = oController.byId("idToggleDisplayButton");
		assert.ok(ToggleDisplayButton,"Toggle button is available");
		assert.strictEqual(ToggleDisplayButton.getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("values"), "Correct text");
		// var oRepresentation = oController.getCurrentRepresentation();
		// var visible = oRepresentation.chartPlotArea.plotArea.dataLabel.visible;
		assert.strictEqual(ToggleDisplayButton.getPressed(), false, "Button default value is off");
	});
	QUnit.test("Data values should be displayed when button is enabled", function(assert) {
		var oController = this.oStepContainerView.getController();
		var oChartContainer = oController.byId("idChartContainer");
		assert.notStrictEqual(oChartContainer, undefined, "Then Chart Container created");
		// var oRepresentation = oController.getCurrentRepresentation();
		var ToggleDisplayButton = oController.byId("idToggleDisplayButton");
		assert.ok(ToggleDisplayButton.setPressed(true),"When button is pressed");
		// var visible = oRepresentation.chartPlotArea.plotArea.dataLabel.visible;
		assert.strictEqual(oController.handleToggleDisplay(),true, "KPI values are displayed on graph");
	});
	QUnit.module("Draw StepContent without chart attribute as in table and alt. representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			that.spy = {};
			this.activeStep = {
				getSelectedRepresentation : function() {
					return {
						getSelections : function() {
							return [ {
								"selectedProperty" : "A"
							} ];
						},
						getSelectionFilterLabel : function() {
							return "selectedProperty";
						},
						getParameter : function() {
							return {
								requiredFilters : [ "selectedProperty" ]
							};
						},
						getMainContent : function() {
							return new sap.ui.core.Control("ChartContent");
						},
						createDataset : function() {
						}
					};
				},
				title : "title",
				getSelectedRepresentationInfo : function() {
					return {
						label : "Chart"
					};
				},
				getRepresentationInfo : function() {
					return that.representationInfo || [ "Chart" ];
				},
				setSelectedRepresentation : function() {
				}
			};
			var inject = {
				beforeStartupCallback : function() {
					var probe = this.getProbe();
					probe.coreApi.getActiveStep = function() {
						return that.activeStep;
					};
					probe.coreApi.getSteps = function() {
						return [that.activeStep];
					};
					probe.uiApi.getAnalysisPath = getAnalysisPathStub;
					probe.uiApi.selectionChanged = function() {
						that.oStepContainerController.drawStepContent(false);
					};
					probe.coreApi.getTextNotHtmlEncoded = function(){
						return "mara";
					};
				}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				this.oGlobalApi = api;
				this.oStepContainerView = this.oGlobalApi.oUiApi.getStepContainer();
				this.oStepContainerController = this.oStepContainerView.getController();
				that.oAnalysisPathController = this.oGlobalApi.oUiApi.getAnalysisPath().getController();
				//spy
				that.spy.updateCustomListView = sinon.spy(that.oAnalysisPathController, "updateCustomListView");
				done();
			}.bind(this));
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function (member) {
				that.spy[member].restore();
			});
			this.oGlobalApi.oCompContainer.destroy();
			this.oStepContainerView.destroy();
			if(sap.ui.getCore().byId("stepList")){
				sap.ui.getCore().byId("stepList").destroy(); // created by Carousel
			}
		}
	});
	QUnit.test("Only redraw chartToolbarContent", function(assert) {
		assert.expect(2);
		var controller = this.oStepContainerController;
		controller.drawStepContent(false);
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.deepEqual(controller.byId("idChartContainer").getContent(), [], "Chart container is empty (chart is not drawn");
	});
	QUnit.test("Step was updated (path has changed)", function(assert) {
		assert.expect(2);
		var controller = this.oStepContainerController;
		controller.drawStepContent(true);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Step has changed", function(assert) {
		assert.expect(2);
		var controller = this.oStepContainerController;
		//change active step
		this.activeStep = jQuery.extend(true, {}, this.activeStep);
		controller.drawStepContent(false);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Switch to alternate representation", function(assert) {
		assert.expect(2);
		var controller = this.oStepContainerController;
		controller.handlePressAlternateRepIcon();
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Click chartSwitch when only one chart is available (refresh chart)", function(assert) {
		assert.expect(5);
		//prep
		var expectedStepIndex = 0;
		var controller = this.oStepContainerController;
		//act
		controller.handlePressChartIcon();
		//check
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
		assert.strictEqual(this.spy.updateCustomListView.callCount, 1, "THEN the custom list view item is updated");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[1], expectedStepIndex, "AND the 1st step is updated");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[2], false, "AND the 1st step has not changed");
	});
	QUnit.test("Click chartSwitch when many charts are available", function(assert) {
		assert.expect(2);
		//prep
		this.representationInfo = [ {
			label : "chart"
		}, {
			label : "newChart"
		} ]; // 2charts are available
		var switchEvent = {
			getParameter : function() {
				return {
					getCustomData : function() {
						return [ {
							getValue : function() {
								return {
									oRepresentationType : {
										representationId : "newChart"
									}
								};
							}
						} ];
					}
				};
			}
		};
		var chartIconEvent = {
			getParameter : function() {
				return this.oStepContainerView;
			}.bind(this)
		};
		var controller = this.oStepContainerController;
		// Simulate change of charts and draw new chart
		controller.handlePressChartIcon(chartIconEvent);
		controller.handleSelectionChartSwitchIcon(switchEvent);
		//act
		controller.drawStepContent(false);
		//check
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
	QUnit.test("Zoom and then draw chart", function(assert) {
		assert.expect(2);
		var controller = this.oStepContainerController;
		controller.byId("idChartContainer").fireCustomZoomInPress();
		controller.drawStepContent(true);
		var chartContainer = controller.byId("idChartContainer");
		var chartContent = chartContainer.getContent()[0].getContent();
		assert.strictEqual(controller.byId("idSelPropertyAndCount").getText(), "selectedProperty (1) ", "SelectedProperty link in toolbar is set (toolbar is drawn)");
		assert.strictEqual(chartContent.getId(), "ChartContent", "Main Content from representation set as content into chart container (chart is drawn)");
	});
})();