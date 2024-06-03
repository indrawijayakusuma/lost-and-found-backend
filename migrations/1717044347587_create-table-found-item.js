exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('found_items', {
    post_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    item_name: {
      type: 'TEXT',
      notNull: true,
    },
    tipe_barang: {
      type: 'TEXT',
      notNull: true,
    },
    color: {
      type: 'TEXT',
      notNull: true,
    },
    secondary_color: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    image: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('posts');
};
