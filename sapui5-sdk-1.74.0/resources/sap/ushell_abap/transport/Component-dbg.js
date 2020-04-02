//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell_abap/transport/util/Transport"
], function (UIComponent, JSONModel, TransportHelper) {
    "use strict";
    return UIComponent.extend("sap.ushell_abap.transport.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getModel("Transport").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });
        },

        /**
         * Returns the transportHelper utility instance
         *
         * @returns {object} The transportHelper instance
         */
        getTransportHelper: function () {
            if (!this._oTransportHelper) {
                this._oTransportHelper = new TransportHelper(this.getModel("Transport"));
            }
            return this._oTransportHelper;
        },

        changeHandler: function () {},

        /**
         * Registers a function to call on the change event of a mandatory input field
         *
         * @param {function} changeHandler The change handler function
         */
        attachChangeEventHandler: function (changeHandler) {
            this.changeHandler = changeHandler;
        },

        /**
         * Called if the transport input data changes
         * Calls a changeHandler function with the validation result
         *
         * @param {boolean} value The boolean validation result
         */
        change: function (value) {
            if (this.changeHandler) {
                this.changeHandler(value);
            }
        },

        /**
         * Merge the existing componentData object with the given object
         *
         * @param {object} componentData Data to merge into the existing componentData
         */
        _setComponentData: function (componentData) {
            this.oComponentData = Object.assign({}, this.oComponentData, componentData);
        },

        /**
         * Resets the models to initial values
         *
         * @param {object} componentData The componentData to set
         */
        reset: function (componentData) {
            var oView = this.getRootControl();
            this._setComponentData(componentData);
            oView.setModel(this.getModel("Transport"), "PackageModel");
            oView.setModel(new JSONModel({
                packageInputReadOnly: false,
                package: "",
                workbenchRequest: "",
                workbenchRequired: false
            }));
        },

        /**
         * Decorates the result object by adding transport-specific properties
         *
         * @param {object} pageInfo The result object
         * @returns {object} The enhanced object
         */
        decorateResultWithTransportInformation: function (pageInfo) {
            pageInfo = pageInfo || {};

            pageInfo.metadata = {
                devclass: this.getRootControl().getModel().getProperty("/package"),
                transportId: this.getRootControl().getModel().getProperty("/workbenchRequest")
            };

            return pageInfo;
        },

        /**
         * Checks if the transport information needs to be shown
         *
         * @param {object} page The page to check
         * @returns {Promise<boolean>} A promise resolving to the boolean result
         */
        showTransport: function (page) {
            return this.getTransportHelper().checkShowTransport(page);
        },

        /**
         * Checks if the page is locked by another user
         *
         * @param {object} page The page to edit
         * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
         */
        showLockedMessage: function (page) {
            return this.getTransportHelper().checkShowLocked(page);
        }
    });
});