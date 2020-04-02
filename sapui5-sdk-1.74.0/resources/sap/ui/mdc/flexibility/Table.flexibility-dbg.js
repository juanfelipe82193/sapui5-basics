/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'./SortFlex', './ColumnFlex'
], function(SortFlex, ColumnFlex) {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
		addColumn: ColumnFlex.createAddChangeHandler(),
		removeColumn: ColumnFlex.createRemoveChangeHandler(),
		moveColumn: ColumnFlex.createMoveChangeHandler(),
		removeSort: SortFlex.removeSort,
		addSort: SortFlex.addSort,
		moveSort: SortFlex.moveSort
	};

});