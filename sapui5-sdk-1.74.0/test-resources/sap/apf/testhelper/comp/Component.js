
sap.ui.define('sap.apf.testhelper.comp.Component', [
	'sap/apf/base/Component',
	'sap/m/App'
], function(BaseComponent, App) {

	BaseComponent.extend("sap.apf.testhelper.comp.Component", {
		metadata: {
			"manifest" : "json",
			properties : {
				injectedApfApi: {
					Constructor: function(oComponent, injectedConstructors, manifests) {
						this.startApf = function() {
							var application = new App();
							return application;
						};
						this.destroy = function() {};

						this.startupSucceeded = function() {
							return true;
						};
					}
				}
			}
		},
		/**
		 * Initialize the application
		 * @returns {sap.ui.core.Control} the content
		 */
		init: function() {
			BaseComponent.prototype.init.apply(this, arguments);
		},
		/**
		 * Creates the application layout and returns the outer layout of APF
		 * @returns
		 */
		createContent: function() {
			BaseComponent.prototype.init.apply(this, arguments);
		}
	});
});