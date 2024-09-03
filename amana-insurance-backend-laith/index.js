import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import assurancesRoute from "./src/routes/assuranceObligatoire.route.js";
import travelsRoute from "./src/routes/travel.route.js";
import userRoute from "./src/routes/user.route.js";
import bureauRoute from "./src/routes/bureau.route.js";
import santePersonneRoute from "./src/routes/santePersonne.route.js";
import santeGroupeRoute from "./src/routes/santeGroupe.route.js";
import authRoute from "./src/routes/auth.route.js";
import paymentRoute from './src/routes/payment.route.js'
import db from "./src/models/index.js";
import thirdInsuranceRoute from "./src/routes/third-insurance.route.js";

let app = express();
app.set('trust proxy', 1)
app.get('/ip', (request, response) => response.send(request.ip))
dotenv.config();
const allowedDomains = ["http://localhost:4200","http://localhost:49438","https://itamana.ly"];
const corsOptions = {
  origin: allowedDomains,
  credentials: true,
  allowedHeaders : ["Content-Type", "Authorization", "Set-Cookie"]
};
//app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads/", express.static("uploads"));


// Routes
app.use("/auth/", authRoute)
app.use("/assurance-obligatoire/", assurancesRoute);
app.use("/travel/", travelsRoute);
app.use("/user/", userRoute);
app.use("/bureau/", bureauRoute);
app.use("/sante-groupe/", santeGroupeRoute);
app.use("/sante-personne/", santePersonneRoute);
app.use("/third-insurance/", thirdInsuranceRoute);
app.use("/payment/", paymentRoute);

// Creating server
db.sequelize.sync().then(() => {
  console.log("db connnected successfully");
  const port = process.env.PORT;
  express().use("/api",app).listen(port, () => {
    console.log("Server running at port: " + port);
  });
});
