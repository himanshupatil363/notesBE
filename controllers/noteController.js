const Note = require("../models/Note");
const User = require("../models/User");

// Controller to create a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const owner = req.user._id;

    const note = new Note({ title, content, owner });
    await note.save();

    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Controller to get user's own notes
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ owner: userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: noteId, owner: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }
    note.title = title;
    note.content = content;
    await note.save();
    res.json({ message: "Note updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await Note.deleteOne({ _id: noteId, owner: req.user._id });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Controller to share a note with another user
const shareNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userIdToShare } = req.body;

    const note = await Note.findOne({ _id: noteId, owner: req.user._id });
    const userToShare = await User.findById(userIdToShare);

    if (!note || !userToShare) {
      return res.status(404).json({ error: "Note or user not found" });
    }

    if (note.owner.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized to share this note" });
    }

    if (note.sharedWith.includes(userIdToShare)) {
      return res
        .status(400)
        .json({ error: "Note is already shared with this user" });
    }

    note.sharedWith.push(userIdToShare);
    await note.save();

    userToShare.sharedNotes.push(note);
    await userToShare.save();

    res.status(200).json({ message: "Note shared successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const getSharedNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ owner: userId });
    res.status(200).json(notes.sharedNotes);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
const getUserList = async (req, res) => {
  try {
    const users = await User.find({}, ["_id", "email"]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createNote,
  getUserNotes,
  shareNote,
  updateNote,
  deleteNote,
  getSharedNotes,
  getUserList,
};
