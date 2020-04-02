/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides this._validatecontrol sap.rules.ui.
sap.ui.define(["sap/ui/thirdparty/jquery",
		"./library",
		"sap/m/Label",
		"sap/rules/ui/RuleBase",
		"sap/m/Panel",
		"sap/ui/core/Title",
		"sap/ui/layout/form/Form",
		"sap/m/Toolbar",
		"sap/m/ToolbarSpacer",
		"sap/m/Text",
		"sap/m/Button",
		"sap/ui/layout/Grid",
		"sap/ui/layout/form/FormContainer",
		"sap/ui/layout/form/FormElement",
		"sap/rules/ui/ExpressionAdvanced",
		"sap/m/Link",
		"sap/m/FlexBox",
		"sap/m/Dialog",
		"sap/rules/ui/TextRuleSettings",
		"sap/rules/ui/oldast/lib/AstYamlConverter",
		"sap/rules/ui/Constants",
		"sap/rules/ui/AstExpressionBasic",
		"sap/rules/ui/services/ExpressionLanguage",
		"sap/rules/ui/services/AstExpressionLanguage"
	], function (jQuery, library, Label, RuleBase, Panel, Title, Form, Toolbar, ToolbarSpacer, Text, Button, Grid, FormContainer, FormElement,
		ExpressionAdvanced, Link, FlexBox, Dialog, TextRuleSettings, AstYamlConverter, Constants, AstExpressionBasic, ExpressionLanguage, AstExpressionLanguage) {
		"use strict";

		/**
		 * Constructor for a new TextRule Control.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Some class description goes here.
		 * @extends  Control
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 *
		 * @constructor
		 * @private
		 * @alias sap.rules.ui.TextRule
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) design time meta model
		 */

		var TextRule = RuleBase.extend("sap.rules.ui.TextRule", {
			metadata: {
				properties: {
					enableSettings: {
						type: "boolean",
						group: "Misc",
						defaultValue: false
					},
					enableElse: {
						type: "boolean",
						defaultValue: true
					},
					enableElseIf: {
						type: "boolean",
						defaultValue: true
					}
				},
				aggregations: {
					"_toolbar": {
						type: "sap.m.Toolbar",
						multiple: false,
						singularName: "_toolbar"
					},
					"_verticalLayout": {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "visible",
						singularName: "_verticalLayout"
					}
				}
			},

			/*
			 *  Create Odata call for TextRuleBranch or TextRuleDefaultBranch based on type of condition
			 */
			_addConditionBlock: function (oEvent, sType) {
				var that = this;
				var oDataModel = this._getModel();
				var oSource = oEvent.getSource();
				var oPanel = oSource.getParent();
				if (sType === this.typeElseIf && !(oPanel instanceof Panel)) {
					oPanel = oSource.getParent().getParent(); //When Add button is selected it's parent is Toolbar
				}
				var oVerticalLayout = oPanel.getParent();
				var nIndex = oVerticalLayout.indexOfContent(oPanel);
				var sRuleId = this._internalModel.getProperty("/ruleId");
				var sRuleVersion = this._internalModel.getProperty("/ruleVersion");
				var nCurrentSequence = nIndex + 1;
				var bFirst = false;
				var nNewSequence;
				var sKeytext;
				var oTextRuleConditon = {
					RuleId: sRuleId,
					RuleVersion: sRuleVersion
				};
				if (sType === that.typeElse) {
					sKeytext = "/TextRuleDefaultBranches";
					bFirst = true;
				} else {
					sKeytext = "/TextRuleBranches";
					if (oSource.getParent() instanceof Panel) {
						nNewSequence = nCurrentSequence;
						bFirst = true;
					} else {
						nNewSequence = nCurrentSequence + 1;
					}
					oTextRuleConditon.Sequence = nNewSequence;
				}
				this._updateBusyState(true);
				var mParameters = {};
				mParameters.properties = oTextRuleConditon;
				mParameters.success = function (newCondition) {
					var data = {};
					data.verticalLayout = oVerticalLayout;
					data.nIndex = nIndex;
					data.bfirst = bFirst;
					that._addConditionSuccess(newCondition, that, data);
					if (bFirst) {
						oSource.destroy();
					}
				};
				mParameters.error = function () {
					jQuery.sap.log.info("Error creating " + sKeytext + "entity");
				};
				oDataModel.createEntry(sKeytext, mParameters);
			},

			/*
			 *  Reads the index of panel to determine the new condition panel position.
			 *  For Else, Add Else panel is removed and Else Condition is added in its place
			 *  For Else If, if add is pressed from Add Else If button, bFirst is true, and
			 *  Add Else If panel is removed and Else If Condition is added in its place
			 *  Else bFirst is false, and Else IF condition is inserted after the panel from which
			 *  Add is added
			 */
			// eslint-disable-next-line
			_addConditionSuccess: function (newCondition, that, data) {
				var sNumbering;
				var nNewIndex;
				var sConditionId = newCondition.Id;
				var oDataModel = that._getModel();
				var oHeaderKey = {
					RuleId: newCondition.RuleId,
					Id: sConditionId,
					RuleVersion: newCondition.RuleVersion
				};
				var sPath = oDataModel.createKey("/TextRuleConditions", oHeaderKey);
				var oContext = new sap.ui.model.Context(oDataModel, sPath);
			    var expandPath = "TextRuleResultExpressions";
                if (this.getAstExpressionLanguage()) {
                    expandPath = "TextRuleResultExpressions/TextRuleResultExpressionASTs,TextRuleConditionASTs"
                }

				oDataModel.read(sPath, {
					urlParameters: {
						"$expand": expandPath
					},
					success: function (response) {
						var oVerticalLayout = data.verticalLayout;
						that.getModel("displayModel").getProperty("/textRuleConditions").push(response);
						that.getModel("displayModel").setProperty("/bCancelButtonVisible(" + response.Id + ")", response.TextRuleResultExpressions
                                .results.length > 1);
						if (response.Type === that.typeElse) {
							that.getModel("displayModel").getProperty("/textRuleConditions/Else").push(response);
							var oElsePanel = that._createElseFormLayout(oContext, that.oBundle.getText("titleElse"), true);
							oVerticalLayout.removeContent(data.nIndex);
							oVerticalLayout.insertContent(oElsePanel, data.nIndex);
						} else if (response.Type === that.typeElseIf) {
							that.getModel("displayModel").getProperty("/textRuleConditions/ElseIf").push(response);
							if (data.bfirst) {
								nNewIndex = data.nIndex;
								oVerticalLayout.removeContent(data.nIndex);
							} else {
								nNewIndex = data.nIndex + 1;
							}
							sNumbering = " (" + nNewIndex + ")";
							var oElseIfPanel = that._createFormLayout(oContext, that.oBundle.getText("titleElseIf") + sNumbering, true);
							oVerticalLayout.insertContent(oElseIfPanel, nNewIndex);
							that._adjustElseIfTitle(data.verticalLayout, nNewIndex, true);
						}
						that._updateBusyState(false);
					},
					error: function () {
						jQuery.sap.log.info("Error reading TextRuleResultExpressions");
					}
				});

			},

			/*
			 * Adjusts the Else If numbering when a new condition is added or existing condition is deleted.
			 */
			_adjustElseIfTitle: function (oVerticalLayout, nNewIndex, bAdded) {
				var oContents = oVerticalLayout.getContent();
				var sElseIf = this.oBundle.getText("titleElseIf");
				var iterator;
				if (bAdded) {
					iterator = nNewIndex + 1;
				} else {
					iterator = nNewIndex;
				}
				for (; iterator < oContents.length; iterator++) {
				    var oContent = oContents[iterator];
                    if (oContent.getHeaderText().indexOf(sElseIf) > -1 && oContent.getHeaderToolbar()) {
                        oContent.getHeaderToolbar().getContent()[0].setText(sElseIf + " (" + iterator + ")");
                    }
				}
			},

			/*
			 * @private
			 */
			_addToolBar: function () {
				var oToolbar = new Toolbar({
					design: "Transparent",
					enabled: "{TextRuleModel>/editable}"
				});

				var oTitle = new sap.m.Title({
					text: this.oBundle.getText("textRule")
				});

				var oSettingsButton = new Button({
					text: "",
					press: this._openTextRuleSettings.bind(this),
					visible: {
						parts: [{
							path: "TextRuleModel>/enableSettings"
						}, {
							path: "TextRuleModel>/editable"
						}],
						formatter: this._decideSettingsEnablement
					},
					enabled: {
						parts: [{
							path: "TextRuleModel>/enableSettings"
						}, {
							path: "TextRuleModel>/editable"
						}],
						formatter: this._decideSettingsEnablement
					}
				}).setTooltip(this.oBundle.getText("settings"));
				oSettingsButton.setIcon("sap-icon://action-settings");

				oToolbar.addContent(oTitle);
				oToolbar.addContent(new ToolbarSpacer({}));
				oToolbar.addContent(oSettingsButton);
				oToolbar.addContent(new ToolbarSpacer({
					width: "1em"
				}));
				this.setAggregation("_toolbar", oToolbar, true);
			},

			_addTextRuleControl: function () {
				this.verticalLayout = new sap.ui.layout.VerticalLayout({
					width: "100%"
				});
				this.setAggregation("_verticalLayout", this.verticalLayout, true);
			},

			/*
			 * Reads TextRule, Conditions and Results and updates data received status
			 */
			_bindRule: function () {
				var that = this;
				var oModel = this._getModel();
				var sBindingPath = [this._getBindModelName(), this.getBindingContextPath()].join("");
				if (sBindingPath && oModel) {
					oModel.setDeferredGroups(["read"]);
					//Reading text rule
					oModel.read(sBindingPath, {
						groupId: "read",
						urlParameters: {
							"$expand": "TextRule"
						}
					});
					//Reading results
					var headerPath = [sBindingPath, "/TextRule/TextRuleResults"].join("");
					var mParameters = {
						groupId: "read"
					}
					if (this.getAstExpressionLanguage()) {
						mParameters.urlParameters = {
							"$expand": "TextRuleResultASTs"
						};
					}
					oModel.read(headerPath, mParameters);
					//Reading conditions and expressions
					var expandPath = "TextRuleResultExpressions";
				    if (this.getAstExpressionLanguage()) {
					expandPath = "TextRuleResultExpressions/TextRuleResultExpressionASTs,TextRuleConditionASTs"
				    }
					headerPath = [sBindingPath, "/TextRule/TextRuleConditions"].join("");
					oModel.read(headerPath, {
						groupId: "read",
						urlParameters: {
							"$expand": expandPath
						}
					});

					oModel.submitChanges({
						groupId: "read",
						success: function (data) {
							that._handleVerticalLayoutDataReceived(data);
						},
						error: function () {
							jQuery.sap.log.info("Error reading TextRule data from backend");
						}
					});
				}

			},

			/*
			 * Returns panels for If, Else If and Else conditions
			 */
			_bindVerticalLayout: function () {
				//If panel
				var oIfPanel = this._getIfPanel();
				this.verticalLayout.addContent(oIfPanel);
				//ElseIf panels
				if (this.getEnableElseIf() === true) {
					var oElseIfPanel = this._getElseIfPanel();
					for (var i = 0; i < oElseIfPanel.length; i++) {
						this.verticalLayout.addContent(oElseIfPanel[i]);
					}
				}
				//Else Layout
				if (this.getEnableElse() === true) {
					var oElsePanel = this._getElsePanel();
					this.verticalLayout.addContent(oElsePanel[0]);
				}
			},

			/*
			 * Returns panel with If and Then sections for If and ElseIf conditions
			 */
			_createFormLayout: function (oContext, sTitle, bExpanded) {
				var that = this;
				var oPanel = new Panel({
					expandable: true,
					expanded: bExpanded,
					headerText: sTitle,
					height: "100%",
					backgroundDesign: "Translucent",
					content: [new Form({
                        editable: true,
                        layout: new sap.ui.layout.form.ResponsiveGridLayout({
                            labelSpanXL: 2,
                            labelSpanL: 2,
                            labelSpanM: 2,
                            labelSpanS: 12,
                            adjustLabelSpan: false,
                            emptySpanXL: 4,
                            emptySpanL: 4,
                            emptySpanM: 4,
                            emptySpanS: 4,
                            columnsL: 1,
                            columnsM: 1
                        }),
                        formContainers: [
                            // If form container
                            that._createIfBlockFormContainer(oContext, sTitle),
                            // Then form container
                        ]
                    }),new Form({
                        editable: true,
                        layout: new sap.ui.layout.form.ResponsiveGridLayout({
                            labelSpanXL: 2,
                            labelSpanL: 2,
                            labelSpanM: 2,
                            labelSpanS: 12,
                            adjustLabelSpan: false,
                            emptySpanXL: 3,
                            emptySpanL: 3,
                            emptySpanM: 3,
                            emptySpanS: 3,
                            columnsL: 1,
                            columnsM: 1
                        }),
                        formContainers: [
                            // If form container
                            // Then form container
                            that._createThenFormContainer(oContext, this.oBundle.getText("then"))
                        ]
                    })]
				}).addStyleClass("sapTextRulePanel");

				if (sTitle === this.typeIf) {
					oPanel.setHeaderText(sTitle);
				} else {
					var oToolbar = new Toolbar({
						design: "Transparent"
					});

					var oTitle = new sap.m.Title({
						text: sTitle
					});

					var oAddButton = new Button({
						visible: {
							parts: [{
								path: "TextRuleModel>/enableSettings"
							}, {
								path: "TextRuleModel>/editable"
							}],
							formatter: this._decideSettingsEnablement
						},
						text: this.oBundle.getText("addButton"),
						tooltip: this.oBundle.getText("addNewElseIf"),
						press: function (oEvent) {
							that._addConditionBlock(oEvent, that.typeElseIf);
						}
					}).setBindingContext(oContext);

					var oDeleteButton = new Button({
						text: this.oBundle.getText("deleteButton"),
						tooltip: this.oBundle.getText("deleteElseIf"),
						visible: {
							parts: [{
								path: "TextRuleModel>/enableSettings"
							}, {
								path: "TextRuleModel>/editable"
							}],
							formatter: this._decideSettingsEnablement
						},
						press: function (oEvent) {
							that._deleteConditionBlock(oEvent);
						}
					}).setBindingContext(oContext);

					oToolbar.addContent(oTitle);
					oToolbar.addContent(new ToolbarSpacer());
					oToolbar.addContent(oAddButton);
					oToolbar.addContent(new ToolbarSpacer({
						width: "0.5px"
					}));
					oToolbar.addContent(oDeleteButton);
					oPanel.setHeaderToolbar(oToolbar);
				}

				return oPanel;
			},

			/*
			 * Returns panel with Then section for Else condition
			 */
			_createElseFormLayout: function (oContext, sTitle, bExpanded) {
				var that = this;
				var oToolbar = new Toolbar({
					design: "Transparent"
				});

				var oTitle = new sap.m.Title({
					text: sTitle
				});

				var oDeleteButton = new Button({
					text: this.oBundle.getText("deleteButton"),
					tooltip: this.oBundle.getText("deleteElse"),
					visible: {
						parts: [{
							path: "TextRuleModel>/enableSettings"
						}, {
							path: "TextRuleModel>/editable"
						}],
						formatter: this._decideSettingsEnablement
					},
					press: function (oEvent) {
						that._deleteConditionBlock(oEvent);
					}
				}).setBindingContext(oContext);

				oToolbar.addContent(oTitle);
				oToolbar.addContent(new ToolbarSpacer());
				oToolbar.addContent(oDeleteButton);

				var oPanel = new Panel({
					expandable: true,
					expanded: bExpanded,
					height: "100%",
					backgroundDesign: "Translucent",
					content: new Form({
						editable: true,
						layout: new sap.ui.layout.form.ResponsiveGridLayout({
							labelSpanXL: 2,
							labelSpanL: 2,
							labelSpanM: 2,
							labelSpanS: 12,
							adjustLabelSpan: false,
							emptySpanXL: 3,
							emptySpanL: 3,
							emptySpanM: 3,
							emptySpanS: 3,
							columnsL: 1,
							columnsM: 1
						}),
						formContainers: [
							this._createThenFormContainer(oContext, sTitle)
						]
					})
				}).addStyleClass("sapTextRulePanel");

				oPanel.setHeaderToolbar(oToolbar);

				return oPanel;
			},

			/*
			 * Returns If form container
			 */
			_createIfBlockFormContainer: function (oContext, sTitle) {
				var expression = oContext ? oContext.getProperty("Expression") : "";
				var bConditionContext = true;
				var formContainer = new FormContainer({
					//title: title,
					formElements: [
						new FormElement({
							label: new Label({
								text: ""
							}), // Empty label is needed
							fields: [this._getExpressionAdvancedText(oContext, expression, undefined, undefined, bConditionContext)]
								//layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
						})
					]
				});
				return formContainer;
			},

			/*
			 * Returns Then form container
			 */
			_createThenFormContainer: function (oContext, sTitle) {
				var formContainer = new FormContainer({
					visible: false
				});

				if (oContext.getProperty("Type") !== this.typeElse) {
					var oToolbar = new Toolbar({
						content: [new ToolbarSpacer({
							width: "2em"
						}), new Label({
							text: sTitle
						}).addStyleClass("sapTextRuleFontSize")]
					});
					formContainer.setToolbar(oToolbar);
				}

				var sConditionId = oContext.getProperty("Id");
				var oTextRuleConditions = this.getModel("displayModel").getProperty("/textRuleConditions");
				for (var i = 0; i < oTextRuleConditions.length; i++) {
					if (sConditionId === oTextRuleConditions[i].Id) {
						var oResultExpressions = oTextRuleConditions[i].TextRuleResultExpressions.results;
						if (oResultExpressions) {
							for (var j = 0; j < oResultExpressions.length; j++) {
								var oHeaderKey = {
									RuleId: oResultExpressions[j].RuleId,
									ConditionId: oResultExpressions[j].ConditionId,
									ResultId: oResultExpressions[j].ResultId,
									RuleVersion: oResultExpressions[j].RuleVersion
								};
								var sPath = this._getModel().createKey("/TextRuleResultExpressions", oHeaderKey);
								var oExpressionContext = new sap.ui.model.Context(this._getModel(), sPath);
								var type = oResultExpressions[j].BusinessDataType;
								if (this.getExpressionLanguage()) {
									if (type === Constants.DATE_BUSINESS_TYPE || type === Constants.TIMESTAMP_BUSINESS_TYPE || type === Constants.NUMBER || type ===
										Constants.STRING || type === Constants.BOOLEAN_BUSINESS_TYPE || type === Constants.BOOLEAN_ENHANCED_BUSINESS_TYPE) {
										formContainer.addFormElement(this._formElementsFactory(sTitle + "result" + j, oExpressionContext));
								    }
								} else {
									formContainer.addFormElement(this._formElementsFactory(sTitle + "result" + j, oExpressionContext));
								}
                                
								
							}
						}
					}
				}

				var oFormElements = formContainer.getFormElements();
				for (var element in oFormElements) {
					if (oFormElements[element].getVisible()) {
						formContainer.setVisible(true);
						break;
					}
				}

				return formContainer;
			},

			/*
			 * Returns TextRuleSettings control with model set
			 */
			_createTextRuleSettings: function () {
				var oModel = this._getModel();
				var oContext = this.getBindingContext();
				var oTextRuleSettings = new TextRuleSettings({
					newTextRule: this._internalModel.getProperty("/newTextRule")
				});
				if (this.getAstExpressionLanguage()) {
					oTextRuleSettings.setAstExpressionLanguage(this.getAstExpressionLanguage());
				} else {
					oTextRuleSettings.setExpressionLanguage(this.getExpressionLanguage());
				}
				//Create a copy of the setting model.
				var settingModelDataStr = JSON.stringify(this._settingsModel.getData());
				var settingModelData = JSON.parse(settingModelDataStr);
				var settingModel = new sap.ui.model.json.JSONModel(settingModelData);
				oTextRuleSettings.setModel(settingModel);

				//Set configuration model
				oTextRuleSettings.setModel(this._internalModel, "TextRuleModel");

				//Set OdataModel + context  (needed for apply button)
				oTextRuleSettings.setModel(oModel, "oDataModel");
				oTextRuleSettings.setBindingContext(oContext, "dummy");

				return oTextRuleSettings;
			},

			_decideSettingsEnablement: function (enableSettings, editable) {
				return enableSettings && editable;
			},

			/*
			 * Handles delete for Else and Else If condition
			 * Deletes based on Binding path
			 * Vertical layout content deleted based on its index
			 */
			_deleteConditionBlock: function (oEvent) {
				var that = this;
				var oDataModel = this._getModel();
				var oSource = oEvent.getSource();
				var oPanel = oSource.getParent().getParent();
				var oVerticalLayout = oPanel.getParent();
				var nIndex = oVerticalLayout.indexOfContent(oPanel);
				var oBindingContext = oSource.getBindingContext();
				var sConditionId = oBindingContext.getProperty("Id");
				var sType = oBindingContext.getProperty("Type");
				var sKeyText;
				if (sType === that.typeElse) {
					sKeyText = "/TextRuleDefaultBranches";
				} else if (sType === that.typeElseIf) {
					sKeyText = "/TextRuleBranches";
				}

				var oHeaderKey = {
					RuleId: oBindingContext.getProperty("RuleId"),
					Id: sConditionId,
					RuleVersion: oBindingContext.getProperty("RuleVersion")
				};
				var sPath = oDataModel.createKey(sKeyText, oHeaderKey);

				var _deleteSuccess = function () {
					var oPanel;
					oVerticalLayout.removeContent(nIndex);
					if (sType === that.typeElse) {
						that.getModel("displayModel").setProperty("/textRuleConditions/Else", []);
						oPanel = that._getElsePanel();
						oVerticalLayout.insertContent(oPanel[0], nIndex);
					} else { /* eslint-disable */
						if (nIndex === 1 && oVerticalLayout.getContent().length <= 2) {
							that.getModel("displayModel").setProperty("/textRuleConditions/ElseIf", []);
							oPanel = that._getElseIfPanel();
							oVerticalLayout.insertContent(oPanel[0], nIndex);
						} else {
							var oElseIf = that.getModel("displayModel").getProperty("/textRuleConditions/ElseIf");
							for (var condition in oElseIf) {
								if (oElseIf[condition].Id === sConditionId) {
									oElseIf.splice(condition, 1);
									that.getModel("displayModel").setProperty("/textRuleConditions/ElseIf", oElseIf);
									break;
								}
							}
						}
						that._adjustElseIfTitle(oVerticalLayout, nIndex, false);
					} /* eslint-enable */
					that._updateBusyState(false);
				};

				this._updateBusyState(true);
				oDataModel.remove(sPath, {
					success: function (data) {
						_deleteSuccess();
					},
					error: function () {
						jQuery.sap.log.info("Error deleting " + sKeyText + "entity");
					}
				});
			},

			// Add Decision table specific data for converting the data to code to display and viceVersa.
			_formRuleData: function (oContext, expression) {
				var bindingContext = this.getBindingContextPath();
				var rulePath = bindingContext.split("/")[2];
				var oRuleId = oContext.getProperty("RuleId");
				var oVersion = oContext.getProperty("Version");

				var oRuleData = jQuery.extend({}, this.getModel().oData);

				oRuleData = oRuleData[rulePath];

				if (!oRuleData) {
					oRuleData = {};
				}
				// Add dummy tags
				if (!oRuleData.DecisionTable) {
					oRuleData.DecisionTable = {};
				}
				oRuleData.Type = "DT";

				oRuleData.DecisionTable.metadata = {};
				// HardCoding values to DT because rule body validator and tags expects these tags
				oRuleData.DecisionTable.RuleID = oRuleId;
				oRuleData.DecisionTable.version = oVersion;
				oRuleData.DecisionTable.HitPolicy = "FM";

				// Add dummy tags
				oRuleData.DecisionTable.DecisionTableColumns = {};
				oRuleData.DecisionTable.DecisionTableColumns.results = [];
				oRuleData.DecisionTable.DecisionTableColumns.results.push({
					"metadata": {},
					"RuleId": oRuleId,
					"Id": 1,
					"Version": oVersion,
					"Sequence": 1,
					"Type": "CONDITION",
					"Condition": {
						"metadata": {},
						"RuleId": oRuleId,
						"Id": 1,
						"Version": oVersion,
						"Expression": expression,
						"Description": null,
						"ValueOnly": false,
						"FixedOperator": null
					},
					"Result": null
				});

				oRuleData.DecisionTable.DecisionTableRows = {};
				oRuleData.DecisionTable.DecisionTableRows.results = [];

				oRuleData.DecisionTable.DecisionTableColumnsCondition = {};
				oRuleData.DecisionTable.DecisionTableColumnsCondition.results = [];

				oRuleData.DecisionTable.DecisionTableColumnsResult = {};
				oRuleData.DecisionTable.DecisionTableColumnsResult.results = [];

				return oRuleData;
			},
			
			_addTextRuleResultExpression: function (oEvent) {
                var that = this;
                var oDataModel = this._getModel();
                var oSource = oEvent.getSource();
                var oFieldElement = oSource.getParent();
                var oElement = oFieldElement.getParent();
                var nIndex = oElement.getParent().indexOfFormElement(oElement) + 1;
                var sRuleId = this._internalModel.getProperty("/ruleId");
                var sRuleVersion = this._internalModel.getProperty("/ruleVersion");
                var nCurrentSequence = nIndex + 1;
                var sConditionId = null;
                if (oEvent && oEvent.oSource && oEvent.oSource.getBindingContext() && oEvent.oSource.getBindingContext().getModel() && oEvent.oSource
                    .getBindingContext().getPath() && oEvent.oSource.getBindingContext().getModel().getProperty(oEvent.oSource.getBindingContext().getPath())
                ) {
                    sConditionId = oEvent.oSource.getBindingContext().getModel().getProperty(oEvent.oSource.getBindingContext().getPath()).ConditionId;
                }
                var sKeytext = "/TextRuleResultExpressions";
                //  oElement.getParent().insertFormElement(that._formElementsFactory("hello" + "result" + 1, oEvent.oSource.getBindingContext()),0);
                var oTextRuleResultExpression = {
                    RuleId: sRuleId,
                    RuleVersion: sRuleVersion,
                    ConditionId: sConditionId,
                    Sequence: nCurrentSequence,
                };
                //  this._updateBusyState(true);
                var mParameters = {};
                mParameters.properties = oTextRuleResultExpression;
                mParameters.success = function (newTextRuleExpression) {
                    var oHeaderKey = {
                        RuleId: newTextRuleExpression.RuleId,
                        ConditionId: newTextRuleExpression.ConditionId,
                        ResultId: newTextRuleExpression.ResultId,
                        RuleVersion: newTextRuleExpression.RuleVersion
                    };
 
                    var sPath = that._getModel().createKey("/TextRuleResultExpressions", oHeaderKey);
                    var oExpressionContext = new sap.ui.model.Context(that._getModel(), sPath);
                    var oTextRuleConditions = that.getModel("displayModel").getProperty("/textRuleConditions");
                    for (var i = 0; i < oTextRuleConditions.length; i++) {
                        if (sConditionId === oTextRuleConditions[i].Id && oTextRuleConditions[i].TextRuleResultExpressions) {
                            var oResultExpressions = oTextRuleConditions[i].TextRuleResultExpressions.results;
                            if (oResultExpressions && oExpressionContext) {
                                oResultExpressions.push(oExpressionContext.getModel().getProperty(oExpressionContext.getPath()));
                                that.getModel("displayModel").setProperty("/bCancelButtonVisible(" + sConditionId + ")", oResultExpressions.length > 1);
                            }
 
 
                            oElement.getParent().insertFormElement(that._formElementsFactory(that.oBundle.getText("then") + "result" + nIndex,
                                oExpressionContext), nIndex);
                            break;
                        }
                    }
                };
                mParameters.error = function () {
                    jQuery.sap.log.info(that.oBundle.getText("errorCreating") + sKeytext + that.oBundle.getText("entity"));
                };
                oDataModel.createEntry(sKeytext, mParameters);
            },
 
            _deleteTextRuleResultExpression: function (oEvent) {
                var that = this;
                var oDataModel = this._getModel();
                var oSource = oEvent.getSource();
                var oFieldElement = oSource.getParent();
                var oElement = oFieldElement.getParent();
                var nIndex = oElement.getParent().indexOfFormElement(oElement);
                var sRuleId = this._internalModel.getProperty("/ruleId");
                var sRuleVersion = this._internalModel.getProperty("/ruleVersion");
                var oBindingContext = oSource.getBindingContext();
                var sConditionId = oBindingContext.getProperty("ConditionId");
                var sResultId = oBindingContext.getProperty("ResultId");
                var sKeyText = "/TextRuleResultExpressions";
 
                var oTextRuleResultExpression = {
                    RuleId: sRuleId,
                    RuleVersion: sRuleVersion,
                    ConditionId: sConditionId,
                    ResultId: sResultId,
                };
                var sPath = oDataModel.createKey(sKeyText, oTextRuleResultExpression);
 
                oDataModel.remove(sPath, {
                    success: function (data) {
 
                        var oTextRuleConditions = that.getModel("displayModel").getProperty("/textRuleConditions");
                        for (var i = 0; i < oTextRuleConditions.length; i++) {
                            if (sConditionId === oTextRuleConditions[i].Id && oTextRuleConditions[i].TextRuleResultExpressions) {
                                var oResultExpressions = oTextRuleConditions[i].TextRuleResultExpressions.results;
                                if (oResultExpressions) {
                                    for (var exp in oResultExpressions) {
                                        if (oResultExpressions[exp].ResultId === sResultId) {
                                            oResultExpressions.splice(exp, 1);
                                        }
                                    }
                                }
 
                                that.getModel("displayModel").setProperty("/bCancelButtonVisible(" + sConditionId + ")", oResultExpressions.length > 1);
                                oElement.getParent().removeFormElement(nIndex);
                                break;
                            }
                        }
                    },
                    error: function () {
                        jQuery.sap.log.info(that.oBundle.getText("errorDeleting") + sKeytext + that.oBundle.getText("entity"));
                    }
                });
 
            },
 
            _decideCancelButtonEnablement: function (bEnable,bOperationsContext,expressionLanguageVersion) {
                return bEnable && !bOperationsContext && expressionLanguageVersion === "2.0" ? true : false;
            },
 

			/*
			 * Returns form elements with Expression fields for Then form container
			 */
			_formElementsFactory: function (sId, oContext) {
			    var that = this;
				var resultId = oContext.getProperty("ResultId"),
					ruleId = oContext.getProperty("RuleId"),
					version = oContext.getProperty("RuleVersion"),
					sConditionId = oContext.getProperty("ConditionId"),
					bVisible = true;

				var oHeaderKey = {
					RuleId: ruleId,
					Id: resultId,
					RuleVersion: version
				};
				
				if(this.getAstExpressionLanguage()){
                    this._internalModel.setProperty("/expressionLanguageVersion","2.0");
                } else {
                    this._internalModel.setProperty("/expressionLanguageVersion","1.0");
                }

				var expression = oContext.getProperty("Expression");

				var headerPath = oContext.getModel().createKey("/TextRuleResults", oHeaderKey);
				this._internalModel.getProperty("/textRuleResultExpressions").push(oContext.getModel().getProperty(oContext.getPath()));

				var businessDataType = oContext.getModel().getProperty(headerPath + "/BusinessDataType");
				var sDataObjectAttributeName = oContext.getModel().getProperty(headerPath + "/DataObjectAttributeName");
				var sDataObjectAttributeLabel = oContext.getModel().getProperty(headerPath + "/DataObjectAttributeLabel");
				var displayText = sDataObjectAttributeLabel ? sDataObjectAttributeLabel : sDataObjectAttributeName;
				var sAccessMode = oContext.getModel().getProperty(headerPath + "/AccessMode");
				var sAttributeId = oContext.getModel().getProperty(headerPath + "/DataObjectAttributeId");

				if (sAccessMode === Constants.EDITABLE) {
					bVisible = true;
				} else if (sAccessMode === Constants.HIDDEN) {
					bVisible = false;
				}

                var oExpressionControl = this._getExpressionAdvancedText(oContext, expression, businessDataType, sAttributeId, false);
                var sControlId = oExpressionControl.getId();

				var formElement = new FormElement({
					visible: bVisible,
					label: new Label({
						text: displayText,
						tooltip: displayText,
                        labelFor: sControlId
					}),
					//layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})
					fields: [oExpressionControl, new sap.ui.layout.HorizontalLayout({
                        layoutData: new sap.ui.layout.GridData({
                            span: "L1 M1 S1"
                        }),
                        content: [
                            new sap.m.Button({
                                enabled: "{TextRuleModel>/editable}",
                                type: sap.m.ButtonType.Transparent,
                                icon: sap.ui.core.IconPool.getIconURI("sys-cancel"),
                                visible:{ parts: [{
                                    path: "displayModel>/bCancelButtonVisible(" + sConditionId + ")"
                                }, {
                                    path: "TextRuleModel>/resultDataObjectId"
                                }, {
                                    path: "TextRuleModel>/expressionLanguageVersion"
                                }],
                                formatter: this._decideCancelButtonEnablement
                                },
                                press: function (oEvent) {
                                    that._deleteTextRuleResultExpression(oEvent);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("removeColumn")),
                            new sap.m.Button({
                                enabled: "{TextRuleModel>/editable}",
                                type: sap.m.ButtonType.Transparent,
                                icon: sap.ui.core.IconPool.getIconURI("add"),
                                visible: that.bOperationsContext,
                                press: function (oEvent) {
                                    //Add coulmn from JSON model
                                    that._addTextRuleResultExpression(oEvent);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("addColumn"))
                        ]
                    })]
                        //layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
                }).setBindingContext(oContext);
				return formElement;
			},

			_getBindModelName: function () {
				var path = "";
				var modelName = this.getModelName();
				if (modelName) {
					path = modelName + ">";
				}
				return path;
			},

			_getBlankContent: function () {
				var oLabelContent = new Label({
					text: this.oBundle.getText("startTextRule")
				});
				var oSpaceTextContent = new Text();

				oSpaceTextContent.setText("\u00a0");

				var oLinkToSettingsFromBlank = new Link({
					enabled: {
						parts: [{
							path: "TextRuleModel>/enableSettings"
						}, {
							path: "TextRuleModel>/editable"
						}],
						formatter: this._decideSettingsEnablement
					},
					text: " " + this.oBundle.getText("settings"),
					press: [this._openTextRuleSettings, this]
				}).addStyleClass("sapTextRuleLink");

				var oFlexBox = new FlexBox({
					justifyContent: "Center",
					items: [oLabelContent, oSpaceTextContent, oLinkToSettingsFromBlank],
					visible: {
						parts: [{
							path: "TextRuleModel>/enableSettings"
						}, {
							path: "TextRuleModel>/editable"
						}],
						formatter: this._decideSettingsEnablement
					}
				}).addStyleClass("sapUiMediumMargin");
				return oFlexBox;
			},

			//TODO : Remove after Ast Implementation
			_getConvertedExpression: function (expression, isCodeText, oContext) {
				var oExpressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
				var oRuleData = this._formRuleData(oContext, expression);
				var oResult;
				if (isCodeText) {
					// Convert to code Text
					oResult = oExpressionLanguage.convertRuleToCodeValues(oRuleData);
				} else {
					// Convert to display Text
					oResult = oExpressionLanguage.convertRuleToDisplayValues(oRuleData);
				}

				oRuleData.Type = "TextRule";
				return oResult;
			},

			_getDataLoadedPromise: function () {
				if (!this._dataLoaded) {
					this._setDataLoadedPromise();
				}
				return this._dataLoaded.promise();
			},

			_getElseButton: function () {
				var that = this;
				this.oElseButton = new sap.m.Button({
					id: "_elseButton",
					text: this.oBundle.getText("addElse"),
					tooltip: this.oBundle.getText("addElse"),
					enabled: "{TextRuleModel>/editable}",
					press: function (oEvent) {
						that._addConditionBlock(oEvent, that.typeElse);
					}
				});

				return this.oElseButton;
			},

			_getElseIfButton: function () {
				var that = this;
				this.oElseIfButton = new sap.m.Button({
					id: "_elseIfButton",
					text: this.oBundle.getText("addElseIf"),
					tooltip: this.oBundle.getText("addElseIf"),
					enabled: "{TextRuleModel>/editable}",
					press: function (oEvent) {
						that._addConditionBlock(oEvent, that.typeElseIf);
					}
				});

				return this.oElseIfButton;
			},

			/*
			 * Returns array of Else If panels, if Else If conditions exist.
			 * Else returns a panel with "add Else If" button
			 */
			_getElseIfPanel: function () {
				var sTitle = this.oBundle.getText("titleElseIf");
				var oControls = [];
				var oElseIfData = this._displayModel.getProperty("/textRuleConditions/ElseIf");
				if (oElseIfData.length > 0) {
					for (var i = 0; i < oElseIfData.length; i++) {
						var oHeaderKey = {
							RuleId: oElseIfData[i].RuleId,
							Id: oElseIfData[i].Id,
							RuleVersion: oElseIfData[i].RuleVersion
						};
						var sPath = this._getModel().createKey("/TextRuleConditions", oHeaderKey);
						var oContext = new sap.ui.model.Context(this._getModel(), sPath);
						var nElseIfIndex = i + 1;
						var sNumbering = " (" + nElseIfIndex + ")";
						oControls.push(this._createFormLayout(oContext, sTitle + sNumbering, false));
					}
				} else {
					var oPanel = new Panel({
						headerText: sTitle,
						visible: {
							parts: [{
								path: "TextRuleModel>/enableSettings"
							}, {
								path: "TextRuleModel>/editable"
							}],
							formatter: this._decideSettingsEnablement
						},
						content: this._getElseIfButton()
					});
					oControls.push(oPanel);
				}

				return oControls;
			},

			/*
			 * Returns Else panel, if Else condition exist.
			 * Else returns a panel with "add Else" button
			 */
			_getElsePanel: function () {
				var sTitle = this.oBundle.getText("titleElse");
				var oControls = [];
				var oElseData = this._displayModel.getProperty("/textRuleConditions/Else");
				if (oElseData.length > 0) {
					var oHeaderKey = {
						RuleId: oElseData[0].RuleId,
						Id: oElseData[0].Id,
						RuleVersion: oElseData[0].RuleVersion
					};
					var sPath = this._getModel().createKey("/TextRuleConditions", oHeaderKey);
					var oContext = new sap.ui.model.Context(this._getModel(), sPath);

					oControls.push(this._createElseFormLayout(oContext, sTitle), false);
				} else {
					var oPanel = new Panel({
						headerText: sTitle,
						visible: {
							parts: [{
								path: "TextRuleModel>/enableSettings"
							}, {
								path: "TextRuleModel>/editable"
							}],
							formatter: this._decideSettingsEnablement
						},
						content: this._getElseButton()
					});
					oControls.push(oPanel);
				}

				return oControls;
			},

			/*
			 * Returns ExpressionAdvanced control
			 */
			_getExpressionAdvancedText: function (oContext, expression, businessDataType, attributeId, bConditionContext) {
				var that = this;
				var oExpressionLanguage = null;
				var attributeInfo = "";
				var sType = businessDataType ? businessDataType : sap.rules.ui.ExpressionType.BooleanEnhanced;
                this.valueState = "None";
                this.bOperationsContext = false;
				if (this.getAstExpressionLanguage()) {
					oExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
					var displayExpression = this._getExpressionFromAstNodes(oContext);
					if(displayExpression && displayExpression.relString){
					    displayExpression.relString = displayExpression.relString.replace(/\\/g,"\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
					}
					var rulePath = this._internalModel.getProperty("/ruleBindingPath").split("/")[2];
                    var resultDataObjectId = oContext.getObject("/" + rulePath).ResultDataObjectId;
                    this._internalModel.setProperty("/resultDataObjectId",resultDataObjectId);
					if (attributeId) {
                        attributeInfo = "/" + resultDataObjectId + "/" + attributeId;
					}
					if (resultDataObjectId) {
						resultDataObjectId = resultDataObjectId;
					}
					if (!resultDataObjectId  && !bConditionContext) {
            			this.bOperationsContext = true;
                    }
					return new AstExpressionBasic({
						astExpressionLanguage: oExpressionLanguage,
						value: displayExpression.relString,
						jsonData: displayExpression.JSON,
						attributeInfo: attributeInfo,
						resultDataObjectId: resultDataObjectId,
						conditionContext: bConditionContext,
						operationsContext: this.bOperationsContext,
						editable: "{TextRuleModel>/editable}",
						placeholder: this.oBundle.getText("expressionPlaceHolder"),
						valueState: this.valueState,
						change: function (oEvent) {
                            var oSource = oEvent.getSource();
							var oEventBus = sap.ui.getCore().getEventBus();
							oContext = oSource.getBindingContext();
							var sPath = oContext.getPath();
							var astNodes = oEvent.getParameter("astNodes");
							if (astNodes && astNodes[0].Type === "I" && astNodes[0].Value != "" && astNodes[0].Value != undefined) {
								oEvent.oSource.setValueState("Error");
							} else {
								oEvent.oSource.setValueState("None");
							}
							oEventBus.publish("sap.ui.rules", "astCreating");
							var oModel = oContext.getModel();
							if (!oModel.hasPendingChanges()) {
								that._removeAndUpdateExisitingNodes(sPath, oContext, astNodes, expression, oModel);
							}

                        }.bind(this)
					}).setBindingContext(oContext);
				} else if (this.getExpressionLanguage()) {
					oExpressionLanguage = sap.ui.getCore().byId(this.getExpressionLanguage());
					//TODO: Rebase to this change once vocabulary fixed from ui BUG FIX: 1880107212
					var oResult = that._getConvertedExpression(expression, false, oContext);
					var displayExpression = that._getExpressionFromParseResults(expression, oResult);
					displayExpression = displayExpression ? displayExpression : expression;

					return new ExpressionAdvanced({
						expressionLanguage: oExpressionLanguage,
						placeholder: this.oBundle.getText("expressionPlaceHolder"),
						validateOnLoad: true,
						type: sType,
						value: displayExpression,
						attributeInfo: attributeId,
						editable: "{TextRuleModel>/editable}",
						change: function (oEvent) {
							var oSource = oEvent.getSource();
							oContext = oSource.getBindingContext();
							var sPath = oContext.getPath();
							//TODO: Rebase to this change once vocabulary fixed from ui BUG FIX: 1880107212
							oResult = that._getConvertedExpression(oSource.getValue(), true, oContext);
							// Transform to DT model and use
							var expressionConverted = that._getExpressionFromParseResults(oSource.getValue(), oResult);
							expressionConverted = expressionConverted ? expressionConverted : oSource.getValue();
							that._updateModelExpression(sPath, oContext, expressionConverted);
							var parserResults = oResult.output.decisionTableData.DecisionTable.DecisionTableColumns.results["0"].Condition.parserResults;
							if (parserResults.status !== "Error") {
								that._astUtils.Id = 0;
								var astOutput = parserResults.converted.ASTOutput;
								try {
									var astString = JSON.stringify(that._astUtils.parseConditionStatement(astOutput));
									var aTextRuleConditionModelPropertyList = oContext.oModel.oMetadata.mEntityTypes["/TextRuleConditions"].property;
									var nASTMaxLength = 0;
									if (aTextRuleConditionModelPropertyList) {
										for (var nPropertyPos = 0; nPropertyPos < aTextRuleConditionModelPropertyList.length; nPropertyPos++) {
											if (aTextRuleConditionModelPropertyList[nPropertyPos].name === "AST") {
												nASTMaxLength = aTextRuleConditionModelPropertyList[nPropertyPos].maxLength;
											}
										}
										if (astString && astString.length <= nASTMaxLength) {
											that._updateModelExpressionModelAst(sPath, oContext, astString);
										}
									}

								} catch (e) {
									// Since AST is not being used, we are only logging a message instead of throwing the error
									jQuery.sap.log.error("Exception while converting ast for expression" + oSource.getValue() + " :" + e.message);
								}

							}
						}.bind(this)
					}).setBindingContext(oContext);
				}

			},

			_removeAndUpdateExisitingNodes: function (sPath, oContext, astNodes, expression, oModel) {
				var that = this;
				var oEventBus = sap.ui.getCore().getEventBus();
				oModel.setDeferredGroups(["astGroupId"]);
				oModel.update(oContext.getPath(), {
					"Expression": oContext.getProperty("Expression")
				}, {
					groupId: "astGroupId"
				});
				that._removeExistingAstNodes(sPath, oContext, astNodes, expression, oModel);
				that._updateModelAstNodes(sPath, oContext, astNodes, oModel);
				oModel.submitChanges({
					groupId: "astGroupId",
					success: function (oData) {
						oEventBus.publish("sap.ui.rules", "astCreated");
					}
				});
			},

			_getExpressionFromParseResults: function (expression, oResult) {
				if (oResult && oResult.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults && oResult.output
					.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults.converted) {
					return oResult.output.decisionTableData.DecisionTable.DecisionTableColumns.results[0].Condition.parserResults.converted.Expression;
				} else {
					return expression;
				}
			},

			_getExpressionFromAstNodes: function (oContext) {
				var that = this;
				var oExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
				var displayExpression = "";
				var astList = [];
				var astNodes = [];
				if (that.includes(oContext.sPath,"TextRuleConditions")) {
					astList = oContext.getObject(oContext.sPath).TextRuleConditionASTs;
				} else {
					astList = oContext.getObject(oContext.sPath).TextRuleResultExpressionASTs;
				}
				var oAstUtil = oExpressionLanguage._astBunldeInstance.ASTUtil;
				oAstUtil.clearNodes();
				astList = astList.__list;
				if (astList && astList.length > 0) {
					for (var entry in astList) {
						var path = astList[entry];
						that._addNodeObject(oContext.getObject("/" + path));
					}
					astNodes = oAstUtil.getNodes();
					displayExpression = oAstUtil.toAstExpressionString(astNodes);
							
					if (astNodes && astNodes[0].Type === "I" && astNodes[0].Value != "" && astNodes[0].Value != undefined) {
						this.valueState = "Error"
					} else {
						this.valueState = "None"
					}
				}
				return displayExpression;
			},

			_addNodeObject: function (astNode) {
				var oNodeArray = [];
				var oExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
				var oAstUtil = oExpressionLanguage._astBunldeInstance.ASTUtil;

				var updatedAstNode = [];
				updatedAstNode.Root = astNode.Root;
				updatedAstNode.SequenceNumber = astNode.Sequence;
				updatedAstNode.ParentId = astNode.ParentId;
				updatedAstNode.Reference = astNode.Reference;
				updatedAstNode.Id = astNode.NodeId;
				updatedAstNode.Type = astNode.Type;
				updatedAstNode.Value = astNode.Value ? astNode.Value : "";
				if (astNode.Type === "I") {
                    			updatedAstNode.Value = astNode.IncompleteExpression;
                		}
				if (astNode.Function) {
					updatedAstNode.Function = astNode.Function;
				}

				if (astNode.Type !== "P" && !astNode.Function) {
					var Output = [];
					Output.BusinessDataType = astNode.Output ? astNode.Output.BusinessDataType : astNode.BusinessDataType;
					Output.DataObjectType = astNode.Output ? astNode.Output.DataObjectType : astNode.DataObjectType;
					updatedAstNode.Output = Output;
				}
				oAstUtil.createNode(updatedAstNode);

			},

			/*
			 * Returns If panel
			 */
			_getIfPanel: function () {
				var sTitle = this.oBundle.getText("titleIf");
				var oIfData = this._displayModel.getProperty("/textRuleConditions/If");
				var oHeaderKey = {
					RuleId: oIfData[0].RuleId,
					Id: oIfData[0].Id,
					RuleVersion: oIfData[0].RuleVersion
				};
				var sPath = this._getModel() ? this._getModel().createKey("/TextRuleConditions", oHeaderKey) : "";
				var oContext = new sap.ui.model.Context(this._getModel(), sPath);

				return this._createFormLayout(oContext, sTitle, true);
			},

			_getModel: function () {
				var modelName = this.getModelName();
				if (modelName) {
					return this.getModel(modelName);
				}
				return this.getModel();
			},

			/*
			 * Updates TextRuleCondition Data status as received
			 */
			_handleVerticalLayoutDataReceived: function (response) {
				//The response is read is order Rule, TextRuleResults and TextRuleConditions
				var resultData = response.__batchResponses[1].data;
				if (resultData && resultData.results) {
					this._internalModel.setProperty("/textRuleResults", resultData.results);
				}
				var conditionData = response.__batchResponses[2].data;
				var blankContent;
				if (!conditionData) {
					return;
				}
				var oVerticalLayout = this.getAggregation("_verticalLayout");
				if (conditionData.results && conditionData.results.length === 0) {
					blankContent = this._getBlankContent();
					oVerticalLayout.addContent(blankContent);
					this._internalModel.setProperty("/newTextRule", true);
					this._updateBusyState(false);
				} else {
					//In case TextRuleConditions do not have If condition, settings dialog is loaded
					this._segregateTextRuleData(conditionData.results);
					if (this._displayModel.getProperty("/textRuleConditions/If").length === 0) {
						blankContent = this._getBlankContent();
						oVerticalLayout.addContent(blankContent);
						this._internalModel.setProperty("/newTextRule", true);
						this._updateBusyState(false);
					} else {
						this._bindVerticalLayout();
						this._internalModel.setProperty("/newTextRule", false);
					}
				}
			},

			/*
			 * JSON model to update array of TextRuleConditions, If, ElseIf and Else
			 */
			_initDisplayModel: function () {
				var data = {};
				data.textRuleConditions = [];
				data.textRuleConditions.If = [];
				data.textRuleConditions.ElseIf = [];
				data.textRuleConditions.Else = [];
				this._displayModel = new sap.ui.model.json.JSONModel(data);
				this.setModel(this._displayModel, "displayModel");
			},

			/*
			 * JSON model for properties such as editable, new rule
			 * and Ids of Project and Rule etc
			 */
			_initInternalModel: function () {
				var data = {};
				data.editable = this.getEditable();
				data.newTextRule = true;
				data.enableSettings = true;
				data.projectId = "";
				data.projectVersion = "";
				data.ruleId = "";
				data.ruleVersion = "";
				data.ruleBindingPath = "";
				data.textRuleResults = [];
				data.textRuleResultExpressions = [];
				data.resultDataObjectId = "";
				data.expressionLanguageVersion = "";
				this._internalModel = new sap.ui.model.json.JSONModel(data);
				this.setModel(this._internalModel, "TextRuleModel");
			},

			/*
			 * JSON model for settings
			 */
			_initSettingsModel: function () {
				this._settingsModel = new sap.ui.model.json.JSONModel();
				this.setModel(this._settingsModel, "settingModel");
			},

			/*
			 * Creates and opens a dialog with TextRuleSettings control as content
			 */
			_openTextRuleSettings: function () {
				var textRuleSettings = this._createTextRuleSettings();
				var oDialog = new Dialog({
					contentWidth: "70%",
					contentHeight: "315px",
					title: this.oBundle.getText("textRuleSettings")
				});
				oDialog.addContent(textRuleSettings);
				var aButtons = textRuleSettings.getButtons(oDialog);
				for (var i = 0; i < aButtons.length; i++) {
					oDialog.addButton(aButtons[i]);
				}
				oDialog.attachBeforeClose(function (oData) {
					var dialogState = oDialog.getState();
					if (dialogState === sap.ui.core.ValueState.Success) {
						if (this._internalModel.getProperty("/resultChanged")) {
							var oEventBus = sap.ui.getCore().getEventBus();
							oEventBus.publish("sap.ui.rules", "refreshTextRuleModel");
						}
						this._resetControl();
					}
					oDialog.destroy();
				}, this);
				oDialog.open();
			},

			/*
			 * Resets the models, unbinds and rebinds the TextRule
			 */
			_resetControl: function () {
				this._unbindVerticalLayout();
				this._initInternalModel();
				this._initSettingsModel();
				this._initDisplayModel();
				this._updateBusyState(true);

				var oModel = this._getModel();
				oModel.removeData();
				var bindingContextPath = this.getBindingContextPath();
				/*
				 * onBeforeRendering is called twice. The first time oModel and bindingContextPath is null
				 * return statement gets executed.
				 * Only second time both variables have values and proceeds to bindRule
				 * Hence settigs resetContent to false only if return statement not executed
				 */
				if (!bindingContextPath || !oModel) {
					return;
				}
				this._resetContent = false;
				var sString = bindingContextPath.split("'");
				this._internalModel.setProperty("/projectId", sString[1]);
				this._internalModel.setProperty("/projectVersion", sString[3]);
				this._internalModel.setProperty("/ruleId", sString[5]);
				this._internalModel.setProperty("/ruleVersion", sString[7]);
				this._internalModel.setProperty("/ruleBindingPath", bindingContextPath);

				var oContext = new sap.ui.model.Context(oModel, bindingContextPath);
				this.setBindingContext(oContext);

				this._bindRule();
			},

			/*
			 * Method to segregate TextRuleConditions into If, ElseIf and Else arrays
			 */
			_segregateTextRuleData: function (conditionData) {
				var oConditions = [];
				oConditions.If = [];
				oConditions.ElseIf = [];
				oConditions.Else = [];
				for (var i = 0; i < conditionData.length; i++) {
					oConditions.push(conditionData[i]);
					this.getModel("displayModel").setProperty("/bCancelButtonVisible(" + conditionData[i].Id + ")", conditionData[i].TextRuleResultExpressions
                            .results.length > 1);
					if (conditionData[i].Type === this.typeIf) {
						oConditions.If.push(conditionData[i]);
					} else if (conditionData[i].Type === this.typeElseIf) {
						oConditions.ElseIf.push(conditionData[i]);
					} else if (conditionData[i].Type === this.typeElse) {
						oConditions.Else.push(conditionData[i]);
					}
				}
				this.getModel("displayModel").setProperty("/textRuleConditions", oConditions);
			},
			/*
			 * Updates busy state of Rule based on data received
			 */
			_updateBusyState: function (busy) {
				if (busy) {
					sap.ui.core.BusyIndicator.show(0);
				} else {
					//TO_DO : Remove this after finding better solution to hide the busy indicator
					setTimeout(function () {
						sap.ui.core.BusyIndicator.hide();
					}, 1500);
				}
			},

			_unbindVerticalLayout: function () {
				var oVerticalLayout = this.getAggregation("_verticalLayout");
				if (oVerticalLayout) {
				   oVerticalLayout.destroyContent();
				}
				
			},

			_updateModelExpression: function (sPath, oContext, expressionConverted) {
				oContext.getModel().setProperty(sPath + "/Expression", expressionConverted, oContext, true);
			},

			_updateModelAstNodes: function (sPath, oContext, astNodes, oModel) {
				var sPath = oContext.getPath();
				var ruleInfo = this.getModel().getObject(sPath);
				var ruleId = ruleInfo.RuleId;
				var ruleVersion = ruleInfo.RuleVersion;
				var createPath = "";
				var oRuleData = {};
				if (this.includes(sPath,"TextRuleConditions")) {
					oRuleData.Id = ruleInfo.Id;
					createPath = "/TextRuleConditionASTs";
				} else {
					oRuleData.ConditionId = ruleInfo.ConditionId;
					oRuleData.ResultId = ruleInfo.ResultId;
					createPath = "/TextRuleResultExpressionASTs";
				}
				for (var node in astNodes) {
					var updatedAstNode = {};
					if (astNodes[node].Root) {
						updatedAstNode.Sequence = 1;
						updatedAstNode.Root = true;
					} else {
						updatedAstNode.Sequence = astNodes[node].SequenceNumber;
						updatedAstNode.ParentId = astNodes[node].ParentId;
					}
					if (astNodes[node].Reference) {
						updatedAstNode.Reference = astNodes[node].Reference;
					}
					if (astNodes[node].Function) {
						updatedAstNode.Function = astNodes[node].Function ? astNodes[node].Function : "";
					}
					if (astNodes[node].Type !== "P" && !astNodes[node].Function) {
						updatedAstNode.BusinessDataType = astNodes[node].Output ? astNodes[node].Output.BusinessDataType : astNodes[node].BusinessDataType;
						updatedAstNode.DataObjectType = astNodes[node].Output ? astNodes[node].Output.DataObjectType : astNodes[node].DataObjectType;
						updatedAstNode.Value = astNodes[node].Value ? astNodes[node].Value : "";
					}
					if(astNodes[node].Type === "I") {
                        			updatedAstNode.IncompleteExpression = astNodes[node].Value;
                    			}

					updatedAstNode.NodeId = astNodes[node].Id;
					updatedAstNode.Type = astNodes[node].Type;
					updatedAstNode.RuleId = ruleId;
					updatedAstNode.RuleVersion = ruleVersion;

					for (var key in oRuleData) {
						updatedAstNode[key] = oRuleData[key];
					}
					
					var mParameters = {};
					mParameters.properties = updatedAstNode;
					mParameters.groupId = "astGroupId";
					oModel.createEntry(createPath, mParameters);
				}
			},

			_removeExistingAstNodes: function (sPath, oContext, astNodes, expressionConverted, oModel) {
				var that = this;
				var ruleInfo = this.getModel().getObject(sPath);
				var ruleId = ruleInfo.RuleId;
				var ruleVersion = ruleInfo.RuleVersion;
				var deletePath = "";
				var mParameters = {};
				if (that.includes(sPath,"TextRuleConditions")) {
					deletePath = "/DeleteTextRuleConditionASTDraft";
				}
				if (that.includes(sPath,"TextRuleResult")) {
					deletePath = "/DeleteTextRuleResultASTDraft";
				}
				if (that.includes(sPath,"TextRuleResultExpression")) {
					mParameters.ConditionId = ruleInfo.ConditionId;
					mParameters.ResultId = ruleInfo.ResultId;
					deletePath = "/DeleteTextRuleResultExpressionASTDraft";
				}
				mParameters.Id = ruleInfo.Id;
				mParameters.RuleId = ruleId;
				mParameters.RuleVersion = ruleVersion;

				oModel.callFunction(deletePath, {
					method: "POST",
					groupId: "astGroupId",
					urlParameters: mParameters
				});
			},

			_updateModelExpressionModelAst: function (sPath, oContext, astString) {
				if (oContext.getModel().getProperty(sPath + "/AST")) {
					oContext.getModel().setProperty(sPath + "/AST", astString, oContext, true);
				}
			},

			init: function () {
				this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
				this.typeIf = "If";
				this.typeElseIf = "ElseIf";
				this.typeElse = "Else";
				this._resetContent = true;
				this._initInternalModel();
				this._initDisplayModel();
				this._initSettingsModel();
				this._addToolBar();
				this._addTextRuleControl();
				this._astUtils = AstYamlConverter;
			},

			onAfterRendering: function () {
				var oVerticalLayout = this.getAggregation("_verticalLayout");
				var that = this;
				oVerticalLayout.addEventDelegate({
					"onAfterRendering": function () {
						that._updateBusyState(false);
					}
				}, this);
			},

			onBeforeRendering: function () {
				if (this._resetContent) {
					this._resetControl();
				}
			},

			/** Control's properties getters/setters */

			setEnableSettings: function (value) {
				//value = true;
				this.setProperty("enableSettings", value, true);
				this._internalModel.setProperty("/enableSettings", value);
				return this;
			},

			setModelName: function (value) {
				this.setProperty("modelName", value);
				this._resetContent = true;
				return this;
			},

			setExpressionLanguage: function (value) {
				this.setAssociation("expressionLanguage", value, true);
				var expressionLanguage = (value instanceof Object) ? value : sap.ui.getCore().byId(value);
				if (!expressionLanguage) {
					return this;
				}
				// if panel has been built already - refresh it
				var oVerticalLayout = this.getAggregation("_verticalLayout");
				if (oVerticalLayout) {
					var contentBinding = oVerticalLayout.getBinding("content");
					if (contentBinding) {
						contentBinding.refresh();
					}
				}
				return this;
			},

			setAstExpressionLanguage: function (value) {
				this.setAssociation("astExpressionLanguage", value, true);
				var astExpressionLanguage = (value instanceof Object) ? value : sap.ui.getCore().byId(value);
				if (!astExpressionLanguage) {
					return this;
				}
				// if panel has been built already - refresh it
				var oVerticalLayout = this.getAggregation("_verticalLayout");
				if (oVerticalLayout) {
					var contentBinding = oVerticalLayout.getBinding("content");
					if (contentBinding) {
						contentBinding.refresh();
					}
				}
				return this;
			},
			setEditable: function (value) {
				this.setProperty("editable", value, true);
				this._internalModel.setProperty("/editable", value);
				return this;
			},

			setBindingContextPath: function (value) {
				var oldValue = this.getBindingContextPath();
				if (value && (oldValue !== value)) {
					this._unbindVerticalLayout();
					this.setProperty("bindingContextPath", value);
					this._resetContent = true;
				}
				return this;
			},
			
			includes: function (parent, str) {
				var returnValue = false;

				if (parent.indexOf(str) !== -1) {
					returnValue = true;
				}
				
				return returnValue;
			}

		});

		return TextRule;

	},
	/* bExport= */
	true);
