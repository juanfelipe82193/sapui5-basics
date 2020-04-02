/**
 * Main method to be executed once SAPUI5 has been initialized.
 */
function main() {
    "use strict";
    // load and register Fiori2 icon font
    if (sap.ui.Device.os.ios) {
        jQuery.sap.setIcons({
            'phone': '../../../../../resources/sap/ushell/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png',
            'phone@2': '../../../../../resources/sap/ushell/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png',
            'tablet': '../../../../../resources/sap/ushell/themes/base/img/launchicons/72_iPad_Desktop_Launch.png',
            'tablet@2': '../../../../../resources/sap/ushell/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png',
            'favicon': '../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico',
            'precomposed': true
        });
    } else {
        jQuery.sap.setIcons({
            'phone': '',
            'phone@2': '',
            'tablet': '',
            'tablet@2': '',
            'favicon': '../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico',
            'precomposed': true
        });
    }

    sap.ui.require(["sap/ushell/iconfonts"], function (iconFonts) {
        iconFonts.registerFiori2IconFont();
    });

    sap.ushell.Container.createRenderer("fiori2", true)
        .then(function (oContent) {
            oContent.placeAt("canvas");
        });

    jQuery(document).keydown(function (e) {
        //CTRL + ALT +  G keydown combo
        if (e.ctrlKey && e.altKey && e.keyCode === 71) {
            jQuery("#dbg_grid_overlay").toggle();
        }
    });
}