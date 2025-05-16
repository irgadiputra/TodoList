"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const orgenaizer_controller_1 = require("../controllers/orgenaizer.controller");
const router = (0, express_1.Router)();
router.get("/stats", auth_middleware_1.VerifyToken, orgenaizer_controller_1.getStatsController);
router.get("/review", auth_middleware_1.VerifyToken, orgenaizer_controller_1.getOrganizerProfileController);
exports.default = router;
