define("zen.rt.components.ui5/textarea/js/component", ["css!../css/component.css"], function() {
	sap.m.TextArea.extend("com.sap.ip.bi.TextArea", {
		initDesignStudio: function() {
			var that = this;
			that.attachChange(function() {
				that.fireDesignStudioPropertiesChangedAndEvent(['value'], 'onChange');
			});
			this.setWrapping("Soft");
			this.addStyleClass("zenTextArea");	
		},
		setValue: function(value) {
			sap.m.TextArea.prototype.setValue.call(this, value);
			this.fireDesignStudioPropertiesChanged(['value']);
		},
		renderer: {},
	});
		
});
