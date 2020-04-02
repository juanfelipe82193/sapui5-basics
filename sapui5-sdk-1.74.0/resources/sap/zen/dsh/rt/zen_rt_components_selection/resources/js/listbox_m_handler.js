define("zen.rt.components.selection/resources/js/listbox_m_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	// list box
	
	sap.m.StandardListItem.extend("sap.zen.StandardListItemWithKey", {
		// the control API:
		metadata : {
			properties : {
				"key" : "string"
			}
		},
	
		renderer : {}
	
	});
	
	sap.m.List.extend("sap.zen.MListWithHeight", {
		// the control API:
		metadata : {
			properties : {
				"height" : "sap.ui.core.CSSSize"
			}
		},
	
		renderer : {},
		onAfterRendering : function(evt) { // is called when the Control's area is
			// clicked - no event registration
			// required
			if (sap.m.List.prototype.onAfterRendering) {
				sap.m.List.prototype.onAfterRendering.apply(this, [ evt ]);
			}
			
			var height = this.getHeight();
			var jqThis = this.$();
			if (height !== "auto") {
			// set height
			jqThis.height(height);			
			}
			
	//		var newstyle = jqThis.attr("style");/
			this.$().addClass("zenScrollableMListbox");
		}
	
	});
	
	var ListBoxHandler = function () {
		"use strict";
	
		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;
		
		var that = this;
		this.create = function (oChainedControl, oControlProperties) {
			var id = oControlProperties["id"];
			var oControl = new sap.m.ScrollContainer(id);
			var oListBox = new sap.m.List(id+"_LB");
			oListBox.addStyleClass("zenListBox-FontSize");
			oListBox.setIncludeItemInSelection(true);
			oControl.setVertical(true);
			oControl.setHorizontal(false);
			oControl.addContent(oListBox);
	
			init(oControl, oControlProperties);
			
			oListBox.attachSelect(function (oControlEvent) {
				var keys = "";
				var indices = oControlEvent.oSource.getSelectedItems();
				
				for ( var j = 0; j < indices.length; j++) {				
					var item = indices[j];
					keys += item.getKey();
					keys += "|SeP|";
				}
				var command = that.prepareCommand(oControlProperties.command,"__KEYS__", keys);
				eval(command);
			});
	
			return oControl;
		};
	
		this.update = function (oListBox, oControlProperties) {
			if (oControlProperties) {
				init(oListBox, oControlProperties);
			}
			return oListBox;
		};
	
		function itemsAreChanged(oControl, oControlProperties) {
			var selectedItems = oControlProperties.selectedItems;
			var aSelectedItemKey = [], i;
			
			if (selectedItems) {
				for (i = 0; i < selectedItems.length; i++) {
					aSelectedItemKey.push(dispatcher.getValue(selectedItems[i], "key"));
				}
			}
			var aGetSelectedItems = oControl.getSelectedItems();
			if (aGetSelectedItems) {
				if(aGetSelectedItems.length !== aSelectedItemKey.length){
					return true;
				}
				var counter = 0;
				for (i = 0; i < aGetSelectedItems.length; i++) {
					if($.inArray(aGetSelectedItems[i].getKey(),aSelectedItemKey) !== -1){
						counter++;
					}
				}
				if(counter != aSelectedItemKey.length){
					return true;
				}
			}
			
			var modeToTake = getUI5ModeForDSMode(oControlProperties.selectionMode);
			
			if(oControl.getMode() !== modeToTake){
				return true;
			}
	
			var items = oControlProperties.items;
			var aAlreadyAddeditems = oControl.getItems();
			
			if(aAlreadyAddeditems.length !== items.length){
				return true;
			}
			
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				var newKey = item.item.key;
				var newText = item.item.val_0;
				if (newText.length === 0) {
					newText = newKey;
				}
				var oldKey = aAlreadyAddeditems[i].getKey();
				var oldText = aAlreadyAddeditems[i].getTitle();
				if(newKey !== oldKey || newText !== oldText){
					return true;
				}
			}
			
			return false;
			
			
		}
		
		
		function getUI5ModeForDSMode(sDsMode){
			if(sDsMode === "SINGLE_LEFT") {
				return sap.m.ListMode.SingleSelectLeft;
			} else if(sDsMode === "SINGLE_MASTER") {
				return sap.m.ListMode.SingleSelectMaster;
			} else if(sDsMode === "MULTI") {
				return sap.m.ListMode.MultiSelect;
			}
			return sap.m.ListMode.SingleSelect;
		}
		
	
		function init (oControl, oControlProperties) {
			var oListBox = oControl.getContent()[0];
			if(!itemsAreChanged(oListBox, oControlProperties)){
				return;
			}
			oListBox.removeAllItems();
			if(!oListBox.previousItems){
				oListBox.previousItems = [];
			}
	
			var modeToTake = getUI5ModeForDSMode(oControlProperties.selectionMode);
			oListBox.setMode(modeToTake);
	
			var selectedItems = oControlProperties.selectedItems;
			var i, key;
			if (selectedItems) {
				var keys = {};
				for (i = 0; i < selectedItems.length; i++) {
					key = dispatcher.getValue(selectedItems[i], "key");
					keys[key] = true;
				}
			}
			
	
			var items = oControlProperties.items;
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				key = item.item.key;
				var text = item.item.val_0;
				var oItem = new sap.zen.StandardListItemWithKey(i);
	
				oItem.setKey(key);
				if (text.length === 0) {
					text = key;
				}
				oItem.setTitle(text);
				oListBox.addItem(oItem);
				if (keys && keys[key]) {
					oListBox.setSelectedItem(oItem);
				}
	
			}
	
		}
		
		this.getType = function() {
			return "listbox";
		};

		this.getDecorator = function() {
			return "DataSourceControlDecorator";
		}

	};
	
	
	return new ListBoxHandler();
	
});
