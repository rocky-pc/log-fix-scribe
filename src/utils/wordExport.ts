import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, ImageRun, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { ErrorEntry } from "@/types/error";
type Toast = { title: string; description?: string; variant?: string };

export const exportToWord = async (errors: ErrorEntry[], toast: ({ title, description, variant }: Toast) => void) => {
  try {
    let sections = [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }, // 1 inch margins
        },
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Error Log System Export",
                bold: true,
                size: 32, // 16pt
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }, // 12pt spacing after
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleString()}`,
                italics: true,
                size: 20, // 10pt
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 }, // 24pt spacing after
          }),
        ],
      },
    ];

    // Add error entries
    for (const error of errors) {
      // Create a table for error details
      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Title", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: error.title, font: "Calibri", size: 20 })] })],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: error.description, font: "Calibri", size: 20 })] })],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Severity", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: error.severity, font: "Calibri", size: 20 })] })],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: error.status, font: "Calibri", size: 20 })] })],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          ...(error.category
            ? [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true, font: "Calibri", size: 20 })] })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: error.category, font: "Calibri", size: 20 })] })],
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    }),
                  ],
                }),
              ]
            : []),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Tags", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: error.tags.join(", ") || "None", font: "Calibri", size: 20 })],
                  }),
                ],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          ...(error.solution
            ? [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Solution", bold: true, font: "Calibri", size: 20 })] })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: error.solution, font: "Calibri", size: 20 })] })],
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    }),
                  ],
                }),
              ]
            : []),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Created At", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: new Date(error.created_at).toLocaleString(), font: "Calibri", size: 20 })],
                  }),
                ],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Updated At", bold: true, font: "Calibri", size: 20 })] })],
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: new Date(error.updated_at).toLocaleString(), font: "Calibri", size: 20 })],
                  }),
                ],
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          }),
        ],
      });

      // Add images if available
      if (error.files.length > 0) {
        const imageParagraphs: Paragraph[] = [];
        for (const file of error.files) {
          if (file.mimetype.startsWith("image/")) {
            try {
              const response = await fetch(`http://localhost:8000/api/files/${file.id}`);
              if (!response.ok) throw new Error(`Failed to fetch image ${file.filename}`);
              const data = await response.json();
              const base64Data = data.content; // Base64-encoded content
              const buffer = Buffer.from(base64Data, "base64");

              imageParagraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Attachment: ${file.filename} (${(file.size / 1024).toFixed(1)} KB)`,
                      bold: true,
                      font: "Calibri",
                      size: 20,
                    }),
                  ],
                  spacing: { before: 240, after: 120 },
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: buffer,
                      type: "png",
                      altText: {
                        name: file.filename,
                        // type: "png",
                      },
                      transformation: {
                        width: 600, // ~6 inches (assuming 100px per inch)
                        height: 400, // Adjust height to maintain aspect ratio (approximate)
                      },
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 240 },
                })
              );
            } catch (error: any) {
              toast({
                title: "Error",
                description: `Failed to include image ${file.filename}: ${error.message}`,
                variant: "destructive",
              });
            }
          }
        }
        if (imageParagraphs.length > 0) {
          sections.push({
            properties: {
              page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Images", bold: true, font: "Calibri", size: 24 })],
                spacing: { before: 480, after: 240 },
              }),
              ...imageParagraphs,
            ],
          });
        }
      }

      // Add the table to a new section
      sections.push({
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
        },
        children: [new Paragraph({ children: [table] }), new Paragraph({ spacing: { after: 480 } })],
      });
    }

    // Generate and save the document
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Error_Log_Export_${new Date().toISOString().split('T')[0]}.docx`);

    toast({
      title: "Success",
      description: "Error log exported to Word document successfully.",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: `Failed to export to Word: ${error.message}`,
      variant: "destructive",
    });
  }
};