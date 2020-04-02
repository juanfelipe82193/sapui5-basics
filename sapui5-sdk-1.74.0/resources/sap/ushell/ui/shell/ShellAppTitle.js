// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Bar","sap/m/Button","sap/m/Label","sap/m/PlacementType","sap/m/Popover","sap/m/ResponsivePopover","sap/m/ToggleButton","sap/ui/core/IconPool","sap/ui/Device","sap/ushell/Config","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/resources","sap/ui/performance/Measurement","sap/ushell/ui/shell/ShellNavigationMenu","sap/ushell/services/AllMyApps"],function(B,a,L,P,b,R,T,I,D,C,A,r,M){"use strict";var s={SHELL_NAV_MENU_ONLY:0,ALL_MY_APPS_ONLY:1,SHELL_NAV_MENU:2,ALL_MY_APPS:3};var S=a.extend("sap.ushell.ui.shell.ShellAppTitle",{metadata:{associations:{navigationMenu:{type:"sap.ushell.ui.shell.ShellNavigationMenu"},allMyApps:{type:"sap.ui.core.mvc.ViewType.JS"}},events:{textChanged:{deprecated:true}}},renderer:{apiVersion:2,render:function(c,d){c.openStart("div",d);c.class("sapUshellAppTitle");if(d.getTooltip_AsString()){c.attr("title",d.getTooltip_AsString());}var v=d._getControlVisibilityAndState(),t=d.getText(),m=d.getModel();if(v||D.system.phone){c.class("sapUshellAppTitleClickable");c.attr("tabindex","0");}c.openEnd();c.openStart("h1");c.class("sapUshellHeadTitle");if(v){c.attr("role","button");c.attr("aria-haspopup","dialog");c.attr("aria-expanded","false");if(m&&m.getProperty("/ShellAppTitleState")===s.ALL_MY_APPS_ONLY){c.attr("aria-label",r.i18n.getText("ShowAllMyApps_AriaLabel",[t]));}else{c.attr("aria-label",r.i18n.getText("ShellNavigationMenu_AriaLabel",[t]));}}c.openEnd();if(t){c.text(t);}c.close("h1");if(v){c.openStart("div");c.class("sapUshellShellHeadAction");c.openEnd();c.openStart("span");c.class("sapUshellShellHeadActionImg");c.openEnd();c.renderControl(d.oIcon);c.close("span");c.close("div");}c.close("div");}}});S.prototype.init=function(){if(a.prototype.init){a.prototype.init.apply(this,arguments);}this.oIcon=I.createControlByURI(I.getIconURI("megamenu"));this.oIcon.addStyleClass("sapUshellAppTitleMenuIcon");if(D.system.desktop){this.addEventDelegate({onkeydown:function(e){if(e.altKey&&e.keyCode===40){this.onclick(e);}}.bind(this)});}};S.prototype.onclick=function(e){if(e){e.preventDefault();}this.firePress();if(!this._getControlVisibilityAndState()){if(D.system.phone){window.hasher.setHash(C.last("/core/shellHeader/rootIntent"));}return;}if(this.getModel().getProperty("/ShellAppTitleState")===s.ALL_MY_APPS_ONLY){M.start("FLP:ShellAppTitle.onClick","Click ShellAppTitle in HOME state, Launching AllMyApps","FLP");this._openCloseAllMyAppsPopover();return;}this._openCloseNavMenuPopover();};S.prototype._openCloseAllMyAppsPopover=function(){if(!this.oAllMyAppsPopover){this.oAllMyAppsPopover=this._createAllMyAppsPopover();}if(this.oAllMyAppsPopover){if(this.oAllMyAppsPopover.isOpen()){this.oAllMyAppsPopover.close();}else{this.oAllMyAppsPopover.openBy(this);}}};S.prototype._openCloseNavMenuPopover=function(){if(!this.oNavMenuPopover){this.oNavMenuPopover=this._createNavMenuPopover();}this.getModel().setProperty("/ShellAppTitleState",s.SHELL_NAV_MENU);if(this.oNavMenuPopover.isOpen()){this.oNavMenuPopover.close();}else{this.oNavMenuPopover.openBy(this);}if(this.oNavMenuPopover.getFooter()){var c=C.last("/core/shell/model/currentState/stateName");this.oNavMenuPopover.getFooter().setVisible(c==="home"||c==="app");}};S.prototype.onsapskipback=function(e){e.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell=false;};S.prototype._getControlVisibilityAndState=function(){M.start("FLP:ShellAppTitle.getControlVisibilityAndState","Check AllMyApps and NavShellMenu visibility","FLP");var m=this.getModel(),c=C.last("/core/shell/model/currentState/stateName"),n=this._isNavMenuEnabled(),v=n;if(!m){return false;}if(c==="app"||c==="home"){var d=sap.ushell.Container.getService("AllMyApps").isEnabled();v=d||n;if(d&&n){m.setProperty("/ShellAppTitleState",s.SHELL_NAV_MENU);}else if(!d&&n){m.setProperty("/ShellAppTitleState",s.SHELL_NAV_MENU_ONLY);}else if(d&&!n){m.setProperty("/ShellAppTitleState",s.ALL_MY_APPS_ONLY);}}else{m.setProperty("/ShellAppTitleState",s.SHELL_NAV_MENU_ONLY);}M.end("FLP:ShellAppTitle.getControlVisibilityAndState");return v;};S.prototype._createAllMyAppsPopover=function(){var o=sap.ui.getCore().byId(this.getAllMyApps());if(!o){return null;}var c=new R("sapUshellAllMyAppsPopover",{placement:P.Bottom,title:"",showArrow:true,customHeader:this._getPopoverHeader(),showHeader:{path:"/ShellAppTitleState",formatter:function(d){return d!==s.SHELL_NAV_MENU;}},content:[o]});c.setModel(this.getModel());c.addStyleClass("sapUshellAppTitleAllMyAppsPopover");c.attachAfterOpen(function(){o._afterOpen();var h=c.getCustomHeader(),d=h.getContentLeft()[0],t=h.getContentLeft()[1];if(t.getVisible()){t.firePress();t.setPressed(true);}d.focus();});c.attachAfterClose(function(){this._bPressedSpace=false;}.bind(this));return c;};S.prototype._createNavMenuPopover=function(){var n=sap.ui.getCore().byId(this.getNavigationMenu());var N=new b("sapUshellAppTitlePopover",{placement:P.Bottom,title:"",showArrow:true,showHeader:{path:"/ShellAppTitleState",formatter:function(c){return c!==s.SHELL_NAV_MENU;}},contentWidth:"20rem",content:n});if(sap.ushell.Container.getService("AllMyApps").isEnabled()){N.setFooter(this._getPopoverFooterContent());}N.addStyleClass("sapUshellAppTitleNavigationMenuPopover");N.setModel(this.getModel());C.emit("/core/shell/model/allMyAppsMasterLevel",0);N.attachBeforeOpen(function(){n._beforeOpen();});N.attachAfterOpen(function(){n.$().on("touchmove.scrollFix",function(e){e.stopPropagation();});n._afterOpen();});N.attachAfterClose(function(){this._bPressedSpace=false;}.bind(this));return N;};S.prototype._getPopoverHeader=function(){var o=new L({text:r.i18n.getText("allMyApps_headerTitle")});this.addCustomData(o,"role","heading");this.addCustomData(o,"aria-level","2");var p=new B("sapUshellShellAppPopoverHeader",{contentLeft:[this._createPopoverBackButton(),this._createPopoverToggleButton()],contentMiddle:[o]});return p;};S.prototype.onAfterRendering=function(){var o=sap.ui.getCore().byId("shell-header");if(o){o.refreshLayout();}};S.prototype._createPopoverBackButton=function(){var o=new a("sapUshellAppTitleBackButton",{icon:I.getIconURI("nav-back"),press:[this._popoverBackButtonPressHandler,this],tooltip:r.i18n.getText("backBtn_tooltip"),visible:this.getAllMyAppsController().getBackButtonVisible()});o.addStyleClass("sapUshellCatalogNewGroupBackButton");return o;};S.prototype._popoverBackButtonPressHandler=function(){var o=this.getAllMyAppsController(),c=o.getCurrentState(),d=o.getStateEnum(),m=this.getModel();if((c===d.FIRST_LEVEL)||(c===d.FIRST_LEVEL_SPREAD)){if(m.getProperty("/ShellAppTitleState")!==s.ALL_MY_APPS_ONLY){m.setProperty("/ShellAppTitleState",s.SHELL_NAV_MENU);this.oAllMyAppsPopover.close();this.oNavMenuPopover.openBy(this);}}else if(c===d.SECOND_LEVEL){o.switchToInitialState();}else{o.handleSwitchToMasterAreaOnPhone();}o.updateHeaderButtonsState();};S.prototype._createPopoverToggleButton=function(){var o=this.getAllMyAppsController();var t=new T("sapUshellAllMyAppsToggleListButton",{icon:I.getIconURI("sap-icon://menu2"),press:function(e){o.switchToInitialState();this.setTooltip(e.getParameter("pressed")?r.i18n.getText("ToggleButtonHide"):r.i18n.getText("ToggleButtonShow"));},tooltip:r.i18n.getText("ToggleButtonShow"),visible:o.getToggleListButtonVisible()});D.media.attachHandler(function(){t.setVisible(o.getToggleListButtonVisible());},this,D.media.RANGESETS.SAP_STANDARD);t.addStyleClass("sapUshellAllMyAppsToggleListButton");return t;};S.prototype._getPopoverFooterContent=function(){var t=this,o;o=new a("allMyAppsButton",{text:r.i18n.getText("allMyApps_launchingButtonTitle"),press:function(){t._openCloseAllMyAppsPopover();if(t.oAllMyAppsPopover){M.start("FLP:ShellNavMenu.footerClick","Click the footer of ShellNavMenu, Launching AllMyApps","FLP");t.getModel().setProperty("/ShellAppTitleState",s.ALL_MY_APPS);t.oNavMenuPopover.close();}},visible:{path:"/ShellAppTitleState",formatter:function(c){return c===s.SHELL_NAV_MENU;}}});var p=new B("shellpopoverFooter",{contentMiddle:[o]});this.addCustomData(o,"role","button");this.addCustomData(o,"aria-label",r.i18n.getText("allMyApps_launchingButtonTitle"));return p;};S.prototype._isNavMenuEnabled=function(){var n=sap.ui.getCore().byId(this.getNavigationMenu());return n?n.getItems()&&n.getItems().length>0:false;};S.prototype.addCustomData=function(i,k,v){i.addCustomData(new A({key:k,value:v,writeToDom:true}));};S.prototype.close=function(){if(this.oNavMenuPopover&&this.oNavMenuPopover.isOpen()){this.oNavMenuPopover.close();}if(this.oAllMyAppsPopover&&this.oAllMyAppsPopover.isOpen()){this.oAllMyAppsPopover.close();}};S.prototype.setTooltip=function(t){this.setAggregation("tooltip",t);this.oIcon.setTooltip(t);};S.prototype.getAllMyAppsController=function(){var o=sap.ui.getCore().byId(this.getAllMyApps());return o.getController();};S.prototype.getStateEnum=function(){return s;};S.prototype.onsapspace=S.prototype.onclick;S.prototype.onsapenter=S.prototype.onclick;S.prototype.exit=function(){var n=sap.ui.getCore().byId(this.getNavigationMenu()),o=sap.ui.getCore().byId(this.getAllMyApps());if(n){n.destroy();}if(o){o.destroy();}if(this.oAllMyAppsPopover){this.oAllMyAppsPopover.destroy();}if(this.oNavMenuPopover){this.oNavMenuPopover.destroy();}if(this.oIcon){this.oIcon.destroy();}};return S;},true);
