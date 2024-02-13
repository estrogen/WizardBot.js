const mongoose = require("mongoose");

const wf_runs = {
    host: { type: String, required: true, index: true },
    partcipant: { type: [String], required: true, index: true},
    runType: { type: String, required: true},
    mission: { type: String, required: false},
    rewards: { type: [String], required: false},
    screenshot: {type: String, required: false}


};

module.exports = mongoose.model("WFRuns", wf_runs);