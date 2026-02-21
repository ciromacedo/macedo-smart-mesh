exports.up = async (pgm) => {
  pgm.createTable("organizations", {
    id: { type: "serial", primaryKey: true },
    description: { type: "text", notNull: true },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable("organizations");
};
