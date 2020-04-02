/*globals sap*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.View3", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        this.generateLinks();
    },
    handleRefresh : function () {
        "use strict";
        sap.ui.getCore().getEventBus().publish("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",{});
    },
	generateLinks : function() {
		this.getOwnerComponent().getRootControl().getController().generateLinks();
	}
});
