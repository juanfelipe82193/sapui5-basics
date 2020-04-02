//@ui5-bundle sap/ui/comp/library-preload.support.js
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
/**
 * Adds support rules of the sap.m library to the support infrastructure.
 */
sap.ui.predefine('sap/ui/comp/library.support',[
	'./rules/SmartForm.support',
	'./rules/SmartLink.support',
	'./rules/SmartFilterBar.support',
	"./rules/SmartField.support"
], function(
		SmartFormSupport,
		SmartLinkSupport,
		SmartFilterBarSupport,
		SmartFieldSupport
) {
	"use strict";

	return {
		name: "sap.ui.comp",
		niceName: "UI5 Smart Controls Library",
		ruleset: [
			SmartFormSupport,
			SmartLinkSupport,
			SmartFilterBarSupport,
			SmartFieldSupport
		]
	};

}, true);
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
/**
 * Defines support rules of the SmartField control of sap.ui.layout library.
 */
sap.ui.predefine('sap/ui/comp/rules/SmartField.support',["sap/ui/support/library"],
	function(SupportLib) {
	"use strict";

	// shortcuts
	var Categories = SupportLib.Categories; // Accessibility, Performance, Memory, ...
	var Severity = SupportLib.Severity; // Hint, Warning, Error
	var Audiences = SupportLib.Audiences; // Control, Internal, Application

	//**********************************************************
	// Rule Definitions
	//**********************************************************

	/* eslint-disable no-lonely-if */

	var oSmartFieldLabelRule = {
		id: "smartFieldLabel",
		audiences: [Audiences.Application],
		categories: [Categories.Usability],
		enabled: true,
		minversion: "1.48",
		title: "SmartField: Use of SmartLabel",
		description: "SmartField must be labelled by the SmartLabel control, not by the sap.m.Label control",
		resolution: "Use a SmartLabel control to label the SmartField control",
		resolutionurls: [{
				text: "API Reference: SmartField",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartfield.SmartField.html"
			}],
		check: function (oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartfield.SmartField")
			.forEach(function(oSmartField) {
				var sId = oSmartField.getId();
				var aLabels = sap.ui.core.LabelEnablement.getReferencingLabels(oSmartField);

				for (var i = 0; i < aLabels.length; i++) {
					var oLabel = sap.ui.getCore().byId(aLabels[i]);
					if (!oLabel.isA("sap.ui.comp.smartfield.SmartLabel")) {
						oIssueManager.addIssue({
							severity: Severity.Medium,
							details: "SmartField " + sId + " labelled by wrong Label.",
							context: {
								id: oLabel.getId()
							}
						});
					}
				}

			});
		}
	};

	var oSmartFieldValueBindingContext = {
		id: "smartFieldValueBindingContext",
		audiences: [Audiences.Application],
		categories: [Categories.Bindings],
		minversion: "1.60",
		async: false,
		title: "SmartField: the value property is bound but there is no binding context available",
		description: "When the value property of the SmartField control is bound but there is no binding context available, the control can't " +
			"resolve its service metadata or property values so the control behaves as if it were used without data binding and " +
			"service metadata. This will result in a control without value.",
		resolution: "Make sure the control has binding context",
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartfield.SmartField").filter(function(oSmartField) {
				return oSmartField.isBound("value");
			}).forEach(function(oSmartField) {
				var sId = oSmartField.getId();
				if (!oSmartField.getBindingContext()) {
					oIssueManager.addIssue({
						severity: Severity.High,
						details: "SmartField " + sId + " has its value property bound but its binding context is undefined.",
						context: {id: sId}
					});
				}
			});
		}
	};

	var oSmartFieldVisibleBindingContext = {
		id: "smartFieldVisibleBindingContext",
		audiences: [Audiences.Application],
		categories: [Categories.Bindings],
		minversion: "1.60",
		async: false,
		title: "SmartField: the visible property is bound but there is no binding context available",
		description: "When the visible property of the SmartField control is bound but there is no binding context available, the control can't " +
			"resolve its service metadata or property values so the control behaves as if it were used without data binding and " +
			"service metadata. This will result in a visible control as the default value for the visible property is `true`.",
		resolution: "Make sure the control has a binding context",
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartfield.SmartField").filter(function(oSmartField) {
				return oSmartField.isBound("visible");
			}).forEach(function(oSmartField) {
				var sId = oSmartField.getId();
				if (!oSmartField.getBindingContext()) {
					oIssueManager.addIssue({
						severity: Severity.High,
						details: "SmartField " + sId + " has its visible property bound but its binding context is undefined.",
						context: {id: sId}
					});
				}
			});
		}
	};

	var oSmartFieldMandatoryBindingContext = {
		id: "smartFieldMandatoryBindingContext",
		audiences: [Audiences.Application],
		categories: [Categories.Bindings],
		minversion: "1.60",
		async: false,
		title: "SmartField: the mandatory property is bound but there is no binding context available",
		description: "When the mandatory property of the SmartField control is bound but there is no binding context available, the control can't " +
			"resolve its service metadata or property values so the control behaves as if it were used without data binding and " +
			"service metadata. This will result in a control which is not marked as mandatory as the default value for the " +
			"property is `false`.",
		resolution: "Make sure the control has a binding context",
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartfield.SmartField").filter(function(oSmartField) {
				return oSmartField.isBound("mandatory");
			}).forEach(function(oSmartField) {
				var sId = oSmartField.getId();
				if (!oSmartField.getBindingContext()) {
					oIssueManager.addIssue({
						severity: Severity.High,
						details: "SmartField " + sId + " has its mandatory property bound but its binding context is undefined.",
						context: {id: sId}
					});
				}
			});
		}
	};

	var oSmartFieldEditableBindingContext = {
		id: "smartFieldEditableBindingContext",
		audiences: [Audiences.Application],
		categories: [Categories.Bindings],
		minversion: "1.60",
		async: false,
		title: "SmartField: the editable property is bound but there is no binding context available",
		description: "When the editable property of the SmartField control is bound but there is no binding context available, the control can't " +
			"resolve its service metadata or property values so the control behaves as if it were used without data binding and " +
			"service metadata. This will result in a control which is editable as the default value for the property is `true`.",
		resolution: "Make sure the control has a binding context",
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartfield.SmartField").filter(function(oSmartField) {
				return oSmartField.isBound("editable");
			}).forEach(function(oSmartField) {
				var sId = oSmartField.getId();
				if (!oSmartField.getBindingContext()) {
					oIssueManager.addIssue({
						severity: Severity.High,
						details: "SmartField " + sId + " has its editable property bound but its binding context is undefined.",
						context: {id: sId}
					});
				}
			});
		}
	};

	return [
		oSmartFieldLabelRule,
		oSmartFieldValueBindingContext,
		oSmartFieldVisibleBindingContext,
		oSmartFieldMandatoryBindingContext,
		oSmartFieldEditableBindingContext
	];

}, true);
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
/**
 * Defines support rules of the SmartFilterBar control of sap.ui.comp library.
 */
sap.ui.predefine('sap/ui/comp/rules/SmartFilterBar.support',["sap/ui/support/library"], function(SupportLib) {
	"use strict";

	//**********************************************************
	// Rule Definitions
	//**********************************************************

	/* eslint-disable no-lonely-if */

	var fnGetView = function(oControl) {
		var oObj = oControl.getParent();
		while (oObj) {
			if (oObj.isA("sap.ui.core.mvc.View")) {
				return oObj;
			}
			oObj = oObj.getParent();
		}
		return null;
	};

	var oSmartFilterBarAndSmartTableRule = {
		id: "equalEntitySetInSmartFilterBarAndSmartTable",
		audiences: [
			SupportLib.Audiences.Application
		],
		categories: [
			SupportLib.Categories.Consistency
		],
		minversion: "1.56",
		async: false,
		title: "SmartFilterBar: Entity set used in SmartTable and SmartFilterBar",
		description: "Entity set of SmartTable has to be the same as the entity set of SmartFilterBar, which is associated via the property smartFilterId",
		resolution: "Make sure that the entity sets used in SmartTable and SmartFilterBar are the same",
		resolutionurls: [
			{
				text: "API Reference: SmartTable",
				href: "https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.smarttable.SmartTable/controlProperties"
			},
			{
				text: "API Reference: SmartFilterBar",
				href: "https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.smartfilterbar.SmartFilterBar/controlProperties"
			}
		],
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smarttable.SmartTable").filter(function(oSmartTable) {
				return !!oSmartTable.getSmartFilterId();
			}).forEach(function(oSmartTable) {
				var oView = fnGetView(oSmartTable);
				if (!oView) {
					return;
				}
				var oSmartFilter = oView.byId(oSmartTable.getSmartFilterId());
				if (!oSmartFilter) {
					oIssueManager.addIssue({
						severity: SupportLib.Severity.Low,
						details: "In SmartTable the smartFilterId property is linked to the control '" + oSmartTable.getSmartFilterId() + "' which does not exist",
						context: {
							id: oSmartTable.getId()
						}
					});
					return;
				}
				if (oSmartTable.getEntitySet() !== oSmartFilter.getEntitySet()) {
					oIssueManager.addIssue({
						severity: SupportLib.Severity.Low,
						details: "The entity set '" + oSmartFilter.getEntitySet() + "' of the SmartFilterBar control is not the same as the entity set '" + oSmartTable.getEntitySet() + "' of the SmartTable control",
						context: {
							id: oSmartTable.getId()
						}
					});
				}
			});

		}
	};

	var oSmartFilterBarAndSmartChartRule = {
		id: "equalEntitySetInSmartFilterBarAndSmartChart",
		audiences: [
			SupportLib.Audiences.Application
		],
		categories: [
			SupportLib.Categories.Consistency
		],
		minversion: "1.56",
		async: false,
		title: "SmartFilterBar: Entity set used in SmartChart and SmartFilterBar",
		description: "Entity set of SmartChart has to be the same as the entity set of SmartFilterBar, which is associated via the property smartFilterId",
		resolution: "Make sure that the entity sets used in SmartChart and SmartFilterBar are the same",
		resolutionurls: [
			{
				text: "API Reference: SmartChart",
				href: "https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.smartchart.SmartChart/controlProperties"
			},
			{
				text: "API Reference: SmartFilterBar",
				href: "https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.smartfilterbar.SmartFilterBar/controlProperties"
			}
		],
		check: function(oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartchart.SmartChart").filter(function(oSmartChart) {
				return !!oSmartChart.getSmartFilterId();
			}).forEach(function(oSmartChart) {
				var oView = fnGetView(oSmartChart);
				if (!oView) {
					return;
				}
				var oSmartFilter = oView.byId(oSmartChart.getSmartFilterId());
				if (!oSmartFilter) {
					oIssueManager.addIssue({
						severity: SupportLib.Severity.Low,
						details: "In SmartChart the smartFilterId property is linked to the control '" + oSmartChart.getSmartFilterId() + "' which does not exist",
						context: {
							id: oSmartChart.getId()
						}
					});
					return;
				}
				if (oSmartChart.getEntitySet() !== oSmartFilter.getEntitySet()) {
					oIssueManager.addIssue({
						severity: SupportLib.Severity.Low,
						details: "The entity set '" + oSmartFilter.getEntitySet() + "' of the SmartFilterBar control is not same as the entity set '" + oSmartChart.getEntitySet() + "' of the SmartChart control",
						context: {
							id: oSmartChart.getId()
						}
					});
				}
			});

		}
	};

	return [
		oSmartFilterBarAndSmartTableRule, oSmartFilterBarAndSmartChartRule
	];

}, true);
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
/**
 * Defines support rules of the SmartForm controls of sap.ui.comp library.
 */
sap.ui.predefine('sap/ui/comp/rules/SmartForm.support',["sap/ui/support/library"],
	function(SupportLib) {
	"use strict";

	// shortcuts
	var Categories = SupportLib.Categories; // Accessibility, Performance, Memory, ...
	var Severity = SupportLib.Severity; // Hint, Warning, Error
	var Audiences = SupportLib.Audiences; // Control, Internal, Application

	//**********************************************************
	// Rule Definitions
	//**********************************************************

	/* eslint-disable no-lonely-if */

	var oSmartFormResponsiveLayoutRule = {
		id: "smartFormResponsiveLayout",
		audiences: [Audiences.Application],
		categories: [Categories.Usability],
		enabled: true,
		minversion: "1.48",
		title: "SmartForm: Use of ResponsiveLayout",
		description: "ResponsiveLayout should not be used any longer because of UX requirements",
		resolution: "If you set useHorizontalLayout to true add a Layout to the SmartForm and fill gridDataSpan",
		resolutionurls: [{
				text: "API Reference: SmartForm",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.SmartForm.html"
			},
			{
				text: "API Reference: Layout",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.Layout.html"
			}],
		check: function (oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartform.SmartForm")
			.forEach(function(oSmartForm) {
				var oLayout = oSmartForm.getLayout();
				var bUseHorizontalLayout = oSmartForm.getUseHorizontalLayout();
				var sId = oSmartForm.getId();

				if (bUseHorizontalLayout && (!oLayout || !oLayout.getGridDataSpan())) {
					oIssueManager.addIssue({
						severity: Severity.Medium,
						details: "SmartForm " + sId + " uses ResponsiveLayout.",
						context: {
							id: sId
						}
					});
				}
			});
		}
	};

	var oSmartFormToolbarRule = {
		id: "smartFormToolbar",
		audiences: [Audiences.Application],
		categories: [Categories.Functionality],
		enabled: true,
		minversion: "1.48",
		title: "SmartForm: Toolbar assigned to group",
		description: "On SmartForm groups toolbars are not supported.",
		resolution: "Use the Label proprty to ad a title to the group.",
		resolutionurls: [{
				text: "API Reference: SmartForm",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.SmartForm.html"
			}],
		check: function (oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartform.SmartForm")
			.forEach(function(oSmartForm) {
				var aGroups = oSmartForm.getGroups();
				var sId = oSmartForm.getId();
				for (var i = 0; i < aGroups.length; i++) {
					if (aGroups[i].getToolbar()) {
						var sGroupId = aGroups[i].getId();
						oIssueManager.addIssue({
							severity: Severity.High,
							details: "SmartForm " + sId + " Group " + sGroupId + " has Toolbar assigned.",
							context: {
								id: sGroupId
							}
						});
					}
				}
			});
		}
	};

	var oSmartFormTitleRule = {
		id: "smartFormTitle",
		audiences: [Audiences.Application],
		categories: [Categories.Functionality],
		enabled: true,
		minversion: "1.48",
		title: "SmartForm: Title assigned to group",
		description: "On SmartForm groups title elements are not supported.",
		resolution: "Use the Label property to ad a title to the group.",
		resolutionurls: [{
				text: "API Reference: SmartForm",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.SmartForm.html"
			}],
		check: function (oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartform.SmartForm")
			.forEach(function(oSmartForm) {
				var aGroups = oSmartForm.getGroups();
				var sId = oSmartForm.getId();
				for (var i = 0; i < aGroups.length; i++) {
					var vTitle = aGroups[i].getTitle();
					if (vTitle && (typeof vTitle !== "string")) {
						var sGroupId = aGroups[i].getId();
						oIssueManager.addIssue({
							severity: Severity.High,
							details: "SmartForm " + sId + " Group " + sGroupId + " has Title element assigned.",
							context: {
								id: sGroupId
							}
						});
					}
				}
			});
		}
	};

	var oSmartFormLabelOrAriaLabelRule = {
		id: "smartFormLabelOrAriaLabel",
		audiences: [Audiences.Application],
		categories: [Categories.Accessibility],
		enabled: true,
		minversion: "1.48",
		title: "SmartForm: Group must have a Label",
		description: "A Group must have some Title information." +
		             "\n This can be a Label on the Group or some Title assigned via AriaLabelledBy." +
		             "\n If no Label is assigned to the Group there must be at least a Title set" +
		             " on the SmartForm.",
		resolution: "Set a Title element for a SmartForm control or a Label control for the Group element or assign it via AriaLabelledBy",
		resolutionurls: [{
			text: "API Reference: SmartForm",
			href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.SmartForm.html"
		},
		{
			text: "API Reference: Group",
			href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.Group.html"
		}],
		check: function (oIssueManager, oCoreFacade, oScope) {
			oScope.getElementsByClassName("sap.ui.comp.smartform.Group")
			.forEach(function(oGroup) {
				var oForm = oGroup.getParent();
				if (!oForm) {
					return;
				}

				var oSmartForm = oForm.getParent();
				var sId;

				if (!oGroup.getLabel() && oGroup.getAriaLabelledBy().length == 0 && !oSmartForm.getTitle()) {
					oIssueManager.addIssue({
						severity: Severity.High,
						details: "In SmartForm " + sId + ", Group" + oGroup.getId() + " has no Title assigned.",
						context: {
							id: oGroup.getId()
						}
					});
				}
			});
		}
	};

	var oSmartFormUseHorizontalLayoutRule = {
			id: "smartFormUseHorizontalLayout",
			audiences: [Audiences.Application],
			categories: [Categories.Performance],
			enabled: true,
			minversion: "1.51",
			title: "SmartForm: UseHorizontalLayout used inconsistently",
			description: "The UseHorizontalLayout property must be set in the SmartForm control and will be passed to the Group and GroupElement elements by internal control implementation logic." +
			             "\n Setting UseHorizontalLayout directly or with different values at Group or GroupElement elements level will cause bad performance.",
			resolution: "Set UseHorizontalLayout only for the SmartForm control or with the same value for the Group and GroupElement elements",
			resolutionurls: [{
				text: "API Reference: SmartForm",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.SmartForm.html"
			},
			{
				text: "API Reference: Group",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.Group.html"
			},
			{
				text: "API Reference: GroupElement",
				href:"https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.ui.comp.smartform.GroupElement.html"
			}],
			check: function (oIssueManager, oCoreFacade, oScope) {
				oScope.getElementsByClassName("sap.ui.comp.smartform.SmartForm")
				.forEach(function(oSmartForm) {
					var bSmartFormUseHorizontalLayout = oSmartForm.getUseHorizontalLayout();
					var bSmartFormUseHorizontalLayoutSet = !oSmartForm.isPropertyInitial("useHorizontalLayout");
					var aGroups = oSmartForm.getGroups();
					for (var i = 0; i < aGroups.length; i++) {
						var oGroup = aGroups[i];
						var bGroupUseHorizontalLayout = oGroup.getUseHorizontalLayout();
						var bGroupUseHorizontalLayoutSet = !oGroup.isPropertyInitial("useHorizontalLayout");
						if (bSmartFormUseHorizontalLayout != bGroupUseHorizontalLayout) {
							oIssueManager.addIssue({
								severity: Severity.High,
								details: "Group" + oGroup.getId() + ": useHorizontalLayout set different than in the SmartForm control.",
								context: {
									id: oGroup.getId()
								}
							});
						}
						if (!bSmartFormUseHorizontalLayoutSet && bGroupUseHorizontalLayoutSet) {
							oIssueManager.addIssue({
								severity: Severity.Medium,
								details: "Group" + oGroup.getId() + ": useHorizontalLayout set but not in the SmartForm control.",
								context: {
									id: oGroup.getId()
								}
							});
						}

						var aGroupElements = oGroup.getGroupElements();
						for (var j = 0; j < aGroupElements.length; j++) {
							var oGroupElement = aGroupElements[j];
							var bGroupElementUseHorizontalLayout = oGroupElement.getUseHorizontalLayout();
							var bGroupElementUseHorizontalLayoutSet = !oGroupElement.isPropertyInitial("useHorizontalLayout");
							if (bSmartFormUseHorizontalLayout != bGroupElementUseHorizontalLayout) {
								oIssueManager.addIssue({
									severity: Severity.High,
									details: "GroupElement" + oGroupElement.getId() + ": useHorizontalLayout set different than in the SmartForm control.",
									context: {
										id: oGroupElement.getId()
									}
								});
							}
							if (!bGroupUseHorizontalLayoutSet && bGroupElementUseHorizontalLayoutSet) {
								oIssueManager.addIssue({
									severity: Severity.Medium,
									details: "GroupElement" + oGroupElement.getId() + ": useHorizontalLayout set but not in the SmartForm control.",
									context: {
										id: oGroupElement.getId()
									}
								});
							}
						}
					}
				});
			}
		};

	return [
		oSmartFormResponsiveLayoutRule,
		oSmartFormToolbarRule,
		oSmartFormTitleRule,
		oSmartFormLabelOrAriaLabelRule,
		oSmartFormUseHorizontalLayoutRule
	];

}, true);
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
/**
 * Defines support rules of the SmartLink control of sap.ui.comp library.
 */
sap.ui.predefine('sap/ui/comp/rules/SmartLink.support',["sap/base/Log", "sap/ui/support/library"], function(Log, SupportLib) {
	"use strict";

	//**********************************************************
	// Rule Definitions
	//**********************************************************

	/* eslint-disable no-lonely-if */

	var oSmartLinkRule = {
		id: "smartLinkCalculationOfSemanticAttributes",
		audiences: [
			SupportLib.Audiences.Application
		],
		categories: [
			SupportLib.Categories.Usability
		],
		minversion: "1.56",
		async: true,
		title: "SmartLink: calculation of semantic attributes",
		description: "This check is for information purposes only providing information which might be helpful in case of intent navigation issues",
		resolution: "See explanation for a specific semantic attribute marked with \ud83d\udd34 in the details section",
		resolutionurls: [
			{
				text: "API Reference: SmartLink",
				href: "https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.navpopover.SmartLink"
			}
		],
		check: function(oIssueManager, oCoreFacade, oScope, fnResolve) {

			var iLogLevel = Log.getLevel();
			Log.setLevel(Log.Level.INFO);

			var aPromises = [];
			var aNavigationPopoverHandlers = [];
			var aSemanticObjects = [];

			oScope.getElementsByClassName("sap.ui.comp.navpopover.SmartLink").forEach(function(oSmartLink) {
				if (aSemanticObjects.indexOf(oSmartLink.getSemanticObject()) > -1) {
					return;
				}
				aSemanticObjects.push(oSmartLink.getSemanticObject());

				var oNavigationPopoverHandler = oSmartLink.getNavigationPopoverHandler();
				aNavigationPopoverHandlers.push(oNavigationPopoverHandler);
				aPromises.push(oNavigationPopoverHandler._initModel());
			});
			Promise.all(aPromises).then(function(aValues) {
				for (var i = 0; i < aValues.length; i++) {
					var oNavigationPopoverHandler = aNavigationPopoverHandlers[i];
					var sText = oNavigationPopoverHandler._getLogFormattedText();
					if (sText) {
						oIssueManager.addIssue({
							severity: SupportLib.Severity.Low,
							details: "Below you can see detailed information regarding semantic attributes which have been calculated for one or more semantic objects defined in a SmartLink control. Semantic attributes are used to create the URL parameters.\nAdditionally you can see all links containing the URL parameters.\n" + sText,
							context: {
								id: oNavigationPopoverHandler.getId()
							}
						});
					}
				}

				Log.setLevel(iLogLevel);
				fnResolve();
			});
		}
	};

	return [
		oSmartLinkRule
	];

}, true);
//# sourceMappingURL=library-preload.support.js.map