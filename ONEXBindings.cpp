#include <boost/python.hpp>

#include "OnlineSession.h"

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

BOOST_PYTHON_MODULE(ONEXBindings)
{
  py::def("loadDataset", loadDataset);
  py::def("loadDatasetWithParams", loadDatasetWithParams);
  py::def("unloadDataset", unloadDataset);
  py::def("groupDataset", groupDataset);
  py::def("findSimilar", findSimilar);
  py::def("getSubsequence", getSubsequence);
}




