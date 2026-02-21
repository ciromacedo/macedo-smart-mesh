exports.up = async (pgm) => {
  // Garante que exista ao menos uma organização (para fresh installs)
  pgm.sql(`
    INSERT INTO organizations (description)
    SELECT 'Default'
    WHERE NOT EXISTS (SELECT 1 FROM organizations)
  `);

  // Adiciona a coluna como nullable primeiro
  pgm.addColumns("users", {
    organizacao_fk: {
      type: "integer",
      references: '"organizations"',
      onDelete: "RESTRICT",
    },
  });
  pgm.addColumns("gateways", {
    organizacao_fk: {
      type: "integer",
      references: '"organizations"',
      onDelete: "RESTRICT",
    },
  });

  // Atribui a primeira organização a todos os registros existentes
  pgm.sql(
    "UPDATE users SET organizacao_fk = (SELECT id FROM organizations ORDER BY id LIMIT 1)"
  );
  pgm.sql(
    "UPDATE gateways SET organizacao_fk = (SELECT id FROM organizations ORDER BY id LIMIT 1)"
  );

  // Aplica NOT NULL
  pgm.alterColumn("users", "organizacao_fk", { notNull: true });
  pgm.alterColumn("gateways", "organizacao_fk", { notNull: true });
};

exports.down = async (pgm) => {
  pgm.dropColumns("users", ["organizacao_fk"]);
  pgm.dropColumns("gateways", ["organizacao_fk"]);
};
