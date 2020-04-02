/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/ui/core/XMLComposite", "sap/ui/model/json/JSONModel", "sap/ui/base/ManagedObjectObserver", "sap/ui/model/resource/ResourceModel"],
	function(XMLComposite, JSONModel, ManagedObjectObserver, ResourceModel) {
		"use strict";
		var Paginator = XMLComposite.extend("sap.fe.templates.controls.Paginator", {
			metadata: {
				properties: {
					listBinding: {
						type: "sap.ui.model.odata.v4.ODataListBinding"
					}
				},
				events: {
					navigate: {}
				},
				aggregations: {},
				publicMethods: []
			},
			alias: "this",
			fragment: "sap.fe.templates.controls.Paginator"
		});

		Paginator.prototype.init = function() {
			XMLComposite.prototype.init.apply(this, arguments);
			var that = this;

			// Initial setting of the button enablement and visibility
			that.setModel(
				new JSONModel({
					navUpEnabled: false,
					navDownEnabled: false
				}),
				"buttonEnablement"
			);
			that.setVisible(false);

			// To observe change in the property : listbinding
			that._oObserver = new ManagedObjectObserver(that._observeChanges.bind(that));
			that._oObserver.observe(that, {
				properties: ["listBinding"]
			});

			// To update the buttons on change of binding context
			that.attachModelContextChange(function(oEvent) {
				var oModel = that.getModel();
				if (!oModel) {
					return;
				}
				that.updateCurrentIndexAndButtonEnablement();
			});
		};

		Paginator.prototype.onBeforeRendering = function() {
			// i18n for tooltip
			if (!this.getModel("sap.fe.i18n")) {
				this.setModel(
					new ResourceModel({
						bundleName: "sap/fe/templates/messagebundle",
						async: true
					}),
					"sap.fe.i18n"
				);
			}
		};

		Paginator.prototype._observeChanges = function(oChanges) {
			var that = this;

			if (oChanges.name === "listBinding") {
				if (that.getListBinding()) {
					// Update the control
					that.updateCurrentIndexAndButtonEnablement();
					that.setVisible(true);
				} else {
					that._currentIndex = null;
					that.setVisible(false);
				}
			}
		};

		Paginator.prototype.updateCurrentIndexAndButtonEnablement = function() {
			// Three cases to find the currentIndex
			// 1. First time the paginator buttons are rendered, currentIndex needs to be found.
			// 2. If bindingContext of the paginator buttons is changed externally. Eg: On going back to LR from OP and navigating to a different OP, the currentIndex needs to be updated.
			// 3. New ListBinding.
			var that = this;
			var oListBinding = that.getListBinding();
			if (that.getBindingContext() && oListBinding) {
				var oCurrentIndexContext = oListBinding.getContexts(0)[that._currentIndex];
				if (
					(!that._currentIndex && that._currentIndex !== 0) ||
					!oCurrentIndexContext ||
					that.getBindingContext().getPath() !== oCurrentIndexContext.getPath()
				) {
					that.updateCurrentIndex();
				}
				that.handleButtonEnablement();
			}
		};

		Paginator.prototype.updateCurrentIndex = function() {
			var that = this;
			var sPath = that.getBindingContext().getPath();
			// Storing the currentIndex
			that._currentIndex = that
				.getListBinding()
				.getContexts(0)
				.findIndex(function(oContext) {
					return oContext && oContext.getPath() === sPath;
				});
		};

		Paginator.prototype.handleButtonEnablement = function() {
			//Enabling and Disabling the Buttons on change of the control context
			var that = this;
			var oListBinding = that.getListBinding();
			var mButtonEnablementModel = that.getModel("buttonEnablement");
			if (oListBinding && oListBinding.getContexts(0).length > 1 && that._currentIndex > -1) {
				if (that._currentIndex === oListBinding.getContexts(0).length - 1) {
					mButtonEnablementModel.setProperty("/navDownEnabled", false);
				} else {
					mButtonEnablementModel.setProperty("/navDownEnabled", true);
				}
				if (that._currentIndex === 0) {
					mButtonEnablementModel.setProperty("/navUpEnabled", false);
				} else {
					mButtonEnablementModel.setProperty("/navUpEnabled", true);
				}
				that.setVisible(true);
			} else {
				// Don't show the paginator buttons
				// 1. When no listbinding is available
				// 2. Only '1' or '0' context exists in the listBinding
				// 3. The current index is -ve, i.e the currentIndex is invalid.
				that.setVisible(false);
			}
		};

		Paginator.prototype.handleShowOtherObject = function(index) {
			var that = this;
			var oListBinding = that.getListBinding();

			if (!oListBinding) {
				return;
			}

			var aCurrentContexts = oListBinding.getContexts(0);
			var iNewIndex = that._currentIndex + index;
			if (aCurrentContexts[iNewIndex]) {
				that.fireNavigate({
					context: aCurrentContexts[iNewIndex]
				});
				that._currentIndex = iNewIndex;
			}
		};

		Paginator.prototype.handleShowPrevObject = function() {
			this.handleShowOtherObject(-1);
		};

		Paginator.prototype.handleShowNextObject = function() {
			this.handleShowOtherObject(1);
		};

		return Paginator;
	},
	/* bExport= */ true
);
