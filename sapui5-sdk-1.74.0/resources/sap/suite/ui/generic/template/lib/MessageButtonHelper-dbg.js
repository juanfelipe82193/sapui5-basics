sap.ui.define(["sap/ui/base/Object", "sap/m/MessagePopover", "sap/m/MessagePopoverItem", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/suite/ui/generic/template/lib/MessageUtils", "sap/suite/ui/generic/template/lib/testableHelper", 'sap/ui/core/Element', "sap/base/util/extend"
], function (BaseObject, MessagePopover, MessagePopoverItem, Filter, FilterOperator, MessageUtils, testableHelper, Element, extend) {
	"use strict";

	Filter = testableHelper.observableConstructor(Filter, true);

	var oPersistentFilter = new Filter({
		path: "persistent",
		operator: FilterOperator.EQ,
		value1: false
	}); // exclude all messages that are persistent for frontend (i.e. transient for backend)
	var oSemanticalFilter = new Filter({
		path: "technical",
		operator: FilterOperator.EQ,
		value1: false
	}); // exclude all messages that are technical (they are added by the UI5 model in some scenarios but not important for our use-case)
	var oValidationFilter = new Filter({
		path: "validation",
		operator: FilterOperator.EQ,
		value1: true
	}); // include all validation messages (i.e. frontend-messages)

	var oImpossibleFilter = new Filter({
		filters: [oValidationFilter, new Filter({
			path: "validation",
			operator: FilterOperator.EQ,
			value1: false
		})],
		and: true
	});

	// oHost is an object representing the view that hosts the MessageButton
	// The following properties are expected in oHost:
	// - controller: The controller of the view the MessageButton is placed on
	// - prepareAllMessagesForNavigation(optional): A function that will be called on demand, when not all messages contained in the MessagePopover
	//                                              point to suitable messages.
	//                                              This gives the view the chance to update its internal bindings (practically: disable lazy loading)
	//                                              such that the messages might be updated accordingly.
	// - messageSorter(optional): A sorter to sort messages
	// - getGroupTitle(optional): A function which returns groupName of each individual messages.
	function getMethods(oTemplateUtils, oHost, bIsODataBased) {
		var oController = oHost.controller;
		var oMessageButton = oController.byId("showMessages");
		var bActive = false; // Is this helper currently active
		var oContextFilter; // the filter to be set on the full target

		// aControlIds is an array of control ids.
		// This function checks, whether there is at least on id that can be used to scroll to.
		function isPositionable(aControlIds) {
			return !!(aControlIds && oTemplateUtils.oCommonUtils.getPositionableControlId(aControlIds));
		}
		function getGroupTitle(aControlIds){
			if (oHost.getGroupTitle) {
				return oHost.getGroupTitle(aControlIds);
			}
			return "";
		}
		var oItemBinding;

		var oMessagePopover = oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessagePopover", {
			beforeOpen: function () {
				// when the MessagePopover is opened we try to ensure that all messages in the popover point to appropriate controls.
				// So the user can to navigate from the message to the target control.
				var aMessages = oItemBinding.getCurrentContexts();
				if (oHost.prepareAllMessagesForNavigation) {
					for (var i = 0; i < aMessages.length; i++) {
						var oMessageObject = aMessages[i].getObject();
						if (!isPositionable(oMessageObject.controlIds)) { // one message does not allow navigation yet. So we tell the view to make a better try (practically disable lazy loading)
							oHost.prepareAllMessagesForNavigation();
							return;
						}
					}
				}
			},
			isPositionable: isPositionable,
			getGroupTitle: getGroupTitle,
			titlePressed: function (oEvent) { // the user wants to navigate from the message to the corresponding control
				MessageUtils.navigateFromMessageTitleEvent(oTemplateUtils.oCommonUtils, oEvent, oController);
			}
		});
		// Add message model as an own model with name msg
		oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "msg");
		oMessagePopover.setGroupItems(true);
		oItemBinding = oMessagePopover.getBinding("items");
		var oEntityFilter; // fixed filter for the entity set of the component this instance belongs to. Will be ORed with a filter for the current binding path, oValidationFilter, and external filters
		(function () {
			var oComponent = oController.getOwnerComponent();
			oEntityFilter = new Filter({
				path: "target",
				operator: FilterOperator.EQ,
				value1: "/" + oComponent.getEntitySet()
			});
			var oTemplatePrivate = oComponent.getModel("_templPriv");
			oTemplatePrivate.setProperty("/generic/messageCount", 0);
			var sMessageButtonTooltip = oTemplateUtils.oCommonUtils.getText("MESSAGE_BUTTON_TOOLTIP_P", 0);
			oTemplatePrivate.setProperty("/generic/messageButtonTooltip", sMessageButtonTooltip);
			oItemBinding.attachChange(function () {
				var iCount = oItemBinding.getLength();
				oTemplatePrivate.setProperty("/generic/messageCount", iCount);
				sMessageButtonTooltip = oTemplateUtils.oCommonUtils.getText(iCount === 1 ? "MESSAGE_BUTTON_TOOLTIP_S" : "MESSAGE_BUTTON_TOOLTIP_P", iCount);
				oTemplatePrivate.setProperty("/generic/messageButtonTooltip", sMessageButtonTooltip);
			});
		})();

		var oLocalValidationFilter = new Filter({
			filters: [oValidationFilter, new Filter({
				path: "controlIds",
				test: function (aControlIds) {
					return !!oTemplateUtils.oCommonUtils.getPositionableControlId(aControlIds);
				},
				caseSensitive: true
			})],
			and: true
		});

		var aFilterProvider = []; //Callback functions registered by reuse components (or break-outs) that want to add their message filters
		var sCurrentBindingPath; // the binding path currently valid for the page this instance is responsible for
		var iCurrentCallCount = 0; // a counter which is increased each time sCurrentBinding path is changed
		var fnNewFilter; // function fnResolved (see below) with first parameter bound to iCurrentCallCount. Registered at Promises provided by external filter providers.
		var oCurrentFilter;
		var aCurrentFilters; // a list of filters currently set. They are combined by OR. The resulting filter will afterwards be ANDed with oPersistentFilter and oSemanticalFilter.
		// The result of this is used to filter the messages.

		// Adds an external filter definition
		// Returns whether filters have been changed synchronously
		function addAnExternalFilterDefinition(vFilterDefinition) {
			if (Array.isArray(vFilterDefinition)) {
				var bRet = false;
				for (var i = 0; i < vFilterDefinition.length; i++) {
					bRet = addAnExternalFilterDefinition(vFilterDefinition[i]) || bRet;
				}
				return bRet;
			}
			if (vFilterDefinition instanceof Promise) {
				vFilterDefinition.then(fnNewFilter);
				return false;
			}
			// vFilterDefinition must in fact be a filter
			aCurrentFilters.push(vFilterDefinition);
			return true;
		}

		function setCurrentFilter(oFilter) {
			oCurrentFilter = oFilter;
			oItemBinding.filter(oCurrentFilter);
		}

		// Adapts the binding for the messages according to the current state of aCurrentFilters
		function fnAdaptBinding() {
			if (bActive) {
				oContextFilter = new Filter({
					filters: aCurrentFilters,
					and: false
				});
				var aPersistentFilters = [oContextFilter, oPersistentFilter];
				if (oTemplateUtils.oServices.oApplication.needsToSuppressTechnicalStateMessages()) {
					aPersistentFilters.push(oSemanticalFilter);
				}
				var oCurrentPersistentFilter = new Filter({
					filters: aPersistentFilters,
					and: true
				});
				setCurrentFilter(new Filter({
					filters: [oCurrentPersistentFilter, oLocalValidationFilter],
					and: false
				}));
				if (oHost.messageSorter) {
					oItemBinding.sort(oHost.messageSorter);
				}
			}
		}

		// This method is called when a Promise that has been provided by a filter provider is resolved.
		// iCallCount is the value of iCurrentCallCount that was valid when the Promise was provided by the filter provider.
		// Note that the function does nothing when the iCurrentCallCount meanwhile has a different value (i.e. sCurrentBindingPath has meanwhile changed)
		// vFilterDefinition is the FilterDefinition the filter resolves to.
		function fnResolved(iCallCount, vFilterDefinition) {
			if (iCallCount === iCurrentCallCount && addAnExternalFilterDefinition(vFilterDefinition)) {
				fnAdaptBinding(); // adapt the binding after the set of filters has been adapted
			}
		}

		// fnProvider is a filter provider which has been registered via registerMessageFilterProvider.
		// At each time registerMessageFilterProvider must be able to provide a FilterDefinition.
		// A FilterDefinition is either
		// - a filter or
		// - an array of FilterDefinitions or
		// - or a Promise that resolves to a FilterDefinition
		// This function calls fnProvider and ensures that the filter(s) provided by this call are added to aCurrentFilters.
		// In case the filters are provided asynchronously, it is also ensured that the changed filters will be applied afterwards.
		// Returns whether the filters have been changed (synchronously)
		function addFilterFromProviderToCurrentFilter(fnProvider) {
			var oFilterDefinition = fnProvider();
			return addAnExternalFilterDefinition(oFilterDefinition);
		}

		// Ensure that addFilterFromProviderToCurrentFilter is called for all registered filter providers
		function addExternalFiltersToCurrentFilter() {
			aFilterProvider.forEach(addFilterFromProviderToCurrentFilter);
		}

		// adapt the filters to a new binding path
		function adaptToContext(sBindingPath) {
			sCurrentBindingPath = sBindingPath;
			iCurrentCallCount++;
			fnNewFilter = fnResolved.bind(null, iCurrentCallCount);

			// Show messages for current context including all "property children" AND for
			// messages given for the entire entity set
			aCurrentFilters = bIsODataBased ? [
				new Filter({
					path: "fullTarget",
					operator: FilterOperator.StartsWith,
					value1: sCurrentBindingPath
				}),
				oEntityFilter
			] : [];
			addExternalFiltersToCurrentFilter(); //Check/add external filters
			fnAdaptBinding();
		}

		// register a new filter provider. In case a binding path alrerady has been set, the new provider is called immediately
		function registerMessageFilterProvider(fnProvider) {
			aFilterProvider.push(fnProvider);
			if (sCurrentBindingPath !== undefined && addFilterFromProviderToCurrentFilter(fnProvider)) {
				fnAdaptBinding();
			}
		}

		var fnShowMessagePopoverImpl;

		function fnShowMessagePopover() {
			fnShowMessagePopoverImpl = fnShowMessagePopoverImpl || function () {
				if (oItemBinding.getLength() > 0) {
					oMessagePopover.openBy(oMessageButton);
				}
			};
			// workaround to ensure that oMessageButton is rendered when openBy is called
			setTimeout(fnShowMessagePopoverImpl, 0);
		}

		function setEnabled(bIsActive) {
			bActive = bIsActive;
			if (bIsActive) {
				if (aCurrentFilters) { // adaptToContext has already been called
					fnAdaptBinding();
				}
			} else {
				aCurrentFilters = null;
				setCurrentFilter(oImpossibleFilter);
			}
		}

		function getMessageFilters(bOnlyValidation) {
			return bOnlyValidation ? oLocalValidationFilter : oCurrentFilter;
		}

		function getContextFilter() {
			return oContextFilter;
		}

		return {
			adaptToContext: adaptToContext,
			toggleMessagePopover: oMessagePopover.toggle.bind(oMessagePopover, oMessageButton),
			showMessagePopover: fnShowMessagePopover,
			registerMessageFilterProvider: registerMessageFilterProvider,
			setEnabled: setEnabled,
			getMessageFilters: getMessageFilters,
			getContextFilter: getContextFilter
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.MessageButtonHelper", {
		constructor: function (oTemplateUtils, oHost, bIsODataBased) {
			extend(this, (testableHelper.testableStatic(getMethods, "MessageButtonHelper"))(oTemplateUtils, oHost, bIsODataBased));
		}
	});
});
