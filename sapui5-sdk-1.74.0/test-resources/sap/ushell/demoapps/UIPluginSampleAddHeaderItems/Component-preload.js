//@ui5-bundle sap/ushell/demo/UIPluginSampleAddHeaderItems/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/UIPluginSampleAddHeaderItems/Component.js":function(){sap.ui.define([
    "sap/ui/core/Component"
], function (Component) {

    "use strict";
    var S_COMPONENT_NAME = "sap.ushell.demo.UIPluginSampleAddHeaderItems";

    return Component.extend(S_COMPONENT_NAME + ".Component", {


        metadata: {
            manifest: "json"
        },


        /**
         * Returns the shell renderer instance in a reliable way,
         * i.e. independent from the initialization time of the plug-in.
         * This means that the current renderer is returned immediately, if it
         * is already created (plug-in is loaded after renderer creation) or it
         * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
         * before the renderer is created).
         *
         *  @returns {object}
         *      a jQuery promise, resolved with the renderer instance, or
         *      rejected with an error message.
         */
        _getRenderer: function () {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                oShellContainer,
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
            var that = this;

            this._getRenderer().fail(function (sErrorMessage) {
                jQuery.sap.log.error(sErrorMessage, undefined, S_COMPONENT_NAME);
            })
                .done(function (oRenderer) {
                    var bFull = jQuery.sap.getUriParameters().get("plugin-full");
                    if (bFull) {
                        oRenderer.addSubHeader("sap.m.Bar",
                            {
                                contentLeft  : [new sap.m.Button({
                                    text: "Button left"
                                })],
                                contentRight : [new sap.m.Button({
                                    text: "Button right"
                                })],
                                contentMiddle: [new sap.m.Button({
                                    text: "Button center"
                                })]
                            }, true, true);
                        oRenderer.setFooterControl("sap.m.Bar",
                            {
                                contentLeft  : [new sap.m.Button({
                                    text: "Button left"
                                })],
                                contentRight : [new sap.m.Button({
                                    text: "Button right"
                                })],
                                contentMiddle: [new sap.m.Button({
                                    text: "Button center"
                                })]
                            }, true, true);

                        var button1 = new sap.ushell.ui.shell.ToolAreaItem({
                            icon: "sap-icon://business-card"
                        });
                        oRenderer.showToolAreaItem(button1.getId(), false, ["home", "app"]);

                        oRenderer.setHeaderTitle("Custom Header Title");

                        oRenderer.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
                            id  : "testBtn",
                            icon: "sap-icon://pdf-attachment"
                        }, true, true);

                        oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                            id  : "testBtn1",
                            icon: "sap-icon://documents"
                        }, true, true);

                        oRenderer.addActionButton("sap.m.Button", {
                            id  : "testBtn3",
                            text: "Custom button",
                            icon: "sap-icon://action"
                        }, true, true);

                        var oEntry = {
                            title  : "My custom settings",
                            icon   : "sap-icon://wrench",
                            value  : function () {
                                return jQuery.Deferred().resolve("more specific description");
                            },
                            content: function () {
                                return jQuery.Deferred().resolve(new sap.m.Panel({
                                    content: [
                                        new sap.m.VBox({
                                            items: [
                                                new sap.m.Label({text: "Some feature switch"}),
                                                new sap.m.Switch("userPrefEntryButton")
                                            ]
                                        })
                                    ]
                                }));
                            },
                            onSave : function () {
                                return jQuery.Deferred().resolve();
                            }
                        };
                        oRenderer.addUserPreferencesEntry(oEntry);
                        return;
                    }
                    var oPluginParameters = that.getComponentData().config, // obtain plugin parameters
                        sRendererExtMethod;

                    if (oPluginParameters.position === "end") {
                        sRendererExtMethod = "addHeaderEndItem";
                    } else if (oPluginParameters.position === "begin") {
                        sRendererExtMethod = "addHeaderItem";
                    } else {
                        jQuery.sap.log.warning("Invalid 'position' parameter, must be one of <begin, end>. Defaulting to 'end'.", undefined, S_COMPONENT_NAME);
                        sRendererExtMethod = "addHeaderEndItem";
                    }

                    if (typeof oRenderer[sRendererExtMethod] === "function") {
                        oRenderer[sRendererExtMethod](
                            "sap.ushell.ui.shell.ShellHeadItem", {
                                tooltip: oPluginParameters.tooltip || "",
                                ariaLabel: oPluginParameters.tooltip || "",
                                icon   : sap.ui.core.IconPool.getIconURI(oPluginParameters.icon || "question-mark"),
                                press  : function () {
                                    sap.m.MessageToast.show(oPluginParameters.message || "Default Toast Message");
                                }
                            },
                            true,
                            false);
                    } else {
                        jQuery.sap.log.error("Extension method '" + sRendererExtMethod + "' not supported by shell renderer", undefined, S_COMPONENT_NAME);
                        return;
                    }
                });
        },

        exit: function () {
            if (this._oShellContainer && this._onRendererCreated) {
                this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
            }
        }

    })
});
},
	"sap/ushell/demo/UIPluginSampleAddHeaderItems/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "_version": "1.1.0",\n        "i18n": "messagebundle.properties",\n        "id": "sap.ushell.demo.UIPluginSampleAddHeaderItems",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "Shell-plugin" :{\n                    "semanticObject": "Shell",\n                    "action": "plugin",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "componentName": "sap.ushell.demo.UIPluginSampleAddHeaderItems",\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    },\n    "sap.flp": {\n        "type": "plugin"\n    }\n}\n',
	"sap/ushell/demo/UIPluginSampleAddHeaderItems/messagebundle.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=UI Plugin Sample\r\n\r\n# XTXT: description\r\ndescription=Sample Plugin for UI\r\n'
},"sap/ushell/demo/UIPluginSampleAddHeaderItems/Component-preload"
);
