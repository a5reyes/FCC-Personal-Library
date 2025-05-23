/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/json")
          .send({
            title: "Moby Dick",
            comments: [],
            commentcount: 0
          })
          .end(function (err, res){
            assert.equal(res.status, 200);
            book = res.body._id;
            assert.equal(res.body.title, "Moby Dick");
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/json")
          .send({
            title: "",
            comments: [],
            commentcount: 0
          })
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response is an array");
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/286816c6ddeceb21f6e0a6e7")
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get("/api/books/" + book)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Moby Dick");
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post("/api/books/" + book)
          .send({
            comment: "hello everybody"
          })
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], "hello everybody");
            done();
          })
        
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post("/api/books/" + book)
          .send({})
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post("/api/books/286816c6ddeceb21f6e0a6e7")
          .send({})
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete("/api/books/6826289c8f189e27afb3293a")
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete("/api/books/682628d70c7ffbb581eeb396")
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });

    });

  });

});
