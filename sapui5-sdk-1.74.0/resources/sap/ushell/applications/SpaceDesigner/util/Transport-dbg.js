// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    /**
     * @constructor
     */
    var TransportHelper = function () {};

    /**
     * Returns a function to call when the transport information is changed
     * The returned function adds the transport validation to the given dialog's model
     *
     * @param {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} oDialog The dialog controller
     * @returns {function} The change handler function
     *
     * @private
     */
    TransportHelper.prototype._changeHandler = function (oDialog) {
        return function (value) {
            var oModel = oDialog.getModel();
            var oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                transport: value
            });
            oModel.setProperty("/validation", oValidation);
        };
    };

    /**
     * Adds the transportComponent to the extension point and adds the relevant handlers.
     *
     * @param {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} dialog The dialog controller
     * @param {object} transportComponent The component with the transport fields
     * @param {function} onConfirm The confirm function
     * @returns {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} The enhanced dialog
     *
     * @protected
     */
    TransportHelper.prototype.enhanceDialogWithTransport = function (dialog, transportComponent, onConfirm) {
        var fnChangeHandler = this._changeHandler(dialog);
        fnChangeHandler(false);
        var fnConfirmHandler = function (spaceInfo) {
            var oSpaceInfo = transportComponent.decorateResultWithTransportInformation(spaceInfo);
            onConfirm(oSpaceInfo);
        };
        transportComponent.attachChangeEventHandler(fnChangeHandler);
        dialog.attachConfirm(fnConfirmHandler);
        dialog.transportExtensionPoint(transportComponent);

        return dialog;
    };

    return TransportHelper;
});