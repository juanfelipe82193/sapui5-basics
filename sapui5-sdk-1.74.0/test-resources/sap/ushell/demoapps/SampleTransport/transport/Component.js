//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Dummy implementation of transport component which provides the interface for the PageComposition OPA test
 */

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";
    return UIComponent.extend("sap.ushell_abap.transport.Component", {
        metadata: {
            manifest: "json"
        },
        changeHandler: function () {
            return true;
        },
        attachChangeEventHandler: function (changeHandler) {
            changeHandler(true);
        },
        change: function () {
            if (this.changeHandler) {
                this.changeHandler();
            }
        },
        decorateResultWithTransportInformation: function (pageInfo) {
            return pageInfo;
        },
        reset: function () {},

        showTransport: function (page) {
            return Promise.resolve(false);
        },
        showLockedMessage: function (page) {
            return Promise.resolve(false);
        }
    });
});