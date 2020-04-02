sap.ui.define(["sap/ui/core/util/MockServer"], function(MockServer) {
	var MockServerInitializer = function(){};
	MockServerInitializer._mockServerInitializationData = null;
	MockServerInitializer._initializeMockServerInitializationData = function(sSampleName) {
		var sMockServerDataFolderPath = "test-resources/sap/collaboration/demokit/sample/" + sSampleName + "/mockserver/";
		MockServerInitializer._mockServerInitializationData = {
			jam: {
				mockServer: null, // This is a reference to the MockServer instance for the Jam mock server.
				rootURI: '/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/', // All requests prefixed with this string will be intercepted.
				mockServerSimulateFunctionArguments: [ // This array defines the arguments to pass the MockServer's simulate function.
					sMockServerDataFolderPath + 'jamodata/JamODataV1_metadata.xml', // This is the path to the metadata document.
					{
						sMockdataBaseUrl: sMockServerDataFolderPath + 'jamodata/', // This is the path to the folder where the responses are stored.
						bGenerateMissingMockData: false // This tells the mock server not to respond with its own data for non-defined responses.
					}
				],
				aRequestData: [ // This array defines addition responses the mock server must provide.
				                // The arrays within this array have 6 elements. The 6 elements together define the request/response
				                // object added to the mock server's requests array. See the loop (call to forEach) to better understand
				                // how each of the elements are used.
					['GET', /\//, 'respondFile', 200, {"x-csrf-token" : "123456"}, sMockServerDataFolderPath + 'jamodata/JamODataRoot.json'],
					['GET', /Self/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/Self.json'],
					['GET', /Folders\\(\\'Folder-(w+)\\'\\)\/Folders/, 'respondJSON', 200, null, '{"d":{"results":[]}}'],
					['HEAD', /files\/(.*)/, 'respond', 200, {"Content-Length": 31}, null],
					['GET', /files\/(.*)/, 'respondFile', 200, null, sMockServerDataFolderPath + 'responses/testFile.txt'],
					['POST', /PostContentItem\/\\?(.*)/, 'respondJSON', 200, null, '{"d":{"results":[]}}'],
					['GET', /Groups.*Folder.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'responses/folders.json'],
					['GET', /Folders.*Folders.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'responses/folders.current.json'],
					// ['POST', /ExternalObjects/, 'respondJSON', 200, null, '{"d":{"results":[]}}']
					['POST', /ExternalObjects/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/ExternalObjects.json'],
					['GET', /ExternalObjects.*FeedEntries.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/FeedEntries.json'],
					['GET', /Members_Autocomplete.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/Members_AutoComplete.json'],
					['GET', /ExternalObjects_FindByExidAndObjectType.+/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/ExternalObjects_FindByExidAndObjectType.json'],
					['GET', /FeedEntries.*Replies.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/Replies.json'],
					['POST', /FeedEntries.*Replies/, 'respondJSON', 200, null, '{"d":{"message": "Reply added..."}}'],
					['POST', /Activities/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/Activities.json'],
					['GET', /Activities.*FeedEntry.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/FeedEntryFromActivity.json'],
					['GET', /MemberProfiles.*PhoneNumbers/, 'respondFile', 200, null, sMockServerDataFolderPath + 'jamodata/PhoneNumbers.json']
				]
			},
			jamrest: {
				mockServer: null,
				rootURI: "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/",
				aRequestData: [
					['POST', /feed\/post/, 'respond', 200, null, null]
				]
			},
			smi: {
				mockServer: null,
				rootURI: "/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV/",
				mockServerSimulateFunctionArguments: [
					sMockServerDataFolderPath + "smiodata/SMIV2_metadata.xml"
				],
				aRequestData: [
					['GET', /GetCollaborationHostURL/, 'respondJSON', 200, {}, '{"d": {"GetCollaborationHostURL": {"__metadata": {"type": "SM_INTEGRATION_V2_SRV.CollaborationHostURL"}, "URL": "http://example.com"}}}'],
					['GET', /MapInternalBOToExternalBO.+/, 'respondFile', 200, null, sMockServerDataFolderPath + 'smiodata/MapInternalBOToExternalBO.json'],
					['POST', /UploadTargetFile.*/, 'respondJSON', 200, null, '{"d": {"results":[]}}'],
					['GET', /GetJamConfigurationStatus/, 'respondFile', 200, null, sMockServerDataFolderPath + 'smiodata/GetJamConfigurationStatus.json']
				]
			},
			timeline: {
				mockServer: null,
				rootURI: "/sap/opu/odata/sap/Z_TIMELINE_SRV/",
				mockServerSimulateFunctionArguments: [
	  				sMockServerDataFolderPath + "testserviceodata/ServiceMetadata.xml",
	  				{bGenerateMissingMockData: false}
	  			],
	  			aRequestData: [
	  				['GET', /TestBusinessObjects.*TestTimelineNavigationPath.*/, 'respondFile', 200, null, sMockServerDataFolderPath + 'testserviceodata/TimelineEntries.json']
	  			]
			}
		};
	};
	MockServerInitializer.initializeMockServers = function(sSampleName, aMockServersToInitialize) {
		if (MockServerInitializer._mockServerInitializationData === null) {
			MockServerInitializer._initializeMockServerInitializationData(sSampleName);
		}
		var mockServersToInitialize;
		var mockServerToInitialize;
		if (aMockServersToInitialize) {
			mockServersToInitialize = aMockServersToInitialize;
		} else {
			mockServersToInitialize = [];
			for (mockServerToInitialize in MockServerInitializer._mockServerInitializationData) {
				mockServersToInitialize.push(mockServerToInitialize);
			}
		}
		var mockServerInitializationData;
		var mockServer;
		var aRequests;
		mockServersToInitialize.forEach(function(mockServerToInitialize) {
			mockServerInitializationData = MockServerInitializer._mockServerInitializationData[mockServerToInitialize];
			mockServer = mockServerInitializationData.mockServer;
			if (!mockServer) {
				mockServer = new MockServer({
					rootUri: mockServerInitializationData.rootURI
				});
				
				if (mockServerInitializationData.mockServerSimulateFunctionArguments) {
					mockServer.simulate.apply(mockServer, mockServerInitializationData.mockServerSimulateFunctionArguments);
				}
				
		 		aRequests = mockServer.getRequests();
		 		mockServerInitializationData.aRequestData.forEach(function(requestData) {
		 			aRequests.push({
			 			method: requestData[0],
			 			path: requestData[1],
			 			response: function(oXHR){
			 				oXHR[requestData[2]](requestData[3], requestData[4], requestData[5]);
			 				return true;
			 			}
			 		});
		 		});
		 		
		 		mockServer.setRequests(aRequests);
			    mockServer.start();
			    
			    mockServerInitializationData.mockServer = mockServer;
			}
		});
	};
	MockServerInitializer.initializeMockData = function(oComponent) {
		oComponent._oSharingDialog = oComponent._createSharingDialog();
		oComponent._createSharingView();
		var oController = oComponent.oSharingView.getController();
		oController._buildThumbnailImageURL = mockBuildThumbnailUrl;

		function mockBuildThumbnailUrl(sUserId) {
			if(sUserId === "1Q5Tc2tDj5Yu16wWucqC3g"){
				return "test-resources/sap/collaboration/demokit/images/logos/SAPAG1.jpg"
			}
			else if(sUserId === "1xxigb4L3zhxwKbiwAu6Ul"){
				return "test-resources/sap/collaboration/demokit/images/logos/SAPAG2.png"
			}
			else if(sUserId === "m828rvEROkq9iieyWS9jqQ"){
				return "test-resources/sap/collaboration/demokit/images/logos/SAPAG3.png"
			}
			else if(sUserId === "UVsqNdArd9fCEsaGiVVQag"){
				return "test-resources/sap/collaboration/demokit/images/logos/SAPAG4.jpg"
			}
			else 
				return "";
		}
	};
	return MockServerInitializer;
}, /* bExport= */ true);