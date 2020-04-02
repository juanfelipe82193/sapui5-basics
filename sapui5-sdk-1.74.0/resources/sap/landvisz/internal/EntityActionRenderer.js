/*!
 *  SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library"],function(l){"use strict";var E=l.EntityCSSSize;var a={};a.render=function(r,c){if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div tabIndex='0' ");r.writeControlData(c);var b=c.getRenderingSize();if(c.entityMaximized!=true){if(b==E.Small||b==E.RegularSmall||b==E.Regular||b==E.Medium){r.addClass("sapLandviszIcon_buttonSmall");}else r.addClass("sapLandviszIcon_button");}else if(c.entityMaximized==true){r.addClass("sapLandviszIcon_button");c.entityActionIcon.setWidth("16px");c.entityActionIcon.setHeight("16px");}r.writeClasses();r.write(">");c.setTooltip(c.getActionTooltip());c.entityActionIcon.setSrc(c.getIconSrc());c.entityActionIcon.setTooltip(c.getActionTooltip());r.renderControl(c.entityActionIcon);r.write("</div>");}};return a;},true);
