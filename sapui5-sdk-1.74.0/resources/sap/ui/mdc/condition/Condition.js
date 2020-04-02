/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/base/Log'],function(L){"use strict";var C=function(){};C.createItemCondition=function(k,d,i,o){var v=[k,d];if(d===null||d===undefined){v.pop();}return this.createCondition("EEQ",v,i,o);};C.createCondition=function(o,v,i,O){var c={operator:o,values:v,isEmpty:null};if(i){c.inParameters=i;}if(O){c.outParameters=O;}return c;};C._removeEmptyConditions=function(c){for(var i=c.length-1;i>-1;i--){if(c[i].isEmpty){c.splice(parseInt(i),1);}}return c;};C.indexOfCondition=function(c,a){var I=-1;for(var i=0;i<a.length;i++){if(this.compareConditions(c,a[i])){I=i;break;}}return I;};C.compareConditions=function(c,o){var e=false;if(c.operator===o.operator){var s;var a;if(c.operator==="EEQ"){var b={value:c.values[0]};var d={value:o.values[0]};if(c.inParameters&&o.inParameters){b.inParameters=c.inParameters;d.inParameters=o.inParameters;}if(c.outParameters&&o.outParameters){b.outParameters=c.outParameters;d.outParameters=o.outParameters;}s=JSON.stringify(b);a=JSON.stringify(d);}else{s=c.values.toString();a=o.values.toString();}if(s===a){e=true;}}return e;};return C;},true);
