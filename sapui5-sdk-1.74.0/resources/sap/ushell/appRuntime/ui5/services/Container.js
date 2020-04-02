// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/Container","sap/ushell/appRuntime/ui5/AppRuntimeService","sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer"],function(c,A,R){"use strict";function C(){var o;this.bootstrap=function(p,a){return sap.ushell.bootstrap(p,a).then(function(b){o=sap.ushell.Container.setDirtyFlag;sap.ushell.Container.runningInIframe=function(){try{return window.self!==window.top;}catch(e){return true;}};sap.ushell.Container.setDirtyFlag=function(i){o(i);A.sendMessageToOuterShell("sap.ushell.services.ShellUIService.setDirtyFlag",{"bIsDirty":i});};sap.ushell.Container.getFLPUrl=function(i){return A.sendMessageToOuterShell("sap.ushell.services.Container.getFLPUrl",{"bIncludeHash":i});};sap.ushell.Container.getRenderer=function(){return R;};});};}return new C();},true);
