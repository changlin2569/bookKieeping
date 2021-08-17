'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwtErr = middleware.jwtErr(app.config.jwt.secret)
  router.get('/', controller.home.index);
  // router.get('/user', controller.home.user);
  // router.post('/add_user', controller.home.addUser);
  // router.get('/test', _jwtErr, controller.user.test);
  router.post('/register', controller.user.register);
  router.post('/login', controller.user.login);
  router.get('/get_userinfo', _jwtErr, controller.user.getUserInfo);
  router.post('/edit_userinfo', _jwtErr, controller.user.editUserInfo);
  router.post('/upload', controller.upload.upload);
  router.post('/bill/add', controller.bill.add);
  router.get('/bill/list', _jwtErr, controller.bill.list);
  router.get('/bill/detail', _jwtErr, controller.bill.detail);
  router.post('/bill/update', _jwtErr, controller.bill.update);
  router.post('/bill/delete', _jwtErr, controller.bill.delete);
  router.get('/bill/data', _jwtErr, controller.bill.data);
};
