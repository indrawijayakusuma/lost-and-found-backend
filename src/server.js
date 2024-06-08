/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi');
require('dotenv').config();
const HapiAuthJwt2 = require('hapi-auth-jwt2');
const { Pool } = require('pg');

const Inert = require('@hapi/inert');
const path = require('path');

const users = require('./api/users');
const UserValidator = require('./validator/users');
const UserService = require('./service/postgres/UserService');
const ClientError = require('./exceptions/ClientError');

const authentications = require('./api/authentication');
const AuthenticationsValidator = require('./validator/authentications');
const tokenManager = require('./tokenize/tokenManager');

const otp = require('./api/otp');
const OtpValidator = require('./validator/otp');
const OtpService = require('./service/postgres/OtpService');

const post = require('./api/post');
const postValidator = require('./validator/posts');
const PostService = require('./service/postgres/PostService');
const FoundItemService = require('./service/postgres/FoundItemService');
const LocationService = require('./service/postgres/LocationService');
const AnswerService = require('./service/postgres/AnswerService');
const QuestionService = require('./service/postgres/QuestionService');

const validation = require('./api/validation');
const ValidationService = require('./service/postgres/ValidationService');
const claimValidation = require('./validator/validation');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const init = async () => {
  const usersService = new UserService();
  const otpService = new OtpService();
  const postService = new PostService();
  const foundItemService = new FoundItemService(pool);
  const locationService = new LocationService();
  const answerService = new AnswerService(pool);
  const questionService = new QuestionService();
  const validationService = new ValidationService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(HapiAuthJwt2);
  await server.register(Inert);

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.ACCESS_TOKEN_SECRET,
    validate: async (decoded, request, h) => ({ isValid: true }),
    verifyOptions: { algorithms: ['HS256'] },
    cookieKey: 'refreshToken',
  });

  server.state('refreshToken', {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    isSecure: false, // Set to true in production
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true,
    strictHeader: true,
  });

  server.auth.default('jwt');

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
        otpservice: otpService,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: otp,
      options: {
        otpService,
        validator: OtpValidator,
        usersService,
      },
    },
    {
      plugin: post,
      options: {
        postService,
        foundItemService,
        locationService,
        questionService,
        validator: postValidator,
      },
    },
    {
      plugin: validation,
      options: {
        validationService,
        validator: claimValidation,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    console.log(response.message);
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
