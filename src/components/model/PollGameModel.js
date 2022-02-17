const {MysqlPool} = require('~/common/MysqlPool')
const mysqlConnectionPool = new MysqlPool()

class PollGameModel {
  static tableName = 'pollGame'

  static fields = ['id', 'pollId', 'gameId', 'type', 'createdAt']

  unpack(pollGame) {
    return new Promise((resolve, reject) => {
      let resultPollGame = null

      try {
        resultPollGame = JSON.parse(JSON.stringify(pollGame[0]))
      } catch (err) {
        reject(err)

        return
      }

      resolve(resultPollGame)
    })
  }

  save(pollId, gameId, type, createdAt = new Date()) {
    return mysqlConnectionPool
      .query(
        `INSERT INTO ${PollGameModel.tableName} (pollId, gameId, type, createdAt)
         VALUES(?, ?, ?, ?)`,
        [pollId, gameId, type, createdAt],
      )
      .then((execResult) => {
        if (!execResult || !execResult.insertId) {
          throw new Error(`Error during inserting a new pollGame`)
        }
        return execResult.insertId
      })
  }

  getByPollId(pollId, type) {
    return mysqlConnectionPool
      .query(
        `SELECT ${PollGameModel.fields.join(',')} FROM ${
          PollGameModel.tableName
        }
         WHERE pollId = ? and type = ?`,
        [pollId, type],
      )
      .then((result) => {
        if (result && result.length === 0) {
          return null
        }

        return this.unpack(result)
      })
  }
}

exports.PollGameModel = PollGameModel
