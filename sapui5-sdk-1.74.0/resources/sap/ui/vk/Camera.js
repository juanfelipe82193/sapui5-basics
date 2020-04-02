/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject"],function(M){"use strict";var C=M.extend("sap.ui.vk.Camera",{metadata:{properties:{"position":{type:"float[]"},"targetDirection":{type:"float[]"},"upDirection":{type:"float[]"},"nearClipPlane":{type:"float"},"farClipPlane":{type:"float"}}}});C.prototype.getCameraRef=function(){return null;};C.prototype.getIsModified=function(){return!!this._isModified;};C.prototype.setIsModified=function(v){this._isModified=v;};return C;});
