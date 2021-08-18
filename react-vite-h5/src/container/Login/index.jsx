import React, { useState, useCallback } from "react";
import { Cell, Input, Button, Checkbox, Toast } from "zarm";
import CustomIcon from "./../../components/CustomIcon";
import s from "./style.module.less";
import Captcha from "react-captcha-code";
import { post } from "./../../utils";
import classNames from "classnames";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [type, setType] = useState("login");
  const changeHandle = useCallback((captcha) => {
    console.log(captcha);
    setCaptcha(captcha);
  }, []);
  const loginHandle = async () => {
    if (!username || !password) {
      Toast.show("请输入账号或密码");
      return;
    } else if (type === "register" && captcha !== verify) {
      Toast.show("验证码错误");
      return;
    }
    try {
      if (type === "register") {
        await post("user/register", {
          username,
          password,
        });
        Toast.show("注册成功");
        setType("login");
      } else {
        const { data } = await post("user/login", {
          username,
          password,
        });
        Toast.show("登录成功");
        window.sessionStorage.setItem("token", data.token);
      }
    } catch {
      Toast.show("失败");
    }
  };
  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span
          className={classNames({ [s.avtive]: type == "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={classNames({ [s.avtive]: type == "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            placeholder="请输入账号"
            type="text"
            onChange={(value) => setUsername(value)}
          ></Input>
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            placeholder="请输入密码"
            type="password"
            onChange={(value) => setPassword(value)}
          ></Input>
        </Cell>
        {type === "register" && (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              placeholder="请输入验证码"
              type="text"
              onChange={(value) => setVerify(value)}
            ></Input>
            <Captcha charNum={4} onChange={changeHandle}></Captcha>
          </Cell>
        )}
        <div className={s.operation}>
          {type === "register" && (
            <Cell>
              <Checkbox>
                阅读并同意<a>《掘掘手札条款》</a>
              </Checkbox>
            </Cell>
          )}
          <Button block theme="primary" onClick={loginHandle}>
            {type === "login" ? "登录" : "注册"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
