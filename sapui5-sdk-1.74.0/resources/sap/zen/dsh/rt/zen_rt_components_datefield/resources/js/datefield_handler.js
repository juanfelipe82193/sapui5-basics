define("zen.rt.components.datefield/resources/js/datefield_handler", ["sap/zen/basehandler"], function(BaseHandler){
	var DateFieldHandler = function() {
		"use strict";

		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;

		var that = this;
		
		function init(oControl, oControlProperties) {
			oControl.setTooltip(oControlProperties.tooltip);
			oControl.setEnabled(oControlProperties.enabled);
			if (oControlProperties.date) {
				oControl.setYyyymmdd(oControlProperties.date);
			} else if (dispatcher.isMainMode() || oControl.getYyyymmdd()){
				oControl.setYyyymmdd("");
			}
			oControl.setLocale(oControlProperties.locale);
		}
		
		function addevents(oControl, oControlProperties) {
			// attach events
			oControl.attachChange(function() {
				fireEvent(oControl, oControlProperties);
			});
		}
		
		function fireEvent(oControl, oControlProperties) {
			var onchange = that.prepareCommand(oControlProperties.onchange, "__VALUE__", oControl.getYyyymmdd());
			eval(onchange);
		}
		
		this.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];

			var oControl = this.createDefaultProxy(id);
			wrapFunctions(oControl);
			init(oControl, oControlProperties);
			addevents(oControl, oControlProperties);
			
			return oControl;
		};

		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				init(oControl, oControlProperties);
			}
			return oControl;
		};
		
		this.getDefaultProxyClass = function(){
			return ["sap.m.DatePicker", "sap.ui.commons.DatePicker"];
		};
		
		this.getDecorator = function() {
			return "FixedHeightDecorator";
		};
		
		this.getType = function() {
			return "datefield";
		};
		
		var wrapFunctions = function(oControl){
			if(dispatcher.isMainMode()){
				oControl.setYyyymmdd = function(oObj){
					if(oObj === ""){
						this.setDateValue(null);
						this.setPlaceholder(" ");
					}else {
						var date = new Date();
						var year = parseInt(oObj.substring(0,4));
						var month = oObj.substring(4,6);
						var day = oObj.substring(6,8);
						
						if(month.indexOf("0") === 0){
							month = month.substring(1);
						}
						month = parseInt(month) -1;
						
						if(day.indexOf("0") === 0){
							day = day.substring(1);
						}
						day = parseInt(day);
						
						date.setYear(year);
						date.setMonth(month);
						date.setDate(day);
						
						
						this.setDateValue(date);
					}
				};
				
				oControl.setLocale = function(){
					//this.setDisplayFormat(oObj);
				}
				
				oControl.getYyyymmdd = function(){
					var oDate = this.getDateValue();
					if(oDate == null){
						return '';
					}
					var result = oDate.getFullYear()+"";
					var month = oDate.getMonth();
					month +=1;
					if(month <= 9){
						month = 0+""+month;
					}
					result += month;
					
					var day = oDate.getDate();
					if(day <= 9){
						day = 0+""+day;
					}
					result += day;
					
					return result; 
				}
				
				
			}
		}
	};
	
	return new DateFieldHandler();
	
});

