import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import * as path from 'path';

async function generateAndSaveInvoice(bookingData: any, eachTicketPrice: { [ticketType: string]: number }, price: number, timings: Date): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    const { width, height } = page.getSize();
    const fontSize = 15;

    // Add an overall border
    page.drawRectangle({
        x: 10,
        y: 10,
        width: width - 20,
        height: height - 20,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    // Add columns
    const columns = [
        {
            x: 50,
            width: 100,
            name: 'Ticket Type',
        },
        {
            x: 150,
            width: 100,
            name: 'Ticket Price',
        },
        {
            x: 250,
            width: 100,
            name: 'Quantity',
        },
    ];

    // Draw the column headers
    for (const column of columns) {
        page.drawText(column.name, {
            x: column.x + 10,
            y: height - 50,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        });
    }

    // Draw the ticket details
    let y = height - 70;

    for (const ticketData of bookingData.tickets) {
        const ticketType = Object.keys(ticketData)[0];
        const quantity = ticketData[ticketType];
        const ticketPrice = eachTicketPrice[ticketType];
        page.drawText(ticketType, {
            x: columns[0].x + 10,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });

        page.drawText(ticketPrice.toString(), {
            x: columns[1].x + 25,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });

        page.drawText(quantity.toString(), {
            x: columns[2].x + 30,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });

        y -= fontSize + 5;
    }

    // Draw the total price provided as "price"
    y -= fontSize + 20;
    page.drawText(`Total Price: ${price}rs`, {
        x: columns[0].x,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    });


    y -= fontSize + 40;
    const newTimings = Number(timings.getTime()) - 19800000 
    const formattedTimings = `${new Date(newTimings).toLocaleDateString()} ${new Date(newTimings).toLocaleTimeString()}`;
    page.drawText(`Timings:${formattedTimings}`, {
        x: columns[0].x = 25,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    });

    const pdfBytes = await pdfDoc.save();

    // Save the PDF file in the specified location
    const invoicePath = path.join(__dirname, '..', 'invoice', 'invoice.pdf');
    await fs.writeFile(invoicePath, pdfBytes);

    return invoicePath;
}

export default generateAndSaveInvoice;
