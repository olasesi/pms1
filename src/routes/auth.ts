import express from "express";
import {
  signup,
  login,
  confirmEmail,
  logout,
  //socialLogin,
  //socialLogout,
} from "./../controllers/auth";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/confirm-email", confirmEmail);
//router.get("/social/:provider", socialLogin);
router.post("/logout", logout);
//router.post("/social-logout", socialLogout); // Social Logout

export { router };
