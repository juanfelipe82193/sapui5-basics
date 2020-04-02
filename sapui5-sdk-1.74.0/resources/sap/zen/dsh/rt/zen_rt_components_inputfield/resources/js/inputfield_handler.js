define("zen.rt.components.inputfield/resources/js/inputfield_handler", ["sap/zen/basehandler"], function(BaseHandler){

	BaseHandler.apply(this, arguments);
	
	var InputFieldHandler = function() {
		"use strict";
	
		sap.zen.BaseHandler.apply(this, arguments);
	
		var that = this;
	
		this.init = function(oControl, oControlProperties) {
	
			oControl.setValue(oControlProperties.value);
			oControl.setEnabled(oControlProperties.enabled);
			oControl.setEditable(oControlProperties.editable);
			oControl.setTooltip(oControlProperties.tooltip);
		}
		
		this.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
	
			var oControl = this.createDefaultProxy(id);
			this.init(oControl, oControlProperties);
			
			if(oControlProperties.command){
				oControl.attachChange(function(event){
					var value= event.getParameter("newValue")
					var command = that.prepareCommand(oControlProperties.command,"__VALUE__", value)
					eval(command);
				});
			}
			
			
			return oControl;
		};
	
		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				this.init(oControl, oControlProperties);
			}
			return oControl;
		};
		
		this.getDefaultProxyClass = function(){
			return ["sap.m.Input", "sap.ui.commons.TextField"];
		};

		this.getDecorator = function() {
			return "FixedHeightDecorator";
		};
		
		this.getType = function() {
			return "inputfield";
		};
	};

	return new InputFieldHandler();
});
