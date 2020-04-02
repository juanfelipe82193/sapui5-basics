/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/fl/apply/api/FlexRuntimeInfoAPI','./ItemBaseFlex'],function(F,I){"use strict";var c=Object.assign({},I);var r=function(C){if(C&&C.isA&&C.isA("sap.ui.mdc.Table")&&C.isTableBound()){if(!C._bWaitForBindChanges){C._bWaitForBindChanges=true;F.waitForChanges({element:C}).then(function(){C.rebindTable();delete C._bWaitForBindChanges;});}}};c.beforeAddItem=function(D,d,C,p){return D.beforeAddColumnFlex(d,C,p);};c.afterRemoveItem=function(D,C,o,p){return D.afterRemoveColumnFlex(C,o,p);};c.findItem=function(m,C,n){return C.find(function(o){var d=m.getProperty(o,"dataProperties");return d[0]===n;});};c.afterApply=function(C,t,i){if(C==="addColumn"&&!i||(C==="removeColumn"&&i)){r(t);}};c.addColumn=c.createAddChangeHandler();c.removeColumn=c.createRemoveChangeHandler();c.moveColumn=c.createMoveChangeHandler();return c;});
