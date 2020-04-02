/*global QUnit */
QUnit.config.autostart = false;
sap.ui.require([
	"sap/ui/core/theming/Parameters",
	"test-resources/sap/viz/qunit/js/ColorPaletteParameters",
	"test-resources/sap/viz/qunit/controls/CommonUtil"
], function(Parameters, ColorPaletteParameters, CommonUtil) {

QUnit.module("Semantic Color Palette check");

function check(palette, theme) {
  for (var key in palette) {
    if (palette.hasOwnProperty(key)) {
      QUnit.assert.deepEqual(CommonUtil.unifyHexNotation(Parameters.get(key).toLowerCase()), palette[key].toLowerCase(),
        "color of " + key + " should be correct in " + theme);
    }
  }
}


QUnit.test("check parameters in sap_belize", function(assert) {

  var done = assert.async();
  sap.ui.getCore().attachInit(function() {
      check(ColorPaletteParameters.QUALITATIVE_PALETTE_BELIZE,"sap_belize");
      check(ColorPaletteParameters.SEMANTIC_PALETTE_BELIZE,"sap_belize");
      check(ColorPaletteParameters.SEQUENTIAL_PALETTE_BELIZE,"sap_belize");
      done();
  });
});

QUnit.test("check parameters in sap_belize_hcb", function(assert) {
    var done = assert.async();
    sap.ui.getCore().attachThemeChanged(changThemeHcbCb);
    sap.ui.getCore().applyTheme("sap_belize_hcb");

    function changThemeHcbCb(oEvent) {
      sap.ui.getCore().detachThemeChanged(changThemeHcbCb);

      check(ColorPaletteParameters.QUALITATIVE_PALETTE_BELIZE_HCB,"sap_belize_hcb");
      check(ColorPaletteParameters.SEMANTIC_PALETTE_BELIZE_HCB,"sap_belize_hcb");
      check(ColorPaletteParameters.SEQUENTIAL_PALETTE_BELIZE_HCB,"sap_belize_hcb");

      done();
    }
});

QUnit.test("check parameters in sap_belize_hcw", function(assert) {
    var done = assert.async();
    sap.ui.getCore().attachThemeChanged(changThemeHcwCb);
    sap.ui.getCore().applyTheme("sap_belize_hcw");

    function changThemeHcwCb(oEvent) {
      sap.ui.getCore().detachThemeChanged(changThemeHcwCb);

      check(ColorPaletteParameters.QUALITATIVE_PALETTE_BELIZE_HCW,"sap_belize_hcw");
      check(ColorPaletteParameters.SEMANTIC_PALETTE_BELIZE_HCW,"sap_belize_hcw");
      check(ColorPaletteParameters.SEQUENTIAL_PALETTE_BELIZE_HCW,"sap_belize_hcw");

      done();
    }
});

QUnit.start();

});
