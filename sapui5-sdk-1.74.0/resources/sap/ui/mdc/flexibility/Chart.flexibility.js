/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['./SortFlex','./ChartItemFlex'],function(S,C){"use strict";return{addItem:C.addItem,removeItem:C.removeItem,moveItem:C.moveItem,"setChartType":{layers:{USER:true},changeHandler:{createChange:function(p){if(!p.control){throw new Error("Invalid control. The existing control object is mandatory");}return{selectorElement:p.control,changeSpecificData:{changeType:"setChartType",content:{chartType:p.chartType}}};},completeChangeContent:function(c,s){},applyChange:function(c,o,p){c.setRevertData(p.modifier.getProperty(o,"chartType"));p.modifier.setProperty(o,"chartType",c.getContent().chartType);},revertChange:function(c,o,p){p.modifier.setProperty(o,"chartType",c.getRevertData());c.resetRevertData();}}},removeSort:S.removeSort,addSort:S.addSort,moveSort:S.moveSort};},true);
