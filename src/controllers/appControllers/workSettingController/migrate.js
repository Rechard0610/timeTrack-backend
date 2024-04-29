exports.migrate = (result) => {
  let newData = {};
  newData._id = result._id;
  newData.removed = result.removed;
  newData.name = result.name;
  newData.contactphone = result.contactphone;
  newData.contactgmail = result.contactgmail;
  newData.hourlyrate = result.hourlyrate;
  newData.currency = result.currency;
  newData.contactnr = result.contactnr;
  newData.companyaddress = result.companyaddress;
  newData.vatid = result.vatid;
  newData.regnr = result.regnr;
  newData.defaulttask = result.defaulttask;
  newData.created = result.created;
  newData.updated = result.updated;
  return newData;
};
