const Funcionario = require("../models/funcionarioModel");
const Doador = require("../models/doadorModel");
const Entidade = require("../models/entidadeBeneficiadoraModel");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");
const bcrypt = require("bcryptjs");

let authController = {};

authController.renderLoginPage = function (req, res, next) {
    res.render("login");
};

async function getUser(email) {
    console.log(email);
    let user = await Funcionario.findOne({ email });
    if (user) return user;

    user = await Doador.findOne({ email });
    if (user) return user;

    user = await Entidade.findOne({ email });
    if (user) return user;

    return null;
}

authController.submittedLogin = async function (req, res, next) {
    try {
        const user = await getUser(req.body.email);

        if (!user) {
            return res.render("error", {
                message: "Email não encontrado",
                error: "Email não encontrado",
            });
        }

        const { password } = req.body;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("error", {
                message: "Password incorreta",
                error: "Password incorreta",
            });
        }

        req.user = { _id: user._id };

        const token = jwt.sign(
            { email: user.email, role: user.role, _id: user._id },
            config.secret,
            { expiresIn: "1d" }
        );

        res.cookie("auth-token", token, { maxAge: 86400000, httpOnly: true });

        if (user.role === "admin" || user.role === "funcionario") {
            res.redirect("/");
        } else {
            return res.render("error", {
                message: "O site ainda não está disponível",
                error: "O site ainda não está disponível",
            });
        }
    } catch (error) {
        return res.render("error", {
            message: "Ocorreu um erro durante o login",
            error: error.message,
        });
    }
};

authController.submittedLogin2 = async function (req, res, next) {
    try {
        const user = await getUser(req.body.email);

        if (!user) {
            return res.status(404).json({
                result: false,
                message: "Email não encontrado",
            });
        }

        const { password } = req.body;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                result: false,
                message: "Password incorreta",
            });
        }

        req.user = { _id: user._id };

        const token = jwt.sign(
            { email: user.email, role: user.role, _id: user._id },
            config.secret,
            { expiresIn: "1d" }
        );

        let response = {
            result: true,
            message: "Login bem-sucedido",
            token: token,
        };

        // Se o usuário for uma entidade, adicionar o status ao response
        if (user.role === 'entidade') {
            response.isAccepted = user.status;
        }

        return res.json(response);
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: "Ocorreu um erro durante o login",
            error: error.message,
        });
    }
};


authController.login = function (req, res, next) {
    res.render("login/index");
};

authController.logout = function (req, res, next) {
    res.clearCookie("auth-token");
    res.redirect("/");
};

authController.createLogin = function (req, res, next) {
    res.render("login/createUser");
};

authController.createLoginSubmitted = function (req, res, next) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;

    mongoUser
        .create(req.body)
        .then(function () {
            res.redirect("/");
        })
        .catch(function (err) {
            next(err);
        });
};

authController.verifyLoginUser = function (req, res, next) {
    const authToken = req.cookies["auth-token"];
    if (authToken) {
        jwt.verify(authToken, config.secret, function (err, decoded) {
            req.user = decoded;
            next();
        });
    } else {
        res.redirect("/login");
    }
};

authController.verifyLoginUser2 = function (req, res, next) {
  const authHeader = req.headers["authorization"]; // Use 'authorization' em minúsculas

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extrai o token após "Bearer "

    jwt.verify(token, config.secret, function (err, decoded) {
      // Corrija a referência ao secret
      if (err) {
        return res.status(401).json({
          message: "Token inválido ou expirado",
          error: err.message,
        });
      }

      req.user = decoded;
      next();
    });
  } else {
    return res.status(403).json({
      message: "Token não fornecido",
    });
  }
};


authController.checkRoles = function (roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.clearCookie("auth-token");
            return res.redirect("/login");
        }
        next();
    };
};

module.exports = authController;
