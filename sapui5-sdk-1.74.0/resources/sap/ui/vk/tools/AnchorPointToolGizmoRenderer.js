/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var A={};A.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUiVkTransformationToolEdit");r.writeClasses();r.write(">");r.renderControl(c._editingForm);r.write("</div>");};return A;},true);
