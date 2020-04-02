/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var V=C.extend("sap.fe.templates.controls.ViewSwitchContainer",{metadata:{properties:{selectedIndex:{type:"int",defaultValue:0},height:{type:"sap.ui.core.CSSSize"}},events:{},defaultAggregation:"items",aggregations:{items:{type:"sap.fe.templates.controls.ViewSwitchContainerItem",multiple:true,singularName:"item"}},publicMethods:[]},renderer:{render:function(r,c){var I=c.getItems();r.write("<div");r.writeControlData(c);r.write(' style="height: '+c.getHeight()+'"');r.write(">");for(var i=0;i<I.length;i++){if(i!=c.getSelectedIndex()){I[i].setVisible(false);}else{I[i].setVisible(true);}r.renderControl(I[i]);}r.write("</div>");}}});return V;},true);
