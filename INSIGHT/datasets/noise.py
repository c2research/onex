import sys


# read
data = []
with open(sys.argv[1], 'r') as f:
    for r in f:
        ts = []
        for d in r.split():
            print(d)
            ts.append(float(d))
        data.append(ts)

# i choose specific ts, this could be randomized...
choice = [data[44], data[46]]
data = choice
e = 0.1
diff = 0.05

import random
# noise
for i,ts in enumerate(data):
    for j,d in enumerate(ts):
        if random.random() < e:
            v = random.uniform(d-(d*diff), d+(e*diff))
            data[i][j] = v

# normalize
out = []
for ts in data:
    _max = max(ts)
    _min = min(ts)
    out.append([ (datum -_min) / (_max - _min) for datum in ts ] )


# write out
for i,v in enumerate(data):
    with open('_{0}_'.format(i) + sys.argv[1], 'wb') as f:
        f.write('{0} {1}\n'.format(1, len(v)))
        for d in v:
            f.write("{0} ".format(d))
        f.write('\n')
