/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor","sap/base/util/deepClone","sap/base/util/isPlainObject"],function(B,M,d,i){"use strict";var P=M.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.parametersEditor.ParametersEditor",{onValueChange:function(){var c=this.getConfig();if(c.value){var I=Object.keys(c.value).map(function(k){var v=(c.value[k]||{}).value;return{key:k,value:[{type:i(v)?"json":"string",path:k,value:v}]};});this._itemsModel.setData(I);}},firePropertyChange:function(p){var f={};Object.keys(p).forEach(function(k){f[k]=this._formatValue(d(p[k]),k);}.bind(this));this.fireEvent("propertyChange",{path:this.getConfig().path,value:f});},_formatValue:function(v,k){if(!i(v)||!v.hasOwnProperty("value")){v={value:v};}return v;},renderer:M.getMetadata().getRenderer().render});return P;});
