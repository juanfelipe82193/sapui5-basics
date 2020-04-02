/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var T=function(n,c){this.nodeIdField=n;this.childrenField=c;};T.prototype.getPathToNode=function(n,t){var s=[];this._walkTree(n,t,s);return s;};T.prototype._walkTree=function(n,t,s){var f=this._findLeaf(t,n);if(f){s.push(n);return true;}for(var i=0;i<t.length;i++){if(t[i][this.childrenField]){s.push(t[i][this.nodeIdField]);if(this._walkTree(n,t[i][this.childrenField],s)){return true;}s.pop();}}};T.prototype._findLeaf=function(t,n){for(var i=0;i<t.length;i++){if(t[i][this.nodeIdField]===n){return t[i];}}return null;};return T;});
