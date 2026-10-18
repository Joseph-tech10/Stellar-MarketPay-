"use strict";

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openApiSpec = require("../../docs/openapi.json");

const router = express.Router();

router.get("/json", (_req, res) => res.json(openApiSpec));
router.use("/", swaggerUi.serve, swaggerUi.setup(openApiSpec));

module.exports = router;
