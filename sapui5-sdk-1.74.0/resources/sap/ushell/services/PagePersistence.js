// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";function P(){this._init.apply(this,arguments);}P.prototype._init=function(a,s){this._oServiceConfiguration=s;this.oAdapter=a;};P.prototype.getPage=function(i){return this.oAdapter.getPage(i);};P.hasNoAdapter=false;return P;});
