jQuery.sap.require("sap.ca.ui.utils.Lessifier");
window.addEventListener("load", function () {

    var MYVAR_VALUE = "#000000";
    var CUSTOM_VARIABLES = {
        "myVar": MYVAR_VALUE
    };
    var fnOriginalThemingParametersGet = sap.ui.core.theming.Parameters.get;

    module("Duck punching sap.ui.core.theming.Parameters.get", {
        setup: function () {
            // Duck punching sap.ui.core.theming.Parameters.get to allow the qunits to retrieve
            // a variable with a particular value without modifying the library.
            sap.ui.core.theming.Parameters.get = function (sName) {
                if (CUSTOM_VARIABLES.hasOwnProperty(sName)) {
                    return CUSTOM_VARIABLES[sName];
                }
                return fnOriginalThemingParametersGet(sName);
            };
        },
        teardown: function () {
            sap.ui.core.theming.Parameters.get = fnOriginalThemingParametersGet;
        }
    });

    function getLessifiedDomElement(sModuleName) {
        var aNodes = jQuery("head").find("#" + sModuleName + "-less-css");
        var node = null;
        if (aNodes.length === 1) {
            node = aNodes[0];
        }

        return (node !== null) ? jQuery(node) : null;
    }

    function getQUnitCssPath(sName) {
        return "/../../test-resources/sap/ca/ui/qunit/utils/lessifier_css/" + sName;
    }

// function getCssContent(sName) {
//     return jQuery.ajax({url: getQUnitCssPath(sName), async: false}).responseText;
// }

    /**
     * Given a css file, this function returns a map of all <name, value> entries.
     * WARNING: this assumes that all the names are unique.
     * @param {string} sContent the CSS file, lessified or not.
     * @returns {object} Map of all name, value entries.
     */
    function getCssMap(sContent) {
        // This regexp will match the lines that look like: "testXXX : someValue;"
        // test<number> <colon> <value> <semi colon> [global, multi line]
        // test will be in group 1, value in group 2.
        var regexp = /^\s*(test\d+)\s*:\s*(.+)\s*;\s*$/mg;
        var matches;
        var cssMap = {};

        while ((matches = regexp.exec(sContent)) != null) {
            if (matches.index === regexp.lastIndex) {
                regexp.lastIndex++;
            }
            var name = matches[1];
            var value = matches[2];
            cssMap[name] = value;
        }

        return cssMap;
    }

    /**
     * Compares 2 maps, first level properties only - no depth.
     * Both maps must have the same properties and the same value for each property.
     * @param {object} oMap1 First map
     * @param {object} oMap2 Second map
     * @returns {boolean}
     */
    function areMapsIdentical(oMap1, oMap2) {
        var fnCompareMaps = function (m1, m2) {
            var propertyName;
            for (propertyName in m1) {
                if (m2.hasOwnProperty(propertyName)) {
                    if (m1[propertyName] !== m2[propertyName]) {
                        jQuery.sap.log.error("Property " + propertyName + " does not have the same value in both maps: " + m1[propertyName] + " / " + m2[propertyName]);
                        return false;
                    }
                } else {
                    jQuery.sap.log.error("Property " + propertyName + " is not available in both maps!");
                    return false;
                }
            }
            return true;
        };

        return fnCompareMaps(oMap1, oMap2) && fnCompareMaps(oMap2, oMap1);
    }

    test("1. Non Existing css", function () {
        var sModuleName = "test1";
        sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, "this_file_does_not_exist.css", false);
        var $style = getLessifiedDomElement(sModuleName);
        // There should be no style tag created for a non existing CSS file.
        strictEqual($style, null, "No lessify processing expected for non existing css file");

        // true less
        sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, "this_file_does_not_exist.css", true);
        $style = getLessifiedDomElement(sModuleName);
        // There should be no style tag created for a non existing CSS file.
        strictEqual($style, null, "No lessify processing expected for non existing css file");
    });

    test("2. css with all rules ok", function () {
        var fnTest2exec = function (sModuleName, bUseTrueLess) {
            // Contains sample 1 from Thilo's email
            sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("all_ok.css"), bUseTrueLess);
            var $style = getLessifiedDomElement(sModuleName);
            ok($style != null, "Processed CSS should exist");

            var expectedResults = {
                "test1": MYVAR_VALUE,
                "test2": bUseTrueLess ? "#e6e6e6" : "darken(#FFF, 10)",
                "test3": "123456",
                "test4": bUseTrueLess ? MYVAR_VALUE : "darken(" + MYVAR_VALUE + ", 10)",
                "test5": MYVAR_VALUE,
                "test6": bUseTrueLess ? MYVAR_VALUE : "darken(" + MYVAR_VALUE + ", 20)"
            };
            ok(areMapsIdentical(getCssMap($style.html()), expectedResults), "Processed CSS map should match the expected CSS map");
        };

        fnTest2exec("test2a", false);
        fnTest2exec("test2b", true);
    });

    test("3a. css with non declared parameter - false less", function () {
        var sModuleName = "test3a";
        // Contains sample 2 from Thilo's email
        sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("not_ok.css"), false);
        var $style = getLessifiedDomElement(sModuleName);
        ok($style != null, "Processed CSS should exist");

        var expectedResults = {
            "test1": "@sapParameterThatCannotBeFoundViaApi",
            "test2": "lighten(@sapParameterThatCannotBeFoundViaApi, 10)",
            "test3": MYVAR_VALUE
        };
        ok(areMapsIdentical(getCssMap($style.html()), expectedResults), "Processed CSS map should match the expected CSS map");
    });

    test("3b. css with non declared parameter - true less", function () {
        var sModuleName = "test3b";
        // Contains sample 2 from Thilo's email
        sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("not_ok.css"), true);
        var $style = getLessifiedDomElement(sModuleName);
        ok($style != null, "Processed CSS should exist");

        var expectedResults = {
            "test1": sap.ca.ui.utils.Lessifier.DEFAULT_COLOR,
            // test2: this value is most likely less transforming our DEFAULT_COLOR #fff into #ffffff
            "test2": "#ffffff",
            "test3": MYVAR_VALUE
        };
        ok(areMapsIdentical(getCssMap($style.html()), expectedResults), "Processed CSS map should match the expected CSS map");
    });

    test("4. Special non replaceable parameters", function () {
        var fnTest4exec = function (sModuleName, bUseTrueLess) {
            var msgPrefix = " - " + (bUseTrueLess ? "using true less" : "not using true less");

            // Contains sample 3, 4 and 5 from Thilo's email
            sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("specials.css"), bUseTrueLess);
            var $style = getLessifiedDomElement(sModuleName);
            ok($style != null, "Processed CSS should exist");

            var css = $style.html();
            var index;

            // media must be found twice
            ok((index = css.indexOf("@media")) !== -1, "first @media not found" + msgPrefix);
            ok((index = css.indexOf("@media", index + 1)) !== -1, "second @media not found" + msgPrefix);
            ok(css.indexOf("@media", index + 1) === -1, "a third @media was found!" + msgPrefix);

            // webkit-keyframes must be found twice
            ok((index = css.indexOf("@-webkit-keyframes")) !== -1, "first @-webkit-keyframes not found" + msgPrefix);
            ok((index = css.indexOf("@-webkit-keyframes", index + 1)) !== -1, "second @-webkit-keyframes not found" + msgPrefix);
            ok(css.indexOf("@-webkit-keyframes", index + 1) === -1, "a third @-webkit-keyframes was found!" + msgPrefix);

            // Check that the following CSS at-rules are found once
            var aAtRules = ["@font-face", "@see", "@keyframes", "@import", "@charset", "@document", "@page", "@supports"];
            var i;
            for (i = 0; i < aAtRules.length; i++) {
                index = css.indexOf(aAtRules[i]);
                ok(index !== -1, aAtRules[i] + " not found" + msgPrefix);
                // ensure the at-rule is only found once.
                ok(css.indexOf(aAtRules[i], index + 1) === -1, aAtRules[i] + " was found again" + msgPrefix);
            }
        };
        fnTest4exec("test4a", false);
        fnTest4exec("test4b", true);
    });

    test("5. Suite css", function () {
        var fnTest5exec = function (sModuleName, bUseTrueLess) {
            var msgPrefix = " - " + (bUseTrueLess ? "using true less" : "not using true less");

            sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("suite.css"), bUseTrueLess);
            var $style = getLessifiedDomElement(sModuleName);
            ok($style != null, "Processed CSS should exist");
            //jQuery.sap.log.error($style.html());
            var css = $style.html();
            // some of the parameters that should not be found in the processed css
            var aParameters = ["@sapUiDarkText", "@sapUiLightBG", "@sapUiLightBorder", "@myVar"];
            var i, index;
            for (i = 0; i < aParameters.length; i++) {
                index = css.indexOf(aParameters[i]);
                ok(index === -1, aParameters[i] + " was found!" + msgPrefix);
            }
        };
        fnTest5exec("test5a", false);
        fnTest5exec("test5b", true);
    });

    test("6. Never works", function () {
        var sModuleName = "test6";
        try {
            // contains sample 6 from Thilo's email
            sap.ca.ui.utils.Lessifier.lessifyCSS(sModuleName, getQUnitCssPath("never_works.css"), true);
        } catch (ex) {
            ok(ex.message === sap.ca.ui.utils.Lessifier.DEFAULT_COLOR + " is undefined", "");
        }
        var $style = getLessifiedDomElement(sModuleName);
        ok($style === null, "Processed CSS should not exist due to error in CSS.");
    });
});
