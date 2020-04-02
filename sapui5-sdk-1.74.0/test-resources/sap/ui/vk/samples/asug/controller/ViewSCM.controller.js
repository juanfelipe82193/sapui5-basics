sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/Filter",
               "sap/ui/model/FilterOperator",
               "sap/ui/core/routing/History"
               ], function(Controller, Filter, FilterOperator, History) {
	"use strict";

	return Controller.extend("asug.controller.ViewSCM", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			window.history.go(-1);
		},
		
		onClickRouteAna : function(evt) {
			var route = evt.getSource();
			route.openDetailWindow( "Carrier" );  
			this.oAnaMap.attachEventOnce("openWindow",function(e) {
				var oBC = this.route.getBindingContext();
				var oDomRef = e.getParameter("contentarea").id;
				oDomRef = oDomRef.replace("-window-content","")
				var jObj = $("#"+oDomRef);
				var oPopover = this.oController.oPopover;
				oPopover.setModel(this.oController.getView().getModel());
				oPopover.setBindingContext(oBC);
				oPopover.setContentMinWidth("25rem");
				jQuery.sap.delayedCall(0, this, function() {
					var oNavCon = oPopover.getContent()[0];
					if (oNavCon) {oNavCon.to("masterscm");}
					oPopover.openBy(jObj);
				});
			}.bind({oController: this, route : route}) );

		},
		onClickRouteGeo : function(evt) {
			var route = evt.getSource();
			route.openDetailWindow( "Carrier" );  
			this.oGeoMap.attachEventOnce("openWindow",function(e) {
				var oBC = this.route.getBindingContext();
				var oDomRef = e.getParameter("contentarea").id;
				oDomRef = oDomRef.replace("-window-content","")
				var jObj = $("#"+oDomRef);
				var oPopover = this.oController.oPopover;
				oPopover.setModel(this.oController.getView().getModel());
				oPopover.setBindingContext(oBC);
				oPopover.setContentMinWidth("25rem");
				jQuery.sap.delayedCall(0, this, function() {
					var oNavCon = oPopover.getContent()[0];
					if (oNavCon) {oNavCon.to("masterscm");}
					oPopover.openBy(jObj);
				});
			}.bind({oController: this, route : route}) );

		},
			onFilterInvoices : function (oEvent) {

				// build filter array
				var aFilter = [];
				var sQuery = oEvent.getParameter("query");
				if (sQuery) {
					aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
				}

				// filter binding
				var oList = this.getView().byId("invoiceList");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
			},
			onInit: function() {
				var oMapContainer = this.getView().byId("MapCont");
				var oGeoMap = this.getView().byId("GEOMAP");
				var oAnaMap = this.getView().byId("ANAMAP");
				
				this.oAnaMap = oAnaMap.addStyleClass("SCMAnaMap");
				this.oGeoMap = oGeoMap.addStyleClass("SCMAnaMap");
				var oController = this;
//				var oSCMMap = this.getView().byId("SCMMAP");
				var oPanel = this.getView().byId("targetpanel");
				var oModel = new sap.ui.model.json.JSONModel();
				this.oPopover = this.buildPopover();
				
				$.getJSON("model/supplychain.json", function(data) {
					data["rangesSCM"] = [{"name": "Financial Year 2015, Q1"},{"name": "Financial Year 2015, Q2"},{"name": "Financial Year 2015, Q3"},{"name": "Financial Year 2015, Q4", "selected" : true}];
					data["modalfilter"] = [{"name": "Truck", "selected":true},{"name": "Train", "selected":true}];
					
					
					//					data["rangesOps"] = [{"name": "Current"},{"name": "Q2"},{"name": "Q3"},{"name": "Q4"},]
//					var temparray = [];
//					var aCoord = data.routes[2].position.split(";");
//					for (var int = 0; int < aCoord.length; int += 3) {
//					var sCoordstring = aCoord[int] + ";" + aCoord[int + 1] + ";" + aCoord[int + 2];
//					temparray.push(sCoordstring);
//					}
//					var tempspots = [];
//					var howmany = 8;
//					var howfull = temparray.length;
//					var tempiter = Math.floor(howfull / howmany);
//					for (var iter = 0; iter < howmany; iter++) {
//					// tempspots.push({"position":temparray[tempiter*iter]});
//					console.log(
//					"{\"position\": \""+temparray[tempiter * iter]+"\"},"
//					);
//					}

				
					oModel.setData(data);

//
//					oGeoMap.addVo(new sap.ui.vbm.Routes({
//						items: {
//							path: "/routes",
//							template: new sap.ui.vbm.Route({
//								position: "{position}",
//								tooltip: "{name}",
//								color: {
//									path: "status",
//									formatter: function(data) {
//										switch (data) {
//											case "alert":
//												return "RGB(97,166,86)";
//												break;
//											case "good":
//												return "RGB(97,166,86)";
//												break;
//											case "warning":
//												return "RGB(97,166,86)";
//												break;
//											default:
//												return "RGB(97,166,86)";
//											break;
//										}
//
//									}
//								},
//								start: "1",
//								linewidth: "5",
//								colorBorder: "RGB(255,255,255)"
//							})
//						}
//					}));
//		
//					oGeoMap.addVo(new sap.ui.vbm.Spots({
//						items: {
//							path: "/cities",
//							// filters : [oEQFilter],
//							template: new sap.ui.vbm.Spot({
//								"position": "{position}",
//								"tooltip": "{source}",
//								"contentOffset": "0;-6",
//								"scale": "1.5;1.5;1.5",
//								"image": {
//									path: "status",
//									formatter: function(data) {
//										switch (data) {
//											case "alert":
//												return "PinRed.png";
//												break;
//											default:
//												return "PinBlue.png";
//											break;
//										}
//									}
//								},
//								"icon": "sap-icon://factory"
//							})
//						}
//					}));
//					oGeoMap.addVo(new sap.ui.vbm.Spots({
//					items: {
//					path: "/spots",
//					template: new sap.ui.vbm.Spot({
//					"position": "{pos}",
//					"tooltip": "{tooltip}",
//					"image": "{image}",
//					"contentOffset": "{contentOffset}",
//					"scale": "1.5;1.5;1.5",
//					"icon": "{icon}"
//					})
//					}
//					}));


					var fColorSemantic = function(data) {
						switch (data) {
							case "alert":
								return "rgb(211,32,48)";
								break;
							case "good":
								return "rgb(97,166,86)";
								break;
							case "warning":
								return "rgb(225,123,36)";
								break;
							default:
								return "rgb(132,143,148)";
							break;
						}
					};
					
					
					var fSemanticType = function(data) {
						switch (data) {
							case "alert":
								return sap.ui.vbm.SemanticType.Error;
								break;
							case "good":
								return sap.ui.vbm.SemanticType.Success;
								break;
							case "warning":
								return sap.ui.vbm.SemanticType.Warning;
								break;
							default:
								return sap.ui.vbm.SemanticType.Neutral;
							break;
						}
					};
					// // ANALYTIC MAP

					oAnaMap.addVo(new sap.ui.vbm.Routes({
						items: {
							path: "/streamofgoods",
							template: new sap.ui.vbm.Route({
								position: "{position}",
								tooltip: "{name}",
								click: oController.onClickRouteAna.bind(oController),
								color: {
									path: "status",
									formatter: fColorSemantic
								},
								start: "1",
								linewidth: "{flow}",
								colorBorder: "rgb(255,255,255)",
								labelText: "{name}",
								labelType: {
									path: "status",
									formatter: fSemanticType
								}
							})
						}
					}));
					
					oGeoMap.addVo(new sap.ui.vbm.Routes({
						items: {
							path: "/streamofgoods",
							template: new sap.ui.vbm.Route({
								position: "{position}",
								tooltip: "{name}",
								click: oController.onClickRouteGeo.bind(oController),
								color: {
									path: "status",
									formatter: fColorSemantic
								},
								start: "1",
								linewidth: "{flow}",
								colorBorder: "rgb(255,255,255)",
								labelText: "{name}",
								labelType: {
									path: "status",
									formatter: fSemanticType
								}
							})
						}
					}));
					
					oGeoMap.addVo(new sap.ui.vbm.Spots({
						items: {
							path: "/cities",
							// filters : [oEQFilter],
							template: new sap.ui.vbm.Spot({
								"position": "{position}",
								"tooltip": "{source}",
								"contentOffset": "0;-6",
								"scale": "1.5;1.5;1.5",
								"image": {
									path: "status",
									formatter: function(data) {
										switch (data) {
											case "alert":
												return "PinRed.png";
												break;
											default:
												return "PinBlue.png";
											break;
										}
									}
								},
								"icon": "sap-icon://factory"
							})
						}
					}));
					oAnaMap.addVo(new sap.ui.vbm.Spots({
						items: {
							path: "/cities",
							// filters : [oEQFilter],
							template: new sap.ui.vbm.Spot({
								"position": "{position}",
								"tooltip": "{source}",
								"contentOffset": "0;-6",
								"scale": "1.5;1.5;1.5",
								"image": {
									path: "status",
									formatter: function(data) {
										switch (data) {
											case "alert":
												return "PinRed.png";
												break;
											default:
												return "PinBlue.png";
											break;
										}
									}
								},
								"icon": "sap-icon://factory"
							})
						}
					}));

				
					var oFilter = new sap.ui.model.Filter({
						path: "status",
						test: function(oValue) {
//							alert("s");
							if (oValue == "ALERT") {
								return oValue; 
							}
						}
					});

					var oEQFilter = new sap.ui.model.Filter("status", "EQ", "ALERT");


//					oPanel.bindAggregation("items", {
//					path: "/streamofgoods",
//					template : new sap.m.InputListItem({
//					label: "Warning",
//					content: new sap.m.Button({
//					// type: sap.m.ButtonType.Transparent,
//					// press: function (ev) {
//					// this;
//					// },
//					// icon: {
//					// path: "visible",
//					// formatter : function (data) {
//					// if (data == "true") {
//					// return "sap-icon://show";
//					// } else {
//					// return "sap-icon://hide";
//					// }
//					// }
//					// }
//					text: "test"
//					})
//					})
//					});

//					oSCMMap.addVo(new sap.ui.vbm.Routes({
//					items: {
//					path: "/streamscm",
//					template: new sap.ui.vbm.Route({
//					position: "{position}",
//					tooltip: "{name}",
//					color: {
//					path: "status",
//					formatter: function(data) {
//					switch (data) {
//					case "alert":
//					return "RGB(211,32,48)";
//					break;
//					case "good":
//					return "RGB(97,166,86)";
//					break;
//					case "warning":
//					return "RGB(225,123,36)";
//					break;
//					default:
//					return "RGB(132,143,148)";
//					break;
//					//
//					// #d32030
//					// rgb(211, 32, 48)
//					// @sapUiChartBad
//					// .
//					// #e17b24
//					// rgb(225, 123, 36)
//					// @sapUiChartCritical
//					// .
//					// #61a656
//					// rgb(97, 166, 86)
//					// @sapUiChartGood
//					// .
//					// #848f94
//					// rgb(132, 143, 148)
//					// @sapUiChartNeutral
//					}

//					}
//					},
//					start: "1",
//					linewidth: "{flow}",
//					colorBorder: "RGB(255,255,255)",
//					labelText: "{name}",
//					labelType: {
//					path: "status",
//					formatter: function(data) {
//					switch (data) {
//					case "alert":
//					return sap.ui.vbm.SemanticType.Error;
//					break;
//					case "good":
//					return sap.ui.vbm.SemanticType.Success;
//					break;
//					case "warning":
//					return sap.ui.vbm.SemanticType.Warning;
//					break;
//					default:
//					return sap.ui.vbm.SemanticType.Neutral;
//					break;
//					}

//					}
//					}
//					})
//					}
//					}));
				});

				this.getView().setModel(oModel);



//				}), new sap.ui.vk.ListPanel({
//				headerText: "Team",
//				headerIcon: "sap-icon://group",
//				selectionMode: sap.m.ListMode.SingleSelect,
//				expanded: false,
//				items: [
//				new sap.ui.vk.LegendItem({
//				title: "Volker",
//				icon: "sap-icon://manager",
//				press: function(e) {
//				sap.m.MessageToast.show("this is a manager");
//				}
//				}), new sap.ui.vk.LegendItem({
//				title: "Hans",
//				icon: "sap-icon://employee"
//				}), new sap.ui.vk.LegendItem({
//				title: "Jim",
//
			},
			buildPopover : function () {
				
				var fValueState = function (data) {
					switch (data) {
						case "alert":
							return sap.ui.core.ValueState.Error;
							break;
						case "good":
							return sap.ui.core.ValueState.Success;
							break;
						case "warning":
							return sap.ui.core.ValueState.Warning;
							break;
						default:
							return sap.ui.core.ValueState.None;
						break;
					}
				};

				var fValueColor = function (data) {
					switch (data) {
						case "alert":
							return sap.m.ValueColor.Error;
							break;
						case "good":
							return sap.m.ValueColor.Good;
							break;
						case "warning":
							return sap.m.ValueColor.Critical;
							break;
						default:
							return sap.m.ValueColor.None;
						break;
					}
				};
				
				var oDetail = null;
				var oNavContainer = new sap.m.NavContainer({
					pages: [new sap.m.Page("masterscm",{
						title: {
							path:"name", 
							formatter : function (data) {
								return "Carriers - "+data;
							}
						},
						content: [new sap.m.List({
							items:{
								path: "carrier",
								template: new sap.m.StandardListItem({
									title: '{name}',
									info: '{time}',
									description: "Carrier",
									type: sap.m.ListType.Navigation,
									press : function (oEv) {
										var oCtx = this.getBindingContext();
										oNavContainer.to(oDetail);
										oDetail.bindElement(oCtx.getPath());
									},
									infoState : {
										path:"semantic",
										formatter: fValueState
									},
									icon: {
										path:"modal",
										formatter: function (data) {
											switch (data) {
												case "truck":
													return "sap-icon://shipping-status";
													break;
												case "train":
													return "sap-icon://cargo-train";
													break;
												default:
													return "sap-icon://flight";
												break;
											}
			
										}
									}
								})
							}
						})]
					}),
					oDetail = new sap.m.Page({
						showNavButton:true,
						footer: new sap.m.Toolbar({
							content: [
							          new sap.m.ToolbarSpacer(), new sap.m.Button({
							        	  text:"Contact",
							        	  press: function (oEv) {
							        		  sap.m.MessageToast.show("Calling Contact at Carrier...");	
			
							        	  }
			
							          })
							          ]
						}),
						navButtonPress:function (oEv) {
							oNavContainer.back();
						},
						title: {
							path:"name", 
							formatter : function (data) {
								return "Carrier - "+data;
							}
						},
						content: [ new sap.ui.layout.form.SimpleForm({
							columnsL:2,
							columnsM:2,
							labelSpanL: 8,
							labelSpanS: 8,
							labelSpanM: 8,
							layout:"ResponsiveGridLayout",
			
							content: [ 
								new sap.m.Label({text:"Aggregated performance"}),
								new sap.m.FlexBox({
									width:"70px" ,
									height:"70px", 
									alignItems:"Center", 
									justifyContent:"End",
									items: [
									        new sap.suite.ui.microchart.RadialMicroChart({
									        	percentage:{
									        		path: "time",
									        		formatter : function (data) {
									        			if (data) {
									        				return parseFloat(data.split("%")[0]);
									        			} else {
									        				return 0.0;
									        			}
									        		}
									        	}, 
									        	valueColor:{
									        		path:"semantic",
									        		formatter: fValueColor
									        	} 
									        })// chart
									        ]
								
								}),// flexbox
								new sap.m.Label({text:"Performance last month"}),
								new sap.m.ObjectStatus({ 
									text:"{time}",
									state: {
										path:"semantic",
										formatter: fValueState
									},
								}),
								new sap.m.Label({text:"Contract duration"}),
								new sap.m.ObjectAttribute({ 
									text:"until 5/31/16"
								}),
								new sap.m.Label({text:"Number of in-time deliveries"}),
								
								new sap.m.ObjectStatus({ 
									text:{
										path : "time",
										formatter : function (data) {
											if (data) {
												return parseInt(data.split("%")[0])+"/100 punctual";
											} else {
												return "no Data";
											}
										}
									},
									state: {
										path:"semantic",
										formatter: fValueState
									}
								}),
								new sap.m.Label({text:"Contact"}),
								new sap.m.ObjectAttribute({ 
									text:"Kim Kirsten"
								})
							]// SimpleFOrm
						})
					]
				})
			]
			});
			
			
				var oPopover = new sap.m.Popover({
			//		title: "{name}",
			//		placement:"Right",
					showHeader: false,
					placement: sap.m.PlacementType.HorizontalPreferredRight,
					offsetY: 15,
					offsetX: -10,
					content: [oNavContainer],
					contentHeight :"20rem",
						contentWidth :"25rem"
			
				});
				return oPopover;
			}
		});

	});
