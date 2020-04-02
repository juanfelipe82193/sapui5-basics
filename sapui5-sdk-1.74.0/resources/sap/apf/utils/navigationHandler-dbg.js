/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery, window*/
sap.ui.define([
	"sap/apf/core/utils/filterSimplify",
	"sap/apf/utils/utils",
	"sap/apf/utils/executeFilterMapping",
	"sap/ui/core/routing/HashChanger"
], function(filterSimplify, utils, executeFilterMapping, HashChanger){
	'use strict';
	/**
	 * @class This class manages the navigation to a target and the navigation from another target into this class;
	 * @param {Object} oInject Injection of required APF objects
	 * @param {Object} oInject.instance Injected instances
	 * @param {sap.apf.core.MessageHandler} oInject.instances.messageHandler
	 * @param {sap.apf.Component} oInject.instances.component
	 * @param {Object} oInject.functions Injected functions
	 * @param {Function} oInject.functions.getCumulativeFilterUpToActiveStep 
	 * @param {Function} oInject.functions.getNavigationTargets
	 * @param {Function} oInject.functions.getActiveStep 
	 * @param {Function} oInject.functions.createRequest 
	 * @param {Function} oInject.functions.getXappStateId 
	 * @param {Function} oInject.functions.isFilterReductionActive
	 */
	var NavigationHandler = function(oInject) {
		var configuredNavigationTargets;
		var enrichedNavigationTargets;
		var lastUsedCumulativeFilter;
		var messageHandler = oInject.instances.messageHandler;
		var navigationHandler = this;
		var FilterReduction = oInject.constructors && oInject.constructors.FilterReduction || filterSimplify.FilterReduction;
		var filterReduction;
		var error5074HasBeenReported = false;
		/**
		 * Returns all possible navigation targets with text (from intent)
		 * @returns Promise with [object] Object containing properties global and stepSpecific. Each containing an array of navigation targets with properties id, semanticObject, action and text. The id is
		 * used in the navigateToApp function.
		 * Derivation of step specific navigation targets implicitly considers only navigation targets that are assigned to the currently active step.
		 * If there is no active step set or the active step has no navigation targets assigned in its configuration an empty array will be assigned to property stepSpecific of the result object. 
		 */
		this.getNavigationTargets = function() {
			var deferred, messageObject;
			var navigationService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			if (!navigationService) {
				if (!error5074HasBeenReported) {
					messageObject = messageHandler.createMessageObject({ code : 5074});
					messageHandler.putMessage(messageObject);
					error5074HasBeenReported = true;
				}
				enrichedNavigationTargets = { global : [], stepSpecific : []};
				return utils.createPromise(enrichedNavigationTargets);
			}
			deferred = jQuery.Deferred();
			oInject.functions.getCumulativeFilterUpToActiveStep().done(function(oCumulativeFilter){


				if (enrichedNavigationTargets && oCumulativeFilter.isEqual(lastUsedCumulativeFilter)) {		
					deferred.resolve(convertToResultObject(enrichedNavigationTargets));
					return deferred.promise();
				}		
				lastUsedCumulativeFilter = oCumulativeFilter;
				if (!configuredNavigationTargets) {
					initNavigationTargets();
				}
				enrichedNavigationTargets = jQuery.extend(true, [], configuredNavigationTargets);
				enrichedNavigationTargets.forEach(function(navTarget) {
					navTarget.text = "";
				});
				
				collectIntentTexts(oCumulativeFilter).done(function(finalNavTargets) {
					enrichedNavigationTargets = finalNavTargets;
					deferred.resolve(convertToResultObject(enrichedNavigationTargets));
				});

			});

			return deferred.promise();


			function collectIntentTexts(cumulativeFilter) {
				var deferred = jQuery.Deferred();
				var finalNavTargets = [];
				var aDeferreds = [];
				var terms;
			
				enrichedNavigationTargets.forEach(function(navTarget) {
					var deferredForEach;
								
					if (navTarget.useDynamicParameters) {
						//initialize terms on demand
						terms = terms || determineSingleValueTermsFromCumulativeFilter(cumulativeFilter);
						navTarget.parameters = addParametersFromCumulativeFilter(navTarget.parameters, terms);
					}
					deferredForEach = jQuery.Deferred();
					aDeferreds.push(deferredForEach);
					navigationService.getLinks({
						semanticObject : navTarget.semanticObject,
						action : navTarget.action,
						params: getNavigationParams(navTarget.parameters),
						ignoreFormFactor : false,
						ui5Component : oInject.instances.component
					}).then(function(aIntents) {
						aIntents.forEach(function(intentDefinition) {
							var actionWithParameters = intentDefinition.intent.split("-");
							var action = actionWithParameters[1].split("?");
							action = action[0].split("~");
							if (intentDefinition.text !== "" && action[0] === navTarget.action) {
								navTarget.text = intentDefinition.text;
								finalNavTargets.push(navTarget);
							}
						});
						deferredForEach.resolve();
					}, function() {
						deferredForEach.resolve();
					});
				});
				jQuery.when.apply(jQuery, aDeferreds).done(function() {
					deferred.resolve(finalNavTargets);
				});

				return deferred.promise();
			}
		};
		/**
		 * receives an id of a navigation target and starts the navigation
		 * @param {string} navigationId navigation target id
		 * @returns undefined
		 */
		this.navigateToApp = function(navigationId) {
			if (!configuredNavigationTargets) {
				initNavigationTargets();
			}
			var oNavigationTarget = getNavigationTarget(navigationId);
			if (!oNavigationTarget) {
				return;
			}
			var hashChanger = HashChanger && HashChanger.getInstance();
			oInject.functions.getCumulativeFilterUpToActiveStep().done(function(oCumulativeFilter) {
				if (oInject.functions.isFilterReductionActive && oInject.functions.isFilterReductionActive()) {
					filterReduction = filterReduction || new FilterReduction();
					var oFilter = filterReduction.reduceFilter(messageHandler, oCumulativeFilter);
					if (oFilter === null) {
						messageHandler.putMessage(messageHandler.createMessageObject({ code : 5235 }));
					} else {
						oCumulativeFilter = oFilter;
					}
				}
				if (!oNavigationTarget.filterMapping || !oNavigationTarget.filterMapping.requestForMappedFilter) {
					callbackForFilterMapping(null, null);
				} else {
					var oMappingRequest = oInject.functions.createRequest(oNavigationTarget.filterMapping.requestForMappedFilter);
					executeFilterMapping(oCumulativeFilter, oMappingRequest, oNavigationTarget.filterMapping.target, callbackForFilterMapping, messageHandler);
				}
				function callbackForFilterMapping(oFilterFromFilterMapping, oMessageObject) {
					var appState;
					if (oMessageObject) {
						return;
					}
					if (oFilterFromFilterMapping) {
						oCumulativeFilter = oCumulativeFilter.addAnd(oFilterFromFilterMapping);
					}
					var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
					if (oCrossAppNavigator) {
						oInject.instances.serializationMediator.serialize(true).done(function(serializableApfState) {
							navigationHandler.generateSelectionVariant(oCumulativeFilter).done(function(selectionVariant){

								var terms;
								var containerData = {};
								if (oNavigationTarget.useDynamicParameters) {
									terms = determineSingleValueTermsFromCumulativeFilter(oCumulativeFilter);
								}
								
								containerData.sapApfState = serializableApfState;
								containerData.sapApfCumulativeFilter = oCumulativeFilter.mapToSapUI5FilterExpression();
								containerData.selectionVariant = selectionVariant;
								appState = oCrossAppNavigator.createEmptyAppState(oInject.instances.component);
								appState.setData(containerData);
								appState.save();
								if (hashChanger) {
									hashChanger.replaceHash("sap-iapp-state=" + appState.getKey());
								}
								var parameters = oNavigationTarget.parameters;
								if (oNavigationTarget.useDynamicParameters) {
									parameters = addParametersFromCumulativeFilter(parameters, terms);
								}
								oCrossAppNavigator.toExternal({
									target : {
										semanticObject : oNavigationTarget.semanticObject,
										action : oNavigationTarget.action
									},
									appStateKey : appState.getKey(),
									params : getNavigationParams(parameters)
								}, oInject.instances.component);
							});
						});
					}
				}
			});
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			var hashChanger = HashChanger && HashChanger.getInstance && HashChanger.getInstance();
			var iappStateKeyMatcher = /(?:sap-iapp-state=)([^&=]+)/;
			var innerAppStateKey, crossAppStateKey, iappMatch, containerData;
			if (hashChanger) {
				iappMatch = iappStateKeyMatcher.exec(hashChanger.getHash());
				if (iappMatch) {
					innerAppStateKey = iappMatch[1];
				}
			}
			crossAppStateKey = oInject.functions.getXappStateId();
			if (innerAppStateKey) {
				sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, innerAppStateKey).done(function(appContainer) {
					containerData = appContainer.getData();
					if (containerData.sapApfState) {
						oInject.instances.serializationMediator.deserialize(containerData.sapApfState).done(function() {
							deferred.resolve({
								navigationMode : "backward"
							});
						});
					}
				});
			} else if (crossAppStateKey) {
				sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, crossAppStateKey).done(function(appContainer) {
					containerData = appContainer.getData();
					if (containerData && containerData.sapApfCumulativeFilter) {
						deferred.resolve({
							navigationMode : "forward",
							sapApfCumulativeFilter : containerData.sapApfCumulativeFilter
						});
					} else {
						deferred.resolve({
							navigationMode : "forward"
						});
					}
				});
			} else {
				deferred.resolve({
					navigationMode : "forward"
				});
			}
			//removes sap-iapp-state from URL hash
			if (hashChanger) {
				hashChanger.replaceHash("");
			}
			return deferred.promise();
		};
		this.generateSelectionVariant = function (filter) {
			var deferred = jQuery.Deferred();
			if (!oInject.functions.isFilterReductionActive || !oInject.functions.isFilterReductionActive()) {
				filterReduction = filterReduction || new FilterReduction();
				filter = filterReduction.reduceFilter(messageHandler, filter);
			}
			if(!filterReduction || !filterReduction.isContradicted()){
				var selectOptionsPromise = filter.mapToSelectOptions(oInject.functions.getAllParameterEntitySetKeyProperties);
				selectOptionsPromise.done(function(selectionVariant){
					selectionVariant.SelectionVariantID = jQuery.sap.uid();
					deferred.resolve(selectionVariant);
				});
			} else {
				var selectionVariant = {};
				selectionVariant = {
						SelectionVariantID: jQuery.sap.uid(),
						Text: 'Filter could not be converted to a selectionVariant'
				};
				deferred.resolve(selectionVariant);
			}
			return deferred.promise();
		};
		function initNavigationTargets() {
			configuredNavigationTargets = oInject.functions.getNavigationTargets();
		}
		function getNavigationTarget(navigationId) {
			for(var i = 0, len = configuredNavigationTargets.length; i < len; i++) {
				if (configuredNavigationTargets[i].id === navigationId) {
					return configuredNavigationTargets[i];
				}
			}
		}
		function getNavigationParams(parameters){
			var parameterObject;

			if(parameters && parameters.length > 0){
				parameterObject = {};
				parameters.forEach(function(parameter){
					parameterObject[parameter.key] = parameter.value;
				});
			}	
			return parameterObject;
		}
		function convertToResultObject(targets) {
			var copyOfTargets = jQuery.extend(true, [], targets);
			var resultObject = {
					global : [],
					stepSpecific : []
			};
			copyOfTargets.forEach(function(target) {
				if (target.isStepSpecific && isAssignedToActiveStep(target.id)) {
					delete target.isStepSpecific;
					resultObject.stepSpecific.push(target);
				} else if (!target.isStepSpecific) {
					delete target.isStepSpecific;
					resultObject.global.push(target);
				}
			});
			return resultObject;
			function isAssignedToActiveStep(id) {
				var result = false;
				var assignedNavigationTargets;
				var activeStep = oInject.functions.getActiveStep();
				if (activeStep && activeStep.getAssignedNavigationTargets) {
					assignedNavigationTargets = activeStep.getAssignedNavigationTargets();
					if (assignedNavigationTargets && jQuery.isArray(assignedNavigationTargets)) {
						assignedNavigationTargets.forEach(function(assignedNavigationTarget) {
							if (id === assignedNavigationTarget.id) {
								result = true;
							}
						});
					}
				}
				return result;
			}
		}

		function determineSingleValueTermsFromCumulativeFilter(cumulativeFilter) {
			filterReduction = filterReduction || new FilterReduction();
			var filter = filterReduction.reduceFilter(messageHandler, cumulativeFilter) || cumulativeFilter;

			return filter.getSingleValueTerms();
		}

		function addParametersFromCumulativeFilter(parameters, terms){

			terms.forEach(function(term){
				parameters = parameters || [];
				parameters.push( { 'key' : term.property, 'value' : term.value});
			}); 
			return parameters;
		}
	};
	sap.apf.utils.NavigationHandler = NavigationHandler;
	return NavigationHandler;
}, true /*Global_Export*/);
