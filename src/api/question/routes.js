const routes = (handler) => [
  {
    method: 'GET',
    path: '/questions',
    handler: (request, h) => handler.getQuestionsHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/questions/{postId}',
    handler: (request, h) => handler.getQuestionByPostIdHandler(request, h),
    options: {
      auth: 'jwt',
    },
  },
];

module.exports = routes;
