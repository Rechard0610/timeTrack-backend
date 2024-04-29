exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.removed = result.removed;
  newData.firstname = result.firstname;
  newData.lastname = result.lastname;
  newData.email = result.email;
  newData.role = result.role;
  newData.status = result.status;
  newData.created = result.created;
  newData.updated = result.updated;
  return newData;
};
