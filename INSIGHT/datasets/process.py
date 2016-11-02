# USAGE: original_dataset.txt new_dataset.txt
import csv
import sys
data = []
out = []
with open(sys.argv[1], 'rb') as csvfile:
     spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
     for row in spamreader:
          ts = [float(d) for d in row]
          data.append(ts[1:])

for ts in data:
     _max = max(ts)
     _min = min(ts)
     out.append([ (datum -_min) / (_max - _min) for datum in ts ] )

count = len(out)
size = len(out[0])

with open(sys.argv[2], 'wb') as csvfile:
     csvfile.write("{0} {1}".format(count, size))
     csvfile.write("\n")
     for ts in out:
          for d in ts:
               csvfile.write("{0} ".format(d))
     csvfile.write("\n")
