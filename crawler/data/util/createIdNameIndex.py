import json
import os

root = "../LARA/Reviews/"
files = os.listdir(root);
dic = {}
for elem in files:
  if elem.startswith('.') or not elem.endswith('dat'):
    continue
  path = root + elem
  f = open(path, 'r')
  firstLine = f.readline()
  head = len("<Hotel Name> ")
  dotPos = elem.find('.')
  dic[elem[:dotPos]] = firstLine[head:].strip()
  f.close()

with open('IDMapping.json', 'w') as output:
  json.dump(dic, output)




