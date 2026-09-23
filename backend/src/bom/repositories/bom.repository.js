const prisma = require("../../lib/prisma");

const bomInclude = {
  finishedGood: true,
  bomLines: {
    include: {
      material: true,
    },
  },
};

const mrpBomInclude = {
  bomLines: {
    select: {
      materialId: true,
      quantityRequired: true,
    },
  },
};

// =============================
// GET ALL BOMS BY FINISHED GOODS
// =============================
async function getBomsByFinishedGoods(finishedGoodIds) {
  return prisma.bOMHeader.findMany({
    where: {
      finishedGoodId: {
        in: finishedGoodIds,
      },
    },
    include: mrpBomInclude,
  });
}

// =============================
// GET BOM BY ID
// =============================
async function getBomById(id) {
  return prisma.bOMHeader.findUnique({
    where: {
      bomId: id,
    },
    select: {
      bomId: true,
      finishedGoodId: true,

      finishedGood: {
        select: {
          itemId: true,
          itemCode: true,
          itemName: true,
          uom: true,
        },
      },

      bomLines: {
        select: {
          bomLineId: true,
          materialId: true,
          quantityRequired: true,

          material: {
            select: {
              itemId: true,
              itemCode: true,
              itemName: true,
              uom: true,
            },
          },
        },
      },
    },
  });
}

// =============================
// GET ITEM BY ID
// Used to verify finished goods / materials exist
// =============================
async function getItemById(itemId) {
  return prisma.item.findUnique({
    where: {
      itemId,
    },
  });
}

// =============================
// Get next BOM Line ID
// bomLineId has no DB default, so V1 assigns it
// as max(bomLineId) + 1 inside the calling transaction.
// =============================
async function getNextBomLineId(tx) {
  const lastLine = await tx.bOMLine.findFirst({
    orderBy: {
      bomLineId: "desc",
    },
    select: {
      bomLineId: true,
    },
  });

  return lastLine ? lastLine.bomLineId + 1 : 1;
}

// =============================
// CREATE BOM
// Creates the header and all lines in one transaction
// so a failure on any line rolls back the whole BOM.
// =============================
async function createBom(data) {
  return prisma.$transaction(async (tx) => {

    const bom = await tx.bOMHeader.create({
      data: {
        bomId: data.bomId,
        finishedGoodId: data.finishedGoodId,
      },
    });

    for (const line of data.lines) {
      await tx.bOMLine.create({
        data: {
          bomId: bom.bomId,
          materialId: line.materialId,
          quantityRequired: line.quantityRequired,
        },
      });
    }

    return tx.bOMHeader.findUnique({
      where: {
        bomId: bom.bomId,
      },
      include: bomInclude,
    });
  });
}

// =============================
// UPDATE BOM
// V1 approach: header fields update in place.
// If lines are provided, existing lines are replaced
// wholesale (delete + recreate) inside a transaction.
// =============================
async function updateBom(id, data) {
  return prisma.$transaction(async (tx) => {

    await tx.bOMHeader.update({
      where: {
        bomId: id,
      },
      data: {
        finishedGoodId: data.finishedGoodId,
      },
    });

    await tx.bOMLine.deleteMany({
      where: {
        bomId: id,
      },
    });

    for (const line of data.lines) {
      await tx.bOMLine.create({
        data: {
          bomId: id,
          materialId: line.materialId,
          quantityRequired: line.quantityRequired,
        },
      });
    }

    return tx.bOMHeader.findUnique({
      where: {
        bomId: id,
      },
      include: bomInclude,
    });
  });
}

// =============================
// DELETE BOM
// Lines must be removed first — the schema has no
// cascade delete, so the FK would otherwise block it.
// =============================
async function deleteBom(id) {
  return prisma.$transaction(async (tx) => {

    await tx.bOMLine.deleteMany({
      where: {
        bomId: id,
      },
    });

    return tx.bOMHeader.delete({
      where: {
        bomId: id,
      },
    });
  });
}

module.exports = {
  getBomsByFinishedGoods,
  getBomById,
  getItemById,
  createBom,
  updateBom,
  deleteBom,
};