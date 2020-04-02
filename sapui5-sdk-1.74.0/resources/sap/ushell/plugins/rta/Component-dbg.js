// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
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