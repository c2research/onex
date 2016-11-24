#include <boost/python.hpp>
#include <algorithm>
#include "OnlineSession.h"

#include <boost/foreach.hpp>
#include <boost/range/combine.hpp>

namespace py = boost::python;

OnlineSession os;

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
 *
 * \return a Python list containing the data points in the subsequence.
 */
py::list getSubsequence(int dbIndex, int dbSeq, int dbStart, int dbEnd)
{
  py::list result;
  TimeSeriesInterval interval = os.getinterval(dbIndex, dbSeq, TimeInterval(dbStart, dbEnd));
  for (int i = 0; i < interval.length(); i++) {
    result.append(interval[i]);
  }
  return result;
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
  vector<vector<double> > representatives = os.getGroupRepresentatives(dbIndex);
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
  py::def("groupDataset", groupDataset);
  py::def("findSimilar", findSimilar);
  py::def("getSubsequence", getSubsequence);
  py::def("getDatasetSeqCount", getDatasetSeqCount);
  py::def("getDatasetSeqLength", getDatasetSeqLength);
  py::def("getWarpingPath", getWarpingPath);
  py::def("getSeasonal", getSeasonal);
  py::def("getGroupRepresentatives", getGroupRepresentatives);
}
