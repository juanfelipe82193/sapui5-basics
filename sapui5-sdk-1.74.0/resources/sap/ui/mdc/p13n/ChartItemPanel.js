/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BasePanel","sap/m/Label","sap/m/ColumnListItem","sap/m/Select","sap/m/Text","sap/ui/core/Item"],function(B,L,C,S,T,I){"use strict";var a=B.extend("sap.ui.mdc.p13n.ChartItemPanel",{library:"sap.ui.mdc",metadata:{},init:function(){B.prototype.init.apply(this,arguments);var c=new C({selected:"{selected}",cells:[new L({wrapping:true,text:"{label}",tooltip:"{tooltip}"}),new T({wrapping:true,text:"{kind}"}),new S({width:"100%",selectedKey:"{role}",change:[this.onChangeOfRole,this],forceSelection:false,enabled:"{selected}",items:{path:"availableRoles",templateShareable:false,template:new I({key:"{key}",text:"{text}"})}})]});this.setTemplate(c);this.setPanelColumns([this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"),this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_TYPE"),this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_ROLE")]);},renderer:{}});a.prototype.onChangeOfRole=function(e){var s=e.getParameter("selectedItem");if(s){var t=e.getSource().getParent();this.fireChange();this._updateEnableOfMoveButtons(t);}};return a;});
