/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/write/_internal/Storage"],function(C,S){"use strict";var _={};function a(v){return v.some(function(o){return o.versionNumber===0;});}function b(v,o){if(a(v)){v.pop();}v.push(o);return v;}var V={};V.getVersions=function(p){var r=p.reference;var l=p.layer;if(_[r]&&_[r][l]){return Promise.resolve(_[r][l]);}return S.versions.load(p).then(function(v){_[r]=_[r]||{};_[r][l]=v;return _[r][l];});};V.clearInstances=function(){_={};};V.activateDraft=function(p){var v;return V.getVersions(p).then(function(c){var d=a(c);v=c;var o=C.getChangePersistenceForComponent(p.reference);var D=o.getDirtyChanges().length>0;if(D){return o.saveDirtyChanges(false,undefined,true);}if(!d&&!D){return Promise.reject("No draft exists");}}).then(function(){return S.versions.activateDraft(p);}).then(function(o){return b(v,o);});};return V;});
