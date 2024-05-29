const routes = (handler) => [
  {
    method: 'POST',
    path: '/login',
    handler: (request, h) => handler.loginHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/refresh-token',
    handler: (request, h) => handler.refreshTokenHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/logout',
    handler: (request, h) => handler.logoutHandler(request, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
