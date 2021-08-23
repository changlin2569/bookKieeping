import React, { useState, useEffect } from "react";
import { FilePicker, Button, Input, Toast } from "zarm";
import { useHistory } from "react-router-dom";
import Header from "./../../components/Header";
import axios from "axios";
import { baseUrl } from "./../../config";
import { get, post } from "./../../utils";

import s from "./style.module.less";

const UserInfo = () => {
  // 路由实例
  const history = useHistory();
  // 用户信息
  const [user, setUser] = useState({});
  // 头像
  const [avatar, setAvatar] = useState("");
  // 个签
  const [signature, setSignature] = useState("");
  // 登陆令牌
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get("/user/get_userinfo");
    setUser(data);
    setAvatar(data.avatar);
    setSignature(data.signature);
  };

  const selectHandle = (file) => {
    console.log(file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show("头像不能超过200kb!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file.file);
    axios({
      method: "POST",
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }).then((res) => {
      setAvatar(res.data);
    });
  };

  const save = async () => {
    const { data } = await post("/user/edit_userinfo", {
      signature,
      avatar,
    });
    Toast.show("修改成功");
    // 返回个人中心页面
    history.goBack();
  };
  return (
    <>
      <Header title="用户信息" />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker
                className={s.filePicker}
                onChange={selectHandle}
                accept="image/*"
              >
                <Button className={s.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
