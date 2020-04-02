/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var T={updateMode:function(e,v,c){var s=(this._getSplitApp(c).getMode()==="ShowHideMode");if(s){this._getSplitApp(c).setMode('HideMode');}else{this._getSplitApp(c).setMode('ShowHideMode');}this.updateControl(e.getSource(),v,s,c);},_getSplitApp:function(c){if(!this._oSplitApp){this._oSplitApp=c.getSplitApp();}return this._oSplitApp;},updateControl:function(b,v,f,c){if(arguments.length===2){f=!(this._getSplitApp(c).getMode()==="ShowHideMode");}if(!f){b.setTooltip("Show this sample in full screen mode");b.setIcon('sap-icon://full-screen');}else{b.setTooltip("Show this sample in the detail view of a split container.");b.setIcon('sap-icon://exit-full-screen');}},cleanUp:function(){this._oSplitApp=null;}};return T;},true);
