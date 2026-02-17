import sys

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\BatchHistory.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Keep lines 0-95 (before the hardcoded array)
before = lines[0:95]

# Add the useEffect hook
useEffect_code = [
    '\n',
    '  // Fetch batches on component mount\n',
    '  useEffect(() => {\n',
    '    fetchBatches();\n',
    '  }, []);\n',
    '\n',
    '  const fetchBatches = async () => {\n',
    '    try {\n',
    '      setLoading(true);\n',
    '      const response = await batchAPI.getAll();\n',
    '      setBatches(response.data);\n',
    '      setError(null);\n',
    '    } catch (err) {\n',
    '      console.error(\'Error fetching batches:\', err);\n',
    '      setError(\'Failed to load batches\');\n',
    '    } finally {\n',
    '      setLoading(false);\n',
    '    }\n',
    '  };\n',
]

# Keep lines after the hardcoded array (from line 254 onwards)
after = lines[254:]

# Combine all parts
new_content = before + useEffect_code + after

# Write back to file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\BatchHistory.js', 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print("✅ Successfully removed hardcoded batches array and added useEffect hook")
print(f"   Removed lines: 96-254 ({254-95} lines)")
print(f"   Added useEffect: {len(useEffect_code)} lines")
print(f"   New total lines: {len(new_content)}")
