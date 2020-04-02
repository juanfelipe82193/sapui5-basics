//@ui5-bundle sap/ushell/plugins/appwarmup/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/plugins/appwarmup/Component.js":function(){// ${copyright}
sap.ui.define(["sap/ui/core/Component", "sap/ui/core/mvc/Controller", "sap/ui/core/service/ServiceFactory", "sap/ui/core/service/ServiceFactoryRegistry", "./ShellUIService", "sap/base/Log"], function (Component, Controller, ServiceFactory, ServiceFactoryRegistry, ShellUIService, Log) {
    "use strict";

    var ghostAppPath = sap.ui.require.toUrl("sap/ushell/plugins/ghostapp");

    var prerequireConfig = {
        "name": "sap.ushell.plugins.ghostapp",
        "manifest": true,
        "asyncHints": {
            "libs": [
            {
                "name": "sap.m"
            },
            {
                "name": "sap.ui.core"
            },
            {
                "name": "sap.f"
            },
            {
                "name": "sap.suite.ui.generic.template"
            },
            {
                "name": "sap.ui.comp"
            },
            {
                "name": "sap.ui.fl"
            },
            {
                "name": "sap.ui.generic.app"
            },
            {
                "name": "sap.ui.generic.template"
            },
            {
                "name": "sap.ui.table"
            },
            {
                "name": "sap.ui.unified"
            },
            {
                "name": "sap.uxap"
            },
            {
                "name": "sap.ui.layout"
            }
            ],
            // provide a cache key for metadata parsing, change when metadata changed
            "cacheTokens": {"dataSources": {"/ghostapp-c9f1f0bd-ff78-4660-9a1f-295814f00fe0/": "20180613155243"}},
            // tell flexibility there are no changes for this component
            "requests": [{
                "name": "sap.ui.fl.changes",
                "reference": "sap.ushell.plugins.ghostapp.Component"
            }],
            "waitFor": {}
        },
        "id": "sap.ushell.plugins.ghostapp",
        "componentData": {
            "startupParameters": {},
            "technicalParameters": {}
        },
        "async": true
    };

    var sComponentName = "sap.ushell.plugins.appwarmup.Component";
    return Component.extend(sComponentName, {

        metadata: {
            version: "${version}",
            library: "sap.ushell"
        },

        doWarmUp: function () {
            var aPromises = [];

            // substitute real metadata URL with app local metadata
            aPromises.push(new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ui/model/odata/ODataMetadata"], function (ODataMetadata) {
                    var fnOrig = ODataMetadata.prototype._loadMetadata;
                    ODataMetadata.prototype._loadMetadata = function (sUrl, bSuppressEvents) {
                        if (this.sUrl && this.sUrl.startsWith("/ghostapp-c9f1f0bd-ff78-4660-9a1f-295814f00fe0/$metadata")) {
                            this.sUrl = ghostAppPath + "/metadata.xml";
                            // restore the original function
                            ODataMetadata.prototype._loadMetadata = fnOrig;
                        }
                        return fnOrig.call(this, sUrl, bSuppressEvents);
                    };
                    resolve();
                }, reject);
            }));

            Promise.all(aPromises).then(function () {
                ServiceFactoryRegistry.register("sap.ushell.plugins.appwarmup.ShellUIService", new ServiceFactory(ShellUIService));
                return Component.create(prerequireConfig);
            }).then(function (dummyComponent) {
                // add interrupt check here
                var hiddenPlaceholder = document.createElement("div");
                hiddenPlaceholder.style.visibility = "hidden";
                document.body.appendChild(hiddenPlaceholder);

                sap.ui.require(["sap/ui/core/ComponentContainer"], function (ComponentContainer) {
                   Controller.registerExtensionProvider();
                    var cc = new ComponentContainer();
                    cc.setComponent(dummyComponent);
                    cc.placeAt(hiddenPlaceholder);
                    cc.addEventDelegate({
                        onAfterRendering: function () {
                            setTimeout(function () {
                                dummyComponent.destroy();
                            }, 5000);
                        }
                    });
                });
            }).catch(function () {
                Log.error("GhostApp component could not be created", null, this);
            });

        },

        init: function () {

            this.doWarmUp();

        }

    });

});
},
	"sap/ushell/plugins/appwarmup/ShellUIService.js":function(){/**
 * Dummy Implementation for the ShellUIService. This service implementation
 * is used to suppress the interaction with the shell when using the application
 * warmup plugin.
 */
sap.ui.define(['sap/ui/core/service/Service'], function(Service) {
    "use strict";
    return Service.extend("sap.ushell.plugins.appwarmup.ShellUIService", {
        setTitle: function() {
            return;
        },
        setHierarchy: function() {
            return;
        },
        setBackNavigation: function() {
            return;
        },
        getTitle: function() {
            return;
        },
        setRelatedApps: function() {
            return;
        },
        getUxdVersion: function() {
            return 1;
        }
    });
});
},
	"sap/ushell/plugins/appwarmup/manifest.json":'{\n\t"_version": "1.1.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"id": "sap.ushell.plugins.appwarmup",\n\t\t"type": "component",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.0.0"\n\t\t}\n\t},\n\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\n\t\t"technology": "UI5",\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": false,\n\t\t\t"phone": false\n\t\t}\n\t},\n\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"contentDensities": {\n\t\t\t"compact": true,\n\t\t\t"cozy": false\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version": "1.54.0",\n\t\t\t"libs": {\n\t\t\t\t"sap.ui.core": {\n\t\t\t\t\t"minVersion": "1.54.0"\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t"sap.flp": {\n\t\t"type": "plugin"\n\t}\n}'
},"sap/ushell/plugins/appwarmup/Component-preload"
);
