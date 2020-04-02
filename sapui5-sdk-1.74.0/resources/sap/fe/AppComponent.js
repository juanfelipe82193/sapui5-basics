/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/AppComponent","sap/base/Log"],function(C,L){"use strict";return C.extend("sap.fe.AppComponent",{init:function(){L.error('This class of the AppComponent is deprecated, please use "sap.fe.core.AppComponent" instead');C.prototype.init.apply(this,arguments);}});});
