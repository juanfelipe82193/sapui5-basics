define("zen.rt.components.selection/resources/js/checkboxgroup_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	
	// CheckboxGroup
	//
	
	var toInheritFrom;
	
	if(sap.zen.Dispatcher.instance.isMainMode()){
		toInheritFrom = sap.m.CheckBox;
	} else {
		toInheritFrom = sap.ui.commons.CheckBox;
	}
	
	toInheritFrom.extend("sap.zen.ZenCheckbox", {
		// the control API:
		metadata : {
			properties : {
				"key" : "string"
			}
		},
	
		renderer : {}
	
	});
	
	var CheckboxGroupHandler = function () {
		"use strict";
	
		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;	

		var that = this;
		this.create = function (oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
			var oVerticalLayout = new sap.ui.layout.VerticalLayout(id);
	
			init(oVerticalLayout, oControlProperties);
	
	
			return oVerticalLayout;
		};
	
		this.update = function (oListBox, oControlProperties) {
			if (oControlProperties) {
				init(oListBox, oControlProperties);
			}
			return oListBox;
		};
	
	
		
		this.getSelectedCBSFromCBG = function(oControl){
			var aContent = oControl.getContent();
			var result = [];
			for ( var i = 0; i < aContent.length; i++) {
				var oItem = aContent[i];
				if(oItem.getChecked()){
					result.push(oItem);
				}
			}
			
			return result;
		}
		
		
		
		
	
		function init (oVlayout, oControlProperties) {
			var i, key;
			oVlayout.removeAllContent();
			if(!oVlayout.previousItems){
				oVlayout.previousItems = [];
			}
			
			var selectedItems = oControlProperties.selectedItems;
			if (selectedItems) {
				var keys = {};
				for (i = 0; i < selectedItems.length; i++) {
					key = dispatcher.getValue(selectedItems[i], "key");
					keys[key] = true;
				}
			}
			
			oVlayout.previousSelections = [];
	
			var items = oControlProperties.items;
			var fChange = function (oControlEvent) {
				var keys = "";
				var aCbs = that.getSelectedCBSFromCBG(oControlEvent.oSource.getParent());
				for ( var j = 0; j < aCbs.length; j++) {
					keys += aCbs[j].getKey();
					keys += "|SeP|";
				}
				var command = that.prepareCommand(oControlProperties.command,"__KEYS__", keys);
				eval(command);
			};
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				key = item.item.key;
				var text = item.item.val_0;
				var oItem = that.createDefaultProxy(i);
				oItem.setEnabled(oControlProperties.enabled);
	
				oItem.setKey(key);
				if (text.length === 0) {
					text = key;
				}
				oItem.setText(text);
				oVlayout.addContent(oItem);
				
				oItem.attachChange(fChange);

				if (keys && keys[key]) {
					oItem.setChecked(keys[key]);
				}
	
			}
	
		}
		
		this.getDefaultProxyClass = function(){
			return ["sap.zen.ZenCheckbox", "sap.zen.ZenCheckbox"];
		}
		
		this.provideFunctionMapping = function(){
			return [["setSelected","setChecked"],["attachSelect","attachChange"],["getSelected","getChecked"]];
		};
		
		this.getType = function() {
			return "checkboxgroup";
		};
		this.getDecorator = function() {
			return "DataSourceFixedHeightDecorator";
		}

	};
	
	return new CheckboxGroupHandler();
	
});
