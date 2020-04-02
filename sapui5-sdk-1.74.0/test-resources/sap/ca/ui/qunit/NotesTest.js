window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.Notes");
    jQuery.sap.require("sap.ca.ui.ExpansibleFeedListItem");
    jQuery.sap.require("sap.ui.core.IconPool")
    var sLongText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur diam non hendrerit posuere. Fusce quis purus in nunc porttitor fringilla. Suspendisse commodo ullamcorper convallis. Maecenas placerat erat eget enim blandit porta. Aliquam ac lectus venenatis, ornare mi a, venenatis lectus. Aenean elementum metus condimentum tellus volutpat, nec lobortis massa sodales. Morbi sem felis, eleifend iaculis mauris non, egestas vestibulum libero. Duis lacinia adipiscing elit nec molestie. Donec at nibh arcu. Nam viverra varius felis vitae posuere. Praesent faucibus pulvinar fringilla. Donec ultricies laoreet nisi. Cras venenatis leo eu dolor pharetra, at porta arcu accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent malesuada est at magna posuere dictum. Aenean ut rhoncus erat. Phasellus sed fermentum magna. Cras commodo condimentum orci et semper. Pellentesque nec nunc dui. Pellentesque laoreet orci quis mauris imperdiet, sit amet tincidunt libero dapibus. Proin velit sem, tincidunt sed odio et, interdum ullamcorper ante. Integer mauris lorem, venenatis et odio a, pellentesque dignissim mauris. Sed sollicitudin nisi sed turpis vulputate pharetra. Sed porttitor massa est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam pulvinar justo commodo auctor. Praesent hendrerit tellus quis nisl laoreet, in elementum massa tincidunt. Aliquam adipiscing arcu velit, non fringilla leo varius at. Donec lorem lorem, vestibulum nec lectus eu, mattis dapibus purus. Vestibulum posuere nisi at urna accumsan rutrum. Quisque sagittis malesuada nisi, eu malesuada velit dignissim vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer nisl arcu, dapibus eu gravida id, tincidunt eget nisi. Fusce a porttitor elit. In hendrerit ligula at mauris semper, nec interdum velit tincidunt. Vivamus porttitor posuere metus, eget tincidunt lectus sodales nec. Aenean venenatis, diam scelerisque lacinia bibendum, risus orci congue mauris, ut auctor nisi mauris ut metus. Nunc ultrices ac turpis a imperdiet. Curabitur non bibendum massa. Nam eu arcu volutpat, congue risus eu, aliquet elit. Aenean consequat malesuada orci eget ullamcorper. Aliquam gravida vel tortor lacinia condimentum. Donec sed leo at purus porttitor fermentum ut non metus. Nunc vitae ipsum mauris. Phasellus mollis mattis magna, a dictum mauris porttitor id. Ut sit amet accumsan libero. Aenean eu justo odio. Morbi eu placerat ipsum. Nunc vulputate turpis at tellus aliquam, ut rhoncus dui vulputate. Integer accumsan est eget bibendum malesuada. Quisque nec velit dui. Sed adipiscing viverra metus, a tristique est convallis quis. Ut mollis purus tellus, ut pharetra libero gravida vel. Vivamus vehicula egestas dolor a commodo. Ut ut ligula odio. Cras et ante a est consectetur lobortis. In ut diam id urna aliquet tincidunt at eu turpis. Morbi convallis elit eu elit venenatis sodales. Integer congue faucibus urna quis rutrum."

    var oData = {comments: []};
    oData.comments.push(getComment(sLongText));
    oData.comments.push(getComment());
    oData.comments.push(getComment());
    oData.comments.push(getComment());
    oData.comments.push(getComment());
    oData.comments.push(getComment());

    var oFeedListItem = new sap.ca.ui.ExpansibleFeedListItem({
        sender: "{sender}",
        text: "{text}",
        icon: "{icon}",
        timestamp: "{timestamp}"
    });

    var oNotes = new sap.ca.ui.Notes("notes", {
        items: {
            path: "/comments",
            template: oFeedListItem
        },
        growing: true,
        showNoteInput: false,
        growingThreshold: 4
    });

    var oModel = new sap.ui.model.json.JSONModel(oData);
    oNotes.setModel(oModel);
    oNotes.placeAt("content");
    sap.ui.getCore().applyChanges(); // force rendering

    ///////////////
    //Testing Part: Notes
    ///////////////
    module("Notes - Object Create");


    function getComment(sText) {
        var iRandomNumber = Math.floor(Math.random() * sap.ui.core.IconPool.getIconNames().length);
        var sRandomIconName = sap.ui.core.IconPool.getIconNames()[iRandomNumber];
        var oComment = {
            sender: "Sender Name",
            timestamp: Date(),
            text: sText,
            icon: sap.ui.core.IconPool.getIconURI(sRandomIconName),
            info: "Approved"
        };
        return oComment;
    }

    function item(index) {
        var $ul = jQuery("#notes-listUl");
        var $Item = $ul.children(":eq(" + index + ")");
        var bSeeMore = $Item.hasClass("sapCaUiExpansibleFeedListItemSeeMore");
        var bSeeLess = $Item.hasClass("sapCaUiExpansibleFeedListItemSeeLess");
        return {
            showsSeeMore: bSeeMore,
            showsSeeLess: bSeeLess,
            ref: $Item
        };
    }


    test("Object Id", function () {
        strictEqual(oNotes.getId(), "notes", "Notes have ID 'notes'");
    });

    test("Data renders properly", function () {
        var $ul = jQuery("#notes-listUl");
        ok(jQuery.sap.domById("notes"), "Notes list should be rendered");
        equal($ul.length, 1, "Notes list should have its list rendered");
        equal($ul.children().length, 4, "Notes should have four items rendered");
    });

    asyncTest("Notes input 1", function () {
        var $div = jQuery("#notes-noteInput");
        equal($div.length, 0, "NoteInput should be rendered");
        oNotes.setShowNoteInput(true);
        window.setTimeout(function () {
            var $div = jQuery("#notes-noteInput");
            equal($div.length, 1, "NoteInput should NOT be rendered");

            start();
        }, 0);

    });

    asyncTest("ExpansibleFeedListItem", function () {
        equal(item(0).showsSeeMore, true, "First Item Should have See more visible");
        equal(item(1).showsSeeMore, false, "Second Item Should NOT have See more visible");
        oNotes.getItems()[0]._oSeeMoreLink.firePress();
        equal(item(0).showsSeeLess, true, "First Item Should show See less");
        equal(oNotes.getItems()[0].$().find("#" + oNotes.getItems()[0].getId() + "-text").get(0).style.height, "auto", "Height should be auto now, meaning that the element has been expanded");
        start();
    });


    module("Notes - input tests");

    test("Notes input 2 check init value", function () {
        var sPlaceholderText = "Hello World";
        var oNotes2 = new sap.ca.ui.Notes({
            items: {
                path: "/comments",
                template: oFeedListItem
            },
            growing: true,
            showNoteInput: false,
            growingThreshold: 4,
            placeholder: sPlaceholderText
        });
        equal(oNotes2._oTextArea.getPlaceholder(), sPlaceholderText, "NoteInput field should contain the placeholder value ('" + sPlaceholderText + "')");
    });

    test("Notes input 3 check input value", function () {
        oNotes._oTextArea.setValue(sLongText);
        equal(oNotes._oTextArea.getValue().length, 1000, "NoteInput has the same value as assigned");
    });

    test("Notes clear() method check", function () {
        oNotes._oTextArea.setValue(sLongText);
        oNotes.clear();
        equal(oNotes._oTextArea.getValue().length, 0, "NoteInput should be empty");
    });

    test("Notes reset() method check", function () {
        oNotes._oTextArea.setValue(sLongText);
        oNotes.reset();
        equal(oNotes._oTextArea.getValue().length, 0, "NoteInput should be empty");
    });

    asyncTest("Notes input 4 check add button", function () {
        oNotes._oTextArea.setValue(sLongText);
        equal(oNotes._oTextArea.getValue().length, 1000, "NoteInput has the value before click on Add button");

        oNotes._oButton.firePress();

        window.setTimeout(function () {
            equal(oNotes._oTextArea.getValue().length, 0, "NoteInput has empty string after click on Add button");
            start();
        }, 0);
    });

    asyncTest("Object Creation and Destroy with Id", function () {

        var testID = "NOTES1",
            oNotes = new sap.ca.ui.Notes(testID, {}),
            oNotes2;

        strictEqual(oNotes.getId(), testID, "Notes has ID: " + testID);
        oNotes.placeAt("content");
        sap.ui.getCore().applyChanges();

        setTimeout(function () {

            // find just created object byId
            oNotes2 = new sap.ui.getCore().byId(testID);
            ok(!!oNotes2, "Object created and found byId");
            ok(oNotes2.$().size() > 0, "DOM has some content");

            // Destroy object
            oNotes2.destroy();
            sap.ui.getCore().applyChanges();

            ok(oNotes2.$().size() == 0, "DOM content destroyed");

            // try to find destroyed object
            setTimeout(function () {

                var oNotes3 = new sap.ca.ui.Notes(testID);
                ok(oNotes3, "UI5 Object still can be found");
                ok(oNotes3.$().size() == 0, "But DOM content is still destroyed");

                start();
            }, 0);
        }, 0);

        test("textMaxLength property test", function () {
            equal(oNotes.getTextMaxLength(), 1000, "Check default value is 1000");

            oNotes.setTextMaxLength(250);
            oNotes._oTextArea.setValue(sLongText);
            equal(oNotes._oTextArea.getValue().length, 250, "NoteInput has the same value as assigned");
        });
    });
});
