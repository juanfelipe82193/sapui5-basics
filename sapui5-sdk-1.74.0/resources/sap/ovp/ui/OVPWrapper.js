/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";return C.extend("sap.ovp.ui.OVPWrapper",{metadata:{library:"sap.ovp",designTime:true,aggregations:{DynamicPage:{type:"sap.ui.core.Control",multiple:false}},defaultAggregation:"DynamicPage"},init:function(){},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("ovpWrapper");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("DynamicPage"));r.write("</div>");}});});
