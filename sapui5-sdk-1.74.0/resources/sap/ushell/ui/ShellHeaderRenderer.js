// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ui/Device"],function(r,D){"use strict";var S={apiVersion:2};S.render=function(a,s){var i=s.getId();var c=s.getCentralControl();a.openStart("div",s);if(!s.getVisible()){a.style("display","none");}a.class("sapUshellShellHeader");a.class("sapUshellShellCntnt");a.attr("aria-label",r.i18n.getText("Shell_Header_AriaLabel"));a.openEnd();a.openStart("div");a.attr("id","sapUshellHeaderAccessibilityHelper");a.attr("tabindex","0");a.openEnd();a.close("div");a.openStart("div");a.attr("id",i+"-hdr-begin");a.class("sapUshellShellHeadBegin");if(c){a.class("sapUshellHeadWithCenter");}a.openEnd();this.renderHeaderItems(a,s);this.renderLogo(a,s);this.renderTitle(a,s);a.close("div");if(c){a.openStart("div",c);a.attr("id",i+"-hdr-center");a.class("sapUshellShellHeadCenter");a.openEnd();a.close("div");}a.openStart("div");a.attr("id",i+"-hdr-search-container");a.class("sapUshellShellHeadSearchContainer");a.openEnd();this.renderSearch(a,s);a.close("div");a.openStart("div");a.attr("id",i+"-hdr-end");a.class("sapUshellShellHeadEnd");a.openEnd();this.renderHeaderEndItems(a,s);a.close("div");a.close("div");};S.renderSearch=function(a,s){var o=s.getSearch();a.openStart("div");a.attr("id",s.getId()+"-hdr-search");a.class("sapUshellShellSearch");a.style("max-width",s.getSearchWidth()+"rem");if(s.getSearchState()==="COL"){a.style("display","none");}a.openEnd();if(o){a.renderControl(o);}a.close("div");};S.renderTitle=function(a,s){var t=s.getTitle();a.renderControl(s.getAppTitle());if(t){a.openStart("div");a.attr("id",s.getId()+"-hdr-shell-title");a.class(s.getAppTitle()?"sapUshellShellHeadSubtitle":"sapUshellShellHeadTitle");a.openEnd();a.openStart("span");a.class("sapUshellHeadTitle");a.openEnd();a.text(t);a.close("span");a.close("div");}};S.renderHeaderItems=function(a,h){var I=h.getHeadItems();for(var i=0;i<I.length;i++){if(I[i].getId()==="homeBtn"&&h.getShowLogo()){continue;}a.renderControl(I[i]);}};S.renderHeaderEndItems=function(a,h){h.getHeadEndItems().forEach(a.renderControl);};S.renderLogo=function(a,h){if(!h.getShowLogo()){return;}var A=r.i18n.getText("homeBtn_tooltip"),t=r.i18n.getText("homeBtn_tooltip_text"),i=h.getLogo();a.openStart("a");a.attr("id",h.getId()+"-logo");a.class("sapUshellShellIco");a.attr("href",h.getHomeUri());if(h.isHomepage()){a.class("sapUshellLogoLinkDisabled");a.attr("aria-disabled","true");}else{a.attr("tabindex","0");a.attr("title",t);}a.attr("aria-label",A);a.openEnd();a.voidStart("img");a.attr("id",h.getId()+"-icon");a.attr("alt",r.i18n.getText("SHELL_LOGO_TOOLTIP"));a.attr("src",i);a.voidEnd();a.close("a");};return S;},true);
