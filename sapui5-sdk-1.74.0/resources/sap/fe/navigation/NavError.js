/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/Object"],function(B){"use strict";var N=B.extend("sap.fe.navigation.NavError",{metadata:{publicMethods:["getErrorCode"],properties:{},library:"sap.fe"},constructor:function(e){B.apply(this);this._sErrorCode=e;}});N.prototype.getErrorCode=function(){return this._sErrorCode;};return N;});
