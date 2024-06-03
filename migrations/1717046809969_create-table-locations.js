exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('locations', {
    location_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    label_location: {
      type: 'TEXT',
    },
    location: {
      type: 'TEXT',
      notNull: true,
    },
    address: {
      type: 'TEXT',
      notNull: true,
    },
    additional_info: {
      type: 'TEXT',
      notNull: true,
    },
    found_item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('locations', 'fk_locations.found_item_id_found_items.post_id', 'FOREIGN KEY(found_item_id) REFERENCES found_items(post_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('locations');
};
