/*!
 * SAP APF Analysis Path Framework 
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/suite/ui/commons/ChartContainer","sap/suite/ui/commons/ChartContainerToolbarPlaceholder","sap/m/OverflowToolbar","sap/ui/layout/VerticalLayout"],function(C,a,O,V){"use strict";return sap.ui.jsview("sap.apf.ui.reuse.view.stepContainer",{getControllerName:function(){return"sap.apf.ui.reuse.controller.stepContainer";},createContent:function(c){if(sap.ui.Device.system.desktop){c.getView().addStyleClass("sapUiSizeCompact");}var b=new C({id:c.createId("idChartContainer"),showFullScreen:true}).addStyleClass("chartContainer ChartArea");var t=new O({id:c.createId("idChartContainerToolbar")});t.addContent(new a());b.setToolbar(t);this.stepLayout=new V({id:c.createId("idStepLayout"),content:[b],width:"100%"});this.stepLayout.setBusy(true);return this.stepLayout;}});});
