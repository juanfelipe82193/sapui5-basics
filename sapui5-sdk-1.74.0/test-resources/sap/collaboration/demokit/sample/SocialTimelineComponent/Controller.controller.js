sap.ui.define(["sap/ui/core/mvc/Controller", "./SampleNameProvider", "./mockserver/MockServerInitializer"], function(Controller, SampleNameProvider, MockServerInitializer) {
	return Controller.extend(SampleNameProvider.getQualifiedName() + ".Controller", {
		onInit: function() {
			// OData Timeline Service settings. 
			var oSettings = {
				rootUri: "/sap/opu/odata/sap/Z_TIMELINE_SRV/",
				boCollection: "TestBusinessObjects"
			};
			
			MockServerInitializer.initializeMockServers(SampleNameProvider.getName(), ["timeline", "smi", "jam"]);

			var oServiceConfig = {annotationURI: oSettings.rootUri+"$metadata", json: true};
			var oServiceModel = new sap.ui.model.odata.ODataModel( oSettings.rootUri, oServiceConfig);
			
			// WORKAROUND: if the browser is IE, annotations in the oService Models needs to be modified
			// because of a bug in the way the ODataModel gets created with the mockserver
			if (/(MSIE)|(Trident)/.test(navigator.userAgent)){
				oServiceModel.oAnnotations.oAnnotations["Z_TIMELINE_SRV.TestBusinessObject"] = 
				{	"com.sap.vocabularies.Timeline.v1.TimelineNavigationPath":
					{ NavigationPropertyPath: "TestTimelineNavigationPath"
					}
				};
				oServiceModel.oAnnotations.oAnnotations["Z_TIMELINE_SRV.TestTimelineEntry"] = 
				{	"com.sap.vocabularies.Timeline.v1.TimelineEntry":
					{ 	ActionText: {EdmType: "Edm.String", Path: "TestActionText"},
						ActorExtID: {EdmType: "Edm.String", Path: "TestActorExtID"}, 
						ActorID: {EdmType: "Edm.String", Path: "TestActorID"}, 
						ActorName: {EdmType: "Edm.String", Path: "TestActorName"}, 
						ID: {EdmType: "Edm.String", Path: "TestID"},
						Icon: {EdmType: "Edm.String", Path: "TestIcon"}, 
						SummaryText: {EdmType: "Edm.String", Path: "TestSummaryText"}, 
						TimeStamp: {EdmType: "Edm.DateTimeOffset", Path: "TestTimeStamp"}, 
						TimelineDetailNavigationPath: {NavigationPropertyPath: "TestTimelineDetailNavigationPath"}
					}
				};
				oServiceModel.oAnnotations.oAnnotations["Z_TIMELINE_SRV.TestTimelineDetailPropertyValueChange"] = 
				{	"com.sap.vocabularies.Timeline.v1.TimelineDetailPropertyValueChange":
					{ 	AfterValue: {EdmType: "Edm.String", Path: "TestAfterValue"}, 
						BeforeValue: {EdmType: "Edm.String", Path: "TestBeforeValue"}, 
						ChangeType: {EdmType: "Edm.String", Path: "TestChangeType"}, 
						PropertyLabel: {EdmType: "Edm.String", Path: "TestPropertyLabel"}
					}
				};
			}
			
			/* 
			*	Create Social Timeline Component with the event 'customActionPress'.
			*/
			var oSocialTimeline = sap.ui.getCore().createComponent({
					name:"sap.collaboration.components.socialtimeline",
					settings: {
						customActionPress: function(oEventData){				
							var sTimelineEntryId = oEventData.getParameter("timelineEntryId");
							
							 if(oEventData.getParameter('key') === 'key1'){
								 var oDialog = new sap.m.Dialog({
										showHeader: false,
										content:[new sap.m.Text({text: "Enter text to change the content of the Social Timeline Entry."}),
										         new sap.m.Input({})],
										beginButton: new sap.m.Button({
											text: "OK",
											press: function(){
												oDialog.close();
											}
										}),
										afterClose: function(){
											oSocialTimeline.updateTimelineEntry(oDialog.getContent()[1].getValue(), sTimelineEntryId);
										}
									});
									oDialog.open();					 
							} 
							 else if(oEventData.getParameter('key') === 'key2'){
								 var oDialog = new sap.m.Dialog({
									 showHeader: false,
									 content: [new sap.m.Text({text: "Press OK to delete the Social Timeline Entry."})],
									 beginButton: new sap.m.Button({
										 text: "OK",
										 press: function(){
											 oDialog.close();
										 }
									 }),
									 afterClose: function(){
										 oSocialTimeline.deleteTimelineEntry(sTimelineEntryId);
									 }
								 });
								 oDialog.open();
							 }
						}
					}
				});
				/* 
				*	Set the object map by calling the method setBusinessObjectMap. We pass an object that contains information about the 
				*	business object, as well as a customActionCallback.
				*/			
				oSocialTimeline.setBusinessObjectMap({
					serviceModel: oServiceModel,
					collection: oSettings.boCollection,
					applicationContext: "TEST_APP_CONTEXT",
					servicePath: "TestServicePath",
					customActionCallback: function(oOdataEntry){
	                	if(oOdataEntry.TestActorID === "CARTER-NORA" || oOdataEntry.TestActorID === "SAINTCRUIS"){
	                		return [{key:"key1", value: "Edit"}, {key:"key2", value: "Delete"}]
	                	}
					}
				});
				oSocialTimeline.setBusinessObjectKey("'1'");
				/* 	!!!Workaround for the Demokit only!!!
				* 	We need to override the buildImageURL method of the TimelineDataHandler class and insert our own image URLs.
				* 	The function buildImageURL is called by the Social Timeline to build the image URL for the browser to download 
				*	every user's image. Since we want to provide a local copy, we override this method and provide the relative path
				*	to the images.
				*/
				MockServerInitializer.initializeMockData(oSocialTimeline);				
				/* 
				*	Create Component Container for the Social Timeline Component.
				*/
				this.getView()._socialTimelineComponentContainer.setComponent(oSocialTimeline);
				this.getView()._socialTimelineComponentContainer.setHeight("800px");
		}
	});
}, /* bExport= */ true);