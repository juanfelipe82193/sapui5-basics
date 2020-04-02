/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/mdc/field/FieldBaseDelegate','sap/ui/mdc/util/BaseType'],function(F,B){"use strict";var O=Object.assign({},F);O.getDataTypeClass=function(p,t){var e={"Edm.Date":"sap.ui.model.odata.type.Date","Edm.TimeOfDay":"sap.ui.model.odata.type.TimeOfDay"};if(e[t]){t=e[t];}else{t=F.getDataTypeClass(p,t);}return t;};O.getBaseType=function(p,t,f,c){switch(t){case"sap.ui.model.odata.type.Date":return B.Date;case"sap.ui.model.odata.type.TimeOfDay":return B.Time;case"sap.ui.model.odata.type.Unit":case"sap.ui.model.odata.type.Currency":if(!f||!f.hasOwnProperty("showMeasure")||f.showMeasure){return B.Unit;}else{return B.Numeric;}break;default:return F.getBaseType(p,t,f,c);}};O.initializeTypeFromBinding=function(p,t,v){var r={};if(t&&(t.isA("sap.ui.model.odata.type.Unit")||t.isA("sap.ui.model.odata.type.Currency"))&&Array.isArray(v)&&v.length>2&&v[2]!==undefined){t.formatValue(v,"string");r.bTypeInitialized=true;r.mCustomUnits=v[2];}return r;};O.initializeInternalUnitType=function(p,t,T){if(T&&T.mCustomUnits){t.formatValue([null,null,T.mCustomUnits],"string");}};O.isSearchSupported=function(p,l){return!!l.changeParameters;};O.executeSearch=function(p,l,s){if(s){l.changeParameters({$search:s});}else{l.changeParameters({$search:undefined});}};return O;});
