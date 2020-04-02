/**
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/Object',"sap/collaboration/components/utils/LanguageBundle","sap/ui/core/format/DateFormat"],function(B,L,D){"use strict";var a=B.extend("sap.collaboration.components.util.DateUtil",{constructor:function(){this._oLanguageBundle=new L();},formatDateToString:function(d){var o=D.getDateInstance({style:"short",relative:true},sap.ui.getCore().getConfiguration().getLocale());var t=D.getTimeInstance({style:"short"},sap.ui.getCore().getConfiguration().getLocale());var s=o.format(d)+" "+this._oLanguageBundle.getText("ST_GROUP_SELECT_AT")+" "+t.format(d);var p=/[A-Za-z]/;if(s.charAt(0).match(p)){s=s.charAt(0).toUpperCase()+s.slice(1);}return s;},});return a;});
