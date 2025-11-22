import os
import json
import re
import pypdf

def parse_products_md(file_path):
    metals = []
    current_metal = None
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.endswith(':'):
            if current_metal:
                metals.append(current_metal)
            current_metal = {
                "name": line[:-1],
                "description": []
            }
        elif current_metal:
            current_metal["description"].append(line)
            
    if current_metal:
        metals.append(current_metal)
        
    return metals

def parse_etf_info(info_path):
    info = {}
    current_section = None
    
    with open(info_path, 'r') as f:
        lines = f.readlines()
        
    # Simple parsing based on the observed structure
    # Keys and values can be on separate lines or same line
    
    iterator = iter(lines)
    try:
        while True:
            line = next(iterator).strip()
            if not line:
                continue
                
            if line in ["Basic data", "Issuer", "Strategy", "Top companies", "Industries", "Countries"]:
                current_section = line
                continue
                
            if current_section == "Basic data":
                if ":" in line:
                    key, val = line.split(":", 1)
                    key = key.strip()
                    val = val.strip()
                    if not val:
                        # Value might be on next line
                        val = next(iterator).strip()
                    info[key] = val
            elif current_section == "Issuer":
                 info["Issuer"] = line
            elif current_section == "Strategy":
                 info["Strategy"] = line
            # For now, we might just want to capture the raw text or structured data for other sections if needed
            # But the prompt asks for "important information", usually Basic Data, Issuer, Strategy are key.
            # Let's try to capture Top companies, Industries, Countries as lists/dicts if possible, 
            # but the format is a bit loose (Key : \n Value %). 
            # Let's store them as raw lists for now or try to parse.
            
            elif current_section in ["Top companies", "Industries", "Countries"]:
                if current_section not in info:
                    info[current_section] = []
                
                if line.endswith(":"):
                    item_name = line[:-1].strip()
                    try:
                        item_value = next(iterator).strip()
                    except StopIteration:
                        item_value = ""
                    info[current_section].append({"name": item_name, "value": item_value})

    except StopIteration:
        pass
        
    return info

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        reader = pypdf.PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return ""
    return text.strip()

def get_etfs_data(etfs_dir):
    etfs = []
    
    for etf_dir_name in os.listdir(etfs_dir):
        etf_path = os.path.join(etfs_dir, etf_dir_name)
        if not os.path.isdir(etf_path):
            continue
            
        etf_data = {
            "id": etf_dir_name,
            "files": {}
        }
        
        # Find info.md and PDFs
        for filename in os.listdir(etf_path):
            file_path = os.path.join(etf_path, filename)
            if filename == "info.md":
                etf_data["info"] = parse_etf_info(file_path)
                # We don't need to store the info.md path as we parsed it
            elif filename.lower().endswith(".pdf"):
                pdf_text = extract_text_from_pdf(file_path)
                if "factsheet" in filename.lower():
                    etf_data["files"]["factsheet_text"] = pdf_text
                elif "bib" in filename.lower() or "kid" in filename.lower():
                    etf_data["files"]["basic_info_text"] = pdf_text
                else:
                    # Use filename as key for other PDFs
                    key = filename.lower().replace(".pdf", "") + "_text"
                    etf_data["files"][key] = pdf_text
        
        etfs.append(etf_data)
        
    return etfs

def main():
    base_dir = "/Users/chabu/Documents/projects/hackmack/inaia"
    products_md_path = os.path.join(base_dir, "products.md")
    etfs_dir = os.path.join(base_dir, "etfs")
    output_path = os.path.join(base_dir, "products.json")
    
    metals_data = parse_products_md(products_md_path)
    etfs_data = get_etfs_data(etfs_dir)
    
    final_data = {
        "metals": metals_data,
        "etfs": etfs_data
    }
    
    with open(output_path, 'w') as f:
        json.dump(final_data, f, indent=4)
        
    print(f"Successfully created {output_path}")

if __name__ == "__main__":
    main()
