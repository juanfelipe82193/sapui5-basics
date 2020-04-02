// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/utils","sap/ushell/bootstrap/common/common.load.model","sap/ushell/Config","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ui/core/CustomData"],function(r,u,m,C,A,a){"use strict";var T={};T.oModel=m.getModel();T.render=function(R,c){var h=c.getHeaderActions(),b=c.getBeforeContent(),d=c.getAfterContent(),f=c.getFooterContent()||[],e,l=c.getLinks(),t=this;R.write("<div");R.writeControlData(c);R.addClass("sapUshellTileContainer");R.writeClasses();R.write(">");if(b.length&&c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellTileContainerBeforeContent");R.addClass("sapContrastPlus");R.writeClasses();R.write(">");b.forEach(function(c){R.renderControl(c);});R.write("</div>");}R.write("<div");R.addClass("sapUshellTileContainerContent");if(c.getIsGroupLocked()){R.addClass("sapUshellTileContainerLocked");}if(c.getDefaultGroup()){R.addClass("sapUshellTileContainerDefault");}if(c.getShowBackground()){R.addClass("sapUshellTileContainerEditMode");}R.writeClasses();R.writeAttribute("tabindex","-1");R.write(">");if(c.getShowBackground()){R.write("<div");R.addClass("sapUshellGroupBackgroundContainer sapContrastPlus");R.writeClasses();R.write(">");R.write("</div>");}if(c.getShowHeader()){R.write("<div");R.addClass("sapUshellTileContainerHeader sapContrastPlus");if(!c.getShowGroupHeader()){R.addClass("sapUshellFirstGroupHeaderHidden sapUiPseudoInvisibleText");}R.writeAttribute("id",c.getId()+"-groupheader");R.writeClasses();if(c.getIeHtml5DnD()&&!c.getIsGroupLocked()&&!c.getDefaultGroup()&&c.getTileActionModeActive()){R.writeAttribute("draggable","true");}var s;if(c.getDefaultGroup()){s=r.i18n.getText("ariaLabelEditModeGroupDefault",c.getHeaderText());}else if(c.getIsGroupLocked()){s=r.i18n.getText("ariaLabelEditModeGroupLocked",c.getHeaderText());}else{s=r.i18n.getText("ariaLabelEditModeGroup",c.getHeaderText());}R.writeAccessibilityState(c,{label:s});R.write(">");R.write("<div");R.writeAttribute("id",c.getId()+"-title");R.addClass("sapUshellContainerTitleFlex");R.writeClasses();R.write(">");R.write("<");R.write(c.getHeaderLevel().toLowerCase());R.addClass("sapUshellContainerTitle");R.writeClasses();R.writeAttributeEscaped("title",c.getHeaderText());R.writeAttribute("id",c.getId()+"-titleText");R.writeAttribute("data-role","group");R.write(">");R.writeEscaped(c.getHeaderText());R.write("</");R.write(c.getHeaderLevel().toLowerCase());R.writeAttribute("id",c.getId()+"-groupheader");R.write(">");if(c.getShowIcon()){c.oIcon.removeStyleClass("sapUshellContainerIconHidden");}else{c.oIcon.addStyleClass("sapUshellContainerIconHidden");}R.renderControl(c.oEditInputField);if(c.getIsGroupLocked()){R.renderControl(c.oIcon);}else if(c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellContainerHeaderActions");R.writeClasses();R.write(">");h.forEach(function(c){R.renderControl(c);});R.write("</div>");}R.write("</div>");R.write("</div>");}R.write("<ul");e=c.data("containerHeight");if(e){R.writeAttribute("style","height:"+e);}R.addClass("sapUshellTilesContainer-sortable");R.addClass("sapUshellInner");R.writeClasses();R.writeAccessibilityState(c,{role:"listbox"});R.write(">");var v=[];c.getTiles().forEach(function(o){if(o.getVisible()){v.push(o);}});v.forEach(function(o,p){o.addCustomData(new A({key:"aria-posinset",value:(p+1).toString(),writeToDom:true}));o.addCustomData(new A({key:"aria-setsize",value:v.length.toString(),writeToDom:true}));if(t._isUserActivityCard(o)){t._updateUserActivityCardVisibility(o);}R.renderControl(o);});if(c.getShowPlaceholder()){R.renderControl(c.oPlusTile);}if(c.getShowNoData()){this.renderNoData(R,c,!v.length);}R.write("</ul>");var L=c.getSupportLinkPersonalization();if(l.length>0||L){if(c.getShowBackground()&&!(c.getIsGroupLocked()&&!v.length)){R.write("<div");R.addClass("sapUshellTilesContainerSeparator");R.writeClasses();R.write(">");R.write("</div>");}R.write("<div aria-hidden='true'");var g=L?"sapUshellLineModeContainer":"sapUshellLinksContainer";R.addClass(g);if(!l.length&&L){R.addClass("sapUshellNoLinksAreaPresent");R.writeClasses();R.write(">");R.write("<div");R.addClass("sapUshellNoLinksAreaPresentText");R.writeClasses();R.write(">");R.renderControl(c.getNoLinksText());R.write("</div>");}else{R.writeClasses();R.write(">");}if(L){R.write("<div");R.addClass("sapUshellTransformationError");R.writeClasses();if(!c.transformationError){R.writeAttribute("style","display: none;");}R.write(">");R.write("<div");R.addClass("sapUshellTransformationErrorInnerWrapper");R.writeClasses();R.write(">");R.renderControl(c.getTransformationErrorIcon());R.renderControl(c.getTransformationErrorText());R.write("</div>");R.write("</div>");}if(L){R.write("<div class='sapUshellLinksInnerContainer'>");}l.map(function(i,j,l){if(L){var k=new A({key:"tabindex",value:"-1",writeToDom:true});i.getCustomData().map(function(n){if(n.getKey()=="tabindex"&&n.getValue("0")){k=n;}i.removeCustomData(n);});i.addCustomData(new A({key:"aria-posinset",value:(j+1).toString(),writeToDom:true}));i.addCustomData(new A({key:"aria-setsize",value:l.length.toString(),writeToDom:true}));i.addCustomData(k);if(i.getModel()&&i.getModel().getProperty("/enableHelp")){i.addCustomData(new a({key:"help-id",value:i.getBindingContext()&&i.getBindingContext().getProperty("tileCatalogId"),writeToDom:true}));}i.addStyleClass("sapUshellLinkTile");if(c.getIsGroupLocked()){i.addStyleClass("sapUshellLockedTile");}}R.renderControl(i);});if(L){R.write("</div>");}R.write("</div>");}if(f.length>0){R.write("<footer");R.addClass("sapUshellTilesContainerFtr");R.writeClasses();R.write(">");f.forEach(function(c){R.renderControl(c);});R.write("</footer>");}R.write("</div>");if(d.length&&c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellTileContainerAfterContent");R.addClass("sapContrastPlus ");R.writeClasses();R.write(">");d.forEach(function(c){R.renderControl(c);});R.write("</div>");}R.write("</div>");u.setPerformanceMark("FLP -- tile container renderer");};T.renderNoData=function(R,c,d){R.write("<div id='"+c.getId()+"-listNoData' class='sapUshellNoFilteredItems sapUiStrongBackgroundTextColor'>");if(d){if(c.getNoDataText()){R.writeEscaped(c.getNoDataText());}else{R.writeEscaped(c.getNoDataText(r.i18n.getText("noFilteredItems")));}}else{R.writeEscaped("");}R.write("</div>");};T._isUserActivityCard=function(c){if(typeof c.getManifest!=="function"){return false;}var M=c.getManifest();var s=M&&M["sap.card"]&&M["sap.card"].header&&M["sap.card"].header.title;return s===r.i18n.getText("recentActivities")||s===r.i18n.getText("frequentActivities");};T._updateUserActivityCardVisibility=function(c){c.setVisible(C.last("/core/shell/model/enableTrackingActivity"));C.on("/core/shell/model/enableTrackingActivity").do(function(e){c.setVisible(e);});};return T;},true);
