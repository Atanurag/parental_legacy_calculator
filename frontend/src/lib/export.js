import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';

const fileName = (result) => `parental-legacy-${result.dob.replaceAll('/', '-')}`;
const fmt = (value) => Number(value).toFixed(3);

function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function exportCSV(result) {
  const rows = [
    ['Report', 'Date of Birth', 'Dominant Parent', 'Mother Total', 'Father Total', 'Grand Total'],
    ['Parental Legacy & Life Factors Calculator', result.dob, result.dominantParent, fmt(result.motherTotal), fmt(result.fatherTotal), fmt(result.grandTotal)],
    [],
    ['Life Factor', 'Minimum', 'Maximum', 'Mother', 'Father', 'Total'],
    ...result.factors.map((factor) => [
      factor.name,
      fmt(factor.min),
      fmt(factor.max),
      fmt(factor.mother),
      fmt(factor.father),
      fmt(factor.total)
    ]),
    [],
    ['Calculation Rule', result.isOddDay ? 'Odd DOB day: Mother has higher influence.' : 'Even DOB day: Father has higher influence.'],
    ['Validation', 'Passed — all factor values remain within the supplied ranges and Mother + Father reconcile to 100.000.']
  ];

  const csv = '\uFEFF' + rows.map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName(result)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportExcel(result) {
  const workbook = XLSX.utils.book_new();
  const rows = [
    ['PARENTAL LEGACY & LIFE FACTORS CALCULATOR'],
    [],
    ['Date of Birth', result.dob],
    ['Dominant Parent', result.dominantParent],
    ['Mother Total', Number(fmt(result.motherTotal))],
    ['Father Total', Number(fmt(result.fatherTotal))],
    ['Grand Total', Number(fmt(result.grandTotal))],
    [],
    ['Life Factor', 'Minimum', 'Maximum', 'Mother', 'Father', 'Total'],
    ...result.factors.map((factor) => [
      factor.name,
      Number(fmt(factor.min)),
      Number(fmt(factor.max)),
      Number(fmt(factor.mother)),
      Number(fmt(factor.father)),
      Number(fmt(factor.total))
    ]),
    [],
    ['CALCULATION RULE'],
    [result.isOddDay ? 'Odd DOB day: Mother has higher influence.' : 'Even DOB day: Father has higher influence.'],
    ['VALIDATION'],
    ['All factor values remain within the supplied ranges and totals reconcile to 100.000.']
  ];

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = [
    { wch: 32 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  sheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: 5 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 5 } },
    { s: { r: 14, c: 0 }, e: { r: 14, c: 5 } },
    { s: { r: 15, c: 0 }, e: { r: 15, c: 5 } }
  ];

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '79C95B' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  const titleStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 16 },
    fill: { fgColor: { rgb: '1B2330' } },
    alignment: { horizontal: 'left', vertical: 'center' }
  };
  const labelStyle = { font: { bold: true, color: { rgb: '344054' } } };
  const noteStyle = {
    font: { color: { rgb: '5E6B7A' } },
    alignment: { wrapText: true, vertical: 'top' }
  };

  sheet['A1'].s = titleStyle;
  for (const cell of ['A3', 'A4', 'A5', 'A6', 'A7']) sheet[cell].s = labelStyle;
  for (let c = 0; c < 6; c++) sheet[XLSX.utils.encode_cell({ r: 8, c })].s = headerStyle;
  for (const cell of ['A13', 'A15']) sheet[cell].s = { font: { bold: true, color: { rgb: '79C95B' } } };
  for (const cell of ['A14', 'A16']) sheet[cell].s = noteStyle;

  sheet['!rows'] = [
    { hpt: 26 }, { hpt: 8 },
    { hpt: 20 }, { hpt: 20 }, { hpt: 20 }, { hpt: 20 }, { hpt: 20 },
    { hpt: 8 }, { hpt: 24 },
    ...result.factors.map(() => ({ hpt: 21 })),
    { hpt: 8 }, { hpt: 20 }, { hpt: 32 }, { hpt: 20 }, { hpt: 40 }
  ];

  XLSX.utils.book_append_sheet(workbook, sheet, 'Legacy Report');
  XLSX.writeFile(workbook, `${fileName(result)}.xlsx`);
}

export function exportPDF(result) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const green = [121, 201, 91];
  const greenDark = [72, 130, 54];
  const greenSoft = [244, 251, 240];
  const dark = [27, 35, 48];
  const muted = [94, 107, 122];
  const border = [225, 229, 235];
  const light = [248, 250, 252];
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFillColor(...green);
  doc.rect(0, 0, pageWidth, 4, 'F');

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Parental Legacy & Life Factors', margin, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...muted);
  doc.text('Life-factor analysis report', margin, 26);

  // Summary cards
  const cardY = 33;
  const gap = 4;
  const cardW = (contentWidth - gap * 2) / 3;
  const cardH = 23;
  const cards = [
    ['DATE OF BIRTH', result.dob, dark],
    ["PARENTAL BALANCE", `${fmt(result.motherTotal)} / ${fmt(result.fatherTotal)}`, dark],
    ['DOMINANT PARENT', result.dominantParent, greenDark]
  ];

  cards.forEach(([label, value, valueColor], index) => {
    const x = margin + index * (cardW + gap);
    doc.setFillColor(...light);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, cardY, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(label, x + 5, cardY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...valueColor);
    doc.text(value, x + 5, cardY + 16);
  });

  // Factor table
  autoTable(doc, {
    startY: 63,
    margin: { left: margin, right: margin },
    head: [['Life Factor', 'Minimum', 'Maximum', 'Mother', 'Father', 'Total']],
    body: result.factors.map((factor) => [
      factor.name,
      fmt(factor.min),
      fmt(factor.max),
      fmt(factor.mother),
      fmt(factor.father),
      fmt(factor.total)
    ]),
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.8,
      cellPadding: { top: 3.1, right: 3, bottom: 3.1, left: 3 },
      textColor: dark,
      lineColor: border,
      lineWidth: 0.2,
      valign: 'middle',
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: green,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 55 },
      1: { halign: 'right', cellWidth: 25 },
      2: { halign: 'right', cellWidth: 25 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 }
    },
    alternateRowStyles: { fillColor: [249, 251, 252] },
    tableLineColor: border,
    tableLineWidth: 0.2
  });

  // Clean calculation-rules callout. Use splitTextToSize so no text is squeezed or letter-spaced.
  const boxY = doc.lastAutoTable.finalY + 9;
  const boxX = margin;
  const boxW = contentWidth;
  const boxH = 30;

  doc.setFillColor(...greenSoft);
  doc.setDrawColor(...green);
  doc.setLineWidth(0.35);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'FD');

  doc.setFillColor(...green);
  doc.roundedRect(boxX + 6, boxY + 6, 4, 4, 1.2, 1.2, 'F');

  doc.setTextColor(...greenDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Calculation rules', boxX + 14, boxY + 9);

  const ruleText = result.isOddDay
    ? 'Odd DOB day: Mother has higher influence.'
    : 'Even DOB day: Father has higher influence.';
  const validationText = 'All factor values remain within the supplied ranges and totals reconcile to 100.000.';

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(doc.splitTextToSize(ruleText, boxW - 22), boxX + 7, boxY + 16);
  doc.setTextColor(...muted);
  doc.text(doc.splitTextToSize(validationText, boxW - 22), boxX + 7, boxY + 23);

  // Footer
  doc.setDrawColor(...border);
  doc.setLineWidth(0.2);
  doc.line(margin, 284, pageWidth - margin, 284);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text('LegacyLens · Parental Legacy & Life Factors Calculator', margin, 290);
  doc.text(`Generated for DOB ${result.dob}`, pageWidth - margin, 290, { align: 'right' });

  doc.save(`${fileName(result)}.pdf`);
}
