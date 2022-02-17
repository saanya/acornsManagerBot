const {MysqlPool} = require('~/common/MysqlPool')
const mysqlConnectionPool = new MysqlPool()

class PollModel {
  static tableName = 'poll'

  static fields = [
    'id',
    'pollId',
    'chatId',
    'text',
    'options',
    'type',
    'createdAt',
  ]

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

  save(pollId, chatId, text, options, type, createdAt = new Date()) {
    return mysqlConnectionPool
      .query(
        `INSERT INTO ${PollModel.tableName} (pollId, chatId, text, options, type, createdAt)
         VALUES(?, ?, ?, ?, ?, ?)`,
        [pollId, chatId, text, options, type, createdAt],
      )
      .then((execResult) => {
        if (!execResult || !execResult.insertId) {
          throw new Error(`Error during inserting a new poll`)
        }
        console.log(execResult.insertId)
        return execResult.insertId
      })
  }

  getByPollId(pollId) {
    return mysqlConnectionPool
      .query(
        `SELECT ${PollModel.fields.join(',')} FROM ${PollModel.tableName}
         WHERE pollId = ?`,
        [pollId],
      )
      .then((result) => {
        if (result && result.length === 0) {
          return null
        }

        return this.unpack(result)
      })
  }
}

exports.PollModel = PollModel
