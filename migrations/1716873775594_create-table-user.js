exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    phone: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    email: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    picture: {
      type: 'TEXT',
    },
    is_verified: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
