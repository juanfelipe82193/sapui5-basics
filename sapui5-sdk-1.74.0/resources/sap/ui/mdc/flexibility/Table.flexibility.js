/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./SortFlex','./ColumnFlex'],function(S,C){"use strict";return{"hideControl":"default","unhideControl":"default",addColumn:C.createAddChangeHandler(),removeColumn:C.createRemoveChangeHandler(),moveColumn:C.createMoveChangeHandler(),removeSort:S.removeSort,addSort:S.addSort,moveSort:S.moveSort};});
