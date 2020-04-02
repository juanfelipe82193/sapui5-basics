/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5","sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaDataStore", "sap/ui/test/matchers/AggregationFilled"],

	function (Opa5, PropertyStrictEquals, OpaResourceBundle, OpaManifest, OpaDataStore, AggregationFilled) {

		return function (prefix, viewName, viewNamespace, entityType, entitySet) {

			return {
				/************************************************
				 RENDERING ASSERTIONS
				*************************************************/
				// check that the DraftResumeDialog is displayed
				theDraftResumeDialogShouldBeDisplayed: function() {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						autoWait: true,
						matchers: [
							function (oDialog) {
								var aButtons = oDialog.getButtons();
								for(var i = 0; i<aButtons.length; i++){
									var oButton = aButtons[i];
									if (oButton.getText() === "Resume"){
										return true;
									}
								}
								return false;
							}
						],
						success: function (aControl) {
							ok(true, "The DraftResumeDialog is opened");
						},
						errorMessage: "The DraftResumeDialog is not opened"
					});
				},

				theDraftActivateConfirmationDialogIsRenderedWithSaveButton: function (bSaveBtnVisibility) {
					return this.waitFor ({
						id: prefix+"ShowConfirmationOnDraftActivate",
						success: function (oDialog) {
							if(oDialog.getBeginButton().getVisible() === bSaveBtnVisibility ) {
								if(bSaveBtnVisibility === true) {
									ok(true, "The Draft Activation Confirmation Dialog is rendered with the Save button");
								} else {
									ok(true, "The Draft Activation Confirmation Dialog is rendered without the Save button");
								}
							}
						},
						errorMessage: "The Draft Activation Confirmation Dialog is not rendered with correct buttons"
					});
				},

				thePageShouldBeOpened: function() {
					var sId = prefix + "objectPage";
					return this.waitFor({
						id: sId,
						autoWait: true,
						success: function() {
							ok(true, "The Object Page has been reached, using control id: " + sId);
						},
						errorMessage: "The Object Page has NOT been reached, using control id: " + sId
					});
				},
				theSpecificPageShouldBeOpened: function(sId) {
					return this.waitFor({
						id: sId,
						autoWait: true,
						success: function() {
							ok(true, "The Object Page has been reached, using control id: " + sId);
						},
						errorMessage: "The Object Page has NOT been reached, using control id: " + sId
					});
				},
				theMessagePageShouldBeOpened: function() {
					var sControlType = "sap.m.MessagePage";
					return this.waitFor({
						controlType: sControlType,
						autoWait: true,
						success: function() {
							ok(true, "The Message Page has been reached, using control type: " + sControlType);
						},
						errorMessage: "The Message Page has NOT been reached, using control type: " + sControlType
					});
				},
				// check if the Object Page has the correct title by:
				// i. finding the control by id
				// ii. matching the "text" property of the control with the value from the annotations ("Product")
				thePageShouldContainTheCorrectTitle: function() {
					return this.waitFor({
						id: prefix + "objectTypeName",
						autoWait: false,
						matchers: new PropertyStrictEquals({
							name: "text",
							value: entityType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String
						}),
						success: function() {
							ok(true, "The Object Page Title is correct");
						},
						errorMessage: "The Object Page Title is not rendered correctly"
					});
				},

				checkObjectPageIconTabBarValue: function(bIconTabBar) {
					bIconTabBar = bIconTabBar || false;
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "useIconTabBar",
							value: bIconTabBar
						}),
						success: function() {
							Opa5.assert.ok(true, "The Object Page iconTabBar value is: " + bIconTabBar);
						},
						errorMessage: "The Object Page iconTabBar value is not as expected"
					});
				},

				theRelatedAppsShouldListTheCorrectItems: function() {
					return this.waitFor({
						id: prefix + "realtedAppsSheet",
						autoWait: false,

						success: function(oRelatedApps) {
							//equal(oRelatedApps.getButtons()[0].getText(),"EPM", "The Related Apps Sheet has correct Links Listed");
							equal(oRelatedApps.getButtons()[0].getText(),"Trace Navigation Parameters", "The Related Apps Sheet has correct Links Listed");
						},
						errorMessage: "The Related Apps Sheet has Incorrect Links Listed"
					});
				},

				theRelatedAppsShouldNotShowUnavailableActions: function () {
					return this.waitFor({
						id: prefix + "realtedAppsSheet",
						autoWait: false,

						success: function (oRelatedApps) {
							equal(oRelatedApps.getButtons().length, 1, "UnavailableActions are not visible in related apps");
						},
						errorMessage: "UnavailableActions are visible in related apps"
					});
				},

				// check if the Object Page has the correct Global Actions by:
				// i. finding the Object Page Header by control type
				// ii. check if each buttons' text against either the manifest, annotations, icon, or draft status
				thePageShouldContainTheCorrectGlobalActions: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						success: function (objectPageHeader) {
							var sShareActionText = "Share",
								aActionButton = [], aActionTextsThatAppear = [], aActionTextThatShouldAppear = [], aIdentificationAnnotations = [],
								mCustomActions = {},
								oManifestJSONModel;

							// get the action buttons' text from the object header
							aActionButton = objectPageHeader[0].getActions();
							for (var i = 0; i < aActionButton.length; i++) {
								if (aActionButton[i].getMetadata().getName() === "sap.uxap.ObjectPageHeaderActionButton") { // make sure to check only buttons (not e.g. HBox, etc...)
									if (aActionButton[i].getIcon() === "sap-icon://action") { // Share action
										aActionTextsThatAppear.push(sShareActionText);
									} else {
										aActionTextsThatAppear.push(aActionButton[i].getText());
									}
								}
							}

							// get the custom actions text from the manifest
							oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
							mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/sap.ui.generic.app/" + entitySet + "/Header/Actions");
							for (var customAction in mCustomActions) {
								if (mCustomActions.hasOwnProperty(customAction)) {
									if (!mCustomActions[customAction].determining) {
										aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
									}
								}
							}

							// get the annotated actions text from the metamodel
							aIdentificationAnnotations = entityType["com.sap.vocabularies.UI.v1.Identification"];
							for (var i = 0; i < aIdentificationAnnotations.length; i++) {
								if (aIdentificationAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
									aIdentificationAnnotations[i]["com.sap.vocabularies.UI.v1.Importance"].EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High" &&
									(!aIdentificationAnnotations[i].Determining || aIdentificationAnnotations[i].Determining.Bool === "false")) {
									aActionTextThatShouldAppear.push(aIdentificationAnnotations[i].Label.String);
								}
							}

							// get the 'Delete' and 'Edit' text actions if Draft Root is annotated
							if (entitySet["com.sap.vocabularies.Common.v1.DraftRoot"]) {
//								aActionTextThatShouldAppear.push(OpaResourceBundle.template.ObjectPage.getProperty("DELETE"), OpaResourceBundle.template.ObjectPage.getProperty("EDIT"));
								aActionTextThatShouldAppear.push("Delete", "Edit");
							}

							// push the 'Share' action to the texts that should appear
							aActionTextThatShouldAppear.push(sShareActionText);

							// compare the actions' text that should appear vs. the actions' text that actually appear
							for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
								for (var j =0; j < aActionTextsThatAppear.length; j++) {
									if (aActionTextsThatAppear[j] === aActionTextThatShouldAppear[i]) {
										ok(true, "Global Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
										break;
									}
									else if (j === aActionTextsThatAppear.length - 1) {
										ok(false, "Global Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
									}
								}
							}
						},
						errorMessage: "The Global Actions on the Object Page Header is not rendered correctly"
					});
				},
				// check if the Object Page has the correct Determining Actions by:
				// i. finding the Object Page Layout by control type
				// ii. check if each buttons' text against either the manifest or annotations
				thePageShouldContainTheCorrectDeterminingActions: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (objectPage) {
							var aButton = [], aActionTextsThatAppear = [], aActionTextThatShouldAppear = [], aIdentificationAnnotations = [];
							var oFooter = objectPage[0].getFooter();
							var mCustomActions = {}, oManifestJSONModel;

							// get the action buttons' text from the object header
							aButton = oFooter.getContent();
							for (var i = 0; i < aButton.length; i++) {
								if (aButton[i].getMetadata().getName() === "sap.m.Button" && aButton[i].getVisible()) {
									aActionTextsThatAppear.push(aButton[i].getText());
								}
							}

							// get the custom actions text from the manifest
							oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
							mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/sap.ui.generic.app/" + entitySet + "/Header/Actions");
							for (var customAction in mCustomActions) {
								if (mCustomActions.hasOwnProperty(customAction)) {
									if (mCustomActions[customAction].determining) {
										aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
									}
								}
							}

							// get the annotated actions text from the metamodel
							aIdentificationAnnotations = entityType["com.sap.vocabularies.UI.v1.Identification"];
							for (var i = 0; i < aIdentificationAnnotations.length; i++) {
								if (aIdentificationAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
									aIdentificationAnnotations[i]["com.sap.vocabularies.UI.v1.Importance"].EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High" &&
									aIdentificationAnnotations[i].Determining && aIdentificationAnnotations[i].Determining.Bool === "true") {
									aActionTextThatShouldAppear.push(aIdentificationAnnotations[i].Label.String);
								}
							}

							// compare the actions' text that should appear vs. the actions' text that actually appear
							for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
								for (var j =0; j < aActionTextsThatAppear.length; j++) {
									if (aActionTextsThatAppear[j] === aActionTextThatShouldAppear[i]) {
										ok(true, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
										break;
									}
									else if (j === aActionTextsThatAppear.length - 1) {
										ok(false, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
									}
								}
							}
						},
						errorMessage: "The Determining Actions in the Object Page Footer are not rendered correctly"
					});
				},
				// check if the Header Facet "General Information" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetGeneralInformationIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader"
					var sFacetName = "General Information";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.FieldGroup)" + "(.*GeneralInformationForHeader)" + "(.*Form)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							equals(aItems.length, 5, "There should be 4 items in the VBox");
							// Label
							var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel");
							equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
							equal(aItems[1].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
							equal(aItems[2].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
							equal(aItems[2].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
							// Link
							//commented the below assertion as contact popup is not added in xml view as an inline fragment. It is loaded on runtime.
							//equal(aItems[4].getItems()[0].getMetadata().getName(), "sap.m.QuickView", sFacetName + " - " + "The quick view is rendered");
							equal(aItems[4].getItems()[0].getMetadata().getName(), "sap.m.Label", sFacetName + " - " + "The label is rendered");
							equal(aItems[4].getItems()[1].getMetadata().getName(), "sap.m.Link", sFacetName + " - " + "The link is rendered");
						},
						errorMessage:  sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Product Category" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProductCategoryIsRendered: function () {
					// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
					var sFacetName = "Product Category";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.Identification)" + "(.*Form)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							equals(aItems.length, 3, "There should be 3 items in the VBox");
							// Label
							var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory");
							equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
							equal(aItems[1].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
							equal(aItems[2].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
							equal(aItems[2].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Price" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetPriceDataPointIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
					var sFacetName = "Price DataPoint";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.DataPoint)" + "(.*Price)" + "(.*DataPoint)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							equals(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							equal(aItems[0].getText(), "Price", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Stock Availability" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetStockAvailabilityDataPointIsRendered: function () {
					// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
					var sFacetName = "Stock Availability DataPoint";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.DataPoint)" + "(.*StockLevel)" + "(.*DataPoint)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							equals(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							equal(aItems[0].getText(), "Availability", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Plain Text" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProductDescriptionPlainTextIsRendered: function () {
					// annotation path: "to_ProductTextInCurrentLang/@com.sap.vocabularies.UI.v1.FieldGroup#PlainText"
					var sFacetName = "Product Description Plain Text";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*to_ProductTextInOriginalLang)" + "(.*com.sap.vocabularies.UI.v1.FieldGroup)" + "(.*PlainText)" + "(.*PlainTextVBox)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							equals(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescription"), sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getMetadata().getName(), "sap.m.Text", sFacetName + " - " + "The text field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Smart Micro Chart" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetSmartMicroChartIsAnnotatedAndIsRendered: function() {
					// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
					// needs further investigation
					if (sap.ui.Device.browser.firefox) {
						ok(true, "Firefox detected - TEST 'The Smart Area Micro Chart is annotated and rendered correctly' SKIPPED. Reason: issue with rendering mutliple Smart Micro Charts in FF.");
						return this;
					}
					return this.waitFor({
						id: new RegExp("(.*SmartMicroChartVBox)"),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(aControl) {
							var bChartIsAnnotated = false;
							var aFacetAnnotations = entityType["com.sap.vocabularies.UI.v1.HeaderFacets"];

							// check for smart micro area and bullet charts based on annotations
							for(var i = 0; i < aFacetAnnotations.length; i++) {
								if (aFacetAnnotations[i].Target.AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") >= 0) {
									var bSmartAreaMicroChartFound = false, bSmartBulletMicroChartFound = false;
									bChartIsAnnotated = true;

									for (var j = 0; j < aControl.length; j++) {
										if (aControl[j].getMetadata().getName() === "sap.m.VBox") {
											var aVBoxItems = aControl[j].getItems();
											var oTitleLabel, oSubTitleLabel, oFooterLabel;

											if (!bSmartAreaMicroChartFound || !bSmartBulletMicroChartFound) {
												for (var k = 0; k < aVBoxItems.length; k++) {
													if (aVBoxItems[k].getMetadata().getName() === "sap.ui.comp.smartmicrochart.SmartMicroChart") {
														oTitleLabel = aVBoxItems[0];
														oSubTitleLabel = aVBoxItems[1];
														oFooterLabel = aVBoxItems[3];
														var oSmartMicroChart = aVBoxItems[k];

														if (oSmartMicroChart.getChartType() === "Area") {
															equal(oTitleLabel.getVisible(), true, "The title inside the VBox which contains the Smart Area Micro Chart is rendered correctly");
															equal(oSubTitleLabel.getVisible(), true, "The subtitle inside the VBox which contains the Smart Area Micro Chart is rendered correctly");
															equal(oFooterLabel.getVisible(), true, "The footer inside the VBox which contains the Smart Area Micro Chart is rendered correctly");

															bSmartAreaMicroChartFound = true;
															break;
														}
														if (oSmartMicroChart.getChartType() === "Bullet") {
															equal(oTitleLabel.getVisible(), true, "The title inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");
															equal(oSubTitleLabel.getVisible(), true, "The subtitle inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");
															equal(oFooterLabel.getVisible(), true, "The footer inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");

															bSmartBulletMicroChartFound = true;
															break;
														}
													}
												}
											}
										}
									}
								}
							}

							if (!bChartIsAnnotated) {
								ok(true, "The Smart Micro Chart is not annotated");
							}
							else {
								bSmartAreaMicroChartFound ?	ok(true, "The Smart Area Micro Chart is annotated and rendered correctly") : notOk(true, "The Smart Area Micro Chart is annotated and did not render correctly");
								bSmartBulletMicroChartFound ? ok(true, "The Smart Bullet Micro Chart is annotated and rendered correctly") : notOk(true, "The Smart Bullet Micro Chart is annotated and did not render correctly");
							}
						},
						errorMessage: "The Smart Micro Chart was not rendered correctly"
					});
				},
				// check if the Header Facet "Progress Indicator" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProgressIndicatorIsAnnotatedAndIsRendered: function(){
					// annotation path: "to_ProductSalesRevenue/@com.sap.vocabularies.UI.v1.DataPoint"
					var sFacetName = "Availability";
					var sHeaderRegExp = new RegExp("(.*ProgressIndicatorVBox)");
					return this.waitFor({
						id: sHeaderRegExp,
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(aControl) {
							// Testing Annotations
							// Assert header facet annotations
							var sExpectedAnnotation = "to_StockAvailability/@com.sap.vocabularies.UI.v1.DataPoint#Quantity";
							var aHeaderFacetAnnotations = entityType["com.sap.vocabularies.UI.v1.HeaderFacets"];
							var oProgressIndicatorFacet;
							for (var i = 0; i < aHeaderFacetAnnotations.length; i++) {
								if (aHeaderFacetAnnotations[i].Target.AnnotationPath === sExpectedAnnotation) {
									oProgressIndicatorFacet = aHeaderFacetAnnotations[i];
									return;
								}
							}

							ok(oProgressIndicatorFacet, sFacetName + " - The Header Facet is annotated as expected");

							// Testing Rendering
							equal(aControl.length, 1, sFacetName + " - Only 1 'sap.m.VBox' control is found");
							var aItems = aControl[0].getItems();
							equals(aItems.length, 4, sFacetName + " - There should be 4 items in the VBox");
							equal(aItems[0].getText(), sFacetName, sFacetName + " - The Title is rendered correctly");
							equal(aItems[1].getText(), "Progress Indicator", sFacetName + " - The Subtitle is rendered correctly");
							var oProgressIndicator = aItems[2];
							equal(oProgressIndicator.getMetadata().getName(), "sap.m.ProgressIndicator", sFacetName + " - The ProgressIndicator control is rendered correctly");
							equal(oProgressIndicator.getPercentValue(), 84.66666666666667, sFacetName + " - The percent value is rendered correctly");
							equal(oProgressIndicator.getDisplayValue(), "127 of 150 EA", sFacetName + " - The display value is rendered correctly");
							equal(oProgressIndicator.getState(), "Success", sFacetName + " - The state is rendered correctly");
							equal(oProgressIndicator.getCustomData().length, 2, sFacetName + " - The control has custom data as expected");
							equal(aItems[3].getText(), "Quantity", sFacetName + " - The Footer is rendered correctly");
						},
						errorMessage: sFacetName + " -  The facet was not rendered correctly"
					});
				},
				// check if the Header Facet "Rating Indicator" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetRatingIndicactorIsRendered: function (bAggregated) {
					return this.waitFor({
//						this is the version of the demokit which was not taken over to the technical app (check sample.stta.manage.products)
//						id: prefix + "header::headerEditable::to_ProductRating::com.sap.vocabularies.UI.v1.DataPoint::Aggregated::RatingIndicator",
						id: prefix + "header::headerEditable::to_ProductRating::com.sap.vocabularies.UI.v1.DataPoint::Rating::RatingIndicator",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						matchers: [	new PropertyStrictEquals({
							name: "iconSize",
							value: "1.375rem"
						}),
							new PropertyStrictEquals({
								name: "maxValue",
								value: 5
//								value: 3
							}),
							new PropertyStrictEquals({
								name: "value",
								value: 4
//								value: 2.5
							})
							// For Fiori 3, enabled property will be true, editable property will be false. Once, Fiori 3
							// feature will be default feature, then this test has to be adapted.
							// new PropertyStrictEquals({
							// 	name: "enabled",
							// 	value: false
							// })
						],
						success: function (oRatingIndicator) {
							ok(true, "The Rating Indicator is rendered");

							var sActualTitle = "", sExpectedTitle = "", oSubTitleLabel, oFooterLabel;
							var aVBoxItems = oRatingIndicator.getParent().getItems();

							sActualTitle = aVBoxItems[0].getText();
							sExpectedTitle = bAggregated ? "Product Rating" : "Average User Rating";
							equal(sActualTitle, sExpectedTitle, "The title inside the VBox which contains the Rating Indicator is rendered correctly");

							oSubTitleLabel = aVBoxItems[1];
							equal(oSubTitleLabel.getVisible(), bAggregated, "The subtitle inside the VBox which contains the Rating Indicator is rendered correctly");

							oFooterLabel = aVBoxItems[3];
							// to get an indicator with subtitle choose the other one via matchers definition
							// equal(oFooterLabel.getVisible(), bAggregated, "The footer inside the VBox which contains the Rating Indicator is rendered correctly");

							if (bAggregated) {
								equal(oSubTitleLabel.getText(), "Rating Indicator", "The subtitle text inside the VBox which contains the Rating Indicator is rendered correctly");
								equal(oFooterLabel.getText(), "4.00 out of 5.00", "The footer text inside the VBox which contains the Rating Indicator is rendered correctly");
							}
						},
						error: function () {
							notOk(true, "The Rating Indicator is not rendered correctly");
						}
					});
				},
				// check if the Simple Header Facet is rendered correctly by:
				// i. finding the Object Page Layout using control type
				// ii. checking if the contents of the HBox is rendered correctly
				theSimpleHeaderFacetGeneralInformationIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader"
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,

						success: function (aControl) {
							var a = aControl;
							var aHeaderContent = aControl[0].getHeaderContent();
							equal(aHeaderContent[0].getItems()[0].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", "The smart label is rendered");
							equal(aHeaderContent[0].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[1].getItems()[0].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", "The smart label is rendered");
							equal(aHeaderContent[1].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[2].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.QuickView", "The quick view is rendered");
							equal(aHeaderContent[2].getItems()[0].getItems()[1].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[2].getItems()[0].getItems()[2].getMetadata().getName(), "sap.m.Link", "The link is rendered");
							equal(aHeaderContent[3].getItems()[0].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", "The smart label is rendered");
							equal(aHeaderContent[3].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[4].getItems()[0].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", "The smart label is rendered");
							equal(aHeaderContent[4].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[5].getItems()[0].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", "The smart label is rendered");
							equal(aHeaderContent[5].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[6].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[6].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[7].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[7].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[8].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[8].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[9].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[9].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
							equal(aHeaderContent[10].getItems()[0].getItems()[0].getMetadata().getName(), "sap.m.Label", "The label is rendered");
							equal(aHeaderContent[10].getItems()[0].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", "The smart field is rendered");
						},
						errorMessage: "Simple Header facet is not rendered"
					});
				},
				// check if the Facet "General Information" is rendered correctly by:
				// i. finding a Smart Form by id
				// ii. checking the contents of the form
				theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "GeneralInformationForm::Form",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartForm) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", aSmartFormGroups = [], oObjectPageSubSection;

							oObjectPageSubSection =  oSmartForm.getParent().getParent().getParent();
							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();
							equal(oSmartForm.getMetadata().getName(), "sap.ui.comp.smartform.SmartForm",  "The Facet " + sObjectPageSubSectionTitle + "'s content inside the Facet " + sObjectPageSectionTitle + " is a SmartForm and is rendered correctly.");

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductInfoFacetLabel");
							equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");

							aSmartFormGroups = oSmartForm.getGroups();
							for (var i = 0; i < aSmartFormGroups.length; i++) {
								var sActualLabel = aSmartFormGroups[i].getLabel();
								ok(	sActualLabel === OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel") ||
									sActualLabel === OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@TechnicalData") ||
									sActualLabel === OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory"),
									"The group label '" + sActualLabel + "' for the Facet " + sObjectPageSubSectionTitle + " inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
							}
						},
						errorMessage: "The Facet ProductInformation inside the Facet General Information is not rendered correctly."
					});
				},
				// check if the Facet "Product Description and Supplier" inside General Information is rendered correctly by:
				// i. finding a Smart Table by id
				// ii. checking the contents of the table
				theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", oObjectPageSubSection;

							oObjectPageSubSection =  oSmartTable.getParent().getParent().getParent();
							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();
							equal(oSmartTable.getMetadata().getName(), "sap.ui.comp.smarttable.SmartTable",  "The Facet " + sObjectPageSubSectionTitle + "'s content inside the Facet " + sObjectPageSectionTitle + " is a SmartTable and is rendered correctly.");

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescriptions");
							equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
						},
						errorMessage: "The Facet Product Descriptions And Supplier inside the Facet General Information is not rendered correctly."
					});
				},
				// check if the Facet "Product Description and Supplier" inside General Information renders the charts:
				// i. finding a Smart Table by id
				// ii. check each column against the annotations
				theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts: function () {
					// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
					// needs further investigation
					if (sap.ui.Device.browser.firefox) {
						ok(true, "Firefox detected - TEST 'All Columns annotated for micro charts in Product Descriptions And Supplier table render micro charts' SKIPPED. Reason: issue with rendering mutliple Smart Micro Charts in FF.");
						return this;
					}
					return this.waitFor({
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var aItems = oSmartTable.getItems();

							// columns from annotations

							var oMetadataModel = oSmartTable.getModel().getMetaModel();
							// get the Product Text entity type from the meta model
							var oProductTextEntityType = oMetadataModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductTextType");
							var aAnnotationColumns = oProductTextEntityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
								return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
								oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
								oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" ||
								((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
							});

							var iAnnotatedChartColumns = 0;
							var iRenderedChartColumns = 0;
							var aFirstRowCells =  aItems[0].getCells();
							var oCellItem;
							var sAnnotationPath;

							for(var i = 0; i < aAnnotationColumns.length; i++) {
								if (aAnnotationColumns[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
									sAnnotationPath =  aAnnotationColumns[i].Target.AnnotationPath;
									if (sAnnotationPath.indexOf('com.sap.vocabularies.UI.v1.Chart') >= 0){
										iAnnotatedChartColumns++;
										oCellItem = aFirstRowCells[i].getItems()[0];
										if(oCellItem.getChartType()){
											iRenderedChartColumns++;
										}
									}
								}
							}

							equal(iAnnotatedChartColumns, iRenderedChartColumns, "All Columns annotated for micro charts in Product Descriptions And Supplier table render micro charts");
						},
						errorMessage: "Not all Columns annotated for micro charts in Product Descriptions And Supplier table render micro charts."
					});
				},
				// check if the Facet "Product Text Navigation" inside General Information is rendered correctly by:
				// i. finding a Smart Table by id
				// ii. checking the contents of the table
				theFacetProductTextNavigationInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_ProductTextNavigation::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", oObjectPageSubSection;

							oObjectPageSubSection =  oSmartTable.getParent().getParent().getParent();
							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();
							equal(oSmartTable.getMetadata().getName(), "sap.ui.comp.smarttable.SmartTable",  "The Facet " + sObjectPageSubSectionTitle + "'s content inside the Facet " + sObjectPageSectionTitle + " is a SmartTable and is rendered correctly.");

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductTextNavigation");
							equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
						},
						error: function () {
							notOk(true, "The Facet ProducT Text Navigation inside the Facet General Information is not rendered correctly.");
						}
					});
				},
				// check if the Facet "Product Text Navigation" inside General Information renders the charts:
				// i. finding a Smart Table by id
				// ii. check each column against the annotations
				theFacetProductTextNavigationInsideTheFacetGeneralInformationRendersCharts: function () {
					// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
					// needs further investigation
					if (sap.ui.Device.browser.firefox) {
						ok(true, "Firefox detected - TEST 'All Columns annotated for micro charts in Product Text Navigation table render micro charts' SKIPPED. Reason: issue with rendering mutliple Smart Micro Charts in FF.");
						return this;
					}
					return this.waitFor({
						id: prefix + "to_ProductTextNavigation::com.sap.vocabularies.UI.v1.LineItem::responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var aItems = oSmartTable.getItems();

							// columns from annotations

							var oMetadataModel = oSmartTable.getModel().getMetaModel();
							// get the Product Text entity type from the meta model
							var oProductTextEntityType = oMetadataModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductTextType");
							var aAnnotationColumns = oProductTextEntityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
								return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
								oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
								((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
							});

							var iAnnotatedChartColumns = 0;
							var iRenderedChartColumns = 0;
							var aFirstRowCells =  aItems[0].getCells();
							var oCellItem;
							var sAnnotationPath;

							for(var i = 0; i < aAnnotationColumns.length; i++) {
								if (aAnnotationColumns[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
									sAnnotationPath =  aAnnotationColumns[i].Target.AnnotationPath;
									if (sAnnotationPath.indexOf('com.sap.vocabularies.UI.v1.Chart') >= 0){
										iAnnotatedChartColumns++;
										oCellItem = aFirstRowCells[i].getItems()[0];
										if(oCellItem.getChartType()){
											iRenderedChartColumns++;
										}
									}
								}
							}

							equal(iAnnotatedChartColumns, iRenderedChartColumns, "All Columns annotated for micro charts in Product Text Navigation table render micro charts");
						},
						errorMessage: "Not all Columns annotated for micro charts in Product Text Navigation table render micro charts."
					});
				},
				// check if the Facet "Supplier" inside General Information is rendered correctly by:
				// i. finding a Smart Form by id
				// ii. checking the contents of the form
				theFacetSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "Supplier::Form",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartForm) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", oObjectPageSubSection;

							oObjectPageSubSection =  oSmartForm.getParent().getParent().getParent();
							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();
							equal(oSmartForm.getMetadata().getName(), "sap.ui.comp.smartform.SmartForm",  "The Facet " + sObjectPageSubSectionTitle + "'s content inside the Facet " + sObjectPageSectionTitle + " is a SmartForm and is rendered correctly.");

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Supplier");
							equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
						},
						errorMessage: "The Facet Supplier inside the Facet General Information is not rendered correctly."
					});
				},
				// check if the Facet "Sales Revenue" is rendered correctly by:
				// i. finding a Smart Table by id
				// ii. checking the contents of the table
				theFacetSalesRevenueIsRenderedCorrectly: function () {
					return this.waitFor({
						id:  prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSalesDataTable) {
							var oObjectPageSection, sExpectedTitle = "";

							oObjectPageSection = oSalesDataTable.getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesRevenue");
							equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							equal(oSalesDataTable.getMetadata().getName(), "sap.ui.comp.smarttable.SmartTable", "The Facet " + oObjectPageSection.getTitle() + " content is a SmartTable and is rendered correctly.");
						},
						errorMessage: "The Facet Sales Revenue is not rendered correctly."
					});
				},
				// check if the Facet "Contacts" is rendered correctly by:
				// i. finding a List by id
				// ii. checking the contents of the list
				theFacetContactsIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_AllEmployeeContacts::com.sap.vocabularies.Communication.v1.Contact::ContactsList",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oContactList) {
							var oObjectPageSection, sExpectedTitle = "";

							oObjectPageSection = oContactList.getParent().getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Contacts");
							equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							equal(oContactList.getMetadata().getName(), "sap.m.List",  "The Facet " + oObjectPageSection.getTitle() + " content is a List and is rendered correctly.");
						},
						errorMessage: "The Facet Sales Revenue is not rendered correctly."
					});
				},
				// check if the Facet "Sales Data" rendered correctly and that the annotated action buttons appear in the toolbar by:
				// i. finding a Chart by id
				// ii. checking the contents of the chart
				theExtensionFacetSalesDataIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oExtensionFacetSalesDataChart) {
							var oObjectPageSection,	sExpectedTitle = "";

							// check for Smart Chart
							oObjectPageSection = oExtensionFacetSalesDataChart.getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesData");
							equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Extension Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							equal(oExtensionFacetSalesDataChart.getMetadata().getName(), "sap.ui.comp.smartchart.SmartChart", "The Extension Facet " + oObjectPageSection.getTitle() + " content is an SmartChart and is rendered correctly.");

							// check if there should be action buttons based on annotations
							// get the meta model first
							var oMetadataModel = oExtensionFacetSalesDataChart.getModel().getMetaModel();
							// get the Product Sales Data entity type from the meta model
							var mSalesData = oMetadataModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductSalesDataType");
							// check for and get the Actions from UI.Chart annotation
							var aActions;
							if (mSalesData && mSalesData["com.sap.vocabularies.UI.v1.Chart"] && mSalesData && mSalesData["com.sap.vocabularies.UI.v1.Chart"].Actions) {
								aActions = mSalesData["com.sap.vocabularies.UI.v1.Chart"].Actions;
							}

							// if Actions property exists in UI.Chart annotation then actions buttons should appear in the toolbar
							if (aActions && aActions.length > 0) {
								var aSmartChartToolbarContent = oExtensionFacetSalesDataChart.getToolbar().getContent();
								var aSmartChartToolbarButtonsText = [];

								// get Smart Chart toolbar buttons text
								for (var i = 0; i < aSmartChartToolbarContent.length;  i++) {
									if (aSmartChartToolbarContent[i].getMetadata().getName() === "sap.m.Button") {
										aSmartChartToolbarButtonsText.push(aSmartChartToolbarContent[i].getText());
									}
								}

								if (aSmartChartToolbarButtonsText.length > 0) {
									// compare the text from the annotations (aActions) with the toolbar buttons text (aSmartChartToolbarButtonsText)
									for (var i = 0; i < aSmartChartToolbarButtonsText.length; i++) {
										var sActionText;
										for (var j = 0; j < aActions.length; j++) {
											sActionText = aActions[j].Label.String;
											// if the two texts match then the button is okay, remove it from aAction
											if (sActionText === aSmartChartToolbarButtonsText[i]) {
												ok(true, sActionText + " action button was rendered correctly in the Smart Chart toolbar.");
												aActions.splice(j, 1); // remove matched text from aActions
												break;
											}
										}
									}

									// in the end there should not be any text in aActions since all them should be removed in the previous for loop
									// if there are still items in aActions then it seems not all of the annotated action buttons appear in the Smart Chart toolbar
									if (aActions.length > 0) {
										for (var i = 0; i < aActions.length; i++) {
											notOk(true, aActions[i].Label.String + " action button was not rendered correctly in the Smart Chart toolbar.");
										}
									}
								}
								else {
									notOk(true, "There are no buttons in the Smart Chart toolbar even though the UI.Chart annotation's 'Actions' property is defined.");
								}
							}
						},
						errorMessage: "The Extension Facet Sales Data is not rendered correctly"
					});
				},

				theObjectPageTableIsRendered: function () {
					return this.waitFor({
						id: prefix + "to_ProductTextNavigation::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: new PropertyStrictEquals({
							name: "visible",
							value: true
						}),
						success: function() {
							ok(true, "The Object Page Table is visible");
						},
						errorMessage: "The Object Page Table is not visible"
					});
				},

				theObjectPageChartIsRendered: function () {
					return this.waitFor({
						id: prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: new PropertyStrictEquals({
							name: "visible",
							value: true
						}),
						success: function() {
							ok(true, "The Object Page Chart is visible");
						},
						errorMessage: "The Object Page Chart is not visible"
					});
				},

				theChevronIsVisibleInSalesRevenueTable: function(bVisible) {
					return this.waitFor({
						id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::analyticalTable",
						viewName: viewName,
						viewNamespace: viewNamespace,

						success: function(oControl) {
							if (bVisible=true)
								{
								assert.ok("action",oControl.mAggregations.rowActionTemplate._aActions["0"],"The Sales Revenue Table contains Row Action Chevron")
								}
							else
								{
								assert.ok("",oControl.mAggregations.rowActionTemplate._aActions["0"],"The Sales Revenue Table doesn't contain Row Action Chevron")
								}
						},
						errorMessage: "Chevron rendering is incorrect"
					});
				},

				theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement: function (bVisible, bEnabled, aButtonText) {
					return this.waitFor({
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oTable) {
							var aToolbarContent = oTable.getCustomToolbar().getContent();
							var bButtonFound, oToolbarButton, sButtonText;

							for (var i = 0; i < aButtonText.length; i++) {
								bButtonFound = false;
								sButtonText = aButtonText[i];
								for (var j = 0; j < aToolbarContent.length; j++) {
									oToolbarButton = aToolbarContent[j];
									if (oToolbarButton.getMetadata().getName() === "sap.m.Button" && oToolbarButton.getText() === sButtonText) {
										bButtonFound = true;
										if (oToolbarButton.getVisible() === bVisible && oToolbarButton.getEnabled() === bEnabled) {
											ok(true, "The toolbar button " +  sButtonText+ " has the correct visibility and enablement");
										} else {
											notOk(true, "The toolbar button " +  sButtonText + " does not have correct visibility and enablement");
										}
										break;
									}
								}

								if (!bButtonFound) {
									notOk(true, "The toolbar button " + sButtonText + " could not be found");
								}
							}
						},
						errorMessage: "The Object Page Table is not rendered correctly"
					});
				},

				theButtonInTheObjectPageChartToolbarHasTheCorrectVisibilityAndEnablement: function (bVisible, bEnabled, aButtonText) {
					return this.waitFor({
						id: prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oChart) {
							var aToolbarContent = oChart.getToolbar().getContent();
							var bButtonFound, oToolbarButton, sButtonText;

							for (var i = 0; i < aButtonText.length; i++) {
								bButtonFound = false;
								sButtonText = aButtonText[i];
								for (var j = 0; j < aToolbarContent.length; j++) {
									oToolbarButton = aToolbarContent[j];
									if (oToolbarButton.getMetadata().getName() === "sap.m.Button" && oToolbarButton.getText() === sButtonText) {
										bButtonFound = true;
										if (oToolbarButton.getVisible() === bVisible && oToolbarButton.getEnabled() === bEnabled) {
											ok(true, "The toolbar button " +  sButtonText+ " has the correct visibility and enablement");
										} else {
											notOk(true, "The toolbar button " +  sButtonText + " does not have correct visibility and enablement");
										}
										break;
									}
								}

								if (!bButtonFound) {
									notOk(true, "The toolbar button " + sButtonText + " could not be found");
								}
							}
						},
						errorMessage: "The Object Page Chart is not rendered correctly"
					});
				},
				/************************************************
				 NAVIGATION ASSERTIONS
				 *************************************************/
				// check if the Object Page context is correct by:
				// i. finding the Oject Page Layout by control type
				// ii. get the binding context and check against the Data Store
				thePageContextShouldBeCorrect: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						matchers: [
							function(oControl) {
								if (oControl && oControl.getBindingContext()) {
									return oControl.getBindingContext().getPath() === OpaDataStore.getData("navContextPath");
								}
							}
						],
						success: function() {
							ok(true, "The Object Page has the correct context");
						},
						errorMessage: "The Object Page does not have the correct context"
					});
				},

				/************************************************
				 CONTACT INFORMATION POPOUP ASSERTIONS
				 *************************************************/
				// check that the contact information is correct given a name by:
				// i. finding the contact information popover using control type
				// ii. find the contact information name inside the popover and match against the name passed
				theContactInformationShouldBeDisplayedFor: function(sName) {
					// if test is running on FF then the click is not fired.
					// needs further investigation
					/* seems to work now
					if (sap.ui.Device.browser.firefox) {
						ok(true, "Firefox detected - TEST 'The Contact Information popup is opened with the correct data for " + sName + "' SKIPPED. Click is not fired on Firefox.");
						return this;
					}
					*/
					return this.waitFor({
						controlType: "sap.m.Popover",
						matchers: [
							function (oPopover) {
								var oPage = oPopover.getContent()[0].getPages()[0];
								var oHeader = oPage.getCustomHeader();
								var sActualTitle = oHeader.getContentMiddle()[0].getText();
								var sActualName = oPage.getContent()[0].getContent()[1].getContent()[0].getText();

								return (sActualTitle === "Contact Information" && sActualName === sName);
							}
						],
						success: function (aControl) {
							ok(true, "The Contact Information popup is opened with the correct data for " + sName);
						},
						errorMessage: "Contact Information Popup is not rendered correctly"
					});
				},

				/************************************************
				 EDIT ASSERTIONS
				*************************************************/
				// check if the Object Page is in Edit mode by:
				// i. finding the Object Page Layout using control type
				// ii. check the Object Page "ui" model's property "editable"
				thePageShouldBeInEditMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers:[
							function(oControl) {
								return (oControl.getModel("ui").getData().editable);
							}],
						success: function() {
							ok(true, "The Object Page is in Edit mode");
						},
						errorMessage: "The Object Page is not rendered"
					});
				},
				// check if a smart field contains a certain value by:
				// i. finding a smart field using id
				// ii. check the contents of the smart field against the value passed
				theFieldIntheFieldGroupHasValue: function(sFieldName, sFieldGroup, sValue) {
					// control returned is a smartfield
					return this.waitFor({
						id: prefix + "com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field",
						matchers: [
							new PropertyStrictEquals({
								name: "value",
								value: sValue
							})
						],
						success: function() {
							ok(true, "The field " + sFieldName + " should contain the value " + sValue);
						},
						errorMessage: "The field " + sFieldName + " is not rendered correctly"
					});
				},

				/************************************************
				 DRAFT ASSERTIONS
				*************************************************/
				// check the draft status by:
				// i. finding the draft status by id
				// ii. checking the draft status' "state" property against the draft status passed
				theDraftStatusIs: function(sDraftStatus) {
					return this.waitFor({
						id: prefix + "draftStatus",
						matchers: [
							new PropertyStrictEquals({
								name: "state",
								value: sDraftStatus
							})
						],
						success: function() {
							ok(true, "The Draft Status is " + sDraftStatus);
						},
						errorMessage: "The Draft Status is not rendered correctly"
					});
				},
				// check if the draft status is "Saving"
				theDraftStatusIsDraftSaving: function() {
					return this.theDraftStatusIs("Saving");
				},
				// check if the draft status is "Saved"
				theDraftStatusIsDraftSaved: function() {
					return this.theDraftStatusIs("Saved");
				},
				theSearchFieldInTheTableToolbarVisible: function() {
					return this.waitFor({
						controlType: "sap.m.SearchField",
						viewName: viewName,
						viewNamespace: viewNamespace,
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField",
						success: function() {
							ok(true, "The ProductText table's Search Field appears");
						},
						errorMessage: "The ProductText table's Search Field does not appear"
					});
				},
				iShouldSeeTableToolbar: function(){
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(){
							ok(true,"Table toolbar is visible");
						},
						errorMessage: "Table toolbar is not visible"
					});
				},
				iShouldSeeTableHeader: function(){
					return this.waitFor({
						controlType: "sap.m.Column",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(){
							ok(true,"Table header is visible");
						},
						errorMessage: "Table header is not visible"
					});
				},
				iCheckTableForDefaultInlineCreateSort: function(bExpectedValue) {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oSmartTable){
							var bActualValue = false;
							var oTable = oSmartTable.getTable();
							var oTableBindingInfo = oTable.getBindingInfo("items");
							if (oTableBindingInfo.sorter.length > 0 && oTableBindingInfo.sorter[0].sPath === "HasActiveEntity") {
								bActualValue = true;
							} else {
								bActualValue = false;
							}
							equal(bActualValue, bExpectedValue, "Default Inline Create sort is"+ bActualValue + "in the table.")
						},
						errorMessage: "Table is not visible"
					});
				},
				iShouldSeeHeaderContentAfterExtension: function(sExtensionEndId) {
					var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
					var bManifestEntry = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.viewExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/AfterHeaderFacet|STTA_C_MP_Product|headerEditable::com.sap.vocabularies.UI.v1.Identification")!=null;
					ok(true,"The manifest is correctly set for the Header Content After Extension")
						return this.waitFor({
							id:prefix+"header::headerEditable::com.sap.vocabularies.UI.v1.Identification::AfterReferenceExtension",
							success: function(oView){
								ok(true,"The Header Content After Extension is loaded successfully");

							},
							errorMessage: "The Header Content After Extension is not rendered correctly"
						});
				},
				iShouldSeeHeaderContentBeforeExtension: function(sExtensionEndId) {
					var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
					var bManifestEntry = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.viewExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/BeforeHeaderFacet|STTA_C_MP_Product|headerEditable::com.sap.vocabularies.UI.v1.DataPoint::StockLevel")!=null;
					ok(true,"The manifest is correctly set for the Header Content Before Extension")
						return this.waitFor({
							id:prefix+"header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::StockLevel::BeforeReferenceExtension",
							success: function(oView){
								ok(true,"The Header Content Before Extension is loaded successfully");

							},
							errorMessage: "The Header Content Before Extension is not rendered correctly"
						});
				},
				iShouldSeeSubsectionExtension: function(){
					return this.waitFor({
						id:  prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSalesDataTable) {
							var oObjectPageSection, sExpectedTitle = "Target Sales Data";
							oObjectPageSection = oSalesDataTable.getParent().getParent().getParent().getParent().getParent();
							sSubSectionTitle = oObjectPageSection.getSubSections()[1].getTitle();
							assert.equal(sExpectedTitle,sSubSectionTitle,"The " + sExpectedTitle + " sub-section is rendered correctly");
						},
						errorMessage: "The subsection extension target sales data is not rendered correctly."
					});
				},
				thePageShouldContainDynamicHeader: function () {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageDynamicHeaderTitle",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function () {
							ok(true, "The Object Page have dynamic header");
						},
						errorMessage: "The Object Page doesn't have dynamic header"
					});
				},

				theToggleHeaderOnTitleClickPropertyIs: function(bExpected) {
					bActual = false;
					return this.waitFor({
						id: prefix + "objectPage",

						success: function(oObjectPageLayout) {
							bActual = oObjectPageLayout.getProperty("toggleHeaderOnTitleClick");
							Opa5.assert.equal(bExpected,bActual, "The property toggleHeaderOnTitleClickProperty of the Object Page Layout is: "+ bExpected);
						},
						error: function() {
							Opa5.assert.ok(false, "The property toggleHeaderOnTitleClickProperty of the Object Page Layout is incorrect");
						}
					});
				},

				theHeaderImageShouldBeAvatar: function () {
					return this.waitFor({
						id: prefix + "objectImage",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oControl) {
							equal(oControl.getDisplayShape(),"Square", "The Header image is Avatar");
						},
						errorMessage: "The Header image is not Avatar"
					});
				},
				theObjectMarkerIsInContentAggregation: function () {
					return this.waitFor({
						id: prefix + "template::ObjectPage::ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oControl) {
							var aContent = oControl.getAggregation("content");
							equal(oControl.getAggregation("content")[0].getContent()[0].getId(), prefix + "template::ObjectPage::ObjectMarkerObjectPageDynamicHeaderTitle", "The object marker is in content aggregation");
						},
						errorMessage: "The object marker is not in content aggregation"
					});
				},
				theLayoutActionsShouldBeSeparatedFromGlobalActions: function () {
					return this.waitFor({
						id: prefix + "template::ObjectPage::ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oControl) {
							equal(oControl.getNavigationActions()[0].getId(), prefix + "template::UpAndDownNavigation", "Paginator buttons are on right place.");
							equal(oControl.getNavigationActions()[1].getId(), prefix + "template::FCLActionButtons", "FCL actions are on right place.");
						},
						errorMessage: "Layout actions are not separated from Global Actions"
					});
				},
				iShouldSeeTheSideContentLoadedSuccessfully: function(bExpectedValue) {
					return this.waitFor({
						controlType: "sap.ui.layout.DynamicSideContent",
						success: function (oSideContent) {
							var bActualVisibility = oSideContent[0].getProperty("showSideContent");
							assert.equal(bExpectedValue,bActualVisibility,"The Dynamic Side Content is visible/hidden as expected");
						},
						errorMessage: "The Dynamic Side Content visibility could not be validated"
					});
				},
				// check if the Header Facet "Communication Address" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetCommunicationAddressIsRendered: function () {
					var sFacetName = "Communication Address";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*to_Supplier::to_Address)" + "(.*com.sap.vocabularies.Communication.v1.Address)" + "(.*ContactAddress)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							equal(aControl.length, 1, "Communication Address - Only 1 'sap.m.VBox' control is found");
							var aItems = aControl[0].getItems();
							equals(aItems.length, 2, "Communication Address - There should be 2 items in the VBox");
							// Label
							equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Address") + ":", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							equal(aItems[1].getMetadata().getName(), "sap.m.Text", sFacetName + " - " + "The text field is rendered");
						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},

				// Check if button (that opens message popover) in overflow toolbar is visible and shows expected count
				iCheckMessageCountForMessagePopover: function(count) {
					return this.waitFor({
						id: prefix + "showMessages",
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: String(count)
							}),
							new PropertyStrictEquals({
								name: "visible",
								value: true
							})
						],
						success: function (oControl) {
							ok(true, "Found control with count " + count + "and is visible");
						},
						errorMessage: "Couldn't find control with count " + count
					});
				}
			}
		};
	}
);
