import json

jd1 = open('../restaurant_index_5.json')
jd2 = open('../restaurant_index_6.json')

ori = json.load(jd1);
ex = json.load(jd2);

for elem in ori:
  for e in ex:
    if elem["name"] == e["name"]:
      if "price" in e:
        elem["price"] = e["price"]
      if "photo_url" in e:
        elem["photo"] = e["photo_url"]

with open('../restaurant_index_final.json', 'w') as outfile:
  json.dump(ori, outfile, indent=2)
