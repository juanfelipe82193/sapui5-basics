// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources"],function(r){"use strict";function N(){this.S_COMPONENT_NAME="sap.ushell.services.NavigationDataProvider";this._init.apply(this,arguments);}N.prototype._init=function(a,s){this.oAdapter=a;};N.prototype.getNavigationData=function(){return new Promise(function(a,b){var s=(this.oAdapter.getSystemAliases&&this.oAdapter.getSystemAliases())||{};this.oAdapter.getInbounds().then(function(i){a({systemAliases:s,inbounds:i});}).fail(function(e){var E={component:this.S_COMPONENT_NAME,description:r.i18n.getText("NavigationDataProvider.CannotLoadData"),detail:e};b(E);}.bind(this));}.bind(this));};N.hasNoAdapter=false;return N;});
