var chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-like'));
chai.use(require('chai-things'));
var expect = chai.expect;

var server = require('../index');
var blackboards = require('../service/BlackboardService').blackboards;
var randomstring = require('randomstring');

// define maximum length of a blackboard name
var maxBlackboardName = 32;
// define maximum count of blackboards
var maxBlackboards = 255;
// define maximum length of a blackboard message
var maxMessage = 4096;

describe('Blackboard service', function() {

    describe("GET /", function() {    
        it("should return home page on GET /", function(done){
            chai.request(server)
                .get("/")
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });     
    });

    describe("GET /INVALID_PATH", function() {
        it("should return not found for invalid path on GET /INVALID_PATH", function(done) {
            chai.request(server)
                .get("/INVALID_PATH")
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        })
    });

    describe("GET /blackboard", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        before(function() {
            blackboards.push(blackboardObject);
        });
      
        after(function() {
            var index = blackboards.map(function(element) {return element.name}).indexOf(testName);
            blackboards.splice(index, 1);
        });   

        it("should get all existing blackboards with metadata on GET /blackboard", function(done){
            chai.request(server)
                .get("/api/blackboard")
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("blackboards");
                    expect(res.body.blackboards).to.be.an("array");
                    expect(res.body.blackboards).to.deep.include(blackboardObject);
                    done();
                });
        });     
    });

    describe("GET /blackboard/{name}", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};
        var blackboardObjectStatus = {"name": testName, "empty": false, "timestamp": timestamp};

        before(function() {
            blackboards.push(blackboardObject);
        });
      
        after(function() {
            var index = blackboards.map(function(element) {return element.name}).indexOf(testName);
            blackboards.splice(index, 1);
        });   

        it("should read message from a blackboard on GET /blackboard/{name}", function(done){
            chai.request(server)
                .get("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal(blackboardObject);
                    done();
                });
        });     

        it("should respond 404 with an invalid blackboard name supplied on GET /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .get("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });  

        it("should read status of a blackboard on GET /blackboard/{name}?format=status", function(done){
            chai.request(server)
                .get("/api/blackboard/" + testName + "?format=status")
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal(blackboardObjectStatus);
                    done();
                });
        }); 

        it("should respond 400 with an invalid query parameter supplied on GET /blackboard/{name}?format=invalid", function(done){
            chai.request(server)
                .get("/api/blackboard/" + testName + "?format=INVALID_PARAM")
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });  

    describe("PUT /blackboard/{name}", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        var testLengthName = randomstring.generate(maxBlackboardName + 1);       
        
        after(function() {
            for(var i = 0; i < blackboards.length; i++) {
                if(blackboards[i].name === testName) {
                    blackboards.splice(i,1);
                    i--;
                }
            }
        });

        it("should create a new blackboard on PUT /blackboard/{name}", function(done){
            chai.request(server)
                .put("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(blackboards).to.be.an("array").that.contains.something.like({"name": testName});
                    done();
                });
        });

        it("should respond 409 with an already existing blackboard name supplied on PUT /blackboard/{name}", function(done){
            chai.request(server)
                // possible, because the method above adds the same blackboard with the same name
                .put("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(res).to.have.status(409);
                    done();
                });
        });

        it("should respond 400 with a too long blackboard name supplied on PUT /blackboard/{name}", function(done){
            chai.request(server)
                .put("/api/blackboard/" + testLengthName)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it("should respond 507 when max. number of blackboards already reached on PUT /blackboard/{name}", function(done){
            for(var i = 0; i <= maxBlackboards; i++) {
                blackboards.push(blackboardObject);
            }
            
            chai.request(server)
                .put("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(res).to.have.status(507);
                    done();
                });
        });
    });

    describe("DELETE /blackboard/{name}", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        before(function() {
            blackboards.push(blackboardObject);
        });
      
        after(function() {
            var index = blackboards.map(function(element) {return element.name}).indexOf(testName);
            blackboards.splice(index, 1);
        });   

        it("should delete blackboard on DELETE /blackboard/{name}", function(done){
            chai.request(server)
                .delete("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);
                    expect(blackboards).to.be.an("array").that.not.contains.something.like({"name": testName});
                    done();
                });
        }); 
        
        it("should respond 404 with an invalid blackboard name supplied on DELETE /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .delete("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe("PATCH /blackboard/{name}", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        var updatedMessage = "updated: Blackboard für Unit Test PATCH";
        var testLengthMessage = randomstring.generate(maxMessage + 1);

        before(function() {
            blackboards.push(blackboardObject);
        });
      
        after(function() {
            var index = blackboards.map(function(element) {return element.name}).indexOf(testName);
            blackboards.splice(index, 1);
        });   

        it("should update message from blackboard on PATCH /blackboard/{name}", function(done){
            chai.request(server)
                .patch("/api/blackboard/" + testName)
                .send({"message": updatedMessage})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(blackboards).to.be.an("array").that.contains.something.like({"message": updatedMessage});
                    expect(res.body).to.have.deep.property("name", testName);
                    expect(res.body).to.have.deep.property("message", updatedMessage);
                    done();
                });
        }); 
        
        it("should respond 404 with an invalid blackboard name supplied on PATCH /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .patch("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .send({"message": updatedMessage})
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("should respond 400 with a too long message supplied in request body on PATCH /blackboard/{name}", function(done){
            chai.request(server)
                .patch("/api/blackboard/" + testName)
                .send({"message": testLengthMessage})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
})
