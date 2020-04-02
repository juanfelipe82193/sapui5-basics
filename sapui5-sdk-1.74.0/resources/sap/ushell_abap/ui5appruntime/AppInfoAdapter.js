/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/base/Log","sap/ui/thirdparty/URI","sap/ui/thirdparty/jquery","sap/base/util/UriParameters"],function(L,U,q,a){"use strict";var l=L.getLogger("sap/ushell_abap/ui5appruntime/AppInfoAdapter",L.Level.INFO);function A(){}A.prototype.getAppInfo=function(s){var u=new a(window.location.href);if(s===undefined){s=u.get("sap-ui-app-id");}if(s){return this._loadAppIndexData("/sap/bc/ui2/app_index/ui5_app_info_json",s);}return Promise.reject(new Error("Cannot load app info - no app-id provided and URL parameter 'sap-ui-app-id' not set"));};A.prototype._loadAppIndexData=function(s,b){var u=new U(s).query({"id":b}).toString();return new Promise(function(r,c){q.ajax({type:"GET",dataType:"json",url:u}).done(function(R){var o=R[b];if(o){r(R[b]);}else{c(new Error("UI5 app index data loaded from "+u+" does not contain app "+b));}}).fail(function(e){l.error(e.responseText);c(new Error("Failed to load UI5 app index data loaded from "+u+": "+e.responseText));});});};return new A();},false);
