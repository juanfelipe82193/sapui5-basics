/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/d3"],function(d){"use strict";var l=function(){};l.getSVG=function(w,h,i){var v=d.select('#'+i).append("svg").attr("width",w).attr("height",h);return v;};l.convertHtmltoCanvas=function(c,n){html2canvas(c,{allowTaint:true,useCORS:true,onrendered:function(a){n.show(1000);n.css({'background-image':"url("+a.toDataURL("image/png")+")",'background-size':"100% 100%"});}});};return l;},true);
