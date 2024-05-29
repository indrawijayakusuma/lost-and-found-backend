const routes = (handler) => [
  {
    method: 'POST',
    path: '/otps',
    handler: (request, h) => handler.VerifyOtpHandler(request, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
