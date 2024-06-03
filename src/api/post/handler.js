const fs = require('fs');
const cloudinary = require('../../utlis/cloudinary');

class PostHandler {
  constructor(postService, foundItemService, locationService, validator) {
    this.foundItemService = foundItemService;
    this.postService = postService;
    this.validator = validator;
    this.locationService = locationService;
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
          effect: 'blur:2000',
        },
      ],
    });

    fs.unlinkSync(image.path);

    const postId = await this.postService.createPost({ userId });

    await this.foundItemService.createFoundItem({
      postId, itemName, tipeBarang, color, secondaryColor, date, image: result.secure_url,
    });

    await this.locationService.createLocation({
      labelLocation, location, address, additionalInfo, postId,
    });

    const response = h.response({
      status: 'success',
      message: 'Post berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }
}

module.exports = PostHandler;
