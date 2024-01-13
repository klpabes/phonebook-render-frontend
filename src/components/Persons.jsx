import Person from "./Person";

const Persons = ({ personShow, deletePerson }) => {
  return (
    <ul>
      {personShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

export default Persons;
