// define a root UIComponent which exposes the main view
jQuery.sap.declare("AppScflTest.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("AppScflTest.Configuration");
jQuery.sap.require("sap.ui.core.routing.Router");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("AppScflTest.Component", {

	metadata : {
	    "config" : {
	        "title": "Track Purchase Order",
            "icon" : "sap-icon://Fiori2/F0003"
	    },
		"name": "Track Purchase Order",
		"version" : "1.0.0",
		"library" : "AppScflTest",
		"includes" : [ ],
		"dependencies" : { 
			"libs" : [ "sap.m", "sap.me" ],
			"components" : []
		},
		"routing" : {
			"config" : {
				"viewType" : "XML",
				"viewPath" : "AppScflTest.view",
				"viewLevel" : undefined,
				"targetControl" : undefined,
				"targetAggregation" : "detailPages",
				"clearTarget" : false
			},
			"routes" : {
				"masterDetail" : {
					"pattern" : "tpo",
					"view" : "MainSplitContainer",
					"viewPath" : "AppScflTest.view",
					"targetControl" : "fioriContent",
					"targetAggregation" : "pages",
					"subroutes" : {
						"master" :  {
							"pattern" : "purchaseorder:?params:",
							"view" : "S2",
							"viewLevel" : 2,
							"targetControl" : "MainSplitContainer",
							"targetAggregation" : "masterPages",
							"subroutes" : {
								"PODetail" : {
									"pattern" : "purchaseorder/origin/{origin}/number/{ponumber}:?params:",
									"view" : "S3",
									"viewLevel" : 3
								},
								"POItem" : {
									"pattern" : "purchaseorder/origin/{origin}/number/{ponumber}/item/{poitemnumber}:?params:",
									"view" : "S4",
									"viewLevel" : 4
								},
								"GoodsReceipt" : {
									"pattern" : "goodsreceipt/origin/{origin}/year/{year}/docid/{docid}:?params:",
									"view" : "S5",
									"viewLevel" : 5
								},
								"Invoice" : {
									"pattern" : "invoice/origin/{origin}/year/{year}/docid/{docid}:?params:",
									"view" : "S6",
									"viewLevel" : 6
								},
								"noData" : {
									"pattern" : "emptydetail",
									"view" : "SE"
								}
							}
						}
					}
				},
				"fullscreen" : {
					"pattern" : "",
					"view" : "App",
					"viewPath" : "AppScflTest.view",
					"targetControl" : "fioriContent",
					"targetAggregation" : "pages",
					"subroutes" : {
						"Splash" : {
							"pattern" : ":all*:",
							"view" : "S1",
							"targetControl" : "app",
							"targetAggregation" : "pages",
						}
					}
				}
			}
		}
	},

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {component: this};
		this.oMainView = sap.ui.view({
            viewName : "AppScflTest.Main",
            type : sap.ui.core.mvc.ViewType.XML,
            viewData : oViewData
        });
        return this.oMainView;
    },

	routeMatchedHandler : null,
	bRouterCloseDialogs : false, // prevents the router from closing error dialogs

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var oRouter = this.getRouter();
		this.routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(oRouter, this.bRouterCloseDialogs);
		oRouter.initialize();
	},

	destroy : function() {
		// TODO: waiting for a bug fix in ancestor classes
		sap.ui.core.UIComponent.prototype.destroy.apply(this);
		if (this.routeMatchedHandler){
            this.routeMatchedHandler.destroy();
        }
        this.oMainView = null;
	},
    exit : function (){
        jQuery.sap.log.info("AppNavSample: Component.js exit called : this.getId():" + this.getId() );
    }

});
