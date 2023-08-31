const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/create", verifyToken, noteController.createNote);
router.get("/", verifyToken, noteController.getUserNotes);
router.get("/shared", verifyToken, noteController.getSharedNotes);
router.post("/update/:id", verifyToken, noteController.updateNote);
router.post("/share/:id", verifyToken, noteController.shareNote);
router.delete("/delete/:id", verifyToken, noteController.deleteNote);
router.get("/users", verifyToken, noteController.getUserList);
module.exports = router;
