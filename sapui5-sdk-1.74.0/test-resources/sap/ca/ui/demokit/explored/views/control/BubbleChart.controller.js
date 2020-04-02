jQuery.sap.require("sap.ca.ui.charts.ChartPopover");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.ca.ui.sample.views.control.BubbleChart", {

    onInit:function () {
        this.isMultiSelection = true;
        var page = this.getView().byId("pageBubble");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.BUBBLE_CHART);

        // dateDiffInDays contains the difference in days compared to today ; positive: in the future, negative: in the past.
        // The _modifyDates will add the "date" property based on the "dateDiffInDays" property.
        var oData = this.createData(0);

        oData.businessData = this._modifyDates(oData.businessData);

        this._oModel = new sap.ui.model.json.JSONModel();
        this._oModel.setData(oData);
        this.getView().setModel(this._oModel);

        this.oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions:[
                {axis:1, name:'Country', value:"{Country}"},
                {axis:1, name:'City', value:"{City}"}
            ],
            measures:[
                {group:1, name:'Date', value:{path:'date', formatter:this._formatMeasureValue}},
                {group:2, name:'Profit', value:'{profit}'},
                {group:3, name:'Revenue', value:'{revenue}'}
            ],
            data:{
                path:"/businessData"
            }
        });
        this.xAxisFormatString = "xAxis Label";
        this.aTooltipFormatString = ["xAxis Tooltip"];
        this.byId("myChart").setXAxisFormatFunction(jQuery.proxy(this.xAxisFormatter, this));
        this.byId("myChart").setXAxisFormatString(this.xAxisFormatString);
        this.byId("myChart").setAxisTooltipFormatString(this.aTooltipFormatString);
        // set the x axis scale
        this.byId("myChart").setXAxisFixedRange(true);
        this.byId("myChart").setXAxisMinValue(-100);
        this.byId("myChart").setXAxisMaxValue(150);

        this.byId("myChart").setLabelProperty(["label", "revenue"]);
        this.byId("myChart").setDataset(this.oDataset);
        this.byId("myChart").setTitle("Test Bubble Chart");

        this.oPopoverList = new sap.ca.ui.charts.ClusterList();
        var oCustHeader = new sap.m.Bar({
            contentMiddle:[new sap.m.Label({text:"Custom Popover"})],
            contentRight:[new sap.m.Button({icon:"sap-icon://decline", press:jQuery.proxy(this.onClosePopover, this)})
            ]});

        this.oPopover = new sap.ca.ui.charts.ChartPopover({
            modal:false,
            enableScrolling:true,
            verticalScrolling:true,
            horizontalScrolling:false,
            content:[ this.oPopoverList.getControl() ],
            customHeader:oCustHeader
        });

        this.bResetList = true;


    },

    _formatMeasureValue:function (v) {
        var vv = ((new Date(parseInt(v, 10)).getTime() - Date.now()) / 1000 / 3600 / 24).toFixed(2);
        jQuery.sap.log.debug(v + "|> " + vv);
        return vv;
    },

    _modifyDates:function (aData) {
        var i;
        for (i = 0; i < aData.length; i++) {
            var diff = aData[i].dateDiffInDays;
            // use dateDiffInDays to create date
            aData[i].date = new Date(Date.now()).setDate(diff);
        }

        return aData;
    },

    xAxisFormatter:function (v, p) {
        jQuery.sap.require("sap.ui.core.format.DateFormat");
        if (p == this.xAxisFormatString || p == this.aTooltipFormatString[0]) {
            v = v.toFixed(0);
            if (v < 0) {
                return v + " days ago";
            }
            else if (v > 0) {
                return "in " + v + " days";
            }
            else {
                return "today";
            }
        } else {
            return v;
        }
    },

    onClosePopover:function () {
        this.oPopover.close();
        this.bResetList = false;
    },

    pressSampleDataChange:function (oEvent) {
        var oData = {
            businessData:[
                {Country:"Canada", revenue:1410.87, profit:-141.25, population:347890008, dateDiffInDays:10},
                {Country:"China", revenue:3338.29, profit:133.82, population:1339724852, dateDiffInDays:20},
                {Country:"France", revenue:987.66, profit:348.76, population:1339724852, dateDiffInDays:-60},
                {Country:"Germany", revenue:2170.23, profit:417.29, population:81799600, dateDiffInDays:120},
                {Country:"India", revenue:6170.93, profit:517.00, population:1210193424, dateDiffInDays:40},
                {Country:"United States", revenue:1005.08, profit:609.16, population:313490000, dateDiffInDays:-2},
                {Country:"US", revenue:490.87, profit:-141.25, population:34789000, dateDiffInDays:0}
            ]
        };

        oData.businessData = this._modifyDates(oData.businessData);

        this._oModel.setData(oData);
    },
    pressLegendButton:function (oEvent) {
        var state = oEvent.getParameters().selected;
        var chart = this.byId("myChart");
        chart.setShowLegend(state);
    },
    pressSwitchButton:function (oEvent) {
        this.isMultiSelection = !this.isMultiSelection;
        if (this.isMultiSelection) {
            this.byId("myChart").setSelectionMode(sap.ca.ui.charts.ChartSelectionMode.Multiple);
            sap.m.MessageToast.show("Multiple selection mode", { "duration":100000 });
        } else {
            this.byId("myChart").setSelectionMode(sap.ca.ui.charts.ChartSelectionMode.Single);
            sap.m.MessageToast.show("Single selection mode", { "duration":100000 });
        }
    },
    changeMinimumLabelBubbleSize:function (oEvent) {
        var newSize = oEvent.getParameters().value;
        this.byId("myChart").setMinimumLabelSize(newSize);
    },
    pressToday:function (oEvent) {
        this.byId("myChart").drawVerticalLineAt(0, "Today");
    },
    createData:function (e) {
        var params = jQuery.sap.getUriParameters().mParams;
        var aData = [];
        var count = 100;
        if (!!params && !!params["count"]) {
            e = 1;
            count = parseInt(params["count"], 10);
            jQuery.sap.log.error("Count parameter detected: " + count);

        }
        switch (e) {
            case 1:
                for (var i = 0; i < count; i++) {
                    aData.push({
                        Country: "Country" + i,
                        City: "City" + i,
                        revenue: Math.random() * 100000,
                        profit: Math.random() * 10000 - 5000,
                        dateDiffInDays: Math.floor(Math.random() * 250 - 100),
                        label: "Label" + i
                    });
                }
                return { businessData: aData };
            default:
                return { businessData:[
                    {Country:"Canada", City:"Toronto", revenue:1410.87, profit:-141.25, dateDiffInDays:10, label:"Canada Label"},
                    {Country:"China", City:"Shanghai", revenue:3338.29, profit:133.82, dateDiffInDays:10, label:"China Label"},
                    {Country:"France", City:"Paris", revenue:987.66, profit:348.76, dateDiffInDays:60, label:"France Label"},
                    {Country:"Germany", City:"Berlin", revenue:2170.23, profit:417.29, dateDiffInDays:-120, label:"Germany Label"},
                    {Country:"India", City:"Delhi", revenue:6170.93, profit:517.00, dateDiffInDays:10, label:"India Label"},
                    {Country:"Ireland", City:"Galway", revenue:1370.93, profit:167.00, dateDiffInDays:-80, label:"IR LAbel"},
                    {Country:"United States", City:"Texas", revenue:1005.08, profit:609.16, dateDiffInDays:-20, label:"States label"},
                    {Country:"United States", City:"NY", revenue:490.87, profit:-141.25, dateDiffInDays:-30, label:"US Label"},
                    {Country:"Spain", City:"Madrid", revenue:4705.23, profit:217.29, dateDiffInDays:-40, label:"Spain Label"},
                    {Country:"Spain", City:"Barcelona", revenue:905.08, profit:659.16, dateDiffInDays:-60, label:"IN Label"}
                ]};
        }
    }
});
