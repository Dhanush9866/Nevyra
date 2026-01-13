const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        heroBanners: [
            {
                url: { type: String, required: true },
                title: { type: String },
                subtitle: { type: String },
                buttonText: { type: String },
                link: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Settings", settingsSchema);
