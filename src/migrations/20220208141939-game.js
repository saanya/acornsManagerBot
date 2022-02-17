'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = async function (db) {
  await db.runSql(
    `CREATE TABLE IF NOT EXISTS game (
      id int(11) unsigned NOT NULL AUTO_INCREMENT,
      homeTeam varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
      guestTeam varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
      gameTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY createdAt(createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin`,
  )
}

exports.down = function (db) {
  return null
}

exports._meta = {
  version: 1,
}
