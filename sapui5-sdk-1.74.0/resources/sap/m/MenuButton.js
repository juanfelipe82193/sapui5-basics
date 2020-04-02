/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','./Button','./SplitButton','sap/ui/Device','sap/ui/core/EnabledPropagator','sap/ui/core/library','sap/ui/core/Popup','sap/ui/core/LabelEnablement','sap/m/Menu',"./MenuButtonRenderer"],function(l,C,B,S,D,E,c,P,L,M,a){"use strict";var b=l.MenuButtonMode;var T=c.TextDirection;var d=l.ButtonType;var e=P.Dock;var n=["buttonMode","useDefaultActionOnly","width","menuPosition"];var f=C.extend("sap.m.MenuButton",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:null},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:d.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit},buttonMode:{type:"sap.m.MenuButtonMode",group:"Misc",defaultValue:b.Regular},menuPosition:{type:"sap.ui.core.Popup.Dock",group:"Misc",defaultValue:e.BeginBottom},useDefaultActionOnly:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{menu:{type:"sap.m.Menu",multiple:false,singularName:"menu"},_button:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{defaultAction:{}},defaultAggregation:"menu",designtime:"sap/m/designtime/MenuButton.designtime",dnd:{draggable:true,droppable:false}}});E.call(f.prototype);f.prototype.init=function(){this._initButtonControl();};f.prototype.exit=function(){if(this._sDefaultText){this._sDefaultText=null;}if(this._sDefaultIcon){this._sDefaultIcon=null;}if(this._iInitialTextBtnContentWidth){this._iInitialTextBtnContentWidth=null;}if(this._lastActionItemId){this._lastActionItemId=null;}if(this.getMenu()){this.getMenu().detachClosed(this._menuClosed,this);}};f.prototype.onBeforeRendering=function(){if(!this._sDefaultText){this._sDefaultText=this.getText();}if(!this._sDefaultIcon){this._sDefaultIcon=this.getIcon();}this._updateButtonControl();this._attachMenuEvents();};f.prototype._needsWidth=function(){return this._isSplitButton()&&this.getWidth()==="";};f.prototype._getTextBtnContentDomRef=function(){return this._getButtonControl()._getTextButton().getDomRef("content");};f.prototype.onAfterRendering=function(){if(this._needsWidth()&&sap.ui.getCore().isThemeApplied()&&this._getTextBtnContentDomRef()&&this._getInitialTextBtnWidth()>0){this._getTextBtnContentDomRef().style.width=this._getInitialTextBtnWidth()+'px';}this._setAriaHasPopup();};f.prototype.onThemeChanged=function(o){if(this._needsWidth()&&this.getDomRef()&&!this._iInitialTextBtnContentWidth&&this._getTextBtnContentDomRef()&&this._getInitialTextBtnWidth()>0){this._getTextBtnContentDomRef().style.width=this._getInitialTextBtnWidth()+'px';}};f.prototype._getInitialTextBtnWidth=function(){if(!this._iInitialTextBtnContentWidth){this._iInitialTextBtnContentWidth=Math.ceil(this._getTextBtnContentDomRef().getBoundingClientRect().width);}return this._iInitialTextBtnContentWidth;};f.prototype._setAriaHasPopup=function(){var o=this._getButtonControl(),O=this._isSplitButton()?o._getArrowButton():o;O.$().attr("aria-haspopup","menu");};f.prototype.setButtonMode=function(m){var t=this.getTooltip();C.prototype.setProperty.call(this,"buttonMode",m,true);this._getButtonControl().destroy();this._initButtonControl();for(var k in this.mProperties){if(this.mProperties.hasOwnProperty(k)&&n.indexOf(k)<0){this._getButtonControl().setProperty(k,this.mProperties[k],true);}}if(t){this._getButtonControl().setTooltip(t);}if(!this._isSplitButton()&&this._sDefaultText){this.setText(this._sDefaultText);}else if(!this.getUseDefaultActionOnly()&&this._getLastSelectedItem()){this.setText(sap.ui.getCore().byId(this._getLastSelectedItem()).getText());}if(!this._isSplitButton()&&this._sDefaultIcon){this.setIcon(this._sDefaultIcon);}else if(!this.getUseDefaultActionOnly()&&this._getLastSelectedItem()){this.setIcon(sap.ui.getCore().byId(this._getLastSelectedItem()).getIcon());}this.invalidate();return this;};f.prototype._initButton=function(){var o=new B(this.getId()+"-internalBtn",{width:"100%"});o.attachPress(this._handleButtonPress,this);return o;};f.prototype._initSplitButton=function(){var o=new S(this.getId()+"-internalSplitBtn",{width:"100%"});o.attachPress(this._handleActionPress,this);o.attachArrowPress(this._handleButtonPress,this);return o;};f.prototype._initButtonControl=function(){var o;if(this._isSplitButton()){o=this._initSplitButton();}else{o=this._initButton();}this.setAggregation("_button",o,true);};f.prototype._updateButtonControl=function(){this._getButtonControl().setText(this.getText());};f.prototype._getButtonControl=function(){return this.getAggregation("_button");};f.prototype._handleButtonPress=function(w){var m=this.getMenu(),o={zero:"0 0",plus2_right:"0 +2",minus2_right:"0 -2",plus2_left:"+2 0",minus2_left:"-2 0"};if(this._bPopupOpen){this.getMenu().close();return;}if(!m){return;}if(!m.getTitle()){m.setTitle(this.getText());}var p=[this,w];switch(this.getMenuPosition()){case e.BeginTop:p.push(e.BeginBottom,e.BeginTop,o.plus2_right);break;case e.BeginCenter:p.push(e.BeginCenter,e.BeginCenter,o.zero);break;case e.LeftTop:p.push(e.RightBottom,e.LeftBottom,o.plus2_left);break;case e.LeftCenter:p.push(e.RightCenter,e.LeftCenter,o.plus2_left);break;case e.LeftBottom:p.push(e.RightTop,e.LeftTop,o.plus2_left);break;case e.CenterTop:p.push(e.CenterBottom,e.CenterTop,o.plus2_left);break;case e.CenterCenter:p.push(e.CenterCenter,e.CenterCenter,o.zero);break;case e.CenterBottom:p.push(e.CenterTop,e.CenterBottom,o.minus2_right);break;case e.RightTop:p.push(e.LeftBottom,e.RightBottom,o.minus2_left);break;case e.RightCenter:p.push(e.LeftCenter,e.RightCenter,o.minus2_left);break;case e.RightBottom:p.push(e.LeftTop,e.RightTop,o.minus2_left);break;case e.EndTop:p.push(e.EndBottom,e.EndTop,o.plus2_right);break;case e.EndCenter:p.push(e.EndCenter,e.EndCenter,o.zero);break;case e.EndBottom:p.push(e.EndTop,e.EndBottom,o.minus2_right);break;default:case e.BeginBottom:p.push(e.BeginTop,e.BeginBottom,o.minus2_right);break;}M.prototype.openBy.apply(m,p);this._writeAriaAttributes();if(this._isSplitButton()&&!D.system.phone){this._getButtonControl().setArrowState(true);}};f.prototype._handleActionPress=function(){var s=this._getLastSelectedItem(),o;if(!this.getUseDefaultActionOnly()&&s){o=sap.ui.getCore().byId(s);this.getMenu().fireItemSelected({item:o});}else{this.fireDefaultAction();}};f.prototype._menuClosed=function(){var o=this._getButtonControl(),O=o;if(this._isSplitButton()){o.setArrowState(false);O=o._getArrowButton();}O.$().removeAttr("aria-controls");};f.prototype._menuItemSelected=function(o){var m=o.getParameter("item");this.fireEvent("_menuItemSelected",{item:m});this._bPopupOpen=false;if(!this._isSplitButton()||this.getUseDefaultActionOnly()||!m){return;}this._lastActionItemId=m.getId();!!this._sDefaultText&&this.setText(m.getText());!!this._sDefaultIcon&&this.setIcon(m.getIcon());};f.prototype._getLastSelectedItem=function(){return this._lastActionItemId;};f.prototype._attachMenuEvents=function(){if(this.getMenu()){this.getMenu().attachClosed(this._menuClosed,this);this.getMenu().attachItemSelected(this._menuItemSelected,this);}};f.prototype._isSplitButton=function(){return this.getButtonMode()===b.Split;};f.prototype.setProperty=function(p,v,s){function i(t){var g=[d.Up,d.Back,d.Unstyled];return g.indexOf(t)!==-1;}if(p==="type"&&i(v)){return this;}if(p==='text'){this._sDefaultText=v;}switch(p){case'activeIcon':case'iconDensityAware':case'textDirection':case'enabled':this._getButtonControl().setProperty(p,v);break;}return C.prototype.setProperty.apply(this,arguments);};f.prototype.setTooltip=function(t){this._getButtonControl().setTooltip(t);return C.prototype.setTooltip.apply(this,arguments);};f.prototype.setText=function(v){B.prototype.setProperty.call(this,'text',v);this._getButtonControl().setText(v);return this;};f.prototype.setType=function(v){B.prototype.setProperty.call(this,'type',v);this._getButtonControl().setType(v);return this;};f.prototype.setIcon=function(v){B.prototype.setProperty.call(this,'icon',v);this._getButtonControl().setIcon(v);return this;};f.prototype.getFocusDomRef=function(){return this._getButtonControl().getDomRef();};f.prototype.onsapup=function(o){this.openMenuByKeyboard();};f.prototype.onsapdown=function(o){this.openMenuByKeyboard();};f.prototype.onsapupmodifiers=function(o){this.openMenuByKeyboard();};f.prototype.onsapdownmodifiers=function(o){this.openMenuByKeyboard();};f.prototype.onsapshow=function(o){this.openMenuByKeyboard();!!o&&o.preventDefault();};f.prototype.ontouchstart=function(){this._bPopupOpen=this.getMenu()&&this.getMenu()._getMenu()&&this.getMenu()._getMenu().getPopup().isOpen();};f.prototype.openMenuByKeyboard=function(){if(!this._isSplitButton()){this._handleButtonPress(true);}};f.prototype._writeAriaAttributes=function(){var o=this._getButtonControl(),O=this._isSplitButton()?o._getArrowButton():o,m=this.getMenu();if(m){O.$().attr("aria-controls",m.getDomRefId());}};f.prototype.getIdForLabel=function(){return this.getId()+"-internalBtn";};f.prototype._ensureBackwardsReference=function(){var i=this._getButtonControl(),I=i.getAriaLabelledBy(),r=L.getReferencingLabels(this);r.forEach(function(s){if(I&&I.indexOf(s)===-1){i.addAriaLabelledBy(s);}});return this;};return f;});
