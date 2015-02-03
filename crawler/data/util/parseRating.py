import json

path = "../rating.txt"
f = open(path, 'r')

dic = {}

for line in f:
  lst = line.split("\t\t")
  print(lst[1])
f.close()


