import json

jd = open('../../../php/db/RestaurantAddress.json')
data = json.load(jd)

dic = {}
for elem in data:
  dic[elem["name"]] = elem["location"]

with open("RestaurantAddress.json", "w") as output:
  json.dump(dic, output, indent=2)


