sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require(
            [
                "sap/rules/ui/parser/infrastructure/locale/lib/resourceBundleContext",
                "sap/ui/thirdparty/sinon",
                "sap/ui/thirdparty/sinon-qunit"
            ],
            function (resourceBundleContext)
            {
                QUnit.test("Should return the translated messages", function (assert)
                {
                    "use strict";
                    // System under test
                    var arr = [];
                    arr.push("1st parameter");
                    arr.push("2nd parameter");
                    var fnIsolatedFormatter = resourceBundleContext.lib.getString.bind();
                    // Assert
                    assert.strictEqual(fnIsolatedFormatter(17, arr, "i18n.messages_descriptions"), "Resource activation is not possible; combination of 1st parameter and 2nd parameter is not valid", "Text in English with 2 parameters, messages_descriptions file");
                    assert.strictEqual(fnIsolatedFormatter(-1, null, "i18n.messages_descriptions"), -1, "Code isn't exist, messages_descriptions file");
                    assert.strictEqual(fnIsolatedFormatter(16, arr, "i18n.messages_descriptions"), "Resource activation is not possible; value of attribute 1st parameter is not valid", "Non-exists language - result in English as default, messages_descriptions file");
                    assert.strictEqual(fnIsolatedFormatter(1000, [], "i18n.op_messages_descriptions"), "Validate success", "Text in English with 2 parameters, op_messages_descriptions file");
                    assert.strictEqual(fnIsolatedFormatter(-1, null, "i18n.op_messages_descriptions"), -1, "Code isn't exist, messages_descriptions file, op_messages_descriptions file");
                });
            });
});