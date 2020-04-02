/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BasePanel","sap/m/Label","sap/m/ColumnListItem","sap/m/HBox","sap/m/VBox","sap/ui/model/Filter"],function(B,L,C,H,V,F){"use strict";var S=B.extend("sap.ui.mdc.p13n.SelectionPanel",{library:"sap.ui.mdc",metadata:{},init:function(){B.prototype.init.apply(this,arguments);var s=new C({selected:"{selected}",cells:new V({items:[new L({design:"Bold",wrapping:true,tooltip:"{tooltip}",text:"{label}"}),new L({wrapping:true,tooltip:"{tooltip}",text:"{groupLabel}"})]})});this.setTemplate(s);this.setPanelColumns(this.getResourceText("fieldsui.COLUMNS"));},renderer:{}});S.prototype._onSearchFieldLiveChange=function(e){var f=new F([new F("label","Contains",e.getSource().getValue()),new F("groupLabel","Contains",e.getSource().getValue())]);this._oMTable.getBinding("items").filter(f,false);};return S;});
