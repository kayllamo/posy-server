const path = require('path')
const express = require('express')
const xss = require('xss')
const LogsService = require('./logs-service')
const LogsRouter = express.Router()
const jsonParser = express.json()

const serializeLog = log => ({
  id: log.id,
  log_name: xss(log.log_name),
  log_date: log.log_date,
  log_tag: log.log_tag,
  log_author: log.log_author,
  log_entry: xss(log.log_entry),
})

LogsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    LogsService.getAllLogs(knexInstance)
      .then(logs => {
        res.json(logs.map(serializeLog))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { log_name, log_date, log_tag, log_author, log_entry } = req.body
    const newLog = { log_name, log_entry }

    for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newLog.log_date = log_date
    newLog.log_entry = log_entry
    LogsService.insertLog(
      req.app.get('db'),
      newLog
    )
      .then(log => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${log.id}`))
          .json(serializeLog(log))
      })
      .catch(next)
  })

LogsRouter
  .route('/:log_id')
  .all((req, res, next) => {
    LogsService.getById(
      req.app.get('db'),
      req.params.log_id
    )
      .then(log => {
        if (!log) {
          return res.status(404).json({
            error: { message: `Log doesn't exist` }
          })
        }
        res.log = log // save the log for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeLog(res.log))
  })
  .delete((req, res, next) => {
    LogsService.deleteLog(
      req.app.get('db'),
      req.params.log_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { log_name, log_date, log_tag, log_entry } = req.body
    const logToUpdate = { log_name, log_entry }

    const numberOfValues = Object.values(logToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: `Request body must contain a log name`
          }
        })
    }

    newLog.log_date = log_date
    newLog.log_entry = log_entry
    LogsService.updateLog(
      req.app.get('db'),
      req.params.log_id,
      logToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = LogsRouter