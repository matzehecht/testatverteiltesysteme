// implementation of unit tests for all provided API methods

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
    // should return home page with statuscode 200 on GET /
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

    // should return status code 404 (Not found) on an invalid path
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

    // tests of the GET method, which returns all available / stored blackboards with metadata
    describe("GET /blackboard", function() {
        // before test execution, store a test blackboard to check correct funtion and remove it afterwards
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        before(function() {
            blackboards.push(blackboardObject);
        });
      
        after(function() {
            // get array index of the stored test blackboard to be able to delete it
            var index = blackboards.map(function(element) {return element.name}).indexOf(testName);
            blackboards.splice(index, 1);
        });   

        // method should return status code 200 and an object array under a property called 'blackboards'
        // also the before stored test blackboard should be part of this response array
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

    // tests of the GET method, which returns message or status of a parametered blackboard
    describe("GET /blackboard/{name}", function() {
        // before test execution, store two test blackboards to check correct funtion and remove it afterwards
        // (for message return and for status return)
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

        // method should return status code 200 and the blackboard object with an existing blackboard name supplied
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

        // method should return 404, if an invalid (not existing) blackboard name supplied 
        it("should respond 404 with an invalid blackboard name supplied on GET /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .get("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });  

        // method should return status code 200 and the blackboard object status with an existing blackboard name 
        // and the correct query parameter (format=status) supplied
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

        // method should return 400, if an invalid query parameter supplied 
        it("should respond 400 with an invalid query parameter supplied on GET /blackboard/{name}?format=invalid", function(done){
            chai.request(server)
                .get("/api/blackboard/" + testName + "?format=INVALID_PARAM")
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });  

    // tests of the PUT method, which creates a new empty blackboard
    describe("PUT /blackboard/{name}", function() {
        var testName = "Test Blackboard"
        var timestamp = Date.now();
        var message = "Blackboard für Unit Test";
        var blackboardObject = {"name": testName, "message": message, "timestamp": timestamp};

        // string to test maximum blackboard name length (random string with maximum allowed characters + 1)
        var testLengthName = randomstring.generate(maxBlackboardName + 1);       
        
        // after test execution, delete all test blackboard objects determined by the blackboard name
        after(function() {
            for(var i = 0; i < blackboards.length; i++) {
                if(blackboards[i].name === testName) {
                    blackboards.splice(i,1);
                    i--;
                }
            }
        });

        // method should return status code 201 and the empty blackboard object with the corresponding name
        // when a valid blackboard name supplied
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

        // method should return status code 409 when the parametered blackboard name already exists
        it("should respond 409 with an already existing blackboard name supplied on PUT /blackboard/{name}", function(done){
            chai.request(server)
                // test possible like that, because the test above adds the same blackboard with the same name
                .put("/api/blackboard/" + testName)
                .end(function (err, res) {
                    expect(res).to.have.status(409);
                    done();
                });
        });

        // method should return 400 when the parametered blackboard name is longer than the maximum allowed character count
        it("should respond 400 with a too long blackboard name supplied on PUT /blackboard/{name}", function(done){
            chai.request(server)
                .put("/api/blackboard/" + testLengthName)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });

        // method should return 507 when there are already maximum allowed blackboard objects stored
        it("should respond 507 when max. number of blackboards already reached on PUT /blackboard/{name}", function(done){
            // before test execution, create maximum allowed blackboards to be able to check this function
            for(var i = 0; i < maxBlackboards; i++) {
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

    // tests of the DELETE method, which deletes / removes an existing blackboard
    describe("DELETE /blackboard/{name}", function() {
        // before test execution, store a test blackboard to check correct funtion and remove it afterwards,
        // if deletion wasn't correctly executed
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

        // method should return status code 404, if an existing blackboard name supplied
        // also the blackboards array isn't allowed to have an object with the name of the deleted blackboard anymore
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
        
        // method should return 404, if an invalid (not existing) blackboard name supplied 
        it("should respond 404 with an invalid blackboard name supplied on DELETE /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .delete("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    // tests of the PATCH method, which updates a message from an existing blackboard
    describe("PATCH /blackboard/{name}", function() {
        // before test execution, store a test blackboard to check correct funtion and remove it afterwards,
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

        // string to test correct update function
        var updatedMessage = "updated: Blackboard für Unit Test PATCH";
        // string to test maximum message length (random string with maximum allowed characters + 1)
        var testLengthMessage = randomstring.generate(maxMessage + 1);

        // method should return 200 if an existing blackboard name and a valid message supplied and
        // the response object should have the blackboard name supplied in the URL and the updated message
        // also the blackboards array should contain an object with the updated message
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
        
        // method should return 404, if an invalid (not existing) blackboard name supplied 
        it("should respond 404 with an invalid blackboard name supplied on PATCH /blackboard/{invalid_name}", function(done){
            chai.request(server)
                .patch("/api/blackboard/INVALID_BLACKBOARD_NAME")
                .send({"message": updatedMessage})
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        // method should return 400, if a message supplied with more than the maximum allowed character count
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
