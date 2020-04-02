//@ui5-bundle sap_ushell_demotiles_abap_customTileDynamic/Component-h2-preload.js
sap.ui.require.preload({
	"sap_ushell_demotiles_abap_customTileDynamic/Component.js":function(){// ${copyright}
(function () {
    "use strict";
    /* global jQuery, sap, window */


    /*************************************
     *
     * THIS COMPONENT IS ONLY NEEDED IN ORDER TO MAKE THE BUILD STEP FOR
     * ZIPPING / COMPONENT-PRELOAD BUILDING WORK!
     * LATER THE GENERATED ZIP WILL BE AUTOMATICALLY UPLOADED TO BSP REPOSITORY
     *
    *************************************/

    jQuery.sap.declare("sap_ushell_demotiles_abap_customTileDynamic.Component");

    sap.ui.define([
        "sap/ui/core/UIComponent"
    ], function (UIComponent) {
        return UIComponent.extend("sap_ushell_demotiles_abap_customTileDynamic.Component", {
            metadata: {
                "manifest": "json"
            },

            // new API
            tileSetVisible: function (bNewVisibility) {
                // forward to controller
                this._controller.visibleHandler(bNewVisibility);
            },

            // new API
            tileRefresh: function () {
                // forward to controller
                this._controller.refreshHandler(this._controller);
            },

            // new API
            tileSetVisualProperties: function (oNewVisualProperties) {
                // forward to controller
                this._controller.setVisualPropertiesHandler(oNewVisualProperties);
            },

            createContent: function () {
                var oTile = sap.ui.view({
                    viewName: "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",
                    type: sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
    });

}());
},
	"sap_ushell_demotiles_abap_customTileDynamic/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap_ushell_demotiles_abap_customTileDynamic",\n        "_version": "1.0.0",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "Custom Dynamic App Launcher",\n        "description": "Custom Tile",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-UI2-INT-FE"\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap_ushell_demotiles_abap_customTileDynamic",\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "rootView": {\n            "viewName": "sap_ushell_demotiles_abap_customTileDynamic.DynamicTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    }\n}'
},"sap_ushell_demotiles_abap_customTileDynamic/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.controller.js":["sap/ushell/components/tiles/utils.js"],
"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.view.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/Dialog.js","sap/m/HBox.js","sap/m/Input.js","sap/m/Label.js","sap/m/MessageStrip.js","sap/ui/commons/Button.js","sap/ui/commons/ComboBox.js","sap/ui/commons/TextField.js","sap/ui/commons/layout/MatrixLayout.js","sap/ui/commons/layout/MatrixLayoutCell.js","sap/ui/commons/layout/MatrixLayoutRow.js","sap/ui/core/Title.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/ResponsiveFlowLayout.js","sap/ui/layout/form/SimpleForm.js","sap/ui/table/Column.js","sap/ui/table/Table.js","sap/ushell/demotiles/abap/customTileDynamic/Configuration.controller.js"],
"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.controller.js":["sap/ui/thirdparty/datajs.js","sap/ushell/Config.js","sap/ushell/components/applicationIntegration/AppLifeCycle.js","sap/ushell/components/tiles/utils.js","sap/ushell/components/tiles/utilsRT.js","sap/ushell/services/AppType.js"],
"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.view.js":["sap/m/GenericTile.js"]
}});
