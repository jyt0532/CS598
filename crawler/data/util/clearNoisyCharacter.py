import json
import re

jd = open("../restaurant_index.json")
data = json.load(jd)

def clear(s):
  s = s.replace('\n', '')
  s = s.strip()
  s = re.sub(' +', ' ', s)
  return s

for dic in data:
  dic["name"] = clear(dic["name"])
  dic["category"] = map(clear, dic["category"])
  dic["address"] = clear(dic["address"])


with open("out.json", 'w') as outfile:
  json.dump(data, outfile, indent=2)
