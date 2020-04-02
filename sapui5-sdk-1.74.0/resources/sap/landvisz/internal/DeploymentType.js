/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","sap/ui/commons/Image","./DeploymentTypeRenderer"],function(l,C,I,D){"use strict";var a=C.extend("sap.landvisz.internal.DeploymentType",{metadata:{library:"sap.landvisz",properties:{type:{type:"string",group:"Data",defaultValue:null}}}});a.prototype.init=function(){this.left=0;this.top=0;this.initializationDone=false;this.entityId="";this.count=0;this.type="";this.standardWidth=0;this.srcEntityId="";};a.prototype.initControls=function(){var c=this.getId();this.iconType&&this.iconType.destroy();this.iconType=new I(c+"-solutionCategoryImg");this.iconLeft&&this.iconLeft.destroy();this.iconLeft=new I(c+"-solutionCategoryLeftImg");this.iconRight&&this.iconRight.destroy();this.iconRight=new I(c+"-solutionCategoryRightImg");};return a;});
