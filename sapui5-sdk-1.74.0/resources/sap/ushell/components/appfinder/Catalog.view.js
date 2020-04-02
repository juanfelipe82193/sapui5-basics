// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/HTML","sap/ushell/ui/appfinder/AppBox","sap/ushell/ui/appfinder/PinButton","sap/ushell/ui/launchpad/CatalogEntryContainer","sap/ushell/ui/launchpad/CatalogsContainer","sap/ushell/ui/launchpad/Panel","sap/ushell/ui/launchpad/Tile","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/m/List","sap/m/StandardListItem","sap/ui/Device","sap/m/MessagePage","sap/m/Page","sap/m/BusyIndicator","sap/m/SplitApp","sap/ushell/Config"],function(H,A,P,C,a,b,T,q,M,r,c,L,S,D,d,f,B,g,h){"use strict";sap.ui.jsview("sap.ushell.components.appfinder.Catalog",{oController:null,createContent:function(o){var t=this;this.oViewData=this.getViewData();this.parentComponent=this.oViewData.parentComponent;var m=this.parentComponent.getModel();this.setModel(m);this.setModel(this.oViewData.subHeaderModel,"subHeaderModel");this.oController=o;function i(e){return((e!==null)&&(e==="1x2"||e==="2x2"))||false;}function j(v){return parseInt(v,10)||0;}function k(e,v,I,J,K,N){var O;if(J){var R=r.i18n,Q=I?Array.prototype.indexOf.call(I,K):-1;O=R.getText(Q!==-1?"removeAssociatedTileFromContextGroup":"addAssociatedTileToContextGroup",N);}else{O=I&&I.length?v:e;}return O;}var l=new P({icon:"sap-icon://pushpin-off",selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:function(e,v,I,J){if(I){var K=e?Array.prototype.indexOf.call(e,J):-1;return K!==-1;}return!!v;}},tooltip:{parts:["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip","i18n>EasyAccessMenu_PinButton_Toggled_Tooltip","associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id","/groupContext/title"],formatter:function(e,v,I,J,K,N,O){return k(e,v,I,K,N,O);}},press:[o.onTilePinButtonClick,o]});var n=new P({icon:"sap-icon://pushpin-off",selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:function(e,v,I,J){if(I){var K=e?Array.prototype.indexOf.call(e,J):-1;return K!==-1;}return!!v;}},tooltip:{parts:["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip","i18n>EasyAccessMenu_PinButton_Toggled_Tooltip","associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id","/groupContext/title"],formatter:function(e,v,I,J,K,N,O){return k(e,v,I,K,N,O);}},press:[o.onTilePinButtonClick,o]});this.oAppBoxesTemplate=new A({title:"{title}",icon:"{icon}",subtitle:"{subtitle}",url:"{url}",navigationMode:"{navigationMode}",pinButton:n,press:[o.onAppBoxPressed,o]});var E=h.last("/core/shell/enablePersonalization");n.setVisible(E);n.addCustomData(new c({key:"tabindex",value:"-1",writeToDom:true}));n.addStyleClass("sapUshellPinButton");l.setVisible(E);l.addCustomData(new c({key:"tabindex",value:"-1",writeToDom:true}));l.addStyleClass("sapUshellPinButton");this.oTileTemplate=new T({tileViews:{path:"content",factory:function(I,e){return e.getObject();}},"long":{path:"size",formatter:i},index:{path:"id",formatter:j},tileCatalogId:"{id}",pinButton:l,press:[o.catalogTilePress,o],afterRendering:o.onTileAfterRendering});this.oCatalogSelect=new L("catalogSelect",{visible:"{/enableCatalogSelection}",name:"Browse",rememberSelections:true,mode:"SingleSelectMaster",items:{path:"/masterCatalogs",template:new S({type:"Active",title:"{title}",tooltip:"{title}"})},showNoData:false,itemPress:[o._handleCatalogListItemPress,o],selectionChange:[o._handleCatalogListItemPress,o]});this.getCatalogSelect=function(){return this.oCatalogSelect;};var p=this.oCatalogSelect.onAfterRendering;if(D.system.desktop){this.oCatalogSelect.addEventDelegate({onsaptabnext:function(v){try{v.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();}catch(e){}},onsapskipforward:function(v){try{v.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();}catch(e){}},onsapskipback:function(v){try{v.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);var I=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(I.getVisible()){I.focus();}else{sap.ushell.components.ComponentKeysHandler.appFinderFocusMenuButtons(v);}}catch(e){}}});}if(m.getProperty("/enableHelp")){this.oCatalogSelect.addStyleClass("help-id-catalogCategorySelect");}this.setCategoryFilterSelection=function(e,v){var I=t.getCatalogSelect(),J=I.getItems(),K=e,N=0;if(!K||K===""){K=r.i18n.getText("all");}J.forEach(function(O,Q){if(O.getTitle()===K){N=Q;I.setSelectedItem(O);}});if(J.length!==0&&v){J[N].focus();}};this.oCatalogSelect.onAfterRendering=function(){var e=t.oController.categoryFilter||r.i18n.getText("all");t.setCategoryFilterSelection(e);if(p){p.apply(this,arguments);}if(!this.getSelectedItem()){this.setSelectedItem(this.getItems()[0]);}setTimeout(function(){var v=q("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");if(v.length){v.eq(0).focus();}else{q("#catalog-button").focus();}},0);};var s=this.oCatalogSelect._onAfterRenderingPopover;this.oCatalogSelect._onAfterRenderingPopover=function(){if(this._oPopover){this._oPopover.setFollowOf(false);}if(s){s.apply(this,arguments);}};var u=sap.ui.getCore().getEventBus(),w,U=function(){this.splitApp.toMaster("catalogSelect","show");if(!D.system.phone){w=this._calculateDetailPageId();if(w!==this.splitApp.getCurrentDetailPage().getId()){this.splitApp.toDetail(w);}}};u.subscribe("launchpad","catalogContentLoaded",function(){setTimeout(U.bind(this),500);},this);u.subscribe("launchpad","afterCatalogSegment",U,this);var x=new H("sapUshellCatalogAccessibilityTileText",{content:"<div style='height: 0px; width: 0px; overflow: hidden; float: left;'>"+r.i18n.getText("tile")+"</div>"});var y=new C({header:"{title}",customTilesContainer:{path:"customTiles",template:this.oTileTemplate,templateShareable:true},appBoxesContainer:{path:"appBoxes",template:this.oAppBoxesTemplate,templateShareable:true}});this.oMessagePage=new d({visible:true,showHeader:false,text:r.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),description:""});this.oCatalogsContainer=new a("catalogTiles",{categoryFilter:"{/categoryFilter}",catalogs:{path:"/catalogs",templateShareable:true,template:y},busy:true});this.oCatalogsContainer.addStyleClass("sapUshellCatalogTileContainer");this.oCatalogsContainer.addEventDelegate({onsaptabprevious:function(e){var v=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader"),I=q(e.srcControl.getDomRef());if(v.getVisible()&&!v.getPressed()&&!I.hasClass("sapUshellPinButton")){e.preventDefault();var J=sap.ui.getCore().byId("appFinderSearch");J.focus();}},onsapskipback:function(e){var v=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(v.getVisible()&&!v.getPressed()){e.preventDefault();v.focus();}}});this.oCatalogsContainer.onAfterRendering=function(){var e=sap.ui.getCore().byId("catalogTilesDetailedPage");if(!this.getBusy()){e.setBusy(false);M.end("FLP:AppFinderLoadingStartToEnd");}else{e.setBusy(true);}q("#catalogTilesDetailedPage-cont").scroll(function(){var v=sap.ui.getCore().byId("catalogTilesDetailedPage"),I=v.getScrollDelegate(),J=I.getScrollTop(),K=I.getMaxScrollTop();if(K-J<=30+3*t.oController.PagingManager.getTileHeight()&&t.oController.bIsInProcess===false){t.oController.bIsInProcess=true;t.oController.allocateNextPage();setTimeout(function(){t.oController.bIsInProcess=false;},0);}});};this.wrapCatalogsContainerInDetailPage=function(e,I){var v=new f(I,{showHeader:false,showFooter:false,showNavButton:false,content:[new b({translucent:true,content:e}).addStyleClass("sapUshellCatalogPage")]});return v;};this.getCatalogContainer=function(){return this.oCatalogsContainer;};new f({showHeader:false,showFooter:false,showNavButton:false,content:[new b({translucent:true,content:[x,this.getCatalogContainer()]}).addStyleClass("sapUshellCatalogPage")]});var z=this.wrapCatalogsContainerInDetailPage([x,this.getCatalogContainer()],"catalogTilesDetailedPage"),F=new f("catalogMessagePage",{showHeader:false,showFooter:false,showNavButton:false,content:[this.oMessagePage]});var G=new B("catalogSelectBusyIndicator",{size:"1rem"});this.splitApp=new g("catalogViewMasterDetail",{masterPages:[G,this.oCatalogSelect],detailPages:[z,F]});document.toSearch=function(){this.splitApp.toDetail("catalogTilesSearchPage");}.bind(this);document.toDetail=function(){this.splitApp.toDetail("catalogTilesDetailedPage");}.bind(this);document.toMessage=function(){this.splitApp.toDetail("catalogMessagePage");}.bind(this);return this.splitApp;},_calculateDetailPageId:function(){var s=this.getModel("subHeaderModel");var e=s.getProperty("/search/searchMode");var t=s.getProperty("/tag/tagMode");var n=!!this.getModel().getProperty("/catalogsNoDataText");var i;if(e||t){i=this.getController().bSearchResults?"catalogTilesDetailedPage":"catalogMessagePage";}else if(n){i="catalogMessagePage";}else{i="catalogTilesDetailedPage";}return i;},getControllerName:function(){return"sap.ushell.components.appfinder.Catalog";}});});
