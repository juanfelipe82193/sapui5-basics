/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP AG. All rights reserved
 */
/*global Promise*/
/**
 *@class Ui Component Instance
 *@name sap.apf.ui.Instance
 *@description Creation of new Ui Component Instance
 *@param {object} oInject - Core Instance
 */
sap.ui.define([
	'sap/apf/ui/utils/constants',
	'sap/apf/core/constants',
	'sap/apf/ui/reuse/view/analysisPath.view',
	'sap/apf/ui/reuse/view/carousel.view',
	'sap/apf/utils/trace'
	], function(uiUtilsConstants, coreConstants, AnalysisPath, CarouselView, trace) {
	'use strict';
	function setHeightForFilterAndFooter(oContext, oFilter, oStyleClassNames) {
		var oLayoutView = oContext.getLayoutView();
		var subHeaderInstance = oLayoutView.byId("subHeader");
		subHeaderInstance.addContent(oFilter);
		oFilter.addEventDelegate({
			onAfterRendering : function() {
				subHeaderInstance.setBusy(false);
				if (oFilter instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
					subHeaderInstance.setHeight("");
					subHeaderInstance.addStyleClass(oStyleClassNames);
					if (!oFilter.getFilterBarExpanded() || (oFilter.isInitialised() && oFilter.getFilters().length === 0)) {
						oFilter.addStyleClass("smartFilterBar"); //style for SFB in case of no visible filters
					} else {
						oFilter.removeStyleClass("smartFilterBar");
					}
				}
			}
		});
	}
	function removeBusyIndicatorFromSubHeader(oContext) {
		oContext.getLayoutView().byId("subHeader").setBusy(false);
	}
	function Instance(oInject) {
		oInject.uiApi = this;
		var oCoreApi = oInject.oCoreApi;
		var oStartFilterHandler = oInject.oStartFilterHandler;
		// instances start
		var analysisPath;
		var messageHandler;
		var stepContainer;
		var toolbar;
		var carousel;
		var stepGallery;
		var pathGallery;
		var deleteAnalysisPath;
		var applicationLayout;
		// instances end
		var oFacetFilterView, oSmartFilterBarView;
		var apfLocation = oCoreApi.getUriGenerator().getApfLocation();
		this.oEventCallbacks = {};
		var application;

		jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfUi.css", "apfCss");
		jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfPrint.css", "printCss");
		jQuery("#printCss").attr("media", "print"); // @comment : Doesn't Support adding attribute
		/**
		 * @description Get add analysis step button
		 * @returns {sap.m.Button} Button
		 */
		this.getAddAnalysisStepButton = function(){
			return this.getAnalysisPath().getCarouselView().getAddStepButton();
		};
		/**
		 *@description Creates an analysis path async
		 *@see sap.apf.ui.reuse.view.analysisPath
		 *@returns {analysisPath}
		 */
		this.getAnalysisPath = function() {
			if (analysisPath === undefined) {
				analysisPath = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.analysisPath",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : oInject,
					async : true
				});
			}
			return analysisPath;
		};
		/**
		 *@description Creates a notification bar async
		 *@see sap.apf.ui.reuse.view.messageHandler
		 *@returns {oNotificationView }
		 */
		this.getNotificationBar = function() {
			if (messageHandler === undefined) {
				messageHandler = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.messageHandler",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : oInject,
					async : true
				});
			}
			return messageHandler;
		};
		/**
		 *@description Creates a step container to hold representation async
		 *@see sap.apf.ui.reuse.view.stepContainer
		 *@returns {stepContainer}
		 */
		this.getStepContainer = function() {
			if (stepContainer === undefined) {
				stepContainer = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.stepContainer",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : oInject,
					async : true
				});
			}
			return stepContainer;
		};
		/**
		 * @description Creates a toolbar async
		 * @see sap.apf.ui.reuse.view.toolbar
		 * @returns {toolbar}
		 */
		this.getToolbar = function() {
			if (toolbar === undefined) {
				toolbar = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.toolbar",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : oInject,
					async : true
				});
			}
			return toolbar;
		};
		/**
		 * @description Creates a carousel async
		 * @see sap.apf.ui.reuse.view.carousel
		 * @returns {sap.apf.ui.reuse.view.carousel}
		 */
		this.createCarouselSingleton = function() {
			if (oInject && oInject.functions && oInject.functions.createCarouselSingleton){
				carousel = oInject.functions.createCarouselSingleton();
			}
			if (carousel === undefined) {
				carousel = sap.ui.view({
					viewName  :"sap.apf.ui.reuse.view.carousel",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : {
						oInject : oInject
					},
					async : true
				});
			}
			return carousel;
		};
		/**
		 * @description Creates a step gallery async
		 * @see sap.apf.ui.reuse.view.stepGallery
		 * @returns {stepGallery}
		 */
		this.getStepGallery = function() {
			if (stepGallery === undefined) {
				stepGallery = sap.ui.view({
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.stepGallery",
					viewData : oInject,
					async : true
				});
			}
			return stepGallery;
		};
		/**
		 * @description Creates a path gallery async
		 * @see sap.apf.ui.reuse.view.pathGallery
		 * @returns {pathGallery}
		 */
		this.getPathGallery = function() {
			if (pathGallery === undefined) {
				pathGallery = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.pathGallery",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : {
						oInject : oInject
					},
					async : true
				});
			}
			return pathGallery;
		};
		/**
		 * @description Creates a delete analysis path async
		 * @see sap.apf.ui.reuse.view.deleteAnalysisPath
		 * @returns {deleteAnalysisPath}
		 */
		this.getDeleteAnalysisPath = function() {
			if (deleteAnalysisPath === undefined) {
				deleteAnalysisPath = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : {
						oInject : oInject
					},
					async : true
				});
			}
			return deleteAnalysisPath;
		};
		/**
		 * @memberOf sap.apf.ui
		 * @description Creates a main application layout with the header and main view async
		 * @see sap.apf.ui.reuse.view.layout
		 * @return {applicationLayout}
		 */
		this.getLayoutView = function() {
			if (applicationLayout === undefined) {
				applicationLayout = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.layout",
					type : sap.ui.core.mvc.ViewType.XML,
					viewData : oInject,
					async : true
				});
			}
			return applicationLayout;
		};
		/**
		 *@memberOf sap.apf.Api#addMasterFooterContent
		 *@description Calls the updatePath with proper callback for UI.
		 * 				It also refreshes the steps either from the active step or
		 * 				all the steps depending on the boolean value passed.
		 *@param {boolean}
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			trace.logCall("ui/Instance.selectionChanged", ", bRefreshAllSteps: ", bRefreshAllSteps, "--------");
			var nActiveStepIndex;
			var that = this;

			function updateOpenInButtonAfterPathUpdate() {
				if (applicationLayout) {
					applicationLayout.getController().enableDisableOpenIn();
				}
			}

			nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			var indexOfRefresh = 0 ;
			nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			if (!bRefreshAllSteps) {
				indexOfRefresh = nActiveStepIndex + 1;
			}
			trace.logCall("...", ", nActiveStepIndex: ", nActiveStepIndex, ", indexOfRefresh", indexOfRefresh);
			that.getAnalysisPath().getController().refresh(indexOfRefresh);
			that.getAnalysisPath().getController().getView().getCarouselView().getController().setBusyFromIndex(indexOfRefresh);
			oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()), function(){
			    updateOpenInButtonAfterPathUpdate();
			});
			trace.logReturn("ui/Instance.selectionChanged");
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description returns app
		 *@return Application
		 */
		var bIsAppLayoutCreated = false;
		this.createApplicationLayout = function(app) {
			var self = this;
			//promise the application layout
			return new Promise(function(resolveApplication) {
				// Ensure layout page is added only once
				if (!bIsAppLayoutCreated) {
					var pStepGallery = self.getStepGallery().loaded();
					var pToolbar = self.getToolbar().loaded();
					var pPathGallery = self.getPathGallery().loaded();
					var pDeleteAnalysisPath = self.getDeleteAnalysisPath().loaded();
					var pStepContainer = self.getStepContainer().loaded();
					var pCarousel = Promise.all([pStepGallery]).then(function() {
						return self.createCarouselSingleton().loaded();
					});
					var pAnalysisPath = Promise.all([pToolbar, pCarousel, pPathGallery, pDeleteAnalysisPath]).then(function() {
						return self.getAnalysisPath().loaded();
					});
					var pLayoutView = Promise.all([pStepContainer, pAnalysisPath]).then(function() {
						return self.getLayoutView().loaded();
					});
					pLayoutView.then(function() {
						app.addPage(applicationLayout);
						bIsAppLayoutCreated = true;
						application = app;
						//resolve the application layout
						resolveApplication(app);
					});
				} else {
					//resolve the application layout, because it was created before
					resolveApplication(application);
				}
			});
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description adds content to detail footer
		 *@param oControl
		 *            {object} Any valid UI5 control
		 */
		this.addDetailFooterContent = function(oControl) {
			this.getLayoutView().getController().addDetailFooterContentLeft(oControl);
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description adds content to master footer
		 *@param oControl
		 *            {object} Any valid UI5 control
		 */
		this.addMasterFooterContentRight = function(oControl) {
			this.getLayoutView().getController().addMasterFooterContentRight(oControl);
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description registers callback for event callback.
		 *@param fn callback
		 */
		this.setEventCallback = function(sEventType, fnCallback) {
			this.oEventCallbacks[sEventType] = fnCallback;
		};
		/**
		 *@memberOf sap.apf.ui
		 *@returns the registered callback for event callback.
		 */
		this.getEventCallback = function(sEventType) {
			return this.oEventCallbacks[sEventType];
		};
		/**
		 * @name sap.apf.ui#get custom format exit object
		 * @member of sap.apf.ui
		 * @description get custom format exit object from oInject
		 */
		this.getCustomFormatExit = function() {
			return oInject.exits;
		};
		/**
		 * @name sap.apf.ui#set custom format call back to exit object
		 * @member of sap.apf.ui
		 * @param {function} fnCallback that will be added to the exit object
		 * @description set function callback to  the exit object
		 */
		this.setCustomFormatExit = function(fnCallback) {
			var oCutsomFormatExits = this.getCustomFormatExit();
			oCutsomFormatExits.customFormat = fnCallback;
		};
		/**
		 * @name sap.apf.ui#drawSmartFilterBar
		 * @member of sap.apf.ui
		 * @param {Object} smartFilterBarConfiguration - Configuration object of SmartFilterBar
		 * @description draws smart filter bar on layout subHeader.
		 */
		this.drawSmartFilterBar = function(smartFilterBarConfiguration) {
			var oSelf = this;

			function drawSmartFilterBarWithDefaultValues(sfbConfiguration) {
				oCoreApi.getSmartFilterbarDefaultFilterValues().done(function(oControlConfiguration) {
					oSmartFilterBarView = sap.ui.view({
						viewName : "sap.apf.ui.reuse.view.smartFilterBar",
						type : sap.ui.core.mvc.ViewType.JS,
						viewData : {
							oCoreApi : oCoreApi,
							oUiApi : oSelf,
							oSmartFilterBarConfiguration : sfbConfiguration,
							controlConfiguration : oControlConfiguration,
							parent : oSelf.getLayoutView()
						},
						async : true
					});
					oSmartFilterBarView.loaded().then(function(oView) {
						setHeightForFilterAndFooter(oSelf, oView.byId("idAPFSmartFilterBar"), "smartFilterBarContainer");
					});
				});
			}

			if (smartFilterBarConfiguration) {
				if (smartFilterBarConfiguration.entitySet) {
					drawSmartFilterBarWithDefaultValues(smartFilterBarConfiguration);
				} else {
					oCoreApi.getMetadata(smartFilterBarConfiguration.service).done(function(metadata){
						smartFilterBarConfiguration.entitySet = metadata.getEntitySetByEntityType(smartFilterBarConfiguration.entityType);
						delete smartFilterBarConfiguration.entityType;
						drawSmartFilterBarWithDefaultValues(smartFilterBarConfiguration);
					});
				}
			} else {
				removeBusyIndicatorFromSubHeader(oSelf);
			}
		};
		/**
		 * @name sap.apf.ui#drawFacetFilter
		 * @member of sap.apf.ui
		 * @param {Object} subHeaderInstance - Pass the sub header instance to add the facet filter view item
		 * @description draws facet filter on layout subHeader.
		 */
		this.drawFacetFilter = function(aConfiguredFilters) {
			if (aConfiguredFilters.length > 0) {
				var that = this;
				oFacetFilterView = sap.ui.view({
					viewName : "sap.apf.ui.reuse.view.facetFilter",
					type : sap.ui.core.mvc.ViewType.JS,
					viewData : {
						oCoreApi : oCoreApi,
						oUiApi : this,
						aConfiguredFilters : aConfiguredFilters,
						oStartFilterHandler : oStartFilterHandler
					},
					async : true
				});
				oFacetFilterView.loaded().then(function(oView) {
					setHeightForFilterAndFooter(that, oView.byId("idAPFFacetFilter"));
				});
			} else {
				removeBusyIndicatorFromSubHeader(this);
			}
		};
		/**
		 * @function
		 * @name sap.apf.ui#contextChanged
		 * @param {boolean} bResetPath - True when new path is triggered.
		 * @memberOf sap.apf.ui
		 * @description It to be called when the path context is changed/updated.
		 * Notifies application footers of context change.
		 */
		this.contextChanged = function(bResetPath) {
			var fnCallback = this.getEventCallback(coreConstants.eventTypes.contextChanged);
			if (typeof fnCallback === "function") {
				fnCallback();
			}
		};
		/**
		 * @function
		 * @name sap.apf.ui#getFacetFilterForPrint
		 * @memberOf sap.apf.ui
		 * @description Currently used by printHelper to get formatted filter values.
		 * @returns facet filter control from which selected values(formatted) are used for printing
		 * */
		this.getFacetFilterForPrint = function() {
			if (oFacetFilterView) {
				return oFacetFilterView.byId("idAPFFacetFilter");
			}
		};
		/**
		 * @function
		 * @name sap.apf.ui#getSmartFilterForPrint
		 * @memberOf sap.apf.ui
		 * @description Currently used by printHelper to get formatted smart filter values.
		 * @returns smart filter control from which selected values(formatted) are used for printing
		 * */
		this.getSmartFilterForPrint = function() {
			if (oSmartFilterBarView) {
				return oSmartFilterBarView.byId("idAPFSmartFilterBar");
			}
		};
		/**
		 * @function
		 * @name sap.apf.ui#handleStartup
		 * @memberOf sap.apf.ui
		 * @description It is called during start of APF.
		 * Gets the configured visible facet filters and draws the facet filter.
		 * In case the first step is configured for the application it is created.
		 * In addition the callback for updating the path is also registered.
		 */
		this.handleStartup = function(deferredMode) {
			var that = this;
			var promiseStartup = jQuery.Deferred();
			oCoreApi.getSmartFilterBarConfigurationAsPromise().done(function(smartFilterBarConfiguration) {
				if (smartFilterBarConfiguration) {
					that.drawSmartFilterBar(smartFilterBarConfiguration);
				}
				deferredMode.done(function(mode) {
					var promiseStartFilters = oStartFilterHandler.getStartFilters();
					promiseStartFilters.done(function(aConfiguredFilters) { //visible filters are returned in the callback
						that.contextChanged();
						if (!smartFilterBarConfiguration) {
							that.drawFacetFilter(aConfiguredFilters);
						}
						if (mode.navigationMode === "backward") {
							that.getAnalysisPath().getController().isBackNavigation = true;
							oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()));
							that.getAnalysisPath().getController().setPathTitle();
						}
						if (mode.navigationMode === "forward") {
							if (oCoreApi.getStartParameterFacade().getSteps()) {
								var stepId = oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
								var repId = oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
								var callback = that.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(that.getAnalysisPath().getController());
								oCoreApi.createFirstStep(stepId, repId, callback);
							}
						}
						//Initialize Message Handler and set callback for message handling
						that.getNotificationBar().loaded().then(function(oMessageHandlerView) {
							that.getLayoutView().byId("applicationPage").addContent(oMessageHandlerView);
							var fnCallbackMessageHandling = oMessageHandlerView.getController().showMessage;
							oCoreApi.setCallbackForMessageHandling(fnCallbackMessageHandling.bind(oMessageHandlerView.getController()));
							promiseStartup.resolve();
						});
					});
				});
			});
			return promiseStartup.promise();
		};
		/**
		 * @function
		 * @name sap.apf.ui#destroy
		 * @description Cleanup of instance level objects called on destroy of application
		 */
		this.destroy = function() {
			oFacetFilterView = undefined;
			oSmartFilterBarView = undefined;
			if (analysisPath) {
				// Dialogs from Tool Bar control
				var toolbarController = this.getAnalysisPath().getToolbar().getController();
				checkAndCloseDialog(toolbarController.saveDialog);
				checkAndCloseDialog(toolbarController.newOpenDialog);
				checkAndCloseDialog(toolbarController.newDialog);
				checkAndCloseDialog(toolbarController.confirmDialog);
				checkAndCloseDialog(toolbarController.errorMsgDialog);
				checkAndCloseDialog(toolbarController.noPathAddedDialog);
				//Selection Dialogs
				if (toolbarController.deleteAnalysisPath !== undefined) {
					checkAndCloseDialog(toolbarController.deleteAnalysisPath.getController().oDialog);
				}
				if (toolbarController.pathGallery !== undefined) {
					checkAndCloseDialog(toolbarController.pathGallery.getController().oDialog);
				}
				// Dialogs from Step Gallery control
				var stepGalleryController = this.getAnalysisPath().getCarouselView().getStepGallery().getController();
				checkAndCloseDialog(stepGalleryController.oHierchicalSelectDialog);
			}
			if (stepContainer) {
				// Dialogs from Step Container control
				var stepContainerController = this.getStepContainer().getController();
				checkAndCloseDialog(stepContainerController.selectionDisplayDialog);
				//Function call for View Settings Dialog
				viewDialogClose(this);
			}
		};
		function checkAndCloseDialog(dialog) {
			if (dialog !== undefined) {
				if (dialog instanceof sap.m.ViewSettingsDialog) {
					dialog.destroy();
				} else if (dialog.isOpen()) {
					dialog.close();
				}
			}
		}
		function viewDialogClose(self) {
			var bIsActiveStep = false;
			var bIsSelectedRepresentatioin = false;
			var selectedRepresentation;
			if (self.getStepContainer().getViewData().oCoreApi.getActiveStep() !== undefined) {
				bIsActiveStep = true;
			}
			if (bIsActiveStep) {
				selectedRepresentation = self.getStepContainer().getViewData().oCoreApi.getActiveStep().getSelectedRepresentation();
				if (selectedRepresentation !== undefined) {
					bIsSelectedRepresentatioin = true;
				}
			}
			if (bIsSelectedRepresentatioin) {
				if (selectedRepresentation.type !== uiUtilsConstants.representationTypes.TABLE_REPRESENTATION) {
					if (selectedRepresentation.toggleInstance !== undefined) {
						checkAndCloseDialog(selectedRepresentation.toggleInstance.viewSettingsDialog);
					}
				} else {
					checkAndCloseDialog(selectedRepresentation.viewSettingsDialog);
				}
			}
		}
	}
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.Instance = Instance;
	/*END_COMPATIBILITY*/

	return Instance;
}, true /*GLOBAL_EXPORT*/);