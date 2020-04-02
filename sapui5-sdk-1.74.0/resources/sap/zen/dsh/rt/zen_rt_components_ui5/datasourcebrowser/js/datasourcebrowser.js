jQuery.sap.require("sap.ui.core.mvc.XMLView");
jQuery.sap.require("sap.ui.table.Table");

sap.ui.core.mvc.XMLView.extend("com.sap.ip.bi.DataSourceBrowser", {

	initDesignStudio : function() {
	},

	renderer : {},

	constructor : function(id, mSettings) {
		this.controlProperties = mSettings.dsControlProperties;
		jQuery.sap.registerModulePath("dsb",
				"zen.res/zen.rt.components.ui5/datasourcebrowser/js");
		if (sap.zen.Dispatcher.instance.isMainMode()) {
			sap.ui.core.mvc.XMLView.call(this, id, {
				viewName : "dsb.dsb_m",
				type : sap.ui.core.mvc.ViewType.JSON
			});
		} else {
			sap.ui.core.mvc.XMLView.call(this, id, {
				viewName : "dsb.dsb",
				type : sap.ui.core.mvc.ViewType.JSON
			});
		}
		return this;
	}
});