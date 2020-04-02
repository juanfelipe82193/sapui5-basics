/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/thirdparty/adaptivecards"],function(A){"use strict";function U(){A.TimeInput.apply(this,arguments);}U.prototype=Object.create(A.TimeInput.prototype);U.prototype.internalRender=function(){var e=A.TimeInput.prototype.internalRender.apply(this,arguments);e.classList.add("sapMInputBaseInner");e.classList.add("sapMInputBaseContentWrapper");this._inputControlContainerElement.classList.add("sapMInputBase");return e;};return U;});
