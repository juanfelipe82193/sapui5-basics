/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/write/_internal/connectors/BackendConnector","sap/ui/fl/apply/_internal/connectors/KeyUserConnector","sap/ui/fl/apply/_internal/connectors/Utils","sap/ui/fl/Layer"],function(m,B,A,a,L){"use strict";var P="/flex/keyuser";var b="/v1";var K=m({},B,{layers:[L.CUSTOMER],ROUTES:{CHANGES:P+b+"/changes/",SETTINGS:P+b+"/settings",TOKEN:P+b+"/settings",VERSIONS:{GET:P+b+"/versions/",ACTIVATE:P+b+"/versions/draft/activate/"}}});K.versions={load:function(p){var v=a.getUrl(K.ROUTES.VERSIONS.GET,p);return a.sendRequest(v).then(function(r){return r.response;});},activateDraft:function(p){var v=a.getUrl(K.ROUTES.VERSIONS.ACTIVATE,p);return a.sendRequest(v,"POST").then(function(r){return r.response;});}};K.applyConnector=A;return K;},true);
