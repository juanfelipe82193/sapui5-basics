define("zen.rt.components.ui5/segmentedButton/js/component_m", [], function() {
	 sap.m.SegmentedButton.extend("com.sap.ip.bi.SegmentedButton", {
		// the control API:
		metadata : {
			properties : {
				"height" : "sap.ui.core.CSSSize",
				"width"  : "sap.ui.core.CSSSize", 
				"cssStyle" : "string"
			}
		},

		initDesignStudio: function() {
		},
		

		
		itemsReference : [], 
		renderer : {},
		afterDesignStudioUpdate : function() {
		},
		
		setSelectedText: function(text) {		
			this.selectedText = text;
		},
		
		setSelectedValue: function(value) {		
			if (value) {
				this.selectedValue = value;
				var buttons = this.getButtons();
				for(var i = 0; i< buttons.length; i++) {
					if(buttons[i].value === this.selectedValue){
						this.setSelectedButton(buttons[i]);
					}
				}
			}
		},
		getSelectedText: function() {		
			return this.selectedText;	
		},
		
		getSelectedValue: function() {		
			return this.selectedValue;	
		},
		
		removeAllItems: function(){
			
		},
		
		setButtonItems: function(items) {
			this.destroyItems();
			this.removeAllItems();
			this.removeAllButtons();
			var that = this;
			var fPress = function(evt) {
					that.setSelectedText(evt.oSource.mProperties.text);
					that.setSelectedValue(evt.oSource.value);
					that.fireDesignStudioPropertiesChanged(["selectedValue"]);
					that.fireDesignStudioPropertiesChanged(["selectedText"]);
					that.fireDesignStudioEvent('onClick');
			};
			for(var i = 0; i< items.length; i++) {
				var item = items[i];
				var button = this.createButton(item.text, item.image, !item.disabled);
				if (item.tooltip) {
					button.setTooltip(item.tooltip);
				}
				button.attachPress(fPress);
				button.value = item.value;
				if(this.getSelectedValue() === button.value){
					this.setSelectedButton(button);
				}
			}
		},		
		getITEMS: function() {
			return this.ITEMS;
		}
		//TODO you have to write setItems into here to replace the old ones.
		// an event handler:
		
	});
	return com.sap.ip.bi.SegmentedButton;
});