/* eslint-disable no-undef */
import { useEffect } from "react";

const TestPage = () => {
  useEffect(() => {
    console.log("hello");
    // SCALING OPTIONS
    // scaling can have values as follows with full being the default
    // "fit"	sets canvas and stage to dimensions and scales to fit inside window size
    // "outside"	sets canvas and stage to dimensions and scales to fit outside window size
    // "full"	sets stage to window size with no scaling
    // "tagID"	add canvas to HTML tag of ID - set to dimensions if provided - no scaling

    var scaling = "full"; // this will resize to fit inside the screen dimensions
    var width = 5000;
    var height = 800;
    var color = dark; // or any HTML color such as "violet" or "#333333"
    var outerColor = light;

    var frame = new Frame(scaling, width, height, color, outerColor);
    frame.on("ready", function () {
      zog("ready from ZIM Frame");

      var stage = frame.stage;
      var stageW = frame.width;
      var stageH = frame.height;

      // ZIM BITS - Tabs Component (2016 - updated 2020)

      // the Tabs component lets you make rows of buttons
      // and set colors, rollcolors, offcolors, etc. to act like tabs
      // tabs works with the tab key too
      // and gives us a change event and we can get selectedIndex and text properties (and more)
      // you can space the "tabs" and then they are like a button row
      // see the https://zimjs.com/tabs.html example
      // for custom examples and a rounded corner tabs technique

      // STEPS

      // 1. make assets that the tabs will sit above (or next to)
      // 2. prepare array of tab objects
      // 3. create a zim Tabs object passing in size, array and various colors and settings
      // 4. set a change event and ask for the tab object's text property (or whatever)

      // 1. make assets that the tabs will sit above (or next to)
      var tabsHeight = 40;
      var distanceToTop = 50;
      var page = new Rectangle(
        stageW,
        stageH - tabsHeight - distanceToTop,
        blue
      )
        .centerReg()
        .mov(0, tabsHeight);
      var tag = new Tag().pos(100, 150, "left").add("<h1>a</h1>");
      tag.style.color = red;

      var pageText = new Label({
        text: "1",
        size: 50,
        color: "#333",
        align: "center",
      }).centerReg();

      // 2. prepare array of tab objects
      // each label can be customized specifically
      // or just do label and set properties for all in Tabs parameters as we do below
      // [{label:"String", width:200, color:"Red", rollColor:"pink", offColor:"grey"}, {etc.}]
      var info = [
        { label: "1" },
        { label: "2" },
        { label: "3" },
        { label: "4" },
        { label: "5" },
      ];

      // 3. create a zim Tabs object passing in size, array and various colors and settings
      // there are many more parameters - see docs
      console.log(
        `x: ${page.x}, y: ${page.y}, w: ${page.width}, h: ${page.height}\n
        stageW: ${stageW}, stageH: ${stageH}\n
        valx: ${page.x - page.width / 2}
        valy: ${page.y - page.height / 2 - 49.8}
        `
      );
      // console.log(page);

      var tabs = new Tabs(300, 50, info, grey, pink, blue).loc(
        page.x - page.width / 2,
        page.y - page.height / 2 - 49.8
      );

      // 4. set a change event and ask for the tab object's text property (or whatever)
      tabs.on("change", function (e) {
        goPage(e.target.text); // or tabs.text // or tabs.selectedIndex for index
      });

      function goPage(n) {
        pageText.text = n;
        stage.update();
      }

      var title = "tabs component";
      var label = new Label(title, 30, null, "#666").pos(40, 40);

      var docItems = "Frame,Rectangle,Label,Tabs,pos,addTo,centerReg,zog";

      stage.update();
      console.log("done");
    }); // end of ready
  }, []);
  return <h1> hello </h1>;
};

export default TestPage;
