/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var I=E.extend("sap.ui.mdc.field.InParameter",{metadata:{library:"sap.ui.mdc",properties:{value:{type:"any",byValue:true},helpPath:{type:"string"}},defaultProperty:"value"}});I.prototype.init=function(){this.attachEvent("modelContextChange",_,this);};I.prototype.exit=function(){};I.prototype.bindProperty=function(n,b){if(n==="value"&&!b.formatter){b.targetType="raw";}E.prototype.bindProperty.apply(this,arguments);};I.prototype.getFieldPath=function(){var b=this.getBinding("value");var p=b&&b.getPath();if(p){if(p.startsWith("/conditions/")){p=p.slice(12);}else if(p.startsWith("/")){p=p.slice(1);}}if(!p){p=this.getHelpPath();}return p;};function _(e){var b=this.getBinding("value");this._bBound=false;this._bConditionModel=false;if(b){this._bBound=true;var m=b.getModel();if(m&&m.isA("sap.ui.mdc.condition.ConditionModel")){this._bConditionModel=true;}}}I.prototype.getUseConditions=function(){var u=false;if(this._bConditionModel){u=true;}else if(!this._bBound){var v=this.getValue();if(Array.isArray(v)&&(v.length===0||v[0].hasOwnProperty("operator"))){u=true;}}return u;};return I;});
