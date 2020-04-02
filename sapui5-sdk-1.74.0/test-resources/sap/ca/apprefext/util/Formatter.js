jQuery.sap.declare("i2d.qm.qualityissue.confirm.apprefExt.util.Formatter");
jQuery.sap.require("i2d.qm.qualityissue.confirm.appref.util.Formatter");

//overrides of one of the existing formatter only
// (other formatter functions and properties are working as defined in the base appref app)
i2d.qm.qualityissue.confirm.appref.util.Formatter.StatusState =  function (value) {
    return "Success";   //always return Success in the extension app
};

i2d.qm.qualityissue.confirm.apprefExt.util.Formatter = {

    CompletedOnDesign :  function (sValue) {
        var design = "Standard";

        if (sValue === "") {
            design = "Bold";
        }

        return design;
    }
};