exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.removed = result.removed;
  newData.teamname = result.teamname;
  newData.people = result.people;
  newData.created = result.created;
  newData.updated = result.updated;
  return newData;
};
