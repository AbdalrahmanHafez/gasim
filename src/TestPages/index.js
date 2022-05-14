import TestClasses from "./ClassTesting/TestClasses.js";
import { SimTesting } from "./SimTesting/SimTesting.js";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const TestPage = () => {
  // return <SimTesting />;
  // return <TestClasses />;

  return (
    <div>
      <button className="szh-menu-button">testing</button>

      <Menu
        menuButton={
          <MenuButton className="box-border border-2 border-gray-500 rounded px-2 m-3">
            Open menu
          </MenuButton>
        }
        transition
      >
        <MenuItem>New File</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem>Close Window</MenuItem>
      </Menu>
    </div>
  );
};

export default TestPage;
