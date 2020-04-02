/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library"],function(l){"use strict";var E=l.EntityCSSSize;var L={};L.render=function(r,c){var a=sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div");r.writeControlData(c);r.addClass("sapLandviszLongTextSizeCommon");if(c.getRenderingSize()==E.RegularSmall)r.addClass("sapLandviszLongTextRegularSmallSize");if(c.getRenderingSize()==E.Regular)r.addClass("sapLandviszLongTextRegularSize");if(c.getRenderingSize()==E.Medium)r.addClass("sapLandviszLongTextMediumSize");if(c.getRenderingSize()==E.Large)r.addClass("sapLandviszLongTextLargeSize");r.writeClasses();r.write(">");var b=c.getText();c.oLongText.setWrapping(true);c.oLongText.setText(b);r.renderControl(c.oLongText);r.write("</div>");}};return L;},true);
