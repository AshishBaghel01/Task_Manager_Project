const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const ensureEnvAdmin = require("./src/utils/ensureEnvAdmin");

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(async () => {
    await ensureEnvAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
