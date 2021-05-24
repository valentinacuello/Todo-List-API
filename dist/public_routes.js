"use strict";
exports.__esModule = true;
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 *
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
var express_1 = require("express");
var utils_1 = require("./utils");
var actions_1 = require("./actions");
var router = express_1.Router();
// signup route, creates a new user in the DB
router.post('/user', utils_1.safe(actions_1.createUser));
router.get('/todos/user/:user_id', utils_1.safe(actions_1.getTodos));
router.get('/todos/user', utils_1.safe(actions_1.getUsers));
router.get('/user/:user_id', utils_1.safe(actions_1.getUserId));
router.post('/todos/user/:user_id', utils_1.safe(actions_1.postTodos));
router["delete"]('/user/:user_id', utils_1.safe(actions_1.deleteUser));
exports["default"] = router;
