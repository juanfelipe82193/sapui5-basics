/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/format/NumberFormat'],function(N){"use strict";var D=function(){this.aSupportedSemantics=["currency-code",undefined];this.oSemanticsFormatterMap=_();};D.prototype.constructor=D;function _(){var s=new Map();s.set("currency-code",a);s.set(undefined,b);return s;}function a(m,o){var c=N.getCurrencyInstance();return c.format(o);}function b(m,o,p){var f=N.getFloatInstance({style:'standard',minFractionDigits:p});return f.format(o);}D.prototype.getFormattedValue=function(m,o,p){var s;if(this.aSupportedSemantics.indexOf(m["semantics"])!==-1){s=m["semantics"];}return this.oSemanticsFormatterMap.get(s).call(self,m,o,p);};return D;},true);
