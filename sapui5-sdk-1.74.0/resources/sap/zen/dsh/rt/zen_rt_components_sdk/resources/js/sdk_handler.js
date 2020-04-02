define("zen.rt.components.sdk/resources/js/sdk_handler", ["sap/zen/basehandler", "./sdkcontrol"], function(BaseHandler, SdkControl){
	"use strict";


	var AdapterControl = SdkControl.extend("sap.designstudio.sdk.AdapterControl", {
		// the control API:
		metadata: {
			properties: {
				"width": {
					type: "sap.ui.core.CSSSize"
				},
				"height": {
					type: "sap.ui.core.CSSSize"
				},
			},
			aggregations: {}
		},
	
		// the part creating the HTML:
		renderer: function(oRm, oControl) { // static function, so use the given
			// "oControl" instance instead of
			// "this" in the renderer function
	
			jQuery.sap.log.debug("render", "enter", "sdk");
	
			oRm.write("<div");
			oRm.writeControlData(oControl); // writes the Control ID and enables
			// event handling - important!
			oRm.addStyle("width", oControl.getWidth()); // write the Control
			// property size; the
			// Control has vapageIdated it
			// to be a CSS size
			oRm.addStyle("height", oControl.getHeight());
	
			oRm.writeStyles();
			oRm.writeClasses(); // there is no class to write, but this enables
			// support for ColorBoxContainer.addStyleClass(...)
			oRm.write(">");
	
			oRm.write("</div>"); // end of inner container
	
			jQuery.sap.log.debug("render", "leave", "sdk");
	
		},
		onAfterRendering: function() {
			// Only relevant after create or when UI deleted the control
			if (this.widget) {
				this.widget.init();
				this.dispatchProperties(this.widget.oControlProperties, this.widget.oComponentProperties);
			}
		}
	});
	
	
	
	
	
	var Handler = function() {
	
		BaseHandler.apply(this, arguments);
	
		this.create = function(oChainedControl, oControlProperties, oComponentProperties) {
			var id = oControlProperties["id"];
	
			var oControl = new AdapterControl(id);
			oControl.storeProperties(oControlProperties, oComponentProperties);
	
			return oControl;
		};
	
		this.update = function(oControl, oControlProperties, oComponentProperties) {
			oControl.dispatchProperties(oControlProperties, oComponentProperties);
			return oControl;
		};
	
		this.advancedPropertyCall = function(oControl) {
			return oControl.advancedPropertyCall.apply(oControl, arguments);
		};
	
		var super_remove = this.remove;
		this.remove = function(oControl) {
			oControl.widget.componentDeleted();
			super_remove.apply(this, arguments);
		};
		
		this.getType = function() {
			return "sdk";
		};
		
		this.getDecorator = function() {
			return "SdkControlDecorator";
		};
		
		this.getClass = function() {
			return Handler;
		};
	
	};
	return new Handler();
});
