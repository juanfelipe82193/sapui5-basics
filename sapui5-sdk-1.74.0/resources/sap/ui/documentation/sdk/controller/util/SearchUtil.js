/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device"],function(D){"use strict";var W={URL:sap.ui.require.toUrl("sap/ui/documentation/sdk/controller/util/IndexWorker.js"),COMMANDS:{INIT:"fetch",SEARCH:"search"},RESPONSE_FIELDS:{DONE:"bDone",SEARCH_RESULT:"oSearchResult"}},i,w;function a(){if(!i){i=new Promise(function(r,b){w=new window.Worker(W.URL);w.addEventListener('message',function(e){var d=e.data;r(d&&d[W.RESPONSE_FIELDS.DONE]===true);},false);w.postMessage({"cmd":W.COMMANDS.INIT,"bIsMsieBrowser":!!D.browser.msie});});}return i;}function s(q){return new Promise(function(r,b){a().then(function(){w.addEventListener('message',function(e){var d=e.data;r(d&&d[W.RESPONSE_FIELDS.SEARCH_RESULT]);},false);w.postMessage({"cmd":W.COMMANDS.SEARCH,"sQuery":q});});});}return{init:a,search:s};});
