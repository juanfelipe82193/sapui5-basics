/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var E=C.extend("sap.rules.ui.ExpressionBase",{metadata:{"abstract":true,properties:{value:{type:"string",defaultValue:"",bindable:"bindable"},editable:{type:"boolean",defaultValue:true},validateOnLoad:{type:"boolean",defaultValue:false},valueStateText:{type:"string",defaultValue:null,bindable:"bindable"},valueState:{type:"string",defaultValue:"None",bindable:"bindable"},attributeInfo:{type:"string",defaultValue:null,bindable:"bindable"},headerInfo:{type:"object",defaultValue:"{}"}},associations:{expressionLanguage:{type:"sap.rules.ui.services.ExpressionLanguage",multiple:false,singularName:"expressionLanguage"},astExpressionLanguage:{type:"sap.rules.ui.services.AstExpressionLanguage",multiple:false,singularName:"astExpressionLanguage"}},publicMethods:["validate"]},renderer:null});E.prototype.init=function(){};return E;},true);
