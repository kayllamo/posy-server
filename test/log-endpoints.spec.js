const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Logs Endpoints', function () {
  let db

  const {
    testUsers,
  } = helpers.makeLogsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/logs`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers
      )
    )

    it(`creates a log, responding with 201 and the new log`, function () {
      this.retries(3)
      const testUser = testUsers[0]
      const newLog= {
        log_name: 'Log Test',
        log_date: '2019-06-22T00:00:00.000Z',
        log_entry: 'This is a test'
      }
      return supertest(app)
        .post('/api/logs')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newLog)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.log_name).to.eql(newLog.log_name)
          expect(res.body.log_date).to.eql(newLog.log_date)
          expect(res.body.log_entry).to.eql(newLog.log_entry)
          expect(res.headers.location).to.eql(`/api/logs/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('logs')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.log_name).to.eql(newLog.log_name)
            })
        )
    })

    const requiredFields = ['log_name', 'log_entry']

    requiredFields.forEach(field => {
      const testUser = testUsers[0]
      const newLog = {
        log_name: 'Spec Test',
        log_entry: 'Log test entry'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newLog[field]

        return supertest(app)
          .post('/api/logs')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newLog)
          .expect(400, {
            error: { message: `Missing '${field}' in request body`},
          })
      })
    })
  })
})