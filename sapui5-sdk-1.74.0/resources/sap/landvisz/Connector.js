/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","./ConnectorRenderer"],function(l,C,a){"use strict";var b=C.extend("sap.landvisz.Connector",{metadata:{library:"sap.landvisz",properties:{source:{type:"string",group:"Data",defaultValue:null},target:{type:"string",group:"Data",defaultValue:null}}}});b.prototype.init=function(){this.viewType;};return b;});
