import React, { useState, forwardRef, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Popup, Icon, Keyboard, Input, Toast } from "zarm";
import s from "./style.module.less";
import classNames from "classnames";
import PopupDate from "./../PopupDate";
import dayjs from "dayjs";
import CustomIcon from "./../CustomIcon";
import { get, post } from "./../../utils";
import typeMap from "./../../utils/typeMap";

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const dateRef = useRef();
  // 外部传入
  const id = detail?.id;
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState("expense");
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  // 当前选中账单类型
  const [currentType, setCurrentType] = useState({});
  // 支出类型数组
  const [expense, setExpense] = useState([]);
  // 收入类型数组
  const [income, setIncome] = useState([]);
  // 备注
  const [remark, setRemark] = useState("");
  // 备注展示开关
  const [showRemark, setShowRemark] = useState(false);

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? "expense" : "income");
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(dayjs(+detail.date).$d);
    }
  }, [detail]);

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/type/list");
    const _expense = list.filter((item) => item.type === "1");
    const _income = list.filter((item) => item.type === "2");
    setExpense(_expense);
    setIncome(_income);
    id || setCurrentType(_expense[0]);
  }, []);

  // 切换类型
  const changeType = (type) => {
    setPayType(type);
  };
  // 日期选择回调
  const selectDate = (date) => {
    setDate(date);
  };
  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show("请输入金额");
      return;
    }
    const params = {
      amount: (+amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix * 1000,
      pay_type: payType === "expense" ? 1 : 2,
      remark: remark || "",
    };
    if (id) {
      params.id = id;
      await post("/bill/update", params);
      Toast.show("修改成功");
    } else {
      await post("/bill/add", params);

      setAmount("");
      setPayType("expense");
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark("");
      Toast.show("添加成功");
    }
    setShow(false);
    onReload && onReload();
  };
  // 输入框值改变时
  const changeHandle = (value) => {
    if (value === "ok") {
      addBill();
      return;
    } else if (value === "delete") {
      const newAmount = amount.slice(0, amount.length - 1);
      setAmount(newAmount);
      return;
    } else if (value === "." && amount.includes(".")) {
      retrun;
    } else if (
      value != "." &&
      amount.includes(".") &&
      amount &&
      amount.split(".")[1].length >= 2
    ) {
      return;
    }
    setAmount(amount + value);
  };

  if (ref) {
    ref.current = {
      show: () => setShow(true),
      close: () => setShow(false),
    };
  }
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 右上角关闭弹窗 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        {/* 「收入」和「支出」类型切换 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType("expense")}
              className={classNames({
                [s.expense]: true,
                [s.active]: payType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeType("income")}
              className={classNames({
                [s.income]: true,
                [s.active]: payType == "income",
              })}
            >
              收入
            </span>
          </div>
          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format("MM-DD")}{" "}
            <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        <PopupDate ref={dateRef} onSelect={selectDate}></PopupDate>
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == "expense" ? expense : income).map((item) => (
              <div
                onClick={() => setCurrentType(item)}
                key={item.id}
                className={s.typeItem}
              >
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={classNames({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == "expense",
                    [s.income]: payType == "income",
                    [s.active]: currentType.id == item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={classNames(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || "添加备注"}
            </span>
          )}
        </div>
      </div>
      <Keyboard
        type="price"
        onKeyClick={(value) => changeHandle(value)}
      ></Keyboard>
    </Popup>
  );
});

PopupAddBill.propTypes = {};

export default PopupAddBill;
