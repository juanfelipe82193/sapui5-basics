// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (
    DateFormat,
    Controller,
    Filter,
    FilterOperator,
    Sorter
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposer.controller.ViewSettingsDialog", {
        constructor: function (PageOverviewController) {
            this.PageOverviewController = PageOverviewController;
        },

        /**
         * Applies the applicable sorters and filters for the given viewSettingsDialog confirm event.
         *
         * @param {sap.ui.base.Event} oEvent The confirm event of the viewSettingsDialog.
         *
         * @private
         */
        handleDialogConfirm: function (oEvent) {
            var mParams = oEvent.getParameters(),
                oTable = this.PageOverviewController.byId("table"),
                oBinding = oTable.getBinding("items"),
                aSorters = this.getSorters(mParams),
                aFilters = this.getFilters(mParams);

            // apply sorters
            oBinding.sort(aSorters);

            // apply filters
            this.PageOverviewController.aViewSettingsFilters = aFilters;
            this.PageOverviewController._applyCombinedFilters();

            // update filter bar
            this.PageOverviewController.byId("infoFilterBar").setVisible(aFilters.length > 0);
            this.PageOverviewController.byId("infoFilterLabel").setText(mParams.filterString);
        },

        /**
         * Derives the applicable sorters for the given event parameters.
         *
         * @param {object} mParams An object containing the event parameters of the viewSettingsDialog confirm event.
         * @returns {sap.ui.model.Sorter[]} An array of sorters, that represent the currently selected sorting and grouping.
         *
         * @private
         */
        getSorters: function (mParams) {
            var aSorters = [],
                oGoupItem = mParams.groupItem,
                oResourceBundle = this.PageOverviewController.getResourceBundle();

            if (oGoupItem) {
                var sGroupPath = oGoupItem.getKey(),
                    fnSorter;

                switch (sGroupPath) {
                    case "content/editAllowed":
                        fnSorter = function (oContext) {
                            var bName = oContext.getProperty(sGroupPath);
                            return {
                                key: bName,
                                text: bName
                                    ? oResourceBundle.getText("Message.StatusAssigned")
                                    : oResourceBundle.getText("Message.NotAssigned")
                            };
                        };
                        break;
                    case "content/createdOn":
                    case "content/modifiedOn":
                        fnSorter = function (oContext) {
                            var oFormat = DateFormat.getInstance({
                                style: "medium"
                            });

                            var oDate = oContext.getProperty(sGroupPath),
                                sFormatedDate = oFormat.format(oDate);

                            return {
                                key: sFormatedDate,
                                text: sFormatedDate
                            };
                        };
                        break;
                    default:
                        fnSorter = function (oContext) {
                            var sName = oContext.getProperty(sGroupPath);
                            return {
                                key: sName,
                                text: sName
                            };
                        };
                }

                aSorters.push(new Sorter(sGroupPath, mParams.groupDescending, fnSorter));
            }

            if (mParams.sortItem) {
                aSorters.push(new Sorter(mParams.sortItem.getKey(), mParams.sortDescending));
            } else {
                aSorters.push(new Sorter("content/modifiedOn", true));
            }

            return aSorters;
        },

        /**
         * Derives the applicable filters for the given event parameters.
         *
         * @param {object} mParams An object containing the event parameters of the viewSettingsDialog confirm event.
         * @returns {sap.ui.model.Sorter[]} An array of filters, that represent the currently selected filtering.
         *
         * @private
         */
        getFilters: function (mParams) {
            var aFilters = [];

            mParams.filterItems.forEach(function (oItem) {
                var sPath,
                    sOperator,
                    sValue1,
                    sValue2;

                if (oItem.getKey() === "content/createdOn" || oItem.getKey() === "content/modifiedOn") {
                    var oDateRangeSeletion = oItem.getCustomControl();

                    sPath = oItem.getKey();
                    sOperator = FilterOperator.BT;
                    sValue1 = oDateRangeSeletion.getDateValue();
                    sValue2 = oDateRangeSeletion.getSecondDateValue();

                    if (sPath === "content/createdOn") {
                        this._createdOnFromFilter = sValue1;
                        this._createdOnToFilter = sValue2;
                    } else {
                        this._changedOnFromFilter = sValue1;
                        this._changedOnToFilter = sValue2;
                    }
                } else {
                    var aSplit = oItem.getKey().split("___");
                    sPath = aSplit[0];
                    sOperator = aSplit[1];
                    sValue1 = aSplit[2];
                    sValue2 = aSplit[3];

                    if (sPath === "content/editAllowed") {
                        if (sValue1 === "true") {
                            sValue1 = true;
                        } else {
                            sValue1 = false;
                        }
                    }
                }

                aFilters.push(new Filter(sPath, sOperator, sValue1, sValue2));
            }.bind(this));

            return aFilters;
        },

        /**
         * Updates the filter count for a custom viewSetting filter.
         *
         * @param {sap.ui.base.Event} oEvent The change event from the group dateRangeSelections.
         *
         * @private
         */
        handleDateRangeSelectionChanged: function (oEvent) {
            var oParameters = oEvent.getParameters(),
                oViewSetting = oParameters.id === "CreatedOnDateRangeSelection"
                    ? sap.ui.getCore().byId("CreatedOnFilter")
                    : sap.ui.getCore().byId("ChangedOnFilter");

            if (oParameters.from) {
                oViewSetting.setFilterCount(1);
                oViewSetting.setSelected(true);
            } else {
                oViewSetting.setFilterCount(0);
                oViewSetting.setSelected(false);
            }
        },

        /**
         * Handles the cancel press event and resets the changes to the values of the custom viewSettings filters.
         *
         * @private
         */
        handleCancel: function () {
            var oCreatedOnFilter = sap.ui.getCore().byId("CreatedOnFilter"),
                oCreatedOnDateRangeSelection = sap.ui.getCore().byId("CreatedOnDateRangeSelection"),
                oChangedOnFilter = sap.ui.getCore().byId("ChangedOnFilter"),
                oChangedOnDateRangeSelection = sap.ui.getCore().byId("ChangedOnDateRangeSelection");

            if (this._createdOnFromFilter) {
                oCreatedOnFilter.setFilterCount(1);
                oCreatedOnFilter.setSelected(true);
            } else {
                oCreatedOnFilter.setFilterCount(0);
                oCreatedOnFilter.setSelected(false);
            }

            if (this._changedOnFromFilter) {
                oChangedOnFilter.setFilterCount(1);
                oChangedOnFilter.setSelected(true);
            } else {
                oChangedOnFilter.setFilterCount(0);
                oChangedOnFilter.setSelected(false);
            }

            oCreatedOnDateRangeSelection.setDateValue(this._createdOnFromFilter);
            oCreatedOnDateRangeSelection.setSecondDateValue(this._createdOnToFilter);
            oChangedOnDateRangeSelection.setDateValue(this._changedOnFromFilter);
            oChangedOnDateRangeSelection.setSecondDateValue(this._changedOnToFilter);
        },

        /**
         * Resets the custom viewSettings filter to the inital value.
         *
         * @private
         */
        handleResetFilters: function () {
            var oCreatedOnDateRangeSelection = sap.ui.getCore().byId("CreatedOnDateRangeSelection"),
                oChangedOnDateRangeSelection = sap.ui.getCore().byId("ChangedOnDateRangeSelection"),
                oCreatedOnFilter = sap.ui.getCore().byId("CreatedOnFilter"),
                oChangedOnFilter = sap.ui.getCore().byId("ChangedOnFilter");

            oCreatedOnDateRangeSelection.setDateValue();
            oCreatedOnDateRangeSelection.setSecondDateValue();
            oChangedOnDateRangeSelection.setDateValue();
            oChangedOnDateRangeSelection.setSecondDateValue();
            oCreatedOnFilter.setFilterCount(0);
            oCreatedOnFilter.setSelected(false);
            oChangedOnFilter.setFilterCount(0);
            oChangedOnFilter.setSelected(false);
        }
    });
});