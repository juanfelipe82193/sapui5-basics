jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.me.sample.SelectionCalendar.SelectionCalendar", {
    onInit: function () {
        this.oModel = new sap.ui.model.json.JSONModel({selectedDates: []});
        this.getView().setModel(this.oModel);
    },

    changeToSingleSelectionMode: function () {
        var oCalendar = this.getView().byId("selectionCalendar");
        this._clearModel();
        oCalendar.unselectAllDates();
        oCalendar.setSelectionMode(sap.me.CalendarSelectionMode.SINGLE);
    },

    changeToRangeSelectionMode: function () {
        var oCalendar = this.getView().byId("selectionCalendar");
        this._clearModel();
        oCalendar.unselectAllDates();
        oCalendar.setSelectionMode(sap.me.CalendarSelectionMode.RANGE);
    },

    changeToMultiSelectionMode: function () {
        var oCalendar = this.getView().byId("selectionCalendar");
        this._clearModel();
        oCalendar.unselectAllDates();
        oCalendar.setSelectionMode(sap.me.CalendarSelectionMode.MULTIPLE);
    },

    onTapOnDate: function (oEvent) {
        sap.m.MessageToast.show("You tapped on " + oEvent.getParameters().date + " didSelect: " + oEvent.getParameters().didSelect);
        this._updateModel();
    },

    onChangeRange: function (oEvent) {
        sap.m.MessageToast.show("You selected a range of dates starting on: " + oEvent.getParameters().fromDate + " to: " + oEvent.getParameters().toDate);
        this._updateModel();
    },

    _updateModel: function () {
        var oCalendar = this.getView().byId("selectionCalendar");
        var aSelectedDates = oCalendar.getSelectedDates();
        var strDate;
        var oData = {selectedDates: []};
        if (aSelectedDates.length > 0) {
            for (var i = 0; i < aSelectedDates.length; i++) {
                strDate = aSelectedDates[i];
                oData.selectedDates.push({Date: strDate });
                // Because of potential issues due to DST and the time in the night at which the change happens,
                // the recommended way to instantiate a Date object is:
                // var oDate = sap.me.Calendar.parseDate(strDate);
                // Do not rely on anything lower than the day unit in this Date object.
                // Hours, minutes, seconds, milliseconds must not be taken into account.

                // Since you are reading this, the explanation why the hours must not be taken into account.
                // Change your computer's time zone to Brasilia (UTC-3)
                // Open your favorite browser and create a Date object for October 19th, 2014:
                // var oTheDayBefore = new Date(2014, 9, 19);
                // Display 'oTheDayBefore'.
            }
            this.oModel.setData(oData);
        } else {
            this._clearModel();
        }
    },

    _clearModel: function () {
        this.oModel.setData({selectedDates: []});
    }
});
