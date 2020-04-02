/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/base/util/extend","./formatters/DateTimeFormatter","./formatters/NumberFormatter","./bindingFeatures/DateRange"],function(M,e,D,N,a){"use strict";var B={};var f={date:D.date,dateTime:D.dateTime,currency:N.currency,"float":N.float,integer:N.integer,percent:N.percent,unit:N.unit};B.mLocals={"format":f,"dateRange":a};B.extractBindingInfo=function(v){return M.bindingParser(v,undefined,true,undefined,undefined,undefined,B.mLocals);};B.createBindingInfos=function(i){if(!i){return i;}if(Array.isArray(i)){return i.map(B.createBindingInfos);}if(typeof i==="object"){var I={};for(var k in i){I[k]=B.createBindingInfos(i[k]);}return I;}return B.extractBindingInfo(i)||i;};B.formattedProperty=function(v,F){var b={};if(Array.isArray(v)){b.parts=v.map(function(i){return typeof i==="object"?e({},i):i;});b.formatter=F;}else if(typeof v==="object"){b=e({},v);b.formatter=F;}else{b=F(v);}return b;};return B;});
