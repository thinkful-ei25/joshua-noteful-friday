'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
 const expect = chai.expect;
chai.use(chaiHttp);
 
 describe('Static server', function () {
   it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});
 describe('404 handler', function () {
   it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});
 describe('GET /api/notes', function () {
  it('should return notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
      });
  });
   it('should return an array of objects with the id, title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        for (let i = 0; i < res.body.length; i++) {
          expect(res.body[i]).to.be.a('object');
          expect(res.body[i]).to.include.keys('id', 'title', 'content');
        }
      });
  });
   it('should return correct search results', function () {
    return chai.request(app)
      .get('/api/notes/?searchTerm=oring')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
      });
  });
   it('should return an empty array for bad search', function () {
    return chai.request(app)
      .get('/api/notes/?searchTerm=cannibals')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});
 describe('GET /api/notes/:id', function () {
  it('should return correct note object with id', function () {
    return chai.request(app)
      .get('/api/notes/1000')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1000);
        expect(res.body.title).to.equal('5 life lessons learned from cats');
      });
  });
  it('should respond with a 404 for an invalid id', function(){
    return chai.request(app)
      .get('/api/notes/0554')
      .then(function (res){
        expect(res).to.have.status(404);
      });
  });
});
 describe('POST /api/notes', function () {
   it('should create and return a new item on POST', function () {
    const newNote ={
      'title':'are you 1337?',
      'content':'crash and burn, get it?'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.have.header('location');
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');    
        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newNote.title);
        expect(res.body.content).to.equal(newNote.content);   
      });
  });
  it('should return object with message "Missing title in request body" when missing "title" field', function(){
    const newNote= {
      'content':'missing title'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});
describe('PUT /api/notes/:id', function () {
   it('should update and return a note object when given data', function () {
    const updateNote = {
      'title': 'Strange things are afoot',
      'content': 'at the circle k'
    };
    return chai.request(app)
      .put('/api/notes/1004')
      .send(updateNote)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1004);
        expect(res.body.title).to.equal(updateNote.title);
        expect(res.body.content).to.equal(updateNote.content);
      });
  });
   it('should respond with a 404 for an invalid id', function () {
    const updateNote = {
      'title': 'yass',
      'content': 'not so much'
    };
    return chai.request(app)
      .put('/api/notes/0554')
      .send(updateNote)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
   it('should return an object with a message property "Missing title in request body" when missing "title" field', function () {
    const updateNote = {
      'drseuss':'who is it'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateNote)
      .then(res => {
      });
  });
});
 describe('DELETE  /api/notes/:id', function () {
   it('should delete an item by id', function () {
    return chai.request(app)
      .delete('/api/notes/1008')
      .then(res =>{
        expect(res).to.have.status(204);
      });
  });
});