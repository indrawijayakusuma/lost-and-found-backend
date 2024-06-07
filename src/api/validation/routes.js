const routes = (handler) => [
  {
    method: 'POST',
    path: '/claim-validation',
    handler: (request, h) => handler.PostClaimValidation(request, h),
  },
];

module.exports = routes;
