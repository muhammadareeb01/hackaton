import os
import glob

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace('href="/admin/', 'href="/')
        new_content = new_content.replace('router.push("/admin/', 'router.push("/')
        new_content = new_content.replace('pathname === "/admin/', 'pathname === "/')
        new_content = new_content.replace('"/admin"', '"/"')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

search_paths = [
    'd:/hackaton/admin_frontend/app/**/*.tsx',
    'd:/hackaton/admin_frontend/components/**/*.tsx'
]

for pattern in search_paths:
    for filepath in glob.glob(pattern, recursive=True):
        replace_in_file(filepath)
        
print("Refactoring complete.")
