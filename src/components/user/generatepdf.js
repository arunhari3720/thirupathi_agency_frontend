// // src/utils/generateInvoicePdf.js
// //
// // Frontend invoice template. Install once:
// //   npm i jspdf jspdf-autotable
// //
// // Usage:
// //   const { generateInvoicePdf } = await import("../../utils/generateInvoicePdf");
// //   generateInvoicePdf({ payment, customer });

// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// const BRAND = [22, 101, 52]; // #166534
// const DARK = [34, 34, 34];
// const MUTED = [85, 85, 85];
// const LIGHT = [136, 136, 136];

// // jsPDF's built-in fonts can't draw the ₹ symbol, so "Rs." is used (same as the backend invoice)
// const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

// const formatDate = (date) =>
//   date
//     ? new Date(date).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "-";

// export function generateInvoicePdf({ payment, customer = {} }) {
//   const doc = new jsPDF({ unit: "pt", format: "a4" });
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const margin = 50;

//   const items = payment.items || [];
//   const grandTotal = payment.totalAmount ?? payment.amount ?? 0;

//   /* ---------- Company ---------- */
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(22);
//   doc.setTextColor(...BRAND);
//   doc.text("THIRUPATHI AGENCIES", margin, 60);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10);
//   doc.setTextColor(...MUTED);
//   doc.text("Invoice", margin, 78);

//   /* ---------- Invoice details ---------- */
//   doc.setFontSize(10);
//   doc.setTextColor(...DARK);

//   const details = [
//     ["Invoice Number", payment.orderId || payment.razorpayOrderId || "-"],
//     ["Order ID", payment.orderId || "-"],
//     ["Payment ID", payment.razorpayPaymentId || "-"],
//     ["Invoice Date", formatDate(payment.createdAt)],
//     ["Payment Status", "Paid"],
//   ];

//   let y = 110;
//   details.forEach(([label, value]) => {
//     doc.setFont("helvetica", "bold");
//     doc.text(`${label}:`, margin, y);
//     doc.setFont("helvetica", "normal");
//     doc.text(String(value), margin + 100, y);
//     y += 16;
//   });

//   /* ---------- Bill to ---------- */
//   y += 14;
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(13);
//   doc.text("Bill To", margin, y);

//   y += 18;
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10);
//   doc.text(customer.name || "Customer", margin, y);
//   if (customer.email) {
//     y += 14;
//     doc.text(customer.email, margin, y);
//   }

//   /* ---------- Items table ---------- */
//   autoTable(doc, {
//     startY: y + 26,
//     margin: { left: margin, right: margin },
//     head: [["Product", "Qty", "Price", "Subtotal"]],
//     body: items.map((item) => [
//       item.productName || "Product",
//       String(item.qty ?? 0),
//       formatPrice(item.price),
//       formatPrice(item.subtotal ?? (item.price || 0) * (item.qty || 0)),
//     ]),
//     theme: "plain",
//     styles: {
//       font: "helvetica",
//       fontSize: 9,
//       textColor: DARK,
//       cellPadding: { top: 9, bottom: 9, left: 8, right: 8 },
//       lineColor: [238, 238, 238],
//       lineWidth: { bottom: 0.75 },
//     },
//     headStyles: {
//       fillColor: BRAND,
//       textColor: [255, 255, 255],
//       fontStyle: "bold",
//       lineWidth: 0,
//     },
//     columnStyles: {
//       0: { cellWidth: "auto" },
//       1: { cellWidth: 50, halign: "center" },
//       2: { cellWidth: 95, halign: "right" },
//       3: { cellWidth: 105, halign: "right" },
//     },
//     didParseCell: (data) => {
//       // keep header alignment in line with the body columns
//       if (data.section === "head") {
//         data.cell.styles.halign =
//           data.column.index === 0
//             ? "left"
//             : data.column.index === 1
//             ? "center"
//             : "right";
//       }
//     },
//   });

//   /* ---------- Totals ---------- */
//   let endY = doc.lastAutoTable.finalY + 28;

//   // new page if the totals block would fall off the bottom
//   if (endY > doc.internal.pageSize.getHeight() - 140) {
//     doc.addPage();
//     endY = 60;
//   }

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(13);
//   doc.setTextColor(...BRAND);
//   doc.text(`Grand Total: ${formatPrice(grandTotal)}`, pageWidth - margin, endY, {
//     align: "right",
//   });

//   endY += 40;
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10);
//   doc.setTextColor(...MUTED);
//   doc.text("Payment Status: PAID", margin, endY);
//   doc.text(
//     `Payment Method: ${payment.paymentMethod || "Online"}`,
//     margin,
//     endY + 15
//   );

//   endY += 50;
//   doc.setFontSize(9);
//   doc.setTextColor(...LIGHT);
//   doc.text("Thank you for choosing Thirupathi Agencies!", margin, endY);

//   const fileName = `Invoice-${payment.orderId || payment.razorpayOrderId || "payment"}.pdf`;
//   doc.save(fileName);
// }
// src/utils/generateInvoicePdf.js
//
// Frontend invoice template. Install once:
//   npm i jspdf jspdf-autotable
//
// Usage:
//   const { generateInvoicePdf } = await import("../../utils/generateInvoicePdf");
//   await generateInvoicePdf({ payment, customer });

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const LOGO_URL =
  "https://res.cloudinary.com/gtqzljit/image/upload/v1790821022/pngwing.com.png";

const BRAND_NAME = "THIRUPATHI AGENCIES";

/* Yellow theme (same as the emails and the backend invoice) */
const YELLOW = [255, 228, 92]; // #FFE45C
const YELLOW_SOFT = [255, 249, 214]; // #FFF9D6
const YELLOW_BORDER = [245, 226, 122]; // #F5E27A
const GOLD = [185, 154, 0]; // #B99A00
const DARK = [23, 23, 23]; // #171717
const GREY = [107, 114, 128]; // #6b7280
const LINE = [229, 231, 235]; // #e5e7eb

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

/* Logo is downloaded once and reused */
let logoCache = null;

const loadLogo = async () => {
  if (logoCache) return logoCache;

  try {
    const response = await fetch(LOGO_URL);
    if (!response.ok) return null;

    const blob = await response.blob();

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const size = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = dataUrl;
    });

    logoCache = { dataUrl, ...size };
    return logoCache;
  } catch {
    return null;
  }
};

export async function generateInvoicePdf({ payment, customer = {} }) {
  const logo = await loadLogo();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const right = pageWidth - margin;

  const items = payment.items || [];
  const grandTotal = payment.totalAmount ?? payment.amount ?? 0;
  const invoiceNo = payment.orderId || payment.razorpayOrderId || "-";

  /* ---------- Header ---------- */
  doc.setFillColor(...YELLOW);
  doc.rect(0, 0, pageWidth, 115, "F");
  doc.setFillColor(...DARK);
  doc.rect(0, 115, pageWidth, 5, "F");

  let logoDrawn = false;

  if (logo) {
    try {
      const scale = Math.min(150 / logo.width, 62 / logo.height);
      const w = logo.width * scale;
      const h = logo.height * scale;

      doc.addImage(logo.dataUrl, "PNG", margin, 28 + (62 - h) / 2, w, h);
      logoDrawn = true;
    } catch {
      logoDrawn = false;
    }
  }

  if (!logoDrawn) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...DARK);
    doc.text(BRAND_NAME, margin, 64);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...DARK);
  doc.text("INVOICE", right, 62, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Payment receipt", right, 82, { align: "right" });

  /* ---------- Bill to (left) ---------- */
  const infoTop = 148;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("BILL TO", margin, infoTop + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text(customer.name || "Customer", margin, infoTop + 28);

  let leftY = infoTop + 28;

  if (customer.email) {
    leftY += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text(customer.email, margin, leftY);
  }

  /* ---------- Invoice details (right) ---------- */
  const details = [
    ["Invoice No.", invoiceNo],
    ["Order ID", payment.orderId || "-"],
    ["Payment ID", payment.razorpayPaymentId || "-"],
    ["Invoice Date", formatDate(payment.createdAt)],
    ["Status", "Paid"],
  ];

  let detailY = infoTop + 8;

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(label, 320, detailY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(label === "Status" ? GOLD : DARK));
    doc.text(String(value), right, detailY, { align: "right" });

    detailY += 17;
  });

  /* ---------- Items table ---------- */
  autoTable(doc, {
    startY: Math.max(leftY, detailY) + 24,
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
      lineColor: LINE,
      lineWidth: { bottom: 0.5 },
    },
    headStyles: {
      fillColor: YELLOW,
      textColor: DARK,
      fontStyle: "bold",
      lineWidth: 0,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 95, halign: "right" },
      3: { cellWidth: 105, halign: "right", fontStyle: "bold" },
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
  if (endY > pageHeight - 140) {
    doc.addPage();
    endY = 60;
  }

  // Payment info (left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("PAYMENT", margin, endY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text("Status: PAID", margin, endY + 26);
  doc.text(
    `Method: ${payment.paymentMethod || "Online"}`,
    margin,
    endY + 42
  );

  // Grand total (right)
  doc.setFillColor(...YELLOW_SOFT);
  doc.setDrawColor(...YELLOW_BORDER);
  doc.setLineWidth(1);
  doc.roundedRect(335, endY, 210, 52, 8, 8, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text("Grand Total", 351, endY + 19);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...DARK);
  doc.text(formatPrice(grandTotal), 529, endY + 40, { align: "right" });

  /* ---------- Footer ---------- */
  doc.setFillColor(...DARK);
  doc.rect(0, pageHeight - 46, pageWidth, 46, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...YELLOW);
  doc.text(
    "Thank you for choosing Thirupathi Agencies!",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  doc.save(`Invoice-${invoiceNo === "-" ? "payment" : invoiceNo}.pdf`);
}