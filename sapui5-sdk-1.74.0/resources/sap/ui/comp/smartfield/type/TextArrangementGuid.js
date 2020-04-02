/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/smartfield/type/TextArrangement","sap/ui/comp/smartfield/type/Guid","sap/ui/model/ValidateException","sap/base/assert"],function(T,G,V,a){"use strict";var b=T.extend("sap.ui.comp.smartfield.type.TextArrangementGuid");b.prototype.parseDescriptionOnly=function(v,s,c,f,S){var p=G.prototype.parseValue.call(this,v,s);if(i(p)){return new Promise(function(r,R){function h(D){if(D.length===1){this.sDescription=D[0][S.descriptionField];r([p,undefined]);return;}if(D.length===0){R(new V(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));return;}a(false,"Duplicate GUID. - "+this.getName());}function d(){R(new V());}var o={filterFields:this.getFilterFields(p),success:h.bind(this),error:d};this.onBeforeValidateValue(p,o);}.bind(this));}else{v=v.trim();return T.prototype.parseDescriptionOnly.call(this,v,s,c,f,S);}};b.prototype.getFilterFields=function(v){if(this.oFormatOptions.textArrangement==="descriptionOnly"){if(i(v)){return["keyField"];}return["descriptionField"];}return["keyField","descriptionField"];};b.prototype.getName=function(){return"sap.ui.comp.smartfield.type.TextArrangementGuid";};b.prototype.getPrimaryType=function(){return G;};function i(v){var r=/^[A-F0-9]{8}-([A-F0-9]{4}-){3}[A-F0-9]{12}$/i;return r.test(v);}return b;});
