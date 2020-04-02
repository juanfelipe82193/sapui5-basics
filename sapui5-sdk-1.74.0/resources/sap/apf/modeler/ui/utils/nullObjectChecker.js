/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){'use strict';var n={};n.checkIsNotUndefined=function(o){if(o===undefined){return false;}return true;};n.checkIsNotNull=function(o){if(o===null){return false;}return true;};n.checkIsNotBlank=function(o){if((o instanceof Array)&&o.length===0){return false;}if((o instanceof Object)&&(Object.keys(o).length===0)){return false;}if(o===""){return false;}return true;};n.checkIsNotNullOrBlank=function(o){return(this.checkIsNotNull(o)&&this.checkIsNotBlank(o));};n.checkIsNotNullOrUndefined=function(o){return(this.checkIsNotNull(o)&&this.checkIsNotUndefined(o));};n.checkIsNotUndefinedOrBlank=function(o){return(this.checkIsNotUndefined(o)&&this.checkIsNotBlank(o));};n.checkIsNotNullOrUndefinedOrBlank=function(o){return(this.checkIsNotNull(o)&&this.checkIsNotUndefined(o)&&this.checkIsNotBlank(o));};return n;},true);
