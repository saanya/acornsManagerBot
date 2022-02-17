const {MysqlPool} = require('~/common/MysqlPool')
const mysqlConnectionPool = new MysqlPool()

class PlayerModel {
  static tableName = 'player'

  static fields = ['id', 'telegramId', 'nickName', 'name', 'createdAt']

  unpack(player) {
    return new Promise((resolve, reject) => {
      let resultPlayer = null

      try {
        resultPlayer = JSON.parse(JSON.stringify(player[0]))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultPlayer)
    })
  }

  unpackMulti(players) {
    return new Promise((resolve, reject) => {
      let resultPlayers = []

      try {
        resultPlayers = JSON.parse(JSON.stringify(players))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultPlayers)
    })
  }

  save(telegramId, nickName, name, createdAt = new Date()) {
    return mysqlConnectionPool
      .query(
        `INSERT INTO ${PlayerModel.tableName} (telegramId, nickName, name, createdAt)
         VALUES(?, ?, ?, ?)`,
        [telegramId, nickName, name, createdAt],
      )
      .then((execResult) => {
        if (!execResult || !execResult.insertId) {
          throw new Error(`Error during inserting a new player`)
        }
        console.log(execResult.insertId)
        return execResult.insertId
      })
  }

  getByTelegramId(telegramId) {
    return mysqlConnectionPool
      .query(
        `SELECT ${PlayerModel.fields.join(',')} FROM ${PlayerModel.tableName}
         WHERE telegramId = ?`,
        [telegramId],
      )
      .then((result) => {
        if (result && result.length === 0) {
          return null
        }

        return this.unpack(result)
      })
  }

  getByIds(ids) {
    return mysqlConnectionPool
      .query(
        `SELECT ${PlayerModel.fields.join(',')} FROM ${PlayerModel.tableName}
         WHERE id in (?)`,
        [ids],
      )
      .then((results) => {
        if (results && results.length === 0) {
          return []
        }

        return this.unpackMulti(results)
      })
  }
}

exports.PlayerModel = PlayerModel
