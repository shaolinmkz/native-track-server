const { Router } = require("express");
const mongoose = require("mongoose");

const router = Router();

// Get all tracks
router.get("/tracks", (req, res) => {
  const Track = mongoose.model("Track");
  Track.find({ userId: req.user._id }).then((tracks) => {
    res.status(200).json({ data: tracks });
  });
});

// get single track
router.get("/tracks/:trackId", (req, res) => {
  const Track = mongoose.model("Track");
  Track.findOne({ userId: req.user._id, _id: req.params.trackId }).then(
    (track) => {
      if(track) {
        res.status(200).json({ data: track });
      } else {
        res.status(404).json({ message: "Track not found" });
      }
    }
  ).catch(() => {
    res.status(500).json({ message: "Server error" });
  });
});

// get single track
router.delete("/tracks/:trackId", (req, res) => {
  const Track = mongoose.model("Track");
  Track.findOne({
    userId: req.user._id,
    _id: req.params.trackId,
  })
    .then((track) => {
      track
        .deleteOne()
        .then(() => {
          res.status(200).json({ message: "Deleted successfully" });
        })
        .catch(() => {
          res.status(404).json({ message: "An error occurred while deleting this track" });
        });
    })
    .catch(() => {
      res.status(404).json({ message: "Track not found" });
    });
});

// create a track
router.post("/tracks", (req, res) => {
  const Track = mongoose.model("Track");
  const { name, locations } = req.body;
  if (!name || !locations) {
    res.status(422).json({
      error: "You must provide a name and locations",
    });
  } else {
    const track = new Track({ name, locations, userId: req.user._id });
    track.save().then((track) => {
      res.status(201).json({ data: track });
    }).catch(() => {
      res.status(404).json({ message: "An error occurred while creating this track" });
    });;
  }
});

module.exports = router;
