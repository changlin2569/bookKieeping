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
  router.post('/register', controller.user.register);
  router.post('/login', controller.user.login);
  // router.get('/test', _jwtErr, controller.user.test);
  router.get('/get_userinfo', _jwtErr, controller.user.getUserInfo);
};
