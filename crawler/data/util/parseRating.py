import json

path = "../rating.txt"
f = open(path, 'r')

dic = {}

for line in f:
  lst = line.split("\t")
  lst = map(lambda s:s.strip(), lst)
  dic[lst[0]] = lst[1:]
f.close()

with open('rating.json', 'w') as output:
  json.dump(dic, output, indent=2)

