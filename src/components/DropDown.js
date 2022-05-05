import React, { Children } from "react";
import { Dropdown, Menu } from "antd";

function DropDown({ options, onClick, children }) {
  const overlayOptions = (
    <Menu>
      {options.map((option, idx) => (
        <Menu.Item key={idx}>
          <a
            href="#"
            onClick={(e) => {
              onClick(option);
            }}
          >
            {option}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={overlayOptions}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    </Dropdown>
  );
}

export default DropDown;
