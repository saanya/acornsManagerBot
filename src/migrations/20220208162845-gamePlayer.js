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
    `CREATE TABLE IF NOT EXISTS gamePlayer (
      id int(11) unsigned NOT NULL AUTO_INCREMENT,
      gameId int(11) unsigned NOT NULL,
      playerId int(11) unsigned NOT NULL,
      isPaid tinyint(1) unsigned NOT NULL DEFAULT 0,
      isMissed tinyint(1) unsigned NOT NULL DEFAULT 0,
      amount decimal(10,2) unsigned NOT NULL DEFAULT 0,
      updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY gamePlayer(gameId, playerId),
      KEY playerId(playerId),
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
