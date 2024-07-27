const fs = require('fs');
const cloudinary = require('../../utlis/cloudinary');

class PostHandler {
  constructor(postService, foundItemService, locationService, QustionService, validator) {
    this.foundItemService = foundItemService;
    this.postService = postService;
    this.validator = validator;
    this.locationService = locationService;
    this.questionService = QustionService;
  }

  async postPostHandler(request, h) {
    const {
      itemName, tipeBarang, color, secondaryColor, date, image,
      labelLocation, location, address, additionalInfo,
    } = request.payload;

    this.validator.validatePostPayload(request.payload);
    this.validator.validateImageHeader(image.headers);
    const { id: userId } = request.auth.credentials;

    const result = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          aspect_ratio: '1.0', gravity: 'center', crop: 'fill',
        },
        {
          effect: 'blur:2000',
        },
      ],
    });

    fs.unlinkSync(image.path);

    const questions = JSON.parse(request.payload.questions);

    const postId = await this.postService.createPost({ userId });

    await this.foundItemService.createFoundItem({
      postId, itemName, tipeBarang, color, secondaryColor, date, image: result.secure_url,
    });

    await this.locationService.createLocation({
      labelLocation, location, address, additionalInfo, postId,
    });

    await this.questionService.createQuestion({ questions, postId });

    const response = h.response({
      status: 'success',
      message: 'Post berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getPostHandler(request, h) {
    const {
      search, limit = 12, page = 1, location,
    } = request.query;

    const result = await this.postService.getFoundItemPosts({
      search, limit, page, location,
    });
    const response = h.response({
      status: 'success',
      data: {
        posts: result,
      },
    });
    response.code(200);
    return response;
  }

  async getPostByidHandler(request, h) {
    const { id } = request.params;
    const post = await this.postService.getPostById(id);

    const response = h.response({
      status: 'success',
      data: post,
    });
    response.code(200);
    return response;
  }

  async getPostUpdateByIdHandler(request, h) {
    const { id } = request.params;
    const result = await this.postService.getPostUpdateById(id);
    const response = h.response({
      status: 'success',
      data: result,
    });
    response.code(200);
    return response;
  }

  async getPostByUserIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const result = await this.postService.getPostsByUserId({ userId });
    const response = h.response({
      status: 'success',
      data: result,
    });
    response.code(200);
    return response;
  }
}

module.exports = PostHandler;
