exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('answers', {
    answer_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    answer: {
      type: 'TEXT[]',
      notNull: true,
    },
    validation_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('answers', 'fk_answers.validation_id_validations.validation_id', 'FOREIGN KEY(validation_id) REFERENCES validations(validation_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('answers');
};
