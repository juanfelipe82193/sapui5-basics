//Generic runtime component 

sap.ui.define('sap.apf.withServer.cloudFoundry.runtime.Component', [
	'sap/apf/base/Component'
], function(BaseComponent) {
	"use strict";

	function runningOnCF () {
		return true;
	}
	var Component = BaseComponent.extend("sap.apf.withServer.cloudFoundry.runtime.Component", {
		name: "sap.apf.withServer.cloudFoundry.runtime",
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
