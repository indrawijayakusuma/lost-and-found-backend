class ValidationHandler {
  constructor(validationService, answerService, validator) {
    this.validationService = validationService;
    this.answerService = answerService;
    this.validator = validator;
  }

  async PostClaimValidation(request, h) {
    this.validator.validatePostClaimPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const validationId = await this.validationService.createValidation(
      { ...request.payload, userId },
    );
    await this.answerService.createAnswer({ ...request.payload, validationId });

    const response = h.response({
      status: 'success',
      message: 'claim validation success',
    });
    response.code(201);
    return response;
  }
}

module.exports = ValidationHandler;
