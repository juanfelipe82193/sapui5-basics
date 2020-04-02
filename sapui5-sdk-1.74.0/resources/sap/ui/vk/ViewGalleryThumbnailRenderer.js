/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./library","sap/ui/Device"],function(l,D){"use strict";var V={};V.render=function(r,i){r.write("<div ");r.writeControlData(i);r.addStyle("height",i.getThumbnailHeight());r.addStyle("width",i.getThumbnailWidth());r.addStyle("background-image","url("+i.getSource()+")");r.writeStyles();r.addClass("sapVizKitViewGalleryThumbnail");r.writeClasses();var t=i.getTooltip();if(t){r.attr("title",t);}r.write(">");var a=i._getIndex()+1;if(a>0){r.write("<div class='sapVizKitViewGalleryStepNumberText'>");r.writeEscaped(a.toString());r.write("</div>");}r.write("</div>");};return V;},true);
