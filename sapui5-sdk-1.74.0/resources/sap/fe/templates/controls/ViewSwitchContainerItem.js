/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var V=C.extend("sap.fe.templates.controls.ViewSwitchContainerItem",{metadata:{properties:{iconurl:{type:"string"},toolbarId:{type:"string"},height:{type:"sap.ui.core.CSSSize"}},events:{},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:false,singularName:"content"}},publicMethods:[]},renderer:{render:function(r,c){var o=c.getContent();r.write("<div");r.writeControlData(c);r.write(' style="height: '+c.getHeight()+'"');r.write(">");r.renderControl(o);r.write("</div>");}}});return V;},true);
