var pstyle = "border: 1px solid silver;"
var config = {
    tabs: {
        name: "tabs-area",
        active: "dashboard",
        right: "<button id=\"submit-run\" class=\"w2ui-btn submit-run\"><i class=\"fa fa-play\"/>&nbsp;Submit Run</button>",
        tabs: [
            { id: "logo", caption: "<table><tr><td><img src=\"/assets/images/favicon.png\" width=\"32px\" height=\"32px\"/></td><td><h1>&nbsp;Mongoose Web Console</h1></td></tr></table>" },
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
            { type: "left", size: 240, style: pstyle, title: "<i class=\"fa fa-list\"/>&nbsp;Test Runs" },
            { type: "main", style: pstyle, title: "<i class=\"fa fa-table\"/>&nbsp;Current Run" }
        ]
    },
    dashboardTestRuns: {
        name: "dashboard-test-runs",
        nodes: []
    },
    dashboardCurrentRunLayout: {
        name: "dashboard-current-run-layout",
        panels: [
            { type: "top", size: "30%" },
            { type: "main", title: "<i class=\"fa fa-bar-chart\"/>&nbsp;Results", style: pstyle },
            { type: "bottom", size: "40%", title: "<i class=\"fa fa-terminal\"/>&nbsp;Output", style: pstyle }
        ]
    },
    dashboardCurrentRunHeaderLayout: {
        name: "dashboard-current-run-header-layout",
        panels: [
            { type: "top", size: "20%" },
            { type: "main", title: "<i class=\"fa fa-info-circle\"/>&nbsp;Basic Info", style: pstyle },
            { type: "right", size: "50%", title: "<i class=\"fa fa-file-text-o\"/>&nbsp;Logs", style: pstyle }
        ]
    },
    dashboardCurrentRunButtonsLayout: {
        name: "dashboard-current-run-buttons-layout",
        panels: [
            {
                type: "left", size: "20%",
                content: "<button id=\"dashboard-current-run-stop\" class=\"w2ui-btn large-button\"><i class=\"fa fa-stop\"/>&nbsp;Stop</button>"
            },
            {
                type: "main",
                content: "<button id=\"dashboard-current-run-delete\" class=\"w2ui-btn large-button\"><i class=\"fa fa-trash\"/>&nbsp;Delete</button>"
            },
            {
                type: "right", size: "60%",
                content: "<button id=\"dashboard-current-run-resubmit\" class=\"w2ui-btn large-button\"><i class=\"fa fa-repeat\"/>&nbsp;Repeat</button>"
            }
        ]
    },
    configurationLayout: {
        name: "configuration-layout",
        panels: [
            { type: "left", size: 240, style: pstyle, title: "<i class=\"fa fa-search\"/>&nbsp;Navigation" },
            { type: "main", style: pstyle, title: "<i class=\"fa fa-pencil-square-o\"/>&nbsp;Edit" }
        ]
    },
    scenarioLayout: {
        name: "scenario-layout",
        panels: [
            { type: "left", size: 240, title: "<i class=\"fa fa-search\"/>&nbsp;Navigation" },
            { type: "main", style: pstyle, title: "<i class=\"fa fa-pencil-square-o\"/>&nbsp;Edit" },
            { type: "right", size: 320, title: "<i class=\"fa fa-external-link\"/>&nbsp;Substitution" }
        ]
    },
    scenarioArgTable: {
        name: "scenario-arg-table",
        columns: [
            { field: "scenario-arg-name", caption: "Name", size: "40%", sortable: true, editable: { type: "text" } },
            { field: "scenario-arg-value", caption: "Value", size: "50%", sortable: true, editable: { type: "text" } }
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
        columns: [
            { field: "hosts-name", caption: "Name/Address", size: "15%", sortable: true, editable: { type: "text" } },
            { field: "hosts-status", caption: "Status", size: "15%", sortable: true },
            { field: "hosts-controller", caption: "Controller", size: "10%", sortable: true, editable: { type: "checkbox", style: "text-align: center" } },
            { field: "hosts-driver", caption: "Driver", size: "10%", sortable: true, editable: { type: "checkbox", style: "text-align: center" } },
            { field: "hosts-info", caption: "Additional Info", size: "40%", sortable: true, editable: { type: "text" } }
        ]
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
    $().w2sidebar(config.dashboardTestRuns);
    w2ui["dashboard-layout"].content("left", w2ui["dashboard-test-runs"]);
    $().w2layout(config.dashboardCurrentRunLayout);
    w2ui["dashboard-layout"].content("main", w2ui["dashboard-current-run-layout"]);
    $().w2layout(config.dashboardCurrentRunHeaderLayout);
    w2ui["dashboard-current-run-layout"].content("top", w2ui["dashboard-current-run-header-layout"]);
    $().w2layout(config.dashboardCurrentRunButtonsLayout);
    w2ui["dashboard-current-run-header-layout"].content("top", w2ui["dashboard-current-run-buttons-layout"]);
    
    // EXAMPLE: runs adding to the sidebar
    w2ui["dashboard-test-runs"].insert(
        null,
        [
            { id: "test42", text: "<p>Test #42</p><p><i>pending</i></p>", icon: "fa fa-clock-o" },
            { id: "test41", text: "<p>Test #41</p><p><i>pending</i></p>", icon: "fa fa-clock-o" },
            { id: "test40", text: "<p>Test #40</p><p><i>running</i></p>", icon: "fa fa-cog fa-spin fa-fw" },
            { id: "test39", text: "<p>Test #39</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test38", text: "<p>Test #38</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test37", text: "<p>Test #37</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test36", text: "<p>Test #36</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test35", text: "<p>Test #35</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test34", text: "<p>Test #34</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test33", text: "<p>Test #33</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" },
            { id: "test32", text: "<p>Test #32</p><p><i>finished</i></p>", icon: "fa fa-file-archive-o" }
        ]
    );

    $("#configuration").w2layout(config.configurationLayout);

    $("#scenario").w2layout(config.scenarioLayout);
    $().w2grid(config.scenarioArgTable);
    w2ui["scenario-layout"].content("right", w2ui["scenario-arg-table"]);

    $("#hosts").w2layout(config.hostsLayout);
    $().w2grid(config.hostsTable);
    w2ui["hosts-layout"].content("main", w2ui["hosts-table"]);
});
