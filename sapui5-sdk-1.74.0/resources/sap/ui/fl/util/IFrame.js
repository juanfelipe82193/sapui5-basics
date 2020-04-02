/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","sap/ui/core/Control","sap/ui/fl/Utils","sap/ui/model/json/JSONModel","sap/ui/core/library","./IFrameRenderer"],function(l,C,U,J){"use strict";function g(){var s=U.getUshellContainer();if(s){var u=s.getService("UserInfo");if(!u){return;}var o=u.getUser();if(!o){return;}var e=o.getEmail();var d=/@(.*)/.exec(e)[1];return{fullName:o.getFullName(),firstName:o.getFirstName(),lastName:o.getLastName(),email:e,domain:d};}}var I=C.extend("sap.ui.fl.util.IFrame",{metadata:{library:"sap.ui.fl",properties:{url:{type:"sap.ui.core.URI",group:"Misc",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"}},designtime:"sap/ui/fl/designtime/util/IFrame.designtime"},init:function(){if(C.prototype.init){C.prototype.init.apply(this,arguments);}var u=g()||{};this._oUserModel=new J(u);this.setModel(this._oUserModel,"$user");},exit:function(){if(this._oUserModel){this._oUserModel.destroy();delete this._oUserModel;}}});return I;});
