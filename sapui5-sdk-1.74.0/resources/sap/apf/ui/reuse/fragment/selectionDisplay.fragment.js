/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
(function(){"use strict";sap.ui.jsfragment("sap.apf.ui.reuse.fragment.selectionDisplay",{createContent:function(c){var s=c.getCurrentRepresentation();var r=s.getParameter().requiredFilterOptions;var a=s.getSortedSelections();var R=s.getMetaData().getPropertyMetadata(s.getParameter().requiredFilters[0]);var b=R.label||R.name;if(r&&r.fieldDesc){b=c.oCoreApi.getTextNotHtmlEncoded(r.fieldDesc);}var d=new sap.m.Dialog({id:this.createId("idSelectionDisplayDialog"),title:c.oCoreApi.getTextNotHtmlEncoded("selected-required-filter",[b])+" ("+a.length+")",contentWidth:jQuery(window).height()*0.6+"px",contentHeight:jQuery(window).height()*0.6+"px",buttons:[new sap.m.Button({text:c.oCoreApi.getTextNotHtmlEncoded("close"),press:function(){d.close();d.destroy();}})],afterClose:function(){d.destroy();}});var D={selectionData:a};var e=new sap.m.List({items:{path:"/selectionData",template:new sap.m.StandardListItem({title:"{text}"})}});var m=new sap.ui.model.json.JSONModel();m.setSizeLimit(a.length);m.setData(D);e.setModel(m);d.addContent(e);return d;}});}());
