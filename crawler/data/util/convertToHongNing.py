import json
import io

review_data=open('../reviews.json')
restaurant_reviews = json.load(review_data)

index_data = open('../restaurant_index_3.json')
restaurant_index = json.load(index_data)
rate = {}
cnt = 0

for elem in restaurant_index:
  rate[elem["name"]] = elem["rating"]

idx = 0
for restaurant in restaurant_reviews:
  if "name" not in restaurant:
    continue
  print idx
  f = open("../LARA/restaurant" + str(idx) + ".dat", 'w')
  idx += 1
  f.write ("<Hotel Name> " + restaurant["name"] + "\n")
  f.write ("<Hotel Address>" + "\n")
  f.write ("<Overall Rating> " + rate[restaurant["name"]] + "\n")
  f.write ("<Avg. Price>" + "\n")
  f.write ("<URL>" + "\n")
  f.write ("<Image URL>" + "\n")

  f.write ("\n")

  for rv in restaurant["reviews"]:
    f.write ("<Review ID> " +  str(cnt) + "\n")
    cnt += 1
    f.write ("<Author> " + rv["user-name"] + "\n")
    f.write ("<Author Location> " + rv["user-location"] + "\n")
    f.write ("<Title> title" + "\n")

#    print "<Content> " + rv["review"] + "\n"
    f.write ("<Content> " + rv["review"] + "\n")
  
    f.write ("<Date> " + rv["date"] + "\n")
    f.write ("<Overall> " + rv["rating"] + "\n")
    f.write("\n")
  f.close()

