/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/support/supportRules/RuleSerializer","sap/ui/support/supportRules/Constants"],function(R,a){"use strict";function e(D){return window.btoa(unescape(encodeURIComponent(D)));}function d(D){return decodeURIComponent(escape(window.atob(D)));}return{getRules:function(){var t=[],r;try{r=localStorage.getItem(a.LOCAL_STORAGE_TEMP_RULES_KEY);if(!r){return null;}t=JSON.parse(d(r));t=t.map(function(b){return R.deserialize(b,true);});}catch(E){}return t;},setRules:function(r){var s=e(JSON.stringify(r));localStorage.setItem(a.LOCAL_STORAGE_TEMP_RULES_KEY,s);},getSelectedRules:function(){var r=localStorage.getItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY);if(!r){return null;}return JSON.parse(r);},setSelectedRules:function(s){localStorage.setItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY,JSON.stringify(s));},setSelectedContext:function(s){localStorage.setItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY,JSON.stringify(s));},getSelectedContext:function(){return JSON.parse(localStorage.getItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY));},setSelectedScopeComponents:function(c){localStorage.setItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY,JSON.stringify(c));},getSelectedScopeComponents:function(){var c=localStorage.getItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY);return JSON.parse(c);},removeSelectedRules:function(s){this.setRules(s);},setVisibleColumns:function(v){localStorage.setItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY,JSON.stringify(v));},getVisibleColumns:function(){return JSON.parse(localStorage.getItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY));},getSelectionPresets:function(){return JSON.parse(localStorage.getItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY));},getCustomPresets:function(){return JSON.parse(localStorage.getItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY));},setSelectionPresets:function(s){localStorage.setItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY,JSON.stringify(s));},setCustomPresets:function(c){localStorage.setItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY,JSON.stringify(c));},removeAllData:function(){localStorage.removeItem(a.LOCAL_STORAGE_TEMP_RULES_KEY);localStorage.removeItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY);localStorage.removeItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY);localStorage.removeItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY);localStorage.removeItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY);localStorage.removeItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY);localStorage.removeItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY);},createPersistenceCookie:function(c,C){document.cookie=c+"="+C;},readPersistenceCookie:function(C){var n=C+"=",b=decodeURIComponent(document.cookie),f=b.split(';'),o="";for(var i=0;i<f.length;i++){var c=f[i];while(c.charAt(0)==' '){c=c.substring(1);}if(c.indexOf(n)==0){o=c.substring(n.length,c.length);return o;}}return o;},deletePersistenceCookie:function(c){document.cookie=c+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';}};},true);
