//@ui5-bundle sap/ushell/demo/ContentProviderPlugin/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/ContentProviderPlugin/Component.js":function(){sap.ui.define( [
    "sap/ui/core/Component"
], function ( Component ) {
    "use strict";

    /* global Promise */

    var sNameSpace = "sap.ushell.demo.ContentProviderPlugin";
    var sComponentName = sNameSpace + ".Component";
    var oCdmSite = {
        "_version": "1.0.0",
        "site": {
            "identification": {
                "id": sComponentName,
                "namespace": "",
                "title": "will be translated",
                "description": "foo"
            },
            "payload": {
                "homeApp": {},
                "config": {},
                "groupsOrder": []
            }
        },
        "catalogs": {
            "3rdPartyCatalog1": {
                "identification": {
                    "id": "3rdPartyCatalog1",
                    "title": "{{catalog_title}}" // must be translated by plugin
                },
                "payload": {
                    "appDescriptors": [{
                        // IMPORTANT: do not include apps that are not in site.applications
                        "id": "sap.ushell.demo.AppNavSample"
                    }, {
                        "id": "3rdPartyApp1"
                    }, {
                        "id": "3rdPartyApp2"
                    }]
                }
            }
        },
        "applications": {
            // added via addTileToSite()
        },
        "groups": {
            // ignored
        },
        "systemAliases": {
            // ignored
        }
    };

    /**
     * Utility method that adds a tile to the site.
     *
     * @param {object} oSite
     *   The CDM site the tile should be added to
     *
     * @param {object} oTileConfig
     *   The tile configuration, e.g:
     *  <pre>
     *  {
     *      title: "My JAM Group",
     *      subtitle: "SAP JAM",    // optional
     *      icon: "",               // optional
     *      info: "",               // optional
     *      url: "https://jam4.sapjam.com/groups/about_page/7MFgdXHJVVv2BWC8g0Ubep",
     *      indicatorDataSource: {  // optional
     *          "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
     *          "refresh": 900
     *      }
     *  }
     *  </pre>
     */
    function addTileToSite(oSite, oTileConfig) {
        oSite.applications[oTileConfig.appId] = {
            "sap.app": {
                "id": oTileConfig.appId,
                "applicationVersion": {
                    "version": "1.0.0"
                },
                "title": oTileConfig.title,
                "subTitle": oTileConfig.subtitle,
                "info": oTileConfig.info,
                "crossNavigation": {
                    "inbounds": {
                        "Shell-launchURL": {
                            "semanticObject": "Shell",
                            "action": "launchURL",
                            "signature": {
                                "parameters": {
                                    "sap-external-url": {
                                        "required": true,
                                        // NOTE: the launcher value is copied to the tile (unlike a default value)
                                        "launcherValue": {
                                            "value": oTileConfig.url
                                        },
                                        // NOTE: the filter value is mandatory as otherwise all Shell-launchURL tiles
                                        // will be resolved to the same inbound which means, all are equal (same URL,
                                        // title, subtitle, icon, ...)
                                        "filter": {
                                            "value": oTileConfig.url,
                                            "format": "plain"
                                        }
                                    }
                                }
                            },
                            "indicatorDataSource": oTileConfig.indicatorDataSource
                        }
                    }
                }
            },
            "sap.ui": {
                "_version": "1.3.0",
                "technology": "URL",
                "icons": {
                    "icon": oTileConfig.icon
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                }
            },
            "sap.platform.runtime": {
                "uri": oTileConfig.url
            }
        };
    }

    return Component.extend(sComponentName, {

        metadata: {
            "manifest": "json"
        },

        init: function () {
            var oExtensionService = sap.ushell.Container.getService("ContentExtension");


            oExtensionService.registerContentProvider({
                id: sNameSpace,
                type: sap.ushell.services.ContentExtension.Type.SITE,
                provider: this
            });

        },
        getSite: function () {
            // at least the catalog title must be translated by the plugin!
            var sTranslatedCatalogTitle = this.getModel("i18n").getProperty("catalog_title");
            oCdmSite.catalogs["3rdPartyCatalog1"].identification.title = sTranslatedCatalogTitle;

            addTileToSite(oCdmSite, {
                appId: "3rdPartyApp1",
                title: "SAPUI5",
                subtitle: "SAP JAM",
                icon: "sap-icon://sap-ui5",
                info: "fake JAM",
                url: "https://jam4.sapjam.com/groups/about_page/7MFgdXHJVVv2BWC8g0Ubep"
            });

            addTileToSite(oCdmSite, {
                appId: "3rdPartyApp2",
                title: "P&I - Products & Innovation",
                subtitle: "SAP JAM",
                icon: "sap-icon://world",
                info: "fake JAM",
                url: "https://jam4.sapjam.com/groups/about_page/XVL4EFif3DZFfW0PQNf0Tt",
                indicatorDataSource: {
                    "path": "../../test/counts/count22.json",
                    "refresh": 900
                }
            });

            return new Promise(function (resolve, reject) {
                resolve(oCdmSite);
            });
        }
    });
} );
},
	"sap/ushell/demo/ContentProviderPlugin/i18n/i18n.properties":'plugin_title=3rd Party Catalog FLP Plugin\r\ncatalog_title=3rd Party Catalog from Plugin\r\n',
	"sap/ushell/demo/ContentProviderPlugin/manifest.json":'{\n    "sap.app": {\n        "id": "sap.ushell.demo.ContentProviderPlugin",\n        "type": "component",\n        "i18n": "i18n/i18n.properties",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{plugin_title}}"\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n        ]\n    },\n    "sap.ui5": {\n        "componentName": "sap.ushell.demo.ContentProviderPlugin",\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "settings": {\n                    "bundleName": "sap.ushell.demo.ContentProviderPlugin.i18n.i18n"\n                }\n            }\n        }\n    },\n    "sap.flp": {\n        "type": "plugin"\n    }\n}'
},"sap/ushell/demo/ContentProviderPlugin/Component-preload"
);
