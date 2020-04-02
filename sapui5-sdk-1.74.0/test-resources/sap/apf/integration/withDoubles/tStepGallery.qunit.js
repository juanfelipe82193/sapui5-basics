(function() {
	/* globals ok, strictEqual, opaTest */
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.registerModulePath('sap.apf.integration', '../');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfUiInstance');
    jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
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
	function firePressOnElementByTitle(title){
		var done;
		jQuery.each( jQuery('.sapMLIB'), function(name, element){ 
			var attribute = sap.ui.getCore().byId(element.getAttribute("id"));
			if(!done && attribute.mProperties.title === title){
				attribute.firePress();// click on the representation
				done = true;
			}
		}); 
	}
	var arrangement = sap.ui.test.Opa5.extend("arrangement", {
		globalSetup : function() {

			var inject = {
					constructors : {
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						Metadata : sap.apf.testhelper.doubles.Metadata,
						Request : sap.apf.testhelper.doubles.Request,
						NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
					}
			};

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
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject).done(function(api){
				oGlobalApi = api;
				oGlobalApi.oCompContainer.placeAt("stepContainerContent");
			});
		}
	});
	var action = sap.ui.test.Opa5.extend("action", {
		representationClickStepGallery : function(oCurrentStep, bStepChanged) {
			oGlobalApi.oUiApi.getAddAnalysisStepButton().firePress();
			firePressOnElementByTitle("categoryTitle"); // Navigating to second page (steps)
			firePressOnElementByTitle("RevenueByCustomer"); //Navigating to third page (representations)

			return this.waitFor({
				timeout : 2000,
				check : function() {
					var representationList = jQuery(".sapMLIB").length; // list has only the current content on the hierarchical dialog
					if (representationList > 2) {
						return representationList;
					}
				},
				success : function() {
					firePressOnElementByTitle("Pie Chart"); //create step
				},
				error : function() {
					ok(false, "Representation List not rendered!!");
				}
			});
		},
		createStep : function() {
			return this.waitFor({
				timeout : 2000,
				check : function() {
					var bIsStepCreated = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					if (stepLength > 0) {
						bIsStepCreated = true;
					}
					return bIsStepCreated;
				},
				error : function() {
					ok(false, "Step creation failed!!!");
					self.globalTearDown();
				}
			});
		}
	});
	var assertion = sap.ui.test.Opa5.extend("assertion", {
		checkStepContainer : function() {
			var self = this;
			return this.waitFor({
				timeout : 3000,
				check : function() {
					var bStepCrested = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					var contentRight = (oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight().length === 10) ? true : false;
					if (stepLength > 0 && contentRight > 0) {
						bStepCrested = true;
					}
					return bStepCrested;
				},
				success : function() {
					ok(oGlobalApi.oCoreApi.getSteps().length > 0, "Step created on click of representation in step gallery");
					var chartInStepContainer = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().getContent()[0].getCharts();
					strictEqual(oGlobalApi.oCoreApi.getSteps().length, 1, "Step is added to the layout");
					strictEqual(chartInStepContainer.length, 1, "One chart is available in the step container");
					var selectedRepTypeMainContent = oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().getMainContent("localText2").getVizType();
					var chartTypeInStepContainer = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().getContent()[0].getCharts()[0].getVizType();
					var chartTypeInStepTemplate = oGlobalApi.oCoreApi.getStepTemplates()[0].getRepresentationInfo()[0].representationId;
					strictEqual(chartTypeInStepTemplate, "PieChart", "Representation type in the step created is " + chartTypeInStepTemplate);
					strictEqual(chartTypeInStepContainer, "pie", "Representation type " + chartTypeInStepContainer + "added in step container");
					strictEqual(selectedRepTypeMainContent, "pie", "Selected representation type is " + selectedRepTypeMainContent);
					strictEqual(selectedRepTypeThumbnailContent, selectedRepTypeMainContent, "Representation type is same in thumbnail and step container");
					strictEqual(chartTypeInStepContainer, selectedRepTypeMainContent, "Representation type added in step container is same as the selected representation type");
					self.globalTearDown();
				},
				error : function() {
					ok(false, "StepContainer not rendered!!!");
					self.globalTearDown();
				}
			});
		},
		globalTearDown : function() {
			jQuery("#stepContainerContent").remove();
		}
	});
	sap.ui.test.Opa5.extendConfig({
		arrangements : new arrangement(),
		actions : new action(),
		assertions : new assertion()
	});
	opaTest("Creation of step on click of a representation in the step gallery", function(Given, When, Then) {
		Given.globalSetup(); // Arrangements
		When.representationClickStepGallery().and.createStep(); //Actions
		Then.checkStepContainer(); // Assertions
	});
}());