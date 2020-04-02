/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/MoveControls"],function(M){"use strict";var a=Object.assign({},M);a.applyChange=function(c,C,p){p.targetAggregation="groupElements";p.sourceAggregation="groupElements";return M.applyChange.call(this,c,C,p);};return a;},true);
