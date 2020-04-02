/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/core/UIComponent", "sap/fe/core/CommonUtils"],
	function(UIComponent, CommonUtils) {
		"use strict";

		var TemplateComponent = UIComponent.extend("sap.fe.core.TemplateComponent", {
			metadata: {
				properties: {
					/**
					 * OData EntitySet name
					 */
					entitySet: {
						type: "string",
						defaultValue: null
					},
					/**
					 * The pattern for the binding context to be create based on the parameters from the navigation
					 * If not provided we'll default to what was passed in the URL
					 */
					bindingContextPattern: {
						type: "string"
					},

					/**
					 * Map of used OData navigations and its routing targets
					 */
					navigation: {
						type: "object"
					},
					/**
					 * Enhance the i18n bundle used for this page with one or more app specific i18n property files
					 */
					enhanceI18n: {
						type: "string[]"
					},
					/**
					 * Define control related configuration settings
					 */
					controlConfiguration: {
						type: "object"
					}
				},
				events: {
					"pageReady": {
						/**
						 * ManagedObject instance which is ready
						 */
						element: { type: "sap.ui.base.ManagedObject" }
					}
				},
				library: "sap.fe"
			},

			setContainer: function(oContainer) {
				UIComponent.prototype.setContainer.apply(this, arguments);
				// We override the default setContainer method in order ot be aware when the component is being displayed
				if (oContainer) {
					var that = this;
					oContainer.addEventDelegate({
						onBeforeShow: function() {
							that.bShown = false;
							that.bIsBackNav = false;
							that._bIsPageReady = false;
						},
						onBeforeHide: function() {
							that.bShown = false;
							that.bIsBackNav = false;
							that._bIsPageReady = false;
						},
						onAfterShow: function(oEvent) {
							that.bShown = true;
							that.bIsBackNav = oEvent.isBack || oEvent.isBackToPage;
							that._checkPageReady(true);
						}
					});
				}
			},

			setFocusInformation: function(mFocusInformation) {
				this._mLastFocusedControl = mFocusInformation;
			},

			/**
			 * This method will check whether or not the page is ready, this is composed of multiple points
			 * - Displayed in a container
			 * - Rendered
			 * - Has all the data it requested
			 * @param bFromNav {boolean} whether or not this has been triggered from the navigation rather than bindings
			 */
			_checkPageReady: function(bFromNav) {
				var that = this;
				if (this.bShown && this.bDataReceived !== false && this.bTablesLoaded !== false) {
					if (this.bDataReceived === true && !bFromNav && !this._bWaitingForRefresh) {
						// If we requested data we get notified as soon as the data arrived, so before the next rendering tick
						this.bDataReceived = undefined;
						this._bWaitingForRefresh = true;
						var fnUIUpdated = function() {
							sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
							that._bWaitingForRefresh = false;
							that.firePageReady();
						};
						sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
					} else {
						// In the case we're not waiting for any data (navigating back to a page we already have loaded)
						// just wait for a frame to fire the event.
						window.requestAnimationFrame(function() {
							that.firePageReady();
						});
					}
				}
			},

			init: function() {
				UIComponent.prototype.init.apply(this, arguments);
				this.oAppComponent = CommonUtils.getAppComponent(this);

				var that = this;
				this.getService("templatedView").then(function(oTemplatedViewService) {
					var oView = oTemplatedViewService.getView();
					var aBoundElements = [];
					var iRequested = 0;
					var iReceived = 0;
					var fnRequested = function(oEvent) {
						oEvent.getSource().detachDataRequested(fnRequested);
						iRequested++;
						that.bDataReceived = false;
					};
					var fnReceived = function(oEvent) {
						oEvent.getSource().detachDataReceived(fnReceived);
						iReceived++;
						// Skip a frame in case data requested is done in multiple steps to avoid too much
						setTimeout(function() {
							if (iReceived === iRequested && iRequested !== 0) {
								iRequested = 0;
								iReceived = 0;
								that.bDataReceived = true;
								that._checkPageReady(false);
							}
						}, 0);
					};

					oView.getParent().attachModelContextChange(function(oEvent) {
						that._bIsPageReady = false;
						aBoundElements.forEach(function(oElement) {
							oElement.detachDataRequested(fnRequested);
							oElement.detachDataReceived(fnReceived);
						});
						aBoundElements = [];
						oEvent.getSource().findAggregatedObjects(true, function(oElement) {
							var oObjectBinding = oElement.getObjectBinding();
							if (oObjectBinding) {
								// Register on all object binding (mostly used on object pages)
								oObjectBinding.attachDataRequested(fnRequested);
								oObjectBinding.attachDataReceived(fnReceived);
								aBoundElements.push(oObjectBinding);
							} else {
								var aBindingKeys = Object.keys(oElement.mBindingInfos);
								if (aBindingKeys.length > 0) {
									aBindingKeys.forEach(function(sPropertyName) {
										var oListBinding = oElement.mBindingInfos[sPropertyName].binding;
										// Register on all list binding, good for basic tables, problematic for MDC, see above
										if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
											oListBinding.attachDataRequested(fnRequested);
											oListBinding.attachDataReceived(fnReceived);
											aBoundElements.push(oListBinding);
										}
									});
								}
							}
							// This is dirty but MDC Table has a weird loading lifecycle
							if (oElement.isA("sap.ui.mdc.Table")) {
								that.bTablesLoaded = false;
								// We need to wait for the done to be finished and then look for the data it may request
								oElement.done().then(function() {
									if (oElement && oElement._oTable) {
										var oItemsBindingInfo = oElement._oTable.getBindingInfo("items");
										if (oItemsBindingInfo) {
											var oListBinding = oItemsBindingInfo.binding;
											oListBinding.attachDataRequested(fnRequested);
											oListBinding.attachDataReceived(fnReceived);
											aBoundElements.push(oListBinding);
										}
									}
									that.bTablesLoaded = true;
								});
							}
						});
						setTimeout(function() {
							that._checkPageReady(false);
						}, 0);
					});
				});
				this.attachPageReady(function() {
					that._bIsPageReady = true;
					that.onPageReady({ lastFocusControl: that._mLastFocusedControl, navBack: that.bIsBackNav });
				});
			},

			// This event is triggered always before a binding is going to be set
			onBeforeBinding: function(oContext, mParameters) {
				return true;
			},

			// This event is triggered always after a binding was set
			onAfterBinding: function(oContext) {
				return true;
			},

			isPageReady: function() {
				return this._bIsPageReady;
			},

			onPageReady: function(mParameters) {
				if (this.getRootControl() && this.getRootControl().getController() && this.getRootControl().getController().onPageReady) {
					this.getRootControl()
						.getController()
						.onPageReady(mParameters);
				}
			},

			getViewData: function() {
				var mProperties = this.getMetadata().getAllProperties();
				return Object.keys(mProperties).reduce(
					function(mViewData, sPropertyName) {
						mViewData[sPropertyName] = mProperties[sPropertyName].get(this);
						return mViewData;
					}.bind(this),
					{}
				);
			},

			getPageTitleInformation: function() {
				if (
					this.getRootControl() &&
					this.getRootControl().getController() &&
					this.getRootControl().getController().getPageTitleInformation
				) {
					return this.getRootControl()
						.getController()
						.getPageTitleInformation();
				}
			}
		});
		return TemplateComponent;
	},
	/* bExport= */ true
);
