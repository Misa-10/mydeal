/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("deals", function (table) {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.text("description");
    table.timestamp("start_date");
    table.timestamp("end_date");
    table.decimal("price", 10, 2);
    table.string("link", 255);
    table.string("image1", 255);
    table.string("image2", 255);
    table.string("image3", 255);
    table.decimal("shipping_cost", 10, 2);
    table.integer("creator_id");
    table.decimal("base_price", 10, 2);
    table.string("brand", 255);
    table.integer("votes").defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("deals");
};
