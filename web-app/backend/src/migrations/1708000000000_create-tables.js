const bcrypt = require("bcryptjs");

exports.up = async (pgm) => {
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password: { type: "varchar(255)", notNull: true },
  });

  pgm.createTable("tokens", {
    id: { type: "serial", primaryKey: true },
    token: { type: "varchar(512)", notNull: true, unique: true },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    expiry_date: { type: "timestamp", notNull: true },
    revoked: { type: "boolean", default: false },
  });

  const hash = bcrypt.hashSync("123456", 10);
  pgm.sql(
    `INSERT INTO users (name, email, password) VALUES ('Administrador', 'adm@email.com', '${hash}')`
  );
};

exports.down = async (pgm) => {
  pgm.dropTable("tokens");
  pgm.dropTable("users");
};
