/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var C={};C.render=function(r,c){r.write("<div id =\"sap-ui-dummy-"+c.getId()+"\" style =\"display:none\">");r.write("<div");r.writeControlData(c);r.writeAttribute("data-sap-ui-preserve",c.getId());r.addClass("sapMakitChart");r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");};return C;},true);
