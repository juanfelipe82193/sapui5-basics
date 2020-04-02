(function() {
	/* globals window, ok, strictEqual, opaTest, deepEqual, notStrictEqual */
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.registerModulePath('sap.apf.integration', '../');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfUiInstance');
    jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
	jQuery.sap.require('sap.apf.testhelper.doubles.createUiApiAsPromise');
	jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require('sap.apf.testhelper.stub.textResourceHandlerStub');
	jQuery.sap.require("sap.apf.core.utils.uriGenerator");
	jQuery.sap.require("sap.ui.test.Opa5");
	jQuery.sap.require("sap.ui.test.opaQunit");
	var oGlobalApi;

	var appLayout;
	var oldRepId;
	var drawRepresentation = function(oCurrentStep, bStepChanged) {
		oGlobalApi.oCoreApi.setActiveStep(oGlobalApi.oCoreApi.getSteps()[0]);
		var nIndex = oGlobalApi.oCoreApi.getSteps().indexOf(oGlobalApi.oCoreApi.getActiveStep());
		if (nIndex === 0) {
			oGlobalApi.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
			oGlobalApi.oCoreApi.setActiveStep(oGlobalApi.oCoreApi.getSteps()[oGlobalApi.oCoreApi.getSteps().length - 1]);
		}
		oGlobalApi.oUiApi.getAnalysisPath().getController().updateCurrentStep(oCurrentStep, nIndex, bStepChanged);
		oGlobalApi.oUiApi.getLayoutView().setBusy(false);
	};
	var arrangement = sap.ui.test.Opa5.extend("arrangement", {
		globalSetup : function() {

			var newMetadata = function() {
				var metadata;
				this.getPropertyMetadata = function(sPropertyName) {
					if (sPropertyName === "CustomerName") {
						metadata = {
							"aggregation-role" : "dimension",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"label" : "Customer Name",
							"name" : "CustomerName"
						};
						return metadata;
					}
					if (sPropertyName === "DaysSalesOutstanding") {
						metadata = {
							"aggregation-role" : "measure",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"label" : "DSO",
							"name" : "DaysSalesOutstanding"
						};
						return metadata;
					}
				};
			};
			sinon.stub(sap.apf.testhelper.doubles, 'Metadata', newMetadata);
			var inject = {
					constructors : {
						Metadata : sap.apf.testhelper.doubles.Metadata,
						Request : sap.apf.testhelper.doubles.Request,
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
					}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise("CompUi", "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject).done(function(api){
				oGlobalApi = api;
				sinon.stub(oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', function(x, y) {
					if (x.key !== undefined) {
						return x.key;
					} else if (x && y) {
						return y[0] + ":" + y[1];
					}
					return x;
				});
			});
			
			return this;
		}
	});
	var action = sap.ui.test.Opa5.extend("action",
			{
				createStep : function(oCurrentStep, bStepChanged) {
					//create application layout and add a step
					appLayout = oGlobalApi.oUiApi.createApplicationLayout();
					appLayout.placeAt("stepContainerContent");
					sap.ui.getCore().applyChanges();
					var sampleStepTemplate;
					if (oGlobalApi.oCoreApi.getStepTemplates()[0]) {
						sampleStepTemplate = oGlobalApi.oCoreApi.getStepTemplates()[0];
					}
					oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation, sampleStepTemplate.getRepresentationInfo()[0].representationId);
					return this;
				},
				pressListBtn : function() {
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var iconList = jQuery(".iconList").length;
							return iconList;
						},
						success : function() {
							var listButton = sap.ui.getCore().byId(jQuery(".iconList")[0].id);
							listButton.firePress();
						},
						error : function() {
							ok(false, "Icon List not rendered!!");
						}
					});
				},
				pressFullScreenBtn : function() {
					return this.waitFor({
								timeout : 3000,
								check : function() {
									var contentRight = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight().length;
									return contentRight;
								},
								success : function() {
									var fullScreenButton = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight()[oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar()
											.getContentRight().length - 2];
									fullScreenButton.firePress();
								},
								error : function() {
									ok(false, "Full Screen Btn not rendered!!");
								}
							});
				},
				pressSwitchRepresentation : function() {
					oldRepId = oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId;
					return this.waitFor({
						timeout : 3000,
						check : function() {
							jQuery(".iconLeft").show();
							sap.ui.getCore().applyChanges();
							var iconLeft = jQuery(".iconLeft");
							return iconLeft;
						},
						success : function() {
							sap.ui.getCore().byId(jQuery(".iconLeft")[1].id).firePress();
						},
						error : function() {
							ok(false, "Icon Left not rendered!!");
						}
					});
				},
				pressSwitchRepresentationAfterSelection : function() {
					return this.waitFor({
						check : function() {
							jQuery(".iconLeft").show();
                                                  //Check whether the context has the old representation before switch and also the selections are already available on teh old repn before proceeding to switch 
                                                  //Check also whether the icons for switching are available in chart toolbar
							if (sap.ui.test.Opa5.getContext().repnBeforeSwitch && sap.ui.test.Opa5.getContext().repnBeforeSwitch.getSelections().length !== 0 && jQuery(".iconLeft").length !== 0) {
								return true;
							}
						},
						success : function() {
							sap.ui.getCore().byId(jQuery(".iconLeft")[1].id).firePress();
						},
						error : function() {
							ok(false, "Icon Left not rendered!!");
						}
					});
				},
				doSelection : function() {

					return this.waitFor({
						check : function() {
							var repr = oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation();
							return repr;
						},
						success : function() {
							var activeRep = oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation();
							activeRep.chart.attachEventOnce('renderComplete', function() {
								var dimensionName = activeRep.dataset.getDimensions()[0].getName();
								var measureName = activeRep.dataset.getMeasures()[0].getName();
								var extDataResp = activeRep.UI5ChartHelper.extendedDataResponse;
								var selectionObjects = [];
								for( var i = 0; i < 2; i++) {
									var selObj = {
										data : {}
									};
									selObj.data[dimensionName] = extDataResp[i][activeRep.dimension[0].fieldName];
									selObj.data[measureName] = parseFloat(extDataResp[i][activeRep.measure[0].fieldName]);
									selectionObjects.push(selObj);
								}
								window.selObjs = selectionObjects;
								if (activeRep.chart.selection) {
									activeRep.chart.selection(selectionObjects);
								} else {
									activeRep.chart.vizSelection(selectionObjects);
								}
								sap.ui.test.Opa5.getContext().repnBeforeSwitch = activeRep;
							});
						},
						error : function() {
							ok(false, "Selection not handled!!");
						}
					});
				},
				toggleLegend : function() {
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var legend = jQuery(".legendIcon").length;
							return legend;
						},
						success : function() {
							var legendButton = jQuery(".legendIcon")[0];
							legendButton.trigger("click");
						}
					});
				}
			});
	var assertion = sap.ui.test.Opa5.extend("assertion",
			{
				checkLegendDisplay : function() {
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var legendBnd = jQuery(".v-m-legends .v-bound ").length;
							return legendBnd;
						},
						success : function() {
							var legendHeight = (jQuery(jQuery(".v-m-legends .v-bound ")[1]))[0].getAttribute('height');
							strictEqual(parseInt(legendHeight, 10), 0, "Legend is hidden");
						}
					});
				},
				checkDeselectionCount : function() {
					var self = this;
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var resetBtn = jQuery(".resetSelection").length;
							return resetBtn;
						},
						success : function() {
							sap.ui.getCore().byId(jQuery(".resetSelection")[0].id).firePress(); // deselect selections
							//strictEqual(oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation().getSelections().length, 0, "Deselected the selections made");
							strictEqual(jQuery(".showSelection")[0].style.display, "none", "Selection label is not displayed as selections made are deselected with deselect icon");
							strictEqual(jQuery(".resetSelection")[0].style.display, "none", "Deselection icon is not displayed as selections made are deselected with deselect icon");
							self.globalTearDown();
						},
						error : function() {
							ok(false, "Deselection failed!!!");
							self.globalTearDown();
						}
					});
				},
				checkSelectionCount : function() {
					var activeRep = oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation();
					var self = this;
					return this.waitFor({
						check : function() {
							if (activeRep.getSelections().length !== 0) {
								return true;
							}
							return false;
						},
						success : function() {
							var oldRep = sap.ui.test.Opa5.getContext().repnBeforeSwitch;
							deepEqual(oldRep.getSelections(), activeRep.getSelections(), "Selection is transferred on switching representation");
							self.globalTearDown();
						},
						error : function() {
							ok(false, "Selection failed!!!");
							self.globalTearDown();
						}
					});
				},
				checkIconAvailability : function() {
					var self = this;
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var contentRight = (oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight().length === 10) ? true : false;
							return contentRight;
						},
						success : function() {
							strictEqual(oGlobalApi.oCoreApi.getSteps().length, 1, "Step is added to the layout");
							var toolbarRightContent = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight();
							var toolbarLeftContent = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentLeft();
							var toolbarMiddleContent = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentMiddle();
							strictEqual(toolbarRightContent.length, 10, "Multiple Representations, List with representations, table icon, fullscreen etc are added to toolbar left content");
							strictEqual(toolbarLeftContent.length, 4, "Current Step and Selected label, Selection Count link and Selected number end textlabels are added to toolbar right content");
							strictEqual(toolbarMiddleContent.length, 0, "Nothing is added to the toolbar middle content");
							self.globalTearDown();
						},
						error : function() {
							ok(false, "StepToolbar not rendered!!!");
							self.globalTearDown();
						}
					});
				},
				isFullScreen : function() {
					var self = this;
					return this
							.waitFor({
								timeout : 3000,
								check : function() {
									var fullScreen = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getFullScreen();
									return fullScreen;
								},
								success : function() {
									strictEqual(oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getFullScreen(), true, "Switched to Fullscreen Mode");
									strictEqual(jQuery(".iconLeft")[0].style.display, "", "List of multiple representations is hidden");
									var fullScreenButton = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight()[oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar()
											.getContentRight().length - 1];
									fullScreenButton.firePress();
								},
								error : function() {
									ok(false, "Fullscreen btn not rendered!!!");
									self.globalTearDown();
								}
							});
				},
				checkRepresentationId : function() {
					var self = this;
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var repId = oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId;
							return repId;
						},
						success : function() {
							notStrictEqual(oldRepId, oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentationInfo().representationId, "Representation is switched");
							self.globalTearDown();
						},
						error : function() {
							ok(false, "Represenation Id doent exist!!!");
							self.globalTearDown();
						}
					});
				},
				checkListIcon : function() {
					var self = this;
					return this.waitFor({
						timeout : 3000,
						check : function() {
							var listPopOver = jQuery(".sapCaUiChartToolBarShowAllChartListPopover").length;
							return listPopOver;
						},
						success : function() {
							var listButton = sap.ui.getCore().byId(jQuery(".iconList")[0].id);
							strictEqual(listButton.getIcon(), "sap-icon://pie-chart", "Default representation is shown as Icon for the list");
							strictEqual(jQuery(".sapCaUiChartToolBarShowAllChartListPopover").length, 1, "Popover is opened");
							var representationListItems = sap.ui.getCore().byId(jQuery(".sapCaUiChartToolBarShowAllChartListPopover")[0].id).getContent()[0].getItems();
							strictEqual(representationListItems.length, oGlobalApi.oCoreApi.getActiveStep().getRepresentationInfo().length, "Popover shows the multiple representations of the step");
							self.globalTearDown();
						},
						error : function() {
							ok(false, "Pop Over not rendered!!!");
							self.globalTearDown();
						}
					});
				},
				globalTearDown : function() {
					sap.apf.testhelper.doubles.Metadata.restore();
					oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
					//oGlobalApi.oUiApi.getEventCallback.restore();
					appLayout.getCurrentPage().getContent()[0].getContent()[1].destroyMasterPages();
					appLayout.getCurrentPage().getContent()[0].getContent()[1].destroyMasterPages().destroyDetailPages();
					appLayout.destroy();
					oGlobalApi.oCompContainer.destroy();
					return this;
				}
			});
	sap.ui.test.Opa5.extendConfig({
		arrangements : new arrangement(),
		actions : new action(),
		assertions : new assertion()
	});
	opaTest("Check Icon Availability", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep();
		// Assertions
		Then.checkIconAvailability();
	});
	opaTest("Multiple Representation List Icon Test", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep().and.pressListBtn();
		// Assertions
		Then.checkListIcon();
	});
	opaTest("Toggle Fullscreen Test", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep().and.pressFullScreenBtn();
		// Assertions
		Then.checkListIcon();
	});
	opaTest("Switch Representation", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep().and.pressSwitchRepresentation();
		// Assertions
		Then.checkRepresentationId();
	});
	opaTest("Selection Handover Test", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep().and.doSelection().and.pressSwitchRepresentationAfterSelection();
		// Assertions
		Then.checkSelectionCount();
	});
	opaTest("Deselection Test", function(Given, When, Then) {
		// Arrangements
		Given.globalSetup();
		//Actions
		When.createStep().and.doSelection();
		// Assertions
		Then.checkDeselectionCount();
	});
	/*opaTest("show and hide Legend test", function (Given, When, Then) {
		// Arrangements
		Given.globalSetup();

		//Actions
		When.createStep().and.toggleLegend();

		// Assertions
		Then.checkLegendDisplay();
	});
	
	opaTest("Toggle to Alternate Representation and Sort table test", (Given, When, Then) {
		// Arrangements
		Given.globalSetup();

		//Actions
		When.createStep();

		// Assertions
		Then.checkLegendDisplay();
	});
	
	*/
}());
