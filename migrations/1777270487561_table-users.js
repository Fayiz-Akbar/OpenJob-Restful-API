exports.up = pgm => {
  pgm.createTable('users', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'TEXT', notNull: true },
    email: { type: 'TEXT', notNull: true, unique: true }, // Syarat Unique Constraint
    password: { type: 'TEXT', notNull: true },
    role: { type: 'VARCHAR(20)', notNull: true }
  });
};
exports.down = pgm => { pgm.dropTable('users'); };