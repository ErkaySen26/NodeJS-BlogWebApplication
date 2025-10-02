const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Yorum içeriği gereklidir'],
    minlength: [3, 'Yorum en az 3 karakter olmalıdır'],
    maxlength: [500, 'Yorum en fazla 500 karakter olabilir']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Post silindiğinde yorumları da sil
CommentSchema.pre('remove', async function(next) {
  await this.model('Comment').deleteMany({ post: this._id });
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);

