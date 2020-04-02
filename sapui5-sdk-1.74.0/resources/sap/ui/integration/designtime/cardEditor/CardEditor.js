/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/BaseEditor","./config/index"],function(B,d){"use strict";var C=B.extend("sap.ui.integration.designtime.cardEditor.CardEditor",{constructor:function(){B.prototype.constructor.apply(this,arguments);this.addDefaultConfig(d);},renderer:B.getMetadata().getRenderer()});return C;});
