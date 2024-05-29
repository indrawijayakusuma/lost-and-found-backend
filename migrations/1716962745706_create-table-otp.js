exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('otps', {
    otp_code: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true,
    },
    phone: {
      type: 'TEXT',
      notNull: true,
    },
    otp_expires: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('otps');
};
