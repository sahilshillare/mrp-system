// src/sales/sales.validation.js

const VALID_STATUS = [
  "Open",
  "Completed",
  "Planned",
];

// =============================
// Validate Sales Order ID
// Used by GET BY ID, PUT, DELETE
// =============================

function validateSalesOrderId(id) {
  if (!id) {
    return "Sales Order ID is required.";
  }

  if (typeof id !== "string") {
    return "Sales Order ID must be a string.";
  }

  if (id.trim() === "") {
    return "Sales Order ID cannot be empty.";
  }

  return null;
}

// =============================
// Validate POST Request
// =============================
function validateCreateSalesOrder(body) {
  if (!body) {
    return "Request body is required.";
  }

  const {
    salesOrderId,
    customerId,
    orderDate,
    status,
    lines,
  } = body;

  // Sales Order ID
  if (!salesOrderId) {
    return "Sales Order ID is required.";
  }

  if (typeof salesOrderId !== "string") {
    return "Sales Order ID must be a string.";
  }

  if (salesOrderId.trim() === "") {
    return "Sales Order ID cannot be empty.";
  }

  // Customer ID
  if (!customerId) {
    return "Customer ID is required.";
  }

  if (typeof customerId !== "string") {
    return "Customer ID must be a string.";
  }

  if (customerId.trim() === "") {
    return "Customer ID cannot be empty.";
  }

  // Order Date
  if (!orderDate) {
    return "Order Date is required.";
  }

  if (isNaN(new Date(orderDate).getTime())) {
    return "Order Date is invalid.";
  }

  // Status
  if (!status) {
    return "Status is required.";
  }

  if (typeof status !== "string") {
    return "Status must be a string.";
  }

  if (!VALID_STATUS.includes(status)) {
    return `Status must be one of: ${VALID_STATUS.join(", ")}.`;
  }

  // Sales Order Lines
  if (!lines) {
    return "Sales Order Lines are required.";
  }

  if (!Array.isArray(lines)) {
    return "Sales Order Lines must be an array.";
  }

  if (lines.length === 0) {
    return "At least one Sales Order Line is required.";
  }

  // Validate each line
  for (const line of lines) {
    if (!line || typeof line !== "object") {
      return "Each Sales Order Line must be an object.";
    }

    // Product ID
    if (line.productId === undefined || line.productId === null) {
      return "Product ID is required.";
    }

    if (!Number.isInteger(line.productId)) {
      return "Product ID must be an integer.";
    }

    // Quantity
    if (line.quantity === undefined || line.quantity === null) {
      return "Quantity is required.";
    }

    if (!Number.isInteger(line.quantity)) {
      return "Quantity must be an integer.";
    }

    if (line.quantity <= 0) {
      return "Quantity must be greater than 0.";
    }
  }

  return null;
}

// =============================
// Validate PUT Request
// Only validate fields that exist
// =============================
function validateUpdateSalesOrder(body) {
  if (!body) {
    return "Request body is required.";
  }

  // Customer ID
  if (!body.customerId) {
    return "Customer ID is required.";
  }

  if (typeof body.customerId !== "string") {
    return "Customer ID must be a string.";
  }

  if (body.customerId.trim() === "") {
    return "Customer ID cannot be empty.";
  }

  // Order Date
  if (!body.orderDate) {
    return "Order Date is required.";
  }

  if (typeof body.orderDate !== "string") {
    return "Order Date must be a string.";
  }

  if (isNaN(new Date(body.orderDate).getTime())) {
    return "Order Date is invalid.";
  }

  // Status
  if (!body.status) {
    return "Status is required.";
  }

  if (typeof body.status !== "string") {
    return "Status must be a string.";
  }

  if (!VALID_STATUS.includes(body.status)) {
    return `Status must be one of: ${VALID_STATUS.join(", ")}.`;
  }

  // Sales Order Lines
  if (!body.lines) {
    return "Sales Order Lines are required.";
  }

  if (!Array.isArray(body.lines)) {
    return "Sales Order Lines must be an array.";
  }

  if (body.lines.length === 0) {
    return "At least one Sales Order Line is required.";
  }

  // Validate each line
  for (const line of body.lines) {
    if (!line || typeof line !== "object") {
      return "Each Sales Order Line must be an object.";
    }

    if (line.productId === undefined || line.productId === null) {
      return "Product ID is required.";
    }

    if (!Number.isInteger(line.productId)) {
      return "Product ID must be an integer.";
    }

    if (line.quantity === undefined || line.quantity === null) {
      return "Quantity is required.";
    }

    if (!Number.isInteger(line.quantity)) {
      return "Quantity must be an integer.";
    }

    if (line.quantity <= 0) {
      return "Quantity must be greater than 0.";
    }
  }

  return null;
};


module.exports = {
  validateSalesOrderId,
  validateCreateSalesOrder,
  validateUpdateSalesOrder,
};