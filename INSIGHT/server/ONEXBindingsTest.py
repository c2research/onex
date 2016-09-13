import ONEXBindings as onex
import matplotlib.pyplot as plt

warp = 50 
ST = 0.2

dataset = '../../ONEX-tmp/ONEX-tmp/ndata/ECG.txt'
query = '../../ONEX-tmp/ONEX-tmp/ndata/Query.txt'

dbIndex = onex.loadDataset(dataset)
print 'Loaded dataset in {}, index = {}'.format(dataset, dbIndex)

onex.groupDataset(dbIndex, ST)

qIndex = 0
qSeqs  = [74, 1, 2, 3, 4, 5, 6, 7, 8, 9]
qStarts = [0, 2, 3, 20, 1, 1, 3, 3, 1, 1]
qEnds = [95, 60, 50, 70, 80, 59, 99, 40 ,77, 100]

#num_test = len(qSeqs)
num_test = 4 

for i in range(num_test):
  qSeq = qSeqs[i]
  qStart = qStarts[i] 
  qEnd = qEnds[i] 

  dist, seq, start, end = onex.findSimilar(dbIndex, qIndex, qSeq, qStart, qEnd, 0, warp)

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

  ax1 = plt.subplot(2, num_test, i + 1)
  plt.plot(querySequence, 'r-')

  plt.subplot(2, num_test, num_test + i + 1, sharey=ax1)
  plt.plot(matchSequence, 'b-')

plt.show()
