/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var N=C.extend("sap.collaboration.components.fiori.notification.NotificationContainer",{metadata:{aggregations:{"content":{singularName:"content"}}},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapClbNotifContainerBox");r.writeClasses();r.writeStyles();r.write(">");var a=c.getContent();for(var i=0,l=a.length;i<l;i++){r.renderControl(a[i]);}r.write("</div>");}});return N;});
