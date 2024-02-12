const { UserService } = require("../repositories");

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

      await userService.createUser({
        email,
        password,
        name,
        age,
        lastName,
      });

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

      const userService = await UserService();
      const user = await userService.getUserByEmail(email);

      if (!user) {
        // return res.redirect("/?msg=Credenciales%20Erroneas")
        return res.status(401).json({
          result: "Credenciales incorrectas",
        });
      }

      if (password !== user.password) {
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
}

module.exports = new UserController();
