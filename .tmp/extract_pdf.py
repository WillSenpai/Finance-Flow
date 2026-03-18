import os
import sys

def convert_pdf_to_text(pdf_path, txt_path):
    print(f"Trying to extract {pdf_path} to {txt_path}...")
    try:
        import PyPDF2
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Successfully extracted using PyPDF2. Wrote {len(text)} chars.")
    except ImportError:
        print("PyPDF2 not installed. Trying pdftotext CLI...")
        # fallback to pdftotext
        res = os.system(f"pdftotext '{pdf_path}' '{txt_path}'")
        if res == 0:
            print("Successfully extracted using pdftotext.")
        else:
            print("Failed to run pdftotext.")
            sys.exit(1)
    except Exception as e:
        print(f"Error extracting PDf: {e}")
        sys.exit(1)

if __name__ == "__main__":
    convert_pdf_to_text(sys.argv[1], sys.argv[2])
