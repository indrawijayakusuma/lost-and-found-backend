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
  {
    method: 'POST',
    path: '/users/update',
    handler: (request, h) => handler.updateUserHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/update/password',
    handler: (request, h) => handler.updatePasswordHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/update/password-forget',
    handler: (request, h) => handler.postUpdateForgetPasswordHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/update-image',
    handler: (request, h) => handler.updateImageHandler(request, h),
    options: {
      auth: 'jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        parse: true,
        output: 'file',
        maxBytes: 10 * 1024 * 1024,
      },
    },
  },
];

module.exports = routes;
