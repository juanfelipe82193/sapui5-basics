// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ushell/bootstrap/common/common.load.model","sap/ushell/components/HomepageManager","sap/ushell/components/SharedComponentUtils","sap/ushell/Config","sap/ushell/resources"],function(U,m,H,s,C,r){"use strict";return U.extend("sap.ushell.components.homepage.Component",{metadata:{manifest:"json"},init:function(){this.oModel=m.getModel();this.setModel(this.oModel);U.prototype.init.apply(this,arguments);var d={model:this.oModel,view:this.oDashboardView};this.oHomepageManager=new H("dashboardMgr",d);this.setModel(r.i18nModel,"i18n");sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.UsageAnalytics","usageAnalyticsStarted",function(){sap.ui.require(["sap/ushell/components/homepage/FLPAnalytics"]);});s.toggleUserActivityLog();s.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay","/core/home/enableHomePageSettings");C.on("/core/home/homePageGroupDisplay").do(function(n){this.oHomepageManager.handleDisplayModeChange(n);}.bind(this));s.getEffectiveHomepageSetting("/core/home/sizeBehavior","/core/home/sizeBehaviorConfigurable");C.on("/core/home/sizeBehavior").do(function(S){var M=this.oHomepageManager.getModel();M.setProperty("/sizeBehavior",S);}.bind(this));},createContent:function(){this.oDashboardView=sap.ui.view({viewName:"sap.ushell.components.homepage.DashboardContent",type:"JS",async:true});return this.oDashboardView;},exit:function(){this.oHomepageManager.destroy();}});});
