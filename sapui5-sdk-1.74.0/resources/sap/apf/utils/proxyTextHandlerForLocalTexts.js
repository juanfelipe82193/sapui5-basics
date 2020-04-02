/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/utils/parseTextPropertyFile','sap/apf/utils/hashtable','sap/apf/utils/utils'],function(p,H,u){'use strict';var P=function(i){var m=i.instances.messageHandler;var t={};this.initApplicationTexts=function(a,b){var c=t[a]||new H(m);if(b===""||b===null){t[a]=c;return;}var d=p(b,{instances:{messageHandler:m}});d.TextElements.forEach(function(e){if(e.TextElement){c.setItem(e.TextElement,e);}});t[a]=c;};this.createTextFileOfApplication=function(a){if(!t[a]){return"";}var b=u.renderHeaderOfTextPropertyFile(a,m);return b+u.renderTextEntries(t[a],m);};this.getTextElements=function(a){if(!t[a]){return[];}var b=[];t[a].each(function(k,c){b.push(c);});return b;};this.addText=function(a){if(!a.TextElement){a.TextElement=u.createPseudoGuid(32);}var b=t[a.Application]||new H(m);b.setItem(a.TextElement,a);t[a.Application]=b;return a.TextElement;};this.removeText=function(d){var a=d.application;var T=d.inputParameters[0].value;var b=t[a]||new H(m);if(b.hasItem(T)){b.removeItem(T);}};};sap.apf.utils.ProxyTextHandlerForLocalTexts=P;return P;},true);
