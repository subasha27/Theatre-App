"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_lib_1 = require("pdf-lib");
const fs_1 = require("fs");
const path = __importStar(require("path"));
function generateAndSaveInvoice(bookingData, eachTicketPrice, price, timings) {
    return __awaiter(this, void 0, void 0, function* () {
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([400, 400]);
        const { width, height } = page.getSize();
        const fontSize = 15;
        // Add an overall border
        page.drawRectangle({
            x: 10,
            y: 10,
            width: width - 20,
            height: height - 20,
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
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
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold),
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
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica),
            });
            page.drawText(ticketPrice.toString(), {
                x: columns[1].x + 25,
                y,
                size: fontSize,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica),
            });
            page.drawText(quantity.toString(), {
                x: columns[2].x + 30,
                y,
                size: fontSize,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica),
            });
            y -= fontSize + 5;
        }
        // Draw the total price provided as "price"
        y -= fontSize + 20;
        page.drawText(`Total Price: ${price}rs`, {
            x: columns[0].x,
            y,
            size: fontSize,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
            font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold),
        });
        y -= fontSize + 40;
        const newTimings = Number(timings.getTime()) - 19800000;
        const formattedTimings = `${new Date(newTimings).toLocaleDateString()} ${new Date(newTimings).toLocaleTimeString()}`;
        page.drawText(`Timings:${formattedTimings}`, {
            x: columns[0].x = 25,
            y,
            size: fontSize,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
            font: yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold),
        });
        const pdfBytes = yield pdfDoc.save();
        // Save the PDF file in the specified location
        const invoicePath = path.join(__dirname, '..', 'invoice', 'invoice.pdf');
        yield fs_1.promises.writeFile(invoicePath, pdfBytes);
        return invoicePath;
    });
}
exports.default = generateAndSaveInvoice;
