import json

jd = open("../restaurant_index_5.json")
r = json.load(jd)

s = set()
for elem in r:
  if elem["category"] == "FAIL":
    continue
  for c in elem["category"]:
    s.add(c)

ret = list(s)
with open('category.json', 'w') as output:
  json.dump(ret, output, indent=2)

