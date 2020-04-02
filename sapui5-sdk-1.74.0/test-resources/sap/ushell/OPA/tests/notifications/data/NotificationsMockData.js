// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    var notificationsByDateDesc = {
        "@odata.context": "$metadata#Notifications",
        "value": [
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "sap-xapp-state-data",
                        "Value": "{\"selectionVariant\":{\"SelectionVariantID\":\"MyVariant\",\"SelectOptions\":[{\"PropertyName\":\"CompanyCode\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0001\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0002\",\"High\":null}]},{\"PropertyName\":\"FiscalYear\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"2014\",\"High\":null}]},{\"PropertyName\":\"GLAccount\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"10000\",\"High\":\"20000\"},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"30000\",\"High\":null}]}]}}"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #2846 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1865 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1867 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #1651 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #423 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #242 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            }
        ]
    };

    var notificationsByDateAsc = {
        "@odata.context": "$metadata#Notifications",
        "value": [
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #1651 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #423 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #242 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #2846 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1865 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1867 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            }
        ]
    };
    var notificationsPriority = {
        "@odata.context": "$metadata#Notifications",
        "value": [
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #2846 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1865 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappstatesample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1867 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderId",
                        "Value": "236400"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #1651 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #423 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappnavsample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "LOW",
                "SensitiveText": "Leave request #242 by Gavin Gradel requires your attention",
                "Text": "A leave request requires your attention",
                "GroupHeaderText": "",
                "NotificationCount": 0,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "LeaveRequestId",
                        "Value": "724934632"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                        "Key": "PosId",
                        "Value": "10"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            }
        ]
    };

    var notificationsByType = {
        "@odata.context": "$metadata#Notifications",
        "value": [
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": true,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "You have 2 purchase orders that require your approval",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "sap-xapp-state-data",
                        "Value": "{\"selectionVariant\":{\"SelectionVariantID\":\"MyVariant\",\"SelectOptions\":[{\"PropertyName\":\"CompanyCode\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0001\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0002\",\"High\":null}]},{\"PropertyName\":\"FiscalYear\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"2014\",\"High\":null}]},{\"PropertyName\":\"GLAccount\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"10000\",\"High\":\"20000\"},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"30000\",\"High\":null}]}]}}"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            }
        ]
    };
    var notificationsByParentId = {
        "@odata.context": "$metadata#Notifications",
        "value": [
            {
                "Id": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:45:38Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": false,
                "NavigationTargetAction": "toappnavsample",
                "NavigationTargetObject": "Action",
                "NavigationIntent": "Action-toappstatesample",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-108997a269c4",
                "NotificationTypeKey": "PurchaseOrderType2Key",
                "ParentId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73a",
                "Priority": "HIGH",
                "SensitiveText": "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
                "Text": "A purchase order requires your approval",
                "GroupHeaderText": "You have 3 purchase orders requires your approval",
                "NotificationCount": 0,
                "SubTitle": "Purchase Order",
                "NotificationTypeDesc": "Purchase Order-1",
                "Actor": {
                    "Id": "MOSSERI",
                    "DisplayText": "MOSSERI",
                    "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                },
                "NavigationTargetParams": [
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "sap-xapp-state-data",
                        "Value": "{\"selectionVariant\":{\"SelectionVariantID\":\"MyVariant\",\"SelectOptions\":[{\"PropertyName\":\"CompanyCode\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0001\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"0002\",\"High\":null}]},{\"PropertyName\":\"FiscalYear\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"2014\",\"High\":null}]},{\"PropertyName\":\"GLAccount\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"10000\",\"High\":\"20000\"},{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"30000\",\"High\":null}]}]}}"
                    },
                    {
                        "NotificationId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                        "Key": "PurchaseOrderVendor",
                        "Value": "PARTNER_137"
                    }
                ],
                "Actions": [
                    {
                        "ActionId": "AcceptPOActionKey",
                        "ActionText": "Accept",
                        "GroupActionText": "Accept all",
                        "Nature": "POSITIVE"
                    },
                    {
                        "ActionId": "RejectPOActionKey",
                        "ActionText": "Reject",
                        "GroupActionText": "Reject all",
                        "Nature": "NEGATIVE"
                    }
                ]
            },
            {
                "Id": "005056ab-6fd8-1ee6-a2f4-0a965087499a",
                "OriginId": "LOCAL",
                "CreatedAt": "2016-10-30T11:44:09Z",
                "IsActionable": true,
                "IsRead": false,
                "IsGroupable": true,
                "IsGroupHeader": true,
                "NavigationTargetAction": "",
                "NavigationTargetObject": "",
                "NavigationIntent": "",
                "NotificationTypeId": "005056ab-6fd8-1ee6-a2f4-0a965087499a",
                "NotificationTypeKey": "LeaveRequestTypeKey",
                "ParentId": "005056ab-6fd8-1ee6-a7d2-cc1a693c73a",
                "Priority": "LOW",
                "Text": "A purchase order requires your approval",
                "SensitiveText": "Purchase order #3345 for 7.000 items by Marvin Maadel on 30.10.2017 requires your approval",
                "GroupHeaderText": "You have 3 leave requests requiring your attention",
                "NotificationCount": 3,
                "SubTitle": "Leave Request",
                "NotificationTypeDesc": "Leave Request-4",
                "Actor": {
                    "Id": "",
                    "DisplayText": "",
                    "ImageSource": ""
                },
                "NavigationTargetParams": [],
                "Actions": [
                    {
                        "ActionId": "DenyLRActionKey",
                        "ActionText": "Deny",
                        "GroupActionText": "Deny all",
                        "Nature": "NEGATIVE"
                    },
                    {
                        "ActionId": "ApproveLRActionKey",
                        "ActionText": "Approve",
                        "GroupActionText": "Approve all",
                        "Nature": "POSITIVE"
                    }
                ]
            }
        ]
    };
    var channelEmail = {
        "@odata.context": "$metadata#Channels/$entity",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        "ChannelId": "SAP_EMAIL",
        "IsActive": true,
        "Description": ""
    };
    var channelSMP = {
        "@odata.context": "$metadata#Channels/$entity",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        "ChannelId": "SAP_SMP",
        "IsActive": false,
        "Description": ""
    };
    var notificationTypePersonalizationSet = {
        "@odata.context": "$metadata#NotificationTypePersonalizationSet",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        "value": [
            {
                "NotificationTypeId": "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                "NotificationTypeDesc": "PREXT_DONE",
                "PriorityDefault": "",
                "DoNotDeliver": false,
                "DoNotDeliverMob": false,
                "DoNotDeliverEmail": false,
                "IsEmailEnabled": true,
                "IsEmailIdMaintained": true
            },
            {
                "NotificationTypeId": "e41d2de5-3d80-1ed8-a2e8-36c6e5bcb481",
                "NotificationTypeDesc": "SOS_DONE",
                "PriorityDefault": "",
                "DoNotDeliver": false,
                "DoNotDeliverMob": false,
                "DoNotDeliverEmail": true,
                "IsEmailEnabled": true,
                "IsEmailIdMaintained": true
            },
            {
                "NotificationTypeId": "e41d2de5-3d80-1ed8-aad1-8cecfcb00e8f",
                "NotificationTypeDesc": "POAC überprüfen",
                "PriorityDefault": "",
                "DoNotDeliver": false,
                "DoNotDeliverMob": false,
                "DoNotDeliverEmail": false,
                "IsEmailEnabled": true,
                "IsEmailIdMaintained": false
            },
            {
                "NotificationTypeId": "fa163e4e-8ebc-1ed8-a9a5-4bd05e8cdcc4",
                "NotificationTypeDesc": "Leistungserfassungsblatt freigeben",
                "PriorityDefault": "",
                "DoNotDeliver": false,
                "DoNotDeliverMob": false,
                "DoNotDeliverEmail": true,
                "IsEmailEnabled": true,
                "IsEmailIdMaintained": false
            }
        ]
    };

    var aRequests = [
        {
            method: 'GET',
            path: /Notifications\/\$count/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, {"value" : 10});
            }
        },
        {
            method: 'GET',
            path: /.*orderby=CreatedAt%20desc.*/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationsByDateDesc);
            }
        },
        {
            method: 'GET',
            path: /.*orderby=CreatedAt%20asc.*/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationsByDateAsc);
            }
        },
        {
            method: 'GET',
            path: /.*orderby=Priority.*/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationsPriority);
            }
        },
        {
            method: 'GET',
            path: /.*filter=IsGroupHeader%20eq%20true.*/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationsByType);
            }
        },

        {
            method: 'GET',
            path: /.*6fd8.*/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationsByParentId);
            }
        },
        {
            method: 'GET',
            path: /GetBadgeNumber\(\)/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, { d: { GetBadgeNumber: { Number: 10 } } });
            }
        },
        {
            method: 'POST',
            path: /ResetBadgeNumber/,
            response: function (xhr) {
                xhr.respondJSON(204, {}, '');
            }
        },
        {
            method: 'POST',
            path: /Dismiss/,
            response: function (xhr) {
                xhr.respondJSON(204, {}, '');
            }
        },
        {
            method: 'POST',
            path: /MarkRead/,
            response: function (xhr) {
                xhr.respondJSON(204, {}, '');
            }
        },
        {
            method: 'POST',
            path: /ExecuteAction/,
            response: function (xhr) {
                xhr.respondJSON(204, {}, '');
            }
        },
        {
            method: 'GET',
            path: /Channels\(ChannelId='SAP_SMP'\)/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, channelSMP);
            }
        },
        {
            method: 'GET',
            path: /Channels\(ChannelId='SAP_EMAIL'\)/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, channelEmail);
            }
        },
        {
            method: 'GET',
            path: /NotificationTypePersonalizationSet/,
            response: function (xhr) {
                xhr.respondJSON(200, {}, notificationTypePersonalizationSet);
            }
        }
    ];

    return {
        requests: aRequests
    };
}, true);