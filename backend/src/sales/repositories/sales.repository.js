const prisma = require("../../lib/prisma");

// =============================
// GET ALL SALES ORDERS
// =============================
async function getAllSalesOrders(status) {
  const where = {};

  if (status) {
    where.status = status;
  }

  return prisma.salesOrder.findMany({
    where,
    include: {
      salesOrderLines: true,
    },
  });
}

// =============================
// GET SALES ORDER BY ID
// =============================
async function getSalesOrderById(id) {
  return prisma.salesOrder.findUnique({
    where: {
      salesOrderId: id,
    },
    include: {
      salesOrderLines: true,
    },
  });
}

// =============================
// GET CUSTOMER BY ID
// =============================
async function getCustomerById(customerId) {
  return prisma.customer.findUnique({
    where: {
      customerId,
    },
  });
}

// =============================
// CREATE SALES ORDER
// =============================
async function createSalesOrder(data) {
  return prisma.$transaction(async (tx) => {

    // Create Sales Order header
    const salesOrder = await tx.salesOrder.create({
      data: {
        salesOrderId: data.salesOrderId,
        customerId: data.customerId,
        orderDate: new Date(data.orderDate),
        status: data.status,
      },
    });

    // Create Sales Order Lines
    for (const line of data.lines) {
      await tx.salesOrderLine.create({
        data: {
          salesOrderId: salesOrder.salesOrderId,
          productId: line.productId,
          quantity: line.quantity,
        },
      });
    }

    // Return order with its lines
    return tx.salesOrder.findUnique({
      where: {
        salesOrderId: salesOrder.salesOrderId,
      },
      include: {
        salesOrderLines: true,
      },
    });
  });
}
// =============================
// UPDATE SALES ORDER
// =============================
async function updateSalesOrder(id, data) {
  return prisma.$transaction(async (tx) => {

    // Update Sales Order header
    await tx.salesOrder.update({
      where: {
        salesOrderId: id,
      },
      data: {
        customerId: data.customerId,
        orderDate: new Date(data.orderDate),
        status: data.status,
      },
    });

    // Remove existing lines
    await tx.salesOrderLine.deleteMany({
      where: {
        salesOrderId: id,
      },
    });

    // Create the new complete set of lines
    for (const line of data.lines) {
      await tx.salesOrderLine.create({
        data: {
          salesOrderId: id,
          productId: line.productId,
          quantity: line.quantity,
        },
      });
    }

    // Return updated order with lines
    return tx.salesOrder.findUnique({
      where: {
        salesOrderId: id,
      },
      include: {
        salesOrderLines: true,
      },
    });
  });
}

// =============================
// DELETE SALES ORDER
// =============================
async function deleteSalesOrder(id) {
  return prisma.$transaction(async (tx) => {

    // Delete all lines belonging to the sales order
    await tx.salesOrderLine.deleteMany({
      where: {
        salesOrderId: id,
      },
    });

    // Delete the sales order
    return tx.salesOrder.delete({
      where: {
        salesOrderId: id,
      },
    });
  });
}

// =============================
// GET ITEM BY ID
// =============================
async function getItemById(itemId) {
  return prisma.item.findUnique({
    where: {
      itemId: itemId,
    },
  });
}

module.exports = {
  getAllSalesOrders,
  getSalesOrderById,
  getCustomerById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getItemById,
};