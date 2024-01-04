/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    // Add a new column named 'avatar'
    table.string("avatar", 255);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    // Rollback by removing the 'avatar' column
    table.dropColumn("avatar");
  });
};
