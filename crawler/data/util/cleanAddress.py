import json

jd = open('../restaurant_index_4.json')
data = json.load(jd)

for elem in data:
  lst = elem['address']
  if lst == "FAIL":
    continue
  address = ""
  for segment in lst:
    address = address + segment + " "
  address = address[:-1]
  elem['address'] = address
  print address

with open('../restaurant_index_5.json', 'w') as output:
  json.dump(data, output, indent=2)

