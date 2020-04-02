/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery */
jQuery.sap.declare("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.areRequestOptionsEqual");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.utils.executeFilterMapping");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.core.metadataProperty");

sap.ui.define([
	'sap/apf/utils/trace'
	], function(trace) {
	'use strict';

	/**
	 * @private
	 * @class A step is a runtime container for binding and request. 
	 * @name sap.apf.core.Step
	 * @param {object} oMessageHandler Message handler instance
	 * @param {object} oStepConfig Step configuration object from analytical content configuration
	 * @param {sap.apf.core.ConfigurationFactory} oFactory
	 * @param {string} [sRepresentationId] the representation, that shall be selected
	 * @returns {sap.apf.core.Step} 
	 */
	function Step(oMessageHandler, oStepConfig, oFactory, sRepresentationId, oCoreApi) {
		oMessageHandler.check(oStepConfig !== undefined, "Step: step configuration is missing");
		oMessageHandler.check(oStepConfig.binding !== undefined, "No binding assigned to step " + oStepConfig.id + " in analytical configuration", sap.apf.core.constants.message.code.errorCheckConfiguration);
		var oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
		var that = this;
		var oBinding, oRequest, oCachedFilter, oCachedRequestOptions;
		var filterMappingCache = {
			responseData : []
		};
		var oAdditionalConfigurationProperties = jQuery.extend(true, {}, oStepConfig);
		/**
		 * @private
		 * @description Type
		 * @returns {string}
		 */
		this.type = 'step';
		/**
		 * @private
		 * @description Contains 'title'
		 * @returns {string}
		 */
		this.title = jQuery.extend(true, {}, oStepConfig.title);
		/**
		 * @private
		 * @description Contains 'longTitle'
		 * @returns {string}
		 */
		this.longTitle = undefined;
		if (oStepConfig.longTitle) {
			this.longTitle = jQuery.extend(true, {}, oStepConfig.longTitle);
		}
		/**
		 * @private
		 * @description Contains 'thumbnail'
		 * @returns {string}
		 */
		this.thumbnail = jQuery.extend(true, {}, oStepConfig.thumbnail);
		/**
		 * @private
		 * @description Contains 'categories'
		 * @returns {object[]}
		 */
		this.categories = oStepConfig.categories;
		/**
		 * @private
		 * @description Releases all resources of the step as precondition for garbage collection
		 * 
		 */
		this.destroy = function() {
			if (oBinding) {
				oBinding.destroy();
			}
			oRequest = undefined;
			oCachedFilter = undefined;
			oCachedRequestOptions = undefined;
			oBinding = undefined;
			that = undefined;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getRequestConfiguration
		 * @description Returns the requestConfiguration which is referenced in the stepConfiguration
		 * @returns {object}
		 */
		this.getRequestConfiguration = function() {
			return oFactory.getConfigurationById(oStepConfig.request);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getAdditionalConfigurationProperties
		 * @description Returns additional properties from step template
		 * @returns {object}
		 */
		this.getAdditionalConfigurationProperties = function() {
			return oAdditionalConfigurationProperties;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#update
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF. 
		 * APF consumers must call sap.apf.updatePath() instead.
		 * @returns undefined
		 */
		this.update = function(oFilterForRequest, callbackAfterRequest) {
			var selectionValidationRequest;
			var selectionValidationRequestFilter = this.getFilter();
			var bFilterChanged = !oFilterForRequest.isEqual(oCachedFilter);
			var oCurrentRequestOptions = oBinding.getRequestOptions(bFilterChanged);
			var bRequestOptionsChanged = !sap.apf.core.utils.areRequestOptionsEqual(oCachedRequestOptions, oCurrentRequestOptions);
			var requestConfig = oFactory.getConfigurationById(oStepConfig.request);
			trace.logCall("Step.update", ", bFilterChanged", bFilterChanged, ", bRequestOptionsChanged", bRequestOptionsChanged);
			oCoreApi.getMetadata(requestConfig.service).then(function(metadata){
				trace.log("update  -  in oCoreApi.getMetadata().then()");
				if(!selectionValidationRequestFilter.isEmpty() && !oStepConfig.topNSettings && (oBinding.getSelectedRepresentation().type === 'TableRepresentation')){
					var requiredFilter = selectionValidationRequestFilter.getProperties()[0];
					var requiredFilterProperties = [requiredFilter];
					var requiredFilterTextProperty = metadata.getPropertyMetadata(requestConfig.entityType, requiredFilter)["sap:text"];
					if (requiredFilterTextProperty){
						requiredFilterProperties.push(requiredFilterTextProperty);
					}
					selectionValidationRequest = {
						selectionFilter : selectionValidationRequestFilter, 
						requiredFilterProperties : requiredFilterProperties
					};
				}
				if (oRequest && (bFilterChanged || bRequestOptionsChanged)) {
					trace.log("update() - before sendGetInBatch");
					oRequest.sendGetInBatch(oFilterForRequest, callbackAfterRequest, oCurrentRequestOptions, selectionValidationRequest);
				} else {
					trace.log("update() - no request, before callbackAfterRequest");
					callbackAfterRequest({}, false);
				}
			}, function(){
				trace.log("update - then.reject() - before callbackAfterRequest");
				callbackAfterRequest({}, false);
			});
			trace.logReturn("update");
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#determineFilters
		 * @description Do not use. Not part of the APF API.
		 * Called APF internally from path update to invoke filter calculation on step.
		 * @param {sap.apf.utils.Filter} oFilter
		 * @returns undefined
		 */
		this.determineFilter = function(oCumulatedFilter, callbackFromStepFilterProcessing) {
			var newCumulativeFilter;
			var oMergedFilter;
			if(this.adjustCumulativeFilter){
				newCumulativeFilter = this.adjustCumulativeFilter(oCumulatedFilter);
			}
			if (mappingRequired() && this.getFilter().toUrlParam()) {
				var oRequestConfig = oFactory.getConfigurationById(oStepConfig.filterMapping.requestForMappedFilter);
				oRequestConfig.selectProperties = oStepConfig.filterMapping.target.slice();
				if(oStepConfig.filterMapping.targetPropertyDisplayOption === oLabelDisplayOptions.TEXT || oStepConfig.filterMapping.targetPropertyDisplayOption === oLabelDisplayOptions.KEY_AND_TEXT){
					oCoreApi.getMetadata(oRequestConfig.service).done(function(metadata){
						var propertyMetadata = metadata.getPropertyMetadata(oRequestConfig.entityType, oRequestConfig.selectProperties[0]);
						if(propertyMetadata.text){
							oRequestConfig.selectProperties.push(propertyMetadata.text);
						}
						executeFilterMapping.call(this, oRequestConfig);
					}.bind(this));
				} else {
					executeFilterMapping.call(this, oRequestConfig);
				}
			} else {
				filterMappingCache.responseData = [];
				callbackFromStepFilterProcessing(this.getFilter(), newCumulativeFilter);
			}
			function executeFilterMapping(oRequestConfig){
				var oMappingRequest = oFactory.createRequest(oRequestConfig);
				oMergedFilter = oCumulatedFilter.addAnd(this.getFilter());
				if(newCumulativeFilter){
					oMergedFilter = newCumulativeFilter.copy().addAnd(this.getFilter());
				}
				if(oMergedFilter.isEqual(filterMappingCache.mergedFilter)){
					callbackFromStepFilterProcessing(filterMappingCache.mappedFilter, newCumulativeFilter);
				} else {
					sap.apf.utils.executeFilterMapping(oMergedFilter, oMappingRequest, oStepConfig.filterMapping.target, localCallback, oMessageHandler);
				}
			}
			function localCallback(oMappedFilter, oMessageObject, responseData) {
				if (!oMessageObject) {
					if (oStepConfig.filterMapping.keepSource === 'true') {
						oMappedFilter = that.getFilter().addAnd(oMappedFilter);
					}
					filterMappingCache.mergedFilter = oMergedFilter;
					filterMappingCache.mappedFilter = oMappedFilter;
					filterMappingCache.responseData = responseData;
					callbackFromStepFilterProcessing(oMappedFilter, newCumulativeFilter);
				}
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getBinding
		 * @description Do not use. Not part of the APF API.
		 * @returns {sap.apf.core.Binding}
		 */
		this.getBinding = function() {
			return oBinding;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getFilter
		 * @description Fetches the selection from the representation. 
		 * @returns {sap.apf.core.utils.Filter} 
		 */
		this.getFilter = function() {
			return oBinding.getFilter(this.getContextInfo());
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getContextInfo
		 * @description Returns an object containing the entityType and service this step refers to.
		 * @returns {object}
		 */
		this.getContextInfo = function() {
			var oRequestConfiguration = oFactory.getConfigurationById(oStepConfig.request);
			var oContextInfo = {
				entityType : oRequestConfiguration.entityType,
				service : oRequestConfiguration.service
			};
			return oContextInfo;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#setData
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns undefined
		 */
		this.setData = function(oDataResponse, oFilterThatHasBeenUsedToRetrieveData) {
			var bFilterChanged = !oFilterThatHasBeenUsedToRetrieveData.isEqual(oCachedFilter);
			oCachedFilter = oFilterThatHasBeenUsedToRetrieveData.copy();
			oCachedRequestOptions = jQuery.extend({}, oBinding.getRequestOptions(bFilterChanged));
			oBinding.setData(oDataResponse);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getRepresentationInfo
		 * @description Returns an array of representation information objects.
		 * @returns {object[]}
		 */
		this.getRepresentationInfo = function() {
			return oBinding.getRepresentationInfo();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getSelectedRepresentationInfo
		 * @description Returns the representation information object of the selected representation. 
		 * @returns {object}
		 */
		this.getSelectedRepresentationInfo = function() {
			return oBinding.getSelectedRepresentationInfo();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getSelectedRepresentation
		 * @description Returns the selected representation object. 
		 * @returns {sap.apf.ui.representations.representationInterface}
		 */
		this.getSelectedRepresentation = function() {
			return oBinding.getSelectedRepresentation();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#setSelectedRepresentation
		 * @description Sets the selected representation via representation id. 
		 * The selected representation receives the response data through setData().  
		 * @param {string} sRepresentationId The representation id used to identify the representation. 
		 * @returns {undefined}
		 */
		this.setSelectedRepresentation = function(sRepresentationId) {
			oBinding.setSelectedRepresentation(sRepresentationId);
		};
		/**
		 * @private
		 * @name sap.apf.core.Step#getFilterInformation
		 * @param {sap.apf.core.Step} currently active step
		 * @description Returns all needed information about the selection in the step to display in the path filter information popup
		 * @returns jQuery.Deferred Promise will be resolved with an Array of objects which contains text, selectablePropertyLabel and filterValues
		 */
		this.getFilterInformation = function(activeStep, index) {
			var filterInformationDeferred = jQuery.Deferred();
			var title;
			if(oStepConfig.longTitle && oStepConfig.longTitle.key){
				title = oCoreApi.getTextNotHtmlEncoded(oStepConfig.longTitle.key);
			} else {
				title = oCoreApi.getTextNotHtmlEncoded(oStepConfig.title.key);
			}
			if(mappingRequired() && oStepConfig.filterMapping.keepSource === "true"){
				jQuery.when(getSelectionInformation(activeStep, title), getFilterMappingInformation(activeStep, title)).then(function(selectionInformation, filterMappingInformation){
					filterInformationDeferred.resolve([selectionInformation, filterMappingInformation]);
				});
			} else if (mappingRequired()){
				jQuery.when(getFilterMappingInformation(activeStep, title)).then(function(filterMappingInformation){
					filterInformationDeferred.resolve([filterMappingInformation]);
				});
			} else {
				jQuery.when(getSelectionInformation(activeStep, title)).then(function(selectionInformation){
					filterInformationDeferred.resolve([selectionInformation]);
				});
			}
			return filterInformationDeferred;

			function getFilterMappingInformation(){
				var filterMappingDeferred = jQuery.Deferred();
				var mappedPropertyLabel;
				if(oStepConfig.filterMapping.targetPropertyLabelKey){
					mappedPropertyLabel = oCoreApi.getTextNotHtmlEncoded(oStepConfig.filterMapping.targetPropertyLabelKey);
				}
				var mappedProperty = oStepConfig.filterMapping.target[0];
				var mappingRequest = oFactory.getConfigurationById(oStepConfig.filterMapping.requestForMappedFilter);
				getFilterMappingValues(mappedProperty, mappingRequest).done(function(filterMappingValues){
					resolveInformationPromise(filterMappingDeferred, mappedProperty, filterMappingValues, mappedPropertyLabel, mappingRequest, true);
				});
				return filterMappingDeferred;
			}
			function getFilterMappingValues (mappedProperty, mappingRequest) {
				var deferred = jQuery.Deferred();
				oCoreApi.getMetadata(mappingRequest.service).done(function(filterMappingMetadata){
					var textProperty;
					var mappedPropertyMetadata = new sap.apf.core.MetadataProperty(filterMappingMetadata.getPropertyMetadata(mappingRequest.entityType, mappedProperty));
					if(mappedPropertyMetadata.text){
						textProperty = mappedPropertyMetadata.text;
					}
					var mappedFilterValues = [];
					var displayOption = oStepConfig.filterMapping.targetPropertyDisplayOption;
					var conversionToExternalFormatIsRequired = false;
					filterMappingCache.responseData.forEach(function(data){
						if(displayOption === oLabelDisplayOptions.TEXT && textProperty){
							mappedFilterValues.push({
								text : data[textProperty]
							});
						} else if(displayOption === oLabelDisplayOptions.KEY_AND_TEXT && textProperty){
							mappedFilterValues.push({
								text : oCoreApi.getTextNotHtmlEncoded("keyAndTextSelection", [data[textProperty], sap.apf.utils.convertToExternalFormat(data[mappedProperty], mappedPropertyMetadata)])
							});
						} else {
							mappedFilterValues.push({
								text : data[mappedProperty]
							});
							conversionToExternalFormatIsRequired = true;
						}
					});
					mappedFilterValues = sap.apf.utils.sortByProperty( mappedFilterValues, "text", mappedPropertyMetadata);
					if (conversionToExternalFormatIsRequired === true) {
						mappedFilterValues.forEach(function(value){
							value.text = sap.apf.utils.convertToExternalFormat(value.text, mappedPropertyMetadata);
						});
					}
					deferred.resolve(mappedFilterValues);
				});
				return deferred;
			}
			function getSelectionInformation(){
				var selectionDeferred = jQuery.Deferred();
				var selectableProperty;
				var selectablePropertyLabel;
				var bindingConfig = oFactory.getConfigurationById(oStepConfig.binding);
				var requestConfig = oFactory.getConfigurationById(oStepConfig.request);
				if(bindingConfig.requiredFilters && bindingConfig.requiredFilters.length === 1){
					selectableProperty = bindingConfig.requiredFilters[0];
					if(bindingConfig.requiredFilterOptions && bindingConfig.requiredFilterOptions.fieldDesc){
						selectablePropertyLabel = oCoreApi.getTextNotHtmlEncoded(bindingConfig.requiredFilterOptions.fieldDesc.key);
					}
				}
				resolveInformationPromise(selectionDeferred, selectableProperty, oBinding.getSortedSelections(), selectablePropertyLabel, requestConfig, false);
				return selectionDeferred;
			}
			function resolveInformationPromise(resolveDeferred, selectableProperty, filterValues, selectablePropertyLabel, requestConfig, isFilterMapping){
				var metadataPromise;
				var activeStepMetadataPromise;
				if(!selectablePropertyLabel){
					metadataPromise = oCoreApi.getMetadata(requestConfig.service);
				}
				if(selectableProperty){
					activeStepMetadataPromise = oCoreApi.getMetadata(activeStep.getRequestConfiguration().service);
				}
				jQuery.when(metadataPromise, activeStepMetadataPromise).then(function(metadata, activeStepMetadata){
					var warningIcon = false;
					var warningText;
					var activeStepEntitySet = activeStep.getRequestConfiguration().entityType;
					var filterableProperties;
					if(activeStepMetadata){
						filterableProperties = activeStepMetadata.getFilterableProperties(activeStepEntitySet).concat(activeStepMetadata.getParameterEntitySetKeyProperties(activeStepEntitySet));
					}
					if(!selectablePropertyLabel && metadata && selectableProperty){
						selectablePropertyLabel = metadata.getPropertyMetadata(requestConfig.entityType, selectableProperty)["sap:label"];
					}
					if(!selectableProperty){
						warningIcon = true;
						warningText = oCoreApi.getTextNotHtmlEncoded("noSelectionPossible");
					} else if (filterableProperties.indexOf(selectableProperty) === -1){
						warningIcon = true;
						warningText = oCoreApi.getTextNotHtmlEncoded("filterNotApplicable");
					} else if (filterValues.length === 0){
						warningIcon = true;
						warningText = oCoreApi.getTextNotHtmlEncoded("nothingSelected");
					}
					resolveDeferred.resolve({
						text: title,
						selectablePropertyLabel : selectablePropertyLabel || selectableProperty,
						filterValues : filterValues,
						infoIcon : isFilterMapping,
						infoText : isFilterMapping ? oCoreApi.getTextNotHtmlEncoded("infoIconfilterMapping") : undefined,
						warningIcon : warningIcon,
						warningText : warningText,
						stepIndex : index
					});
				});
			}
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#serialize
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.serialize = function() {
			return {
				stepId : oStepConfig.id,
				binding : oBinding.serialize()
			};
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#deserialize
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.deserialize = function(oSerializableStep) {
			oBinding.deserialize(oSerializableStep.binding);
			oMessageHandler.check(oStepConfig.id, oSerializableStep.stepId, "sap.apf.core.step.deserialize inconsistent serialization data - id " + oSerializableStep.stepId);
			return this;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getAssignedNavigationTargets
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.getAssignedNavigationTargets = function() {
			return oStepConfig.navigationTargets;
		};
		initialize();
		// private functions
		function initialize() {
			oBinding = oFactory.createBinding(oStepConfig.binding, undefined, undefined, sRepresentationId);
			delete oAdditionalConfigurationProperties.binding;
			if (oStepConfig.request !== undefined && oStepConfig.request !== "") {
				oRequest = oFactory.createRequest(oStepConfig.request);
				delete oAdditionalConfigurationProperties.request;
			}
		}
		function mappingRequired() {
			if (oStepConfig.filterMapping) {
				if (oStepConfig.filterMapping.requestForMappedFilter && oStepConfig.filterMapping.target instanceof Array && oStepConfig.filterMapping.keepSource) {
					return true;
				}
				oMessageHandler.putMessage(oMessageHandler.createMessageObject({
					code : "5104"
				}));
			}
			return false;
		}
	}
	/*BEGIN_COMPATIBILITY*/
	sap.apf.core.Step = Step;
	/*END_COMPATIBILITY*/

	return {
		constructor: Step
	};
}, true /*GLOBAL_EXPORT*/);
