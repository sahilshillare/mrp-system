const express = require("express");

const {
  getBomsByFinishedGoods,
  getBomById,
  createBom,
  updateBom,
  deleteBom,
} = require("../controllers/bom.controller");

const router = express.Router();

router.post("/boms/finished-goods", getBomsByFinishedGoods);

router.get("/boms/:id", getBomById);

router.post("/boms", createBom);

router.put("/boms/:id", updateBom);

router.delete("/boms/:id", deleteBom);

module.exports = router;