// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Bar","sap/ui/Device","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/m/Button","sap/ushell/resources","sap/ui/model/Filter","sap/ushell/ui/launchpad/GroupListItem","sap/m/List","sap/m/library","sap/ushell/library","./AnchorNavigationBarRenderer"],function(B,D,q,a,b,r,F,G,L,m){"use strict";var c=m.ListMode;var A=B.extend("sap.ushell.ui.launchpad.AnchorNavigationBar",{metadata:{library:"sap.ushell",properties:{accessibilityLabel:{type:"string",defaultValue:null},selectedItemIndex:{type:"int",group:"Misc",defaultValue:0},overflowEnabled:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{groups:{type:"sap.ushell.ui.launchpad.AnchorItem",multiple:true,singularName:"group"}},events:{afterRendering:{},itemPress:{}}}});A.prototype.init=function(){D.resize.attachHandler(this.reArrangeNavigationBarElements,this);this.bGroupWasPressed=false;this.bIsRtl=sap.ui.getCore().getConfiguration().getRTL();this._bIsRenderedCompletely=false;};A.prototype.handleExit=function(){if(this.oPopover){this.oPopover.destroy();}if(this.oOverflowButton){this.oOverflowButton.destroy();}};A.prototype.onAfterRendering=function(){if(this._bIsRenderedCompletely){this.reArrangeNavigationBarElements();if(this.bIsRtl){q(".sapUshellAnchorNavigationBarItemsScroll").addClass("sapUshellRtl");}q(".sapUshellAnchorNavigationBarItemsScroll").scroll(this.setNavigationBarItemsVisibility.bind(this));}};A.prototype.openOverflowPopup=function(){var o=q(".sapUshellAnchorItemOverFlow").hasClass("sapUshellAnchorItemOverFlowOpen");if(this.oOverflowButton&&!o){this.oOverflowButton.firePress();}};A.prototype.closeOverflowPopup=function(){if(this.oPopover){this.oPopover.close();}};A.prototype.reArrangeNavigationBarElements=function(){this.anchorItems=this.getVisibleGroups();var s=this.getSelectedItemIndex()||0;if(this.anchorItems.length){this.adjustItemSelection(s);}if(D.system.phone&&this.anchorItems.length){this.anchorItems.forEach(function(i){i.setIsGroupVisible(false);});this.anchorItems[this.getSelectedItemIndex()].setIsGroupVisible(true);}else{setTimeout(function(){this.setNavigationBarItemsVisibility();}.bind(this),200);}this._adjustAnchorBarAriaProperties(this.anchorItems);};A.prototype._scrollToGroupByGroupIndex=function(g,s){var S=D.system.tablet?".sapUshellAnchorNavigationBarItemsScroll":".sapUshellAnchorNavigationBarItems";var C=document.documentElement.querySelector(S);var o=this.anchorItems[g].getDomRef();if(C&&o){var d=C.getBoundingClientRect();var i=o.getBoundingClientRect();var x;if(i.left<d.left){x=i.left-d.left-16;}else if(i.right>d.right){x=i.right-d.right+16;}if(x){C.scrollLeft+=x;}this.setNavigationBarItemsVisibility();}};A.prototype.setNavigationBarItemsVisibility=function(){if(!D.system.phone){if(this.anchorItems.length&&(!this.isMostRightAnchorItemVisible()||!this.isMostLeftAnchorItemVisible())){this.oOverflowButton.removeStyleClass("sapUshellShellHidden");q(".sapUshellAnchorItemOverFlow").removeClass("sapUshellShellHidden");}else if(this.oOverflowButton){this.oOverflowButton.addStyleClass("sapUshellShellHidden");q(".sapUshellAnchorItemOverFlow").addClass("sapUshellShellHidden");}if(this.bIsRtl){if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");}}else{if(this.anchorItems.length&&!this.isMostLeftAnchorItemVisible()){this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");}else if(this.oOverflowLeftButton){this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");}if(this.anchorItems.length&&!this.isMostRightAnchorItemVisible()){this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");}else if(this.oOverflowRightButton){this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");}}q(".sapUshellAnchorItem.firstItem").removeClass("firstItem");var j=q(".sapUshellAnchorItem").filter(":visible").eq(0);j.addClass("firstItem");}else if(this.anchorItems.length){this.oOverflowButton.removeStyleClass("sapUshellShellHidden");var s=this.getSelectedItemIndex()||0;if(this.oPopover){this.oPopover.setTitle(this.anchorItems[s].getTitle());}}};A.prototype.adjustItemSelection=function(s){setTimeout(function(){if(this.anchorItems&&this.anchorItems.length){this.anchorItems.forEach(function(i){i.setSelected(false);});if(s<this.anchorItems.length){this.anchorItems[s].setSelected(true);this._scrollToGroupByGroupIndex(s);}}}.bind(this),200);};A.prototype.isMostRightAnchorItemVisible=function(){var j=q(".sapUshellAnchorNavigationBar"),n=!a(j)?j.width():0,d=!a(j)&&j.offset()?j.offset().left:0,l=this.bIsRtl?this.anchorItems[0].getDomRef():this.anchorItems[this.anchorItems.length-1].getDomRef(),e=!a(l)?q(l).width():0,f;if(e<0){e=80;}f=l&&q(l).offset()?q(l).offset().left:0;if(f+e<=d+n){return true;}return false;};A.prototype.isMostLeftAnchorItemVisible=function(){var j=q(".sapUshellAnchorNavigationBar"),n=!a(j)&&j.offset()&&j.offset().left||0,f=this.bIsRtl?this.anchorItems[this.anchorItems.length-1].getDomRef():this.anchorItems[0].getDomRef(),d=!a(f)&&q(f).offset()?q(f).offset().left:0;if(d>=n){return true;}return false;};A.prototype.setSelectedItemIndex=function(s){if(s!==undefined){this.setProperty("selectedItemIndex",s,true);}};A.prototype.setOverflowEnabled=function(e){this.setProperty("overflowEnabled",e);if(this.oOverflowButton){this.oOverflowButton.setEnabled(e);}};A.prototype._getOverflowLeftArrowButton=function(){this.oOverflowLeftButton=new b({icon:"sap-icon://slim-arrow-left",tooltip:r.i18n.getText("scrollToTop"),press:function(){this._scrollToGroupByGroupIndex(0);}.bind(this)}).addStyleClass("sapUshellShellHidden");return this.oOverflowLeftButton;};A.prototype._getOverflowRightArrowButton=function(){this.oOverflowRightButton=new b({icon:"sap-icon://slim-arrow-right",tooltip:r.i18n.getText("scrollToEnd"),press:function(){this._scrollToGroupByGroupIndex(this.anchorItems.length-1);}.bind(this)}).addStyleClass("sapUshellShellHidden");return this.oOverflowRightButton;};A.prototype._getOverflowButton=function(){if(this.oOverflowButton){return this.oOverflowButton;}this.oOverflowButton=new b("sapUshellAnchorBarOverflowButton",{icon:"sap-icon://slim-arrow-down",tooltip:r.i18n.getText("more_groups"),enabled:this.getOverflowEnabled(),press:function(){sap.ui.require(["sap/m/Popover"],function(P){if(!this.oPopover){this._initPopover(P);}if(this.oPopover.isOpen()){this.oPopover.close();}else{var l=this.oPopover.getContent()[0];this.anchorItems=this.getVisibleGroups();l.setModel(this.getModel());var d=this.getModel().getProperty("/tileActionModeActive");var v=new F("","EQ","a");v.fnTest=function(i){if(!i.visibilityModes[d?1:0]){return false;}return i.isGroupVisible||d;};l.bindItems({path:"/groups",template:new G({title:"{title}",groupId:"{groupId}",index:"{index}"}),filters:[v]});var s=q(".sapUshellAnchorItemSelected").attr("id");var S=sap.ui.getCore().byId(s);q.each(l.getItems(),function(i,e){if(S.mProperties.groupId===e.mProperties.groupId){e.addStyleClass("sapUshellAnchorPopoverItemSelected");}else{e.addStyleClass("sapUshellAnchorPopoverItemNonSelected");}});q(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",true);this.oPopover.openBy(this.oOverflowButton);}}.bind(this));}.bind(this)}).addStyleClass("sapUshellShellHidden").addStyleClass("sapContrastPlus");return this.oOverflowButton;};A.prototype._initPopover=function(P){var t=this;var l=new L({mode:c.SingleSelectMaster,rememberSelections:false,selectionChange:function(e){t.fireItemPress({group:e.getParameter("listItem")});t.oPopover.close();}});this.bOverFlowBtnClick=false;this.oPopover=new P("sapUshellAnchorBarOverflowPopover",{showArrow:false,showHeader:false,placement:"Left",content:[l],horizontalScrolling:false,beforeOpen:function(){q(".sapUshellAnchorItemOverFlow").addClass("sapUshellAnchorItemOverFlowOpen");var j=q(".sapUshellAnchorItemOverFlow"),i=sap.ui.getCore().getConfiguration().getRTL(),o=i?-1*j.outerWidth():j.outerWidth();this.setOffsetX(o);},beforeClose:function(){if(document.activeElement.id===this.oOverflowButton.getId()){this.bOverFlowBtnClick=true;}}.bind(this),afterClose:function(){q(".sapUshellAnchorItemOverFlow").removeClass("sapUshellAnchorItemOverFlowOpen");q(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed",false);}}).addStyleClass("sapUshellAnchorItemsPopover").addStyleClass("sapContrastPlus");};A.prototype.getVisibleGroups=function(){return this.getGroups().filter(function(g){return g.getVisible();});};A.prototype._adjustAnchorBarAriaProperties=function(g){var i;for(i=0;i<g.length;i++){var j=q(g[i].getDomRef());j.attr("aria-posinset",i+1);j.attr("aria-setsize",g.length);}};A.prototype._setRenderedCompletely=function(R){this._bIsRenderedCompletely=R;};A.prototype.handleAnchorItemPress=function(e){this.bGroupWasPressed=true;this.fireItemPress({group:e.getSource(),manualPress:true});};A.prototype.exit=function(){if(this.oOverflowLeftButton){this.oOverflowLeftButton.destroy();}if(this.oOverflowRightButton){this.oOverflowRightButton.destroy();}if(this.oOverflowButton){this.oOverflowButton.destroy();}if(this.oPopover){this.oPopover.destroy();}};return A;});
