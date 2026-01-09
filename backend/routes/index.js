const express = require("express");
const router = express.Router();
const v1Routes = require("./v1");

/**
 * API Versioning
 * Primary entry point for version 1 of the API.
 */
router.use("/v1", v1Routes);

/**
 * Backward Compatibility
 * To ensure existing Mobile App, Website, and Panels remain functional
 * during the migration, we preserve the unversioned paths.
 */
router.use("/", v1Routes);

module.exports = router;
