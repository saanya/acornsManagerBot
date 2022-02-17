const {MysqlPool} = require('~/common/MysqlPool')
const mysqlConnectionPool = new MysqlPool()

class GameModel {
  static tableName = 'game'

  static fields = ['id', 'homeTeam', 'guestTeam', 'gameTime', 'createdAt']

  unpack(game) {
    return new Promise((resolve, reject) => {
      let resultGame = null

      try {
        resultGame = JSON.parse(JSON.stringify(game[0]))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultGame)
    })
  }

  save(homeTeam, guestTeam, gameTime, createdAt = new Date()) {
    return mysqlConnectionPool
      .query(
        `INSERT INTO ${GameModel.tableName} (homeTeam, guestTeam, gameTime, createdAt)
         VALUES(?, ?, ?, ?)`,
        [homeTeam, guestTeam, gameTime, createdAt],
      )
      .then((execResult) => {
        if (!execResult || !execResult.insertId) {
          throw new Error(`Error during inserting a new game`)
        }
        return execResult.insertId
      })
  }

  getById(id) {
    return mysqlConnectionPool
      .query(
        `SELECT ${GameModel.fields.join(',')} FROM ${GameModel.tableName}
         WHERE id = ?`,
        [id],
      )
      .then((result) => {
        if (result && result.length === 0) {
          return null
        }

        return this.unpack(result)
      })
  }

  getLastGameByTime(dateFrom, dateTo) {
    let where = [`createdAt > ?`]
    let params = [dateFrom]

    where = [`createdAt <= ?`, ...where]
    params = [dateTo, ...params]
    console.log(where, params)
    return mysqlConnectionPool
      .query(
        `SELECT ${GameModel.fields.join(',')}
          FROM ${GameModel.tableName}
          WHERE ${where.join(' AND ')}
          ORDER BY id DESC
          LIMIT 1`,
        params,
      )
      .then((result) => {
        if (result.length === 0) {
          return null
        }

        return this.unpack(result)
      })
  }
}

exports.GameModel = GameModel
