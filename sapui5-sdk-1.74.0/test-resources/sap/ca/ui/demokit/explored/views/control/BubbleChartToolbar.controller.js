sap.ui.controller("sap.ca.ui.sample.views.control.BubbleChartToolbar", {
				   
    onInit : function() {
        var page = this.getView().byId("pageBubbleToolBar");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.BUBBLE_CHART_TOOLBAR);

        this.chart = this.byId("myBubleChartWithToolBar");

       var oData = {
  		        businessData: [{
  		          Country: "Canada",
  		          revenue: 1410.87,
  		          profit: -141.25,
  		          date: 1379421492000,
  		          label:"Canada Label"
  		        }, {
  		          Country: "China",
  		          revenue: 3338.29,
  		          profit: 133.82,
  		          date: 1379422492000,
  		          label:"China Label"  		          
  		        }, {
  		          Country: "France",
  		          revenue: 987.66,
  		          profit: 348.76,
  		          date: 1387422592000,
  		          label:"France Label"
  		        }, {
  		          Country: "Germany",
  		          revenue: 2170.23,
  		          profit: 417.29,
  		          date: 1369422492000,
  		          label:"Germany Label"
  		        }, {
  		          Country: "India",
  		          revenue: 6170.93,
  		          profit: 517.00,
  		        date: 1379422492000,
  		          label:"India Label"
  		        }, {
  		          Country: "United States",
  		          revenue: 1005.08,
  		          profit: 609.16,
  		        date: 1377422492000,
  		          label:"States label"
  		        },{
		          Country: "US",
  		          revenue: 490.87,
  		          profit: -141.25,
  		        date: 1373422492000,
  		          label:"US Label"
  		        }, {
  		          Country: "UK",
  		          revenue: 1038.29,
  		          profit: 133.82,
  		        date: 1379482492000,
  		          label:"UK Label"
  		        }, {
  		          Country: "IReland",
  		          revenue: 887.66,
  		          profit: 318.76,
  		        date: 1369422492000,
  		          label:"Ireland Label"
  		        }, {
  		          Country: "Spain",
  		          revenue: 4705.23,
  		          profit: 217.29,
  		        date: 1375422492000,
  		          label:"Spain Label"
  		        }, {
  		          Country: "IR",
  		          revenue: 1370.93,
  		          profit: 167.00,
  		        date: 1373422492000,
  		          label:"IR LAbel"
  		        }, {
  		          Country: "IN",
  		          revenue: 905.08,
  		          profit: 659.16,
  		        date: 1374422492000,
  		          label:"IN Label"
  		        }] 	 
  		    };

  		    this._oModel = new sap.ui.model.json.JSONModel();
  		    this._oModel.setData(oData);
            this.getView().setModel(this._oModel);



  		this.oDataset = new sap.viz.ui5.data.FlattenedDataset({
  		
  		    dimensions : [ {
  		      axis : 1,
  		      name : 'Country',
  		      value : "{Country}"
  		    } ],
  		
  		    measures : [ {
  		      group : 1,
  		      name : 'Date',
  		      value : {path :'date', formatter : function($) { return (new Date(parseInt($, 10)).getTime() - Date.now())/1000/3600/24; }}
  		    }, {
  		      group : 2,
  		      name : 'Profit',
  		      value : '{profit}'
  		    }, {
  		      group : 3,
  		      name : 'Revenue',
  		      value : '{revenue}'
  		    } ],
  		
  		    data : {
  		      path : "/businessData",               
  		    }
  		
  		  });
  		
  		this.xAxisFormatString = "xAxis Label";
  		this.aTooltipFormatString = ["xAxis Tooltip"];
  		
  		this.chart.setDataset(this.oDataset);
  		this.chart.setXAxisFormatFunction(jQuery.proxy(this.xAxisFormmater,this));
        this.chart.setXAxisFormatString(this.xAxisFormatString);
        this.chart.setAxisTooltipFormatString(this.aTooltipFormatString);
        this.chart.setLabelProperty(["label","revenue"]);
    },
  	
    xAxisFormmater: function(v,p){
	 jQuery.sap.require("sap.ui.core.format.DateFormat");  
		 if(p==this.xAxisFormatString ||p == this.aTooltipFormatString[0]){	 
		  v = v.toFixed(0);
		  if (v<0) {
			  return v + " days ago";
		  }
		  else if ( v> 0){
			  return "in " + v + " days";
		  }
		  else {
			  return "today";
		  }
		 }else{
			 return v;
		 }
	  
},
	
onSelectDataPoint:function(oEvent){
	
	var event=oEvent;
	//get the Popover object to add custom data
}
});