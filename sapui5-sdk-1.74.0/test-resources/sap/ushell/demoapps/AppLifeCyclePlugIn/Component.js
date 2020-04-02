(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.AppLifeCyclePlugIn.Component");
    jQuery.sap.require("sap.ui.core.Component");

    var sComponentName = "sap.ushell.demo.AppLifeCyclePlugIn";

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.AppLifeCyclePlugIn.Component", {

        metadata : {
            version: "1.74.0",
            library: "sap.ushell.demo.AppLifeCyclePlugIn"
        },

        /**
         * Returns the shell renderer instance in a reliable way,
         * i.e. independent from the initialization time of the plug-in.
         * This means that the current renderer is returned immediately, if it
         * is already created (plug-in is loaded after renderer creation) or it
         * listens to the 'rendererCreated' event (plug-in is loaded
         * before the renderer is created).
         *
         *  @returns {object}
         *      a jQuery promise, resolved with the renderer instance, or
         *      rejected with an error message.
         */
        _getRenderer: function () {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                oRenderer;

            that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
            if (!that._oShellContainer) {
                oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
            } else {
                oRenderer = that._oShellContainer.getRenderer();
                if (oRenderer) {
                    oDeferred.resolve(oRenderer);
                } else {
                    // renderer not initialized yet, listen to rendererCreated event
                    that._onRendererCreated = function (oEvent) {
                        oRenderer = oEvent.getParameter("renderer");
                        if (oRenderer) {
                            oDeferred.resolve(oRenderer);
                        } else {
                            oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                        }
                    };
                    that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                }
            }
            return oDeferred.promise();
        },

        init: function () {
            var oAppLifeCycleService = sap.ushell.Container.getService("AppLifeCycle");

            oAppLifeCycleService.attachAppLoaded(function (oEvent) {
                if (oEvent.mParameters && oEvent.mParameters.componentInstance) {
                    sap.m.MessageToast.show(oEvent.mParameters.componentInstance.getId());
                }
            });

            this._getRenderer().fail(function (sErrorMessage) {
                jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
            })
            .done(function (oRenderer) {

                oRenderer.addHeaderEndItem(
                    "sap.ushell.ui.shell.ShellHeadItem", {
                        icon: sap.ui.core.IconPool.getIconURI("question-mark"),
                        press: function () {
                            var oCurrentApplication = oAppLifeCycleService.getCurrentApplication(),
                                sApplicationType = oCurrentApplication && oCurrentApplication.applicationType,
                                sHomePage = oCurrentApplication && oCurrentApplication.homePage ? "a" : "not a",
                                sComponentId = oCurrentApplication && oCurrentApplication.componentInstance && oCurrentApplication.componentInstance.sId;

                            sap.m.MessageToast.show("Component " + sComponentId + " of type " + sApplicationType + " is " + sHomePage + " homepage");
                        }
                    },
                    true,
                    false);
            });
        },

        exit: function () {
            if (this._oShellContainer && this._onRendererCreated) {
                this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
            }
        }
    });
})();