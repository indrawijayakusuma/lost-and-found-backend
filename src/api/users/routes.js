const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: (request, h) => handler.getUserByIdHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
];

module.exports = routes;
