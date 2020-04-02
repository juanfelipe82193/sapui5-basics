//Generic modeler component 

sap.ui.define('sap.apf.withServer.cloudFoundry.modeler.Component', [
	'sap/apf/modeler/Component'
], function(ModelerComponent) {
	"use strict";

	function runningOnCF () {
		return true;
	}
	var Component = ModelerComponent.extend("sap.apf.withServer.cloudFoundry.modeler.Component", {
		name: "sap.apf.withServer.cloudFoundry.modeler",
		manifest: true,
		metadata: {
			manifest: "json"
		},
		getInjections : function() {
			return {
				functions: {
					isUsingCloudFoundryProxy: runningOnCF
				}
			};
		}
	});
	return Component;

}, true);
