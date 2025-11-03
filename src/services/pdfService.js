// Enhanced SmartCrop PDF Generator
// Modern minimal design with green-white theme and logo
import { jsPDF } from "jspdf";

export function generateCropReport({
  crop,
  soilType,
  temperature,
  pH,
  season,
  analysis,
  suitableCrops
}) {
  const doc = new jsPDF({ unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;
  // Safe download helper: try native save, fall back to Blob link
  const triggerDownload = (pdf, filename) => {
    try {
      pdf.save(filename);
    } catch (e) {
      try {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1200);
      } catch (err) {
        console.error("PDF download failed", err);
      }
    }
  };

  // (Logo removed per request)

  // ---------- Helper Functions ----------
  const ensureSpace = (needed = 100) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addHeader();
      y += 8;
    }
  };

  const wrapAndWriteParagraph = (text, x, startY, maxWidth, fontSize = 11) => {
    doc.setFontSize(fontSize);
    const wrapped = doc.splitTextToSize(text || "-", maxWidth);
    doc.text(wrapped, x, startY);
    return startY + wrapped.length * (fontSize + 2);
  };

  // ---------- Header ----------
  const addHeader = () => {
    // Gradient-like header bar
    doc.setFillColor(26, 152, 75); // Deep green
    doc.rect(0, 0, pageWidth, 70, "F");
  // No logo per request

    // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
    doc.setFontSize(20);
  doc.text("SmartCrop Predictor", margin, 32);
  doc.setFont("times", "normal");
    doc.setFontSize(11);
  doc.text("Crop Suitability Report", margin, 50);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    y = 90;
  };

  // ---------- Meta Info Box ----------
  const addMetaBox = () => {
    const boxHeight = 90;
    doc.setFillColor(240, 250, 244);
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxHeight, 10, 10, "F");
    doc.setDrawColor(210);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxHeight, 10, 10, "S");

    const leftX = margin + 16;
    const rightX = pageWidth / 2 + 10;
    const lineGap = 18;

  doc.setFont("times", "bold");
    doc.setFontSize(11);

    const info = [
      ["Crop:", crop || "-"],
      ["Soil Type:", soilType || "-"],
      ["Season:", season || "-"],
      ["Temperature:", `${temperature || "-"} °C`],
      ["pH:", pH || "-"],
      ["Generated:", new Date().toLocaleString()]
    ];

    let lx = leftX,
      rx = rightX;
    for (let i = 0; i < info.length; i++) {
      const [label, value] = info[i];
      const xpos = i < 3 ? lx : rx;
      const ypos = y + 22 + (i % 3) * lineGap;
  doc.text(label, xpos, ypos);
  doc.setFont("times", "normal");
      doc.text(value, xpos + doc.getTextWidth(label) + 6, ypos);
  doc.setFont("times", "bold");
    }

    y += boxHeight + 20;
  };

  // ---------- Analysis Summary ----------
  const addAnalysis = () => {
    ensureSpace(140);
    doc.setFillColor(230, 250, 240);
    doc.roundedRect(margin, y - 8, 180, 24, 6, 6, "F");
  doc.setFont("times", "bold");
    doc.setTextColor(26, 152, 75);
    doc.setFontSize(13);
    doc.text("Analysis Summary", margin + 10, y + 8);
    doc.setTextColor(0, 0, 0);
    y += 28;

    const analysisText = analysis?.message || "No analysis available.";
    y = wrapAndWriteParagraph(analysisText, margin, y, pageWidth - margin * 2, 11);
    y += 10;

    if (analysis?.penalties?.length) {
      ensureSpace(80);
      doc.setFillColor(255, 240, 240);
      doc.roundedRect(margin, y - 6, 160, 22, 6, 6, "F");
  doc.setFont("times", "bold");
      doc.setTextColor(200, 40, 40);
      doc.text("Issues Identified", margin + 10, y + 8);
      doc.setTextColor(0, 0, 0);
      y += 26;

  doc.setFont("times", "normal");
      analysis.penalties.forEach(p => {
        y = wrapAndWriteParagraph(`• ${p}`, margin + 10, y, pageWidth - margin * 2 - 10, 11);
        y += 4;
      });
    }
  };

  // ---------- Recommended Crops ----------
  const addCropTable = () => {
    if (!Array.isArray(suitableCrops) || !suitableCrops.length) return;

    ensureSpace(150);
    doc.setFillColor(240, 250, 244);
    doc.roundedRect(margin, y - 8, 220, 24, 6, 6, "F");
  doc.setFont("times", "bold");
    doc.setTextColor(26, 152, 75);
    doc.text("Recommended Crops", margin + 10, y + 8);
    doc.setTextColor(0, 0, 0);
    y += 30;

    const col1 = margin;
    const col2 = margin + 200;
    const col3 = margin + 300;
    const col4 = margin + 400;
    const rowH = 20;

    // Table header
    doc.setFillColor(26, 152, 75);
    doc.roundedRect(margin, y - 12, pageWidth - margin * 2, rowH, 6, 6, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Crop", col1 + 10, y);
    doc.text("Score", col2 + 10, y);
    doc.text("Water", col3 + 10, y);
    doc.text("Season", col4 + 10, y);

    y += rowH + 6;
  doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);

    suitableCrops.slice(0, 12).forEach((c, i) => {
      ensureSpace(40);
      if (i % 2 === 0) {
        doc.setFillColor(247, 252, 249);
        doc.rect(margin, y - 12, pageWidth - margin * 2, rowH, "F");
      }

      doc.text(String(c.cropName || c.name || "-"), col1 + 10, y);
      doc.text(String(c.score ?? "-"), col2 + 10, y);
      doc.text(String(c.waterRequirement || "-"), col3 + 10, y);
      const s = Array.isArray(c.season) ? c.season.join(", ") : c.season || "-";
      doc.text(s, col4 + 10, y);
      y += rowH;
    });

    if (suitableCrops.length > 12) {
      doc.setFont("times", "italic");
      doc.text(`+ ${suitableCrops.length - 12} more...`, margin, y + 6);
      y += 20;
    }
  };

  // ---------- Footer ----------
  const addFooter = () => {
    const bottomY = pageHeight - 30;
    doc.setDrawColor(26, 152, 75);
    doc.setLineWidth(0.8);
    doc.line(margin, bottomY - 12, pageWidth - margin, bottomY - 12);

    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.text(
      `Generated by SmartCrop Predictor — ${new Date().toLocaleString()}`,
      margin,
      bottomY
    );
    doc.text(`https://smartcrop-predictor.com`, pageWidth - margin - 160, bottomY);

    const total = doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${total}`, pageWidth / 2 - 25, pageHeight - 12);
    }
  };

  // ---------- Assemble PDF ----------
  addHeader();
  addMetaBox();
  addAnalysis();
  addCropTable();
  addFooter();

  // ---------- Save ----------
  const filenameSafeCrop = (crop || "crop").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  const fileName = `${filenameSafeCrop}_report_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.pdf`;
  triggerDownload(doc, fileName);
}
