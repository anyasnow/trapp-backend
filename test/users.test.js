"use strict";
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const { TEST_DB } = require('../src/config');
const User = require('../src/models/User');
const {runServer, closeServer} = require('../src/server');
const app = require('../src/app');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('~~~~~~ Deleting Database ~~~~~~~');
    User.collection.drop()
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

function seedDatabase() {
  return seedUsers()
}

function seedUsers() {
  console.info('Seeding users');
  const seedData = [];
  for (let i = 0; i < 5; i++) {
    seedData.push({
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
  }
  return User.insertMany(seedData)
}

describe(`TrApp User Tests`, () => {
  before(() => {
    return runServer(TEST_DB, 8080);
  });

  after(() => {
    return closeServer();
  })

  beforeEach(() => {
    return seedDatabase();
  })

  afterEach(() => {
    return tearDownDb();
  })

  describe('GET endpoints', () => {
    it(`should get all users`, () => {
      let users;

      return User.find()
        .then(allUsers => {
          users = allUsers;
          return chai.request(app).get('/api/users');
        })
        .then(res => {
          // existance, datatype, value
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(5);
          res.body.forEach((user, index) => {
            user.should.be.a('object');
            user.should.include.keys('_id', 'username', 'email');
            user.email.should.equal(users[index].email);
          })
        })
    })
  })

  describe('POST endpoints', () => {
    it('should register a new user', () => {
      let newUser = new User({
        email: "testuser@test.com",
        username: "testuser1"
      });
      newUser.password = newUser.generateHash("123Password#")

      return chai.request(app).post('/api/users/signup').send(newUser)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          newUser.validPassword("123Password#").should.equal(true);
        })
    })
  })
})