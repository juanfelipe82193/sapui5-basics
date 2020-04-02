// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/EventHub","sap/ushell/services/AppConfiguration","sap/ushell/performance/StatisticalRecord"],function(E,A,S){"use strict";var s=[],d=[],o,c,l,i=false;var T={"dashboardTileClick":"HOMEPAGE_TILE","dashboardTileLinkClick":"HOMEPAGE_LINK","catalogTileClick":"FINDER_TILE"};var N={EXPLACE:"EXPLACE",INPLACE:"INPLACE"};var t=["dashboardTileClick","dashboardTileLinkClick","catalogTileClick"];function _(){return sap.ui.getCore().getEventBus();}function g(){return s;}function a(){var C=g().filter(function(R){return R.isClosed();});if(C.length>0){return C[C.length-1];}return null;}function b(L){if(!L){return g();}return g().filter(function(R){return L.getTimeStart()<R.getTimeStart()&&R.isClosed();});}function e(){return c;}function f(z){c=z;}function h(){l=performance.now();}function j(){if(!o){o=new S();s.push(o);}return o;}function k(C,z){j().setTrigger(T[z]);}function m(z){j().setTargetHash(z);j().setTimeStart(l||performance.now());}function n(){return new Promise(function(z,B){sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(C){var D=C.getCurrentApplication();if(!D){z({});return;}if(D.homePage){z({type:"UI5",id:"FLP_HOME"});return;}if(D.applicationType==="UI5"){D.getTechnicalParameter("sap-fiori-id").then(function(G){var H=G[0];if(!H&&D.componentInstance){var I=D.componentInstance.getManifest();if(I&&I["sap.app"]&&I["sap.app"].id){H=I["sap.app"].id;}}z({type:"UI5",id:H});});}else{var F=A.getMetadata().technicalName||A.getCurrentApplication().text||D.applicationType;z({type:D.applicationType,id:F});}});});}function p(z,B,C){if(o){o.setSourceApplication(z);o.setTargetApplication(B);o.setNavigationMode(C);o.closeRecord();o=null;}}function q(){n().then(function(z){var C=e();f(z);p(C?C.id:undefined,z.id,N.INPLACE);});}function r(){var C=e();p(C?C.id:undefined,null,N.EXPLACE);}function u(){if(o){var C=e();o.setSourceApplication(C?C.id:undefined);o.closeRecordWithError();o=null;}}function v(){sap.ushell.Container.getServiceAsync("ShellNavigation").then(function(z){z.hashChanger.attachEvent("hashChanged",h);z.hashChanger.attachEvent("shellHashChanged",h);});}function w(){sap.ushell.Container.getServiceAsync("ShellNavigation").then(function(z){z.hashChanger.detachEvent("hashChanged",h);z.hashChanger.detachEvent("shellHashChanged",h);});}function x(){if(i){return;}i=true;t.forEach(function(z){_().subscribe("launchpad",z,k);});var D;D=E.once("ShellNavigationInitialized").do(v);d.push(D);D=E.on("trackHashChange").do(m);d.push(D);D=E.on("AppRendered").do(q);d.push(D);D=E.on("openedAppInNewWindow").do(r);d.push(D);D=E.on("firstSegmentCompleteLoaded").do(q);d.push(D);D=E.on("doHashChangeError").do(u);d.push(D);}function y(){if(!i){return;}t.forEach(function(z){_().unsubscribe("launchpad",z,k);});d.forEach(function(D){D.off();});w();f(null);s=[];o=null;i=false;}return{enable:x,disable:y,getAllRecords:g,getCurrentApplication:e,getLastClosedRecord:a,getNextNavigationRecords:b};},false);
