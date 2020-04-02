/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){'use strict';var m={apfLogStyle:"color: blue; font-style: italic; background-color: wheat;padding: 1px",apfWarningStyle:"color: DarkMagenta; font-style: bold; background-color: wheat;padding: 1px",apfErrorStyle:"color: white; font-style: bold; background-color: red;padding: 1px",logCounter:0,_logBase:function(s,h,n,a,b,c,d,e,f){if(jQuery.sap.log.apfTrace===undefined){return;}a=a===undefined?"":a||a;b=b===undefined?"":b||b;c=c===undefined?"":c||c;d=d===undefined?"":d||d;e=e===undefined?"":e||e;f=f===undefined?"":f||f;var g="%c%s %s %s ";window.console.log(g,s,h,m.logCounter,n,a,b,c,d,e,f);},log:function(n,a,b,c,d,e,f){m._logBase(m.apfLogStyle,"-APF-",n,a,b,c,d,e,f);},logCall:function(n,a,b,c,d,e,f){++m.logCounter;m._logBase(m.apfLogStyle,">APF>",n,a,b,c,d,e,f);},logReturn:function(n,a,b,c,d,e,f){m._logBase(m.apfLogStyle,"<APF<",n,a,b,c,d,e,f);--m.logCounter;},emphasize:function(n,a,b,c,d,e,f){m._logBase(m.apfWarningStyle,"-APF-",n,a,b,c,d,e,f);}};return m;});
