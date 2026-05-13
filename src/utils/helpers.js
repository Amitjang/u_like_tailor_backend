const makeId = (prefix) => `${prefix}-${Date.now()}`;

const normalizeStatus = (status) => {
  const allowed = ["pending", "stitching", "trial", "alteration", "ready", "delivered"];
  return allowed.includes(status) ? status : null;
};

const orderDueAmount = (order) => Math.max((order.totalAmount || 0) - (order.paidAmount || 0), 0);

module.exports = {
  makeId,
  normalizeStatus,
  orderDueAmount
};
