sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "../../library",
    "sap/ui/core/Control",
    "sap/m/List",
    "sap/ui/model/json/JSONModel",
    "sap/m/ListMode",
    "sap/ui/core/CustomData",
    "sap/ui/model/Sorter",
    "sap/rules/ui/parser/infrastructure/util/utilsBase",
    "sap/ui/core/LocaleData",
    "sap/rules/ui/Constants",
    "sap/rules/ui/services/AstExpressionLanguage",
    "sap/rules/ui/ast/util/AggregateFunctionDialog"

], function (jQuery, library, Control, List, JSONModel, ListMode, CustomData, Sorter, infraUtils,
    LocaleData, Constants, AstExpressionLanguage, AggregateFunctionDialog) {
    "use strict";

    var autoSuggestionAggregateFunctionPanel = Control.extend("sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAggregateFunctionPanel", {
        metadata: {
            library: "sap.rules.ui",
            properties: {
                reference: {
                    type: "object",
                    defaultValue: null,
                },
                dialogOpenedCallbackReference: {
                    type: "object",
                    defaultValue: null,
                },
                data: {
                    type: "object",
                    defaultValue: null
                }
            },
            aggregations: {
                PanelLayout: {
                    type: "sap.m.Panel",
                    multiple: false
                }
            },
            associations: {

                astExpressionLanguage: {
                    type: "sap.rules.ui.services.AstExpressionLanguage",
                    multiple: false,
                    singularName: "astExpressionLanguage"
                }

            },
            events: {}
        },

        init: function () {
			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
            this.aggregateFunctionDialog = AggregateFunctionDialog.getInstance();
            this.infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
            this._oAstExpressionLanguage = new AstExpressionLanguage();
            this.needCreateLayout = true;

        },
        onBeforeRendering: function () {
            this._reference = this.getReference();
            this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
            if (this.needCreateLayout) {
                var layout = this._createLayout();
                this.setAggregation("PanelLayout", layout, true);
                this.needCreateLayout = false;
            }
        },

        onAfterRendering: function () {
            this._oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
        },
        initializeVariables: function () {

        },
        _createLayout: function () {
            var that = this;
            var AggregateFunctionsPanel = new sap.m.Panel({
                expandable: false,
                expanded: true,
				width: "auto",
                content: [new sap.m.Link({
                    wrapping: true,
                    text: this.oBundle.getText("aggregateFunctionPanelTitle"),
                    press: function (oEvent) {
                        that._dialogOpenedCallbackReference(true);
                        that.aggregateFunctionDialog._createAggregationFunctionDialog(that.getData(), that._reference, that._oAstExpressionLanguage, that._dialogOpenedCallbackReference);
                    }
                })]
            })
            return AggregateFunctionsPanel;
        },
    });

    return autoSuggestionAggregateFunctionPanel;
}, /* bExport= */ true);