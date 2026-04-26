import sys
try:
    import PyPDF2
    with open('Even_PRD_v1.0.pdf', 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        with open('output.txt', 'w', encoding='utf-8') as out:
            out.write(text)
except ImportError:
    print("PyPDF2 not installed. Trying PyMuPDF...")
    try:
        import fitz
        doc = fitz.open('Even_PRD_v1.0.pdf')
        text = ''
        for page in doc:
            text += page.get_text() + '\n'
        with open('output.txt', 'w', encoding='utf-8') as out:
            out.write(text)
        print("Text written to output.txt")
    except ImportError:
        print("PyMuPDF not installed either.")
