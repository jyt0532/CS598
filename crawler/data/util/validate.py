import json

jd = open("../restaurant_index.json")
data = json.load(jd)
s = set()
for dic in data:
  s.add(dic["name"])

print len(s)
