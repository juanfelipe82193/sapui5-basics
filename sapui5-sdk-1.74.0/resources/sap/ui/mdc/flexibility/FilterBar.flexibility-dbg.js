/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define(['./FilterItemFlex', './ConditionFlex'], function(FilterItemFlex, ConditionFlex) {
	"use strict";

	/**
	 * FilterBar-control-specific change handler that enables the storing of changes in the layered repository of the flexibility services.
	 *
	 * @alias sap.ui.mdc.flexibility.FilterBar
	 * @author SAP SE
	 * @version 1.74.0
	 */

	return {
		"addFilter": FilterItemFlex.createAddChangeHandler(),
		"removeFilter": FilterItemFlex.createRemoveChangeHandler(),
		"moveFilter": FilterItemFlex.createMoveChangeHandler(),
		"addCondition": ConditionFlex.addCondition,
		"removeCondition": ConditionFlex.removeCondition
	};
}, /* bExport= */true);
