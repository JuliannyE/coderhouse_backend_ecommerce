const { UserService } = require("../repositories");
const { createHash, isValidPassword } = require("../utils/hashedPassword");

class UserController {
  async createUser(req, res) {
    try {
      const { email, password, name, age, lastName } = req.body;

      if (!email || !password || !name || !age || !lastName) {
        return res.status(400).send({
          errorMsg: "Formulario incompleto",
        });
      }

      const userService = await UserService();
      const existUser = await userService.getUserByEmail(email);

      if (existUser) {
        return res.status(400).json({
          result: `Usuario con email ${email} ya existe`,
        });
      }

      const userData = {
        email,
        password: createHash(password),
        name,
        age,
        lastName,
      };

      await userService.createUser(userData);

      res.redirect("/");
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (email === "" || password === "") {
        return res.status(400).send({
          errorMsg: "Formulario incompleto",
        });
      }

      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
          name: "Admin",
          lastName: "Coder",
          email,
          role: "admin",
        };

        return res.redirect("/");
      }

      const userService = await UserService();
      const user = await userService.getUserByEmail(email);

      if (!user) {
        // return res.redirect("/?msg=Credenciales%20Erroneas")
        return res.status(401).json({
          result: "Credenciales incorrectas",
        });
      }

      if (!isValidPassword(user.password, password)) {
        // return res.redirect("/?msg=Credenciales%20Erroneas")
        return res.status(401).json({
          result: "Credenciales incorrectas",
        });
      }

      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        age: user.age,
        role: user.role,
      };

      res.redirect("/products");
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: "Logout Error", body: err });
      }

      res.redirect("/");
    });
  }

  async getCurrentUser(req, res) {
    const { user } = req.session;

    return res.json({
      ok: true,
      user,
    });
  }

  async recoveryUser(req, res) {
    try {
      const { email, password } = req.body;

      if (email === "" || password === "") {
        return res.status(400).send({
          errorMsg: "Formulario incompleto",
        });
      }

      const userService = await UserService();
      const user = await userService.getUserByEmail(email);

      if (!user) {
        // return res.redirect("/?msg=Credenciales%20Erroneas")
        return res.status(401).json({
          result: "Credenciales incorrectas",
        });
      }

      user.password = createHash(password);
      await userService.updateUser(user._id, user);

      res.redirect("/");
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }
}

module.exports = new UserController();
