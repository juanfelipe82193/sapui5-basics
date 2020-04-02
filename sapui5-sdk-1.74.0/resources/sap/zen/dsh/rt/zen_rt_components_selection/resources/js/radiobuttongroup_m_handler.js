define("zen.rt.components.selection/resources/js/radiobuttongroup_m_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	var RadiobuttonGroupHandler = function() {
		"use strict";
	
		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;
		
		var that = this;
		
		function fireEvent(oControl, oControlProperties) {
			var oItem = oControl.getSelectedButton();
			if(oItem){
				var key = oItem.key;
				key += "|SeP|";
				var command = that.prepareCommand(oControlProperties.command,"__KEYS__", key);
				eval(command);
			}
		}
	
		function itemsAreChanged(oControl, oControlProperties){
			var selectedItems = oControlProperties.selectedItems;
			var selectedItemKey = null;
			
			if (selectedItems && selectedItems[0]) {
				selectedItemKey = dispatcher.getValue(selectedItems[0], "key");
			}
			if (oControl.getSelectedButton()) {
				if (oControl.getSelectedButton().key !== selectedItemKey) {
					return true;
				}
			}
			
	//		if(oControl.getTooltip() !== oControlProperties.tooltip){
	//			return true;
	//		}
			if(oControl.getColumns() !== oControlProperties.columns){
				return true;
			}
	
			var items = oControlProperties.items;
			var aAlreadyAddeditems = oControl.getButtons();
			
			if(aAlreadyAddeditems.length !== items.length){
				return true;
			}
			
			for ( var i = 0; i < items.length; i++) {
				var item = items[i];
				var newKey = item.item.key;
				var newText = item.item.val_0;
				if (newText.length === 0) {
					newText = newKey;
				}
				var alreadyAddeditem = aAlreadyAddeditems[i];
				var oldKey = alreadyAddeditem.key;
				var oldText = alreadyAddeditem.getText();
				if(newKey !== oldKey || newText !== oldText || alreadyAddeditem.getEnabled() !== oControlProperties.enabled){
					return true;
				}
			}
			
			return false;
			
			
		}
		
		function init(oControl, oControlProperties) {
			if(!itemsAreChanged(oControl, oControlProperties)){
				return;
			}
			oControl.destroyButtons();
	
			oControl.setTooltip(oControlProperties.tooltip);
			oControl.setColumns(oControlProperties.columns);
			
			var selectedItems = oControlProperties.selectedItems;
			var selectedItemKey = null;
			if (selectedItems && selectedItems[0]) {
				selectedItemKey = dispatcher.getValue(selectedItems[0], "key");
			}
	
			var items = oControlProperties.items;
			for ( var i = 0; i < items.length; i++) {
				var item = items[i];
				var key = item.item.key;
				var text = item.item.val_0;
				var oItem = new sap.m.RadioButton(i);
				oItem.key = key;
				if (text.length === 0) {
					text = key;
				}
				oItem.setText(text);
				oItem.setEnabled(oControlProperties.enabled);
				oControl.addButton(oItem);
				if (key === selectedItemKey) {
					oControl.setSelectedButton(oItem);
				}
			}
			
			//fireEvent(oControlProperties, oControlProperties.checked);
		}
	
		function addevents(oControl, oControlProperties) {
			// attach events
			oControl.attachSelect(function() {
				fireEvent(oControl, oControlProperties);
			});
		}
		
		this.create = function(oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
	
			// initialization
			var oRadiobuttonGroup = new sap.m.RadioButtonGroup(id);
			init(oRadiobuttonGroup, oControlProperties);
			addevents(oRadiobuttonGroup, oControlProperties);
			return oRadiobuttonGroup;
		};
	
		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				init(oControl, oControlProperties);
			}
			return oControl;
		};
	
		this.getDecorator = function() {
			return "DataSourceFixedHeightDecorator";
		};
		
		this.getType = function() {
			return "radiobuttongroup";
		};
		
	};
	
	return new RadiobuttonGroupHandler();
	
});

