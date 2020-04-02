/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([],function(){'use strict';function M(a){var t=this;var k=false;var p=false;this.isKey=function(){return k;};this.isParameterEntitySetKeyProperty=function(){return p;};this.getAttribute=function(n){if(typeof this[n]!=="function"){return this[n];}};this.clone=function(){return new M(a);};function b(n,v){switch(n){case"isKey":if(v===true){k=true;}break;case"isParameterEntitySetKeyProperty":if(v===true){p=true;}break;default:if(typeof t[n]!=="function"){t[n]=v;}}return t;}function i(){for(var n in a){switch(n){case"dataType":for(var d in a.dataType){b(d,a.dataType[d]);}break;default:b(n,a[n]);}}}i();};sap.apf.core.MetadataProperty=M;return{constructor:M};},true);
