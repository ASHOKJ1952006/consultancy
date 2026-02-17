"""
Script to remove authentication middleware from all route files
"""
import os
import re

routes_dir = r'C:\Users\ashok\OneDrive\Desktop\consultancy\backend\routes'

# Files to fix
route_files = ['schedules.js', 'inventory.js', 'machines.js', 'inspections.js', 'alerts.js']

for filename in route_files:
    filepath = os.path.join(routes_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the auth middleware import line
    content = re.sub(r"const \{ protect \} = require\('\.\./middleware/auth'\);\s*\n", '', content)
    
    # Remove the router.use(protect) line
    content = re.sub(r"// Apply auth middleware to all routes\s*\nrouter\.use\(protect\);\s*\n", '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filename}")

print("\n🎉 All route files cleaned successfully!")
