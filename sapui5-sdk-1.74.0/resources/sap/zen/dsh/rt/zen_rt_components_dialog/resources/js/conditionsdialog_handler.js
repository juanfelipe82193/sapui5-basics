define("zen.rt.components.dialog/resources/js/conditionsdialog_handler",  ["sap/zen/basehandler"], function(BaseHandler) {
	"use strict";

    var ConditionsDialogHandler = function () {
        var handler = this;
        BaseHandler.apply(this, arguments);
        this.sLocalizationPrefix = "com.sap.zen.firefly.impl.";
        if (sap.ui.getCore().getLoadedLibraries().hasOwnProperty("sap.zen.dsh")) {
            this.oRessources = jQuery.sap.resources({url: sap.ui.resource("sap.zen.dsh","rt/localization/localization.properties")});
        } else {
        	//For hybrid or native mode w/o the library
        	this.oRessources = jQuery.sap.resources({url: "/aad/buddha/localization/localization.properties"});
        }
        
        this.getRuntimeText = function(sTextId) {
        	return handler.oRessources.getText(handler.sLocalizationPrefix + sTextId);
        }

        function convertValuesToNumbers(oControlProperties) {
            if (oControlProperties && oControlProperties.condition && oControlProperties.condition.thresholds) {
                oControlProperties.condition.thresholds = oControlProperties.condition.thresholds.map(function (threshold) {
                     if (typeof threshold.value1 !== "number") {
                        threshold.value1 = Number(threshold.value1);
                    }
                    if (threshold.value2 && typeof threshold.value2 !== "number") {
                        threshold.value2 = Number(threshold.value2);
                    }
                    return threshold;
                });
            }
        }

        this.create = function(oChainedControl, oControlProperties) {
            convertValuesToNumbers(oControlProperties)
            var oModel = new sap.ui.model.json.JSONModel();
		    oModel.setData(oControlProperties);

            var oControl = oChainedControl || new sap.m.Button(oControlProperties.id, {visible: false}),
                  oDialog =  getDialog(oModel);
                
            oControl.ZEN_ConditionsDialog = oDialog;

            oControl.exit = function () {
                if (oControl.ZEN_ConditionsDialog) {
                    oControl.ZEN_ConditionsDialog.destroy();
                    oControl.ZEN_ConditionsDialog = null;
                }
            };

            oDialog.open();

            return oControl;
        }

        function getDialog(oModel) {
            var oDialog = new sap.m.Dialog({
                                resizable : true, 
                                draggable : true,
                                contentHeight: "420px",
                                contentWidth: "715px"
                            }),
                  oLayout = new sap.m.VBox({fitContainer: true}),
                  oRessourcesComp = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp"),
                  oFilterPanelLayout = getFilterPanel(oModel),
                  oFilterPanel = oFilterPanelLayout.getContent()[0],
                  oAdditionalSettingsLayout = getAdditionalSettings();
            
            oLayout.addItem(oFilterPanelLayout);
            oLayout.addItem(getResetButton(oFilterPanel));
            oLayout.addItem(oAdditionalSettingsLayout);

            oDialog.addContent(oLayout);

            oDialog.addButton(new sap.m.Button({
                text: oRessourcesComp.getText("VALUEHELPDLG_OK"),
                press: function () {
                    new Function(handler.prepareCommand(oDialog.getModel().getProperty("/submitCommand"), "__JSON__", JSON.stringify({
                        thresholds: oFilterPanel.getConditions(),
                        dimensionEvaluationType: oAdditionalSettingsLayout.getContent()[1].getSelectedItem().getKey(),
                        evaluateRulesWithAnd: Boolean(oAdditionalSettingsLayout.getContent()[3].getSelectedIndex())
                    })))();
                    oDialog.close();
                },
                layoutData: new sap.m.OverflowToolbarLayoutData({priority: sap.m.OverflowToolbarPriority.NeverOverflow})
            }));
            oDialog.addButton(new sap.m.Button({
                text: oRessourcesComp.getText("VALUEHELPDLG_CANCEL"),
                press: function () {
                    oDialog.close()
                },
                layoutData: new sap.m.OverflowToolbarLayoutData({priority: sap.m.OverflowToolbarPriority.NeverOverflow})
            }));

            oDialog.setTitle(handler.getRuntimeText("CONDITIONSDLG_TITLE"));

            oDialog.attachBeforeOpen(function () {
                oFilterPanel.setConditions(oModel.getProperty("/condition/thresholds"))
            });

            /*oDialog.attachAfterClose(function () {
                oControl.destroy();
            });*/
            oDialog.setModel(oModel);

            return oDialog;
        }

        function getFilterPanel(oModel) {
            var oFilterPanel = new sap.m.P13nFilterPanel({
                containerQuery: true,
                maxExcludes: 0,
                items: {
                    path: "/measures",
                    template: new sap.m.P13nItem({
                        columnKey: "{key}",
                        text: "{text}",
                        type: "numeric"
                    }) 
                }
            }),
            oConditionPanel = oFilterPanel._oIncludeFilterPanel,
            fOrgGetFormatedConditionText = oConditionPanel._getFormatedConditionText;

            //overwrite the method for correct handling new operations
            oConditionPanel._getFormatedConditionText = function (sOperation, sValue1, sValue2, bExclude, sKeyField) {
                var sOrgResult = fOrgGetFormatedConditionText.apply(oConditionPanel, arguments);
                if (sOrgResult !== "") {
                    return sOrgResult;
                }
                var sConditionText = "";
                if (sValue1 !== "" && sValue1 !== undefined) {
                    var sKeyFieldText = null;
                    if (this._aKeyFields && this._aKeyFields.length > 1) {
                        // search the text for the KeyField
                        for (var i = 0; i < this._aKeyFields.length; i++) {
                            var oKeyField = this._aKeyFields[i];
                            if (typeof oKeyField !== "string") {
                                if (oKeyField.key === sKeyField && oKeyField.text) {
                                    sKeyFieldText = oKeyField.text;
                                    break;
                                }
                            }
                        }
                    }
					sConditionText = sOperation + " " + sValue1;
                    if (sKeyFieldText && sConditionText !== "") {
                        sConditionText = sKeyFieldText + ": " + sConditionText;
                    }
				}
                return sConditionText;
            }

            //overwrite the method to apply texts for the new operations
            oConditionPanel._fillOperationListItems = function (oCtrl, aOperations, sType) {
                if (sType === "_STRING_") {
                    // ignore the "String" Type when accessing the resource text
                    sType = "";
                }
                if (sType === "_TIME_") {
                    sType = "_DATE_";
                }
                if (sType === "_BOOLEAN_") {
                    sType = "";
                }

                oCtrl.destroyItems();
                for ( var iOperation in aOperations) {
                    var sOperation = aOperations[iOperation], sText;
                    if (sOperation.indexOf("ZEN") === 0) {
                        sText = handler.getRuntimeText("CONDITIONPANEL_OPTION" + sType + aOperations[iOperation]);
                    } else {
                        sText = oConditionPanel._oRb.getText("CONDITIONPANEL_OPTION" + sType + aOperations[iOperation]);
                        if (jQuery.sap.startsWith(sText, "CONDITIONPANEL_OPTION")) {
                            // when for the specified type the resource does not exist use the normal string resource text
                            sText = oConditionPanel._oRb.getText("CONDITIONPANEL_OPTION" + aOperations[iOperation]);
                        }
                    }
                    oCtrl.addItem(new sap.ui.core.ListItem({
                        key: aOperations[iOperation],
                        text: sText,
                        tooltip: sText
                    }));
                }
            }

            oFilterPanel.setIncludeOperations([
				sap.m.P13nConditionOperation.EQ,
                "ZENNEQ" ,
				sap.m.P13nConditionOperation.BT,
                //"ZENNBT", deactivate "not between", because showing 2 value fields is only possible for the build in "BT" operation
                //if "not between" is missed by someone, then we can add a "exclusion" panel with "between" operation
				sap.m.P13nConditionOperation.LT, 
				sap.m.P13nConditionOperation.LE, 
				sap.m.P13nConditionOperation.GT, 
				sap.m.P13nConditionOperation.GE,
                "ZENTopN",
                "ZENTopPercent",
                "ZENTopSum",
                "ZENBottomN",
                "ZENBottomPercent",
                "ZENBottomSum"
			], "numeric");

            oFilterPanel.setConditions(oModel.getProperty("/condition/thresholds"));

            return new sap.ui.layout.form.SimpleForm({
            		editable: true,
            		title: handler.getRuntimeText("CONDITIONSDLG_RULES"),
            		content: [oFilterPanel]
            	});
        }

        function getResetButton(oFilterPanel) {
            return new sap.m.Button({
                text: handler.getRuntimeText("CONDITIONSDLG_ADDITIONAL_RemoveAllRules"),
                icon: "sap-icon://undo",
                press: function () {
                    oFilterPanel.setConditions([]);
                }
            });
        }

        function getAdditionalSettings() {
            var oForm = new sap.ui.layout.form.SimpleForm({
            		editable: true,
            		title: handler.getRuntimeText("CONDITIONSDLG_ADDITIONAL_SETTINGS")
            	});

            oForm.addContent(new sap.m.Label({text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENTypeOfDimensionEvaluation")}));
            oForm.addContent(new sap.m.Select({
                selectedKey: "{/condition/dimensionEvaluationType}",
                items: [
                     new sap.ui.core.Item({
                        key: "mostDetailedOnRows",
                        text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENDetailsOnRows")
                    }),
                     new sap.ui.core.Item({
                        key: "mostDetailedOnCols",
                        text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENDetailsOnColumns")
                    }),
                    new sap.ui.core.Item({
                        key: "allInDrilldown",
                        text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENIndependent")
                    })
                ]
            }));

            oForm.addContent(new sap.m.Label({text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENEvaluateRulesWith")}));
            oForm.addContent(new sap.m.RadioButtonGroup({
                selectedIndex: 0,
                buttons: [
                     new sap.m.RadioButton({
                        text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENOr")
                    }),
                     new sap.m.RadioButton({
                        text: handler.getRuntimeText("CONDITIONPANEL_OPTION_ZENAnd")
                    })
                ]
            }));

            return oForm;
        }

        this.update = function(oControl, oControlProperties, oComponentProperties) {
            if (oControl && oControlProperties) {
                convertValuesToNumbers(oControlProperties)
                var oDialog = oControl.ZEN_ConditionsDialog;
                if (oDialog) {
                    oDialog.getModel().setProperty("/", oControlProperties);
                    if (!oDialog.isOpen()) {
                        oDialog.open();
                    }
                } else {
                   this.create(oControl, oControlProperties, oComponentProperties);
                }
            }
        }

        this.getType = function() {
            return "conditions_dialog";
        }
    }

    return new ConditionsDialogHandler();
});