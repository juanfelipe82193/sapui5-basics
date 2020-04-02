/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel"],function(R){"use strict";var r=new R({bundleName:"sap.fe.macros.messagebundle",async:true}),o=sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");return{getModel:function(){return r;},getText:function(t,p){return o.getText(t,p);}};},true);
