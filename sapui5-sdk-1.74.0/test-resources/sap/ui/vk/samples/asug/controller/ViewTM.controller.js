sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History"
], function(Controller, Filter, FilterOperator, History) {
	"use strict";

	return Controller.extend("asug.controller.ViewTM", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			window.history.go(-1);
		},
		onClickSpot : function(evt) {
			  var spot = evt.getSource();
			  spot.openDetailWindow( "Transport" );  
			  this.oGeoMap.attachEventOnce("openWindow",function(e) {
			    	var oBC = this.spot.getBindingContext();
			    	
					var oDomRef = e.getParameter("contentarea").id;
					oDomRef = oDomRef.replace("-window-content","")
					var jObj = $("#"+oDomRef);
					
					var oPopover = this.oController.oPopup;
					oPopover.setModel(this.oController.getView().getModel());
					oPopover.setBindingContext(oBC);
//					oPopover.setContentMinWidth("11rem");
					jQuery.sap.delayedCall(0, this, function() {
						oPopover.openBy(jObj);
					});
				}.bind({oController: this, spot : spot}) );

		  },
	onClickCause : function(evt) {
		  var spot = evt.getSource();
		  spot.openDetailWindow( "Cause" );  
		  this.oGeoMap.attachEventOnce("openWindow",function(e) {
		    	var oBC = this.spot.getBindingContext();
		    	
				var oDomRef = e.getParameter("contentarea").id;
				oDomRef = oDomRef.replace("-window-content","")
				var jObj = $("#"+oDomRef);
				
				var oPopover = this.oController.oCause;
				oPopover.setModel(this.oController.getView().getModel());
				oPopover.setBindingContext(oBC);
//				oPopover.setContentMinWidth("11rem");
				jQuery.sap.delayedCall(0, this, function() {
					oPopover.openBy(jObj);
				});
			}.bind({oController: this, spot : spot}) );

	  },
	  onModalSelectionChange: function (oEV) {
		 
		 var FilterTruck = new Filter({
			  path: "modal",
			  operator: "EQ",
			  value1: "truck"
		  });
		 var FilterTrain = new Filter({
			  path: "modal",
			  operator: "EQ",
			  value1: "train"
		  });
		 
		 
		 var oBinding = sap.ui.getCore().byId("transports").getBinding("items");
		  if (oEV.getSource().getSelectedItems().length >= 2) {
			  oBinding.filter([]);
		  } else {
			  var aKeys = oEV.getSource().getSelectedItems();
			  if (aKeys.length < 1) {
				  var FilterPlane = new Filter({
					  path: "modal",
					  operator: "EQ",
					  value1: "plane"
				  });
				  oBinding.filter([FilterPlane]);
			  } else {
				  switch (aKeys[0].getTitle()) {
						case "Truck":
							oBinding.filter([FilterTruck]);
							break;
						case "Train":
							  oBinding.filter([FilterTrain]);
							break;
			  }}
		  } 
	  },
		refreshSelectionList : function (){
			this.oTruckPanel.removeAllItems();
			var aSpots = this.aSelectedTransports;
			var counter = 0;
			for (var iter in aSpots) {
				this.oTruckPanel.addItem( new sap.m.StandardListItem({icon: {"path":"modal", "formatter": this.fModalIcon },title:"{name}", selected:"{selected}"}).setBindingContext(aSpots[iter]));
				counter++;
			}			
			if (counter > 0) {
				this.oTruckPanel.setExpanded(true);
				this.oTruckPanel.addItem(new sap.m.InputListItem({
					content:  new sap.m.Button({
						text:"Message "+counter+" Transports", 
						press:function(oEv){
							sap.m.MessageToast.show("Messaging Selected Transports...");
						},
						type: "Emphasized"
					})
				}));
			} else {
				this.oTruckPanel.setExpanded(false);
			}
			
		},
		fModalIcon : function (data) {
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

		},
		onInit: function() {
			var oMapContainer = this.getView().byId("MapCont");
			var oGeoMap = this.getView().byId("GEOMAP");
			this.oGeoMap = oGeoMap.addStyleClass("TMGeoMap");
//			var oAnaMap = this.getView().byId("ANAMAP");

			this.oTruckPanel = this.getView().byId("transportpanel");
		
			this.oPopup = this.setupPopup();
			this.oCause = this.setupCause();
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel);
			var oController = this;
			this.aSelectedTransports = [];

			$.getJSON("model/tmops.json", function(data) {
				var casper = "-106.240411;41.620523;0";
				var direction = "-87.508671;37.628535;0";
				data["rangesSCM"] = [{"name": "Financial Year 2015, Q1"},{"name": "Q2"},{"name": "Q3"},{"name": "Q4"},]
				data["modalfilter"] = [{"name": "Truck", "selected":true},{"name": "Train", "selected":true}];
				
				
				
				var sf = data["routes"][0];
				var sf2 = $.extend({},data.routes[0]);
				sf2.position = sf.position.substr(sf.position.lastIndexOf(casper));
				sf.position = sf.position.substr(0,sf.position.lastIndexOf(casper)).slice(0,-1);
				data.routes.push(sf2);
				data.routes[1].status = "good";
				data.routes[2].status = "warning";
				sf.status = "alert";
				sf2.status = "good";
				
				
				
				
				
				
				var aDataTransports = data["transports"];
				for (var i = aDataTransports.length - 1; i >= 0; i--) {
					aDataTransports[i]["key"] = "transport"+i;
					aDataTransports[i]["name"] = aDataTransports[i]["modal"].toUpperCase()+" #"+(i+4711);
				};
				data["transports"] = aDataTransports;
				var fVbmStatus = function(data) {
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
				
				var fStatusColor = function(data) {
					switch (data) {
						case "alert":
							return "RGB(211,32,48)";
							break;
						case "good":
							return "RGB(97,166,86)";
							break;
						case "warning":
							return "RGB(225,123,36)";
							break;
						default:
							return "RGB(132,143,148)";
							break;

					}
				}
	
				oModel.setData(data);
			
				
				var handleSelect = function (oEvent) {
					var aSpots = oEvent.getParameter("selected");
					for (var int = 0; int < aSpots.length; int++) {
						var bc = aSpots[int].getBindingContext();
						oController.aSelectedTransports[bc.getProperty("key")] = bc;
					}
					oController.refreshSelectionList();
				};
				var handleDeselect = function (oEvent) {
					var aSpots = oEvent.getParameter("deselected");
					for (var int = 0; int < aSpots.length; int++) {
						var bc = aSpots[int].getBindingContext();
						delete oController.aSelectedTransports[bc.getProperty("key")];
					}
					oController.refreshSelectionList();
				};
				
				var templatespot = new sap.ui.vbm.Spot({
					"position": "{position}",
					"icon": {
									path:"modal",
									formatter: oController.fModalIcon
								},
					"contentOffset": "0;-6",
					"image": {
						path: "status",
						formatter: function(data) {
							switch (data) {
								case "Delay":
									return "PinRed.png";
									break;
								default:
								return "PinBlue.png";
									break;
							}
						}
					},
					"selectColor":"RHLSA(0,0.8,0.8,1)", 
					"click": oController.onClickSpot.bind(oController),
					"select" : "{selected}",
					"type" : {
						path: "status",
						formatter: fVbmStatus
					}
				});
			

			
				oGeoMap.addVo(new sap.ui.vbm.Routes({
					items: {
						path: "/routes",
						template: new sap.ui.vbm.Route({
							position: "{position}",
							tooltip: "{name}",
							color: {
								path: "status",
								formatter: fStatusColor
							},
							start: "1",
							linewidth: "5",
							colorBorder: "RGB(255,255,255)"
						})
					}
				}));
				
				oGeoMap.addVo( new sap.ui.vbm.Spots("transports",{
					items: {
					
						path: "/transports",
						template: templatespot
					},
					select : handleSelect.bind(oController),
					deselect : handleDeselect.bind(oController)
				}));

				oGeoMap.addVo(new sap.ui.vbm.Spots({
					items: {
						path: "/incidents",
						template: new sap.ui.vbm.Spot({
								"position": "{position}",
								"type" : {
									path: "status",
									formatter: fVbmStatus
								},
								"labelPos" : "1",
								"labelText": "{name}",
								"labelType": {
									path: "status",
									formatter: fVbmStatus								
								},
								"click": oController.onClickCause.bind(oController),
								
						})	
					}
				}));
				
				oGeoMap.addVo(new sap.ui.vbm.Spots({
					items: {
						path: "/cities",
					//	filters : [oEQFilter],
						template: new sap.ui.vbm.Spot({
							"position": "{position}",
							"tooltip": "{source}",
							"contentOffset": "0;-6",
							"scale": "1.5;1.5;1.5",
							"type": {
								path: "status",
								formatter: fVbmStatus								
							},
							"icon": "sap-icon://factory",
							"labelPos" : "1",
							"labelText": "{name}",
							"labelType": {
								path: "status",
								formatter: fVbmStatus								
							}
						})
					}
				}));

	

				
				
//				oPanel.bindAggregation("items", {
//					path: "/streamofgoods",
//					template : new sap.m.InputListItem({
//						label: "Warning",
//						content: new sap.m.Button({
////							type: sap.m.ButtonType.Transparent,
////							press: function (ev) {
////								this;
////							},
////							icon: {
////								path: "visible",
////								formatter : function (data) {
////									if (data == "true") {
////										return "sap-icon://show";
////									} else {
////										return "sap-icon://hide";
////									}
////								}
////							}
//							text: "test"
//						})
//					})
//				});
				
			

			});

			
		},
		setupPopup : function () {
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
			
			var oGrid = new sap.ui.layout.Grid({
					defaultSpan: "XL12 L12 M12 S12",
						content: [ 
								new sap.m.ObjectHeader({
									title: "{name}",
//									condensed: true,
//									width:"20rem",
									icon: {path:"modal", formatter : this.fModalIcon},
									attributes: [
									             new sap.m.ObjectAttribute({ 
										title: "Load",
										text:"10 palettes of product 0001"
									}),new sap.m.ObjectAttribute({
										title:"Load",
										text:"20 palettes of product 0006"
									})
									]
								}).addStyleClass("widthObjectHeader"),
//						          new sap.ui.layout.VerticalLayout({
//						        	  content: [new sap.m.ObjectStatus({ 
//											text:"time",
//											state: {
//												path:"semantic",
//												formatter: fValueState
//											},
//											
//										}),new sap.m.ObjectStatus({ 
//											text:"time",
//											state: {
//												path:"semantic",
//												formatter: fValueState
//											},
//											
//										})
//										],
//										layoutData : new sap.ui.layout.GridData({
//											span: "XL9 L9 M9 S9"
//										})
//						          }),
								new sap.m.ObjectStatus({
									state: {
										path:"status",
										formatter: fValueState
									},
									text:{
										path:"status",
										formatter: function (data) {
											switch (data) {
												case "alert":
													return "delayed over 1 hour";
													break;
												case "good":
													return "in time";
													break;
												case "warning":
													return "delayed under 1 hour";
													break;
												default:
													return "no delay information";
												break;
											}
										}
									}
								}),
							new sap.m.ObjectStatus({ 
								text:{
									path : "cause",
									formatter : function (data) {
										var messages = {"casper" : "Points failure in vicinity to Casper",
														"hurricane" : "Flooding due to hurricane" };
										if (data) {
											return messages[data];
										} else {
											return "2 Issues existing in US, no Issue on remaining tour";
										}
									}
								},
								state: fValueState("warning")
								
							}),
							new sap.m.ObjectAttribute({ 
								
								 text:{
									path : "cause",
									formatter : function (data) {
										var messages = {"casper" : "Alternatives: Change to truck in Wyoming",
														"hurricane" : "Speed limit 50 mph; leads to 15 minutes delay" };
										if (data) {
											return messages[data];
										} else {
											return "no Traffic Advice";
										}
									}
								},
							}),new sap.m.ObjectAttribute({ 
								title: "Duration",
								text: "Until end of today"
							}),
							
							 
							new sap.m.ObjectAttribute({ 
								title: "Contact Number",
								text:"+1 650 1233455"
							})
						]// SimpleFOrm
					});
			var oPopover = new sap.m.Popover({
//						title: "{name}",
				//		conte:"Right",
				placement: sap.m.PlacementType.HorizontalPreferredRight,
						showHeader: false,
						offsetY: 15,
						offsetX: -10,
						content: [oGrid],
						footer: new sap.m.Toolbar({
							content: [
							          new sap.m.ToolbarSpacer(), new sap.m.Button({
							        	  text:"Send Message",
							        	  press: function (oEv) {
							        		  sap.m.MessageToast.show("Messaging Single Transport...");	
			
							        	  }
			
							          })
							          ]
						}),
//						contentHeight :"20rem"
						contentWidth :"25rem"
				
					});
			return oPopover;
		},setupCause : function () {
			var oGrid = new sap.ui.layout.Grid({
					defaultSpan: "XL12 L12 M12 S12",
						content: [ 
								new sap.m.ObjectHeader({
									title: "{name}",
									icon:"sap-icon://alert",
									
									attributes: [
												
													new sap.m.ObjectAttribute({ 
														
														 text:{
															path : "cause",
															formatter : function (data) {
																var messages = {"casper" : "Alternatives: Change to truck in Wyoming",
																				"hurricane" : "Speed limit 50 mph; leads to 15 minutes delay" };
																if (data) {
																	return messages[data];
																} else {
																	return "no Traffic Advice";
																}
															}
														},
													}),new sap.m.ObjectAttribute({ 
														title: "Duration",
														text: "Until end of today"
													}),
									],
									statuses: [	new sap.m.ObjectStatus({ 
										text:{
											path : "cause",
											formatter : function (data) {
												var messages = {"casper" : "Points failure in vicinity to Casper",
																"hurricane" : "Flooding due to hurricane" };
												if (data) {
													return messages[data];
												} else {
													return "2 Issues existing in US, no Issue on remaining tour";
												}
											}
										},
										state: sap.ui.core.ValueState.Warning
										
									})]
								}).addStyleClass("widthObjectHeader")

						]// SimpleFOrm
					});
			var oPopover = new sap.m.Popover({
				placement: sap.m.PlacementType.HorizontalPreferredRight,
						showHeader: false,
						offsetY: 15,
						offsetX: -10,
						content: [oGrid],

						contentWidth :"25rem"
				
					});
			return oPopover;
		}
	});

});
