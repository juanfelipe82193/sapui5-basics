/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var V={};V.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapVizKitViewport");r.writeClasses();r.writeAttribute("tabindex",0);r.writeAttribute("aria-label","Image");var a=false;var w=c.getWidth();if(w){r.addStyle("width",w);a=true;}var h=c.getHeight();if(h){r.addStyle("height",h);a=true;}if(a){r.writeStyles();}r.write(">");var i,l;var t=c.getTools();for(i=0,l=t.length;i<l;i++){var _=sap.ui.getCore().byId(t[i]);var b=_.getGizmoForContainer(c);if(b&&b.render===undefined){r.renderControl(b);}}var C=c.getContent();for(i=0,l=C.length;i<l;i++){r.renderControl(C[i]);}r.write("</div>");};return V;},true);
