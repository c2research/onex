#include <boost/python.hpp>

#include "OnlineSession.h"

namespace py = boost::python;

OnlineSession os;

/**
 * Wrapping function for loading dataset from a given path.
 */
int loadDataset(const char* path) 
{
  return os.loaddb(path);
}

/**
 * Wrapping function for unloading a dataset.
 */
int unloadDataset(int index) 
{
  return os.killdb(index);
}

/**
 * Wrapping function for grouping a dataset given its index and ST.
 */
int groupDataset(int index, double ST) 
{
  os.initdbgroups(index, ST);  
}

BOOST_PYTHON_MODULE(ONEXBindings)
{
  py::def("loadDataset", loadDataset);
  py::def("unloadDataset", unloadDataset);
  py::def("groupDataset", groupDataset);
}




