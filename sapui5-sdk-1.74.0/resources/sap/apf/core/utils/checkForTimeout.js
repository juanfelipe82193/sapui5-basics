/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/messageObject"],function(M){'use strict';var c=function(s){var a;var m;var r=false;if(s&&s.headers&&s.headers['x-sap-login-page']){r=true;}if(s&&s.getResponseHeader&&s.getResponseHeader('x-sap-login-page')!==null){r=true;}if(s&&s.status){a=s.status;}if(s&&s.response&&s.response.statusCode){a=s.response.statusCode;}if(a===303||a===401||a===403||r){m=new M({code:"5021"});}return m;};return c;},true);
