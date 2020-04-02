/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/**
 *@class analysisPath
 *@memberOf sap.apf.ui.reuse.controller
 *@name analysisPath
 *@description controller for view.analysisPath
 */
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/apf/utils/trace'
],function(BaseController, trace) {
	"use strict";

	/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method callBackForUpdatePathAndSetLastStepAsActive
		 *@param {object} oCurrentStep: Current Step instance
		 *@param {boolean} bStepChanged returns true if step has changed
		 *@description Used in 2 cases:
		 * 	1) by class stepGallery once only when creating a new step.
		 * 	2) during APF startup with mode.navigationMode === "forward"
		 * 	Updates the Carousel (list view).
		 * 	Sets last step as active and calls method updateCustomListView of the Carousel.
		 */
	return BaseController.extend("sap.apf.ui.reuse.controller.analysisPath", {
		/**
		 *@this {sap.apf.ui.reuse.controller.analysisPath}
		 */
		/**
		 * This function is called when during an update the first step is updated.
		 * Basically, it sets the busy indicator in the main chart for the active step.
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 */
		refreshAnalysisPath : function(startIndex) {
			this.getView().getCarouselView().getController().showStepChartChartAfterUpdate();
		},
		isOpenPath : false,//KLS what does this mean? Why no setter method?
		isNewPath : false,
		isBackNavigation : false,
		bLastValidState : false,
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oCoreApi;
			this.oUiApi = this.getView().getViewData().uiApi;
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");//KLS why are style classes added here and in the view? Who is responsible?
			}
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method refresh
		 *@description Adds loading sign to the active step when the path update has not yet reached that step.
		 *@param {number} startIndex index of step in analysis path after which filter has changed
		 */
		refresh : function(startIndex) {
			trace.logCall("AnalysisPath.refresh", " inx=", startIndex);
			function setTheMainChartBusy(){
				var nActiveStepIndex = this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());
				if (nActiveStepIndex > startIndex) {
					var oChartView = this.oUiApi.getStepContainer();
					oChartView.stepLayout.setBusy(true);
				}
			}
			setTheMainChartBusy.bind(this)();
			if (!this.oCoreApi.isDirty() && this.oCoreApi.getSteps().length !== 0) {
				this.oCoreApi.setDirtyState(true);
				this.setPathTitle();
			}
			trace.logReturn("refresh");
		},
		setPathTitle : function() {
			var pathTitleCandidate = this.oCoreApi.getPathName();
				if (pathTitleCandidate.length == 0) {
					pathTitleCandidate = this.oCoreApi.getTextNotHtmlEncoded("unsaved");
			}
			if (this.oCoreApi.isDirty()) {
				pathTitleCandidate = '*' + pathTitleCandidate;
			}
			this.oUiApi.getAnalysisPath().oSavedPathName.setTitle(pathTitleCandidate);//fixme try a smaller font
			this.oUiApi.getAnalysisPath().oSavedPathName.setTooltip(pathTitleCandidate);
		},
		/**
		 * Delegates the update of any custom list control which displays a step in the path (carousel).
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 * @param {sap.apf.core.Step} oCurrentStep: current step instance
		 * @param {number} nIndex: step index in getSteps()
		 * @param {boolean} bStepChanged returns true if step has changed
		 */
		updateCustomListView : function(oCurrentStep, nIndex, bStepChanged) {
			this.getView().getCarouselView().getController().updateCustomListView(oCurrentStep, nIndex, bStepChanged);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method callBackforUpdatePath
		 *@param {object} oCurrentStep: Current Step instance
		 *@param {boolean} bStepChanged  returns true if filter of step has changed
		 *@description Performs the update of the main chart and path carousel after the update of the step in the core path.
		 * 			It is called whenever one of th following changes occurs:
		 * 			selection in main chart, representation, filter, back navigation, move, remove step, open path.
		 */
		callBackForUpdatePath : function(oCurrentStep, bStepChanged) {
			trace.logCall("AnalysisPath.callBackForUpdatePath", " changed?", bStepChanged, " chart=", oCurrentStep.getSelectedRepresentation().chart ? oCurrentStep.getSelectedRepresentation().chart.sId : "NULL");
			try {
				var nIndex = this.oCoreApi.getSteps().indexOf(oCurrentStep);
				if (nIndex === 0) { // applies in case of openPath. Here, neither chart nor thumbnail do yet exist.
					this.refreshAnalysisPath(nIndex);
				}
				this.updateCurrentStep(oCurrentStep, nIndex, bStepChanged);
				this.updateCustomListView(oCurrentStep, nIndex, bStepChanged);
			} catch (exception){
				window.console.error("sap.apf .. analysisPath.controller catch exception: ", exception);
				window.console.trace("trace ");
			}
			trace.logReturn("callBackForUpdatePath");
		},
		callBackForUpdatePathAndSetLastStepAsActive : function(oCurrentStep, bStepChanged) {
			trace.logCall("AnalysisPath.callBackForUpdatePathAndSetLastStepAsActive", " changed?", bStepChanged, " chart=", oCurrentStep.getSelectedRepresentation().chart ? oCurrentStep.getSelectedRepresentation().chart.sId : "NULL");
			try {
				var nIndex = this.oCoreApi.getSteps().indexOf(oCurrentStep);
				if (nIndex === 0) {
					var oStep = this.oCoreApi.getSteps()[this.oCoreApi.getSteps().length - 1];
					this.oCoreApi.setActiveStep(oStep);
					this.refreshAnalysisPath();
				}
				this.updateCurrentStep(oCurrentStep, nIndex, bStepChanged);
				this.updateCustomListView(oCurrentStep, nIndex, bStepChanged);
				this.oUiApi.getLayoutView().setBusy(false);
			} catch (exception){
				window.console.error("sap.apf .. analysisPath.controller catch exception: ", exception);
				window.console.trace("trace ");
			}
			trace.logReturn("AnalysisPath.callBackForUpdatePathAndSetLastStepAsActive");
		},
		getIsOpenPath : function() {
			return this.isOpenPath === true ? true : false;
		},
		setIsOpenPath : function(bOpenPath) {
			this.isOpenPath = (bOpenPath) ? true : false;
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method updateCurrentStep
		 *@param {object} oCurrentStep: CurrentStep instance
		 *@param {number} nIndex: index of CurrentStep
		 *@param {boolean} bStepChanged returns true if step has changed
		 *@description Updates a step in the analysis path if step has changed.
		 * draw a new thumbnail from main chart if the currentStep is active, and draws the main chart if it is the active step.
		 * Handles Busy indicator of LayoutView.
		 * isOpenPath is set by the PathGallery.openPath.
		 */
		updateCurrentStep : function(oCurrentStep, nIndex, bStepChanged) {
			trace.logCall("AnalysisPath.updateCurrentStep", ", inx=", nIndex,", changed?", bStepChanged,
				", #core.path=", this.oCoreApi.getSteps().length);
			try{
				var nActiveIndex = this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());
				var isActiveStep = (nIndex === nActiveIndex);
				trace.log("updateCurrentStep", ", isOpenPath=", this.isOpenPath, ", nActiveIndex=", nActiveIndex);
				if (isActiveStep) {
					this.drawMainChart(bStepChanged, isActiveStep);
				}
				if (this.isOpenPath && (this.oCoreApi.getSteps().indexOf(oCurrentStep) === (this.oCoreApi.getSteps().length - 1))) {
					this.oUiApi.getLayoutView().setBusy(false);
					this.isOpenPath = false;//after creating the last step.
				}
				if (this.isBackNavigation && (this.oCoreApi.getSteps().indexOf(oCurrentStep) === (this.oCoreApi.getSteps().length - 1))) {
					this.oUiApi.getLayoutView().setBusy(false);
					this.isBackNavigation = false;
				}
				if (this.bLastValidState && (this.oCoreApi.getSteps().indexOf(oCurrentStep) === (this.oCoreApi.getSteps().length - 1))) {
					this.oUiApi.getLayoutView().setBusy(false);
					this.bLastValidState = false;
				}
				this.isNewPath = false;
			} catch (exception){
				window.console.error("sap.apf .. analysisPath.controller catch exception: ", exception);
				window.console.trace("trace ");
			}
			trace.logReturn("updateCurrentStep", ", isOpenPath=" + this.isOpenPath);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method drawMainChart
		 *@param {boolean} bStepChanged returns true if step has changed
		 *@description gets chartArea of application from API sap.apf.ui.getStepConatiner() and draws Chart
		 * @param {boolean} bStepChanged
		 * @param {boolean} [isActiveStep]
		 */
		drawMainChart : function(bStepChanged, isActiveStep) {
			trace.logCall("AnalysisPath.drawMainChart");
			var oChartView = this.oUiApi.getStepContainer();
			oChartView.getController().drawStepContent(bStepChanged, isActiveStep);
			trace.logReturn("drawMainChart");
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method drawMainChart
		 *@param {number} nIndex index of step for which thumbnail has to be drawn
		 *@param {boolean} bStepChanged returns true if step has changed
		 *@description gets chartArea of application from API sap.apf.ui.getStepConatiner() and draws Chart
		 */
//		drawThumbnail : function(nIndex, bStepChanged) {//fixme no usage except for tests
//			// need to temporarily create a thumbnail via the step. Otherwise, later access to the non-exist thumbnail throws.
//			// fixme remove the rest. when the following is commented out, unit tests are still ok, but updates are not any more propagted in the Carousel.
//			var oStep = this.oCoreApi.getSteps()[nIndex];
//			oStep.getSelectedRepresentation().getThumbnailContent();
//		},
		/**
		 * @method navigateToStep
		 * @param {Number} index to which step to navigate to
		 * @description Navigates to the step with the given index: sets the step to active and draws it in the stepContainer
		 */
		navigateToStep : function(index){
			this.getView().getCarouselView().getController().changeActiveStep(index);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method apfDestroy
		 *@description Used to clean up resources specific to APF during shutdown
		 */
		apfDestroy : function() {
			trace.logCall("AnalysisPath.apfDestroy ******");
			this.getView().getToolbar().getController().apfDestroy();
			this.getView().getCarouselView().getController().apfDestroy();
		}
	});
});