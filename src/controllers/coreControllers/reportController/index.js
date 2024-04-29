const reportProdcutiveList = require('./reportProdcutiveList');

const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
const endOfWeek = new Date(today);
endOfWeek.setDate(startOfWeek.getDate() + 6);

const range = {
  startDate: startOfWeek.setUTCHours(0, 0, 0, 0),
  endDate: endOfWeek.setUTCHours(23, 59, 59, 999),
};

const methods = {
  reportProdcutiveList: (req, res) => reportProdcutiveList(req, res, range),
};

module.exports = methods;
