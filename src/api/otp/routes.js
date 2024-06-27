const routes = (handler) => [
  {
    method: 'POST',
    path: '/otps/validate-user',
    handler: (request, h) => handler.verifyOtpHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/otps',
    handler: (request, h) => handler.createTokenHandler(request, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/otps',
    handler: (request, h) => handler.getOtpByPhoneAndOtpCodeHandler(request, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
