const bcrypt = require("bcrypt");
const User = require("../models/Users");

const ADMIN_EMAIL = "admin@aetickethub.local";
const ADMIN_PASSWORD = "Admin123!";

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.updateOne(
    { email: ADMIN_EMAIL },
    {
      $set: {
        name: "AETicketHub Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      },
    },
    { upsert: true },
  );

  console.log(`Admin account ready: ${ADMIN_EMAIL}`);
};

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  seedAdmin,
};
