#include <boost/python.hpp>

#include "OnlineSession.h"

namespace py = boost::python;

OnlineSession os;

/**
 * Load dataset from a given path.
 * 
 * \param path to the dataset in relation to the server.  
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
  *
  * \return a Python tuple containing information of the best match: 
  *         (dist, seq, start, end) 
  *             dist  - distance from the query to the match 
  *             seq   - index of the sequence containg the result in the dataset 
  *                     being sought.
  *             start - starting position of the result in the sequence.
  *             end   - ending position of the result in the sequence.
  */
// TODO(Cuong) should we include warp parameter?
py::tuple findSimilar(int dbIndex, int qIndex, int qSeq, 
                      int qStart, int qEnd, int strat) //, int warp); 
{
  kBest best = os.similar(dbIndex, qIndex, qSeq, TimeInterval(qStart, qEnd), strat, -1);
  return py::make_tuple(best.dist, best.seq, best.interval.start, best.interval.end);
}

BOOST_PYTHON_MODULE(ONEXBindings)
{
  py::def("loadDataset", loadDataset);
  py::def("loadDatasetWithParams", loadDatasetWithParams);
  py::def("unloadDataset", unloadDataset);
  py::def("groupDataset", groupDataset);
  py::def("findSimilar", findSimilar);
}




