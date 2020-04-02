define("zen.rt.components.actionsheet/resources/js/actionsheet_handler", ["sap/zen/basehandler"], function(BaseHandler){
	"use strict";

	//
	// ActionSheet
	//
	var ActionSheetHandler = function() {
	
		BaseHandler.apply(this, arguments);
		
		var that = this;
		
		this.oPlacementMapping = {
				"BOTTOM" : sap.m.PlacementType.Bottom,
				"LEFT" : sap.m.PlacementType.Left,
				"RIGHT" : sap.m.PlacementType.Right,
				"TOP" : sap.m.PlacementType.Top,
				"HORIZONTAL" : sap.m.PlacementType.Horizontal,
				"VERTICAL" : sap.m.PlacementType.Vertical,
				"AUTO" : sap.m.PlacementType.Auto
			};
		
		this.oActionSheet = null;
	
		var init = function(oControl, oControlProperties) {

			var fCleanUpActionSheet = function(){
				if(that.oActionSheet){
					that.oActionSheet.destroyButtons();
					that.oActionSheet.destroy();
					that.oActionSheet = null;
				}
			}
			
			if(oControlProperties.open === true){
				fCleanUpActionSheet(); //just to be safe
				
				that.oActionSheet = new sap.m.ActionSheet(oControl.getId() + "_rendered");
				
				if(oControlProperties.placement){
					that.oActionSheet.setPlacement(that.oPlacementMapping[oControlProperties.placement]);
				} else {					
					that.oActionSheet.setPlacement(sap.m.PlacementType.Auto);
				}
				
				var aItems = oControlProperties.items;
				if(aItems){
					var oItem;
					var oButton;
					var sOnClickCommand = oControlProperties.onClickCommand;
					for(var i = 0; i < aItems.length; i++){
						oItem = aItems[i].item;
						oButton = new sap.m.Button(that.oActionSheet.getId()+"_button_"+i);
						
						if(oItem.text){
							oButton.setText(oItem.text);
						} else {
							oButton.setText(oItem.value);
						}
						
						if(oItem.icon){
							oButton.setIcon(oItem.icon);
						}
						
						var sParameterizedOnClickCommand = sOnClickCommand.replace("__VALUE__", oItem.value);
						var fOnClickCommand = new Function(sParameterizedOnClickCommand);
						
						oButton.attachPress(fOnClickCommand);
						that.oActionSheet.addButton(oButton);
					}
				}
				
				//wait with the rendering to make sure the openBy UI5 control hasn't been set to invisible in the same roundtrip
				setTimeout(function(){
					var oUi5Control = sap.zen.Dispatcher.instance.getRootControlForComponentId(oControlProperties.openBy)
					if(oUi5Control){				
						that.oActionSheet.openBy(oUi5Control);
						that.oActionSheet.attachAfterClose(null, function(){
							fCleanUpActionSheet();
							var fCloseCommand = new Function(oControlProperties.closeCommand);
							fCloseCommand();
						});
					}
				}, 1);
			}
		}
		
	
		this.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
	
			var oControl = this.createButton(id);
			init(oControl, oControlProperties);
			oControl.setVisible(false);
	
			return oControl;
		};
	
		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				init(oControl, oControlProperties);
			}
			return oControl;
		};
		
		this.getDefaultProxyClass = function(){
			return [sap.m.ActionSheet, null];
		};
		
		this.getType = function() {
			return "actionsheet";
		};

	};
	

    return new ActionSheetHandler();

});

////////////////////////////////////////
