import json

path = "/Users/johnson/Desktop/UIUC/2014Fall/Advanced Information Retrieval/project/LARAM/Data/Results/prediction.dat"
f = open(path, 'r')

dic = {}

for line in f:
  lst = line.split("\t\t")
  ratings = lst[1].split("\t")
  ratings = map(lambda x: float(x), ratings)
  name = (lst[0].split("\t"))[0]
  dic[name] = ratings

with open('../../../php/db/rating.json', 'w') as outfile:
  json.dump(dic, outfile, indent=2)

f.close()


