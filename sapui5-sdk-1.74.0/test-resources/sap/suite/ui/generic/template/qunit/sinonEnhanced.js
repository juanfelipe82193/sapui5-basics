sap.ui.define(["sap/ui/thirdparty/sinon", "sap/ui/thirdparty/sinon-qunit", "sap/base/util/extend"], function(sinon, sinonQunit, extend) {
	"use strict";

	/* This class provides an enhanced version of the sinon-utility. The only difference to the original sinon functionality is,
	 * that spy(object, "method") and stub(object, "method") also provide a spy resp. a stub, when object does not have a method
	 * with the given name.
	 */
	function modifySinon(oSinon, sFunc) {
		var fnOriginal = oSinon[sFunc];
		oSinon[sFunc] = function() {
			var oPossessor = arguments[0];
			var sMethodname = arguments[1];
			if (!oPossessor || !sMethodname || oPossessor[sMethodname]) {
				return fnOriginal.apply(this, arguments);
			}
			oPossessor[sMethodname] = Function.prototype;
			var oSpy = fnOriginal.apply(this, arguments);
			var fnRestore = oSpy.restore;
			oSpy.restore = function() {
				fnRestore();
				delete oPossessor[sMethodname];
			};
			return oSpy;
		};
	}

	var oRet = extend({}, sinon);
	modifySinon(oRet, "spy");
	modifySinon(oRet, "stub");
	oRet.sandbox = extend({}, sinon.sandbox);
	oRet.sandbox.create = function() {
		var oSandbox = sinon.sandbox.create();
		modifySinon(oSandbox, "spy");
		modifySinon(oSandbox, "stub");
		return oSandbox;
	};
	return oRet;
});
