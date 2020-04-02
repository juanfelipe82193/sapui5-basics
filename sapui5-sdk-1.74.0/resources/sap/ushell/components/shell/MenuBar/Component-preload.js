//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shellMenuBar/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.MenuBar.Component", {
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oMenuModel = new JSONModel();
            this.setModel(oMenuModel, "menu");

            sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getMenuEntries();
                })
                .then(function (aMenuEntries) {
                    oMenuModel.setProperty("/", aMenuEntries);
                });
        }
    });
});
},
	"sap/ushell/components/shellMenuBar/controller/MenuBar.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/ObjectPath",
    "sap/ushell/EventHub"
], function (Controller, JSONModel, ObjectPath, EventHub) {
    "use strict";

    /**
     * Controller of the MenuBar view.
     * It is responsible for changing the hash after selecting a Menu entry.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameter
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.shell.MenuBar.controller.MenuBar
     */

    return Controller.extend("sap.ushell.components.shell.MenuBar.controller.MenuBar" /** @lends sap.ushell.components.shell.MenuBar.controller.MenuBar.prototype */, {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and
         * initializes the view.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {
            this.oContainerRouter = sap.ushell.Container.getRenderer().getRouter();

            this.oContainerRouter.getRoute("home").attachMatched(this._selectIndexAfterRouteChange, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._selectIndexAfterRouteChange, this);

            this.oEventHubListener = EventHub.on("enableMenuBarNavigation").do(function (bEnableMenuBarNavigation) {
                this.getView().getModel("viewConfiguration").setProperty("/enableMenuBarNavigation", bEnableMenuBarNavigation);
            }.bind(this));

            var oViewConfiguration = new JSONModel({
                //We need to initialize with a non-empty key to avoid flickering of the selection.
                selectedKey: "None Existing Key",
                enableMenuBarNavigation: true
            });

            this.getView().setModel(oViewConfiguration, "viewConfiguration");

            this.oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

            this._selectIndexAfterRouteChange();
        },

        /**
         * Determines the selected menu entry with the required navigation action
         * according to the navigation type.
         *
         * @param {sap.ui.base.Event} event The event containing the selected menu intent
         *
         * @private
         * @since 1.72.0
         */
        onMenuItemSelection: function (event) {
            var sSelectedMenuEntryKey = event.getParameter("key");
            var oMenuModel = this.getView().getModel("menu");

            var oDestinationIntent = oMenuModel.getProperty("/").find(function (oMenuEntry) {
                return oMenuEntry.uid === sSelectedMenuEntryKey;
            });

            if (oDestinationIntent.type === "intent") {
                this._performCrossApplicationNavigation(oDestinationIntent.target);
            }

            if (oDestinationIntent.type === "url") {
                this._openURL(oDestinationIntent.target);
            }
        },

        /**
         * Performs a Cross Application Navigation to the provided intent using the
         * CrossApplicationNavigation service.
         *
         * @param {object} destinationTarget
         *  The destination target which is used for the Cross Application Navigation
         *
         * @returns {Promise<void>}
         *  A promise which is resolved after the CrossAppNavigation is performed
         *
         * @private
         * @since 1.74.0
         */
        _performCrossApplicationNavigation: function (destinationTarget) {
            return sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                var oParams = {};
                destinationTarget.parameters.forEach(function (oParameter) {
                    if (oParameter.name && oParameter.value) {
                        oParams[oParameter.name] = [oParameter.value];
                    }
                });

                oCANService.toExternal({
                    target: {
                        semanticObject: destinationTarget.semanticObject,
                        action: destinationTarget.action
                    },
                    params: oParams
                });
            });
        },

        /**
         * Opens the provided URL in a new browser tab.
         *
         * @param {object} destinationTarget
         *  The destination target which is used to determine the URL which should be
         *  opened in a new browser tab
         *
         * @private
         * @since 1.74.0
         */
        _openURL: function (destinationTarget) {
            window.open(destinationTarget.url, "_blank");
        },

        /**
         * Selects the right key according to the current hash.
         *
         * Gets the space and page id out of the current hash and selects key according to them.
         *
         * @returns {Promise<void>} a promise to wait for.
         *
         * @private
         * @since 1.72.0
         */
        _selectIndexAfterRouteChange: function () {
            var oViewConfigModel = this.getView().getModel("viewConfiguration");

            return this.oURLParsingService.then(function (urlParsingService) {
                var oHashParts = urlParsingService.parseShellHash(window.hasher.getHash());
                if (oHashParts.action === "home") {
                    oViewConfigModel.setProperty("/selectedKey", "");
                } else {
                    var sSelectedMenuKey = this._getMenuUID(ObjectPath.get("params.spaceId.0", oHashParts), ObjectPath.get("params.pageId.0", oHashParts));
                    if (sSelectedMenuKey) {
                        oViewConfigModel.setProperty("/selectedKey", sSelectedMenuKey);
                    } else {
                        oViewConfigModel.setProperty("/selectedKey", "None Existing Key");
                    }
                }
            }.bind(this));
        },

        /**
         * Searches the menu model to find the matching menu entry according
         * to the provided space and page id.
         *
         * @param {string} spaceId The space id
         * @param {string} pageId The page id
         *
         * @returns {(string|undefined)}
         *  The uid of the menu entry which matches the space & page id
         *
         * @private
         * @since 1.74.0
         */
        _getMenuUID: function (spaceId, pageId) {
            var aMenuEntries = this.getView().getModel("menu").getProperty("/");

            var oMatchedMenuEntry = aMenuEntries.find(function (oMenuEntry) {
                var oSpaceIdParam = oMenuEntry.target.parameters.find(function (oParameter) {
                    return oParameter.name === "spaceId" && oParameter.value === spaceId;
                });

                var oPageIdParam = oMenuEntry.target.parameters.find(function (oParameter) {
                    return oParameter.name === "pageId" && oParameter.value === pageId;
                });

                return oSpaceIdParam && oPageIdParam;
            });

            return oMatchedMenuEntry && oMatchedMenuEntry.uid;
        },

        /**
         * UI5 lifecycle method which is called upon controller destruction.
         * It detaches the router events and config listeners.
         *
         * @private
         * @since 1.74.0
         */
        onExit: function () {
            this.oEventHubListener.off();
        }
    });
});
},
	"sap/ushell/components/shellMenuBar/manifest.json":'{\n    "_version": "1.12.0",\n    "sap.app": {\n        "id": "sap.ushell.components.shell.MenuBar",\n\n        "applicationVersion": {\n            "version": "1.74.0"\n        },\n        "i18n": "../../../renderers/fiori2/resources/resources.properties",\n        "type": "component",\n        "title": "{{Component.MenuBar.Title}}"\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "rootView": {\n            "viewName": "sap.ushell.components.shell.MenuBar.view.MenuBar",\n            "type": "XML",\n            "async": true\n        },\n        "dependencies": {\n            "minUI5Version": "1.72",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    }\n}',
	"sap/ushell/components/shellMenuBar/view/MenuBar.view.xml":'<View xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    controllerName="sap.ushell.components.shell.MenuBar.controller.MenuBar">\n    <IconTabHeader showOverflowSelectList="true" items="{menu>/}" selectedKey="{viewConfiguration>/selectedKey}" select=".onMenuItemSelection">\n        <items>\n            <IconTabFilter text="{menu>title}" key="{menu>uid}" enabled="{viewConfiguration>/enableMenuBarNavigation}"/>\n        </items>\n    </IconTabHeader>\n</View>\n'
},"Component-preload"
);
