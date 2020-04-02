/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Element"],function(q,l,E){"use strict";var T=E.extend("sap.rules.ui.TextRuleConfiguration",{metadata:{library:"sap.rules.ui",properties:{enableSettings:{type:"boolean",defaultValue:false},enableElse:{type:"boolean",defaultValue:true},enableElseIf:{type:"boolean",defaultValue:true}},events:{change:{parameters:{name:{},value:{}}}}},_handlePropertySetter:function(p,v){var r=this.setProperty(p,v,true);this.fireChange({name:p,value:v});return r;},setEnableSettings:function(v){return this._handlePropertySetter("enableSettings",v);},setEnableElse:function(v){return this._handlePropertySetter("enableElse",v);},setEnableElseIf:function(v){return this._handlePropertySetter("enableElseIf",v);},});return T;},true);
