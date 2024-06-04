exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('answers', {
    answer_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    answer: {
      type: 'TEXT',
      notNull: true,
    },
    question_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    validation_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('answers', 'fk_answers.question_id_questions.question_id', 'FOREIGN KEY(question_id) REFERENCES questions(question_id) ON DELETE CASCADE');
  pgm.addConstraint('answers', 'fk_answers.validation_id_validations.validation_id', 'FOREIGN KEY(validation_id) REFERENCES validations(validation_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('answers');
};
