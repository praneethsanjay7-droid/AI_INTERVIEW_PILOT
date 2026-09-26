const Interview = require("../models/Interview");

const showCreateInterview = (req, res) => {
    res.render("create-interview");
};

const createInterview = async (req, res) => {
    try {
        const {
            candidateName,
            candidateEmail,
            position
        } = req.body;

        const interview = new Interview({
            interviewer: req.user.userId,
            candidateName,
            candidateEmail,
            position
        });

        await interview.save();

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.send("Failed to create interview");
    }
};

module.exports = {
    showCreateInterview,
    createInterview
};