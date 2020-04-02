// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/performance/trace/FESR","sap/ushell/EventHub","sap/base/Log","sap/ushell/performance/ShellAnalytics"],function(F,E,U,S){"use strict";var a={HOME_INITIAL:"FLP@LOAD",FINDER_INITIAL:"FLP@LOAD_FINDER",APP_INITIAL:"FLP@DEEP_LINK",NAVIGATION:"NAVIGATION"};var f={_fnOriginalOnBeforeCreated:null,_lastTrackedRecord:null,init:function(){if(F.getActive()){S.enable();this._fnOriginalOnBeforeCreated=F.onBeforeCreated;F.onBeforeCreated=this._onBeforeCreatedHandler.bind(this);}},reset:function(){F.onBeforeCreated=this._fnOriginalOnBeforeCreated;S.disable();this._setLastTrackedRecord(null);},_getPerformanceEntries:function(e){return performance.getEntriesByName(e);},_getLastTrackedApplicationId:function(){var c=S.getCurrentApplication();if(c){return c.id;}return null;},_getLastTrackedRecord:function(){return this._lastTrackedRecord;},_setLastTrackedRecord:function(n){this._lastTrackedRecord=n;},_onBeforeCreatedHandler:function(u,o){var d=this._detectScenario(u,o),A=this._getLastTrackedApplicationId();if(A){u.appNameShort=A;}if(!d.scenario){return u;}return this._enhanceRecord(d.scenario,{stepName:u.stepName,appNameLong:u.appNameLong,appNameShort:u.appNameShort,timeToInteractive:u.timeToInteractive},d.relatedEvent);},_detectScenario:function(u,o){function c(s,e){var r={scenario:s};if(e){r.relatedEvent=e;}return r;}if(u.stepName==="undetermined_startup"){this._setLastTrackedRecord(S.getLastClosedRecord());switch(u.appNameLong){case"sap.ushell.components.homepage":return c(a.HOME_INITIAL);case"sap.ushell.components.appfinder":return c(a.FINDER_INITIAL);default:break;}return c(a.APP_INITIAL);}var l=this._getLastTrackedRecord(),n=S.getNextNavigationRecords(l);if(n.length===1){var N=n[0];if((N&&l&&!N.isEqual(l))||(!l&&N)){this._setLastTrackedRecord(N);return c(a.NAVIGATION,N);}}else if(n.length>1){this._setLastTrackedRecord(n.pop());return c(a.NAVIGATION,n[0]);}return c(null);},_enhanceRecord:function(d,i,r){switch(d){case a.HOME_INITIAL:return this._enhanceInitialStart(i,d,"FLP-TTI-Homepage");case a.FINDER_INITIAL:return this._enhanceInitialStart(i,d,"FLP-TTI-AppFinder");case a.APP_INITIAL:return this._enhanceInitialAppStart(i,d,null);case a.NAVIGATION:return this._enhanceNavigationRecord(i,r);default:break;}U.warning("Unknown scenario at the end of execution, unnecessary code executed",null,"sap.ushell.performance.FesrEnhancer");return i;},_enhanceInitialStart:function(i,s,p){var m,e={stepName:s,appNameLong:i.appNameLong,appNameShort:"",timeToInteractive:i.timeToInteractive};if(p){m=this._getPerformanceEntries(p)[0];if(m){e.timeToInteractive=m.startTime;return e;}U.warning("Scenario '"+s+"' detected but expected performance mark '"+p+"' does not exist",null,"sap.ushell.performance.FesrEnhancer");}return e;},_enhanceNavigationRecord:function(i,r){var e={stepName:r.step||i.stepName,appNameLong:i.appNameLong,appNameShort:r.targetApplication||"",timeToInteractive:i.timeToInteractive};if(e.stepName==="FLP@LOAD"){var m=this._getPerformanceEntries("FLP-TTI-Homepage")[0];if(m){if(m.startTime>r.getTimeStart()){e.timeToInteractive=m.startTime-r.getTimeStart();}}}return e;},_enhanceInitialAppStart:function(i,s,p){var e=this._enhanceInitialStart(i,s,p);e.appNameShort=i.appNameShort;return e;}};return f;},true);
