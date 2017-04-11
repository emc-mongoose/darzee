/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "mongoose_web_console"
 *
 * @asset(mongoose_web_console/*)
 */
qx.Class.define("mongoose_web_console.Application",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main: function() {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      //qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);

      var scroller = new qx.ui.container.Scroll();

      var container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      container.setPadding(10);
      container.setAllowGrowX(true);
      container.setAllowGrowY(true);

      scroller.add(container);

      var rootDoc = this.getRoot();

      rootDoc.add(scroller, {edge : 0});

      container.add(this.getMainTabView());
    },

    getMainTabView: function() {
      var tabView = new qx.ui.tabview.TabView();

      var page1 = new qx.ui.tabview.Page("Dashboard", "qx/icon/16/apps/utilities-terminal.png");
      page1.setLayout(new qx.ui.layout.VBox());
      page1.add(new qx.ui.basic.Label("Dashboard Content"));
      tabView.add(page1);

      var page2 = new qx.ui.tabview.Page("Configuration", "/assets/qooxdoo/framework/source/resource/qx/icon/16/apps/utilities-terminal.png");
      page2.setLayout(new qx.ui.layout.VBox());
      page2.add(new qx.ui.basic.Label("Configuration Content"));
      tabView.add(page2);

      var page3 = new qx.ui.tabview.Page("Scenario", "/assets/qooxdoo/framework/source/resource/qx/icon/16/apps/utilities-terminal.png");
      page3.setLayout(new qx.ui.layout.VBox());
      page3.add(new qx.ui.basic.Label("Scenario Content"));
      tabView.add(page3);

      var page4 = new qx.ui.tabview.Page("Hosts", "/assets/qooxdoo/framework/source/resource/qx/icon/16/apps/utilities-terminal.png");
      page4.setLayout(new qx.ui.layout.VBox());
      page4.add(new qx.ui.basic.Label("Hosts Content"));
      tabView.add(page4);

      var submitRunButtonTab = new qx.ui.tabview.Page("Submit Run");
      var submitRunButton = submitRunButtonTab.getButton();
      submitRunButton.addListener(
        "execute", function(e) {
        }
      );
      submitRunButton.setDecorator(
        new qx.ui.decoration.Decorator().set(
          {
            backgroundColor: "transparent",
            backgroundImage: "linear-gradient(180deg, rgb(249, 249, 249) 40%, rgb(227, 227, 227) 70%)",
            color: "#bbbbbb",
            radius: 3,
            style: "solid",
            width: 1
          }
        )
      );
      submitRunButtonTab.setEnabled(false);
      tabView.add(submitRunButtonTab);

      return tabView;
    }

  }
});
