const routes = (handler) => [
  {
    method: 'POST',
    path: '/posts',
    handler: (request, h) => handler.postPostHandler(request, h),
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
  {
    method: 'GET',
    path: '/posts',
    handler: (request, h) => handler.getPostHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/posts/{id}',
    handler: (request, h) => handler.getPostByidHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
];

module.exports = routes;
