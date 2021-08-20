import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import s from "./style.module.less";
import { NavBar, Icon } from "zarm";

const Header = ({ title = "" }) => {
  const history = useHistory();
  return (
    <div className={s.headerWarp}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => history.goBack()}
            />
          }
          title={title}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
