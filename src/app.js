require("./config/config");
const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const { MONGO_URL, COOKIE_SECRET } = require("./config/config");
const initializePassport = require("./config/passport.config");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
// const sessionsRouter = require("./routes/sessions.router");

// v2
const UsersRouter = require("./routes/v2/user.router");
const SessionsRouter = require("./routes/v2/sessions.router");

const db = require("./dao/db");
const ProductModel = require("./dao/models/products.model");
const MessageModel = require("./dao/models/messages.model");


const app = express();
const PUERTO = 8080;
const httpServer = app.listen(PUERTO, async () => {
  await db();
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});
const io = new Server(httpServer);

// socket server
io.on("connection", async (socket) => {
  console.log("cliente conectado:", socket.id);

  const products = await ProductModel.find().lean();
  socket.emit("listar_productos", products);

  socket.on("user_autenticado", async (user) => {
    const messages = await MessageModel.find().lean();

    socket.emit("messageLogs", messages);

    socket.broadcast.emit("user_conectado", user);
  });

  socket.on("message", async (data) => {
    await new MessageModel(data).save();

    const messages = await MessageModel.find().lean();
    io.emit("messageLogs", messages);
  });
});
app.set("io", io);

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 1 * 3600, // 1 hora
    }),
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// view engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// app.use("/api/sessions", sessionsRouter);

// v2
const usersRouter = new UsersRouter()
const sessionsRouter = new SessionsRouter()
app.use("/api/users", usersRouter.getRouter())
app.use("/api/sessions", sessionsRouter.getRouter());
