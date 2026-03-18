import sys
import pdfplumber

def extract(pdf_path, txt_path):
    print(f"Extracting {pdf_path} with pdfplumber...")
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Done. Wrote {len(text)} characters.")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    extract(sys.argv[1], sys.argv[2])
