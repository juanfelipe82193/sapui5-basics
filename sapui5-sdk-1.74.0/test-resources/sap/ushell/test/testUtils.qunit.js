sap.ui.require([
    "sap/ushell/utils",
    "sap/ushell/testUtils"
], function (utils, testUtils) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap/ushell/testUtils", {
        setup: {
        },
        teardown: {
        }
    });

    [
        {
            oObject: { a: { b: "123" } },
            sPath: "a/b/c",
            vValue: "doesnt_matter",
            expectedObject: { a: { b: "123" } },
            expectedThrows: "Invalid path. Please ensure path starts with '/'"
        },
        {
            oObject: { a: { b: "123" } },
            sPath: "/a/b",
            vValue: "456",
            expectedObject: { a: { b: "456" } }
        },
        {
            oObject: { a: { b: "123" } },
            sPath: "/a/d",
            vValue: "456",
            expectedObject: { a: { b: "123", d: "456"} }
        },
        {
            oObject: { },
            sPath: "/newKey/newValue",
            vValue: "123",
            expectedObject: { newKey: { newValue: "123" } }
        },
        {
            oObject: { },
            sPath: "/",
            vValue: "123",
            expectedObject: { "": "123" }
        },
        {
            oObject: { a: { b: 1 } },
            sPath: "/a/b/d",  // overwrites b: 1 setting b to an object instead
            vValue: 123,
            expectedObject: { a: { b: { d: 123 } } }
        },
        {
            oObject: { array: [1,2,3] },
            sPath: "/array/1",
            vValue: 10,
            expectedObject: { array: [1, 10, 3] }
        },
        {
            oObject: [1, 2, 3],
            sPath: "/1/say",
            vValue: "hi",
            expectedObject: [1, { say: "hi" }, 3]
        },
        {
            oObject: [1, 2, 3],
            sPath: "/hello",
            vValue: "hi",
            expectedObject: [1, 2, 3],
            expectedThrows: "Invalid array index 'hello' provided in path '/hello'"
        },
        {
            oObject: [1, [ { a: [1] }], 3],
            sPath: "/1/a/key",
            vValue: "hi",
            expectedObject: [1, [ { a: [1] }], 3],
            expectedThrows: "Invalid array index 'a' provided in path '/1/a/key'"
        }
    ].forEach(function (oFixture) {
        QUnit.test("setObjectValue for path " + oFixture.sPath, function (assert) {
            var vClone = utils.clone(oFixture.oObject);

            try {
                testUtils.setObjectValue(vClone, oFixture.sPath, oFixture.vValue);
                assert.ok(!oFixture.expectedThrows, "no exception thrown");
            } catch (oException) {
                assert.ok(!!oFixture.expectedThrows, "exception thrown. DEBUG: " + oException.message);
                if (oFixture.expectedThrows) {
                    assert.strictEqual(oException.message, oFixture.expectedThrows, "got expected exception message");
                }
            }

            assert.deepEqual(vClone, oFixture.expectedObject, "object was changed as expected");
        });
    });

    [
        {
            testDescription: "empty object + no properties given",
            oObject: {},
            oProperties: {},
            expectedObject: {}
        },
        {
            testDescription: "empty object + properties given",
            oObject: {},
            oProperties: {
                "/a/b/c": 123,
                "/a/b/d": 456
            },
            expectedObject: {
                a: { b: { c: 123, d: 456 } }
            }
        },
        {
            testDescription: "empty object and properties are given",
            oObject: {},
            oProperties: {
                "/a/b/c": 123,
                "/a/b/d": 456
            },
            expectedObject: {
                a: { b: { c: 123, d: 456 } }
            }
        },
        {
            testDescription: "collapsing properties given",
            oObject: {},
            oProperties: {
                "/a/b/d/e": 123,  // longest path takes precedence
                "/a/b/d": 456,    // ignored because is contained
                "/a/b": 789       // ignored because is contained
            },
            expectedObject: {
                a: { b: { d: { e: 123 } } }
            }
        },
        {
            testDescription: "containing but non-overlapping properties given",
            oObject: {},
            oProperties: {
                "/a/b/d/e": 123,
                "/b/d": 456
            },
            expectedObject: {
                a: { b: { d: { e: 123 } } },
                b: { d: 456 }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("overrideObject works as expected when " + oFixture.testDescription, function (assert) {
            var oClone = utils.clone(oFixture.oObject);

            var oOverriddenObject = testUtils.overrideObject(oClone, oFixture.oProperties);

            assert.deepEqual(oOverriddenObject, oFixture.expectedObject, "object was changed as expected");
        });
    });

});
