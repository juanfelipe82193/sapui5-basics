/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/checkForTimeout","sap/ui/model/odata/ODataUtils"],function(c,O){'use strict';var F=function(i){var f={};var a=i&&i.functions&&i.functions.ajax;var s=i&&i.functions&&i.functions.getSapSystem&&i.functions.getSapSystem();this.check=function(u,b){if(s&&!b){u=O.setOrigin(u,{force:true,alias:s});}if(f[u]!==undefined){return f[u];}var d=false;var e={url:u,type:"HEAD",success:function(D,S,j){var m=c(j);if(m===undefined){d=true;}else{d=false;}},error:function(){d=false;},async:false};if(a){a(e);}else{jQuery.ajax(e);}f[u]=d;return d;};};sap.apf.core.utils.FileExists=F;return F;},true);
