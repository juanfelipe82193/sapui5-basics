/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./FilterItemFlex','./ConditionFlex'],function(F,C){"use strict";return{"addFilter":F.createAddChangeHandler(),"removeFilter":F.createRemoveChangeHandler(),"moveFilter":F.createMoveChangeHandler(),"addCondition":C.addCondition,"removeCondition":C.removeCondition};},true);
