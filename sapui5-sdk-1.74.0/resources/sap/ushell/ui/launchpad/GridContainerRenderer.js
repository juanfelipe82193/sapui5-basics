// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/utils","sap/ushell/Config"],function(r,A,u,C){"use strict";var G={};G.render=function(R,c){var h=c.getHeaderActions(),b=c.getBeforeContent(),a=c.getAfterContent(),f=c.getFooterContent()||[],g=c.getAggregation("_grid"),d,l=c.getLinks(),i;R.write("<div");R.writeControlData(c);R.addClass("sapUshellTileContainer");R.writeClasses();R.write(">");if(b.length&&c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellTileContainerBeforeContent");R.addClass("sapContrastPlus");R.writeClasses();R.write(">");b.forEach(function(c){R.renderControl(c);});R.write("</div>");}R.write("<div");R.addClass("sapUshellTileContainerContent");R.addClass("sapUshellGridContainerContent");if(c.getIsGroupLocked()){R.addClass("sapUshellTileContainerLocked");}if(c.getDefaultGroup()){R.addClass("sapUshellTileContainerDefault");}if(c.getShowBackground()){R.addClass("sapUshellTileContainerEditMode");}R.writeClasses();R.writeAttribute("tabindex","-1");R.write(">");if(c.getShowBackground()){R.write("<div");R.addClass("sapUshellGroupBackgroundContainer sapContrastPlus");R.writeClasses();R.write(">");R.write("</div>");}if(c.getShowHeader()){R.write("<div");R.addClass("sapUshellTileContainerHeader sapContrastPlus");if(!c.getShowGroupHeader()){R.addClass("sapUshellFirstGroupHeaderHidden sapUiPseudoInvisibleText");}R.writeAttribute("id",c.getId()+"-groupheader");R.writeClasses();if(c.getIeHtml5DnD()&&!c.getIsGroupLocked()&&!c.getDefaultGroup()&&c.getTileActionModeActive()){R.writeAttribute("draggable","true");}var s;if(c.getDefaultGroup()){s=r.i18n.getText("ariaLabelEditModeGroupDefault",c.getHeaderText());}else if(c.getIsGroupLocked()){s=r.i18n.getText("ariaLabelEditModeGroupLocked",c.getHeaderText());}else{s=r.i18n.getText("ariaLabelEditModeGroup",c.getHeaderText());}R.writeAccessibilityState(c,{label:s});R.write(">");R.write("<div");R.writeAttribute("id",c.getId()+"-title");R.addClass("sapUshellContainerTitleFlex");R.writeClasses();R.write(">");R.write("<");R.write(c.getHeaderLevel().toLowerCase());R.addClass("sapUshellContainerTitle");R.writeClasses();R.writeAttributeEscaped("title",c.getHeaderText());R.writeAttribute("id",c.getId()+"-titleText");R.writeAttribute("data-role","group");R.write(">");R.writeEscaped(c.getHeaderText());R.write("</");R.write(c.getHeaderLevel().toLowerCase());R.writeAttribute("id",c.getId()+"-groupheader");R.write(">");if(c.getShowIcon()){c.oIcon.removeStyleClass("sapUshellContainerIconHidden");}else{c.oIcon.addStyleClass("sapUshellContainerIconHidden");}R.renderControl(c.oEditInputField);if(c.getIsGroupLocked()){R.renderControl(c.oIcon);}else if(c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellContainerHeaderActions");R.writeClasses();R.write(">");for(i=0;i<h.length;i++){R.renderControl(h[i]);}R.write("</div>");}R.write("</div>");R.write("</div>");}R.write("<ul");d=c.data("containerHeight");if(d){R.writeAttribute("style","height:"+d);}R.addClass("sapUshellTilesContainer-sortable");R.addClass("sapUshellInner");R.writeClasses();R.writeAccessibilityState(c,{role:"listbox"});R.write(">");var v=[];c.getTiles().forEach(function(T){if(T.getVisible()){v.push(T);}});v.forEach(function(m,p){m.addCustomData(new A({key:"aria-posinset",value:(p+1).toString(),writeToDom:true}));m.addCustomData(new A({key:"aria-setsize",value:v.length.toString(),writeToDom:true}));if(this._isUserActivityCard(m)){this._updateUserActivityCardVisibility(m);}}.bind(this));R.renderControl(g);R.write("</ul>");var L=c.getSupportLinkPersonalization();if(l.length>0||L){R.write("<div aria-hidden='true'");var e=L?"sapUshellLineModeContainer":"sapUshellLinksContainer";R.addClass(e);if(!l.length&&L){R.addClass("sapUshellNoLinksAreaPresent");R.writeClasses();R.write(">");R.write("<div");R.addClass("sapUshellNoLinksAreaPresentText");R.writeClasses();R.write(">");R.renderControl(c.oNoLinksText);R.write("</div>");}else{R.writeClasses();R.write(">");}if(L){R.write("<div");R.addClass("sapUshellTransformationError");R.writeClasses();if(!c.transformationError){R.writeAttribute("style","display: none;");}R.write(">");R.write("<div");R.addClass("sapUshellTransformationErrorInnerWrapper");R.writeClasses();R.write(">");R.renderControl(c.oTransformationErrorIcon);R.renderControl(c.oTransformationErrorText);R.write("</div>");R.write("</div>");R.write("<div class='sapUshellLinksInnerContainer'>");for(i=0;i<l.length;i++){var o=l[i],k=o.getCustomData(),t="-1";for(var j=0;j<k.length;j++){if(k[j].getKey()==="tabindex"){t=k[j].getValue();}o.removeCustomData(k[j]);}o.addCustomData(new A({key:"aria-posinset",value:(i+1).toString(),writeToDom:true}));o.addCustomData(new A({key:"aria-setsize",value:l.length.toString(),writeToDom:true}));o.addCustomData(new A({key:"tabindex",value:t,writeToDom:true}));o.addStyleClass("sapUshellLinkTile");if(c.getIsGroupLocked()){o.addStyleClass("sapUshellLockedTile");}R.renderControl(o);}R.write("</div>");}R.write("</div>");}if(f.length>0){R.write("<footer");R.addClass("sapUshellTilesContainerFtr");R.writeClasses();R.write(">");f.forEach(function(c){R.renderControl(c);});R.write("</footer>");}R.write("</div>");if(a.length&&c.getTileActionModeActive()){R.write("<div");R.addClass("sapUshellTileContainerAfterContent");R.addClass("sapContrastPlus ");R.writeClasses();R.write(">");a.forEach(function(c){R.renderControl(c);});R.write("</div>");}R.write("</div>");u.setPerformanceMark("FLP -- tile container renderer");};G._updateUserActivityCardVisibility=function(c){c.setVisible(C.last("/core/shell/model/enableTrackingActivity"));C.on("/core/shell/model/enableTrackingActivity").do(function(e){c.setVisible(e);});};G._isUserActivityCard=function(c){if(typeof c.getManifest!=="function"){return false;}var m=c.getManifest();var s=m&&m["sap.card"]&&m["sap.card"].header&&m["sap.card"].header.title;return s===r.i18n.getText("recentActivities")||s===r.i18n.getText("frequentActivities");};return G;},true);
