import { useState, useEffect } from "react";
import axios, { all } from "axios";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.showPersons().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const personShow = persons.filter((person) =>
    person.name.includes(searchName)
  );

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.every((person) => personObject.name !== person.name)) {
      personService.createPerson(personObject).then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
        setNewName("");
        setNewNumber("");
        setErrorMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return;
      });
    } else if (persons.some((person) => personObject.name === person.name)) {
      if (
        window.confirm(
          `${personObject.name} is already added in the phonebook, replace the old number with the a new one?`
        )
      ) {
        const person = persons.find((p) => p.name === personObject.name);
        const id = person.id;
        const updatedPerson = { ...person, number: newNumber };

        personService
          .updateNumber(id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setErrorMessage(`Changed ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${person.name} has already been removed from the server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    }
    return;
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (person && window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(person);
      personShow.splice(personShow.indexOf(person), 1);
      setPersons(personShow);
    }
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <div>
        filter shown with
        <Filter value={searchName} onChange={handleSearchChange} />
      </div>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personShow={personShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
