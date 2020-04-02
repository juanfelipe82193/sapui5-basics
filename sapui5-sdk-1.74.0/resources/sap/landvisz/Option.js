/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","./OptionRenderer"],function(l,C,O){"use strict";var a=C.extend("sap.landvisz.Option",{metadata:{library:"sap.landvisz",properties:{type:{type:"string",group:"Identification",defaultValue:null},currentEntity:{type:"string",group:"Data",defaultValue:null}},aggregations:{optionEntities:{type:"sap.landvisz.OptionEntity",multiple:true,singularName:"optionEntity"}}}});a.prototype.init=function(){this.viewType;};return a;});
