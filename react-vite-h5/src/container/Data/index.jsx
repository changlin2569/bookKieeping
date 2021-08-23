import React, { useState, useRef, useEffect } from "react";
import { Icon, Progress } from "zarm";
import classNames from "classnames";
import dayjs from "dayjs";
import { get } from "./../../utils";
import typeMap from "./../../utils/typeMap";
import CustomIcon from "./../../components/CustomIcon";
import PopupDate from "./../../components/PopupDate";
import s from "./style.module.less";

const Data = () => {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  // 收入支出类型
  const [totalType, setTotalType] = useState("expense");
  // 总支出
  const [totalExpense, setTotalExpense] = useState(0);
  // 总收入
  const [totalIncome, setTotalIncome] = useState(0);
  // 支出数据
  const [expenseData, setExpenseData] = useState([]);
  // 收入数据
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    getData();
  }, [currentMonth]);

  // 获取数据
  const getData = async () => {
    const { data } = await get(`/bill/data?date=${currentMonth}`);
    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);

    // 支出和收入数据
    const expense_data = data.total_data
      .filter((item) => item.pay_type == 1)
      .sort((a, b) => b.number - a.number);
    const income_data = data.total_data
      .filter((item) => item.pay_type == 2)
      .sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
  };
  // 弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  };

  const selectMonth = (item) => {
    setCurrentMonth(item);
  };

  const changeTotalType = (currentType) => {
    setTotalType(currentType);
  };

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥1000</div>
        <div className={s.income}>共收入¥200</div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => changeTotalType("expense")}
              className={classNames({
                [s.expense]: true,
                [s.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType("income")}
              className={classNames({
                [s.income]: true,
                [s.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {(totalType == "expense" ? expenseData : incomeData).map((item) => (
            <div key={item.type_id} className={s.item}>
              <div className={s.left}>
                <div className={s.type}>
                  <span
                    className={classNames({
                      [s.expense]: totalType == "expense",
                      [s.income]: totalType == "income",
                    })}
                  >
                    <CustomIcon
                      type={item.type_id ? typeMap[item.type_id].icon : 1}
                    />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>
                  ¥{Number(item.number).toFixed(2) || 0}
                </div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number(
                      (item.number /
                        Number(
                          totalType == "expense" ? totalExpense : totalIncome
                        )) *
                        100
                    ).toFixed(2)}
                    theme="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Data;
