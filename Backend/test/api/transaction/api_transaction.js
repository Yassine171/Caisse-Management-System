process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../index.js');
const should = chai.should();
chai.use(chaiHttp)

const connection = require("../../../connection");

describe('TODO API', () => {
    connection.connect();

    it('OK, login with my account and get all transaction and delete the first one and update and add transaction', (done) => {
    chai.request(app)
    .post('/user/login')
    // send user login details
    .send({
        email:"admin@admin.com",
        password:"admin123"
    })
    .end((err, res) => {
        console.log('this runs the login part',res.body);
        res.body.should.have.property('token');
        var token = res.body.token;

        chai.request(app)
            .get('/transaction/get')
            .set('Authorization', 'JWT ' + token)
            .end(function(err, res) {
              console.log("getting all transaction successfully");
                chai.request(app)
                    .delete('/transaction/delete/' + res.body.data[0].id)
                    .set('Authorization', 'JWT ' + token)
                    .end(function(error, resonse) {
                        resonse.should.have.status(200);
                        resonse.body.should.have.property('message');
                        resonse.body.message.should.equal('transaction deleted successfully');
                        console.log("transaction deleted successfully");
                       
                    })
                    chai.request(app)
                .get('/transaction/get')
                .set('Authorization', 'JWT ' + token)
                .end(function(err, res) {
                  
                  console.log(res.body.data[0].id);
                         chai.request(app)
                         
                        .patch('/transaction/update/' )
                        .set('Authorization', 'JWT ' + token)
                        .send({
                          
                            "libelle": "updated", "recette": "100", "depense": "50", "userid": 1,"id":res.body.data[0].id
                      })
                        .end(function(error, resonse) {
                            resonse.should.have.status(200);
                            resonse.body.should.have.property('message');
                            resonse.body.message.should.equal('transaction updated successfully');
                            console.log("transaction updated successfully");
                           
                        })
                      })
                    chai.request(app)
                    .post('/transaction/add')
                    .set('Authorization', 'JWT ' + token)
                    .send({ libelle: "jkhk", date_transaction: "2022-10-02", recette: "69", depense: "67", userid: "1"})
                    .end((err, res)  => {
                      const body = res.body;
                      res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('message');
                          res.body.message.should.equal('transaction added successfully');
                        console.log("transaction add successfully");
                        done();
                    })
                
                });
            })
    })
})

  