var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var multer = require("multer");
var dotEnv = require("dotenv");
var mg = require("mailgun.js");
var cors = require("cors");
var cron = require("node-cron");
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./swagger.json");

const Requests = require("./models/requestsModel");

dotEnv.config();

const mailGun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

cron.schedule("*/01 * * * *", () => {
  console.log("A executar tarefa agendada a cada minuto");
  processScheduledDonations();
});

async function processScheduledDonations() {
  const now = new Date();

  const scheduledDonations = await Requests.find({
    data: { $lte: now },
    estado: "Aprovado",
  });

  const toInitiateDonations = await Requests.find({
    data: { $lte: now },
    estado: "Agendado",
  });

  for (let donation of toInitiateDonations) {
    donation.estado = "Por iniciar";
    await donation.save();
  }

  for (let donation of scheduledDonations) {
    donation.estado = "A realizar";
    await donation.save();
  }

  console.log("Doações agendadas processadas com sucesso.");
}

var loginRouter = require("./routes/login");
var usersRouter = require("./routes/users");
var users2Router = require("./routes/users2");
var rulesRouter = require("./routes/rules");
var dashboardRouter = require("./routes/dashboard");
var requestRouter = require("./routes/requests");
var request2Router = require("./routes/requests2");
var myCountRouter = require("./routes/myCount");
var valesRouter = require("./routes/vales");
var vales2Router = require("./routes/vales2");

var app = express();
mongoose.connect(
  "mongodb+srv://migueltav5:won6eDX8aksfA32V@reciclatextil.lufifqt.mongodb.net/users"
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
var authController = require("./controllers/loginController");
const { Domain } = require("domain");

// Configuração do armazenamento dos arquivos pelo Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Inicialização do Multer com a configuração de armazenamento
const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.use("/", loginRouter);
app.use(
  "/users",
  authController.verifyLoginUser,
  authController.checkRoles(["admin", "funcionario"]),
  usersRouter
);
app.use("/users2", users2Router);
app.use(
  "/rules",
  authController.verifyLoginUser,
  authController.checkRoles(["admin"]),
  rulesRouter
);
app.use(
  "/dashboard",
  authController.verifyLoginUser,
  authController.checkRoles(["admin", "funcionario"]),
  dashboardRouter
);
app.use(
  "/requests",
  authController.verifyLoginUser,
  authController.checkRoles(["admin", "funcionario"]),
  requestRouter
);
app.use("/requests2", request2Router);
app.use(
  "/myCount",
  authController.verifyLoginUser,
  authController.checkRoles(["admin", "funcionario"]),
  myCountRouter
);
app.use(
  "/vales",
  authController.verifyLoginUser,
  authController.checkRoles(["admin"]),
  valesRouter
);
app.use("/vales2", vales2Router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
