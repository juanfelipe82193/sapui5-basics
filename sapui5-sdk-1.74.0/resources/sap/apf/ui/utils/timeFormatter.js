/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define(['sap/ui/model/odata/type/Time'],function(T){"use strict";var a=function(){};a.prototype.constructor=a;a.prototype.getFormattedValue=function(m,o){var f=o;if(o.__edmType!=undefined&&o.__edmType==="Edm.Time"){var t=new T();f=t.formatValue(o,"string");}return f;};return a;},true);
