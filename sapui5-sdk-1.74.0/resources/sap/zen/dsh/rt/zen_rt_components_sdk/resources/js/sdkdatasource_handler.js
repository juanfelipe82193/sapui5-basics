define("zen.rt.components.sdk/resources/js/sdkdatasource_handler", ["./sdk_handler", "./sdkcontrol"], function(sdkHandler, SdkControl){
	"use strict";


	var DatasourceHandler = function() {
		"use strict";
	
		sdkHandler.getClass().apply(this, arguments);
	
		this.create = function(oChainedControl, oControlProperties, oComponentProperties) {
			var id = oControlProperties["id"];
	
			var oControl = new SdkControl(id);
			oControl.storeProperties(oControlProperties, oComponentProperties);
			oControl.widget.init();
			oControl.widget.dispatchProperties(oControlProperties, oComponentProperties);
	
			return oControl;
		};
		
		this.getType = function() {
			return "sdkdatasource";
		};
	};
	
	return new DatasourceHandler();

});
