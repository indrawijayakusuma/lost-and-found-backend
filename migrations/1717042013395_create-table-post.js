exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('posts', {
    post_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    is_claimed: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('posts', 'fk_posts.user_id_users.user_id', 'FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('posts');
};
