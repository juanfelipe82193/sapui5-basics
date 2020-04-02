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

    var autoSuggestionTimeAndDurationFunctionPanel = Control.extend(
        "sap.rules.ui.ast.autoCompleteContent.AutoSuggestionTimeAndDurationFunctionPanel", {
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
                this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
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
                this.vocabularyData = this.getData();
                // create a Model with this data
                var model = new sap.ui.model.json.JSONModel();

                // create a list 
                this.timeAndDurationFunctionlist = new sap.m.List({
                    growingScrollToLoad: true,
                    enableBusyIndicator: true,
                });

                /*Setting growing shows the growing trigger button with text as 2/14 which we do not need
            Hence, setting to top 5 and the rest will be shown in More link */
                var topFiveVocabularyData = [];
                for (var termCount = 0; termCount < 5 && termCount < this.vocabularyData.length; termCount++) {
                    topFiveVocabularyData.push(this.vocabularyData[termCount]);
                }
                model.setData(topFiveVocabularyData);

                // bind the List items to the data collection
                this.timeAndDurationFunctionlist.bindItems({
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
                this.timeAndDurationFunctionlist.setModel(model);
                var moreTimeAndDurationLink = this.getMoreTimeAndDurationLink();
                var that = this;

                // add list to the panel
                var timeAndDurationFunctionslistPanel = new sap.m.Panel({
                    headerText: this.oBundle.getText("timeAndDurationFunctionsPanelTitle"),
                    expandable: true,
                    expanded: this.getExpand(),
                    content: this.timeAndDurationFunctionlist,
                    width: "auto"
                });

                if (this.vocabularyData.length >= 5) {
                    timeAndDurationFunctionslistPanel.addContent(moreTimeAndDurationLink);
                }

                return timeAndDurationFunctionslistPanel;
            },

            getMoreTimeAndDurationLink: function () {
                var that = this;
                var suggestionsData = this.getData();
                var moreTimeAndDurationLink = new sap.m.Link({
                    text: this.oBundle.getText("more_link"),
                    tooltip: this.oBundle.getText("more_link_tooltip"),
                    enabled: true,
                    press: function (oEvent) {
                        that._setModal(true);
                        that._dialogOpenedCallbackReference(true);
                        if (that.vocabularyData) {
                            that.getTimeAndDurationDialog();
                        }
                    }
                });
                return moreTimeAndDurationLink;

            },

            _setModal: function (value) {
                var pop = sap.ui.getCore().byId("popover");
                if (pop) {
                    pop.setModal(value);
                }
            },

            getTimeAndDurationDialog: function () {
                var that = this;
                var searchFieldText = this.oBundle.getText("searchTextTimeAndDuration");
                var searchField = this.getSearchField(searchFieldText);
                this.detailedTimeAndDurationList = this.initializeTimeAndDurationList(this.vocabularyData);
                this.bindFilteredTermsToList(this.detailedTimeAndDurationList, "", false);
                var verticalLayoutForTimeAndDurationFunction = new sap.ui.layout.VerticalLayout({
                    content: [searchField, that.detailedTimeAndDurationList]
                }).addStyleClass("sapAstVocabularyPanel");

                this.timeAndDurationDialog = new sap.m.Dialog({
                    title: this.oBundle.getText("selectTimeAndDurationTitle"),
                    contentWidth: "500px",
                    contentHeight: "500px",
                    showHeader: true,
                    content: [verticalLayoutForTimeAndDurationFunction],
                    afterClose: function () {
                        that._dialogOpenedCallbackReference(false);
                    },
                    buttons: [
                        new sap.m.Button({
                            text: this.oBundle.getText("cancelBtn"),
                            tooltip: this.oBundle.getText("cancelBtn"),
                            press: function (event) {
                                that._setModal(false);
                                that.timeAndDurationDialog.close();
                            }
                        })
                    ]
                });
                that.timeAndDurationDialog.open();

            },

            bindFilteredTermsToList: function (oList, searchText, requireSearch) {
                var model = new sap.ui.model.json.JSONModel(this.vocabularyData);

                var that = this;
                var datapath = "/";
                if (!oList) {
                    oList = new sap.m.List({});
                }
                oList.setModel(model);
                oList.bindItems({
                    path: datapath,
                    template: new sap.m.DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                        press: function (oEvent) {
                            that._setModal(false);
                            if (that.timeAndDurationDialog.isOpen()) {
                                that.timeAndDurationDialog.close();
                            }
                            that._reference(oEvent);
                        }
                    }),
                    rememberSelections: false,
                    mode: ListMode.SingleSelectMaster
                });
                if (requireSearch) {
                    var filterArray = [];
                    var filterProperty = "name";
                    filterArray.push(new sap.ui.model.Filter(filterProperty, sap.ui.model.FilterOperator.Contains, searchText));
                    oList.getBinding("items").filter(filterArray);
                    oList.getModel().refresh(true);
                }
            },

            initializeTimeAndDurationList: function (vocabularyData) {
                var model = new sap.ui.model.json.JSONModel(vocabularyData);
                var datapath = "/";
                var timeAndDurationlist = new sap.m.List({
                    headerText: this.oBundle.getText("timeAndDuration")
                });
                timeAndDurationlist.setModel(model);
                timeAndDurationlist.bindItems({
                    path: datapath,
                    template: new sap.m.DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                    })

                });
                return timeAndDurationlist;
            },

            getSearchField: function (placeHolderText) {
                var that = this;
                this.searchField = new sap.m.SearchField({
                    showSearchButton: false,
                    width: "462px",
                    placeholder: placeHolderText, //searchType,
                    liveChange: function (oEvent) {
                        that.bindFilteredTermsToList(that.detailedTimeAndDurationList, oEvent.getParameter("newValue"), true);
                    }
                })
                return this.searchField;
            }

        });

    return autoSuggestionTimeAndDurationFunctionPanel;
}, /* bExport= */ true);