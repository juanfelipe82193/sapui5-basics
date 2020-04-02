/* global QUnit, sinon */
sap.ui.define([
    "sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Button",
	"sap/ui/base/Event",
	"sap/ui/qunit/utils/waitForThemeApplied",
	"sap/ui/model/json/JSONModel"
], function(RichTextEditor, Button, Event, waitForThemeApplied, JSONModel) {
	"use strict";

	QUnit.config.testTimeout = 6000;
	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.richtexteditor");

	QUnit.test("Toolbar aggregations", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			}),
			oRTECustomToolbar;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {

			setTimeout(function() {
				oRichTextEditor._pTinyMCE4Initialized.then(function() {
					oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
					// assert
					assert.ok(oRTECustomToolbar.getAggregation("_toolbar"),
								"There should be a toolbar aggregation");
					assert.ok(oRTECustomToolbar.getAggregation("_customInsertImageDialog"),
								"There should be a insert image dialog aggregation");
					assert.ok(oRTECustomToolbar.getAggregation("_customInsertLinkDialog"),
								"There should be a insert link dialog aggregation");
					assert.ok(oRTECustomToolbar.getAggregation("_customTextColorDialog"),
								"There should be a text color dialog aggregation");
					assert.ok(oRTECustomToolbar.getAggregation("_customBackgroundColorDialog"),
								"There should be a background color dialog aggregation");
					assert.ok(oRTECustomToolbar.getAggregation("_customInsertTableDialog"),
								"There should be a insert table dialog aggregation");
					//destroy
					oRichTextEditor.destroy();
					done();
				});
			},0);
		});
	});

	QUnit.test("setButtonGroups", function(assert) {
		// arrange
		var done = assert.async(6),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			}),
			oFontGroup = {
				name: "font-style",
				visible: true,
				row: 0,
				priority: 10,
				buttons: [
					"bold", "italic", "underline", "strikethrough"
				]
			},
			oTextAlignGroup = {
				// Text Align group
				name: "text-align",
				visible: true,
				row: 0,
				priority: 20,
				buttons: [
					"justifyleft", "justifycenter", "justifyright", "justifyfull"
				]
			},
			oInsertGroup = {
				name: "insert",
				visible: false,
				row: 1,
				priority: 50,
				buttons: [
					"image", "emoticons"
				]
			};

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function () {
			var oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oToolbar = oRTECustomToolbar.getAggregation("_toolbar");

			// act
			oRichTextEditor.setButtonGroups([]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 0, "There is no content in the toolbar");
			done();

			// act
			oRichTextEditor.setButtonGroups([oFontGroup]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 4, "There are 4 controls in the toolbar");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("font-style"), "The font-style is currently added in the toolbar.");
			done();

			//act
			oRichTextEditor.setButtonGroups([oTextAlignGroup, oInsertGroup]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 2, "There are 2 controls in the toolbar");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("insert"), "The Insert group is currently added in the toolbar.");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("text-align"), "The TextAlign group is currently added in the toolbar.");

			//destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("setButtonGroups + Custom Button", function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				customButtons: [new Button({
					id: "idCustomBtn",
					text: "Custom Button"
				})]
			}),
			oFontGroup = {
				name: "font-style",
				visible: true,
				row: 0,
				priority: 10,
				buttons: [
					"bold", "italic", "underline", "strikethrough"
				]
			},
			oStructureGroup = {
				name: "structure",
				visible: true,
				row: 1,
				priority: 20,
				buttons: [
					"bullist", "numlist", "outdent", "indent"
				]
			};

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			var oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oToolbar = oRTECustomToolbar.getAggregation("_toolbar"),
				iGroupButtonCount = 0;

			// act
			oRichTextEditor.setButtonGroups([]);
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");
			done();

			// act
			oRichTextEditor.setButtonGroups([oFontGroup]);
			iGroupButtonCount = oFontGroup.buttons.length;
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");
			done();

			//act
			oRichTextEditor.setButtonGroups([oFontGroup, oStructureGroup]);
			iGroupButtonCount = oFontGroup.buttons.length + oStructureGroup.buttons.length;
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");

			//destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("API - Toolbar enablement", function (assert) {
		// Setup
		var done = assert.async(2),
			sRTEFragment = '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:rte="sap.ui.richtexteditor"> ' +
					' ' +
					'   <rte:RichTextEditor  ' +
					'    editorType="TinyMCE4" ' +
					'    width="100%" ' +
					'    height="300px" ' +
					'    editable="false" ' +
					'    customToolbar="true"></rte:RichTextEditor> ' +
					'   ' +
					'  </core:FragmentDefinition>',

			sXMLView = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="myController" displayBlock="true"> ' +
					'    <App> ' +
					'     <Page title="RTE in XMLFragment" id="myPage"></Page> ' +
					'    </App> ' +
					'   </mvc:View>';

		sap.ui.controller("myController", {
			_loadRTEFragment: function () {
				var oView = this.getView();
				var oRTE = sap.ui.xmlfragment({fragmentContent: sRTEFragment, oController: this});
				var oPage = oView.byId("myPage");

				oPage.addContent(oRTE);
				this._runAssertions(oRTE);
			},

			onInit: function () {
				sap.ui.require(["sap/m/Button"], function (Button) {
					this._loadRTEFragment();
				}.bind(this));
			},
			// Assert
			_runAssertions: function (oRichTextEditor) {
				assert.ok(oRichTextEditor, "RTE got instantiated");
				done();

				oRichTextEditor.attachReady(function () {
					var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
					assert.equal(oToolbar.getEnabled(), false, "The custom toolbar should have been initialized with disabled buttons");


					// clean
					this.getView().destroy();
					done();
				}.bind(this));
			}
		});

		// Act
		sap.ui.xmlview({viewContent: sXMLView}).placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("API - RemoveButtonGroup", function (assert) {
		// arrange
		var done = assert.async(3);
		var	oRichTextEditor = new RichTextEditor({
					editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
					width: "100%",
					height: "300px",
					customToolbar: true
				});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

		assert.ok(oToolbar._isButtonGroupAdded("text-align"), "The aggregation is currently added in the toolbar.");
		done();
		assert.ok(oToolbar._findGroupedControls("text-align")[0], "The button is in the custom toolbar wrapper.");
		done();

		oRichTextEditor.attachReady(function () {
			// act
			oToolbar.removeButtonGroup("text-align");

			assert.ok(oToolbar._findGroupedControls("text-align").length === 0, "The button was successfully removed from the toolbar");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("API - AddButtonGroupToContent", function (assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor({
					editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
					width: "100%",
					height: "300px",
					customToolbar: true
				}),
				oButtonGroup = {
					name: "text-align",
					visible: true,
					row: 0,
					priority: 20,
					buttons: [
						"justifyleft", "justifycenter", "justifyright", "justifyfull"
					]
				};

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

		assert.ok(oToolbar._isButtonGroupAdded("text-align"), "The aggregation is currently added in the toolbar.");
		done();
		oRichTextEditor.removeButtonGroup("text-align");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function () {
			// act
			oToolbar.addButtonGroupToContent(oButtonGroup);
			assert.ok(oToolbar._findGroupedControls("text-align")[0], "The text-align button was successfully added back in the toolbar");
			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Toggle Buttons", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE7", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor.getNativeApi().execCommand("Bold");

			setTimeout(function() {
				oRichTextEditor._pTinyMCE4Initialized.then(function() {
					// assert
					assert.equal(sap.ui.getCore().byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").getPressed(), true, "The bold button should be pressed");

					//destroy
					oRichTextEditor.destroy();
					done();
				});
			},0);
		});
	});

	QUnit.test("Toolbar control states/selected items should match the applied styles", function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor("myRTE8", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			sap.ui.getCore().byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").firePress();
			oActiveEditor.execCommand("JustifyCenter");
			oActiveEditor.execCommand("FontSize", false, "12pt");
			oActiveEditor.execCommand("FontName", false, '"comic sans ms", sans-serif');

			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(oActiveEditor.formatter.match("bold"),
									true,
									"The bold style should be applied to the editor");
						done();
						assert.equal(oActiveEditor.formatter.match("aligncenter"),
									true,
									"The JustifyCenter style should be applied to the editor");
						done();
						assert.equal(sap.ui.richtexteditor.EditorCommands["FontFamily"]["ComicSansMS"].commandValue,
									'"comic sans ms", sans-serif',
									"The FontFamily 'Comic Sans MS' style should be applied to the editor");

						// destroy
						oRichTextEditor.destroy();
						done();
					});
				},0);
			}, 0);
		});
	});

	QUnit.test("_getColor(sCommand)", function(assert) {
		// arrange
		var done = assert.async(4),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
					'#000000',
					"The default text color should be returned");
			done();
			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('BackgroundColor'),
					'#ffffff',
					"The default background color should be returned");
			done();

			oActiveEditor.execCommand("ForeColor", false, 'rgb(123, 123, 123)');
			oActiveEditor.execCommand("HiliteColor", false, 'rgb(123, 123, 123)');

			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
									'rgb(123, 123, 123)',
									"The colors should be the same");
						done();
						assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('BackgroundColor'),
									'rgb(123, 123, 123)',
									"The colors should be the same");
						// destroy
						oRichTextEditor.destroy();
						done();
					});
				},0);
			}, 0);
		});
	});

	QUnit.test("Color Palettes integration", function(assert) {
		// arrange
		var done = assert.async(7),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oRTESplitButton = oToolbar._findGroupedControls("font")[2],
				oFakeEventTextColor = new Event(),
				oFakeEventBackgroundColor = new Event();

			oFakeEventTextColor.value = "rgb(100, 149, 237)";
			oFakeEventBackgroundColor.value = "orange";

			assert.equal(oToolbar._getColor('TextColor'),
					"#000000",
					"The initial text color should be the default one");
					done();
			assert.equal(oToolbar._getColor('BackgroundColor'),
					'#ffffff',
					"The initial background color should be the default one");
					done();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			assert.equal(oToolbar._getColor('TextColor'),
					'#000000',
					"The text color should be the default one");
					done();
			assert.equal(oToolbar._getColor('BackgroundColor'),
					"#ffffff",
					"The background color should be the default one");
					done();
			oToolbar.getAggregation('_customTextColorDialog')
					.fireColorSelect(oFakeEventTextColor);
			oToolbar.getAggregation('_customBackgroundColorDialog')
					.fireColorSelect(oFakeEventBackgroundColor);

			setTimeout(function() {
				// assert
				assert.equal(oToolbar._getColor('TextColor'),
						"rgb(100, 149, 237)",
						"The text color should be changed to the color palettes selection");
						done();
				assert.equal(oToolbar._getColor('BackgroundColor'),
						"orange",
						"The background color should be changed to the color palettes selection");
						done();
				assert.equal(oRTESplitButton.getIconColor(),
						"rgb(100, 149, 237)",
						"The icon color should be changed to the color palette selection");
				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("_getColor(sCommand) - applying twice the same color", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oFakeEvent = new Event();

			oFakeEvent.value = "rgb(255, 215, 0)";

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			oActiveEditor.execCommand("ForeColor", false, 'gold');
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[2].firePress();
			oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation('_customTextColorDialog')
					.fireColorSelect(oFakeEvent);

			setTimeout(function() {
				// assert
				assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
							"rgb(255, 215, 0)",
							"The text color should not be changed to the default one");
				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Menu Button", function(assert) {
		// assert
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			var oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oRTEMenuButton = oToolbarWrapper._findGroupedControls('text-align')[0],
				oRTEMenu = oRTEMenuButton.getAggregation("menu"),
				oCenterMenuItem = oRTEMenu.getAggregation("items")[1],
				oCenterMenuItemIcon = oCenterMenuItem.getIcon();

			oRTEMenu.fireItemSelected({
				item: oCenterMenuItem
			});

			assert.equal(oToolbarWrapper._findTextAlignCommandByIcon(oCenterMenuItemIcon), 'Center',
				'_findTextAlignCommandByIcon function should find the correct text align command.');
			done();
			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(oRTEMenuButton.getIcon(), oCenterMenuItemIcon,
							"The menu button icon should be as the JustifyCenter command icon.");

						// destroy
						oRichTextEditor.destroy();
						done();
					});
				},0);
			}, 0);
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Menu Button, selecting the same alignment twice should apply the default one.", function(assert) {
		// assert
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE9", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			var oRTEMenuButton = sap.ui.getCore().byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-TextAlign"),
				oRTEMenu = oRTEMenuButton.getAggregation("menu");
			// act
			oRTEMenu.fireItemSelected({item: oRTEMenu.getAggregation("items")[1]})
					.fireItemSelected({item: oRTEMenu.getAggregation("items")[1]});

			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(oRTEMenuButton.getIcon(),
									"sap-icon://" + sap.ui.richtexteditor.EditorCommands["TextAlign"]["Left"].icon,
									"The menu button icon should be as the default JustifyLeft command icon.");
						// destroy
						oRichTextEditor.destroy();
						done();
					});
				},0);
			}, 0);
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Select", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE14", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor.getNativeApi().execCommand("FontSize", false, "12pt");
			oRichTextEditor.getNativeApi().execCommand("FontName", false, '"comic sans ms", sans-serif');
			sap.ui.getCore().applyChanges();
			setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(sap.ui.getCore().byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-FontFamily").getSelectedItem().getText(),
									"Comic Sans MS",
									"The selected item should be 'Comic Sans MS'");
						// destroy
						oRichTextEditor.destroy();
						done();
					});
			}, 0);
		});
	});

	QUnit.test("RTE.prototype.setEditable() with CustomToolbar", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE10", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true,
				editable: false
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			setTimeout(function() {
				oRichTextEditor._pTinyMCE4Initialized.then(function() {
					oRichTextEditor.getNativeApi().setContent('<p>some</p>');
					sap.ui.getCore().applyChanges();

					setTimeout(function(){
						assert.strictEqual(oRichTextEditor.getNativeApi().getContent().indexOf("span"),
							-1,
							"No additional spans are added in the content on reinizialization");

						// destroy
						oRichTextEditor.destroy();
						done();
					},100);
				});
			}, 0);
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Selected items update", function(assert) {
		// arrange
		var done = assert.async(2),
			selectedFontSizeSpy, selectedFontFamilySpy, selectedFormatBlockSpy,
			oToolbar, oActiveEditor, aFontGroup,
			oRichTextEditor = new RichTextEditor("myRTE14", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupFont : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.addButtonGroup("formatselect");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			aFontGroup = oToolbar._findGroupedControls('font');
			oActiveEditor = oRichTextEditor.getNativeApi();
			selectedFormatBlockSpy = sinon.spy(oToolbar._findGroupedControls('formatselect')[0], "setSelectedItemId");
			selectedFontSizeSpy = sinon.spy(aFontGroup[1], "setSelectedItemId");
			selectedFontFamilySpy = sinon.spy(aFontGroup[0], "setSelectedItemId");

			// act
			oActiveEditor.execCommand("FormatBlock", false, "h1");
			oActiveEditor.execCommand("FontName", false, '"comic sans ms", sans-serif');

			setTimeout(function() {
				oRichTextEditor._pTinyMCE4Initialized.then(function() {
					// assert
					assert.equal(selectedFormatBlockSpy.callCount, 1, "setSelectedItem was called once");
					done();

					assert.equal(selectedFontFamilySpy.callCount, 1, "setSelectedItem was called once");

					// cleanup
					oRichTextEditor.destroy();
					selectedFontFamilySpy.restore();
					selectedFontSizeSpy.restore();
					selectedFormatBlockSpy.restore();
					done();
				});
			}, 0);
		});
	});

	QUnit.test("Undo/Redo action", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE11", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor.getNativeApi().execCommand("Bold", false);
			oRichTextEditor.getNativeApi().execCommand("Undo", false);

			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCE4Initialized.then(function() {
						// assert
						assert.equal(sap.ui.getCore().byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").getPressed(),
									false,
									"The bold button should not be pressed");
						// destroy
						oRichTextEditor.destroy();
						done();
					});
				},0);
			}, 0);
		});
	});

	QUnit.test("_getFontStyleCommand", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE12", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		// assert
		assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getFontStyleCommand(sap.ui.richtexteditor.EditorCommands["FontFamily"]["Verdana"].text), sap.ui.richtexteditor.EditorCommands["FontFamily"]["Verdana"].commandValue);

		// destroy
		oRichTextEditor.destroy();
		done();
	});

	QUnit.test("Custom Dialogs", function(assert) {
		var done = assert.async(),
			openDialog;

		openDialog = function (sGroup, sCommand, doneCallback) {
			// arrange
			var	oRichTextEditor = new RichTextEditor({
					editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont : true,
					showGroupUndo : true,
					showGroupInsert : true,
					showGroupLink : true
				}),
				fnAfterClose = function () {
					assert.ok(!oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").isOpen(),
								"The Insert " + sCommand + " Dialog should closed");

					// destroy
					oRichTextEditor.destroy();
					setTimeout(doneCallback);
				},
				iCommandPosition = sap.ui.richtexteditor.ButtonGroups[sGroup].indexOf(sCommand),
				oToolbarWrapper;

			oRichTextEditor.placeAt("content");
			sap.ui.getCore().applyChanges();

			oRichTextEditor.attachReady(function() {
				oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
				oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").attachAfterClose(fnAfterClose);
				// act
				oToolbarWrapper._findGroupedControls(sGroup)[iCommandPosition].firePress();

				setTimeout(function() {
					// assert
					assert.ok(oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").isOpen(),
								"The Insert " + sCommand + " Dialog should open");
					oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").getButtons()[1].firePress();
				}, 0);
			});
		};

		openDialog('insert', 'InsertImage', function () {
			openDialog('link', 'InsertLink', done);
		});
	});

	QUnit.test("Table Dialog", function(assert) {
		// arrange
		var done = assert.async(5),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			}),
			oInsertTableDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();
		oRichTextEditor.addButtonGroup({
			name: "table",
			visible: true,
			row: 1,
			priority: "60",
			buttons: ["table"]
		});
		var oTableButtonGroup = sap.ui.richtexteditor.ButtonGroups["table"],
			iCommandPosition = oTableButtonGroup.indexOf("InsertTable");

		assert.ok(oTableButtonGroup, 'The "table" group should be added');
		done();
		assert.ok(iCommandPosition !== -1, 'Tabe button should exist');
		done();
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oInsertTableDialog = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_customInsertTableDialog");

			// act
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls("table")[iCommandPosition].firePress();

			setTimeout(function() {
				var aDimensionsInputs,
					sDimensionsLabelText = oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS");

				// assert
				assert.ok(oInsertTableDialog.isOpen(),
							"The Insert Table Dialog should open");
				done();

				var aTableInputs = oInsertTableDialog.getContent()[0].getItems();
				// get all dimensions inputs
				aDimensionsInputs = aTableInputs[5].getItems()
						.filter(function(oItem){return oItem.getMetadata().getName() === "sap.m.Input";});

				aDimensionsInputs.forEach(function(oInput){
					assert.strictEqual(sap.ui.getCore().byId(oInput.getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
							"The correct label is associated with the input");
					done();
				});

				aTableInputs[1].setValue(3);
				aTableInputs[3].setValue(4);
				sap.ui.getCore().applyChanges();

				var rows = aTableInputs[1].getValue(3);
				var cols = aTableInputs[3].getValue(4);

				var oInsertTableStub = sinon.spy(oRichTextEditor.getNativeApi().plugins["table"], "insertTable");

				oInsertTableDialog.getButtons()[0].firePress();

				sinon.assert.calledWith(oInsertTableStub, cols, rows);

				oRichTextEditor.destroy();

			}, 0);
		});
	});

	QUnit.test("Dialogs should have padding", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				showGroupLink: true,
				customToolbar: true
			}),
			oToolbar, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oToolbar = oRichTextEditor && oRichTextEditor.getAggregation("_toolbarWrapper");
		oLinkButton = oToolbar && oToolbar._findGroupedControls('link')[0];

		oRichTextEditor.attachReady(function() {
			// act
			oLinkButton.firePress();
			oLinkDialog = oToolbar && oToolbar.getAggregation("_customInsertLinkDialog");

			setTimeout(function() {
				// assert
				assert.ok(oLinkDialog.hasStyleClass("sapUiPopupWithPadding"),
							"The Insert Link Dialog should have padding class applied");

				oRichTextEditor.destroy();
				done();
			}, 0);
		});
	});

	QUnit.test("FormatBlock with formatselect", function(assert) {
		// arrange
		var done = assert.async(5),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();
		oRichTextEditor.addButtonGroup("formatselect");
		var oFormatBlockGroup = sap.ui.richtexteditor.ButtonGroups["formatselect"],
				iCommandPosition = oFormatBlockGroup.indexOf("FormatBlock");

		assert.ok(oFormatBlockGroup, 'The "formatselect" group should be added');
		done();
		assert.ok(iCommandPosition !== -1, 'formatBlock button should exist');
		done();
		sap.ui.getCore().applyChanges();
		oRichTextEditor.attachReady(function () {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
					oFormatBlockSelect;

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			oRichTextEditor._pTinyMCE4Initialized.then(function () {

				oFormatBlockSelect = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('formatselect')[0];
				assert.equal(oFormatBlockSelect.getSelectedItem().sId, oFormatBlockSelect.getItemAt(0).sId, "The selected item is correct: paragraph");
				done();

				oFormatBlockSelect.setSelectedItemId(0);
				oFormatBlockSelect.fireChange({selectedItem: oFormatBlockSelect.getItems()[0]});
				oActiveEditor.execCommand("FormatBlock", false, sap.ui.richtexteditor.EditorCommands["FormatBlock"]["Heading1"].commandValue);

				// assert
				assert.equal(oFormatBlockSelect.getSelectedItem(), oFormatBlockSelect.getItemAt(1), "The selected item is correct: h1");
				done();
				assert.ok(["Heading 1", "h1"].indexOf(oActiveEditor.getDoc().queryCommandValue("FormatBlock")) > -1, "The Heading 1 format should be applied to the editor");

				// destroy
				oRichTextEditor.destroy();
				done();
			}, 0);
		});
	});

	QUnit.test("FormatBlock with styleselect", function (assert) {
		// arrange
		var done = assert.async(6),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();
		oRichTextEditor.addButtonGroup("styleselect");
		var oFormatBlockGroup = sap.ui.richtexteditor.ButtonGroups["styleselect"],
			iCommandPosition = oFormatBlockGroup.indexOf("FormatBlock");

		assert.ok(oFormatBlockGroup, 'The "formatselect" group should be added');
		done();
		assert.ok(iCommandPosition !== -1, 'formatBlock button should exist');
		done();
		sap.ui.getCore().applyChanges();
		oRichTextEditor.attachReady(function () {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oFormatBlockSelect;

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			oRichTextEditor._pTinyMCE4Initialized.then(function () {

				oFormatBlockSelect = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('formatselect')[0];
				assert.equal(oFormatBlockSelect.getSelectedItem().sId, oFormatBlockSelect.getItemAt(0).sId, "The selected item is correct: paragraph");
				done();

				assert.equal(sap.ui.getCore().byId(oFormatBlockSelect.getAriaLabelledBy()[0]).getText(), oResourceBundle.getText("FORMAT_BUTTON_TOOLTIP"), "Then correct invisible text was set for formatBlock");
				done();

				oFormatBlockSelect.setSelectedItemId(0);
				oFormatBlockSelect.fireChange({selectedItem: oFormatBlockSelect.getItems()[0]});
				oActiveEditor.execCommand("FormatBlock", false, sap.ui.richtexteditor.EditorCommands["FormatBlock"]["Heading1"].commandValue);

				// assert
				assert.equal(oFormatBlockSelect.getSelectedItem(), oFormatBlockSelect.getItemAt(1), "The selected item is correct: h1");
				done();
				assert.ok(["Heading 1", "h1"].indexOf(oActiveEditor.getDoc().queryCommandValue("FormatBlock")) > -1, "The Heading 1 format should be applied to the editor");

				// destroy
				oRichTextEditor.destroy();
				done();
			}, 0);
		});
	});

	QUnit.test("Buttons accessibility", function(assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor("myRTE13", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// act
			setTimeout(function() {
				oRichTextEditor._pTinyMCE4Initialized.then(function() {
					// assert
					var sAriaLabelId0 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[0].getAriaLabelledBy()[0],
						sAriaLabelId1 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[1].getAriaLabelledBy()[0];
					assert.equal(sap.ui.getCore().byId(sAriaLabelId0).getText(), oResourceBundle.getText("FONT_FAMILY_TEXT"), "Then correct invisible text was set for fontFamily");
					done();
					assert.equal(sap.ui.getCore().byId(sAriaLabelId1).getText(), oResourceBundle.getText("FONT_SIZE_TEXT"), "Then correct invisible text set was for fontSize");

					//destroy
					oRichTextEditor.destroy();
					done();
				});
			},0);
		});
	});

	QUnit.module("Insert/Edit Image");

	QUnit.test("_generateImageHTML()", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._generateImageHTML(), '<img/>', "An IMG tag should be created");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Insert Image", function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupInsert : true
			}),
			fnAfterClose = function () {
				oImage = oActiveEditor.dom.select('img')[0];

				assert.equal(oImage.getAttribute('data-sap-ui-rte-image-ratio'), 'false', "The image ratio attribute, should be set to true");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			sDimensionsLabelText = oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS"),
			oToolbarWrapper, oImageButton, oImageDialog, oActiveEditor, aImageDialogContent, oImage, aHBoxItems;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oImageButton = oToolbarWrapper._findGroupedControls('insert')[0];
			oImageDialog = oToolbarWrapper.getAggregation("_customInsertImageDialog");
			aImageDialogContent = oImageDialog && oImageDialog.getContent();
			oImageDialog.attachAfterClose(fnAfterClose);
			aHBoxItems = aImageDialogContent[5].getItems();

			// act
			oActiveEditor = oRichTextEditor.getNativeApi();
			// assert
			assert.ok(!oImageButton.getPressed(), "The image button should not be pressed initially.");
			done();

			oImageButton.firePress();

			setTimeout(function() {
				assert.strictEqual(sap.ui.getCore().byId(aHBoxItems[2].getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
						"The ariaLabelledBy association is correctly set to the width input");
				assert.strictEqual(sap.ui.getCore().byId(aHBoxItems[0].getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
						"The ariaLabelledBy association is correctly set to the height input.");
				assert.ok(!aImageDialogContent[6].getEnabled(),
					"The dimension checkbox should be disabled when there isn't an selected image.");

				aImageDialogContent[1].setValue("../images/screenshot.png");
				aImageDialogContent[3].setValue("some");
				oImageDialog.getButtons()[0].firePress();
			}, 0);
			done();
		});
	});

	QUnit.test("Create an image and open edit dialog", function(assert) {
		// arrange
		var done = assert.async(10),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupInsert : true
			}),
			fnAfterClose = function () {
				oImage = oActiveEditor.dom.select('img')[0];
				assert.equal(oImage.getAttribute('data-sap-ui-rte-image-ratio'), 'true', "The image ratio attribute, should be set to true");
				done();
				assert.equal(oImage.height, '150', "The image height should be applied correctly.");
				done();
				assert.equal(oImage.width, '300', "The image width should be applied correctly.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oImageButton, oImageDialog, oActiveEditor, aImageDialogContent, oImage;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oImageButton = oToolbarWrapper._findGroupedControls('insert')[0];
			oImageDialog = oToolbarWrapper.getAggregation("_customInsertImageDialog");
			aImageDialogContent = oImageDialog && oImageDialog.getContent();
			oImageDialog.attachAfterClose(fnAfterClose);

			// act
			oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<img src="../images/screenshot.png" alt="some" height="100px" width="200px"/>');
			oImage = oActiveEditor.dom.select('img')[0];
			oImage.click();
			oActiveEditor.selection.select(oImage);

			// assert
			setTimeout(function () {
				assert.ok(oImageButton.getPressed(), "The image button should be pressed when an image is selected.");
				done();
				oImageButton.firePress();

				setTimeout(function() {
					assert.ok(aImageDialogContent[6].getEnabled(),
						"The dimension checkbox should be enabled when there is an selected image.");
					done();
					assert.equal(aImageDialogContent[1].getValue(), '../images/screenshot.png',
						"The value of the source input should be the same as the src value of the image.");
					done();
					assert.equal(aImageDialogContent[3].getValue(), 'some',
						"The value of the description text input should be the same as the alt of the image.");
					done();
					assert.equal(aImageDialogContent[5].getAggregation("items")[2].getValue(), '100',
						"The value of the height input should be the same as the height attribute value of the image.");
					done();
					assert.equal(aImageDialogContent[5].getAggregation("items")[0].getValue(), '200',
						"The value of the width input should be the same as the width attribute value of the image.");
					done();
					aImageDialogContent[5].getAggregation("items")[0].setValue('300');
					aImageDialogContent[6].setSelected(true);

					setTimeout(function() {
						aImageDialogContent[6].fireSelect();

						setTimeout(function() {
							assert.equal(aImageDialogContent[5].getAggregation("items")[2].getValue(), '150',
								"The value of the height input should be calculated according to the ratio.");

							oImageDialog.getButtons()[0].firePress();
						}, 0);
						done();
					}, 0);
				}, 0);
			}, 0);
		});
	});

	QUnit.test("Press cancel insert image button", function(assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupInsert : true
			}),
			fnAfterClose = function () {

				assert.ok(!oImageButton.getPressed(),
					"Insert image button should not be pressed if inserting of image is cancelled via cancel button.");


				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oImageButton, oImageDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oImageButton = oToolbarWrapper._findGroupedControls('insert')[0];
			oImageDialog = oToolbarWrapper.getAggregation("_customInsertImageDialog");
			oImageDialog.attachAfterClose(fnAfterClose);

			// assert
			assert.ok(!oImageButton.getPressed(), "The image button should not be pressed initially.");
			done();
			oImageButton.firePress();

			setTimeout(function() {
				oImageDialog.getButtons()[1].firePress();
			}, 0);
		});
	});

	QUnit.module("Insert/Edit Link");

	QUnit.test("Insert Link", function(assert) {
		// arrange
		var done = assert.async(8),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A", "There should be an anchor tag.");
				done();
				assert.ok(oLinkButton.getPressed(), "The link button should be pressed, when an anchor is created.");
				done();
				assert.ok(oUnlinkButton.getEnabled(), "The unlink button should be enabled, when an anchor is selected.");
				done();

				oUnlinkButton.firePress();

				setTimeout(function() {
					assert.ok(!oLinkButton.getPressed(), "When the selection is unlinked, the link button should not be pressed.");
					done();
					assert.ok(!oUnlinkButton.getEnabled(), "When the selection is unlinked, the unlink button should again be disabled.");
					done();
					assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
						"The selection tag should not be an anchor, if the link is unlinked");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			// assert
			assert.ok(!oLinkButton.getPressed(), "The link button should not be pressed, if the selection is not an anchor.");
			done();
			assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should not be enabled, if the selection is not an anchor.");
			done();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Reset dialog fields", function(assert) {
		var done = assert.async(),
			openDialog;

		openDialog = function (sGroup, sCommand, doneCallback) {
			var	oRichTextEditor = new RichTextEditor({
					editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
					customToolbar: true,
					showGroupFont : true,
					showGroupInsert : true,
					showGroupLink : true
				}),
				fnAfterOpen = function () {
					var that = this,
						aControls = oDialog.findAggregatedObjects(true);
					// assert
					aControls.forEach(function (oControl) {
						var sControlName = oControl.getMetadata().getName();
						if (sControlName === "sap.m.Input") {
							assert.strictEqual(oControl.getValue(), '', that.getTitle() + ': The field should be empty');
						} else if (sControlName === "sap.m.CheckBox") {
							assert.strictEqual(oControl.getSelected(), false, that.getTitle() + ': The checkbox should be deselected');
						}
					});

					// destroy
					oRichTextEditor.destroy();
					setTimeout(doneCallback);
				}, oDialog;

			oRichTextEditor.placeAt("content");
			sap.ui.getCore().applyChanges();

			oRichTextEditor.addButtonGroup({
				name: "table",
				visible: true,
				row: 1,
				priority: "60",
				buttons: ["table"]
			});

			sap.ui.getCore().applyChanges();

			oRichTextEditor.attachReady(function() {
				var oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
					aControls;

				oDialog = oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog");
				oDialog.attachAfterOpen(fnAfterOpen);
				aControls = oDialog.findAggregatedObjects(true);

				// act
				aControls.forEach(function (oControl) {
					var sControlName = oControl.getMetadata().getName();

					if (sControlName === "sap.m.Input") {
						oControl.setValue('text');
					} else if (sControlName === "sap.m.CheckBox") {
						oControl.setSelected(true);
					}
				});
				oToolbarWrapper._findGroupedControls(sGroup)[0].firePress();
			});
		};
		openDialog('table', 'InsertTable', function () {
			openDialog('insert', 'InsertImage', done);
		});
	});

	QUnit.test("Insert link with no given href value", function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
					"There should not be an anchor tag, since there was no href value passed.");
					done();
				assert.ok(!oLinkButton.getPressed(), "The link button should remain not pressed.");
				done();
				assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should remain disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Write text, open dialog and change the text before inserting link", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().dom.select('a')[0].text, "text",
					"The text should be changed.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getContent()[3].setValue("text");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Update Link", function (assert) {
		// arrange
		var done = assert.async(),
			oModel = new JSONModel({value: '<a href="https://sap.com">Sap</a>'}),
			sExpectValue = '',
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink: true,
				value: '{/value}'
			}).setModel(oModel),
			fnAfterClose = function () {
				assert.ok(oRichTextEditor.getValue() !== sExpectValue, "Value should have changed. This means that the binding has been triggered");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function () {
			sExpectValue = oRichTextEditor.getValue();

			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function () {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getContent()[3].setValue("text");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Cancel insert link", function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
					"There should not be an anchor tag, since the cancel button was pressed");
					done();
				assert.ok(!oLinkButton.getPressed(), "The link button should remain not pressed.");
				done();
				assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should remain disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[1].firePress();
			}, 0);
		});
	});

	QUnit.test("Create and open edit dialog", function(assert) {
		// arrange
		var done = assert.async(4),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true,
				width: "100%"
			}),
			fnAfterClose = function () {
				assert.ok(oLinkButton.getPressed(), "The link button should be pressed.");
				done();
				assert.ok(oUnlinkButton.getEnabled(), "The unlink button should be disabled.");
				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<a href="#">some</a>');
			oActiveEditor.selection.setCursorLocation(oActiveEditor.dom.select('a')[0]);
			oLinkButton.firePress();

			setTimeout(function() {
				assert.equal(oLinkDialog.getContent()[1].getValue(), '#',
					"The value of the url input should be the same as the href value.");
					done();
				assert.equal(oLinkDialog.getContent()[3].getValue(), 'some',
					"The value of the display text input should be the same as the value of the anchor.");
				oLinkDialog.getButtons()[1].firePress();
			}, 0);
			done();
		});
	});

	QUnit.test("Delete the href value of an existin anchor", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				customToolbar: true,
				showGroupLink : true,
				width: "100%"
			}),
			fnAfterClose = function () {
				assert.ok(!oRichTextEditor.getNativeApi().dom.select('a').length, "The element should be unlinked");
				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<a href="#">some</a>');
			oActiveEditor.selection.setCursorLocation(oActiveEditor.dom.select('a')[0]);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].resetProperty('value');
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.module("Custom Toolbar Priority");

	QUnit.test("Increase priority", function(assert) {
		// arrange
		var done = assert.async(8),
			sBoldText = oResourceBundle.getText("BOLD_BUTTON_TOOLTIP"),
			sItalicText =  oResourceBundle.getText("ITALIC_BUTTON_TOOLTIP"),
			sUnderlineText = oResourceBundle.getText("UNDERLINE_BUTTON_TOOLTIP"),
			sStrikeThroughText = oResourceBundle.getText("STRIKETHROUGH_BUTTON_TOOLTIP"),
			oToolbar, aContent, oFontStyleGroup,
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		aContent = oToolbar.getContent();

		// assert that the initial position of the buttons from group "font-style" is correct
		assert.strictEqual(aContent[0].getText(), sBoldText, "The Bold button is added an position 0.");
		done();
		assert.strictEqual(aContent[1].getText(), sItalicText, "The Italic button is added an position 1.");
		done();
		assert.strictEqual(aContent[2].getText(), sUnderlineText, "The Underline button is added an position 2.");
		done();
		assert.strictEqual(aContent[3].getText(), sStrikeThroughText, "The Strikethrough button is added an position 3.");
		done();

		oRichTextEditor.attachReady(function () {
			oFontStyleGroup = oRichTextEditor.getButtonGroups()[0];

			// act
			oRichTextEditor.removeButtonGroup("font-style");
			// increase customToolbarPriority
			oFontStyleGroup.customToolbarPriority = 40;
			// add the altered group back in the toolbar
			oRichTextEditor.addButtonGroup(oFontStyleGroup);

			sap.ui.getCore().applyChanges();

			// assert that the changed positions of the buttons from group "font-style" is correct
			// and the buttons are added in correct order
			aContent = oToolbar.getContent();
			assert.strictEqual(aContent[1].getText(), sBoldText, "The Bold button is added an position 1.");
			done();
			assert.strictEqual(aContent[2].getText(), sItalicText, "The Italic button is added an position 2.");
			done();
			assert.strictEqual(aContent[3].getText(), sUnderlineText, "The Underline button is added an position 3.");
			done();
			assert.strictEqual(aContent[4].getText(), sStrikeThroughText, "The Strikethrough button is added an position 4.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Decrease priority", function(assert) {
		// arrange
		var done = assert.async(8),
			oStructureGroup, oToolbar, aContent,
			sBulletedListText = oResourceBundle.getText("UNORDERED_LIST_BUTTON_TOOLTIP"),
			sNumberedListText = oResourceBundle.getText("ORDERED_LIST_BUTTON_TOOLTIP"),
			sIncreaseIndentText = oResourceBundle.getText("OUTDENT_BUTTON_TOOLTIP"),
			sDecreaseIndentText = oResourceBundle.getText("INDENT_BUTTON_TOOLTIP"),
			oRichTextEditor = new RichTextEditor({
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		aContent = oToolbar.getContent();

		// assert that the initial position of the buttons from group "font-style" is correct
		assert.strictEqual(aContent[9].getText(), sBulletedListText, "The Bulleted list button is added an position 9.");
		done();
		assert.strictEqual(aContent[10].getText(), sNumberedListText, "The Numbered list button is added an position 10.");
		done();
		assert.strictEqual(aContent[11].getText(), sIncreaseIndentText, "The Increase indent button is added an position 11.");
		done();
		assert.strictEqual(aContent[12].getText(), sDecreaseIndentText, "The Decrease indent button is added an position 12.");
		done();

		oRichTextEditor.attachReady(function () {
			oStructureGroup = oRichTextEditor.getButtonGroups()[3];

			// act
			oRichTextEditor.removeButtonGroup("structure");
			sap.ui.getCore().applyChanges();

			// decrease customToolbarPriority
			oStructureGroup.customToolbarPriority = 10;

			// add the altered buttons group in the toolbar
			oRichTextEditor.addButtonGroup(oStructureGroup);
			sap.ui.getCore().applyChanges();

			aContent = oToolbar.getContent();

			// assert that the changed positions of the buttons from group "structure" is correct
			assert.strictEqual(aContent[0].getText(), sBulletedListText, "The Bulleted list button is added an position 0.");
			done();
			assert.strictEqual(aContent[1].getText(), sNumberedListText, "The Numbered list button is added an position 1.");
			done();
			assert.strictEqual(aContent[2].getText(), sIncreaseIndentText, "The Increase indent button is added an position 2.");
			done();
			assert.strictEqual(aContent[3].getText(), sDecreaseIndentText, "The Decrease indent button is added an position 3.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Custom Button position", function(assert) {
		// arrange
		var done = assert.async(3),
			oFontStyleGroup, oToolbar, oStrikeThroughBtn,
			sStrikeThroughText =  oResourceBundle.getText("STRIKETHROUGH_BUTTON_TOOLTIP"),
			oCustomBtn = new Button({
				text: "Custom Button"
			}),
			oRichTextEditor = new RichTextEditor("myRTE", {
				editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
				width: "100%",
				height: "300px",
				customToolbar: true,
				customButtons: [oCustomBtn]
			});

		oRichTextEditor.placeAt("content");
		sap.ui.getCore().applyChanges();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		oStrikeThroughBtn = oToolbar.getContent()[3];

		// check the initial position of the reference button
		assert.strictEqual(oStrikeThroughBtn.getText(), sStrikeThroughText, "The last button of font-style group is placed correctly");
		done();

		oFontStyleGroup = oRichTextEditor.getButtonGroups()[0];

		oRichTextEditor.removeButtonGroup("font-style");
		oFontStyleGroup.customToolbarPriority = 2000;
		oRichTextEditor.addButtonGroup(oFontStyleGroup);
		sap.ui.getCore().applyChanges();

		oRichTextEditor.attachReady(function () {
			oStrikeThroughBtn = oToolbar.getContent()[20];

			// assure that the reference button is repositioned
			assert.strictEqual(oStrikeThroughBtn.getText(), sStrikeThroughText, "The last button of font-style group is repositioned after priority change");
			done();
			assert.ok(oToolbar.indexOfContent(oStrikeThroughBtn) < oToolbar.indexOfContent(oCustomBtn), "then the group is positioned before the custom Button");

			// clean
			oRichTextEditor.destroy();
			oCustomBtn = null;
			done();
		});
	});

	return waitForThemeApplied();
});
