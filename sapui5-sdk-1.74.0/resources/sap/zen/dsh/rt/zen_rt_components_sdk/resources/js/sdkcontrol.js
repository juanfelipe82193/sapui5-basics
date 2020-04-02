define("zen.rt.components.sdk/resources/js/sdkcontrol", [], function(){
	"use strict";
	
	function resolvePath(sClass) {
		if (!sClass)
			return undefined;
		var aPath = sClass.split(".");
		var oResolvedPath = window;
		for ( var i = 0; i < aPath.length; i++) {
			var sOnePathPart = aPath[i];
			oResolvedPath = oResolvedPath[sOnePathPart];
			if(!oResolvedPath){
				break;
			}
		}
		return oResolvedPath;		
	}
	
	return sap.ui.core.Control.extend("sap.designstudio.sdk.SdkControl", {
		// the control API:
		metadata: {
		},
		init: function() {
			// 
		},
		storeProperties: function(oControlProperties, oComponentProperties) {
			var handler = resolvePath(oControlProperties["handler_name"]);
			if (handler) {
				this.widget = new handler(this);
				this.widget.oControlProperties = oControlProperties;
				this.widget.oComponentProperties = oComponentProperties;
				
			}
	
		},
		dispatchProperties: function(oControlProperties, oComponentProperties) {
			this.widget.dispatchProperties(oControlProperties, oComponentProperties);
		},
	
		// the part creating the HTML:
		renderer: function() { // static function, so use the given
		},
		advancedPropertyCall: function() {
			var funcName = arguments[1];
			var func = this.widget[funcName];
			if (func) {
				var realArguments = Array.prototype.slice.apply(arguments); // First convert to normal array
				realArguments = realArguments.slice(2); // now cut the non-needed stuff
				return func.apply(this.widget, realArguments);
			}
			return null;
		},
		getDecorator: function() {
			if (this.widget && this.widget.getDecorator) {
				return  this.widget.getDecorator();
			}
		}
	
	});
});

