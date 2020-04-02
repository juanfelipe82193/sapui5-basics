/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./ItemBaseFlex'],function(I){"use strict";var f=Object.assign({},I);f.beforeAddItem=function(D,n,c,p){return D.beforeAddFilterFlex(n,c,p);};f.afterRemoveItem=function(D,F,c,p){return D.afterRemoveFilterFlex(F,c,p);};f.findItem=function(m,F,n){return F.find(function(o){var s;if(m.targets==="jsControlTree"){s=o.getFieldPath();}else{s=o.getAttribute("conditions");if(s){var e,S=s.indexOf("/conditions/");if(S>=0){s=s.slice(S+12);e=s.indexOf("}");if(e>=0){s=s.slice(0,e);}}}}return s===n;});};this.beforeApply=function(c){if(c.applyConditionsAfterChangesApplied){c.applyConditionsAfterChangesApplied();}};f.addFilter=f.createAddChangeHandler();f.removeFilter=f.createRemoveChangeHandler();f.moveFilter=f.createMoveChangeHandler();return f;},true);
