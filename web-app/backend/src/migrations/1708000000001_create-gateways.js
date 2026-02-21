exports.up = async (pgm) => {
  pgm.createTable("gateways", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    api_key_hash: { type: "varchar(255)", notNull: true },
    api_key_prefix: { type: "varchar(12)", notNull: true },
    active: { type: "boolean", notNull: true, default: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    last_seen_at: { type: "timestamp" },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable("gateways");
};
