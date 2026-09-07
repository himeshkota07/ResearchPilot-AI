from pypdf import PdfReader


class PDFReaderService:

    def extract_text(self, pdf_path: str):

        reader = PdfReader(pdf_path)

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text


pdf_reader = PDFReaderService()