jQuery.sap.require("sap.ca.ui.model.type.Date");

sap.ui.controller("sap.ca.ui.sample.views.control.DatePicker", {

    onInit : function() {
        var page = this.getView().byId("page");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.DATE_PICKER, "sap.ca.ui.DatePicker");

        // Databinding
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({
            modelDateValue : new Date(1330470000000),
            modelDateValue1 : new Date(1379055600000),
            modelDateValue2 : new Date(1341903600000),
            modelDateValue3 : new Date(1384070500000),
            modelDateValue4 : new Date(1384070600000)
        });
        //sap.ui.getCore().setModel(oModel);

        page.setModel(oModel);

        this.oPicker = this.byId('myDatePicker');
        this.oText = this.byId("TextView1");
        var oText3 = this.byId("TextView3");
        this.iEvents = 0;

        var showEventProperties = this.eventParametersToString;

        // Binding Parse Error
        sap.ui
        .getCore()
        .attachParseError(
                function(oEvent) {
                    var oElement = oEvent
                            .getParameter("element");

                    var oValue = oEvent.getParameter('newValue');

                    oText3.setText("ParseError: Entered value: "
                                    + showEventProperties(oEvent));
                    // oText3.setValueState(sap.ui.core.ValueState.Error);

                    if (oElement.setValueState) {
                        oElement.setValueState(sap.ui.core.ValueState.Error);
                    }
                });

        // Binding Validation Success
        sap.ui
            .getCore()
            .attachValidationSuccess(
                    function(oEvent) {
                        var oElement = oEvent
                                .getParameter("element");

                        var oValue = oEvent.getParameter('newValue');

                        oText3.setText("ValidationSuccess: Entered value: "
                                        + showEventProperties(oEvent));
                        //oText3.setValueState(sap.ui.core.ValueState.Success);

                        if (oElement.setValueState) {
                            oElement.setValueState(sap.ui.core.ValueState.Success);
                        }
                    });

        // Datepicker in Popup Dialog
        this.oDialog = this.byId("DPDialog");

        this.displayMyDatePickerAttributes();
    },

    // START OF DIALOG for Datepicker in Popup Dialog
    openDialog : function() {
        var oModel = this.getView().byId("page").getModel();

        // Use /modelDateValue4 as temporary dialog value holder
        oModel.setProperty("/modelDateValue4", oModel.getProperty("/modelDateValue"));
        this.oDialog.open();
        this.getView().updateBindings(true);
    },

    // press on button in Datepicker Popup Dialog
    pressDPDialog : function(oEvent) {
        var oModel = this.getView().byId("page").getModel();
        this.oDialog.close();

        if (this.byId("dlgButOK") == oEvent.oSource) { // on OK
            // On OK button press save dialog value /modelDateValue4 into /modelDateValue
            oModel.setProperty("/modelDateValue", oModel.getProperty("/modelDateValue4"));
        } else { // on Cancel
            // restore /modelDateValue4 from /modelDateValue
            oModel.setProperty("/modelDateValue4", oModel.getProperty("/modelDateValue"));
        }
        this.getView().updateBindings(true);
    },

    //Event handler for DatePicker change
    handleChange : function(oEvent) {

        if (oEvent
                .getParameter("invalidValue")) {
            oEvent.oSource
                    .setValueState(sap.ui.core.ValueState.Error);
            //this.oText.setValueState(sap.ui.core.ValueState.Error);
        } else {
            oEvent.oSource
                    .setValueState(sap.ui.core.ValueState.Success);
            //this.oText.setValueState(sap.ui.core.ValueState.Success);
        }
        this.iEvents++;

        this.oText
                .setText("Eventcounter: "
                        + this.iEvents + ". "
                        + this.eventParametersToString(oEvent));

        this.displayMyDatePickerAttributes();
    },

    eventParametersToString : function(oEvent) {
        var oParameters = oEvent.getParameters();

        var strParameters = "";
        var parameter;
        for (parameter in oParameters) {
            if (oParameters.hasOwnProperty(parameter)) {
                strParameters = strParameters + parameter + "='" + oParameters[parameter] + "' ";
            }
        }

        return strParameters;
    },


    liveChangeOffset : function(oEvent) {
        var sValue = oEvent.mParameters.newValue;
        this.oPicker.setFirstDayOffset(parseInt(sValue, 10));

        this.displayMyDatePickerAttributes();
    },

    displayMyDatePickerAttributes : function() {
        var oProperties = this.oPicker.mProperties;
        var strProperties = "";

        for (var property in oProperties) {
            if (oProperties.hasOwnProperty(property)) {
                strProperties = strProperties + property + "='" + oProperties[property] + "' ";
            }
        }

        this.byId("TextView2").setText(strProperties);
    },

    resetMyDatePicker : function() {
        this.oPicker.setDateValue();
        this.oPicker.setValue();
        this.oPicker.fireChange(true);

    }

});
