/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/library',"sap/ui/model/SimpleType","sap/ui/core/format/DateFormat","sap/ui/model/ValidateException"],function(c,S,D,V){"use strict";var a=S.extend("sap.ui.comp.odata.type.StringDate",{constructor:function(f){S.apply(this,[f]);this.sName="sap.ui.comp.odata.type.StringDate";f=Object.assign({},f,{UTC:false});this.displayFormatter=D.getDateInstance(f);this.parseFormatter=D.getDateInstance({UTC:false,pattern:"yyyyMMdd",calendarType:c.CalendarType.Gregorian,strictParsing:true});}});a.prototype.parseValue=function(v,s){if(v!=null&&v!=""){var o=s==="string"?this.parseFormatter.parse(v,true):v;v=this.parseFormatter.format(o);}return v;};a.prototype.formatValue=function(v,t){if(v===null||v===undefined||v==""){return null;}if(!(v instanceof Date)){v=this.parseFormatter.parse(v);}if(t==="string"){return this.displayFormatter.format(v);}return v;};a.prototype.validateValue=function(v){if(v!=null){var d=this.parseFormatter.parse(v);if(!d){throw new V(v+" is not a valid date");}}};return a;});
