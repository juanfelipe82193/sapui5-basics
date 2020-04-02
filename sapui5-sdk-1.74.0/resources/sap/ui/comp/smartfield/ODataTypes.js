/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/SimpleType","sap/ui/core/format/NumberFormat","sap/ui/model/odata/type/Boolean","sap/ui/comp/smartfield/type/Double","sap/ui/comp/smartfield/type/DateTime","sap/ui/comp/odata/type/StringDate","sap/ui/comp/odata/type/FiscalDate","sap/ui/comp/smartfield/type/DateTimeOffset","sap/ui/comp/smartfield/type/Decimal","sap/ui/comp/smartfield/type/Int16","sap/ui/comp/smartfield/type/Int32","sap/ui/comp/smartfield/type/Int64","sap/ui/comp/smartfield/type/Byte","sap/ui/comp/smartfield/type/SByte","sap/ui/comp/smartfield/type/String","sap/ui/comp/smartfield/type/TextArrangementString","sap/ui/comp/smartfield/type/TextArrangementGuid","sap/ui/comp/smartfield/type/AbapBool","sap/ui/comp/smartfield/type/Currency","sap/ui/comp/smartfield/type/Time","sap/ui/comp/smartfield/type/Guid","sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/odata/FiscalMetadata"],function(S,N,B,D,a,b,F,c,d,I,e,f,g,h,i,T,j,A,C,k,G,M,l){"use strict";var O=function(P){this._oParent=P;};O.prototype.getType=function(P,n,q,s){s=s||{};var r=this._oParent.getBindingInfo("value"),t=r&&r.type,u=s.composite&&(t instanceof S);if(t&&!u){return m(t);}if(P&&P.property&&P.property.type){if(!t){q=this.getConstraints(P.property,q);}switch(P.property.type){case"Edm.Boolean":return new B(n,q);case"Edm.Double":return new D(n,q);case"Edm.Decimal":case"Edm.Single":return new d(n,this._getDecimalConstraints(P,q));case"Edm.Int16":return new I(n,q);case"Edm.Int32":return new e(n,q);case"Edm.Int64":return new f(n,q);case"Edm.Byte":return new g(n,q);case"Edm.SByte":return new h(n,q);case"Edm.DateTimeOffset":return new c(n,q);case"Edm.DateTime":return new a(n,this._getDateTimeConstraints(P,q));case"Edm.String":if(this.isCalendarDate(P)){return new b(n);}var v=l.getFiscalAnotationType(P.property);if(v){return new F(n,q,{anotationType:v});}if(!t){q=this._getStringConstraints(P);}if(s.composite){n=Object.assign({},n,this._getTextArrangementFormatOptions());return new T(n,q,this._getTextArrangementOptions(s));}return new i(n,q);case"Edm.Time":return new k(n,q);case"Edm.Guid":if(s.composite){n=Object.assign({},n,this._getTextArrangementFormatOptions());return new j(n,q,this._getTextArrangementOptions(s));}return new G(n,q);default:return null;}}return null;};function m(t){var P=t.parseValue,n=t.destroy;t.parseValue=function(v,s){var q=P.apply(this,arguments);if(typeof this.oFieldControl==="function"){this.oFieldControl(v,s);}return q;};t.destroy=function(){n.apply(this,arguments);this.oFieldControl=null;};return t;}O.prototype.getConstraints=function(P,n){return Object.assign({},n,{nullable:M.isNullable(P)});};O.prototype._getDateTimeConstraints=function(P,q){var r={},n;if((P.property["sap:display-format"]==="Date")||this.isCalendarDate(P)){r={displayFormat:"Date"};}for(n in q){r[n]=q[n];}return r;};O.prototype.getMaxLength=function(P,n){var v=[],V,r=0;if(n&&n.constraints){if(n.constraints.maxLength&&n.constraints.maxLength>-1){v.push(n.constraints.maxLength);}}if(n&&n.type&&n.type.oConstraints){if(n.type.oConstraints.maxLength&&n.type.oConstraints.maxLength>-1){v.push(n.type.oConstraints.maxLength);}}if(P&&P.property&&P.property.maxLength){var q=parseInt(P.property.maxLength);if(q>-1){v.push(q);}}var s=this._oParent.getMaxLength();if(s>0){v.push(s);}var t=v.length;while(t--){V=v[t];if(V>0){if(r>0){if(V<r){r=V;}}else{r=V;}}}return r;};O.prototype._getDecimalConstraints=function(P,n){n=n||{};if(P.property.precision){n.precision=parseInt(P.property.precision);}if(P.property.scale){n.scale=parseInt(P.property.scale);}return n;};O.prototype._getTextArrangementFormatOptions=function(){return{textArrangement:this._oParent.getControlFactory()._getDisplayBehaviourConfiguration()};};O.prototype._getStringConstraints=function(P,n){n=n||{};var q=this._oParent.getBindingInfo("value"),r=this.getMaxLength(P,q),E;if(q&&q.type&&q.type.oConstraints){if(q.type.oConstraints.equals){E=q.type.oConstraints.equals;}}if(r>0||E){if(r>0){n.maxLength=r;}if(E){n.equals=E;}}if(M.isDigitSequence(P.property)){n.isDigitSequence=true;}return n;};O.prototype._getTextArrangementOptions=function(n){var t=this._oParent.getControlFactory().oTextArrangementDelegate;return{keyField:n.keyField,descriptionField:n.descriptionField,onBeforeValidateValue:t.onBeforeValidateValue.bind(t)};};O.prototype.isCalendarDate=function(P){var n=P.property["com.sap.vocabularies.Common.v1.IsCalendarDate"];if(n&&n.Bool){return n.Bool?n.Bool!=="false":true;}return false;};O.prototype.getDisplayFormatter=function(P,s){s=s||{};if(s.currency){return this.getCurrencyDisplayFormatter(s);}return this.getUOMDisplayFormatter(P);};O.prototype.getCurrencyDisplayFormatter=function(s){var n=N.getCurrencyInstance({showMeasure:false});return function(q,r){var v,t,P;if(!q||!r||r==="*"){return"";}if(!s.currency){v=q+="\u2008";return v;}t=n.oLocaleData.getCurrencyDigits(r);v=n.format(q,r);if(t===0){v+="\u2008";}P=3-t;if(P){v=v.padEnd(v.length+P,"\u2007");}else{v+="\u2007";}if(s.mask){return O.maskValue(v);}return v;};};O.prototype.getUOMDisplayFormatter=function(P){var n={};if(P.scale){n.minFractionDigits=n.maxFractionDigits=parseInt(P.scale);}if(P.precision){n.precision=parseInt(P.precision);}var q=N.getFloatInstance(n);return function(v,u){if((v==null)||!u||(u==="*")){return"";}if(isNaN(parseFloat(v))){return v.toString()+"\u2008";}return q.format(v,u)+"\u2008";};};O.maskValue=function(t){if(t){return t.replace(new RegExp(".","igm"),"*");}return t;};O.prototype.getCurrencyType=function(P){if(P){var n=this._getDecimalConstraints(P),q=this.getConstraints(P.property,n),r=o(q),s=p(n);return new C(r,this.getConstraints(P.property,s));}return null;};function o(n){var E=n.nullable?null:0;return{showMeasure:false,parseAsString:true,emptyString:E,precision:n.precision};}function p(n){return{precision:n.precision,scale:n.scale};}O.prototype.getAbapBoolean=function(){return new A();};O.prototype.destroy=function(){this._oParent=null;};return O;},true);
