/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/base/Log','sap/ui/Device'],function(q,L,D){'use strict';var a='sap/ui/export/js/libs/JSZip3',b='sap/ui/export/js/XLSXExportUtils',c='sap/ui/export/js/XLSXBuilder';function d(p,C){function f(m){return C&&C(m);}function o(v){f({progress:v});}function g(e){f({error:e.message||e});}function h(A){f({finish:true,data:A});}function i(){var s;var e;var t;function m(X,x){e=X.oData.getConverter(p);s=new x(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);o(0);t=window.setTimeout(r,0);}function r(){if(s){var x=p.dataSource.data||[];var R=e(x.slice());s.append(R);o(50);t=window.setTimeout(u,0);}}function u(){if(s){s.build().then(v);}}function v(x){h(x);s=null;}function w(){window.clearTimeout(t);v();}sap.ui.require([b,c,a],m);return{cancel:w};}function n(u){if(!u){return u;}try{return new URL(u,document.baseURI).toString();}catch(e){return window.URI(u).absoluteTo(document.baseURI).toString();}}function j(){var s,r;function e(X,v){s=new v(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);r=X.oData.fetch(p,m);o(0);}function m(M){if(M.rows){s.append(M.rows);}if(M.progress){o(M.progress);}if(M.error||typeof M.error==='string'){s=null;return g(M.error);}return M.finished&&s.build().then(t);}function t(v){h(v);s=null;}function u(){r.cancel();h();s=null;}sap.ui.require([b,c,a],e);return{cancel:u};}function k(){var s;var m=q.extend(true,{},p);var w=typeof m.worker==='object'?m.worker:{};var r=function(){s.postMessage({cancel:true});h();};function t(y){var z=new Worker(y);z.onmessage=function(e){if(e.data.status){o(e.data.status);}else if(e.data.error||typeof e.data.error==='string'){g(e.data.error);}else{h(e.data);}};z.postMessage(m);return z;}function u(){L.warning('Direct worker is not allowed. Load the worker via blob.');var e=window.URI(w.base).absoluteTo("").search("").hash("").toString();w.src=e+w.ref;var y='self.origin = "'+e+'"; '+'importScripts("'+w.src+'")';var z=new Blob([y]);var A=window.URL.createObjectURL(z);return t(A);}function v(){L.warning('Blob worker is not allowed. Use in-process export.');r=j(m).cancel;}function x(X){try{s=t(w.src);s.addEventListener('error',function(e){s=u();s.addEventListener('error',function(e){v();e.preventDefault();});e.preventDefault();});}catch(y){try{s=u();}catch(z){v();}}}m.dataSource.dataUrl=n(m.dataSource.dataUrl);m.dataSource.serviceUrl=n(m.dataSource.serviceUrl);w.base=w.base||sap.ui.require.toUrl('sap/ui/export/js/','');w.ref=w.ref||'SpreadsheetWorker.js';w.src=w.base+w.ref;sap.ui.require([b],x);return{cancel:function(){r();}};}var l=sap.ui.getCore().getConfiguration().getFormatSettings().getCustomCurrencies();if(l){p.customconfig=p.customconfig||{};p.customconfig.currencySettings={customCurrencies:l};}if(p.dataSource.type==='array'){return i();}else if(p.worker===false||sap.ui.disableExportWorkers===true||(D.browser.msie&&p.dataSource.dataUrl.indexOf('.')===0)){return j();}else{return k();}}return{execute:d};},true);
