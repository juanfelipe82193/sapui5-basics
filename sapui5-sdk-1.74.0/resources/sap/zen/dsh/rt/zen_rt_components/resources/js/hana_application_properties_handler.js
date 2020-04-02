sap.zen.Application_properties = function () {
	"use strict";

	sap.zen.BaseHandler.apply(this, arguments);

	this.createAndAdd = function (oChainedControl, oControlProperties) {
		var customcss = oControlProperties.customCss;
		
		
		if(customcss) {
			if(document.createStyleSheet) {
				document.createStyleSheet(customcss);
			} else {
				$("head").append($("<link rel='stylesheet' href='"+customcss+"' type='text/css' media='screen' />"));
			}
		}
		
		return null;
};

	this.updateComponent = function () {
		return null;
	};


};

sap.zen.Application_properties.instance = new sap.zen.Application_properties();

sap.zen.Dispatcher.instance.addHandlers("application_properties", sap.zen.Application_properties.instance, "Decorator");
