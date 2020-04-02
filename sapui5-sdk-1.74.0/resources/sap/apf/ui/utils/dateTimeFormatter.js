/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/format/DateFormat'],function(D){"use strict";var a=function(){this.oDisplayFormatterMap=_();};a.prototype.constructor=a;function _(){var d=new Map();d.set("Date",b);d.set(undefined,c);return d;}function b(o){var d=D.getDateInstance({style:"short"});var e=d.format(o,true);return e;}function c(o){return o;}a.prototype.getFormattedValue=function(m,o){var d=m["sap:display-format"]!==undefined?m["sap:display-format"]:undefined;var e=new Date(o);if(e.toLocaleString()==="Invalid Date"){return"-";}var f=this.oDisplayFormatterMap.get(d)!==undefined?this.oDisplayFormatterMap.get(d).call(this,e):e;return f;};return a;},true);
