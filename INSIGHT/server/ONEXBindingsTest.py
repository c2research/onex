import ONEXBindings as onex
import matplotlib.pyplot as plt

dataset = '../../ONEX-tmp/ONEX-tmp/ndata/ECG.txt'
query = '../../ONEX-tmp/ONEX-tmp/ndata/Query.txt'

dbIndex = onex.loadDataset(dataset)
print 'Loaded dataset in {}, index = {}'.format(dataset, dbIndex)

qIndex = onex.loadDataset(query)
print 'Loaded query in {}, index = {}'.format(query, qIndex)

ST = 0.2
onex.groupDataset(dbIndex, ST)

qIndex = 0
qSeq = 0
qStart = 0
qEnd = 100

dist, seq, start, end = onex.findSimilar(dbIndex, qIndex, qSeq, qStart, qEnd, 0)

print """Find subsequence in database {} that is similar to subsequence:
  qIndex = {} 
  qSeq = {}
  qStart = {}
  qEnd = {}""".format(dbIndex, qIndex, qSeq, qStart, qEnd)

print "Distance = {}  Sequence = {}  Start = {}  End = {}".format(dist, seq, start, end)

querySequence = onex.getSubsequence(qIndex, qSeq, qStart, qEnd)
matchSequence = onex.getSubsequence(dbIndex, seq, start, end)

print "Query:\n{}".format(querySequence)
print "Match:\n{}".format(matchSequence)

ax1 = plt.subplot(211)
plt.plot(querySequence, 'r-')

plt.subplot(212, sharey=ax1)
plt.plot(matchSequence, 'b-')

plt.show()
