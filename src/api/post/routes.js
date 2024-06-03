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
];

module.exports = routes;
