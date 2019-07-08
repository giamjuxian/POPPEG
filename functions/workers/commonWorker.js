'use strict'

const config = require("../config.json")

/**
 * Retrieve public config file of project
 */
exports.getProjectConfig = function (req, res, next) {
    if (process.env.GCP_PROJECT == "poppeg-95e96") {
        return res.status(200).json({
            config: config.database_config
        })
    } else if (process.env.GCP_PROJECT == "poppeg-staging") {
        return res.status(200).json({
            config: config.staging_database_config
        })
    }
}