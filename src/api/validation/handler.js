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
      { ...request.payload, validationUserId: userId },
    );
    await this.answerService.createAnswer({ ...request.payload, validationId });

    const response = h.response({
      status: 'success',
      message: 'claim validation success',
    });
    response.code(201);
    return response;
  }

  async getClaimValidationByUserId(request, h) {
    const { id: userId } = request.auth.credentials;
    const result = await this.validationService.getPostValidationByUserId(userId);
    const response = h.response({
      status: 'success',
      data: result,
    });
    response.code(200);
    return response;
  }

  async getMyClaimedHandlerByUserId(request, h) {
    const { id: userId } = request.auth.credentials;
    const result = await this.validationService.getMyValidationByUserId(userId);
    const response = h.response({
      status: 'success',
      data: result,
    });
    response.code(200);
    return response;
  }

  async getValidationQuestionAnswerHandler(request, h) {
    const { id: validationId } = request.params;
    const result = await this.validationService.getValidationQuestionAnswer(validationId);
    const response = h.response({
      status: 'success',
      data: result,
    });
    response.code(200);
    return response;
  }

  async accValidationHandler(request, h) {
    const { id } = request.params;
    await this.validationService.accValidation({ id });
    const response = h.response({
      status: 'success',
      message: 'validation status success',
    });
    response.code(200);
    return response;
  }

  async rejectValidationHandler(request, h) {
    const { id } = request.params;
    await this.validationService.rejectValidation({ id });
    const response = h.response({
      status: 'success',
      message: 'validation status rejected',
    });
    response.code(200);
    return response;
  }

  async completeValidationHandler(request, h) {
    const { id } = request.params;
    await this.validationService.completeValidation({ id });
    const response = h.response({
      status: 'success',
      message: 'validation status completed',
    });
    response.code(200);
    return response;
  }
}

module.exports = ValidationHandler;
