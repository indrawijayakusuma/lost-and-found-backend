exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('validations', {
    validation_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    status_validation: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    post_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    validation_user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('validations', 'fk_validations.post_id_posts.post_id', 'FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE');
  pgm.addConstraint('validations', 'fk_validations.validation_user_id_users.user_id', 'FOREIGN KEY(validation_user_id) REFERENCES users(user_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('validations');
};
