const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Import the 'path' module

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const dealsRouter = require("./routes/deals");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("", usersRouter);
app.use("", authRouter);
app.use("", dealsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
