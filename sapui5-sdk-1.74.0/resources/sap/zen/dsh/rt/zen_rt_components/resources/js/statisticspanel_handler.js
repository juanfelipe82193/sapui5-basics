define("zen.rt.components/resources/js/statisticspanel_handler", ["sap/zen/basehandler"], function(BaseHandler){

var StatisticsPanelHandler = function() {
	"use strict";

	BaseHandler.apply(this, arguments);
	
	var dispatcher = BaseHandler.dispatcher;

	
	this.create = function(oChainedControl, oControlProperties) {

		var oControl = this.createDialog("ZEN_PROFILING");
		oControl.setTitle("Statistics");
		
		if (oControlProperties.statistics) {
			var oIgnoreLowTimes = this.createDropdownBox();
			oIgnoreLowTimes.addItem(new sap.ui.core.ListItem({key: 0, text: "Download all"}));
			oIgnoreLowTimes.addItem(new sap.ui.core.ListItem({key: 1, text: "Ignore all below 1 ms"}));
			oIgnoreLowTimes.addItem(new sap.ui.core.ListItem({key: 2, text: "Ignore all below 2 ms"}));
			oIgnoreLowTimes.addItem(new sap.ui.core.ListItem({key: 3, text: "Ignore all below 3 ms"}));
			oIgnoreLowTimes.setSelectedKey(oControlProperties.ignoreCurrentSelection);
			oIgnoreLowTimes.setWidth("150px");			
			if(dispatcher.isMainMode()){
				oIgnoreLowTimes.setAutoAdjustWidth(true);
			}
			
			oControl.addButton(oIgnoreLowTimes);
			
			var oDownloadButton = this.createButton("DownloadButton");
			oDownloadButton.setText("Download as:");
			if(dispatcher.isMainMode()){
				oDownloadButton.setType(sap.m.ButtonType.Emphasized);
			}
			
			oDownloadButton.attachPress(function() {
                var newCommand = new sapbi_Command("DOWNLOAD_STATISTICS");
                newCommand.addParameter(new sapbi_Parameter("TARGET_ITEM_REF", "ZEN_PROFILING"));
                newCommand.addParameter(new sapbi_Parameter("MILLI_SECONDS", oIgnoreLowTimes.getSelectedKey()));
                newCommand.addParameter(new sapbi_Parameter("DOWNLOAD_TYPE", oDownloadType.getSelectedKey()));
                sapbi_page.sendCommand(newCommand);
			});
			oControl.addButton(oDownloadButton);
			
			var oDownloadType = this.createDropdownBox();
			oDownloadType.setWidth("60px");
			if(dispatcher.isMainMode()){
				oDownloadType.setAutoAdjustWidth(true);	
			}
			oDownloadType.addItem(new sap.ui.core.ListItem({key: "TXT", text: "Text"}));
			oDownloadType.addItem(new sap.ui.core.ListItem({key: "CSV", text: "CSV"}));
			oDownloadType.addItem(new sap.ui.core.ListItem({key: "JSON", text: "JSON"}));
			oControl.addButton(oDownloadType);
			
			var oTabStrip1 = this.createTabStrip("StatisticsTabStrip");
			var tabStripSelectHandler = function() {
				if (oTabStrip1.getSelectedIndex() === 1) {
					eval(oControlProperties.refresh);
					oTabStrip1.detachSelect(tabStripSelectHandler);
				}
			}
			oTabStrip1.attachSelect(tabStripSelectHandler);


		    // TAB "General Information"		
		    var oGeneralInfo = this.createTextWithHeight({id: "GeneralInfoText", width: "100%", height: "100%"});
		    oGeneralInfo.setText(oControlProperties.general);
		    oTabStrip1.createTab("General Information", oGeneralInfo);
		    
			//Create a model for runtime statistics
			var oJson = jQuery.parseJSON( oControlProperties.statistics );
			var oModel = new sap.ui.model.json.JSONModel(oJson);
			
			//Create an instance of the tree control for java statistics
			var oTree = this.createTree("JavaStatisticsTree");
			oTree.setWidth("99%");
			
			//bind the table rows to the model
			oTree.setModel(oModel);
			if(dispatcher.isMainMode()){
				oTree.bindRows("/root");
			}else{
			    var oTreeNodeTemplate = new sap.ui.commons.TreeNode();
			    oTreeNodeTemplate.bindProperty("text", "text");
			    oTreeNodeTemplate.setExpanded(false);
			    oTree.bindAggregation("nodes", "/root/0", oTreeNodeTemplate);
			}
		    
		    oTabStrip1.createTab("Runtime Statistics", oTree);
			
		    // TAB "Rendering Statistics"		    
			//Create a model for rendering statistics
			var oJson2 = {"root":{"text":"root"}};
			var oModel2 = new sap.ui.model.json.JSONModel(oJson2);
			
			//Create an instance of the tree control for rendering statistics
			var oTree2 = this.createTree("RenderingStatisticsTree");
			oTree2.setWidth("99%");
			
			//bind the table rows to the model
			oTree2.setModel(oModel2);
			if(dispatcher.isMainMode()){
				oTree2.bindRows("/root");
			}else{
			    var oTreeNodeTemplate2 = new sap.ui.commons.TreeNode();
			    oTreeNodeTemplate2.bindProperty("text", "text");
			    oTreeNodeTemplate2.setExpanded(false);
			    oTree2.bindAggregation("nodes", "/root", oTreeNodeTemplate2);
			}
		    oTabStrip1.createTab("Rendering Statistics", oTree2);


		    oControl.addContent(oTabStrip1);
		}
		
		var oCloseButton = this.createButton({text: "Close", press:function(){oControl.close();}})
		if(dispatcher.isMainMode()){
			oCloseButton.setType(sap.m.ButtonType.Emphasized);
		}
		oControl.addButton(oCloseButton);
		
		return oControl;
	};
	
	this.update = function(oControl, oControlProperties) {
		if (oControlProperties && oControlProperties.statistics) {
			var oTree = sap.ui.getCore().byId("JavaStatisticsTree");
			if (oTree) {
				var oModel = oTree.getModel();
				var oJson = jQuery.parseJSON( oControlProperties.statistics );
				oModel.setData(oJson);
			}
		}
		
		if (oControlProperties && oControlProperties.general) {
			var oGeneralInfo = sap.ui.getCore().byId("GeneralInfoText");
			if (oGeneralInfo) {
			    oGeneralInfo.setText(oControlProperties.general);
			}
		}
		
		return oControl;
	};
	
	this.getType = function() {
		return "statisticspanel";
	};
};

return new StatisticsPanelHandler();

});