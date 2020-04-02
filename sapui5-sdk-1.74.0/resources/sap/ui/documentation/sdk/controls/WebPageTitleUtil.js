/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var W=E.extend("sap.ui.documentation.sdk.controls.WebPageTitleUtil",{metadata:{properties:{title:{type:"string",defaultValue:''}}}});W.prototype.setTitle=function(t){if(t){document.title=t;this.setProperty("title",t,true);}return this;};return W;});
