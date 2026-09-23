const bomRepository = require("../repositories/bom.repository");

// =============================
// GET ALL BOMS
// =============================
async function getBomsByFinishedGoods(finishedGoodIds) {
  return bomRepository.getBomsByFinishedGoods(finishedGoodIds);
}

// =============================
// GET BOM BY ID
// =============================
async function getBomById(id) {
  return bomRepository.getBomById(id);
}

// =============================
// CREATE BOM
// =============================
async function createBom(data) {

  // Check duplicate BOM ID
  const existingBom = await bomRepository.getBomById(data.bomId);

  if (existingBom) {
    const error = new Error("BOM already exists");
    error.status = 409;
    throw error;
  }

  // Check finished good exists
  const finishedGood = await bomRepository.getItemById(
    data.finishedGoodId
  );

  if (!finishedGood) {
    const error = new Error("Finished good not found");
    error.status = 404;
    throw error;
  }

  // Track materials to prevent duplicate material lines
  const materialIds = new Set();

  // Check every material referenced by a line exists
  for (const line of data.lines) {

    // Check duplicate material
    if (materialIds.has(line.materialId)) {
      const error = new Error(
        `Duplicate material in BOM: item ID ${line.materialId}`
      );
      error.status = 400;
      throw error;
    }

    materialIds.add(line.materialId);

    // Check material exists
    const material = await bomRepository.getItemById(
      line.materialId
    );

    if (!material) {
      const error = new Error(
        `Material not found: item ID ${line.materialId}`
      );
      error.status = 404;
      throw error;
    }
  }

  
  return bomRepository.createBom(data);
}


// =============================
// UPDATE BOM
// =============================
async function updateBom(id, data) {
  const existingBom = await bomRepository.getBomById(id);

  if (!existingBom) {
    const error = new Error("BOM not found.");
    error.status = 404;
    throw error;
  }

  const finishedGood = await bomRepository.getItemById(
    data.finishedGoodId
  );

  if (!finishedGood) {
    const error = new Error(
      `Finished good not found: item ID ${data.finishedGoodId}`
    );
    error.status = 404;
    throw error;
  }

  const materialIds = new Set();

  for (const line of data.lines) {
    if (materialIds.has(line.materialId)) {
      const error = new Error(
        `Duplicate material in BOM: item ID ${line.materialId}`
      );
      error.status = 400;
      throw error;
    }

    materialIds.add(line.materialId);

    const material = await bomRepository.getItemById(
      line.materialId
    );

    if (!material) {
      const error = new Error(
        `Material not found: item ID ${line.materialId}`
      );
      error.status = 404;
      throw error;
    }
  }

  return bomRepository.updateBom(id, data);
}
// =============================
// DELETE BOM
// =============================
async function deleteBom(id) {
  const existingBom = await bomRepository.getBomById(id);

  if (!existingBom) {
    const error = new Error("BOM not found.");
    error.status = 404;
    throw error;
  }

  return bomRepository.deleteBom(id);
}

module.exports = {
  getBomsByFinishedGoods,
  getBomById,
  createBom,
  updateBom,
  deleteBom,
};