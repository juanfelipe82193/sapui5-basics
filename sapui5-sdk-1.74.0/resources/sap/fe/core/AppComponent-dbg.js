/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.fe.core.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/m/NavContainer",
		"sap/f/FlexibleColumnLayout",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/FlexibleColumnLayout",
		"sap/fe/core/NavigationHelper"
	],
	function(UIComponent, NavContainer, FlexibleColumnLayout, Routing, FlexibleColumnLayoutExt, NavigationHelper) {
		"use strict";

		var AppComponent = UIComponent.extend("sap.fe.core.AppComponent", {
			metadata: {
				config: {
					fullWidth: true
				},
				manifest: {
					"sap.ui5": {
						services: {
							resourceModel: {
								factoryName: "sap.fe.core.services.ResourceModelService",
								"startup": "waitFor",
								"settings": {
									"bundles": ["sap.fe.core"],
									"modelName": "sap.fe.i18n"
								}
							},
							namedBindingModel: {
								factoryName: "sap.fe.core.services.NamedBindingModelService",
								"startup": "waitFor"
							},
							draftModel: {
								"factoryName": "sap.fe.core.services.DraftModelService",
								"startup": "waitFor"
							},
							ShellUIService: {
								factoryName: "sap.ushell.ui5service.ShellUIService"
							},
							navigation: {
								factoryName: "sap.fe.core.services.NavigationService"
							}
						},
						routing: {
							"config": {
								// for FlexibleColumnLayout we should used sap.f.routing.Router instead of sap.m.routing.Router
								"routerClass": "sap.m.routing.Router",
								"viewType": "XML",
								"controlAggregation": "pages",
								"async": true,
								"containerOptions": {
									"propagateModel": true
								}
							}
						}
					}
				},
				designtime: "sap/fe/core/designtime/AppComponent.designtime",

				library: "sap.fe"
			},

			_oFcl: null,
			_oNavigationHelper: null,
			getFcl: function() {
				return this._oFcl;
			},
			getNavigationHelper: function() {
				return this._oNavigationHelper;
			},
			constructor: function() {
				this._oRouting = new Routing();
				this._oFcl = new FlexibleColumnLayoutExt();
				this._oTemplateContract = {
					oAppComponent: this
				};
				this._oNavigationHelper = new NavigationHelper();

				UIComponent.apply(this, arguments);
				return this.getInterface();
			},

			init: function() {
				var that = this;
				// Overwrite the controlId with the dynamically created controlId if none is specified
				var oApplicationRoutingConfig = this.getManifestEntry("/sap.ui5/routing");
				if (!oApplicationRoutingConfig.config || !oApplicationRoutingConfig.config.controlId) {
					var oAppComponentMetadata = this.getMetadata().getParent();
					if (oAppComponentMetadata.getName() === "sap.fe.AppComponent") {
						oAppComponentMetadata = oAppComponentMetadata.getParent();
					}
					var oManifestConfig = oAppComponentMetadata.getManifestObject()._oManifest["sap.ui5"].routing.config;
					if (oManifestConfig) {
						oManifestConfig.controlId = this.createId("appContent");
					}
				}
				var oModel = this.getModel();
				if (oModel) {
					// upgrade the model to a named binding model
					// we call the UIComponent init once we upgraded our model to a named binding model
					UIComponent.prototype.init.apply(this, arguments);
					this.getFcl().initializeFcl(this, this._oTemplateContract.oNavContainer);
					this._oRouting.initializeRouting(this).then(function() {
						that.getNavigationHelper().init(that);
					});
					this.getService("draftModel").then(function(oDraftModelService) {
						if (oDraftModelService.isDraftModel()) {
							that.setModel(oDraftModelService.getDraftAccessModel(), "$draft");
						}
					});

					// Error handling for erroneous metadata request
					oModel
						.getMetaModel()
						.requestObject("/$EntityContainer/")
						.catch(
							function(oError) {
								var oNavContainer = this.getRootControl(),
									oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

								that._oRouting.navigateToMessagePage(oResourceBundle.getText("SAPFE_APPSTART_TECHNICAL_ISSUES"), {
									title: oResourceBundle.getText("SAPFE_ERROR"),
									description: oError.message,
									navContainer: oNavContainer
								});
							}.bind(this)
						);
				}
			},

			exit: function() {
				this._oRouting.fireOnAfterNavigation();
			},

			createContent: function() {
				// Method must only be called once
				if (!this._oTemplateContract.bContentCreated) {
					var oManifestUI5 = this.getManifestEntry("sap.ui5");
					if (!oManifestUI5.rootView) {
						if (this.getFcl().isFclEnabled(this)) {
							this._oTemplateContract.oNavContainer = new FlexibleColumnLayout({
								id: this.createId("appContent"),
								backgroundDesign: "Solid"
							});
						} else {
							this._oTemplateContract.oNavContainer = new NavContainer({
								id: this.createId("appContent"),
								autoFocus: false
							});
						}
					} else {
						this._oTemplateContract.oNavContainer = UIComponent.prototype.createContent.apply(this, arguments);
					}

					this._oTemplateContract.bContentCreated = true;
				}

				return this._oTemplateContract.oNavContainer;
			},

			getMetaModel: function() {
				return this.getModel().getMetaModel();
			}
		});

		return AppComponent;
	}
);
