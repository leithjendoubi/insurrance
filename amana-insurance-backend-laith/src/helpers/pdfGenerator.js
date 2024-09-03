import puppeteer from 'puppeteer';
import {resolve} from 'path';

export class PdfGenerator {
    execute = async (input,data) => {
        try {
            const browser = await puppeteer.launch({  headless:"new"/* ,args: ["--no-sandbox"],executablePath: '/usr/bin/chromium-browser' */});
            const page = await browser.newPage();
            // Construct URL with query parameters
            const htmlFilePath = resolve(input);
            const queryParams = new URLSearchParams(data).toString();
            const url = `file://${htmlFilePath}?${queryParams}`;
            // Load the HTML content with query parameters
            await page.goto(url, { waitUntil: 'networkidle0' });
            //console.log(url)
            const pdfOptions = {
                //path: path.join(__dirname, output),
                format: 'A4',
                printBackground: true,
                width: '210mm',
                height: '297mm',
            };
            return page.pdf(pdfOptions);
            //await browser.close();
        } catch (e) {
            console.log('Error', e);
        }
    }

}
