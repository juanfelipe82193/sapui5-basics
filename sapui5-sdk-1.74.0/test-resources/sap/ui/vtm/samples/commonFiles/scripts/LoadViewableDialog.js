"use strict";
jQuery.sap.require("sap.ui.layout.form.Form");
jQuery.sap.require("sap.ui.unified.FileUploader");

var LoadViewableDialog = {};

LoadViewableDialog.createDialog = function(vtm){
    "use strict";
    var dlg;
    var remoteFileBox;
    
    var loadViewables = function(sources, scene) {
        if (!sources.length) { return; }
        var viewables = sap.ui.vtm.ArrayUtilities.fromArrayLike(sources).map(function(source) {
            var sourceName = typeof source === "string" ? source : source.name;
            return new sap.ui.vtm.Viewable({
                source: source,
                name: sourceName
            });
        });
        scene.loadViewablesAsync(viewables);
    };

    var loadRemoteButton = new sap.m.Button({
        text: "Download",
        enabled: false,
        layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"}),
        press: function (event) {
            var urls = remoteFileBox.getValue().split('\n');
            remoteFileBox.setValue("");
            dlg.close();
            loadViewables(urls, vtm.getScene());
        }
    });

    remoteFileBox = new sap.m.TextArea({
        rows: 4,
        liveChange: function(oEvent) {
            var url = oEvent.getSource().getValue();
            loadRemoteButton.setEnabled(url.length != 0);
        }
    });

    var fileUploader = new sap.ui.unified.FileUploader({
        width: "100%",
        placeholder: "Local File Name",
        fileType: "vds",
        multiple: true,
        change: function (event) {
            var localFiles = event.getParameter("files");
            if (localFiles) {
                dlg.close();
                loadViewables(localFiles, vtm.getScene());
                fileUploader.clear();
            }
        }
    });

    var cancelButton = new sap.m.Button({
        text: "Cancel",
        press: function (event) {
            dlg.close();
        }
    });

    var form = new sap.ui.layout.form.Form({
        layout: new sap.ui.layout.form.GridLayout(),
        formContainers:  [
            new sap.ui.layout.form.FormContainer({
                formElements: [
                    new sap.ui.layout.form.FormElement({
                        fields: [remoteFileBox, loadRemoteButton]
                    }),
                    new sap.ui.layout.form.FormElement({
                        fields: [fileUploader]
                    })
                ]
            })
        ]
    });

    var sId = vtm.getId() + "_LoadFileDialog"
    dlg = new sap.m.Dialog(sId, {
        title: "Select Viewable",
        content: [form],
        buttons: [cancelButton]
    });
    return dlg;
};