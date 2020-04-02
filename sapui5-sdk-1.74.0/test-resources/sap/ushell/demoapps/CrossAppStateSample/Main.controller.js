// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    /**
     * Builds the table rows for the given icon names and returns them in an array.
     *
     * @param {string} sCollectionName The collection or category name of the icons
     * @param {number} nIdxStart You can pass the start index for the rows
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function buildTableRowsForCollectionName(sCollectionName, nIdxStart) {
        var sUri, oRes = [], sIconNames;
        //Names of the icons for one icon collection/category (e.g. 'undefined', 'Fiori2')
        sIconNames = sap.ui.core.IconPool.getIconNames(sCollectionName);
        if (sIconNames) {
            sIconNames.forEach(function (sIconName, nIdx) {
                sUri = "sap-icon://" + sCollectionName + "/" + sIconName;
                oRes.push({ key: sUri, index: nIdx + nIdxStart, collectionName: sCollectionName }); //JSON
            });
        }
        return oRes;
    }

    /**
     * Prepares the build of table rows by given collection name.
     *
     * @param {string} sCollectionName Name of icon collection/category (e.g. 'undefined', 'Fiori2')
     * @param {string} sFilter Prepared table rows will be filtered by this value
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function generateTableRowsByFilter(sCollectionName, sFilter) {
        var aRes = [],
            i,
            aAllCollectionNames;
        if (sCollectionName === "Show All") {
            aAllCollectionNames = sap.ui.core.IconPool.getIconCollectionNames();
            for (i = 0; i < aAllCollectionNames.length; i++) {
                // Array.push.apply because we have to concat JSON objects
                Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(aAllCollectionNames[i], aRes.length + 1));
            }
        } else {
            Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(sCollectionName, aRes.length + 1));
        }
        // filter result
        sFilter.split(" ").forEach(function (sFilterElement) {
            aRes = aRes.filter(function (obj) {
                return obj.key.indexOf(sFilterElement) >= 0;
            });
        });
        return aRes;
    }
    sap.ui.controller("sap.ushell.demo.CrossAppStateSample.Main", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () {
            var that = this,
                sCollectionName,
                sFilter;

            this.getMyComponent().getModel("AppState").bindProperty("/appState/CollectionName").attachChange(function () {
                sCollectionName = that.getMyComponent().getModel("AppState").getProperty("/appState/CollectionName");
                sFilter = that.getMyComponent().getModel("AppState").getProperty("/appState/filter");
                that.oModel = new sap.ui.model.json.JSONModel({ icons: generateTableRowsByFilter(sCollectionName, sFilter) });
                that.getView().setModel(that.oModel);
            });
            this.getView().setModel(this.oModel);
        },

        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        }
    });
}());
