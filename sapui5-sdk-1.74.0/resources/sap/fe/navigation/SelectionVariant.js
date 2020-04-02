/*!
 * @copyright@
 */
sap.ui.define(["./NavError","sap/ui/base/Object","sap/ui/thirdparty/jquery","sap/base/Log"],function(E,B,q,L){"use strict";var S=B.extend("sap.fe.navigation.SelectionVariant",{_rVALIDATE_SIGN:new RegExp("[E|I]"),_rVALIDATE_OPTION:new RegExp("EQ|NE|LE|GE|LT|GT|BT|CP"),constructor:function(s){this._mParameters={};this._mSelectOptions={};this._sId="";if(s!==undefined){if(typeof s==="string"){this._parseFromString(s);}else if(typeof s==="object"){this._parseFromObject(s);}else{throw new E("SelectionVariant.INVALID_INPUT_TYPE");}}},getID:function(){return this._sId;},setID:function(i){this._sId=i;},setText:function(n){if(typeof n!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}this._sText=n;},getText:function(){return this._sText;},setParameterContextUrl:function(u){if(typeof u!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}this._sParameterCtxUrl=u;},getParameterContextUrl:function(){return this._sParameterCtxUrl;},getFilterContextUrl:function(){return this._sFilterCtxUrl;},setFilterContextUrl:function(u){if(typeof u!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}this._sFilterCtxUrl=u;},addParameter:function(n,v){if(typeof n!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(typeof v!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(n===""){throw new E("SelectionVariant.PARAMETER_WITHOUT_NAME");}if(this._mSelectOptions[n]){throw new E("SelectionVariant.PARAMETER_SELOPT_COLLISION");}this._mParameters[n]=v;return this;},removeParameter:function(n){if(typeof n!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(n===""){throw new E("SelectionVariant.PARAMETER_WITHOUT_NAME");}delete this._mParameters[n];return this;},renameParameter:function(n,N){if(typeof n!=="string"||typeof N!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(n===""||N===""){throw new E("SelectionVariant.PARAMETER_WITHOUT_NAME");}if(this._mParameters[n]!==undefined){if(this._mSelectOptions[N]){throw new E("SelectionVariant.PARAMETER_SELOPT_COLLISION");}if(this._mParameters[N]){throw new E("SelectionVariant.PARAMETER_COLLISION");}this._mParameters[N]=this._mParameters[n];delete this._mParameters[n];}return this;},getParameter:function(n){if(typeof n!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}return this._mParameters[n];},getParameterNames:function(){return Object.keys(this._mParameters);},addSelectOption:function(p,s,o,l,h){if(typeof p!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(p===""){throw new E("SelectionVariant.INVALID_PROPERTY_NAME");}if(typeof s!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(typeof o!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(typeof l!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(o==="BT"&&typeof h!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(!this._rVALIDATE_SIGN.test(s.toUpperCase())){throw new E("SelectionVariant.INVALID_SIGN");}if(!this._rVALIDATE_OPTION.test(o.toUpperCase())){throw new E("SelectionVariant.INVALID_OPTION");}if(this._mParameters[p]){throw new E("SelectionVariant.PARAMETER_SELOPT_COLLISION");}if(o!=="BT"){if(h!==undefined&&h!==""&&h!==null){throw new E("SelectionVariant.HIGH_PROVIDED_THOUGH_NOT_ALLOWED");}}if(this._mSelectOptions[p]===undefined){this._mSelectOptions[p]=[];}var e={Sign:s.toUpperCase(),Option:o.toUpperCase(),Low:l};if(o==="BT"){e.High=h;}else{e.High=null;}for(var i=0;i<this._mSelectOptions[p].length;i++){var a=this._mSelectOptions[p][i];if(a.Sign===e.Sign&&a.Option===e.Option&&a.Low===e.Low&&a.High===e.High){return this;}}this._mSelectOptions[p].push(e);return this;},removeSelectOption:function(n){if(typeof n!=="string"){throw new E("SelectionVariant.SELOPT_WRONG_TYPE");}if(n===""){throw new E("SelectionVariant.SELOPT_WITHOUT_NAME");}delete this._mSelectOptions[n];return this;},renameSelectOption:function(n,N){if(typeof n!=="string"||typeof N!=="string"){throw new E("SelectionVariant.SELOPT_WRONG_TYPE");}if(n===""||N===""){throw new E("SelectionVariant.SELOPT_WITHOUT_NAME");}if(this._mSelectOptions[n]!==undefined){if(this._mSelectOptions[N]){throw new E("SelectionVariant.SELOPT_COLLISION");}if(this._mParameters[N]){throw new E("SelectionVariant.PARAMETER_SELOPT_COLLISION");}this._mSelectOptions[N]=this._mSelectOptions[n];delete this._mSelectOptions[n];}return this;},getSelectOption:function(p){if(typeof p!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}if(p===""){throw new E("SelectionVariant.INVALID_PROPERTY_NAME");}var e=this._mSelectOptions[p];if(!e){return undefined;}return JSON.parse(JSON.stringify(e));},getSelectOptionsPropertyNames:function(){return Object.keys(this._mSelectOptions);},getPropertyNames:function(){return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());},massAddSelectOption:function(p,s){if(!Array.isArray(s)){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}for(var i=0;i<s.length;i++){var o=s[i];this.addSelectOption(p,o.Sign,o.Option,o.Low,o.High);}return this;},getValue:function(n){var v=this.getSelectOption(n);if(v!==undefined){return v;}var p=this.getParameter(n);if(p!==undefined){v=[{Sign:"I",Option:"EQ",Low:p,High:null}];return v;}return undefined;},isEmpty:function(){return this.getParameterNames().length===0&&this.getSelectOptionsPropertyNames().length===0;},toJSONObject:function(){var e={Version:{Major:"1",Minor:"0",Patch:"0"},SelectionVariantID:this._sId};if(this._sParameterCtxUrl){e.ParameterContextUrl=this._sParameterCtxUrl;}if(this._sFilterCtxUrl){e.FilterContextUrl=this._sFilterCtxUrl;}if(this._sText){e.Text=this._sText;}else{e.Text="Selection Variant with ID "+this._sId;}this._determineODataFilterExpression(e);this._serializeParameters(e);this._serializeSelectOptions(e);return e;},toJSONString:function(){return JSON.stringify(this.toJSONObject());},_determineODataFilterExpression:function(e){e.ODataFilterExpression="";},_serializeParameters:function(e){if(this._mParameters.length===0){return;}e.Parameters=[];q.each(this._mParameters,function(p,P){var o={PropertyName:p,PropertyValue:P};e.Parameters.push(o);});},_serializeSelectOptions:function(e){if(this._mSelectOptions.length===0){return;}e.SelectOptions=[];q.each(this._mSelectOptions,function(p,a){var s={PropertyName:p,Ranges:a};e.SelectOptions.push(s);});},_parseFromString:function(j){if(j===undefined){throw new E("SelectionVariant.UNABLE_TO_PARSE_INPUT");}if(typeof j!=="string"){throw new E("SelectionVariant.INVALID_INPUT_TYPE");}var i=JSON.parse(j);this._parseFromObject(i);},_parseFromObject:function(i){if(i.SelectionVariantID===undefined){L.warning("SelectionVariantID is not defined");i.SelectionVariantID="";}this.setID(i.SelectionVariantID);if(i.ParameterContextUrl!==undefined&&i.ParameterContextUrl!==""){this.setParameterContextUrl(i.ParameterContextUrl);}if(i.FilterContextUrl!==undefined&&i.FilterContextUrl!==""){this.setFilterContextUrl(i.FilterContextUrl);}if(i.Text!==undefined){this.setText(i.Text);}if(i.Parameters){this._parseFromStringParameters(i.Parameters);}if(i.SelectOptions){this._parseFromStringSelectOptions(i.SelectOptions);}},_parseFromStringParameters:function(p){q.each(p,q.proxy(function(i,e){this.addParameter(e.PropertyName,e.PropertyValue);},this));},_parseFromStringSelectOptions:function(s){q.each(s,q.proxy(function(i,o){if(!o.Ranges){L.warning("Select Option object does not contain a Ranges entry; ignoring entry");return true;}if(!Array.isArray(o.Ranges)){throw new E("SelectionVariant.SELECT_OPTION_RANGES_NOT_ARRAY");}q.each(o.Ranges,q.proxy(function(I,r){this.addSelectOption(o.PropertyName,r.Sign,r.Option,r.Low,r.High);},this));},this));}});return S;},true);
