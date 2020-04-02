/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){'use strict';var t={};t.addPrefixText=function(p,T){var P=[];if(p){P=p.map(function(s){return T(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)+": "+s;});}return P;};t.removePrefixText=function(p,a){var b=p.replace(a,"");return b.replace(": ","");};return t;},true);
