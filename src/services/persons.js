import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const showPersons = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createPerson = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};
const updateNumber = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deletePerson = (deleteObject) => {
  axios.delete(`${baseUrl}/${deleteObject.id}`);
  return;
};

export default {
  showPersons,
  createPerson,
  updateNumber,
  deletePerson,
};
