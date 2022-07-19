const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as a argument: node mongo.s <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

// SE PUEDE CAMBIAR
const database_name = "phonelist";

const url = `mongodb+srv://pechohot:${password}@cluster0.nfmkb.mongodb.net/${database_name}?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// // AGREGAR PERSONA
// const person = new Person({
//   name: personName,
//   number: personNumber,
// });

// person.save().then((result) => {
//   console.log(`Person ${result.name} phonenumber ${result.number} saved`);
//   mongoose.connection.close();
// });

// TRAER DATOS
Person.find({}).then((result) => {
  console.log("phonebook:");
  result.forEach((user) => {
    console.log(`Persona: ${user.name}`);
    console.log(`Numero: ${user.number}`);
    console.log(`--------------------------------`);
  });
  mongoose.connection.close();
});
