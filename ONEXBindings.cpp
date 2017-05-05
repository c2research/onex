#include <boost/python.hpp>
#include <algorithm>
#include "OnlineSession.h"

#include <boost/foreach.hpp>
#include <boost/range/combine.hpp>

namespace py = boost::python;

OnlineSession os;

/**
 * Reduce the number of data points by putting every certain number of
 * data points into bins. Data points in each bin are averaged and become
 * a single new data point.
 *
 * \param seq     the sequence to be reduced.
 * \param binSize number of data points in a bin.
 * \return the reduced sequence.
 */
vector<seqitem_t> reduceSequence(vector<seqitem_t> seq, int binSize) {
  vector<seqitem_t> reduced;
  for (int i = 0; i < seq.size(); i += binSize) {
    seqitem_t binSum = 0;
    for (int j = 0; j < binSize; j++) {
      if (i + j >= seq.size()) break;
      binSum += seq[i + j];
    }
    reduced.push_back(binSum / binSize);
  }
  return reduced;
}

/**
 * Load dataset from a given path.
 *
 * \param path to the dataset in relation to the server.
 *
 * \return index of the dataset in the dataset list.
*/
int loadDataset(const char* path)
{
  int index = os.loaddb(path);
  return index;
}

/**
 * Load dataset from a given path with options to specify number of sequences,
 * length of each sequence, and the number of starting columns to be dropped at
 * each row.
 *
 * \param path path to the dataset.
 * \param seqCount number of time series sequence in the dataset.
 * \param seqLength length of each sequence.
 * \param firstColumnsDrop number of starting columns to drop at each row.
 *
 * \return index of the dataset in the dataset list.
 */
int loadDatasetWithParams(const char* path, int seqCount, int seqLength, int firstColumnsDrop)
{
  int index = os.loadolddb(path, seqCount, seqLength, firstColumnsDrop);
  return index;
}

/**
 * Unloading a dataset.
 */
int unloadDataset(int index)
{
  return os.killdb(index);
}

py::tuple normalizeDataset(int index)
{
  pair<seqitem_t, seqitem_t> normalization = os.normalize(index);
  return py::make_tuple(normalization.first, normalization.second);
}

/**
 * Perform grouping on dataset given its index and ST.
 *
 * \return number of groups.
 */
int groupDataset(int index, double ST)
{
  return os.initdbgroups(index, ST);
}

/**
  * Find the most similar subsequence in a dataset to a query.
  *
  * \param dbIndex index of the dataset where the similar subsequence will be
  *                sought.
  * \param qIndex  index of the dataset containing the query.
  * \param qSeq    index of the sequence containing the query.
  * \param qStart  starting position of the query in the sequence.
  * \param qEnd    ending position of the query in the sequence.
  * \param strat   search startegy, can be chosen from:
  *                  INTERMIX      = 0
  *                  EHIGHER_LOWER = 1
  *                  ELOWER_HIGHER = 2
  *                  EBOTTOM_TOP   = 3
  *                  ETOP_BOTTOM   = 4
  * \param qWarp ...
  * \return a Python tuple containing information of the best match:
  *         (dist, seq, start, end)
  *             dist  - distance from the query to the match
  *             seq   - index of the sequence containg the result in the dataset
  *                     being sought.
  *             start - starting position of the result in the sequence.
  *             end   - ending position of the result in the sequence.
  */
py::tuple findSimilar(int dbIndex, int qIndex, int qSeq,
                      int qStart, int qEnd, int strat, int warp)
{
  kBest best = os.similar(dbIndex, qIndex, qSeq, TimeInterval(qStart, qEnd), strat, warp);
  return py::make_tuple(best.dist, best.seq, best.interval.start, best.interval.end);
}

/**
 * Get a subsequence in a dataset.
 *
 * \param dbIndex index of a dataset in the dataset list.
 * \param dbSeq index of a sequence in the dataset.
 * \param dbStart starting position of the subsequence in the sequence.
 * \param dbEnd ending position of the subsequence in the sequence.
 * \param binSize number of data points in a bin that used for data compression.
 *
 * \return a Python list containing the data points in the subsequence.
 */
py::list getSubsequence(int dbIndex, int dbSeq, int dbStart, int dbEnd, int binSize = 1)
{
  py::list result;
  TimeSeriesInterval interval = os.getinterval(dbIndex, dbSeq, TimeInterval(dbStart, dbEnd));
  vector<seqitem_t> reducedInterval;
  for (int i = 0; i < interval.length(); i++) {
    reducedInterval.push_back(interval[i]);
  }
  reducedInterval = reduceSequence(reducedInterval, binSize);
  for (int i = 0; i < reducedInterval.size(); i++) {
    result.append(reducedInterval[i]);
  }
  return result;
}

py::list getSubsequenceDefault(int dbIndex, int dbSeq, int dbStart, int dbEnd) {
  return getSubsequence(dbIndex, dbSeq, dbStart, dbEnd, 1);
}

// py::list getSequences(int dbIndex, py::list indices, int binSize)
// {
//   py::list seqs;
//   int seqLength = os.getdbseqlength(dbIndex);
//   for (int i = 0; i < py::len(indices); i++) {
//     int index = py::extract<int>(indices[i]);
//     py::list seq = getSubsequence(dbIndex, index, 0, seqLength - 1, binSize);
//     seqs.append(seq);
//   }
//   return seqs;
// }

/**
 * Get all sequences in a dataset.
 *
 * \param dbIndex index of a dataset in the dataset list.
 * \param binSize number of data points in a bin that used for data compression.
 * \return a list where each element is a tuple (ts, groupId) where:
 *         ts: is Python list representing a sequence in the dataset
 *         groupId: is the id of the group that the sequence resides in
 */
py::list getAllSequences(int dbIndex, int binSize)
{
  py::list result;
  int seqCount = os.getdbseqcount(dbIndex);
  int seqLength = os.getdbseqlength(dbIndex);
  for (int i = 0; i < seqCount; i++) {
    py::list ts = getSubsequence(dbIndex, i, 0, seqLength - 1, binSize);
    int groupId = os.getGroupIndex(dbIndex, i, TimeInterval(0, seqLength - 1)).second;
    result.append(py::make_tuple(ts, groupId));
  }
  return result;
}

/**
 * Get the distance between two subsequence.
 *
 * \param dbIndexA index of the first dataset in memory
 * \param dbSeqA index of a sequence in the first dataset
 * \param startA starting position of the first subsequence
 * \param endA ending position of the first subsequence
 * \param dbIndexB index of the second dataset in memory
 * \param dbSeqB index of a sequence in the second dataset
 * \param startB starting position of the second subsequence
 * \param endB ending position of the second subsequence
 * \return dtw distance between two time series.
 */
seqitem_t getDistance(int dbIndexA, int dbSeqA, int startA, int endA,
                     int dbIndexB, int dbSeqB, int startB, int endB)
{
  seqitem_t distance = os.findDist(dbIndexA, dbIndexB, dbSeqA, dbSeqB,
                                  TimeInterval(startA, endA), TimeInterval(startB, endB),
                                  getDistMetric("dtw_lp2"));
  return distance;
}

/**
 * Get the warping path between two subsequence.
 *
 * \param dbIndexA index of the first dataset in memory
 * \param dbSeqA index of a sequence in the first dataset
 * \param startA starting position of the first subsequence
 * \param endA ending position of the first subsequence
 * \param dbIndexB index of the second dataset in memory
 * \param dbSeqB index of a sequence in the second dataset
 * \param startB starting position of the second subsequence
 * \param endB ending position of the second subsequence
 * \return a Python list containing Python tuples representing pairs of
 *         indices each of which matches a point from the first subsequence
 *         to a point in the second subsequence.
 */
py::list getWarpingPath(int dbIndexA, int dbSeqA, int startA, int endA,
                        int dbIndexB, int dbSeqB, int startB, int endB)
{
  py::list result;
  warping_path_t warp = os.getWarpingPath(dbIndexA, dbIndexB, dbSeqA, dbSeqB,
                                          TimeInterval(startA, endA), TimeInterval(startB, endB),
                                          getDistMetric("dtw_lp2"));
  for (int i = 0; i < warp.size(); i++) {
    py::list pair;
    pair.append(warp[i].first);
    pair.append(warp[i].second);
    result.append(pair);
  }
  return result;
}

bool _intervalCmp(kBest A, kBest B) {
  return A.interval.end < B.interval.end;
}

/**
 * Get seasonal patterns of a given length in a specified sequence.
 *
 * \param dbIndex index of the a dataset
 * \param dbSeq index of a sequence in the dataset
 * \param length length of the desired repeated patterns
 * \return a Python list of seasonal patterns. Each list of seasonal pattern contains
 *         pairs of starting and ending positions of subsequences which are similar to
 *         each other.
 */
py::list getSeasonal(int dbIndex, int dbSeq, int length)
{
  vector< vector<kBest> > seasonalGroups = os.seasonalSimilarity(dbIndex, dbSeq, length);
  py::list seasonals;
  for (int i = 0; i < seasonalGroups.size(); i++) {
    // Sort for the greedy algorithm
    sort(seasonalGroups[i].begin(), seasonalGroups[i].end(), _intervalCmp);
    py::list seasonal;
    int lastEnd = -1;
    for (int j = 0; j < seasonalGroups[i].size(); j++) {
      int curStart = seasonalGroups[i][j].interval.start;
      int curEnd = seasonalGroups[i][j].interval.end;
      // Greedily choose non-overlap subsequences
      if (curStart > lastEnd) {
        py::list startEnd;
        startEnd.append(curStart);
        startEnd.append(curEnd);
        seasonal.append(startEnd);
        lastEnd = curEnd;
      }
    }
    if (py::len(seasonal) > 1) {
      seasonals.append(seasonal);
    }
  }
  return seasonals;
}

/**
 * Get 'representatives' of all the groups
 *
 * \param dbIndex index of a dataset.
 * \return a list of tuples where each tuple is a
 *         vector of doubles and then a count of members in the group
 */
py::list getGroupRepresentatives(int dbIndex)
{
  vector<vector<seqitem_t> > representatives = os.getGroupRepresentatives(dbIndex);
  vector<int> counts = os.getGroupCounts(dbIndex);

  py::list result;

  vector<seqitem_t> rep;
  int cnt;

  BOOST_FOREACH(boost::tie(rep, cnt), boost::combine(representatives, counts))
  {
    py::list rep_py;
    BOOST_FOREACH( double r, rep ){
      rep_py.append(r);
    }
    result.append(py::make_tuple(rep_py,cnt));
  }

  return result;
}

/**
 * Get all the ts locaitons in a group
 * ...
 */
py::list getGroupValues(int dbIndex, int length, int groupIndex)
{
  vector<TimeSeriesInterval> seqs = os.getGroupValues(dbIndex, length, groupIndex);
  py::list sequenceLocations;
  BOOST_FOREACH(TimeSeriesInterval seq, seqs){
    TimeInterval interval = seq.getInterval();
    sequenceLocations.append(py::make_tuple(seq.getSeqNum(), interval.start, interval.end));
  }

  return sequenceLocations;
}

/**
 * Get a group index of a time series.
 * \param dbIndex index of the a dataset
 * \param dbSeq index of a sequence in the dataset
 * \param start starting position of the sequence
 * \param end ending position of the sequence
 * \return a tuple (len, idx) where len is the length of the time series
 *         and idx is the index of the group among the set of groups of length len.
 */
py::tuple getGroupIndex(int dbIndex, int dbSeq, int start, int end)
{
  pair<int, int> index = os.getGroupIndex(dbIndex, dbSeq, TimeInterval(start, end));
  return py::make_tuple(index.first, index.second);
}

/**
 * Get the number of sequence in a dataset.
 *
 * \param dbIndex index of a dataset.
 * \return number of sequence in the dataset.
 */
int getDatasetSeqCount(int dbIndex)
{
  return os.getdbseqcount(dbIndex);
}

/**
 * Get the length of each sequence in a dataset.
 *
 * \param dbIndex index of a dataset.
 * \return length of each sequence in the dataset.
 */
int getDatasetSeqLength(int dbIndex)
{
  return os.getdbseqlength(dbIndex);
}


BOOST_PYTHON_MODULE(ONEXBindings)
{
  py::def("loadDataset", loadDataset);
  py::def("loadDatasetWithParams", loadDatasetWithParams);
  py::def("unloadDataset", unloadDataset);
  py::def("normalizeDataset", normalizeDataset);
  py::def("groupDataset", groupDataset);
  py::def("findSimilar", findSimilar);
  py::def("getSubsequence", getSubsequence);
  py::def("getSubsequence", getSubsequenceDefault);
  // py::def("getSequences", getSequences);
  py::def("getAllSequences", getAllSequences);
  py::def("getDatasetSeqCount", getDatasetSeqCount);
  py::def("getDatasetSeqLength", getDatasetSeqLength);
  py::def("getDistance", getDistance);
  py::def("getWarpingPath", getWarpingPath);
  py::def("getSeasonal", getSeasonal);
  py::def("getGroupRepresentatives", getGroupRepresentatives);
  py::def("getGroupValues", getGroupValues);
  py::def("getGroupIndex", getGroupIndex);
}
