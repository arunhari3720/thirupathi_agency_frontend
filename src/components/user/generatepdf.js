// src/utils/generateInvoicePdf.js
//
// Frontend invoice template. Install once:
//   npm i jspdf jspdf-autotable
//
// Usage:
//   const { generateInvoicePdf } = await import("../../utils/generateInvoicePdf");
//   generateInvoicePdf({ payment, customer });

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BRAND = [22, 101, 52]; // #166534
const DARK = [34, 34, 34];
const MUTED = [85, 85, 85];
const LIGHT = [136, 136, 136];

// jsPDF's built-in fonts can't draw the ₹ symbol, so "Rs." is used (same as the backend invoice)
const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export function generateInvoicePdf({ payment, customer = {} }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;

  const items = payment.items || [];
  const grandTotal = payment.totalAmount ?? payment.amount ?? 0;

  /* ---------- Company ---------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...BRAND);
  doc.text("THIRUPATHI AGENCIES", margin, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Invoice", margin, 78);

  /* ---------- Invoice details ---------- */
  doc.setFontSize(10);
  doc.setTextColor(...DARK);

  const details = [
    ["Invoice Number", payment.orderId || payment.razorpayOrderId || "-"],
    ["Order ID", payment.orderId || "-"],
    ["Payment ID", payment.razorpayPaymentId || "-"],
    ["Invoice Date", formatDate(payment.createdAt)],
    ["Payment Status", "Paid"],
  ];

  let y = 110;
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), margin + 100, y);
    y += 16;
  });

  /* ---------- Bill to ---------- */
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Bill To", margin, y);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(customer.name || "Customer", margin, y);
  if (customer.email) {
    y += 14;
    doc.text(customer.email, margin, y);
  }

  /* ---------- Items table ---------- */
  autoTable(doc, {
    startY: y + 26,
    margin: { left: margin, right: margin },
    head: [["Product", "Qty", "Price", "Subtotal"]],
    body: items.map((item) => [
      item.productName || "Product",
      String(item.qty ?? 0),
      formatPrice(item.price),
      formatPrice(item.subtotal ?? (item.price || 0) * (item.qty || 0)),
    ]),
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: DARK,
      cellPadding: { top: 9, bottom: 9, left: 8, right: 8 },
      lineColor: [238, 238, 238],
      lineWidth: { bottom: 0.75 },
    },
    headStyles: {
      fillColor: BRAND,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineWidth: 0,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 95, halign: "right" },
      3: { cellWidth: 105, halign: "right" },
    },
    didParseCell: (data) => {
      // keep header alignment in line with the body columns
      if (data.section === "head") {
        data.cell.styles.halign =
          data.column.index === 0
            ? "left"
            : data.column.index === 1
            ? "center"
            : "right";
      }
    },
  });

  /* ---------- Totals ---------- */
  let endY = doc.lastAutoTable.finalY + 28;

  // new page if the totals block would fall off the bottom
  if (endY > doc.internal.pageSize.getHeight() - 140) {
    doc.addPage();
    endY = 60;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BRAND);
  doc.text(`Grand Total: ${formatPrice(grandTotal)}`, pageWidth - margin, endY, {
    align: "right",
  });

  endY += 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Payment Status: PAID", margin, endY);
  doc.text(
    `Payment Method: ${payment.paymentMethod || "Online"}`,
    margin,
    endY + 15
  );

  endY += 50;
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT);
  doc.text("Thank you for choosing Thirupathi Agencies!", margin, endY);

  const fileName = `Invoice-${payment.orderId || payment.razorpayOrderId || "payment"}.pdf`;
  doc.save(fileName);
}