import json

jd = open('./../../../php/db/IDMapping.json', 'r');
data = json.load(jd)

inv = {v: k for k, v in data.items()}

with open("mapping.json", 'w') as output:
  json.dump(inv, output, indent=2)
