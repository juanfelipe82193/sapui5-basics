// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ui/thirdparty/jquery","sap/base/Log","sap/m/ResponsivePopover","sap/ushell/resources","sap/m/ScrollContainer","sap/ui/Device","sap/m/StandardListItem","sap/m/List","sap/m/Input","sap/ui/core/library","sap/m/Button","sap/ui/core/IconPool","sap/m/Bar","sap/m/Label","sap/m/DisplayListItem","sap/m/library","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(C,q,L,R,r,S,D,a,b,I,c,B,d,f,g,h,m,F,i){"use strict";var j=m.ListMode;var k=m.ListType;var V=c.ValueState;sap.ui.jsview("sap.ushell.components.appfinder.GroupListPopover",{createContent:function(){this.oPopover=sap.ui.getCore().byId("groupsPopover");if(this.oPopover){return;}this.iPopoverDataSectionHeight=192;this.oGroupsContainer=this._createPopoverContainer(this.iPopoverDataSectionHeight);this.oLaunchPageService=sap.ushell.Container.getService("LaunchPage");this.oPopover=new R({id:"groupsPopover",placement:"Auto",title:r.i18n.getText("addTileToGroups_popoverTitle"),contentWidth:"20rem",beginButton:this._createCloseButton(),content:this.oGroupsContainer,afterClose:this.getController()._afterCloseHandler.bind(this.getController())});this.oPopover.setInitialFocus("newGroupItem");},open:function(o){if(document.body.clientHeight-o.getDomRef().getBoundingClientRect().bottom>=310){this.oPopover.setPlacement("Bottom");}this.oPopover.openBy(o);if(this.getViewData().singleGroupSelection){this.getController()._setFooterVisibility(false);}this.deferred=q.Deferred();return this.deferred.promise();},_createPopoverContainer:function(p){var e=sap.ui.getCore().byId("popoverContainer");if(e){return e;}var n=this._createNewGroupUiElements(),G=this._createPopoverGroupList();e=new S({id:"popoverContainer",horizontal:false,vertical:true,content:[n,G]});if(!D.system.phone){e.setHeight((p-2)+"px");}else{e.setHeight("100%");}return e;},_createNewGroupUiElements:function(){var n=sap.ui.getCore().byId("newGroupItemList");if(n){return n;}var N=new a({id:"newGroupItem",title:r.i18n.getText("newGroup_listItemText"),type:"Navigation",press:this.getController()._navigateToCreateNewGroupPane.bind(this.getController())});n=new b("newGroupItemList",{});if(C.last("/core/extension/enableHelp")){N.addStyleClass("help-id-newGroupItem");}n.addItem(N);n.addEventDelegate({onsapdown:function(E){try{E.preventDefault();E._bIsStopHandlers=true;var l=q("#popoverContainer .sapMListModeMultiSelect li, #popoverContainer .sapMListModeSingleSelectMaster li").eq(0);l.focus();}catch(e){}},onsaptabnext:function(E){try{E.preventDefault();E._bIsStopHandlers=true;var l=q("#closeButton");l.focus();}catch(e){}}});return n;},_createNewGroupInput:function(){var n=sap.ui.getCore().byId("newGroupNameInput");if(n){return n;}n=new I({id:"newGroupNameInput",type:"Text",placeholder:r.i18n.getText("new_group_name")});n.setValueState(V.None);n.setPlaceholder(r.i18n.getText("new_group_name"));n.enabled=true;n.addStyleClass("sapUshellCatalogNewGroupInput");return n;},_createHeadBarForNewGroup:function(){var H=sap.ui.getCore().byId("oHeadBar");if(H){return H;}var o=new B({icon:d.getIconURI("nav-back"),press:this.getController()._backButtonHandler.bind(this.getController()),tooltip:r.i18n.getText("newGroupGoBackBtn_tooltip")});o.addStyleClass("sapUshellCatalogNewGroupBackButton");H=new f("oHeadBar",{contentLeft:[o],contentMiddle:[new g({text:r.i18n.getText("newGroup_popoverTitle")})]});return H;},getControllerName:function(){return"sap.ushell.components.appfinder.GroupListPopover";},_createPopoverGroupList:function(){var l=new h({label:"{oGroup/title}",selected:"{selected}",tooltip:"{oGroup/title}",type:k.Active,press:this.getController().groupListItemClickHandler.bind(this.getController())});var u=[];u.push(new F("oGroup/isGroupLocked",i.EQ,false));if(this.getViewData().enableHideGroups){u.push(new F("oGroup/isGroupVisible",i.EQ,true));}var s=this.getViewData().singleGroupSelection,o=new b({mode:s?j.SingleSelectMaster:j.MultiSelect,items:{path:"/userGroupList",template:l,filters:u}});if(s){o.attachSelect(this.getController().okButtonHandler.bind(this.getController()));}else{o.attachSelectionChange(this.getController().checkboxClickHandler.bind(this.getController()));}o.addEventDelegate({onsapup:function(E){try{E.preventDefault();var n,p=q(":focus");if(p.index()===0){n=q("#newGroupItem");n.focus();E._bIsStopHandlers=true;}}catch(e){L.error("Groups popup Accessibility `up` key failed");}}});return o;},_createOkButton:function(){var o=new B({id:"okButton",press:this.getController().okButtonHandler.bind(this.getController()),text:r.i18n.getText("okBtn")});o.addEventDelegate({onsaptabprevious:function(E){try{E.preventDefault();E._bIsStopHandlers=true;var l=q("#newGroupItem");if(!l.length){l=q("#newGroupNameInput input");}l.focus();}catch(e){L.error("Groups popup Accessibility `shift-tab` key failed");}}});return o;},_createCancelButton:function(){return new B({id:"cancelButton",press:this.getController()._closeButtonHandler.bind(this.getController()),text:r.i18n.getText("cancelBtn")});},_createCloseButton:function(){return sap.ui.getCore().byId("closeButton")||new B({id:"closeButton",press:this.getController()._switchGroupsPopoverButtonPress.bind(this.getController()),text:r.i18n.getText(r.i18n.getText("close"))});}});});
