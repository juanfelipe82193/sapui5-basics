// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_AppState/LimitedBuffer","sap/base/Log","sap/ui/thirdparty/jquery"],function(L,a,q){"use strict";var W=50;var C=18;function b(){this._init.apply(this,arguments);}b.prototype._init=function(s,B,c){var i=c&&c.config&&c.config.initialAppStates||{};var I=c&&c.config&&c.config.initialAppStatesPromise;this._oServiceInstance=s;this._oBackendAdapter=B;if(!b.prototype.data){b.prototype.data=new L(W);}if(I){I.then(function(i){if(typeof i==="object"){Object.keys(i).forEach(function(k){b.prototype.data.addAsHead(k,i[k]);});}});}Object.keys(i).forEach(function(k){b.prototype.data.addAsHead(k,i[k]);});};b.prototype.saveAppState=function(k,s,d,A,c,t,p,P){this.sComponent=c;var D=new q.Deferred();b.prototype.data.addAsHead(k,d,p,P);if(this._oBackendAdapter&&!t){return this._oBackendAdapter.saveAppState(k,s,d,A,c,p,P);}D.resolve();return D.promise();};b.prototype.loadAppState=function(k){var d=new q.Deferred(),c=b.prototype.data.getByKey(k);if(c){setTimeout(function(){d.resolve(k,c.value,c.persistencyMethod,c.persistencySettings);},0);return d.promise();}try{if(window.opener&&window.opener.sap&&window.opener.sap.ushell){var A=window.opener.sap.ui.require("sap/ushell/services/AppState").WindowAdapter.prototype.data.getByKey(k);if(A){d.resolve(k,A.value);return d.promise();}}}catch(e){if(e.code===C){a.warning("AppState.js - loadAppState: Opener is not of the same origin and cannot be used for AppState resolving.");}else{a.warning("AppState.js - loadAppState: Opener is a FLP but AppState could not get resolved from there.");}}if(this._oBackendAdapter){this._oBackendAdapter.loadAppState(k).done(function(k,D,p,f){b.prototype.data.addAsHead(k,D);d.resolve(k,D,p,f);}).fail(d.reject.bind(d));return d.promise();}d.reject("AppState.js - loadAppState: Application State could not be loaded");return d.promise();};b.prototype.deleteAppState=function(k){var d=new q.Deferred();b.prototype.data.deleteByKey(k);if(this._oBackendAdapter&&this._oBackendAdapter.deleteAppState){return this._oBackendAdapter.deleteAppState(k);}d.resolve();return d.promise();};b.prototype.getSupportedPersistencyMethods=function(){if(this._oBackendAdapter&&this._oBackendAdapter.getSupportedPersistencyMethods){return this._oBackendAdapter.getSupportedPersistencyMethods();}return[];};return b;});
