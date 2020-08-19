
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/addteam', function (req, res) {
  res.render('pages/addteam');
});

app.get('/team', function (req, res) {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var query = {};
    dbo.collection("teamdb")
      .find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/team', { team: result });
        db.close();
      });
  });

});

app.post('/addteamadd', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var players = req.body.players;
  var founded = req.body.founded;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var myobj = {
      team_id: id,
      team_name: name,
      team_players: players,
      Founded: founded
    };
    dbo.collection("teamdb").insertOne(myobj, function (err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/team");
    });
  });

});

app.get('/teamdetails/:name', function (req, res) {
  var nameteam = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var query = { team_name: nameteam };
    dbo.collection("teamdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/teamdetails', { detail: result });
      db.close();
    });
  });
});

app.get('/edit/:name', function (req, res) {
  var nameedit = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var query = { team_name: nameedit };
    dbo.collection("teamdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/edit', { detail: result });
      db.close();
    });
  });
});

app.post('/teamsave', function (req, res) {
  var ids = req.body.id;
  var names = req.body.name;
  var playerss = req.body.players;
  var foundeds = req.body.founded;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var myquery = { team_name: names };
    var newvalues = {
      $set: {
        team_id: ids,
        team_name: names,
        team_players: playerss,
        Founded: foundeds
      }
    };
    dbo.collection("teamdb").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/team");
    });
  });
});

app.get('/delete/:name', function (req, res) {
  var nameteam = req.params.name;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("team");
    var myquery = {
      team_name:nameteam
    };
    dbo.collection("teamdb").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
      res.redirect("/team");
    });
  });
});

app.listen(8080);
console.log('8080 is the magic port http://localhost:8080/');