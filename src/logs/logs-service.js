const LogsService = {
    getAllLogs(knex) {
        return knex
            .select('*')
            .from('logs')
    },

    insertLog(knex, newLogs) {
        return knex
            .insert(newLogs)
            .into('logs')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('logs')
            .select('*')
            .where({ id })
            .first()
    },

    deleteLog(knex, id) {
        return knex
            .from('logs')
            .where({ id })
            .delete()
    },

    updateLog(knex, id, newLogsFields) {
        return knex
            .from('logs')
            .where({ id })
            .update(newLogsFields)
    },
}

module.exports = LogsService