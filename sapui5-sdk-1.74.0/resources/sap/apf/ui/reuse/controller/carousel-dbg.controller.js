/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP AG. All rights reserved
 */
/* global window, document */
/**
 *@class carousel.controller
 *@name carousel.controller
 *
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller for view.carousel
 */

sap.ui.define([
	"sap/apf/utils/utils",
	'sap/apf/ui/utils/wrappedChartWithCornerTexts',
	'sap/apf/utils/trace'
], function(Utils, WrappedChartWithCornerTexts, trace) {
	'use strict';

	var timeoutTick = 0;
	var logSeparator4Event = " ************************************** ";
	var logSeparator = " -------------------------------------- ";
	/**
	 * @param that carousel.controller
	 * @param name
	 * @param nIndex index of processed step
	 * @param oStep
	 * @param text1
	 * @param back call === false and return === true
	 */
	function logUpdate(that, name, nIndex, oStep, text1) {
		if (jQuery.sap.log.apfTrace === undefined){
			return;
		}
		var text = getUpdateText(that, name, nIndex, oStep, text1);
		trace.log("Carousel." + name, text);
	}
	function rCTI2text(rCTI) {
		var text = "";
		rCTI.forEach(function(item, inx){
			var chart = item.oChart;
			if (chart){
				text += "'" + chart.sId + "',";
			} else {
				text += "'" + chart + "',"; //null, undefined, false
			}
		});
		text = (rCTI.length===0) ? "[]" : "[" + text.slice(0, text.length-1) +"]";
		return text;
	}
	function customItemList2text(that) {
		var text = "";
		var cil = that.getView().getCustomItemList();
		cil.forEach(function(item, inx){
			text += "'" + item.sId + "',";
		});
		text = (cil.length===0) ? "[]" : "[" + text.slice(0, text.length-1) +"]";
		return text;
	}
	function bookkeeping2text(that){
		return ", relation=" + rCTI2text(that._relateChartsToItems) + " // " + customItemList2text(that)
			+ " #path=" + that.oCoreApi.getSteps().length;
	}
	function getUpdateText(that, name, nIndex, oStep, text1) {
		text1 = text1 || "";
		var head = "";
		var iconic = "-";
		var oRepr;
		var chartType = "-";
		if(oStep) {
			oRepr = oStep.getSelectedRepresentation();
			chartType = oRepr.type;
		}
		var text = "";
		if (nIndex===-1) {
			return head + text1;
		}
		text += ": inx=" + nIndex;
		text += iconic==="-"||iconic===false ? "" : ", is iconic";
		text += chartType==="-" ? "" : ", repr.type=" + chartType;
		text += bookkeeping2text(that);
		text += text1==="" ? "" : "\n --- " + text1 + "---";
		return head + text;
	}
	var CarouselController = sap.ui.controller("sap.apf.ui.reuse.controller.carousel", {
		/**
		 *@this {sap.apf.ui.reuse.controller.carousel}
		 */
		cloneCnt : 0,
		paddingLeft : 10,
		paddingRight : 10,
		paddingBottom : 15,
		paddingTop : 15,
		/**
		 * Bookkeeping device which relates under the same index a step in the path, the chart,
		 * the custom list item, and the wrapper views of the chart (vertical and horizontal boxes).
		 */
		_relateChartsToItems : [],

		onAfterRendering : function() {
		},
		onInit : function() {
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
			var oViewData = this.getView().getViewData().oInject;
			this.oCoreApi = oViewData.oCoreApi;
			this.oUiApi = oViewData.uiApi;
			this._relateChartsToItems = [];
		},
		showStepGallery : function() {
			this.getView().getStepGallery().getController().openHierarchicalSelectDialog();
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.carousel
		 *@method onAfterRendering
		 *@description Attaches event on Add Step Button and instantiate Step Gallery
		 * Called when the View has been rendered (so its HTML is part of the document).
		 * Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 */
		onBeforeRendering : function() {
			this.oUiApi.getLayoutView().getController().addMasterFooterContentLeft(this.getView().addStepButton);
			this.oUiApi.getLayoutView().getController().addMasterFooterContentLeft(this.getView().moveUpButton);
			this.oUiApi.getLayoutView().getController().addMasterFooterContentLeft(this.getView().moveDownButton);
			// this.oUiApi.getLayoutView().getController().addMasterFooterContentLeft(this.getView().testPathButton);
		},
		/**
		 * determines all texts of a custom list item
		 * @param oStep
		 */
		getStepData : function(oStep) {
			var oStepData = {};
			oStepData.index = this.oCoreApi.getSteps().indexOf(oStep);
			oStepData.title = this.oCoreApi.getTextNotHtmlEncoded(oStep.title);
			oStepData.oStepTexts = this.getTextsForCustomListItem(oStep);
			return oStepData;
		},
		/**
		 * Update the cloned chart of the customItem after a data change of the step. Updates the chart's model.
		 * The cloned chart is taken from this._relateChartsToItems.
		 * It is passed to functions which update selections, data set and feeds.
		 * @param {sap.apf.core.step} oStep
		 * @param {Integer} nIndex
		 */
		update1CustomItemChartWhenChange : function(oStep, nIndex) {
			trace.logCall("update1CustomItemChartWhenChange", nIndex, oStep);
			var oRepr = oStep.getSelectedRepresentation();
			var oClonedChart = this._relateChartsToItems[nIndex].oChart; // get the cloned chart
			if (!oClonedChart){
				trace.logReturn("update1CustomItemChartWhenChange: chart reference is undefined");
				return;
			}
			trace.log("...", ", #oClonedChart.oModel before update:", oClonedChart.getModel().getData().data.length);
			oRepr.createDataset(); // sets oRepr.dataSet and oRepr.oModel
			oClonedChart.setModel(oRepr.oModel); // update with new data on the cloned chart.
			this._setSelectionsOnThumbnailAndEnforceRendering(oStep, nIndex);
			trace.logReturn("update1CustomItemChartWhenChange", ", #oClonedChart.oModel:", oClonedChart.getModel().getData().data.length);
		},
		_setSelectionsOnThumbnailAndEnforceRendering : function(oStep, nIndex) {
			var that = this;
			var tick = timeoutTick++;
			trace.emphasize("_setSelectionsOnThumbnailAndEnforceRendering, nIndex=" + nIndex, " set timeout, tick=", tick);
			setTimeout(function() {
				trace.emphasize("_setSelectionsOnThumbnailAndEnforceRendering, nIndex=" + nIndex, " resolved timeout, tick=", tick);
				that.setSelectionsOnThumbnail(oStep, nIndex);
			}, 1);
		},
		getActiveStepIndex : function(){
			if ( this.oCoreApi.getSteps().length > 1){
				this.getView().moveDownButton.setEnabled(true);
				this.getView().moveUpButton.setEnabled(true);
			}
			return this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());
		},
		deleteFromBookkeeping : function(activeStepIndex) {
			if (activeStepIndex >= 0) {
				this._relateChartsToItems.splice(activeStepIndex, 1); // remove at index
			}
		},
		/**
		 * Set the selections on the indexed chart, using the cloned chart referenced from the bookkeeping device.
		 * Selection of data change happens on the active step, but it turned out that propagating this always to all steps
		 * is required for proper updates of thumbnails.
		 * @param oStep
		 * @param nIndex
		 */
		setSelectionsOnThumbnail : function(oStep, nIndex){
			var oRepr = oStep.getSelectedRepresentation();
			if (WrappedChartWithCornerTexts.isIconDisplayed(oRepr)){
				trace.log("setSelectionsOnThumbnail", "iconic, no selections applied, return");
				return;
			}
			var oClonedChart = this._relateChartsToItems[nIndex].oChart;
			trace.logCall("setSelectionsOnThumbnail", ", nIndex", nIndex);
			if (!oClonedChart){
				jQuery.sap.log.error("***** setSelectionsOnThumbnail: chart reference is undefined");
				return;
			}
			var aFilterValues = oRepr.oRepresentationFilterHandler.getFilterValues();
			var aSelections = oRepr.oVizFrameSelectionHandler.getSelectionInfoFromFilter(aFilterValues, oRepr.aDataResponse);
			// NOTE: the following method when it changes the selection triggers an event, which in turn triggers the update.
			// Therefore, in _getClonedChart the event handlers get detached.
			trace.log("setSelectionsOnThumbnail", ", call oClonedChart.vizSelection", " apfId=" + oRepr.apfId, "  chart.id=" + oClonedChart.sId,
				" selections&filters:", aSelections, aFilterValues);
			oClonedChart.vizSelection(aSelections, {
				clearSelection : true
			});
			var text = " #filters:" + aFilterValues.length;
			text += " #vizSelection=" + (oClonedChart.vizSelection() ? oClonedChart.vizSelection().length : "undefined");
			trace.logReturn('setSelectionsOnThumbnail', text);
		},
		_createWrappedChartClone : function(oStep){
			var oClonedChart = WrappedChartWithCornerTexts.getClonedChart(oStep);
			var wrappedChartWithCornerTexts = new WrappedChartWithCornerTexts.constructor(this, oStep, oClonedChart);
			return {
				oChart: oClonedChart,
				oWrappedView: wrappedChartWithCornerTexts.getContent(),
				wrappedChartWithCornerTexts: wrappedChartWithCornerTexts
			};
		},
		/**
		 * Clones the chart, wraps it into vertical and horizontal boxes while providing corner texts.
		 * Second, the chart and required references to several boxes are stored in a bookkeeping relation.
		 * For iconic thumbnails the reference to the chart in the bookkeeping is set to null.
		 * @param oStep
		 * @param nIndex
		 * @return {{customListItem: (*|sap.m.CustomListItem), wrappedChartWithCornerTexts: (controller.WrappedChartWithCornerTexts|WrappedChartWithCornerTexts|*), oChart: (*|*|*|null), typeOfChart: *, bIsAlternateView: *}}
		 * @private
		 */
		_createRelation : function(oStep) {
			var oWrappedCloned = this._createWrappedChartClone(oStep);
			var customListItem = this.getView().createCustomListItem(oWrappedCloned.oWrappedView);
			var oRepr = oStep.getSelectedRepresentation();
			var chartInRelation = oWrappedCloned.oChart;
			if (WrappedChartWithCornerTexts.isIconDisplayed(oRepr)){
				chartInRelation = null; // defensive so not to set selections for iconic thumbnails.
			}
			var result = {
				oChart: chartInRelation,
				typeOfChart : oRepr.type,
				bIsAlternateView : oRepr.bIsAlternateView,
				customListItem : customListItem, // used to access sId used in the item selection event.
				wrappedChartWithCornerTexts : oWrappedCloned.wrappedChartWithCornerTexts
			};
			trace.log("_createRelation", " return=", result);
			return result
		},
		/**
		 * When adding a step from the "Add Step" button the step is the new active one and its main chart will be created.
		 * Then, this main chart will be used for the clone (otherwise when it is iconic no chart is used anyway).
		 * In the case of OpenPath, many steps will be created and only one is active.
		 * In this case, all except the active one do not have a main chart. In this case the thumbnail must be used.
		 * Furthermore, both the original chart and the thumbnail chart must be cloned in order to avoid side effects.
		 *
		 * @param oStep the newly added step for which this method creates the custom list item containing its thumbnail.
		 * @private
		 */
		_addStepAsCustomItem : function(oStep){
			var oRelation = this._createRelation(oStep);
			this.getView().addCustomListItem(oRelation.customListItem);
			oRelation.wrappedChartWithCornerTexts.setHighlighted();
			this._relateChartsToItems.push(oRelation);
			logUpdate(this, '_addStepAsCustomItem <<', this._relateChartsToItems.length, oStep);
		},
		/**
		 * Replaces the chart and the custom list item. This is required when changing teh representation
		 * 	and its chart type, or switching to or from an alternate view (table).
		 * @param oStep
		 * @param nIndex
		 * @private
		 */
		_replaceChangedRepresentation : function(oStep, nIndex){
			logUpdate(this, '_replaceChangedRepresentation', nIndex, oStep);
			var oRelation = this._createRelation(oStep);
			trace.log("", ", relation=", oRelation);
			// TODO destroy the chart not used anymore, when one is referenced in _relateChartsToItems[nIndex] (it could be null, though)
			this._relateChartsToItems[nIndex] = oRelation;
			this.getView().removeCustomItem(nIndex);
			this.getView().insertCustomItem(oRelation.customListItem, nIndex);
			this._setSelectionsOnThumbnailAndEnforceRendering(oStep, nIndex);
			logUpdate(this, '_replaceChangedRepresentation', nIndex, oStep);
		},
		/**
		 * A representation change means that either:
		 * 		the chartType changes:
		 * 			then, switch to another VizFrame with different properties. The chart/VizFrame is associated to a different representation, too.
		 * 		a change from chart to alternateView (a table), or vice versa,
		 * 			then, switch from chart to icon, or vice versa.
		 * 		or change from chart to table, or treeTable, or vice versa,
		 * 			then, switch from chart to icon, or vice versa.
		 * 		Note change from table to tree table, or vice versa, or to alternate repr are impossible.
		 * This method determines the condition of a switch of representation.
		 * @param {number} nIndex
		 * @param {Object} oRepr
		 * @return {boolean} return true if a change is required.
		 */
		isChangeOfRepresentation : function(nIndex, oRepr){
			var result = oRepr.type !== this._relateChartsToItems[nIndex].typeOfChart
					|| oRepr.bIsAlternateView !== this._relateChartsToItems[nIndex].bIsAlternateView; // change
			trace.log("isChangeOfRepresentation", " return=", result);
			return result;
		},
		/**
		 * @memberOf sap.apf.ui.reuse.controller.carousel
		 * @method updateCustomListView
		 * @param {sap.apf.core.Step} oStep: current step instance
		 * @param {number} nIndex: step index in getSteps()
		 * @param {boolean} bStepChanged returns true if step has changed
		 * @description This is the central update method. The methods adds/deletes a step (thumbnail) or reflects changes on a step.
		 * Changes are: change of selection, change of data, or change of the representation.
		 * In the case of change of representation the chart and its custom list item are replaced.
		 * In the case of changed selections the selection are directly applied to the chart in the thumbnail (custom list item).
		 * The chart is always a clone of the chart of the corresponding step.
		 * Invariant: the length of getSteps() is kept equal to the length of associated list items.
		 * Note consistent double bookkeeping in _relateChartsToItems and view.customItemList
		 */
		updateCustomListView : function(oStep, nIndex, bStepChanged) {
			var oRepr;
			try {
				oRepr = oStep.getSelectedRepresentation();
				trace.logCall(' --API-- Carousel.updateCustomListView', ", nIndex=" + nIndex,
					" bStepChanged=" + bStepChanged, "apfId=", oRepr.apfId, bookkeeping2text(this), logSeparator);
				if (nIndex >= this._relateChartsToItems.length ) { // case added step not yet in items
					this._addCustomItemAndSetHighlighting(oStep, nIndex);
				} else if (this.isChangeOfRepresentation(nIndex, oRepr)) {
					// for unchanged step, detect a switch of the representation. Then, clone the chart taken form the representation.
					this._replaceChangedRepresentation(oStep, nIndex);
				} else if( !bStepChanged){
					this._setSelectionsOnThumbnailAndEnforceRendering(oStep, nIndex);
				} else { // changed step
					this.update1CustomItemChartWhenChange(oStep, nIndex);
				}
				this._pruneRelateChartsToItems();
				this._setBusyOnCustomListItem(this._relateChartsToItems[nIndex], false); // finally reset the busy indicator.
			} catch (exception) {
				window.console.error("sap.apf .. carousel.controller catch exception: ", exception);
				window.console.trace("trace ");
			}
			trace.logReturn('updateCustomListView', bookkeeping2text(this), logSeparator);
		},
		_pruneRelateChartsToItems : function () {
			if (this.oCoreApi.getSteps().length < this._relateChartsToItems.length) {
				this._relateChartsToItems.splice(this.oCoreApi.getSteps().length);
				trace.emphasize("updateCustomListView", " deletion of superfluous custom items");
			}
		},
		_addCustomItemAndSetHighlighting : function (oStep, nIndex) {
			var activeStepIndex;
			this._addStepAsCustomItem(oStep);
			this._setSelectionsOnThumbnailAndEnforceRendering(oStep, nIndex); // needed for openPath only
			activeStepIndex = this.getActiveStepIndex();
			this._removeHighlightingOfAnyStep(activeStepIndex); // needed for openPath only
			// Note that during openPath the index of the activeStep can be lower or higher than the current index.
			if (activeStepIndex <= nIndex) {
				this._setHighlightingOfActiveStep(activeStepIndex); // needed for openPath only
			}
		},
		/**
		 * Abstracts which part of the wrapped chart is set busy.
		 * @param {integer} nIndex index of step
		 * @param {boolean} isBusy
		 * @private
		 */
		_setBusyOnCustomListItem : function(relation, isBusy) {
			setTimeout(function(){
				relation.customListItem.setBusy(isBusy);
			}, 1);
		},
		setBusyFromIndex : function(startFrom) {
			var that = this;
			startFrom = startFrom || 0; // undefined when OpenPath
			this._relateChartsToItems.forEach(function (relation, i) {
				if (i >= startFrom){
					that._setBusyOnCustomListItem(relation, true);
				}
			});
		},
		/**
		/**
		 * @memberOf sap.apf.ui.reuse.controller.carousel
		 * @method showStepChartChartAfterUpdate
		 * @description This function is called when during a update the first step is updated.
		 * This method determines if new steps have been added, and then enforces displaying the main chart.
		 * Ut sets the busy indicator in the main chart for the active step if this is a step not yet processed by the path update.

		 */
		showStepChartChartAfterUpdate : function() {
			var aSteps = this.oCoreApi.getSteps();
			if (aSteps.length > this.getView().getCustomItemList().length) {
				this.oUiApi.getLayoutView().setBusy(true);
				// in the following is a subtle side effect. Presumably relating to the active step.
				// w/o the following line the main chart does not display :(
				jQuery(this.oUiApi.getStepContainer().getDomRef()).show(); // Show the step container
			}
		},
		/**
		 * Handles the event for moving a step, either by buttons (arrow) or drag & drop.
		 * Note counter-intuitive conditions: move "up" means decreasing the index, then test on index >=0,
		 * and "down" means increasing the index, hence test on < length.
		 * @param {Object} parameter The object's  member down is true for direction down or undefined for direction up.
		 */
		handleMove : function(parameter){
			var activeStepIndex = this.oCoreApi.getSteps().indexOf(this.oCoreApi.getActiveStep());
			var newPosDown = activeStepIndex + 1;
			var newPosUp = activeStepIndex - 1;
			trace.log("Carousel.handleMove", ", parameter", parameter, ", activeStepIndex=" + activeStepIndex, logSeparator4Event);
			if (parameter.down && newPosDown < this.oCoreApi.getSteps().length ){//invariant index >= 0
				this._moveStep(activeStepIndex, newPosDown, activeStepIndex);
			} else { // direction up
				if (parameter.down !== true && newPosUp >= 0 && newPosUp < this.oCoreApi.getSteps().length){ // range check
					this._moveStep(activeStepIndex, newPosUp, newPosUp);
				}
			}
		},
		_moveInBookkeeping : function(theSmallerIndex){ // assume theSmallerIndex+1 < length
			trace.logCall("_moveInBookkeeping", bookkeeping2text(this));
			var tmp;
			tmp = this._relateChartsToItems[theSmallerIndex+1];
			this._relateChartsToItems[theSmallerIndex+1] = this._relateChartsToItems[theSmallerIndex];
			this._relateChartsToItems[theSmallerIndex] = tmp;
			tmp = this.getView().getCustomItemList()[theSmallerIndex+1];
			this.getView().removeCustomItem(theSmallerIndex+1);
			this.getView().insertCustomItem(tmp, theSmallerIndex);
			trace.logReturn("_moveInBookkeeping", bookkeeping2text(this));
		},
		/**
		 * @param {number} dragIndex the index of the step which is moved.
		 * @param {number} dropIndex the index of the position where it is moved to.
		 */
		_moveStep : function(dragIndex, dropIndex, theSmallerOfBoth) {
			trace.logCall("Carousel._moveStep", " from " + dragIndex + " to " + dropIndex, "relation=", this._relateChartsToItems);
			if (dragIndex !== dropIndex) {
				this.setBusyFromIndex(theSmallerOfBoth);
				this._moveInBookkeeping(theSmallerOfBoth);
				var draggedStep = this.oCoreApi.getSteps()[dragIndex];
				var analysisPathController = this.oUiApi.getAnalysisPath().getController();
				trace.log("Carousel._moveStep", " move step in core and update path");
				this.oCoreApi.moveStepToPosition(
					draggedStep,
					dropIndex,
					analysisPathController.callBackForUpdatePath.bind(analysisPathController)
				);
			}
			trace.logReturn("_moveStep", "relation=", this._relateChartsToItems);
		},
		/**
		 *
		 * Change the selection from the previous active step to the new active step.
		 * Determine the next active step depending the index of removal:
		 * Removal of the active at index 0 switches to the next step which is moved to position 0 afterwards,
		 * removal of the last step of a path then switch to the previous step.
		 * Removal of the last one (path of length 1): no active step will be set.
		 * Further, the highlighting we be set to the active step.
		 * Note: oCoreApi.removeStep is called after calling this method,
		 * 		therefore the activeStep is still in the path at the index of removal.
		 * Thus, the next active step is at current index  1.
		 */
		setActiveStepAfterRemove: function(IndexOfRemoval){
			var activeStepIndex = this.getActiveStepIndex();
			if (IndexOfRemoval === activeStepIndex) {
				var indexOfNextActiveStepInCorePath; // it points to a list where the other step is not yet removed, so by 1 higher.
				if (activeStepIndex === 0) {//special case: 1st step is active and removed. 2nd gets active and displayed in thumbnail on pos 0.
					indexOfNextActiveStepInCorePath = 1;
					this._setHighlightingOfActiveStep(0);// highlight the remaining thumbnail
				} else if (activeStepIndex===this.oCoreApi.getSteps().length-1) { // the last one is active and removed. Then we step down by one.
					indexOfNextActiveStepInCorePath = activeStepIndex - 1;
					this._setHighlightingOfActiveStep(indexOfNextActiveStepInCorePath);// highlight the corresponding thumbnail one below
				} else { // otherwise the step on the position of removal gets active and highlighted
					indexOfNextActiveStepInCorePath = activeStepIndex + 1; // take the step one above the removed which is still in the list
					this._setHighlightingOfActiveStep(activeStepIndex);// highlight its thumbnail already at same position as the removed
				}
				this.oCoreApi.setActiveStep(this.oCoreApi.getSteps()[indexOfNextActiveStepInCorePath]);
			}
		},
		/**
		 * Removes the step from the core.path, and updates the active step and its highlighting.
		 * The bookkeeping must be done in the caller, assumed to be done before.
		 * Determines the currently active step before some step is removed.
		 * @param {integer} indexOfRemoval
		 */
		removeStep : function(indexOfRemoval) {
			var oAnalysisPath = this.oUiApi.getAnalysisPath().getController();
			var pathTitleCandidate = this.oCoreApi.getPathName();
			var activeStepIndex = this.getActiveStepIndex();
			// note: core path length is by one longer than the custom item list
			if (activeStepIndex=== indexOfRemoval && this.oCoreApi.getSteps().length > 1){//note length===1: is not yet removed
				this.setActiveStepAfterRemove(indexOfRemoval); // need to pass the indexOfRemoval
			}
			var stepToBeRemoved = this.oCoreApi.getSteps()[indexOfRemoval];
			this.oCoreApi.removeStep(stepToBeRemoved, oAnalysisPath.callBackForUpdatePath.bind(oAnalysisPath));
			this.oCoreApi.setDirtyState(true);
			oAnalysisPath.setPathTitle();
			if ( this.oCoreApi.getSteps().length >= 1){
				this.getView().moveDownButton.setEnabled(false);
				this.getView().moveUpButton.setEnabled(false);
			}
			this.oUiApi.getLayoutView().getController().enableDisableOpenIn(); //Enable/disable based on current active step
		},
		removeAllThumbnails : function() {
			this._removeItemsAndBookkeepingRelations();
		},
		/**
		 * Empty the custom list item and the bookkeeping. Items list is initial afterwards.
		 * Also destroy the chart and item.
		 * @private
		 */
		_removeItemsAndBookkeepingRelations : function() {
			var that = this;
			that.getView().oCustomItemList.removeAllItems();
			that._relateChartsToItems.forEach(function(relation){
				that._destroyItemAndChart(relation);
			});
			that._relateChartsToItems = [];
		},
		getTextsForCustomListItem : function(oStep) {
			var oSelf = this;
			var aThumbnails = [ "leftUpper", "rightUpper", "leftLower", "rightLower" ];
			var oThumbnailFromStep = oStep.thumbnail;
			var oThumbnailFromRepresentation = oStep.getSelectedRepresentationInfo().thumbnail;
			var oResult = {};
			aThumbnails.forEach(function(sThumbnail) {
				var bHasRepresentationThumbnail = oThumbnailFromRepresentation && oThumbnailFromRepresentation[sThumbnail];
				bHasRepresentationThumbnail = bHasRepresentationThumbnail && !oSelf.oCoreApi.isInitialTextKey(oThumbnailFromRepresentation[sThumbnail]);
				var bHasStepThumbnail = oThumbnailFromStep && oThumbnailFromStep[sThumbnail];
				bHasStepThumbnail = bHasStepThumbnail && !oSelf.oCoreApi.isInitialTextKey(oThumbnailFromStep[sThumbnail]);
				if (bHasRepresentationThumbnail) {
					oResult[sThumbnail] = oSelf.oCoreApi.getTextNotHtmlEncoded(oThumbnailFromRepresentation[sThumbnail]);
					return;
				} else if (bHasStepThumbnail) {
					oResult[sThumbnail] = oSelf.oCoreApi.getTextNotHtmlEncoded(oThumbnailFromStep[sThumbnail]);
					return;
				}
			});
			return oResult;
		},
		_getIndexOfCustomItem : function(sId){
			return this.getView().getCustomItemList().findIndex(function(item){// use getCustomItemList for test stubbing
				return item.sId === sId;
			});
		},
		/**
		 * Is an event handler.
		 * Handles the deletion of a step, the event comes from the delete button on the custom list item.
		 * Removes thumbnail, custom list item and step from core.path.
		 * @param idOfItem
		 */
		deleteCustomListItem : function(idOfItem) {
			var indexOfItem = this._getIndexOfCustomItem(idOfItem);
			trace.log("deleteCustomListItem", ", indexOfItem=", indexOfItem, logSeparator4Event);
			var relation = null;
			if (indexOfItem >= 0) {
				relation = this._relateChartsToItems[indexOfItem];
				this.getView().removeCustomItem(indexOfItem);
				this.deleteFromBookkeeping(indexOfItem);
				this.setBusyFromIndex(indexOfItem);
				this.removeStep(indexOfItem); // remove from path, which may send updates back to this controller.
				this._destroyItemAndChart(relation); // safe destroy as there shall be any more references.
			}
			logUpdate(this, "deleteCustomListItem", indexOfItem, null)
		},
		_destroyItemAndChart : function(relation) {
			if (relation.oChart){
				relation.oChart.destroy();
			}
			relation.customListItem.destroy();
			relation.customListItem = null; // defensive
			relation.oChart = null;
		},
		/**
		 * handles the delegated event of the selection of a new custom list control.
		 * @param event
		 */
		listItemPressed: function(event){
			var nSelectedIndex = this._getIndexOfCustomItem(event.getParameters().id);
			this.changeActiveStep(nSelectedIndex);
		},
		/**
		 * changes the active step, in core path and in carousel, updates the highlighting.
		 * @param event
		 */
		changeActiveStep: function(nIndex){
			trace.logCall("changeActiveStep -- changes the active step, index=", nIndex, logSeparator4Event);
			if (nIndex === this.getActiveStepIndex()) {
				trace.logReturn("changeActiveStep", ", index=", nIndex, "******");
				return;
			}
			var oStep = this.oCoreApi.getSteps()[nIndex];
			this._removeHighlightingOfActiveStep();
			this.oCoreApi.setActiveStep(oStep);
			this.oUiApi.selectionChanged(false); //this provokes an update, though there is no change of selection! Commonly used in our UI.
			this._setHighlightingOfActiveStep(nIndex); // call after bookkeeping has been updated
			trace.logReturn("changeActiveStep", ", index=", nIndex, "******");
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.analysisPath
		 *@method apfDestroy
		 *@description Used to clean up resources specific to APF during shutdown
		 */
		apfDestroy : function() {
			var stepGalleryController = this.getView().getStepGallery().getController();
			Utils.checkAndCloseDialog(stepGalleryController.oHierchicalSelectDialog);
		},
		/**
		 * When the active step changes, the active step shall be highlighted, and all others not.
		 * @private
		 */
		_removeHighlightingOfActiveStep : function() {
			var nActive = this.getActiveStepIndex();
			var oActiveRelation = this._relateChartsToItems[nActive];
			oActiveRelation.wrappedChartWithCornerTexts.setNonHighlighted();
		},
		_removeHighlightingOfAnyStep : function(nExclude) {
			trace.log("_removeHighlightingOfAnyStep", ", nExclude", nExclude);
			this._relateChartsToItems.forEach(function(relation, index) {
				if(index !== nExclude){
					relation.wrappedChartWithCornerTexts.setNonHighlighted();
				}
			})
		},
		_setHighlightingOfActiveStep : function(nActive) {
			trace.log("_setHighlightingOfActiveStep", ", nActive", nActive);
			var oActiveRelation = this._relateChartsToItems[nActive];
			oActiveRelation.wrappedChartWithCornerTexts.setHighlighted();
		}
	});
	return CarouselController;
});
