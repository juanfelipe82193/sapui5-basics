jQuery.sap.declare("i2d.qm.qualityissue.confirm.appref.util.Formatter");


i2d.qm.qualityissue.confirm.appref.util.Formatter = {

    _statusStateMap : {
        "New" : "None",
        "In Process" : "Warning",
        "Completed": "Success"
    },

    StatusState :  function (value) {

        var returnState = "Warning";

        if  (value && i2d.qm.qualityissue.confirm.appref.util.Formatter._statusStateMap[value]) {
            returnState = i2d.qm.qualityissue.confirm.appref.util.Formatter._statusStateMap[value];
        }

        return returnState;
    }
};