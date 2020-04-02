/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","sap/ui/model/odata/v4/AnnotationHelper","sap/ui/base/ManagedObject","sap/base/util/JSTokenizer","sap/base/util/merge","sap/base/strings/formatMessage"],function(L,O,M,J,m,f){"use strict";var A={buildExpressionForProgressIndicatorPercentValue:function(i,d,u){var p="0";var e;var o=i.getModel(1);var P=i.getPath(1);var b=o.createBindingContext(P);if(d.Value&&d.Value.$Path){var v=sap.ui.model.odata.v4.AnnotationHelper.value(d.Value,{context:b});var V="$"+v;var t;if(d.TargetValue){t=sap.ui.model.odata.v4.AnnotationHelper.value(d.TargetValue,{context:b});if(d.TargetValue.$Path){t="$"+t;}}var E="(({0} > 100) ? 100 : (({0} < 0) ? 0 : ({0} * 1)))";var s="(({1} > 0) ? (({0} > {1}) ? 100 : (({0} < 0) ? 0 : ({0} / {1} * 100))) : 0)";if(u){u="'"+u+"'";e="'{'= ({2} === ''%'') ? "+E+" : "+s+" '}'";p=f(e,[V,t,u]);}else{e="'{'= "+s+" '}'";p=f(e,[V,t]);}}return p;},buildExpressionForProgressIndicatorDisplayValue:function(i,d,u){var o=i.getModel(1);var p=i.getPath(1);var b=o.createBindingContext(p);var P=[];P.push(sap.ui.model.odata.v4.AnnotationHelper.value(d.Value,{context:b}));P.push(sap.ui.model.odata.v4.AnnotationHelper.value(d.TargetValue,{context:b}));P.push(u);var D=A.formatDisplayValue(P);return D;},formatDisplayValue:function(p){var d="",v=p[0],t=p[1],u=p[2];if(v){return sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates",true).then(function(r){if(u){if(u==="%"){d=r.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_PERCENT",[v]);}else{if(t){d=r.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT",[v,t,u]);}else{d=r.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT_NO_TARGET_VALUE",[v,u]);}}}else{if(t){d=r.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM",[v,t]);}else{d=v;}}return d;});}else{L.warning("Value property is mandatory, the default (empty string) will be returned");}},buildExpressionForCriticality:function(d){var F=sap.ui.core.ValueState.None;var e;var c=d.Criticality;if(c){e="'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''"+sap.ui.core.ValueState.Error+"'' : "+"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Critical'') || ({0} === ''2'') || ({0} === 2) ? ''"+sap.ui.core.ValueState.Warning+"'' : "+"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''"+sap.ui.core.ValueState.Success+"'' : "+"''"+sap.ui.core.ValueState.None+"'' '}'";if(c.$Path){var C="${"+c.$Path+"}";F=f(e,C);}else if(c.$EnumMember){var s="'"+c.$EnumMember+"'";F=f(e,s);}else{L.warning("Case not supported, returning the default sap.ui.core.ValueState.None");}}else{L.warning("Case not supported, returning the default sap.ui.core.ValueState.None");}return F;},buildRatingIndicatorSubtitleExpression:function(c,s){if(s){return sap.fe.templates.ObjectPage.AnnotationHelper.formatRatingIndicatorSubTitle(sap.ui.model.odata.v4.AnnotationHelper.value(s,{context:c}));}},formatRatingIndicatorSubTitle:function(s){if(s){return sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates",true).then(function(r){var S=s>1?r.getText("RATING_INDICATOR_SUBTITLE_LABEL_PLURAL"):r.getText("RATING_INDICATOR_SUBTITLE_LABEL");return r.getText("RATING_INDICATOR_SUBTITLE",[s,S]);});}},getBindingPathForForm:function(p){var n=sap.ui.model.odata.v4.AnnotationHelper.getNavigationPath(p);return"{path:'"+n+"'}";},getElementBinding:function(p){var n=sap.ui.model.odata.v4.AnnotationHelper.getNavigationPath(p);if(n){return"{path:'"+n+"'}";}else{return"{path: ''}";}},getDeleteButtonVisibility:function(r,v,d){if(v>1){if(d){return"{= !$"+d+" && (${ui>/editable} === 'Editable')}";}if(r){return"{= $"+r+" && (${ui>/editable} === 'Editable')}";}else{return"{= (${ui>/editable} === 'Editable')}";}}else if(d){return"{= !$"+d+" && !(${ui>/editable} === 'Editable')}";}else if(r){return"{= $"+r+" && !(${ui>/editable} === 'Editable')}";}else{return"{= !(${ui>/editable} === 'Editable')}";}},getEditAction:function(e){var p=e.getPath(),a=e.getObject(p+"@");var d=a.hasOwnProperty("@com.sap.vocabularies.Common.v1.DraftRoot");var s=a.hasOwnProperty("@com.sap.vocabularies.Session.v1.StickySessionSupported");var b;if(d){b=e.getObject(p+"@com.sap.vocabularies.Common.v1.DraftRoot/EditAction");}else if(s){b=e.getObject(p+"@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction");}return!b?b:p+"/"+b;},getLinkEntityType:function(c){return c.getObject();},formatTextForBreadcrumbs:function(i,t,T){var o=i.getInterface(1).getModel();var p=i.getInterface(1).getPath();var b=o.createBindingContext(p);var B=sap.ui.model.odata.v4.AnnotationHelper.value(t,{context:b});if(t&&T&&B.indexOf("{")===-1){var s,a=T.replace(/'/g,"\\'");s="{= $"+B+" ? $"+B+" : '"+a+"' }";return s;}else{if(!B){return T||"[[no title]]";}return B;}},isDeepFacetHierarchy:function(F){if(F.Facets){for(var i=0;i<F.Facets.length;i++){if(F.Facets[i].$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"){return true;}}}return false;},getDataFieldCollection:function(t){var p=t.getPath();var T=t.getObject(p),n=O.getNavigationPath(p);return n+"/"+T+(T.indexOf("com.sap.vocabularies.UI.v1.FieldGroup")>-1?"/Data":"");},isReadOnlyFromStaticAnnotations:function(a,F){var c,i,r;if(a["@Org.OData.Core.V1.Computed"]){c=a["@Org.OData.Core.V1.Computed"].Bool?a["@Org.OData.Core.V1.Computed"].Bool=="true":true;}if(a["@Org.OData.Core.V1.Immutable"]){i=a["@Org.OData.Core.V1.Immutable"].Bool?a["@Org.OData.Core.V1.Immutable"].Bool=="true":true;}r=c||i;if(F){r=r||F=="com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";}if(r){return false;}else{return true;}},buildExpressionForTitle:function(h){var t="";if(h&&h.Title){t="{= ${ui>/createMode} ";var H;if(typeof h.Title.Value==="object"){H="${"+h.Title.Value.$Path+"}";}else{H="'"+h.Title.Value+"'";}if(h.TypeName){t=t+"&& ("+H+" === '' || "+H+" === undefined || "+H+" === null)";t=t+" ? ${sap.fe.i18n>DEFAULT_OBJECT_PAGE_HEADER_TITLE} + '  ' + '"+h.TypeName+"' : "+H+"}";}else{t=t+" ? ${sap.fe.i18n>DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO} : "+H+"}";}}return t;},isReadOnlyFromDynamicAnnotations:function(F){var i;if(F){if(M.bindingParser(F)){i="$"+F+" === '1'";}}if(i){return"{= "+i+"? false : true }";}else{return true;}},hasDeterminingActions:function(e){var I=e["@com.sap.vocabularies.UI.v1.Identification"];for(var i in I){if(I[i].$Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"&&I[i].Determining===true){return true;}}return false;},doesFacetOnlyContainForms:function(F){if(F){var c=function(o){return(o.Target&&o.Target.$AnnotationPath&&o.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.FieldGroup")<0&&o.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.Identification")<0&&o.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint")<0&&o.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.StatusInfo")<0);};return!F.some(c);}return false;},getBindingWithoutMeasure:function(b){var B=J.parseJS(b,0).result,F={showMeasure:false};B=m(B,{formatOptions:F});return JSON.stringify(B);}};A.buildExpressionForProgressIndicatorPercentValue.requiresIContext=true;A.formatTextForBreadcrumbs.requiresIContext=true;A.buildExpressionForProgressIndicatorDisplayValue.requiresIContext=true;A.buildRatingIndicatorSubtitleExpression.requiresIContext=true;return A;},true);
