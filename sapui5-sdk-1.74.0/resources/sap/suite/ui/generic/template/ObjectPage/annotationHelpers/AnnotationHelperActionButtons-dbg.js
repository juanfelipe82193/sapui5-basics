/*
	This class contains all functions used during templating for action buttons.
*/
sap.ui.define(["sap/base/Log", "sap/ui/model/odata/AnnotationHelper", "sap/suite/ui/generic/template/js/AnnotationHelper", "sap/suite/ui/generic/template/lib/testableHelper"], function(Log, AnnotationHelperModel, AnnotationHelper, testableHelper) {
	"use strict";
	
	function addPathExpression(oInterface, oEntitySet, sExpression, mRestrictions, sSection){
		var oPath =  mRestrictions && mRestrictions[sSection];
		var sPath = oPath && oPath.Path;
		if (sPath) { // if there is a path, add it to the condition
			AnnotationHelper._actionControlExpand(oInterface, sPath, oEntitySet.entityType); // ensure that the fields used in the path are part of the binding string
			sExpression = "!!${" + sPath + "} && " + sExpression;
		}
		return sExpression;
	}

	// Returns whether the Edit button is needed at all
	// bParameterEdit is true, when an external edit has been specified in the manifest. This would overrule a boolean constant in mRestrictions, but not a path.	
	function isEditButtonRequired(oInterface, mRestrictions, oEntitySet, bParameterEdit, bIsDraftEnabled, iViewLevel){
		return (iViewLevel === 1 || !bIsDraftEnabled) && AnnotationHelper.areBooleanRestrictionsValidAndPossible(oInterface, mRestrictions, oEntitySet.entityType, "Updatable", bParameterEdit);                   
	}
	isEditButtonRequired.requiresIContext = true;
	
	// Returns the visibility for the EDIT button on main object page
	function getEditActionButtonVisibility(oInterface, mRestrictions, oEntitySet, bIsDraftEnabled, bShowDraftToggle) {
		var sExpression = "!${ui>/editable}";  // sExpression is the condition for showing the edit button. First condition: Edit button is not shown in edit mode.
		//bShowDraftToggle is use to show "Hide Draft Values" or "Show Draft Values" button in List Report table toolbar and "Display Saved version/Return to Draft" button in Object page header for a draft application.
		if (bIsDraftEnabled && bShowDraftToggle){ // Exclude the situation that there is already a draft for this user (in this case the CONTINUE_EDITING-button would be shown)
			sExpression = sExpression + " && !${DraftAdministrativeData/DraftIsCreatedByMe}";
			AnnotationHelper.formatWithExpandSimple(oInterface, {Path : "DraftAdministrativeData/DraftIsCreatedByMe"}, oEntitySet);// This is to add navigation parameters to the request.
		}
		sExpression = addPathExpression(oInterface, oEntitySet, sExpression, mRestrictions, "Updatable"); // if there is an updatable path, add it to the condition
		return "{= " + sExpression + "}";  // return an expression binding for the corresponding expression
	}
	getEditActionButtonVisibility.requiresIContext = true;
	
	// Returns the visibility for the DELETE button on main object page
	function getDeleteActionButtonVisibility(oInterface, mRestrictions, oEntitySet, bIsDraftEnabled, iViewLevel){
		var sExpression; // sExpression is the condition for showing the delete button
		if (bIsDraftEnabled){ // on main object page the delete button is shown in display mode on subobject pages in edit mode
			sExpression = iViewLevel === 1 ? "!${ui>/editable}" : "${ui>/editable}";
		} else { // in non-draft case the button is always shown with exception of create mode
			sExpression = "!${ui>/createMode}";
		}
		sExpression = addPathExpression(oInterface, oEntitySet, sExpression, mRestrictions, "Deletable"); // if there is a deletable path, add it to the condition
		if (sExpression === "${ui>/editable}"){ // in this case no expression binding is needed
			return "{ui>/editable}";
		}
		return "{= " + sExpression + "}";  // return an expression binding for the corresponding expression
	}
	getDeleteActionButtonVisibility.requiresIContext = true;
	
	function getActionControlBreakoutVisibility(sActionApplicablePath) {
		return !sActionApplicablePath || "{path: '" + sActionApplicablePath + "'}";
	}
	
	function getCallAction(oInterface, oDataField){
		var sAction = AnnotationHelperModel.format(oInterface, oDataField.Action);
		var sInvocationGrouping = (oDataField.InvocationGrouping && oDataField.InvocationGrouping.EnumMember) || "";
		// ${$source>/text} evaluates to the text property of the source of the event
		return "._templateEventHandlers.onCallAction('" + sAction + "', ${$source>/text}, '" + sInvocationGrouping + "')";
	}
	getCallAction.requiresIContext = true;
	
	return {
		isEditButtonRequired: isEditButtonRequired,
		getEditActionButtonVisibility: getEditActionButtonVisibility,
		getDeleteActionButtonVisibility: getDeleteActionButtonVisibility,
		getActionControlBreakoutVisibility: getActionControlBreakoutVisibility,
		getCallAction: getCallAction
	};
}, /* bExport= */ true);