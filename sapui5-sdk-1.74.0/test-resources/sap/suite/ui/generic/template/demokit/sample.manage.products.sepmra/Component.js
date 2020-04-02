sap.ui.define([
	"sap/ui/generic/app/AppComponent",
	"sap/ui/demoapps/rta/fiorielements/localService/mockserver",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/ui/rta/util/UrlParser",
	"sap/ui/rta/RuntimeAuthoring"
], function(
	UIComponent,
	mockserver,
	FakeLrepConnectorLocalStorage,
	UrlParser
) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.fiorielements.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * Initialize MockServer & FakeLrep in constructor before model is loaded from the manifest.json
		 * @public
		 * @override
		 */
		constructor: function () {
			this._createFakeLrep();
			this._startMockServer();

			UIComponent.prototype.constructor.apply(this, arguments);
				this.getModel().attachMetadataLoaded(function(){
			}.bind(this));
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this._createODataModel();

			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init(this.getManifestEntry.bind(this));
		},

		/**
		 * Create the FakeLrep with localStorage
		 * @private
		 */
		_createFakeLrep: function () {
			if (UrlParser.getParam('sap-rta-mock-lrep') !== false) {
				var mAppManifest = this.getManifestEntry("sap.app");
				FakeLrepConnectorLocalStorage.enableFakeConnector(
					null,
					mAppManifest.id + '.Component',
					mAppManifest.applicationVersion.version
				);
			}
		},

		destroy: function () {
			if (UrlParser.getParam('sap-rta-mock-lrep') !== false) {
				var mAppManifest = this.getManifestEntry("sap.app");
				FakeLrepConnectorLocalStorage.disableFakeConnector(
					mAppManifest.id + '.Component',
					mAppManifest.applicationVersion.version
				);
			}
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * Create the ODataModel for the app
		 * @private
		 */
		_createODataModel: function () {
			if (this._oMainService.uri) {
				var oModel = new ODataModel(this._oMainService.uri, {
					"settings": {
						"metadataUrlParams": {
							"sap-documentation": "heading"
						}
					}
				});
				oModel.setDefaultBindingMode("TwoWay");
				this.setModel(oModel);
			}
		}

	});
});
