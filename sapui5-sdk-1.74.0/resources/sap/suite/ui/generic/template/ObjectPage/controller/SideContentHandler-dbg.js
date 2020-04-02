sap.ui.define(["sap/ui/base/Object", "sap/ui/layout/DynamicSideContent", "sap/base/util/extend"
	], function(BaseObject, DynamicSideContent, extend) {
		"use strict";

		/*
		 * This helper class of the ControllerImplementation handles all runtime logic which is connected to the use of the DynamicSideContentControl (side content feature).
		 */

		// oController is the controller of the enclosing ObjectPage
		// oTemplateUtils are the template utils as passed to the controller implementation
		// fnStateChanged is a function that should be called, when the storable state changes
		function getMethods(oController, oTemplateUtils, fnStateChanged) {

			// Unified access to the info object for a sideContent (see function getControlInformation in class sap.suite.ui.generic.template.lib.CommonUtils for more information on info objects).
			// The info object is initialized using fnInitSideContentInfoObject
			// The following methods are contained in the info object:
			// - adaptToBreakPoint: (called by the) event handler for the breakpointChanged event of the side content
			// - formatSideContentActionButtonText(bVisible): (called by) the formatter for the text property of the side content action button
			// - getShowSideContent: get the showSideContent property of the control
			// - setShowSideContent(bShowSideContent): set the showSideContent property of the control
			// - toggleVisibility: (called by) the event handler of the side content action button
			function getSideContentInfoObject(oSideContent){
				return oTemplateUtils.oCommonUtils.getControlInformation(oSideContent);
			}

			// Initialize the info object for a block if it is actually a sideContent. Called during the initialization of the enclosing subsection info object.
			// In case that oBlock is actually a side content this ensures that:
			// - getSideContentInfoObject will provide the info object for oBlock
			// - category "sideContent" will be assigned to the info object of oBlock
			function fnInitSideContentInfoObject(oBlock){
				if (!(oBlock instanceof DynamicSideContent)){
					return;
				}
				oTemplateUtils.oCommonUtils.getControlInformation(oBlock, function (oSideContentInfoObject, aCategories, oSideContent){
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					var oView = oController.getView();
					var sGlobalSideContentId = oSideContent.getId();
					var sSideContentId = oView.getLocalId(sGlobalSideContentId);
					// We introduce an object in the template private model reflecting the state of oSideContent. This will contain three properties, which are used in property bindings in XML.
					// See docu of function buildSideContentExpression in sap.suite.ui.generic.template.ObjectPage.annotationHelpers.AnnotationHelperSideContent for the properties that are held in this object.
					var sModelPath = "/generic/controlProperties/" + sSideContentId; // path to this object
					// Prepare the object
					oTemplatePrivateModel.setProperty(sModelPath, { });
					// First we check for the configuration of oSideContent, regarding the possibility to show both contents. We currently assume that this is static. Therefore, we read it only once.
					var oSideContentVisibility = oSideContent.getSideContentVisibility();
					// Functions that update properties showBothContentsPossible and visible in the template private model
					var setShowBothContentsPossible = oTemplatePrivateModel.setProperty.bind(oTemplatePrivateModel, sModelPath + "/showBothContentsPossible");
					var setVisible = oTemplatePrivateModel.setProperty.bind(oTemplatePrivateModel, sModelPath + "/visible");
					// Define setter and getter methods for the property showSideContent showSideContent in the template private model.
					// These functions are added to the info object of the side content. This is needed for getCurrentState resp. applyState (see below).
					var sShowSideContentPropertyPath = sModelPath + "/showSideContent";
					oSideContentInfoObject.getShowSideContent = oTemplatePrivateModel.getProperty.bind(oTemplatePrivateModel, sShowSideContentPropertyPath);
					oSideContentInfoObject.setShowSideContent = oTemplatePrivateModel.setProperty.bind(oTemplatePrivateModel, sShowSideContentPropertyPath);
					// Initializations
					oSideContentInfoObject.setShowSideContent(false);
					setVisible(false);
					// Ensure that property showBothContentsPossible is always up to date. Therefore, function adaptToBreakPoint is added to the info object of the side content.
					// It will be called whenever the breakpointChanged event of the side content is triggered.
					var SideContentVisibility = sap.ui.layout.SideContentVisibility; // simplified access to the constants in this enum
					switch (oSideContentVisibility){
						case SideContentVisibility.AlwaysShow:
							oSideContentInfoObject.adaptToBreakPoint = Function.prototype; // no need to adapt
							setShowBothContentsPossible(true); // initialize
							break;
						case SideContentVisibility.NeverShow:
							oSideContentInfoObject.adaptToBreakPoint = Function.prototype; // no need to adapt
							setShowBothContentsPossible(false); // initialize
							break;
						default: // if none of the above edge cases applies we have to prepare method oSideContentInfoObject.adaptToBreakPoint a bit more specific
							var mBreakpointsWithBothContentsPossible = Object.create(null); // maps all breakpoints for which main content and side content may be visible at the same time.
							mBreakpointsWithBothContentsPossible.XL = true;
							mBreakpointsWithBothContentsPossible.L = oSideContentVisibility !== SideContentVisibility.ShowAboveL;
							mBreakpointsWithBothContentsPossible.M = oSideContentVisibility === SideContentVisibility.ShowAboveS;
							mBreakpointsWithBothContentsPossible.S = false;
							oSideContentInfoObject.adaptToBreakPoint = function(){ // prepare to adapt
								// keep track on the automatic visibility changes of the side content on resize
								setVisible(oSideContent.isSideContentVisible());
								// adapt the showBothContentsPossible property in the template private model
								var sCurrentBreakpoint = oSideContent.getCurrentBreakpoint();
								setShowBothContentsPossible(mBreakpointsWithBothContentsPossible[sCurrentBreakpoint]);
							};
							oSideContentInfoObject.adaptToBreakPoint(); // initialize
					}
					// add the event handler for the side content action button to the info object
					oSideContentInfoObject.toggleVisibility = function(){
						// the task is to toggle the visible property
						var bNewVisibility = !oSideContent.isSideContentVisible();
						setVisible(bNewVisibility);
						// actually the showSideContent property is what really triggers an adaptation of the visibility of the side content
						oSideContentInfoObject.setShowSideContent(bNewVisibility);
						fnStateChanged(); // actively changing the visibility of the side content should be considered as a state change of the page
					};
					// add the formatter for the text property of the side content action button
					var sShowSideContentText = oTemplateUtils.oCommonUtils.getContextText("ShowSideContent", sGlobalSideContentId, "SHOW_SIDE_CONTENT");
					var sHideSideContentText = oTemplateUtils.oCommonUtils.getContextText("HideSideContent", sGlobalSideContentId, "HIDE_SIDE_CONTENT");
					oSideContentInfoObject.formatSideContentActionButtonText = function(bVisible){
						return bVisible ? sHideSideContentText : sShowSideContentText;
					};

					// Ensure that the info objects for all sideContents can be found under category "sideContent"
					aCategories.push("sideContent");
				});
			}
			// event handler for the breakpointChanged event of a SideContent
			function fnSideContentBreakpointChanged(oEvent){
				var oSideContent = oEvent.getSource();
				var oSideContentInfoObject = getSideContentInfoObject(oSideContent);
				setTimeout(function(){ // postpone the adaptation of the side content until oSideContent has done its internal adaptations
					oSideContentInfoObject.adaptToBreakPoint();
				}, 0);
			}
			// event handler for the press event of the toggle button for a SideContent
			// sSideContentId is the id of the DynamicSideContent instance the toggle button belongs to
			function onToggleDynamicSideContent(sSideContentId) {
				var oSideContent = oController.byId(sSideContentId);
				var oSideContentInfoObject = getSideContentInfoObject(oSideContent);
				oSideContentInfoObject.toggleVisibility();
			}

			// retrieve the current state information for all side content controls on the page.
			// More precisely: Return a state object, that maps the ids of all (logically) open side content controls to true. If no such control exists a faulty object is returned.
			function getCurrentState(){
				var mSideContentState; // maps the ids of the side controls that currently show side content onto true. Faulty, if no such control exists
				oTemplateUtils.oCommonUtils.executeForAllInformationObjects("sideContent", function(oSideContentInfoObject, oSideContent){ // iterate over all info objects for side content
					var bShowSideContent = oSideContentInfoObject.getShowSideContent();
					if (bShowSideContent){
						mSideContentState = mSideContentState || Object.create(null);
						mSideContentState[oSideContent.getId()] = true;
					}
				});
				return mSideContentState && {
					data: mSideContentState,
					lifecycle: {
						permanent: true,
						pagination: true
					}
				};
			}

			// apply the state information that has been stored by this class
			function applyState(oState, bIsSameAsLast){
				oTemplateUtils.oCommonUtils.executeForAllInformationObjects("sideContent", function(oSideContentInfoObject, oSideContent){ // iterate over all info objects for side content
					if (!bIsSameAsLast){ // state only needs to be applied, if we do not return to exactly the same page that we left
						// reset all side content controls to not show side content, unless the state contains the opposite information
						var bShowSideContent = !!oState && oState[oSideContent.getId()];
						oSideContentInfoObject.setShowSideContent(bShowSideContent);
					}
					oSideContentInfoObject.adaptToBreakPoint(); // Since browser size might have been changed while we have been away from this page we still need to adapt
				});
			}

			// Formatter for the text property of the side content action button
			function formatSideContentActionButtonText(sSideContentId, bVisible){
				var oSideContent = oController.byId(sSideContentId);
				var oSideContentInfoObject = getSideContentInfoObject(oSideContent);
				return oSideContentInfoObject.formatSideContentActionButtonText(bVisible);
			}

			// public instance methods
			return {
				initSideContentInfoObject: fnInitSideContentInfoObject,
				onToggleDynamicSideContent: onToggleDynamicSideContent,
				sideContentBreakpointChanged: fnSideContentBreakpointChanged,
				getCurrentState: getCurrentState,
				applyState: applyState,
				formatSideContentActionButtonText: formatSideContentActionButtonText
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.ObjectPage.controller.SideContentHandler", {
			constructor: function(oController, oTemplateUtils, fnStateChanged) {
				extend(this, getMethods(oController, oTemplateUtils, fnStateChanged));
			}
		});
	});
