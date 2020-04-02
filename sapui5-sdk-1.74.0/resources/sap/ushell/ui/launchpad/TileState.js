/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/ui/core/Control','sap/ushell/library','sap/ui/core/Icon','sap/ushell/resources','./TileStateRenderer'],function(C,l,I,r){"use strict";var T=C.extend("sap.ushell.ui.launchpad.TileState",{metadata:{library:"sap.ushell",properties:{state:{type:"string",group:"Misc",defaultValue:'Loaded'}}}});T.prototype.init=function(){this._rb=r.i18n;this._sFailedToLoad=this._rb.getText("cannotLoadTile");this._oWarningIcon=new I(this.getId()+"-warn-icon",{src:"sap-icon://notification",size:"1.37rem"});this._oWarningIcon.addStyleClass("sapSuiteGTFtrFldIcnMrk");};T.prototype.exit=function(){this._oWarningIcon.destroy();};T.prototype.setState=function(s,i){this.setProperty("state",s,i);return this;};return T;});
