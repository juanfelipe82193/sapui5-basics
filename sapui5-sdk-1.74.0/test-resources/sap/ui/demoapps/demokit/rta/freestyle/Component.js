sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/demoapps/rta/freestyle/controller/Application",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/ui/fl/FakeLrepConnectorSessionStorage",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/demoapps/rta/freestyle/localService/mockserver",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demoapps/rta/freestyle/util/SmartLink",
	'sap/ui/fl/Utils',
	"sap/ui/rta/util/UrlParser"
], function(
	UIComponent,
	Application,
	FakeLrepConnectorLocalStorage,
	FakeLrepConnectorSessionStorage,
	ODataModel,
	mockserver,
	JSONModel,
	SmartLink,
	Utils,
	UrlParser
) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.freestyle.Component", {

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
			SmartLink.mockUShellServices();
			UIComponent.prototype.constructor.apply(this, arguments);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this._assignMainService();
			this._createODataModel();
			// add custom "Adapt UI" button if application is running as a standalone app
			this._adaptButtonConfiguration();

			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);

			this.oApplicationController = new Application();
			this.oApplicationController.init(this);
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ApplicationControlled is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this.oApplicationController.destroy();
			if (this._shouldUseFakeLrep()) {
				var mAppManifest = this.getManifestEntry("sap.app");
				this.FakeLrepConnectorStorage.disableFakeConnector(
					mAppManifest.id + '.Component',
					mAppManifest.applicationVersion.version
				);
			}
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * Checks Url parameter sap-rta-mock-lrep if FakeLrepConnector should be used
		 * and the lrep storage type to be used with it
		 * @private
		 */
		_shouldUseFakeLrep : function(){
			if (UrlParser.getParam('sap-rta-lrep-storage-type') === "sessionStorage") {
				this.FakeLrepConnectorStorage = FakeLrepConnectorSessionStorage;
			} else {
				this.FakeLrepConnectorStorage = FakeLrepConnectorLocalStorage;
			}
			return UrlParser.getParam('sap-rta-mock-lrep') !== false;
		},

		/**
		 * Create the FakeLrep with localStorage
		 * @private
		 */
		_createFakeLrep: function () {
			if (this._shouldUseFakeLrep()) {
				var mAppManifest = this.getManifestEntry("sap.app");
				this.FakeLrepConnectorStorage.enableFakeConnector(
					null,
					mAppManifest.id + '.Component',
					mAppManifest.applicationVersion.version
				);
			}
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init(this.getManifestEntry.bind(this));
		},

		/**
		 * Adapt the visibility of the "Adapt UI" button
		 * @private
		 */
		_adaptButtonConfiguration: function () {
			this.setModel(new JSONModel({
				showAdaptButton: !Utils.getUshellContainer()
			}), "app");
		},

		/**
		 * Read the mainService configuration from the app descriptor
		 * @private
		 */
		_assignMainService: function () {
			var oAppEntry = this.getMetadata().getManifestEntry("sap.app");

			if (oAppEntry.dataSources.mainService) {
				this._oMainService = oAppEntry.dataSources.mainService;
			} else {
				this._oMainService = undefined;
			}
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
