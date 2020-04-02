//@ui5-bundle sap/ushell/plugins/rta-personalize/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/plugins/rta-personalize/Component.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/util/UriParameters",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Component",
    "sap/ui/fl/Utils",
    "sap/ui/fl/EventHistory",
    "sap/ushell/plugins/BaseRTAPlugin"
], function (
    UriParameters,
    MessageBox,
    MessageToast,
    Component,
    FlexUtils,
    EventHistory,
    BaseRTAPlugin
) {
    "use strict";

    var sButtonId = "PERSONALIZE_Plugin_ActionButton";

    var RTAPlugin = BaseRTAPlugin.extend("sap.ushell.plugins.rta-personalize.Component", {
        sType: "rta-personalize",

        metadata: { manifest: "json" },

        init: function () {
            var oConfig = {
                sComponentName: "sap.ushell.plugins.rta-personalize",
                layer: "USER",
                developerMode: false,
                id: sButtonId,
                text: "PERSONALIZE_BUTTON_TEXT",
                icon: "sap-icon://edit",
                visible: false
            };

            BaseRTAPlugin.prototype.init.call(this, oConfig);
            this._checkForEnabledControls();
        },

        removePersonalizableControl: function (oControl) {
            var iIndex = this._aPersonalizableControls.indexOf(oControl);
            this._aPersonalizableControls.splice(iIndex, 1);
            this._aOriginalFooterVisibility.splice(iIndex, 1);
            if (this._aPersonalizableControls.length === 0) {
                this._oObserver.disconnect();
                delete this._oObserver;
                this._adaptButtonVisibility(sButtonId, false);
            }
        },

        _checkForEnabledControls: function () {
            this._aPersonalizableControls = [];
            this._aOriginalFooterVisibility = [];

            function addPersonalizableControl (oControl) {
                if (this._aPersonalizableControls.indexOf(oControl) === -1) {
                    this._aPersonalizableControls.push(oControl);
                    this._adaptButtonVisibility(sButtonId, this._checkUI5App());
                }
            }

            function onPersonalizableControlRendered (sChannelId, sEventId, vControl) {
                if (FlexUtils.checkControlId(vControl)) {
                    var oControl = this._getControlInstance(vControl);
                    addPersonalizableControl.call(this, oControl);
                    if (!this._oObserver) {
                        this._oObserver = new MutationObserver(function (mutations) {
                            this._aPersonalizableControls.forEach(function (oPersonalizableControl) {
                                if (!oPersonalizableControl.getDomRef()) {
                                    this.removePersonalizableControl(oPersonalizableControl);
                                }
                            }.bind(this));
                        }.bind(this));
                        var oObserverConfig = {
                            attributes: true,
                            childList: true,
                            characterData: false,
                            subtree: true,
                            attributeFilter: ["style", "class"]
                        };
                        this._oObserver.observe(window.document, oObserverConfig);
                    }
                }
            }

            sap.ui.getCore().getEventBus().subscribe("sap.ui", "ControlForPersonalizationRendered", onPersonalizableControlRendered, this);
            var aEvents = EventHistory.getHistoryAndStop("ControlForPersonalizationRendered");
            aEvents.forEach(function (oEvent) {
                onPersonalizableControlRendered.call(this, oEvent.channelId, oEvent.eventId, oEvent.parameters);
            }.bind(this));
        },

        _getControlInstance: function (vElement) {
            if (typeof vElement === "string") {
                var oElement = sap.ui.getCore().byId(vElement);
                return oElement || Component.get(vElement);
            }
            return vElement;
        },

        _onAppLoaded: function () {
            // remove all personalizable controls if a new app is loaded and hide the button
            // the listener for such controls is already active at this point
            var iLength = this._aPersonalizableControls.length;
            for (var i = iLength; i > 0; i--) {
                this.removePersonalizableControl(this._aPersonalizableControls[i - 1]);
            }
        },

        /**
         * This function is called when the start event of RTA was fired
         *
         * @param {sap.ui.base.Event} oEvent the RTA start event
         * @private
         * @override
         */
        _onStartHandler: function (oEvent) {
            var iEditablePlugins = oEvent.getParameter("editablePluginsCount");
            if (iEditablePlugins !== undefined && iEditablePlugins <= 0) {
                MessageBox.information(this.i18n.getText("MSG_STARTUP_NO_OVERLAYS"), {
                    onClose: function () {
                        this._stopRta(/*bDontSaveChanges = */true, /*bSkipCheckPersChanges = */true);
                    }.bind(this)
                });
            }
        },

        /**
         * This function should be used when custom plugins are needed
         *
         * @param {sap.ui.rta.RuntimeAuthoring} oRTA Instance of RuntimeAuthoring
         * @private
         * @override
         */
        _loadPlugins: function (oRTA) {
            // only require the needed plugins when RTA is started
            var oPromise = new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ui/rta/plugin/EasyAdd",
                    "sap/ui/rta/plugin/EasyRemove"
                ], function (EasyAddPlugin, EasyRemovePlugin) {
                    var mPlugins = oRTA.getDefaultPlugins(),
                        oRemovePlugin = mPlugins.remove;
                    mPlugins.remove = new EasyRemovePlugin({ commandFactory: oRemovePlugin.getCommandFactory() });

                    var oAdditionalElementsPlugin = mPlugins.additionalElements;
                    mPlugins.additionalElements = new EasyAddPlugin({
                        commandFactory: oAdditionalElementsPlugin.getCommandFactory(),
                        analyzer: oAdditionalElementsPlugin.getAnalyzer(),
                        dialog: oAdditionalElementsPlugin.getDialog()
                    });

                    mPlugins.contextMenu.setOpenOnClick(false);

                    oRTA.setPlugins(mPlugins);
                    resolve();
                });
            });
            return oPromise;
        },

        /**
         * Event handler for the "Adapt" button of the RTA FLP Plugin
         *
         * @param {sap.ui.base.Event} oEvent the button click event
         * @private
         * @override
         */
        _onAdapt: function (oEvent) {
            if (!this._checkFlexEnabledOnStart()) {
                this._handleFlexDisabledOnStart();
            } else if (oEvent.getSource().getText() === this.i18n.getText("PERSONALIZE_BUTTON_TEXT")) {
                var oUriParams = UriParameters.fromURL(window.location.href),
                    sSapUiLayer = oUriParams.mParams["sap-ui-layer"] && oUriParams.mParams["sap-ui-layer"][0];
                if (!sSapUiLayer || sSapUiLayer === "USER") {
                    oEvent.getSource().setText(this.i18n.getText("END_PERSONALIZE_BUTTON_TEXT"));

                    this._adaptButtonVisibility("RTA_Plugin_ActionButton", false);

                    // Store the original values for the Footer Visibility
                    this._aPersonalizableControls.forEach(function (oControl) {
                        if (oControl.setShowFooter) {
                            this._aOriginalFooterVisibility.push(oControl.getShowFooter());
                        } else {
                            this._aOriginalFooterVisibility.push(undefined);
                        }
                    }.bind(this));

                    this._adaptFooterVisibility(false);

                    var oSearchButton = this._getFlpSearchButton();
                    this._bOriginalSearchButtonVisibility = oSearchButton && oSearchButton.getVisible();
                    if (this._bOriginalSearchButtonVisibility) {
                        this._adaptButtonVisibility(oSearchButton, false);
                    }

                    BaseRTAPlugin.prototype._onAdapt.call(this, oEvent);
                } else {
                    MessageBox.information(this.i18n.getText("MSG_STARTUP_WRONG_LAYER"));
                }
            } else {
                this._stopRta(/*bDontSaveChanges = */false, /*bSkipCheckPersChanges = */true);
            }
        },

        /**
         * Leaves the RTA adaption mode and destroys the RTA
         *
         * @private
         * @override
         */
        _switchToDefaultMode: function () {
            sap.ui.getCore().byId(sButtonId).setText(this.i18n.getText("PERSONALIZE_BUTTON_TEXT"));

            this._adaptButtonVisibility("RTA_Plugin_ActionButton", true);
            this._adaptFooterVisibility(true);

            if (this._bOriginalSearchButtonVisibility !== undefined) {
                this._adaptButtonVisibility(this._getFlpSearchButton(), this._bOriginalSearchButtonVisibility);
                delete this._bOriginalSearchButtonVisibility;
            }

            MessageToast.show(this.i18n.getText("SAVE_SUCCESSFUL"), {
                duration: 4000,
                offset: "0 -50"
            });

            BaseRTAPlugin.prototype._switchToDefaultMode.call(this);
        },

        /**
         * Checks if RTA needs to be restarted, e.g after 'Reset to default'
         *
         * @private
         * @override
         */
        _checkRestartRTA: function () {
        },

        /**
         * Sets the Footer visibility of the personalizable Controls
         *
         * @param {boolean} bVisible new visibility of the Footer
         * @private
         */
        _adaptFooterVisibility: function (bVisible) {
            this._aPersonalizableControls.forEach(function (oControl, iIndex) {
                if (this._aOriginalFooterVisibility[iIndex]) {
                    oControl.setShowFooter(bVisible);
                }
            }.bind(this));
        },

        _getFlpSearchButton: function () {
            return this.oRenderer.getRootControl().getOUnifiedShell().getHeader().getHeadEndItems()[0];
        },

        _getFLPViewPort: function () {
            return sap.ui.getCore().byId("viewPortContainer");
        }
    });

    return RTAPlugin;
});
},
	"sap/ushell/plugins/rta-personalize/manifest.json":'{\n\t"_version": "1.1.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "i18n/i18n.properties",\n\t\t"id": "sap.ushell.plugins.rta-personalize",\n\t\t"title": "{{APP_TITLE}}",\n\t\t"type": "component",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.0.0"\n\t\t},\n\t\t"ach": "CA-UI5-FL-RTA"\n\t},\n\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\t\t"technology": "UI5",\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": false,\n\t\t\t"phone": false\n\t\t}\n\t},\n\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"contentDensities": {\n\t\t\t"compact": true,\n\t\t\t"cozy": false\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version": "1.30.1",\n\t\t\t"libs": {\n\t\t\t\t"sap.ui.core": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.ui.dt": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t},\n\t\t\t\t"sap.ui.rta": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {\n\t\t\t"i18n": {\n\t\t\t\t"type": "sap.ui.model.resource.ResourceModel",\n\t\t\t\t"uri": "i18n/i18n.properties"\n\t\t\t}\n\t\t}\n\t},\n\t"sap.flp": {\n\t\t"type": "plugin"\n\t}\n}'
},"sap/ushell/plugins/rta-personalize/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/plugins/rta-personalize/Component.js":["sap/base/util/UriParameters.js","sap/m/MessageBox.js","sap/m/MessageToast.js","sap/ui/core/Component.js","sap/ui/fl/EventHistory.js","sap/ui/fl/Utils.js","sap/ushell/plugins/BaseRTAPlugin.js"]
}});
