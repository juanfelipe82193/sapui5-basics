/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/TemplateComponent","sap/base/Log","sap/fe/templates/VariantManagement"],function(T,L,V){"use strict";var a=T.extend("sap.fe.templates.ListReport.Component",{metadata:{properties:{initialLoad:{type:"boolean",defaultValue:true},liveMode:{type:"boolean",defaultValue:false},variantManagement:{type:"sap.fe.templates.VariantManagement",defaultValue:V.None}},library:"sap.fe",manifest:"json"},onBeforeBinding:function(c){},onAfterBinding:function(c,p){T.prototype.onAfterBinding.apply(this,arguments);this.getRootControl().getController().onAfterBinding(c,p);},setVariantManagement:function(v){if(v===V.Control){L.error("ListReport does not support Control-level variant management yet");v=V.None;}this.setProperty("variantManagement",v);}});return a;},true);
