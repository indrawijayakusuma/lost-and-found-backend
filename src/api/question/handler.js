class QuestionHandler {
  constructor(service) {
    this.service = service;
  }

  async getQuestionByPostIdHandler(request, h) {
    const { postId } = request.params;
    const questions = await this.service.getQuestionByPostId({ postId });
    return h.response({
      status: 'success',
      data: {
        ...questions,
      },
    }).code(200);
  }
}

module.exports = QuestionHandler;
