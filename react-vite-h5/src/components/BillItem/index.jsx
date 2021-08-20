import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import s from "./style.module.less";
import { Cell } from "zarm";
import CustomIcon from "./../CustomIcon";
import dayjs from "dayjs";
import typeMap from "./../../utils/typeMap";

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const history = useHistory();

  // 当日账单长度变化，出发当日收支计算
  useEffect(() => {
    const _income = bill.bills
      .filter((item) => item.pay_type === 2)
      .reduce((prev, item) => (prev += +item.amount), 0);
    const _expense = bill.bills
      .filter((item) => item.pay_type === 1)
      .reduce((prev, item) => (prev += +item.amount), 0);
    setIncome(_income);
    setExpense(_expense);
  }, [bill.bills]);

  // 账单详情页
  const goToDetail = (item) => {
    // console.log(item);
    console.log(history);
    history.push(`/detail?id=${item.id}`);
  };

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>￥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>￥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {bill &&
        bill.bills.map((item) => (
          <Cell
            className={s.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <div>
                <CustomIcon
                  className={s.itemIcon}
                  type={item.type_id ? typeMap[item.type_id] : 1}
                ></CustomIcon>
                <span>{item.type_name}</span>
              </div>
            }
            description={
              <span
                style={{ color: item.pay_type === 2 ? "red" : "#39be77" }}
              >{`${item.pay_type == 1 ? "-" : "+"}${item.amount}`}</span>
            }
            help={
              <div>
                {dayjs(Number(item.date)).format("HH:mm")}{" "}
                {item.remark ? `| ${item.remark}` : ""}
              </div>
            }
          ></Cell>
        ))}
    </div>
  );
};

BillItem.propTypes = {
  bill: PropTypes.object,
};

export default BillItem;
