/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','../library'],function(E,l){"use strict";var S=l.SelectionMode;var a=E.extend("sap.ui.table.plugins.SelectionPlugin",{metadata:{"abstract":true,library:"sap.ui.table",properties:{selectionMode:{type:"sap.ui.table.SelectionMode",defaultValue:S.MultiToggle,visibility:"hidden"}},events:{selectionChange:{parameters:{}}}}});a.prototype.init=function(){this._bSuspended=false;};a.prototype.exit=function(){this._oBinding=null;};a.prototype.getRenderConfig=function(){return{headerSelector:{type:"none"}};};a.prototype.addSelectionInterval=function(i,I){};a.prototype.clearSelection=function(){};a.prototype.getSelectedIndex=function(){return-1;};a.prototype.getSelectedIndices=function(){return[];};a.prototype.getSelectableCount=function(){return 0;};a.prototype.getSelectedCount=function(){return 0;};a.prototype.isIndexSelectable=function(i){return false;};a.prototype.isIndexSelected=function(i){return false;};a.prototype.removeSelectionInterval=function(i,I){};a.prototype.selectAll=function(){};a.prototype.setSelectedIndex=function(i){};a.prototype.setSelectionInterval=function(i,I){};a.prototype.fireSelectionChange=function(A){if(!this._isSuspended()){this.fireEvent("selectionChange",A);}};a.prototype._setSelectionMode=function(s){this.setProperty("selectionMode",s);};a.prototype._getSelectionMode=function(){return this.getProperty("selectionMode");};a.prototype._getBinding=function(){return this._oBinding;};a.prototype._setBinding=function(b){this._oBinding=b;};a.prototype._suspend=function(){this._bSuspended=true;};a.prototype._resume=function(){this._bSuspended=false;};a.prototype._isSuspended=function(){return this._bSuspended;};return a;});
