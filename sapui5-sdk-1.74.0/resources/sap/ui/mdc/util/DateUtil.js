/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/library','sap/ui/core/date/UniversalDate','sap/base/util/merge'],function(c,U,m){"use strict";var C=c.CalendarType;var D=function(){};D.typeToUniversalDate=function(d,t){var s=this.typeToString(d,t,"yyyyMMdd");var y=parseInt(s.slice(0,4));var M=parseInt(s.slice(4,6))-1;var i=parseInt(s.slice(6,8));var u=new U(U.UTC(y,M,i));return u;};D.universalDateToType=function(d,t){var y=d.getUTCFullYear();var M=d.getUTCMonth()+1;var i=d.getUTCDate();var s=y.toString()+((M<10)?"0":"")+M.toString()+i.toString();var v=this.stringToType(s,t,"yyyyMMdd");return v;};D.createInternalType=function(t,p){var T=sap.ui.require(t.getMetadata().getName().replace(/\./g,"/"));var o=m({},t.oConstraints);var f=m({},t.oFormatOptions);if(f.style){delete f.style;}f.pattern=p;f.calendarType=C.Gregorian;if(o&&o.isDateOnly){delete o.isDateOnly;o.displayFormat="Date";}if(t.bV4){if(!o){o={};}o.V4=true;}return new T(f,o);};D.typeToString=function(d,t,p){var i=this.createInternalType(t,p);var s=i.formatValue(d,"string");return s;};D.stringToType=function(d,t,p){var i=this.createInternalType(t,p);var v=i.parseValue(d,"string");return v;};return D;},true);
