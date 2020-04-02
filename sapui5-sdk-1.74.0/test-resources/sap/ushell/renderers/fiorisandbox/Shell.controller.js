// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.components.container.ApplicationContainer");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    jQuery.sap.require("sap.ushell.services.NavTargetResolution");
    jQuery.sap.require("sap.ushell.services.Message");
    jQuery.sap.require("sap.m.MessageToast");
    jQuery.sap.require("sap.m.MessageBox");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");

    /**
     * @name sap.ushell.renderers.fiorisandbox.Shell
     * @extends sap.ui.core.mvc.Controller
     */
    sap.ui.controller("sap.ushell.renderers.fiorisandbox.Shell", {

        /**
         * Set application container based on information in URL hash.
         */
        doHashChange : function (sShellHash) {
            var oView = this.getView();

            if (!sShellHash) {
                sShellHash =  "";
            }
            if (sShellHash.charAt(0) !== '#') {
                sShellHash = '#' + sShellHash;
            }

            if (this.oDefaultApp && sShellHash === "#") {
                // resolve empty hash directly to default app, if specified in config
                var oContainer = oView.byId("container");
                oContainer.setAdditionalInformation(this.oDefaultApp.additionalInformation);
                oContainer.setApplicationType(this.oDefaultApp.applicationType);
                oContainer.setUrl(this.oDefaultApp.url);
                oContainer.setVisible(true);
            } else {
                // resolve via target resolution service
                sap.ushell.Container.getService("NavTargetResolution")
                .resolveHashFragment(sShellHash)
                .done(function (oApplication, sParameters) {
                    // set current application before initializing the application
                    sap.ushell.services.AppConfiguration.setCurrentApplication(oApplication);
                    var oContainer = oView.byId("container");
                    if (oApplication) {
                        var url = oApplication.url;
                        if (url && sParameters) {
                            if (url.indexOf("?") > 0) {
                                url += "&" + sParameters;
                            } else {
                                url += "?" + sParameters;
                            }
                        }

                        oContainer.setAdditionalInformation(oApplication.additionalInformation);
                        oContainer.setApplicationType(oApplication.applicationType);
                        oContainer.setUrl(url);
                    }
                    oContainer.setVisible(true);
                });
            }

        },

        /**
         * SAPUI5 lifecycle hook.
         */
        onInit: function () {
            var oViewData = this.getView().getViewData();

            // set default app as member if specified in config; is read in doHashChange
            this.oDefaultApp = oViewData && oViewData.config && oViewData.config.defaultApp;

            // dynamically load additional style sheet
            jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(
                "sap.ushell.renderers.fiorisandbox.styles.minimal",
                ".css"
            ));

            // initialize the shell navigation service; also triggers the doHashChange callback for the initial load (or an empty hash)
            sap.ushell.Container.getService("ShellNavigation").init(jQuery.proxy(this.doHashChange, this));
            sap.ushell.Container.getService("Message").init(jQuery.proxy(this.doShowMessage, this));
        },

        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            if (iType === sap.ushell.services.Message.Type.ERROR) {
                sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                        oParameters.title || sap.ushell.resources.i18n.getText("error"));
            } else if (iType === sap.ushell.services.Message.Type.CONFIRM) {
                if (oParameters.actions) {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    sap.m.MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                sap.m.MessageToast.show(sMessage, { duration: oParameters.duration || 3000 });
            }
        }
    });
}());
