/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("deals", function (table) {
    // Modify existing columns to use bytea type
    table.specificType("image1", "bytea");
    table.specificType("image2", "bytea");
    table.specificType("image3", "bytea");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("deals", function (table) {
    // Revert changes
    table.string("image1", 255).alter();
    table.string("image2", 255).alter();
    table.string("image3", 255).alter();
  });
};
