import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}

const TabsController = ({ data: { labels, Content } }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const rtnContent = (idx) => Content[idx]; // to render a jsx, you have to suply a function, not the content to {}
  return (
    <>
      <h1> Tabs </h1>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {labels.map((label, index) => (
              <Tab label={label} key={index} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>
        {Content.map((Ctn, index) => (
          <>
            <TabPanel value={value} index={index} key={index}>
              {rtnContent(index)}
            </TabPanel>
          </>
        ))}
      </Box>
    </>
  );
};

const TestPage2 = () => {
  useEffect(() => {
    console.log("hello");
  }, []);
  var tabData = {
    labels: ["one", "two", "three"],
    Content: [<h1>hello</h1>, "ctwo", "cthree"],
  };
  return (
    <>
      <h1> hello </h1>
      <button
        onClick={() => {
          console.log(tabData);
          tabData.Content.push("cFOUR");
          tabData.labels.push("FOUR");
        }}
      >
        Change
      </button>
      {/* <BasicTabs /> */}
      <TabsController
        data={tabData}
        Child={
          <>
            <h1>hello</h1>
          </>
        }
      />
    </>
  );
};

export default TabsController;
