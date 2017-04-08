var pstyle = "border: 1px solid #dfdfdf; padding: 5px;"
var config = {
    tabs: {
        name: "tabs-area",
        active: "dashboard",
        right: "<button id=\"submit-run\" class=\"w2ui-btn submit-run\"><i class=\"fa fa-play\"/>&nbsp;Submit Run</button>",
        tabs: [
            { id: "logo", caption: "Mongoose Web Console" },
            { id: "dashboard", caption: "<i class=\"fa fa-tachometer\"/>&nbsp;Dashboard" },
            { id: "configuration", caption: "<i class=\"fa fa-pencil-square-o\"/>&nbsp;Configuration" },
            { id: "scenario", caption: "<i class=\"fa fa-file-code-o\"/>&nbsp;Scenario" },
            { id: "hosts", caption: "<i class=\"fa fa-share-alt\"/>&nbsp;Hosts" }
        ],
        onClick: function (event) {
            if(event.target != "logo" && event.target != "submit") {
                $("#main .tab-content").hide();
                $("#main #" + event.target).show();
            }
        }
    },
    dashboardLayout: {
        name: "dashboard-layout",
        panels: [
            { type: "left", size: 250, style: pstyle, title: "<i class=\"fa fa-list\"/>&nbsp;Test Runs" },
            {
                type: "main", style: pstyle, title: "<i class=\"fa fa-table\"/>&nbsp;Current Run",
                toolbar: {
                    items: [
                        { type: "button", id: "stop-run", text: "<i class=\"fa fa-stop\"/>&nbsp;Stop" },
                        { type: "button", id: "delete-run", text: "<i class=\"fa fa-trash\"/>&nbsp;Delete" },
                        { type: "button", id: "resubmit-run", text: "<i class=\"fa fa-repeat\"/>&nbsp;Resubmit" }
                    ]
                }
            }
        ]
    },
    dashboardCurrentRunLayout: {
        name: "dashboard-current-run-layout",
        panels: [
            { type: "top" },
            { type: "main", title: "<i class=\"fa fa-bar-chart\"/>&nbsp;Results", style: pstyle },
            { type: "bottom", title: "<i class=\"fa fa-terminal\"/>&nbsp;Output", style: pstyle }
        ]
    },
    dashboardCurrentRunHeaderLayout: {
        name: "dashboard-current-run-header-layout",
        panels: [
            { type: "main", title: "<i class=\"fa fa-info-circle\"/>&nbsp;Basic Info", style: pstyle },
            { type: "right", size: "50%", title: "<i class=\"fa fa-file-text-o\"/>&nbsp;Logs", style: pstyle }
        ]
    },
    configurationLayout: {
        name: "configuration-layout",
        panels: [
            { type: "left", size: 250, style: pstyle, title: "<i class=\"fa fa-search\"/>&nbsp;Navigation" },
            {
                type: "main", style: pstyle, title: "<i class=\"fa fa-pencil-square-o\"/>&nbsp;Edit",
                toolbar: {
                    items: [
                        { type: "button", id: "validate-configuration", text: "<i class=\"fa fa-check-circle-o\"/>&nbsp;Validate" },
                        { type: "button", id: "save-configuration", text: "<i class=\"fa fa-floppy-o\"/>&nbsp;Save..." },
                        { type: "button", id: "open-configuration", text: "<i class=\"fa fa-folder-open-o\"/>&nbsp;Open..." }
                    ]
                }
            }
        ]
    },
    scenarioLayout: {
        name: "scenario-layout",
        panels: [
            { type: "left", size: 250, title: "<i class=\"fa fa-search\"/>&nbsp;Navigation" },
            {
                type: "main", style: pstyle, title: "<i class=\"fa fa-pencil-square-o\"/>&nbsp;Edit",
                toolbar: {
                    items: [
                        { type: "button", id: "validate-scenario", text: "<i class=\"fa fa-check-circle-o\"/>&nbsp;Validate" },
                        { type: "button", id: "save-scenario", text: "<i class=\"fa fa-floppy-o\"/>&nbsp;Save..." },
                        { type: "button", id: "open-scenario", text: "<i class=\"fa fa-folder-open-o\"/>&nbsp;Open..." }
                    ]
                }
            },
            { type: "right", size: 400, title: "<i class=\"fa fa-external-link\"/>&nbsp;Substitution" }
        ]
    },
    scenarioArgTable: {
        name: "scenario-arg-table",
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
            toolbarDelete: true
        },
        columns: [
            { field: "scenario-arg-name", caption: "Name", size: "40%", sortable: true, editable: { type: "text" } },
            { field: "scenario-arg-value", caption: "Value", size: "60%", sortable: true, editable: { type: "text" } }
        ],
        onAdd: function (event) {
            w2alert("Add scenario arg stub");
        },
        onDelete: function (event) {
            w2alert("Delete scenario arg stub");
        }
    },
    hostsLayout: {
        name: "hosts-layout",
        panels: [
            { type: "main", style: pstyle }
        ]
    },
    hostsTable: {
        name: "hosts-table",
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
            toolbarDelete: true
        },
         columns: [
            { field: "scenario-arg-name", caption: "Name", size: "40%", sortable: true, editable: { type: "text" } },
            { field: "scenario-arg-value", caption: "Value", size: "60%", sortable: true, editable: { type: "text" } }
             /*{ field: "hosts-name", caption: "Name/Address", size: "15%", sortable: true, editable: { type: "text" } },
             { field: "hosts-status", caption: "Status", size: "15%", sortable: true },
             { field: "hosts-controller", caption: "Controller", size: "10%", sortable: true, editable: { type: "checkbox", style: "text-align: center" } },
             { field: "hosts-driver", caption: "Driver", size: "10%", sortable: true, editable: { type: "checkbox", style: "text-align: center" } },
             { field: "hosts-info", caption: "Additional Info", size: "50%", sortable: true, editable: { type: "text" } },*/
         ],
         onAdd: function (event) {
             w2alert("Add scenario arg stub");
         },
         onDelete: function (event) {
             w2alert("Delete scenario arg stub");
         }
    }
}

$(function () {

    $("#tabs-area").w2tabs(config.tabs);
    $("#tabs_tabs-area_tab_logo").children("div").attr({
        "class": "logo",
        "onmouseover": "",
        "onmouseout": "",
        "onclick": ""
    });

    $("#dashboard").show();
    $("#dashboard").w2layout(config.dashboardLayout);
    $("div.tab-content").children("div").css("height", "100%");
    $().w2layout(config.dashboardCurrentRunLayout);
    w2ui["dashboard-layout"].content("main", w2ui["dashboard-current-run-layout"]);
    $().w2layout(config.dashboardCurrentRunHeaderLayout);
    w2ui["dashboard-current-run-layout"].content("top", w2ui["dashboard-current-run-header-layout"]);

    $("#configuration").w2layout(config.configurationLayout);

    $("#scenario").w2layout(config.scenarioLayout);
    $().w2grid(config.scenarioArgTable);
    w2ui["scenario-layout"].content("right", w2ui["scenario-arg-table"]);

    $("#hosts").w2layout(config.hostsLayout);
    $().w2grid(configuration.hostsTable);
    w2ui["hosts-layout"].content("main", w2ui["hosts-table"]);
});
