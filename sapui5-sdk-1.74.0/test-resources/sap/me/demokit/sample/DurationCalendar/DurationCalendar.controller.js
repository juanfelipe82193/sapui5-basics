sap.ui.controller("sap.me.sample.DurationCalendar.DurationCalendar", {
    onInit: function () {
    },

    changeToOneWeek: function () {
        var oCalendar = this.getView().byId("durationCalendar");
        oCalendar.setMonthsPerRow(1);
        oCalendar.setWeeksPerRow(1);
        oCalendar.setSingleRow(true);
    },

    changeToTwoWeeks: function () {
        var oCalendar = this.getView().byId("durationCalendar");
        oCalendar.setMonthsPerRow(1);
        oCalendar.setWeeksPerRow(2);
        oCalendar.setSingleRow(true);
    },

    changeToOneMonth: function () {
        var oCalendar = this.getView().byId("durationCalendar");
        oCalendar.setSingleRow(false);
        oCalendar.setMonthsToDisplay(1);
        oCalendar.setWeeksPerRow(1);
        oCalendar.setMonthsPerRow(1);
    },

    changeToTwoMonths: function () {
        var oCalendar = this.getView().byId("durationCalendar");
        oCalendar.setSingleRow(false);
        oCalendar.setMonthsToDisplay(2);
        oCalendar.setWeeksPerRow(1);
        oCalendar.setMonthsPerRow(2);
    }
});
