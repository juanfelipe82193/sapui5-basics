sap.ui.controller("reuselib.referencecomponent.view.Default", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf poc.extpoints.ext.components.reuseComponent.view.webapp.ext.components.reuseComponent.Default
	 */
		onInit: function() {
			//console.log("onInit");
		},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf poc.extpoints.ext.components.reuseComponent.view.webapp.ext.components.reuseComponent.Default
	 */
		onBeforeRendering: function() {
			//console.log("onBeforeRendering");
		},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf poc.extpoints.ext.components.reuseComponent.view.webapp.ext.components.reuseComponent.Default
	 */
		onAfterRendering: function() {
			//console.log("onAfterRendering");
		}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf poc.extpoints.ext.components.reuseComponent.view.webapp.ext.components.reuseComponent.Default
	 */
	//	onExit: function() {
	//
	//	}

});