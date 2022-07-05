const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());

//JSON PARSER
app.use(express.json());

//MIDDLEWARE MORGAN
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hola vatos");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end("Error 404, persona no encontrada");
  }
});

app.get("/info", (req, res) => {
  res.send(`
  <div>
    <p>Phonebook has info for ${persons.length}</p>
    <p>Solicitud realizada ${new Date()}</p>
    </div>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    persons = persons.filter((per) => per.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const generateId = () => {
    const maxId =
      persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
    return maxId + 1;
  };

  // MIDDLEWARE JSONPARSER AGREGA EL CAMPO BODY A LA REQ
  const body = req.body;

  if (!body.name || !body.number) {
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

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Escuchando el puerto ${PORT}`);
});
