/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define([],function(){"use strict";var A={};A.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.write(">");c.getPages().forEach(function(p){r.renderControl(p);});r.write("</div>");};return A;},true);
