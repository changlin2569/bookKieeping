'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwtErr = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  // router.get('/user', controller.home.user);
  // router.post('/add_user', controller.home.addUser);
  // router.get('/test', _jwtErr, controller.user.test);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/get_userinfo', _jwtErr, controller.user.getUserInfo);
  router.post('/api/user/edit_userinfo', _jwtErr, controller.user.editUserInfo);
  router.post('/upload', controller.upload.upload);
  router.post('/api/bill/add', controller.bill.add);
  router.get('/api/bill/list', _jwtErr, controller.bill.list);
  router.get('/api/bill/detail', _jwtErr, controller.bill.detail);
  router.post('/api/bill/update', _jwtErr, controller.bill.update);
  router.post('/api/bill/delete', _jwtErr, controller.bill.delete);
  router.get('/api/bill/data', _jwtErr, controller.bill.data);
};
