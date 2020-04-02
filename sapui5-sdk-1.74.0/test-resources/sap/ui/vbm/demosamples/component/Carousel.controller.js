sap.ui.define([
           	"sap/ui/vbdemos/component/BaseController",
           	"sap/ui/core/routing/HashChanger"
], function (BaseController, HashChanger) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.component.Carousel", {
		onInit : function () {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel);
			var oController = this;
			$.getJSON("./component/manifest.json",function (data) {
				var oData = {};
				
				var aRoutes = data["sap.ui5"].routing.routes.filter(function (route,index,routes) {
					return route.published === "true";
				});
				
				oData["routes"] = aRoutes;
				
				var aWorkinprogress = data["sap.ui5"].routing.routes.filter(function (route,index,routes) {
					return route.published === "wip";
				});
				oData["wip"] = aWorkinprogress;
				
				oData["targets"] = data["sap.ui5"].routing.targets;
				oModel.setData( oData );
				var oHashChanger = HashChanger.getInstance(); 
				oHashChanger.init();
				oHashChanger.attachEvent("hashChanged", function(oEvent) { 
					oController.navigateTo(oEvent.getParameter("newHash"));
				}.bind(oController)); 
				oHashChanger.attachEvent("hashSet", function(oEvent) { 
					oController.navigateTo(oEvent.getParameter("newHash"));
				}.bind(oController)); 
				oHashChanger.attachEvent("hashReplaced", function(oEvent) { 
					oController.navigateTo(oEvent.getParameter("newHash"));
				}.bind(oController)); 
				
			}); 
		},
		onAfterRendering : function () {
			
			var hash = document.location.hash.replace("#","");
			var oController = this;
			this.getView().ScrollContainer.addEventDelegate({
				onAfterRendering: function(oEv) {
					oEv.srcControl.entryFindCorrespondingObject(hash);
					oController.navigateTo(hash);
				}
			});
		
			
			
			
		},
		onDisplayNotFound : function (oEvent) {
			// display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
		},
		onSelectionChange : function (oEvent) {
			// change Hash
			// window.location.hash = "dummy"
			 window.location.hash = oEvent.getParameter("selectedObject").target;
			
		},
		navigateTo : function (sTarget){
			// was sTarget = oRoute.target;
			if (sTarget === "home") {
				window.location.href = "./apppreview.html";
				return;
			}
			
			// sTarget is the key value of Targets[]
			var oTargets = this.getView().getModel().getObject("/targets");
			var oTarget = oTargets[sTarget];
			
			if(oTarget) {
				// find corresponding links for "Live Preview" and package name
				var sPreview = "apppreview.html#/" + sTarget;
				//var sPackage = oTarget.viewName.split(".")[0];
				
				var oRoutes = this.getView().getModel().getObject("/routes");
				var oRoute = oRoutes.filter(function (route,index,routes) {
					return route.pattern == sTarget;
				})[0];
				var sDescription = oRoute.description;
				
				// find .../<sFolder>/explanation.html where sFolder is demo1 or travel
				
				$.get("./"+sTarget+"/explanation.html", function (dom) {
					
					// create the explanation under the .fold
					$(".fold .container").html("");
					var jExplanation  = $(".fold .container .explanation");
					if (jExplanation.length > 0) {
						$(jExplanation).html(dom);
					} else {
						jExplanation = $("<div>").addClass("explanation");
						$(".fold .container").append(jExplanation);
						$(jExplanation).append($(dom));
					}
					// create the "Live Preview" button
					var jPreview  = $(".fold .container .header .preview");
					if (jPreview.length > 0) {
						$(jPreview).attr("href", sPreview);
					} else {
						var jHeader = $("<div>").addClass("header");
						var jDescription = $("<div>").addClass("description");
						$(jDescription).text(sDescription);
						jPreview = $("<a>Live Preview</a>").addClass("preview");
						$(jHeader).append(jDescription);
						$(jDescription).append(jPreview);
						$(".fold .container").append(jHeader);
						
						$(jPreview).attr("href", sPreview);
					}
					if(PR) {
						PR.prettyPrint();
					}
					
	
			
				});
				
			}
		}		
	});
});
