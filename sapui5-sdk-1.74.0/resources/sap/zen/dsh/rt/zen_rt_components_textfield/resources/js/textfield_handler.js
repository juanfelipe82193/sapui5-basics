define("zen.rt.components.textfield/resources/js/textfield_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	
	/**************************************************************************************************************************************
	 * TextField Handler
	 **************************************************************************************************************************************/
	var TextFieldHandler = function() {
		"use strict";
	
		BaseHandler.apply(this, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
		
		var that = this;
		
		/**
		 * Create the Control
		 */
		this.create = function(oChainedControl, oControlProperties) {
			$.sap.require("sap.ui.core.format.DateFormat");
			
			// create the UI5 Text Control
			var loControl = this.createTextWithHeight(oControlProperties["id"]);
			this.init(loControl, oControlProperties);
			
			loControl.attachBrowserEvent("click", function(){
				eval(oControlProperties.onclick);
			});
			
			return loControl;
		};
	
		/**
		 * Update the Control
		 */
		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				this.init(oControl, oControlProperties);
			}
			
			return oControl;
		};
	
		/**
		 * Initialize the Control (Create, Update)
		 */
		this.init = function(oControl, oControlProperties) {
			oControl.setCssStyle(oControlProperties.cssStyle);
			oControl.setTooltip(oControlProperties.tooltip);
			
			var lText = dispatcher.getValue(oControlProperties, "text");		
			if (oControlProperties.text.dataType) {
				lText = sap.buddha.XJsUI5Utils.formatDateTimeValue(lText, oControlProperties.text.dataType, oControlProperties.text.UTC, "medium");
			}
			oControl.setText(lText);
			
			if(oControlProperties.onclick){
				oControl.addStyleClass("zenClickable");
			}
			if(sap.zen.Dispatcher.instance.isMainMode()){
				oControl.addStyleClass("zenTextField" + oControlProperties.style)
			}else{
				if (oControlProperties.style === "STANDARD") {
					oControl.setDesign(sap.ui.commons.TextViewDesign.Standard);
				} else if (oControlProperties.style === "HEADING1") {
					oControl.setDesign(sap.ui.commons.TextViewDesign.H1);
				} else if (oControlProperties.style === "HEADING2") {
					oControl.setDesign(sap.ui.commons.TextViewDesign.H2);
				} else if (oControlProperties.style === "HEADING3") {
					oControl.setDesign(sap.ui.commons.TextViewDesign.H3);
				} else if (oControlProperties.style === "HEADING4") {
					oControl.setDesign(sap.ui.commons.TextViewDesign.H4);
				}
				
			}
		}
		
		this.getDate = function(text) {			
			var lPattern;			
			var lOffset = -1;
			lOffset = text.search("([0-9]{8})"); // SAP-Format
			if (lOffset === 0) {
				lPattern = "yyyyMMdd";
			}
			if (!lPattern) {
				lOffset = text.search("([0-9]{4}-[0-9]{2}-[0-9]{2})"); // ISO Format
				if (lOffset === 0) {
					lPattern = "yyyy-MM-dd";
				}
			}
			
			var loDate;
			if (lPattern) { // correct format
				// retrieve the DataType Object
				var loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				loDate = loFormatter.parse(text.substr(lOffset, lPattern.length));
			}
			
			return loDate;
		}
		
		this.getTime = function(text) {
			var lPattern;			
			var lOffset = -1;
			lOffset = text.search("([0-9]{6})");
			if (lOffset === 0) {
				lPattern = "hhmmss";
			}
			if (!lPattern) {
				lOffset = text.search("([0-9]{2}:[0-9]{2}:[0-9]{2})");
				if (lOffset === 0) {
					lPattern = "hh:mm:ss";
				}
			}
			
			var loTime;
			if (lPattern) { // correct format
				// retrieve the DataType Object
				var loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				loTime = loFormatter.parse(text.substr(lOffset, lPattern.length));
			}
			
			return loTime;
		}
		
		this.getDateTime = function(text) {
			var lPattern;			
			var lOffset = -1;
			lOffset = text.search("^([0-9]{8})"); // SAP-Format Date
			if (lOffset === 0) {
				lPattern = "yyyyMMdd";
				lOffset = text.substr(8).search("^([0-9]{6})"); // SAP-Format Time
				if (lOffset === 0) {
					lPattern = "yyyyMMddhhmmss";
				}
			}
			if (!lPattern) {
				lOffset = text.search("^([0-9]{4}-[0-9]{2}-[0-9]{2})"); // ISO Format Date
				if (lOffset === 0) {
					lPattern = "yyyy-MM-dd";
					lOffset = text.substr(10).search("^T([0-9]{2}:[0-9]{2}:[0-9]{2})");
					if (lOffset === 0) {
						lPattern = "yyyy-MM-ddThh:mm:ss";
					}
				}
			}
			
			var loDateTime;
			if (lPattern) { // correct format
				// retrieve the DataType Object
				var loFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: lPattern});
				loDateTime = loFormatter.parse(text);
			}
			
			return loDateTime;
		}
		
		this.getType = function() {
			return "textfield";
		};
		
	};
	
	return new TextFieldHandler();
});
