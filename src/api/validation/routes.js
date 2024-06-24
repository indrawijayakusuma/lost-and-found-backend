const routes = (handler) => [
  {
    method: 'POST',
    path: '/claim-validation',
    handler: (request, h) => handler.PostClaimValidation(request, h),
  },
  {
    method: 'GET',
    path: '/claim-validation',
    handler: (request, h) => handler.getClaimValidationByUserId(request, h),
  },
  {
    method: 'GET',
    path: '/claim-validation/me',
    handler: (request, h) => handler.getMyClaimedHandlerByUserId(request, h),
  },
  {
    method: 'GET',
    path: '/claim-validation/{id}',
    handler: (request, h) => handler.getValidationQuestionAnswerHandler(request, h),
  },
  {
    method: 'POST',
    path: '/claim-validation/{id}/accept',
    handler: (request, h) => handler.accValidationHandler(request, h),
  },
  {
    method: 'POST',
    path: '/claim-validation/{id}/reject',
    handler: (request, h) => handler.rejectValidationHandler(request, h),
  },
  {
    method: 'POST',
    path: '/claim-validation/{id}/complete',
    handler: (request, h) => handler.completeValidationHandler(request, h),
  },
];

module.exports = routes;
