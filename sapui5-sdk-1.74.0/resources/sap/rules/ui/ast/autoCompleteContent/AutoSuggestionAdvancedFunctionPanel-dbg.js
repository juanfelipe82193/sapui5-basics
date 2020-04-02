sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "../../library",
    "sap/ui/core/Control",
    "sap/m/List",
    "sap/ui/model/json/JSONModel",
    "sap/m/ListMode",
    "sap/ui/core/CustomData",
    "sap/ui/model/Sorter",
    "sap/rules/ui/parser/infrastructure/util/utilsBase"
], function (jQuery, library, Control, ResponsivePopover, List, JSONModel, ListMode, CustomData, Sorter, infraUtils) {
    "use strict";

    var autoSuggestionAdvancedFunctionPanel = Control.extend(
        "sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAdvancedFunctionPanel", {
            metadata: {
                library: "sap.rules.ui",
                properties: {
                    reference: {
                        type: "object",
                        defaultValue: null,
                    },
                    data: {
                        type: "object",
                        defaultValue: null
                    },
                    expand: {
                        type: "boolean",
                        defaultValue: false
                    }
                },
                aggregations: {
                    PanelLayout: {
                        type: "sap.m.Panel",
                        multiple: false
                    }
                },
                events: {}
            },

            init: function () {
				this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
                this.infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
                this.needCreateLayout = true;
                this.AttributeSegmentSelected = true;
                this.dataObjectName = "";
            },
            onBeforeRendering: function () {
                this._reference = this.getReference();
                if (this.needCreateLayout) {
                    var layout = this._createLayout();
                    this.setAggregation("PanelLayout", layout, true);
                    this.needCreateLayout = false;
                }
            },

            initializeVariables: function () {

            },

            _createLayout: function () {
                var that = this;
                var vocabularyData = this.getData();
                // create a Model with this data
                var model = new sap.ui.model.json.JSONModel();
                model.setData(vocabularyData);

                // create a list 
                this.advancedFunctionlist = new sap.m.List({
                    growing: true,
                    growingScrollToLoad: true,
                    enableBusyIndicator: true,
                });

                // bind the List items to the data collection
                this.advancedFunctionlist.bindItems({
                    path: "/",
                    sorter: new sap.ui.model.Sorter("name"),
                    rememberSelections: false,
                    mode: ListMode.SingleSelectMaster,
                    template: new sap.m.DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                        press: function (oEvent) {
                            that._reference(oEvent);
                        }
                    })
                });

                // set the model to the List, so it knows which data to use
                this.advancedFunctionlist.setModel(model);
                var that = this;

                // add list to the panel
                var advancedFunctionslistPanel = new sap.m.Panel({
                    headerText: this.oBundle.getText("advancedFunctionPanelTitle"),
                    expandable: true,
                    expanded: this.getExpand(),
                    content: this.advancedFunctionlist,
					width: "auto"
                });

                return advancedFunctionslistPanel;
            },

   
        });

    return autoSuggestionAdvancedFunctionPanel;
}, /* bExport= */ true);