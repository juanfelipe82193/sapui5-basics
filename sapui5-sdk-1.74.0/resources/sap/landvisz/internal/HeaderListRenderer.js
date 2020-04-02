/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library"],function(l){"use strict";var L=l.LandscapeObject;var H={};H.render=function(r,c){if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div tabIndex='0' ");r.writeControlData(c);if(c.getSelected()){r.addClass("sapLandviszMiniNavigationSelected");if(c.getType()==L.TechnicalSystem)r.addClass("sapLandviszTechnicalSystem");else if(c.getType()==L.ProductSystem)r.addClass("sapLandviszProductSystem");else if(c.getType()==L.SapComponent)r.addClass("sapLandviszSapComponent");r.writeClasses();}else if(c.inDisplay==true)r.addClass("sapLandviszMiniNavigationInDisplay");else r.addClass("sapLandviszMiniNavigationNormal");r.writeClasses();r.writeAttributeEscaped("id",c.getId()+"MiniHeader");r.writeAttributeEscaped("title",c.getHeaderTooltip());r.addStyle("width",c.headerWidth+"px");r.writeStyles();r.write(">");r.write("</div>");}};return H;},true);
