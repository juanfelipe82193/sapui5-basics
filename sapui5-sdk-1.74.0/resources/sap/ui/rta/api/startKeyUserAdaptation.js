/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/RuntimeAuthoring","sap/ui/core/Element","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/Utils","sap/ui/core/UIComponent","sap/base/Log"],function(R,E,F,a,U,L){"use strict";function s(p){if(!(p.rootControl instanceof E)&&!(p.rootControl instanceof U)){return Promise.reject(new Error("An invalid root control was passed"));}return F.isKeyUser().then(function(i){if(!i){throw new Error("Key user rights have not been granted to the current user");}var r=p.rootControl;if(p.adaptWholeApp){r=a.getAppComponentForControl(p.rootControl);}var o=new R({rootControl:r,flexSettings:{developerMode:false,layer:"CUSTOMER"},validateAppVersion:true});o.attachEvent("stop",function(){o.destroy();});return o.start();}).catch(function(e){L.error("UI Adaptation could not be started",e.message);throw e;});}return s;});
