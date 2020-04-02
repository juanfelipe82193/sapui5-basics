//@ui5-bundle sap/ushell/plugins/rta/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/plugins/rta/Component.js":function(){// ${copyright}
sap.ui.define(["sap/ushell/plugins/BaseRTAPlugin"], function (BaseRTAPlugin) {
	"use strict";

	/*global sap */

	var RTAPlugin = BaseRTAPlugin.extend("sap.ushell.plugins.rta.Component", {
		sType: "rta",
		metadata: {
			manifest: "json"
		},

		init: function () {
			var oConfig = {
				sComponentName: "sap.ushell.plugins.rta",
				layer: "CUSTOMER",
				developerMode: false,
				id: "RTA_Plugin_ActionButton",
				text: "RTA_BUTTON_TEXT",
				icon: "sap-icon://wrench",
				visible: true
			};
			BaseRTAPlugin.prototype.init.call(this, oConfig);
		}

	});
	return RTAPlugin;

}, true /* bExport */);
},
	"sap/ushell/plugins/rta/manifest.json":'{\n\t"_version": "1.1.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "i18n/i18n.properties",\n\t\t"id": "sap.ushell.plugins.rta",\n\t\t"title": "{{APP_TITLE}}",\n\t\t"type": "component",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.0.0"\n\t\t},\n\t\t"ach": "CA-UI5-FL-RTA"\n\t},\n\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\n\t\t"technology": "UI5",\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": false,\n\t\t\t"phone": false\n\t\t}\n\t},\n\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"contentDensities": {\n\t\t\t"compact": true,\n\t\t\t"cozy": false\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version": "1.30.1",\n\t\t\t"libs": {\n\t\t\t\t"sap.ui.core": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.30.1"\n\t\t\t\t},\n\t\t\t\t"sap.ui.dt": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t},\n\t\t\t\t"sap.ui.rta": {\n\t\t\t\t\t"minVersion": "1.30.1",\n\t\t\t\t\t"lazy": true\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {\n\t\t\t"i18n": {\n\t\t\t\t"type": "sap.ui.model.resource.ResourceModel",\n\t\t\t\t"uri": "i18n/i18n.properties"\n\t\t\t}\n\t\t}\n\t},\n\t"sap.flp": {\n\t\t"type": "plugin"\n\t}\n}'
},"sap/ushell/plugins/rta/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/plugins/rta/Component.js":["sap/ushell/plugins/BaseRTAPlugin.js"]
}});
