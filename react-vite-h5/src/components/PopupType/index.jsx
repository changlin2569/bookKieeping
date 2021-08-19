import React, { useState, useEffect, forwardRef } from "react";
import s from "./style.module.less";
import PropTypes from "prop-types";
import classNames from "classnames";
import { get } from "./../../utils";
import { Popup, Icon } from "zarm";

const PopupType = forwardRef(({ onSelect }, ref) => {
  // 组件的显示与隐藏
  const [show, setShow] = useState(false);
  // 激活的type
  const [active, setActive] = useState("all");
  // 支出类型标签
  const [expense, setExpense] = useState([]);
  // 收入类型标签
  const [income, setIncome] = useState([]);

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/type/list");
    console.log(list);
    setExpense(list.filter((item) => item.type === "1"));
    setIncome(list.filter((item) => item.type === "2"));
  }, []);

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }
  // 选择类型后触发
  const choseType = (item) => {
    setActive(item.id);
    setShow(false);
    onSelect(item);
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: "all" })}
            className={classNames({
              [s.all]: true,
              [s.active]: active == "all",
            })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={classNames({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={classNames({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};

export default PopupType;
