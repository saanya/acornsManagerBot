const {MysqlPool} = require('~/common/MysqlPool')
const mysqlConnectionPool = new MysqlPool()

class GamePlayerModel {
  static tableName = 'gamePlayer'

  static fields = [
    'id',
    'gameId',
    'playerId',
    'isPaid',
    'amount',
    'updatedAt',
    'createdAt',
  ]

  unpack(gamePlayer) {
    return new Promise((resolve, reject) => {
      let resultGamePlayer = null

      try {
        resultGamePlayer = JSON.parse(JSON.stringify(gamePlayer[0]))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultGamePlayer)
    })
  }

  unpackMulti(gamePlayers) {
    return new Promise((resolve, reject) => {
      let resultGamePlayers = []

      try {
        resultGamePlayers = JSON.parse(JSON.stringify(gamePlayers))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultGamePlayers)
    })
  }

  save(gameId, playerId, isPaid, amount, createdAt = new Date()) {
    return mysqlConnectionPool
      .query(
        `INSERT INTO ${GamePlayerModel.tableName} (gameId, playerId, isPaid, amount, createdAt)
         VALUES(?, ?, ?, ?, ?)`,
        [gameId, playerId, isPaid, amount, createdAt],
      )
      .then((execResult) => {
        if (!execResult || !execResult.insertId) {
          throw new Error(`Error during inserting a new game player`)
        }
        return execResult.insertId
      })
  }

  deleteById(gameId, playerId) {
    return mysqlConnectionPool
      .query(
        `DELETE FROM ${GamePlayerModel.tableName} WHERE gameId = ? and playerId = ?`,
        [gameId, playerId],
      )
      .then((execResult) => {
        if (!execResult || !execResult.affectedRows) {
          throw 0
        }

        return execResult.affectedRows
      })
  }

  getPlayersByGame(gameId) {
    return mysqlConnectionPool
      .query(
        `SELECT ${GamePlayerModel.fields.join(',')} FROM ${
          GamePlayerModel.tableName
        }
         WHERE gameId = ?`,
        [gameId],
      )
      .then((results) => {
        if (results && results.length === 0) {
          return []
        }

        return this.unpackMulti(results)
      })
  }

  updateByParams(gameId, playerId, data) {
    if (!gameId || !playerId || !data) {
      return false
    }

    return this.prepareDataForUpdating(data).then((result) => {
      if (result.params.length === 0) {
        return 0
      }

      return mysqlConnectionPool
        .query(
          `UPDATE ${GamePlayerModel.tableName} SET ${result.fields.join(
            ',',
          )} WHERE gameId=? and playerId=?`,
          [...result.params, gameId, playerId],
        )
        .then((execResult) => {
          if (!execResult) {
            throw new Error(`Error during updating data of a game player`)
          } else if (!execResult.changedRows) {
            return 0
          }

          return execResult.changedRows
        })
    })
  }

  prepareDataForUpdating(data) {
    return new Promise((resolve, reject) => {
      let result = {
        fields: [],
        params: [],
      }

      if (Object.hasOwnProperty.bind(data)('isPaid')) {
        result.fields = [...result.fields, 'isPaid=?']
        result.params = [...result.params, data.isPaid]
      }
      if (Object.hasOwnProperty.bind(data)('isMissed')) {
        result.fields = [...result.fields, 'isMissed=?']
        result.params = [...result.params, data.isMissed]
      }

      resolve(result)
    })
  }
}

exports.GamePlayerModel = GamePlayerModel
