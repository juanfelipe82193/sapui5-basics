// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    /**
     * Determines the total number of icon entries of all collections together.
     *
     * @returns {int} Returns the total number of icon entries of all collections together
     * @private
     */
    function determineTotalNumberOfCollectionItems() {
        var nTotalumber = 0,
            i,
            aAllCollectionNames;
        aAllCollectionNames = sap.ui.core.IconPool.getIconCollectionNames();
        for (i = 0; i < aAllCollectionNames.length; i++) {
            nTotalumber += sap.ui.core.IconPool.getIconNames(aAllCollectionNames[i]).length;
        }
        return nTotalumber;
    }

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
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function generateTableRows(sCollectionName) {
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
        return aRes;
    }

    /**
     * Creates & assigns the table rows to the model.
     *
     * @private
     */
    function updateAppStateModel(oModel, oAppStateModel) {
        var sFilter = oAppStateModel.getProperty("/appState/filter"),
            aRes;
        aRes = generateTableRows(oAppStateModel.getProperty("/appState/CollectionName"));
        jQuery.sap.log.info("updateAppStateModel ... " + sFilter);
        sFilter.split(" ").forEach(function (nv) {
            aRes = aRes.filter(function (obj) {
                return obj.key.indexOf(nv) >= 0;
            });
        });
        oModel.getData().icons = aRes;
        oModel.refresh();
    }

    /**
     * Creates & assigns the table rows to the model.
     *
     * @private
     */
    function assignTableRowsToModel(oModel, oAppStateModel, oView) {
        oModel.setSizeLimit(determineTotalNumberOfCollectionItems());
        oModel.setData({ icons: generateTableRows(oAppStateModel.getProperty("/appState/CollectionName")) });
        oView.setModel(oModel);
        updateAppStateModel(oModel, oAppStateModel);
    }

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf view.CatIcons
     */
    sap.ui.controller("sap.ushell.demo.AppStateSample.view.CatIcons", {
        onInit: function () {
            var that = this;
            this.oModel = new sap.ui.model.json.JSONModel();
            assignTableRowsToModel(this.oModel, this.getMyComponent().getModel("AppState"), this.getView());
            // Register event handler for collection change
            // This takes place when user selects category and respective list Item Press handler changes AppState Model's collection name
            this.getMyComponent().getModel("AppState").bindProperty("/appState/CollectionName").attachChange(function () {
                assignTableRowsToModel(that.oModel, that.getMyComponent().getModel("AppState"), that.getView());

            });
            this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
            this.getMyComponent().getModel("AppState").bindProperty("/appState/filter").attachChange(function () {
                updateAppStateModel(that.oModel, that.getMyComponent().getModel("AppState"));
                // This navTo is needed to obtain the sap-iapp-state in the browser URL to be able to
                // get the current filter applied immediately when using the URL with this app state
                that.getMyComponent().navTo("toCatIcons");
            });
            //to ensure that during first time icon loading they get filtered
            updateAppStateModel(this.oModel, this.getMyComponent().getModel("AppState"));
        },

        handleChange: function (ev) {
            jQuery.sap.log.info("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
            ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        }
    });
}());
