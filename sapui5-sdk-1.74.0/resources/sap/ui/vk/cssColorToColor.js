/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var c=(function(){var i=false;var d=document.createElement("div");d.id="sap.ui.vk.colorConverter";d.style.setProperty("display","none","important");return function(a){if(!i){if(document.body){document.body.appendChild(d);i=true;}else{return{red:0,green:0,blue:0,alpha:1};}}d.style.setProperty("color","rgba(0, 0, 0, 0)","important");d.style.setProperty("color",a,"important");var e=window.getComputedStyle(d).color;if(e==="transparent"){return{red:0,green:0,blue:0,alpha:0};}else{var b=e.split("(")[1].split(")")[0].split(",");return{red:parseInt(b[0],10),green:parseInt(b[1],10),blue:parseInt(b[2],10),alpha:b.length===4?parseFloat(b[3]):1};}};})();return c;},true);
