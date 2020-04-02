/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var V={};V.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.write(">");r.renderControl(c.getAggregation("animationTimeSlider"));r.renderControl(c.getAggregation("toolbar"));r.renderControl(c.getAggregation("container"));r.write("</div>");};return V;},true);
