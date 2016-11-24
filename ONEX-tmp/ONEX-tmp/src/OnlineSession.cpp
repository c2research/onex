#include "OnlineSession.h"

#include <map>
#include <string>
#include <exception>
#include <stdexcept>
#include <algorithm>

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

OnlineSession::OnlineSession(double defaultST, int defaultR, ostream *out, ostream *err)
{
    this->defaultST = defaultST;
    this->defaultR = defaultR;

    if (out == NULL)
        out = &cout;
    if (err == NULL)
        err = &cerr;

    this->out = out;
    this->err = err;
    _datasetCount = 0;
}

OnlineSession::~OnlineSession(void)
{
    for (unsigned int i = 0; i < datasets.size(); i++) {
        delete datasets[i];
    }

    datasets.clear();
}

int OnlineSession::_insertDataset(GroupableTimeSeriesSet* db)
{
    int index = -1;
    _datasetCount++;
    for (unsigned int i = 0; i < datasets.size(); i++) {
        if (datasets[i] == NULL) {
            datasets[i] = db;
            index = i;
        }
    }
    if (index == -1) {
        datasets.push_back(db);
        index = datasets.size() - 1;
    }
    return index;
}

int OnlineSession::randdb(int range, int seqCount, int seqLength)
{
    TimeSeriesSet *dataset = &TimeSeriesSet::randomSet(seqCount, seqLength, range);
    int index = _insertDataset(new GroupableTimeSeriesSet(dataset));

    return index;
}

int OnlineSession::killdb(int index)
{
    delete datasets[index];
    datasets[index] = NULL;
    _datasetCount--;

    return 0;
}

int OnlineSession::loaddb(const char *path)
{
    GroupableTimeSeriesSet *db = new GroupableTimeSeriesSet();

    int ret = db->dbFromFile(path);
    if (ret == 0) {
        int index = _insertDataset(db);
        return index;
    } else {
        delete db;
        return -1;
    }
}

int OnlineSession::savedb(int index, const char *path)
{
    return datasets[index]->dbToFile(path);
}

int OnlineSession::loadolddb(const char *path, int seqCount, int seqLength, int newlineDrop)
{
    GroupableTimeSeriesSet *db = new GroupableTimeSeriesSet();

    int ret = db->odbFromFile(path, seqCount, seqLength, newlineDrop);

    if (ret == 0) {
        int index = _insertDataset(db);
        return index;
    } else {
        delete db;
        return -1;
    }
}
int OnlineSession::saveolddb(int index, const char *path)
{
    *err << "Warning: Attempted to save old-format database. is temporarily unavailable." << endl;

    return -1;
}

int OnlineSession::initdbgroups(int index, seqitem_t ST)
{
    if (ST == -1)
        ST = defaultST;

    return datasets[index]->genGrouping(ST);
}

/**
 * Get 'counts' of all the groups
 *
 * \param dbIndex index of a dataset.
 * \return a list of counts (of the largest size groups)
 */
vector<int> OnlineSession::getGroupCounts(int index)
{
  GroupableTimeSeriesSet* step_1 = datasets[index];
  TimeSeriesSetGrouping* step_2 = step_1->getGrouping();
  TimeSeriesGrouping* step_3 = step_2->getFullGroup();
  vector<TimeSeriesGroup*> groups = step_3->getGroups();

  vector<int> counts;

  for(vector<TimeSeriesGroup*>::iterator it = groups.begin(); it != groups.end(); ++it) {
    TimeSeriesGroup* tsg = *(it);
    int count = tsg->getCount();
    counts.push_back(count);
  }

  return counts;
}

/**
 * Get 'representatives' of all the groups (of max length)
 *
 * \param dbIndex index of a dataset.
 * \return a list of vectors of doubles (each centroid) (of the largest size groups)
 */
vector<vector<seqitem_t> > OnlineSession::getGroupRepresentatives(int index)
{
    GroupableTimeSeriesSet* step_1 = datasets[index];
    TimeSeriesSetGrouping* step_2 = step_1->getGrouping();
    TimeSeriesGrouping* step_3 = step_2->getFullGroup();
    vector<TimeSeriesGroup*> groups = step_3->getGroups();

    vector<vector<seqitem_t>> representatives;

    for(vector<TimeSeriesGroup*>::iterator it = groups.begin(); it != groups.end(); ++it) {
      TimeSeriesGroup* tsg = *(it);
      vector<seqitem_t> centroid = tsg->getCentroid(); //centroid.getCentroid();
      representatives.push_back(centroid);
    }

    return representatives;
}

int OnlineSession::killdbgroups(int index)
{
    datasets[index]->resetGrouping();

    return 0;
}

int OnlineSession::savedbgroups(int index, const char *path)
{
    return datasets[index]->groupsToFile(path);
}

int OnlineSession::loaddbgroups(int index, const char *path)
{
    return datasets[index]->groupsFromFile(path);
}

int OnlineSession::getdbcount(void)
{
    return _datasetCount;
}

int OnlineSession::getdbseqcount(int index)
{
    return datasets[index]->getSeqCount();
}

int OnlineSession::getdbseqlength(int index)
{
    return datasets[index]->getSeqLength();
}

GroupableTimeSeriesSet *OnlineSession::getdb(int index)
{
    return datasets[index];
}

int OnlineSession::printdbs(void)
{
    *out << "Available data sets:" << endl;
    for (unsigned int i = 0; i < datasets.size(); i++) {
        if (datasets[i] != NULL) {
          *out << "[" << i << "] " << ((!datasets[i]->validGrouping())? "UNGROUPED " : "  GROUPED ");
          *out << datasets[i]->getName() << "." << endl;
        }
    }

    return 0;
}

int OnlineSession::printdb(int index)
{
    datasets[index]->printdb();

    return 0;
}

int OnlineSession::descdb(int index)
{
    datasets[index]->descdb();

    return 0;
}

int OnlineSession::printint(int index, int seq, TimeInterval interval)
{
    datasets[index]->printint(seq, interval);

    return 0;
}

TimeSeriesInterval OnlineSession::getinterval(int index, int seq, TimeInterval interval)
{
    return datasets[index]->getinterval(seq, interval);
}

int OnlineSession::printdists(void)
{
    printDistMetrics();

    return 0;
}

seqitem_t OnlineSession::findDist(int indexa, int indexb,
              int seqa, int seqb,
              TimeInterval inta, TimeInterval intb,
              SeriesDistanceMetric *metric)
{
    return datasets[indexa]->distance(seqa, inta, datasets[indexb], seqb, intb, metric);
}

warping_path_t OnlineSession::getWarpingPath(int indexa, int indexb,
              int seqa, int seqb,
              TimeInterval inta, TimeInterval intb,
              SeriesDistanceMetric *metric)
{
    warping_path_t path = datasets[indexa]->warping_path(seqa, inta, datasets[indexb], seqb, intb, metric);
    reverse(path.begin(), path.end());
    return path;
}

kBest OnlineSession::similar(int dbindex, int qindex, int qseq, TimeInterval qint, int strat, int r)
{
    if (strat == -1)
        strat = EHIGHER_LOWER;

    if (r == -1)
        r = defaultR;

    return datasets[dbindex]->similar(datasets[qindex], qseq, qint, (SearchStrategy) strat, r);
}

vector< vector<kBest> > OnlineSession::seasonalSimilarity(int dbindex, int TSIndex, int length)
{
    return datasets[dbindex]->seasonalSimilarity(TSIndex, length);
}

int OnlineSession::outlier(int dbindex, int length)
{
    datasets[dbindex]->outlier(length);

    return 0;
}

int OnlineSession::setST(seqitem_t ST)
{
    defaultST = ST;

    return 0;
}

seqitem_t OnlineSession::getST(void)
{
    return defaultST;
}

int OnlineSession::setR(int R)
{
    defaultR = R;

    return 0;
}

int OnlineSession::getR(void)
{
    return defaultR;
}

void OnlineSession::setout(ostream &out)
{
    this->out = &out;
}

void OnlineSession::seterr(ostream &err)
{
    this->err = &err;
}

ostream &OnlineSession::getout(void)
{
    return *out;
}

ostream &OnlineSession::geterr(void)
{
    return *err;
}

void OnlineSession::checkIndex(int index)
{
    if ((unsigned) index >= datasets.size() || datasets[index] == NULL)
        throw out_of_range("No dataset with that index.");
}

enum _commands {

    _LOAD_TSS = 1,   // Load a time series set.
    _OLOAD_TSS,  // Load a time series set from old file format.
    _SAVE_TSS,   // Save a time series set.
    _OSAVE_TSS,  // Save a time series set to old file format.
    _DROP_TSS,   // Drop a time series set.
    _RAND_TSS,   // Generate a random time series set.

    _LIST_TSS,   // List available time series set.

    _NORM_TSS,      // Normalize a time series set.

    _KSIM_TSS,      // Get the k similar neighbors.
    _OUTLIER_TSS,   // Find the dominant outlier.

    _TSS_DIST, // Get the distance between two series intervals.
    _LS_DIST,  // List available distance metrics.

    _GROUP_TSS,      // Group a time series set with default ST.
    _GROUP_ST_TSS,   // Group a time series set with given ST.
    _LOAD_GROUP_TSS, // Load a grouping file.
    _SAVE_GROUP_TSS, // Save a grouping file.
    _DROP_GROUP_TSS, // Drop a grouping.

    _DESC_TSS,       // Describe a time series set.
    _PRINT_TSS,      // Print a time series set.
    _PRINT_INTERVAL, // Print a time series set interval.

    _SET_DEF_ST, // Set the default ST.
    _GET_DEF_ST, // Get the default ST.

    _SET_DEF_R, // Set the default R.
    _GET_DEF_R, // Get the default R.

    _HELP,       // Print help.
    _EXIT        // Exit the program.
};

void _print_help(ostream &out)
{
    out << "ONEX interactive command line interface." << endl;
    out << "Available commands:" << endl;
    out << "load <path>          Load a dataset from the given file. New format only." << endl;
    out << "save <id> <path>     Save a loaded dataset to the given file. New format." << endl;
    out << "drop | rm <id>       Unload a loaded database.                           " << endl;
    out << "random <N> <L> <rng> Generate a random NxL dataset with range rng.       " << endl;
    out << endl;
    out << "normalize <id>       Normalize the given dataset.                        " << endl;
    out << endl;
    out << "group <id>           (Re)Group the given dataset using current ST.       " << endl;
    out << "groupST <id> <ST>    (Re)Group the given dataset using the given ST.     " << endl;
    out << "gload <id> <path>    Load grouping data for the given dataset from file. " << endl;
    out << "gsave <id> <path>    Save grouping data for the given dataset to file.   " << endl;
    out << "gdrop <id> |grm <id> Delete grouping data for the given dataset.         " << endl;
    out << endl;
    out << "ksim <dbid> <qid> <qN> <start> <end> <method>                            " << endl;
    out << "                     Get the most similar sequence from dataset dbid to  " << endl;
    out << "                     query string in dataset qid at qN from start to end." << endl;
    out << "                     Search is constrained by the R factor. Search       " << endl;
    out << "                     methods include 0:Intermix, 1:go up, then down,     " << endl;
    out << "                     2:go down, then up, 3:bottom to top, and finally    " << endl;
    out << "                     4:top to bottom.                                    " << endl;
    //out << "outlier <id> <s> <e> Find a dominant outlier in the dataset.             " << endl;
    out << endl;
    out << "dist [<dbid> <seq> <s> <e>] x 2 <method>                                 " << endl;
    out << "                     Using distance method <method>, find the distance   " << endl;
    out << "                     between the first and second interval specified by  " << endl;
    out << "                     their dataset ID, sequence ID, and start/end        " << endl;
    out << "                     intervals.                                          " << endl;
    out << "lsdist               List available distance metrics.                    " << endl;
    out << endl;
    out << "describe | desc <id> Describe a dataset.                                 " << endl;
    out << "print <id>           Print a dataset.                                    " << endl;
    out << "interval <id> <seq> <s> <e>                                              " << endl;
    out << "                     Print an interval of a dataset.                     " << endl;
    out << "list | ls            List all loaded / available datasets.               " << endl;
    out << endl;
    out << "setST <value>        Set the default Similarity Threshold.               " << endl;
    out << "getST                View the current default Similarity Threshold.      " << endl;
    out << "setR <value>         Set the default R constraint.                       " << endl;
    out << "getR                 View the current default R constraint.              " << endl;
    out << endl;
    out << "osave <id> <path>         Save a loaded dataset to the given file. Old format.            " << endl;
    out << "oload <path> <N> <L> <D>  Load a dataset from a raw file, skip first D in each line.      " << endl;
    out << endl;
    out << "help | h | ?         Print this message.                                 " << endl;
    out << "exit|quit|q          Exit from ONEX CLI.                                 " << endl;
}

static void _prepareCommands(map<string, int> &commands) {

    commands["exit"] = _EXIT;
    commands["quit"] = _EXIT;
    commands["q"] = _EXIT;

    commands["load"] = _LOAD_TSS;
    commands["oload"] = _OLOAD_TSS;
    commands["save"] = _SAVE_TSS;
    commands["osave"] = _OSAVE_TSS;
    commands["rm"] = _DROP_TSS;
    commands["drop"] = _DROP_TSS;
    commands["random"] = _RAND_TSS;

    commands["list"] = _LIST_TSS;
    commands["ls"] = _LIST_TSS;
    commands["help"] = _HELP;
    commands["h"] = _HELP;
    commands["?"] = _HELP;

    commands["desc"] = _DESC_TSS;
    commands["describe"] = _DESC_TSS;
    commands["print"] = _PRINT_TSS;
    commands["interval"] = _PRINT_INTERVAL;

    commands["ksim"] = _KSIM_TSS;
    commands["outlier"] = _OUTLIER_TSS;

    commands["dist"] = _TSS_DIST;
    commands["lsdist"] = _LS_DIST;

    commands["normalize"] = _NORM_TSS;

    commands["group"] = _GROUP_TSS;
    commands["groupST"] = _GROUP_ST_TSS;

    commands["gload"] = _LOAD_GROUP_TSS;
    commands["gsave"] = _SAVE_GROUP_TSS;
    commands["gdrop"] = _DROP_GROUP_TSS;
    commands["grm"] = _DROP_GROUP_TSS;

    commands["setST"] = _SET_DEF_ST;
    commands["getST"] = _GET_DEF_ST;
    commands["setR"] = _SET_DEF_R;
    commands["getR"] = _GET_DEF_R;
}

int OnlineSession::run(istream &in, bool interactive)
{
    map<string, int> commands;
    _prepareCommands(commands);

    int res = 0;
    int count = 0;

    int cmd;
    string command;

    string sarg1, sarg2;
    int iarg1, iarg2, iarg3, iarg4, iarg5, iarg6, iarg7, iarg8;
    SeriesDistanceMetric *metric;
    double darg1;
    GroupableTimeSeriesSet *t;
    kBest best;

    clock_t time;

    res = 0;

    while (!in.eof()) {

        if (res != 0)
            getout() << "Command returned with status " << res << "." << endl;

        if (interactive) {
            int width = getout().width();
            getout() << "[";

            getout().width(3);
            getout() << count;
            getout().width(width);

            getout() << "] > ";
            getout().flush();
        }

        in >> command;

        if (command.size() > 0 && !in.eof()) {
            cmd = commands[command];
        } else {
            cmd = _EXIT;
            getout() << endl;
        }

        time = clock();

        try {
            res = 0;

            switch (cmd) {
            case 0:
                getout() << "Unknown command '" << command << "'. Type 'help' for help." << endl;

                res = 1;
                break;

            case _EXIT:
                getout() << "Quitting..." << endl;

                return 0;

            case _HELP:
                _print_help(getout());

                break;

            case _LOAD_TSS:
                in >> sarg1;

                getout() << "Loading Time Series Set from file '" << sarg1 << "'." << endl;

                res = loaddb(sarg1.c_str());
                if (res != -1) {
                    getout() << "Dataset successfully loaded. Index: " << res << endl;
                } else {
                    getout() << "Failed to load dataset." << endl;
                }

                break;

            case _SAVE_TSS:
                in >> iarg1;
                in >> sarg2;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Saving Time Series Set " << iarg1 << ":" << t->getName() << " to file '" << sarg2 << "'." << endl;

                res = savedb(iarg1, sarg2.c_str());
                if (res == 0)
                    getout() << "Dataset successfully saved." << endl;
                else
                    getout() << "Failed to save dataset." << endl;

                break;

            case _OLOAD_TSS:
                in >> sarg1;
                in >> iarg1 >> iarg2 >> iarg3;

                getout() << "Loading Time Series Set from file '" << sarg1 << "' with N=" << iarg1 << ", L=" << iarg2 << ", and D=" << iarg3 << "." << endl;

                res = loadolddb(sarg1.c_str(), iarg1, iarg2, iarg3);
                if (res != -1) {
                    getout() << "Dataset successfully loaded. Index: " << res << endl;
                } else {
                    getout() << "Failed to load dataset." << endl;
                }

                break;

            case _OSAVE_TSS:
                in >> iarg1;
                in >> sarg2;

                checkIndex(iarg1);
                t = datasets[iarg1];

                getout() << "Saving Time Series Set " << iarg1 << ":" << t->getName() << " to file '" << sarg2 << "'." << endl;

                res = saveolddb(iarg1, sarg2.c_str());
                if (res == 0)
                    getout() << "Dataset successfully saved." << endl;
                else
                    getout() << "Failed to save dataset." << endl;

                break;

            case _DROP_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Dropping Time Series Set " << iarg1 << ":" << t->getName() << "." << endl;

                killdb(iarg1);

                break;

            case _RAND_TSS:
                in >> iarg1 >> iarg2 >> iarg3;

                getout() << "Generating random Time Series Set with N=" << iarg1 << ", L=" << iarg2 << ", and range=" << iarg3 << "." << endl;

                res = randdb(iarg3, iarg1, iarg2);
                if (res != -1)
                    getout() << "Dataset successfully loaded. Index: " << res << endl;
                else
                    getout() << "Failed to load dataset." << endl;

                break;

            case _LIST_TSS:

                res = printdbs();

                break;

            case _NORM_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Normalizing Time Series Set " << iarg1 << ":" << t->getName() << "." << endl;

                t->normalize();

                break;

            case _KSIM_TSS:
                in >> iarg1 >> iarg2 >> iarg3 >> iarg4 >> iarg5 >> iarg6;

                checkIndex(iarg1);
                checkIndex(iarg2);
        //        getout() << "Searching similar sequences for Time Series Set " << iarg1 << ":" << t->getName();
          //      getout() << ", query string at " << iarg3 << " in dataset " << iarg2 << ":" << t->getName();
            //    getout() << " in interval [" << iarg4 << "," << iarg5 << "] with strategy="
              //       << iarg6 << "." << endl;

                best = similar(iarg1, iarg2, iarg3, TimeInterval(iarg4, iarg5), iarg6);
                getout() << "Distance: " << best.dist << endl;
                printint(iarg1, best.seq, best.interval);

                break;

            case _TSS_DIST:
                in >> iarg1 >> iarg2 >> iarg3 >> iarg4;
                in >> iarg5 >> iarg6 >> iarg7 >> iarg8;
                in >> sarg1;

                checkIndex(iarg1);
                checkIndex(iarg5);

                metric = getDistMetric(sarg1.c_str());
                if (metric == NULL) {
                    getout() << "Unknown method: " << sarg1.c_str() << endl;
                    res = -1;
                    break;
                }
                getout() << "Using distance metric " << metric->name << " to find distance:" << endl;
                getout() << "A: DB:" << iarg1 << ", " << iarg2 << "@[" << iarg3 << "," << iarg4 << "]." << endl;
                getout() << "B: DB:" << iarg5 << ", " << iarg6 << "@[" << iarg7 << "," << iarg8 << "]." << endl;
                getout() << "Distance: " << findDist(iarg1, iarg5,
                                                      iarg2, iarg6,
                                                      TimeInterval(iarg3, iarg4), TimeInterval(iarg7, iarg8),
                                                      metric) << endl;

                break;

            case _LS_DIST:

                printDistMetrics();

                break;

            case _GROUP_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];

           //     getout() << "Generating new grouping for Time Series Set "
                //     << iarg1 << ":" << t->getName() << " with ST " << defaultST << "." << endl;

                res = initdbgroups(iarg1, defaultST);
                printf("Needed %d groups in total.\n", res);

                break;

            case _GROUP_ST_TSS:
                in >> iarg1;
                in >> darg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
          //      getout() << "Generating new grouping for Time Series Set "
           //          << iarg1 << ":" << t->getName() << " with ST " << darg1 << "." << endl;

                res = initdbgroups(iarg1, darg1);

                break;

            case _LOAD_GROUP_TSS:
                in >> iarg1;
                in >> sarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Loading grouping data for Time Series Set "
                     << iarg1 << ":" << t->getName() << " at " << sarg1 << "." << endl;

                res = loaddbgroups(iarg1, sarg1.c_str());

                break;

            case _SAVE_GROUP_TSS:
                in >> iarg1;
                in >> sarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Saving grouping data for Time Series Set "
                     << iarg1 << ":" << t->getName() << " to " << sarg1 << "." << endl;

                res = savedbgroups(iarg1, sarg1.c_str());

                break;

            case _DROP_GROUP_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                t = datasets[iarg1];
                getout() << "Dropping grouping data for Time Series Set "
                     << iarg1 << ":" << t->getName() << "." << endl;

                res = killdbgroups(iarg1);

                break;

            case _DESC_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                res = descdb(iarg1);

                break;

            case _PRINT_TSS:
                in >> iarg1;

                checkIndex(iarg1);
                res = printdb(iarg1);

                break;

            case _PRINT_INTERVAL:
                in >> iarg1 >> iarg2 >> iarg3 >> iarg4;

                checkIndex(iarg1);
                res = printint(iarg1, iarg2, TimeInterval(iarg3, iarg4));

                break;

            case _SET_DEF_ST:
                in >> darg1;

                getout() << "Setting default ST to " << darg1 << "." << endl;

                res = setST(darg1);

                break;

            case _GET_DEF_ST:
                getout() << "default ST = " << getST() << "." << endl;

                break;

            case _SET_DEF_R:
                in >> iarg1;

                getout() << "Setting default R constraint to " << iarg1 << "." << endl;

                res = setR(iarg1);

                break;

            case _GET_DEF_R:
                getout() << "default R = " << getR() << "." << endl;

                break;
            }

        } catch (exception &e) {
            getout() << "Caught exception attempting operation:" << endl;
            getout() << e.what() << endl;
        }

        time = clock() - time;
        getout() << "Command used " << ((float)time/CLOCKS_PER_SEC) << " seconds." << endl << endl;

        count++;
    }

    return 0;
}

// void OnlineSession::dominantOutlier(int dbindex, TimeInterval interval)
// {
//     if (groupings[dbindex] == NULL)
//         genGrouping(dbindex, defaultST);
//     TimeSeriesGrouping *gp = groupings[dbindex];
//     TimeSeriesSliceGrouping &sgp = gp->getGroup(interval);

//     unsigned int i = 0;
//     for (i = 0; i < sgp.groups.size(); i++) {
//         if (sgp.centroidTotalDiffs[i] == sgp.maxDiff) {
//             if (sgp.groups[i]->count == 1) {
//                 break;
//             }
//         }
//     }

//     if (i == sgp.groups.size()) {
//         cerr << "Failed to find an outlier: The farthest group has more than one member." << endl;
//         return;
//     }

//     for (unsigned int j = 0; j < sgp.groups.size(); j++) {
//         if (sgp.groups[i]->isMember(j))
//             cout << "Dominant outlier found: Group " << j << "." << endl;
//     }

//     return;
// }
