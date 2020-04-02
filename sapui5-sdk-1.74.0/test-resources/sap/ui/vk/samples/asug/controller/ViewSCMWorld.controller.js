sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"asug/controller/Bezier"
], function(Controller, Filter, FilterOperator, History, Bezier) {
	"use strict";

	return Controller.extend("asug.controller.ViewSCMWorld", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			window.history.go(-1);
		},
	
//		onClickSpot : function(evt) {
//			  var spot = evt.getSource();
//			  spot.openDetailWindow( "Carrier" );  
//			  this.oSCMMap.attachEventOnce("openWindow",function(e) {
//			    	var oBC = this.spot.getBindingContext();
//			    	
//					var oDomRef = e.getParameter("contentarea").id;
//					oDomRef = oDomRef.replace("-window-content","")
//					var jObj = $("#"+oDomRef);
//					
//					var oPopover = new sap.m.Popover({
//						title: "dummy ship text", 
//					placement:sap.m.PlacementType.HorizontalPreferredRight,
//						offsetY: 15,
//						offsetX: -10,
//						content: new sap.m.List({
//							items:{
//								path: "modes",
//								template : new sap.m.StandardListItem({
//									title:"{name}",
//										description:"{modal}",
//										icon:"{icon}"	
//								})
//								
////									iconDensityAware="false"
////									iconInset="false" />
//								//formatter: function (e){ return e;}
//							}
//						})});
//					oPopover.setModel(this.oController.getView().getModel());
//					oPopover.setBindingContext(oBC);
//					oPopover.setContentMinWidth("11rem");
//					jQuery.sap.delayedCall(0, this, function() {
//						oPopover.openBy(jObj);
//					});
//				}.bind({oController: this, spot : spot}) );
//
//		  },
		onClickRouteAna : function(evt) {
			var route = evt.getSource();
			route.openDetailWindow( "Carrier" );  
			this.oSCMMap.attachEventOnce("openWindow",function(e) {
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
					if (oNavCon) {oNavCon.to("masterscmworld");}
					oPopover.openBy(jObj);
				});
			}.bind({oController: this, route : route}) );
	
		},
		onModalSelectionChange : function (oEvent) {
			var binding = this.oStreams.getBinding("items")
			var aSelects = binding.getModel().getProperty("/modalfilter");
			var oModalFilter = new sap.ui.model.Filter({
				    path: "modes",
				    test: function(oValue) {
				    	var result = [];
				    	for (var key in oValue) {
				    		for (var selectkey in this) {
					    		if (oValue[key]["modal"] === this[selectkey].modal && this[selectkey].selected) {
					    			result.push(oValue[key]);
					    		} 
				    		}
				    	}
				    	return result; 
				    }.bind(aSelects)
				  });
			binding.filter([oModalFilter]);
		
		},
		onKPISelectionChange : function (oEvent) {
			var oSelection = oEvent.getSource().getSelectedItems();
			if (oSelection.length >= 1) {
				var oTitle = oSelection[0].getTitle();
				var iResult = oTitle.toUpperCase().search("VOLUME");
				if (iResult < 0) {
					this.oSelectionKey = "ton";	
				} else {
					this.oSelectionKey = "ccm";
				}				
				this.getView().getModel().setProperty("/selectionKey", this.oSelectionKey);
				this.getView().getModel().refresh(true);
//				jQuery.sap.delayedCall(0, this, function() {
//					
//				});
			}
		
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
// var oGeoMap = this.getView().byId("GEOMAP");
// var oAnaMap = this.getView().byId("ANAMAP");
			var oSCMMap = this.getView().byId("SCMMAP");
			this.oSCMMap = oSCMMap.addStyleClass("SCMAnaMap");
			var oPanel = this.getView().byId("targetpanel");
			var oModel = new sap.ui.model.json.JSONModel();
			this.bWorld = null;
//			this.getView().getModel().setProperty("/selectionKey", "ccm");
			var oController = this;
			this.oPopover = this.buildPopover();
			

			                          
			var refreshModel = function() {
				var zswitch = 4;
				var ZL = oSCMMap.getZoomlevel();
					if ( ZL >= zswitch && oController.bWorld && oController.oStreams) {
						// ZL more detail than 3 & world is shown
						// change world to atlantic
						oController.oView.bindObject("/streamscmatlantic");
						oController.bWorld = false;
					} else if (ZL < zswitch && !oController.bWorld && oController.oStreams){
						oController.oView.bindObject("/streamscm");
						oController.bWorld = true;
					} 				
				
			};
			oSCMMap.attachZoomChanged(refreshModel);
			
			var oBezier = Bezier.initMapWithBezier(oSCMMap);

			$.getJSON("model/scm.json", function(data) {
				var aStreams = data.streamscm.routes;
				for (var int = 0; int < aStreams.length; int+=2) {
					var oStreamBack = aStreams[int];
					var oStreamForth = aStreams[int+1];
					
					var iFlowCCM = oStreamBack.flow.ccm + oStreamForth.flow.ccm;
					var iFlowTON = oStreamBack.flow.ton + oStreamForth.flow.ton;

					oStreamBack.total = {
					   "ccm": iFlowCCM,
					   "ton": iFlowTON,
					};
					oStreamForth.total = {
										   "ccm": iFlowCCM,
										   "ton": iFlowTON,
										};
				
					

			}	
				var aStreams = data.streamscmatlantic.routes;
				for (var int = 0; int < aStreams.length; int+=2) {
					var oStreamBack = aStreams[int];
					var oStreamForth = aStreams[int+1];
					
					var iFlowCCM = oStreamBack.flow.ccm + oStreamForth.flow.ccm;
					var iFlowTON = oStreamBack.flow.ton + oStreamForth.flow.ton;

					oStreamBack.total = {
					   "ccm": iFlowCCM,
					   "ton": iFlowTON,
					};
					oStreamForth.total = {
										   "ccm": iFlowCCM,
										   "ton": iFlowTON,
										};
				
					

			}	
//				data["rangesSCM"] = [{"name": "Financial Year 2015, Q1"},{"name": "Financial Year 2015, Q2"},{"name": "Financial Year 2015, Q3"},{"name": "Financial Year 2015, Q4", "selected" : true}];
//				data["modalfilter"] = [{"modal": "Ship", "selected":true},{"modal": "Plane", "selected":true},{"modal": "Truck", "selected":true}];
//				data["selectionKey"]= "ccm";
//				
//				var oBackForth, fQuota;
//				var aStreams = data.streamscm.routes;
//				data.streamscm.routes = [];
//				
//				var modeShip = [{
//					"name": "MS Boston",
//					"modal":"Ship",
//		"icon": "sap-icon://bus-public-transport"
//				}];
//				var modePlane = [{
//					"name": "Flight AA1386",
//					"modal":"Plane",
//					"icon": "sap-icon://flight"
//
//				}];
//				
//				
//				var modeShipBack = [{
//					"name": "MS Boston Back",
//					"modal":"Ship",
//		"icon": "sap-icon://bus-public-transport"
//				}];
//				var modePlaneBack = [{
//					"name": "Flight AA1386 Back",
//					"modal":"Plane",
//					"icon": "sap-icon://flight"
//
//				}];
//				var modeShipForth = [{
//					"name": "MS Boston Forth",
//					"modal":"Ship",
//		"icon": "sap-icon://bus-public-transport"
//				}];
//				var modePlaneForth = [{
//					"name": "Flight AA1386 Forth",
//					"modal":"Plane",
//					"icon": "sap-icon://flight"
//
//				}];
//				var mode = null;
//				for (var int = 0; int < aStreams.length; int++) {
//					var oStream = aStreams[int];
//					oBackForth = oBezier.onResolveTheLines(oStream);
//					fQuota = Math.random();
//					
//					if (oStream.modes) {
//						mode = oStream.modes;
//					} else {
//						 if (int > 5) {
//							 mode = modeShip;
//						 } else {
//							 mode = modePlane;
//						 }
//					}
//					
//					oStream.flowback = {"ccm":oStream.back*fQuota, "ton":oStream.back*(1-fQuota)}
//					oStream.flowforth = {"ccm":oStream.forth*fQuota, "ton":oStream.forth*(1-fQuota)}
//					
//					data.streamscm.routes.push({
//						"source": oStream.source,
//						"target": oStream.target,
//						"position":oBackForth.back,
//						"name" : oStream.source + " to "+ oStream.target,
//						"flow" : oStream.flowback,
//						"startarrow" : 1,
//						"endarrow" : 0,
//						"status" : oStream.back,
//						"modes" : mode
//						});
//					data.streamscm.routes.push({
//						"source": oStream.target,
//						"target": oStream.source,
//						"position":oBackForth.forth,
//						"startarrow" : 0,
//						"endarrow" : 1,
//						"name" : oStream.target + " to "+ oStream.source,
//						"flow" : oStream.flowforth,
//						"status" : oStream.forth,
//						"modes" : mode
//						});
//					
//				}
//				
//				var oStreamSouth = data.streamscmatlantic.routes[0];
//				var oStreamNorth = data.streamscmatlantic.routes[1];
//				oBackForth = oBezier.onResolveTheLines(oStreamSouth);
//				fQuota = Math.random();
//			
//				oStreamSouth.modes = modeShipForth;
//				oStreamNorth.modes = modeShipBack;
//				
//				oStreamSouth.status = 10;
//				oStreamNorth.status = 20;
//				
//				oStreamNorth.flow = {"ccm":oStreamNorth.back*fQuota, "ton":oStreamNorth.back*(1-fQuota)}
//				oStreamSouth.flow = {"ccm":oStreamSouth.forth*fQuota, "ton":oStreamSouth.forth*(1-fQuota)}
//			
//				data.streamscmatlantic.routes.push({
//						"source": oStreamSouth.source,
//						"target": oStreamSouth.target,
//						"position":oBackForth.forth,
//						"name" : oStreamSouth.source + " to "+ oStreamSouth.target,
//						"flow" : oStreamSouth.flow,
//						"startarrow" : 0,
//						"endarrow" : 1,
//						"status" : parseInt(oStreamSouth.forth),
//						"modes" : modePlaneForth
//						});
//			
//				oBackForth = oBezier.onResolveTheLines(oStreamNorth);
//				data.streamscmatlantic.routes.push({
//						"source": oStreamNorth.source,
//						"target": oStreamNorth.target,
//						"position":oBackForth.back,
//						"startarrow" : 1,
//						"endarrow" : 0,
//						"name" : oStreamNorth.source + " to "+ oStreamNorth.target,
//						"flow" : oStreamNorth.flow,
//						"status" : parseInt(oStreamNorth.back),
//						"modes" : modePlaneBack
//						});

				var templatespot = new sap.ui.vbm.Spot({
					"position": "{position}",
					"contentOffset": "0;-6",
					"image": {
						path: "status",
						formatter: function(data) {
							switch (data) {
								case "alert":
									return "PinBlue.png";
									break;
								default:
								return "PinRed.png";
									break;
							}
						}
					},
					"icon": "sap-icon://truck"
				});

// data["tempspots"] = tempspots;
				oModel.setData(data);
				
				
				// // ANALYTIC MAP


				var fFlowColor = function(data) {
					
					var sKey = this.getModel().getProperty("/selectionKey");
					var fTotal = this.getBindingContext().getProperty("total");
					var fResult = data[sKey] / fTotal[sKey];
					
					
//					var value = "";
					
					if (fResult > 0.4) {
						if (fResult > 0.6) {
//							value = "good";
							return "rgb(97,166,86)";
						} else {
							// between 0.3 and 0.75
//							value = "warning";
							return "rgb(225,123,36)";
						}
					} else {
//						value = "alert";
						return "rgb(211,32,48)";
					}
					
					
				};
				
				var fFlowSemantic = function(data) {

					var sKey = this.getModel().getProperty("/selectionKey");
					var fTotal = this.getBindingContext().getProperty("total");
					var fResult = data[sKey] / fTotal[sKey];
					
					if (fResult > 0.4) {
						if (fResult > 0.6) {
//							value = "good";
//							return "rgb(97,166,86)";
							return sap.ui.vbm.SemanticType.Success;
						} else {
							// between 0.3 and 0.75
//							value = "warning";
//Ç							return "rgb(225,123,36)";
							return sap.ui.vbm.SemanticType.Warning;
						}
					} else {
//						value = "alert";
						return sap.ui.vbm.SemanticType.Error;
//						return "rgb(211,32,48)";
					}
	
					
				};
				
				
				oSCMMap.addVo(oController.oStreams = new sap.ui.vbm.Routes({
					items: {
						path: "routes",
//						filters: [oFilter],
//						path: "/streamscm/routes",
						template: new sap.ui.vbm.Route({
							position: "{position}",
							tooltip: "{name}",
							color: {
								path: "flow",
								formatter: fFlowColor
							},
							start: "{startarrow}",
							end: "{endarrow}",
							linewidth: {
								"path": "flow",
								"formatter": function (data){
									
										return data[this.getModel().getProperty("/selectionKey")];
									
								}
							},
							colorBorder: "rgb(255,255,255)",
							labelText: "{name}",
							labelType: {
								path: "flow",
								formatter: fFlowSemantic
							},
							click: oController.onClickRouteAna.bind(oController)
						})
					}
				}));
		
			
				refreshModel();
			});

			this.getView().setModel(oModel);
			


			/*
			 * -122.481492;37.764723;0 SF -87.615807;41.822642;0 Chicago -71.059686;42.354885;0 Boston -80.204141;25.767061;0 Miami
			 */


		},
		buildPopover : function () {
			var fValueState = function(data) {

				var sKey = this.getModel().getProperty("/selectionKey");
				var fTotal = this.getBindingContext().getProperty("total");
				var fResult = data[sKey] / fTotal[sKey];
				
					if (fResult > 0.4) {
					if (fResult > 0.6) {
//						value = "good";
//						return "rgb(97,166,86)";
//						return sap.ui.vbm.SemanticType.Success;
						return sap.ui.core.ValueState.Success;
					} else {
						// between 0.3 and 0.75
//						value = "warning";
//Ç							return "rgb(225,123,36)";
//						return sap.ui.vbm.SemanticType.Warning;
						return sap.ui.core.ValueState.Warning;
					}
				} else {
//					value = "alert";
//					return sap.ui.vbm.SemanticType.Error;
					return sap.ui.core.ValueState.Error;
//					return "rgb(211,32,48)";
				}

				
			};
//			var fValueState = function (data) {
//				switch (data) {
//					case "alert":
//						break;
//					case "good":
//						break;
//					case "warning":
//						break;
//					default:
//						return sap.ui.core.ValueState.None;
//					break;
//				}
//			};
			var fValueColor = function(data) {

				var sKey = this.getModel().getProperty("/selectionKey");
				var fTotal = this.getBindingContext().getProperty("total");
				var fResult = data[sKey] / fTotal[sKey];
				
				if (fResult > 0.4) {
					if (fResult > 0.6) {
//						value = "good";
//						return "rgb(97,166,86)";
//						return sap.ui.vbm.SemanticType.Success;
						return sap.m.ValueColor.Good;
					} else {
						// between 0.3 and 0.75
//						value = "warning";
//Ç							return "rgb(225,123,36)";
//						return sap.ui.vbm.SemanticType.Warning;
						return sap.m.ValueColor.Critical;
					}
				} else {
//					value = "alert";
//					return sap.ui.vbm.SemanticType.Error;
					return sap.m.ValueColor.Error;
//					return "rgb(211,32,48)";
				}

				
			};
//			var fValueColor = function (data) {
//				switch (data) {
//					case "alert":
//						break;
//					case "good":
//						break;
//					case "warning":
//						break;
//					default:
//						return sap.m.ValueColor.None;
//					break;
//				}
//			};
//			
			
//			
//			icon
//			:
//			"sap-icon://bus-public-transport"
//			modal
//			:
//			"Ship"
//			name
//			:
//			"USS Enterprise"
//			__proto__
//			:
//			Object
//			3
//			:
//			Object
//			icon
//			:
//			"sap-icon://flight"
//			modal
//			:
//			"Plane"
//			name
//			:
//			"USS Enterprise"
			var oDetail = null;
			var oNavContainer = new sap.m.NavContainer({
				pages: [new sap.m.Page("masterscmworld",{
					title: {
						path:"name", 
						formatter : function (data) {
							return "Transports - "+data;
						}
					},
					content: [new sap.m.List({
						items:{
							path: "modes",
							template: new sap.m.StandardListItem({
								title: '{name}',
								info: {
									"path": "flow",
									"formatter": function (data){
											var sKey = this.getModel().getProperty("/selectionKey");
//											var fTotal = this.getBindingContext().getProperty("total");
											var sResult = "";
											if(sKey == "ton") {
												sResult = " kT";
											} else {
												sResult = " cbm";
											}
											try {
												return data[sKey].toFixed(2) + sResult;
												
											} catch (e) {
												// TODO: handle exception
												return "";
											}
								
										
									}
								},
								description: "{modal}",
								type: sap.m.ListType.Navigation,
								press : function (oEv) {
									var oCtx = this.getBindingContext();
									oNavContainer.to(oDetail);
									oDetail.bindElement(oCtx.getPath());
								},
//								infoState : {
//									path:"flow",
//									formatter: fValueState
//								},
								icon: {
									path:"modal",
									formatter: function (data) {
								switch (data) {
										case "Truck":
											return "sap-icon://shipping-status";
											break;
										case "Train":
											return "sap-icon://cargo-train";
											break;
										case "Ship":
											return "images/iconship.png";
											break;
										case "Plane":
											return "sap-icon://flight";
											break;
										default:
											return "";
										break;
										}
		
									}
								}
							})
						}
					}).addStyleClass("IconList")] // Liste
				}),
				oDetail = new sap.m.Page({
					showNavButton:true,
					footer: new sap.m.Toolbar({
						content: [
						          new sap.m.ToolbarSpacer(), new sap.m.Button({
						        	  text:"Contact",
						        	  press: function (oEv) {
						        		  sap.m.MessageToast.show("Calling Contact...");	
		
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
							return "Transport - "+data;
						}
					},
					content: [new sap.m.ObjectHeader({
						title: "{name}",
//						condensed: true,
//						width:"20rem",
						icon: {path:"modal", 
							formatter : function (data) {
							switch (data) {
								case "Truck":
									return "sap-icon://shipping-status";
									break;
								case "Train":
									return "sap-icon://cargo-train";
									break;
								case "Ship":
									return "images/iconship.png";
									break;
								case "Plane":
									return "sap-icon://flight";
									break;
								default:
									return "";
								break;
							}

						}},
//						attributes: [
//						             new sap.m.ObjectAttribute({ 
//							title: "Load",
//							text:"10 palettes of product 0001"
//						}),new sap.m.ObjectAttribute({
//							title:"Load",
//							text:"20 palettes of product 0006"
//						})
//						]
					}).addStyleClass("widthObjectHeader"),
					          
					          new sap.ui.layout.form.SimpleForm({
						columnsL:2,
						columnsM:2,
						labelSpanL: 8,
						labelSpanS: 8,
						labelSpanM: 8,
						layout:"ResponsiveGridLayout",
		
						content: [ 
//							new sap.m.Label({text:"Aggregated performance"}),
//							new sap.m.FlexBox({
//								width:"70px" ,
//								height:"70px", 
//								alignItems:"Center", 
//								justifyContent:"End",
//								items: [
//								        new sap.suite.ui.microchart.RadialMicroChart({
//								        	percentage:{
//								        		path: "time",
//								        		formatter : function (data) {
//								        			if (data) {
//								        				return parseFloat(data.split("%")[0]);
//								        			} else {
//								        				return 0.0;
//								        			}
//								        		}
//								        	}, 
//								        	valueColor:{
//								        		path:"semantic",
//								        		formatter: fValueColor
//								        	} 
//								        })// chart
//								        ]
//							
//							}),// flexbox
							new sap.m.Label({text:"Performance last month"}),
//							new sap.m.ObjectStatus({ 
//								text:"{time}",
//								state: {
//									path:"semantic",
//									formatter: fValueState
//								},
//							}),
							new sap.m.Label({text:"Contract duration"}),
							new sap.m.ObjectAttribute({ 
								text:"until 5/31/16"
							}),
							new sap.m.Label({text:{
									path : "/selectionKey",
								"formatter": function (data){
									if (data == "ton") {return "Amount in kilo metric tons";} else {
									return "Amount in cubic meter";	
									}
								
								}},
								}),
							
							new sap.m.ObjectStatus({ 
								text:{
									path : "flow",
								"formatter": function (data){
							var sKey = this.getModel().getProperty("/selectionKey");
//							var fTotal = this.getBindingContext().getProperty("total");
							var sResult = "";
							if(sKey == "ton") {
								sResult = " kT";
							} else {
								sResult = " cbm";
							}
							try {
								return data[sKey].toFixed(2) + sResult;
								
							} catch (e) {
return "";
								// TODO: handle exception
							}
				
						
					}
								},
//								state: {
//									path:"semantic",
//									formatter: fValueState
//								}
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
				contentWidth :"20rem"
		
			});
			return oPopover;
		}
	});

});
