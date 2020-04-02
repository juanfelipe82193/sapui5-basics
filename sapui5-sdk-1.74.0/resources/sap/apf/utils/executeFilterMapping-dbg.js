/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	"sap/apf/core/utils/filter",
	"sap/apf/core/constants"
], function(Filter, constants){
	"use strict";
	/**
	 * @description Execute a filter mapping via the given request by creating a disjunction for the given request result data records of conjunctions for the given target properties
	 * @param {sap.apf.utils.Filter} oInputFilter - Input filter for the mapping request
	 * @param {sap.apf.core.Request} oMappingRequest - Request used for the mapping
	 * @param {Array} aTargetProperties - Target properties for the mapping
	 * @param {Function} fnCallback(oMappedFilter) - callback function for the mapped filter
	 * @param {sap.apf.utils.Filter} fnCallback.oMappedFilter - Result of the filter mapping
	 * @param {sap.apf.core.MessageObject} fnCallback.oMessageObject - MessageObject in case of error
	 * @param {sap.apf.core.MessageHandler} oMessageHandler - Message handler
	 */
	var executeFilterMapping = function(oInputFilter, oMappingRequest, aTargetProperties, fnCallback, oMessageHandler) {
		oMappingRequest.sendGetInBatch(oInputFilter, callbackAfterMappingRequest);

		function callbackAfterMappingRequest(oResponse) {
			var oFilter;
			if (oResponse && oResponse.type && oResponse.type === "messageObject") {
				oMessageHandler.putMessage(oResponse); // technically logging
				fnCallback(undefined, oResponse);
			} else {
				oFilter = new Filter(oMessageHandler);
				oResponse.data.forEach(function(oDataRecord) {
					var oFilterAnd = new Filter(oMessageHandler);
					aTargetProperties.forEach(function(sTargetProperty) {
						oFilterAnd.addAnd(new Filter(oMessageHandler, sTargetProperty, constants.FilterOperators.EQ, oDataRecord[sTargetProperty]));
					});
					oFilter.addOr(oFilterAnd);
				});
				fnCallback(oFilter, undefined, oResponse.data);
			}
		}
	};
	return executeFilterMapping;
}, true /*Global_Export*/);