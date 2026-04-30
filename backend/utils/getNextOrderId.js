// const Counter = require("../models/Counter");

// const getNextOrderId = async () => {
//   const counter = await Counter.findOneAndUpdate(
//     { name: "order" },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   const number = counter.seq.toString().padStart(6, "0");
//   return `ISPK${number}`;
// };

// module.exports = getNextOrderId;



import Counter from "../models/Counter.js";

const getNextOrderId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "orderId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `AIP-${padded}`;
};

export default getNextOrderId;