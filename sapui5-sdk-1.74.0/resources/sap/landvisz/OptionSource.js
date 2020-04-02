/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","./OptionSourceRenderer"],function(l,C,O){"use strict";var a=C.extend("sap.landvisz.OptionSource",{metadata:{library:"sap.landvisz",properties:{source:{type:"string",group:"Data",defaultValue:null}}}});a.prototype.init=function(){this.viewType;};return a;});
