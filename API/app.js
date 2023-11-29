const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const dotenv = require("dotenv");
const database = require("./database");
const cors = require("cors");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", usersRouter);
app.use("/api", authRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
