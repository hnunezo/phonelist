const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.static("build"));
app.use(cors());
//JSON PARSER
app.use(express.json());

// const morgan = require("morgan");
// //MIDDLEWARE MORGAN
// app.use(
//   morgan((tokens, req, res) => {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       JSON.stringify(req.body),
//     ].join(" ");
//   })
// );
let persons = [];

app.get("/", (req, res) => {
  res.send("Hola vatos");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((personas) => {
    persons = personas;
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: "unknown endpoint " });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (req, res) => {
  res.send(`
  <div>
    <p>Phonebook has info for ${persons.length}</p>
    <p>Solicitud realizada ${new Date()}</p>
    </div>`);
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  // MIDDLEWARE JSONPARSER AGREGA EL CAMPO BODY A LA REQ
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "missing name or number",
    });
  } else {
    if (persons.find((person) => person.name === body.name)) {
      return res.status(400).json({
        error: "Nombre debe ser unico",
      });
    }
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Escuchando el puerto ${PORT}`);
});
