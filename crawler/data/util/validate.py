import json

jd = open("../restaurant_index_3.json")
data = json.load(jd)
s = set()
for dic in data:
  s.add(dic["name"])

print len(s)
print len(data)
