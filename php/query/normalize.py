import json
import math

f = open('./php/db/rating.json')
data = json.load(f)

ret = {}
for key in data:
	tmp_float = []
	tmp = []
	for i in data[key]:
		tmp_float.append(float(i))
	print tmp_float

	num =  math.pow(math.pow(tmp_float[0],2) + math.pow(tmp_float[1],2) + math.pow(tmp_float[2],2),0.5)
	for i in tmp_float:
		tmp.append(i / num)

	ret[key] = tmp

	#print data[key], sum(decode(data[key]))

#print len(data)
print ret

with open('output_normalize.json', 'w') as outfile:
  		json.dump(ret, outfile, indent=2)
	


f.close()
