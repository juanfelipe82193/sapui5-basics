sap.ui.define(["./SampleNameProvider", "sap/ui/core/mvc/Controller", "./mockserver/MockServerInitializer", "sap/collaboration/components/fiori/sharing/attachment/Attachment"], function(SampleNameProvider, Controller, MockServerInitializer, Attachment) {
	return Controller.extend(SampleNameProvider.getQualifiedName() + ".Controller", {
		/**
		 * This is the basic object to be used when creating the share dialog component for the
		 * share dialog component samples in the explored app. It's the responsibility of
		 * the particular samples that extend this class to alter this object as
		 * necessary. This object is to be initialized only once.
		 * @private
		 */
		_oShareDialogComponentObject: null,
		
		/**
		 * To keep track of if the mockservers were already initialized, since they're
		 * initialized statically, this boolean value is used.
		 * @private
		 */
		_areMockserversInitialized: false,
		
		/**
		 * This method is call as many times as subclasses are initialized. It's
		 * important to initialize static methods only once.
		 */
		onInit: function() {
			/**
			 * The derived class (a.k.a. subclass) is responsible for instantiating
			 * this instance variable. The derived class should use the
			 * _oShareDialogComponentObject as a base object
			 * for creating the component.
			 * @private
			 */
			this._oShareDialogComponent= null;
			
			if (this._oShareDialogComponentObject === null) {
				// I'll use the data provided by the explored app instead of our own.
				// This is encouraged by the SAPUI5 team to ensure a consistent feeling
				// across samples and makes it easier for consumers to understand
				// our samples. The model, because of its static nature, is
				// only initialized once.
				var oViewModel = new sap.ui.model.json.JSONModel();
				oViewModel.loadData(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"), null, false) ;
				this.getView().setModel(oViewModel);
				
				var oObjectListItem = new sap.m.ObjectListItem({
					"title": "{Name}",
					"number": "{Price}",
					"numberUnit": "{CurrencyCode}",
					"firstStatus": new sap.m.ObjectStatus({
						"text": "{Status}",
						"state": {
							"path": "Status",
							"formatter": function(sStatus) {
								switch (sStatus) {
									case "Available":
										return "Success";
									case "Out of Stock":
										return "Warning";
									case "Discontinued":
										return "Error";
									default:
										return "None";
								}
							}
						}
					}),
					"attributes": [
					    new sap.m.ObjectAttribute({"text": "{WeightMeasure} {WeightUnit}"}),
					    new sap.m.ObjectAttribute({"text": "{Width} x {Depth} x {Height} {DimUnit}"})
					]
				});
				oObjectListItem.setModel(oViewModel);
				var oBindingContext = oViewModel.createBindingContext("/ProductCollection/0");
				oObjectListItem.setBindingContext(oBindingContext);
				
				this._oShareDialogComponentObject = {
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							display: oObjectListItem,
							id: "http://sap.com/odata/SaleOrders(111)",
							share: oBindingContext.getProperty("Description")
						}
					}
				};
				
				var aAttachments = [];
				([
				  	["PDF Document.pdf", "application/pdf", "http://localhost/odata.srv/files/PDF Document.pdf"],
				  	["Word Doc.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "http://localhost/odata.srv/files/Word Doc.docx"],
				  	["Excel Spreadsheet.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "http://localhost/odata.srv/files/Excel Spreadsheet.xlsx"],
				  	["Presentation.pptxx", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "http://localhost/odata.srv/files/Presentation.pptx"],
				  	["Image1.jpg", "image/jpg", "http://localhost/odata.srv/files/Image1.jpg"],
				  	["Image2.png", "image/png", "http://localhost/odata.srv/files/Image2.png"],
				  	["Image3.gif", "image/gif", "http://localhost/odata.srv/files/Image3.gif"],
				  	["Video1.wmv", "video/x-ms-wmv", "http://localhost/odata.srv/files/Video1.wmv"],
				  	["Video2.mov", "video/quicktime", "http://localhost/odata.srv/files/Video2.mov"],
				  	["Video3.mpg", "video/mpeg", "http://localhost/odata.srv/files/Video3.mpg"]
				]).forEach(function(fileData, index, aFileData){
					aAttachments.push(new Attachment(fileData[0], fileData[1], fileData[2]));
				});
				
				this._oShareDialogComponentObject.settings.attachments = {attachmentsArray: aAttachments};
				
				this._oShareDialogComponent = sap.ui.getCore().createComponent(this._oShareDialogComponentObject);
			}
			
			MockServerInitializer.initializeMockServers(SampleNameProvider.getName());
			MockServerInitializer.initializeMockData(this._oShareDialogComponent);
		},
		onPress: function() {
			this._oShareDialogComponent.open();
		}
	});
}, /* bExport= */ true);