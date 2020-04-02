/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject"],function(M){"use strict";var N=M.extend("sap.ui.vk.NodeProxy",{metadata:{properties:{nodeRef:"any",veIds:"object[]",name:"string",localMatrix:{type:"sap.ui.vk.TransformationMatrix",bindable:"bindable"},worldMatrix:{type:"sap.ui.vk.TransformationMatrix",bindable:"bindable"},material:{type:"sap.ui.vk.Material"},opacity:{type:"float",bindable:"bindable"},tintColorABGR:{type:"int",bindable:"bindable"},tintColor:{type:"sap.ui.core.CSSColor",bindable:"bindable"},nodeMetadata:"object",hasChildren:"boolean",closed:"boolean"}}});N.prototype.setClosed=function(v){return this;};N.prototype.setHasChildren=function(v){return this;};N.prototype.setName=function(v){return this;};N.prototype.setNodeId=function(v){return this;};N.prototype.setNodeMetadata=function(v){return this;};N.prototype.setVeIds=function(v){return this;};N.prototype.assignMaterial=function(v){return this;};N.prototype.getLocalTranslate=function(){return[0,0,0];};N.prototype.getLocalScale=function(){return[1,1,1];};N.prototype.getLocalRotationInQuaternion=function(){return[1,0,0,1];};N.prototype.getLocalRotationInAngleAxis=function(){return[1,0,0,0];};N.prototype.getLocalRotationInEuler=function(){return[0,0,0,0];};return N;});
