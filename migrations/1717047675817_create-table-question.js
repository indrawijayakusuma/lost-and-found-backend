exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('questions', {
    question_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    question: {
      type: 'TEXT[]',
      notNull: true,
    },
    post_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('questions', 'fk_questions.post_id_posts.post_id', 'FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('questions');
};
