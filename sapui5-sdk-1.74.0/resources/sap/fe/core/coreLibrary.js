/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/services/TemplatedViewServiceFactory","sap/fe/core/services/ResourceModelServiceFactory","sap/fe/core/services/CacheHandlerServiceFactory","sap/fe/core/services/NamedBindingModelServiceFactory","sap/fe/core/services/DraftModelServiceFactory","sap/fe/core/services/NavigationServiceFactory","sap/ui/core/service/ServiceFactoryRegistry"],function(T,R,C,N,D,a,S){"use strict";var c={init:function(){S.register("sap.fe.core.services.TemplatedViewService",new T());S.register("sap.fe.core.services.ResourceModelService",new R());S.register("sap.fe.core.services.CacheHandlerService",new C());S.register("sap.fe.core.services.NamedBindingModelService",new N());S.register("sap.fe.core.services.DraftModelService",new D());S.register("sap.fe.core.services.NavigationService",new a());}};return c;},false);
