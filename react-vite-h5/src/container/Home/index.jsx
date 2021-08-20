import React, { useState, useEffect, useRef } from "react";
import s from "./style.module.less";
import { Icon, Pull } from "zarm";
import BillItem from "./../../components/BillItem";
import dayjs from "dayjs";
import { get, REFRESH_STATE, LOAD_STATE } from "./../../utils";
import PopupType from "./../../components/PopupType";
import PopupDate from "./../../components/PopupDate";
import CustomIcon from "./../../components/CustomIcon";
import PopupAddBill from "./../../components/PopupAddBill";

const Home = () => {
  // 添加弹窗ref
  const addRef = useRef();
  // 弹窗ref
  const typeRef = useRef();
  // 当前筛选类型
  const [currentSelect, setCurrentSelect] = useState({});
  // 时间筛选ref
  const monthRef = useRef();
  // 当前时间
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM"));
  // 分页
  const [page, setPage] = useState(1);
  // 账单列表
  const [list, setList] = useState([]);
  // 分页总数
  const [totalPage, setTotalPage] = useState(0);
  // 下拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  // 上拉加载状态
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  // 总收入与支出
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);

  const getBillList = async () => {
    const { data } = await get(
      `/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || "all"
      }`
    );
    // 下拉刷新
    if (page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  const addToggle = () => {
    addRef.current && addRef.current.show();
  };

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };
  // 账单类型弹窗开关
  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };
  // 筛选类型回调
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    // 刷新列表
    setPage(1);
    setCurrentSelect(item);
  };

  // 筛选时间弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show();
  };
  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item);
  };

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>¥ {totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入：<b>¥ {totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={toggle}>
            <span className={s.title}>
              {currentSelect.name || "全部类型"}{" "}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right}>
            <span className={s.time} onClick={monthToggle}>
              {currentTime}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : null}
      </div>
      <div className={s.add} onClick={addToggle}>
        <CustomIcon type="tianjia" />
      </div>
      <PopupType ref={typeRef} onSelect={select}></PopupType>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData}></PopupAddBill>
    </div>
  );
};

export default Home;
