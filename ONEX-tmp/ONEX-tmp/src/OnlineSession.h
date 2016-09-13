#ifndef ONLINESESSION_H
#define ONLINESESSION_H

#include "TimeSeries.h"
#include "Grouping.h"
#include "GroupableTimeSeriesSet.h"

#include <map>
#include <string>
#include <iostream>
#include <vector>

using namespace std;

class OnlineSession
{
protected:

    vector<GroupableTimeSeriesSet*> datasets;

    ostream *out, *err;

    seqitem_t defaultST;
    int defaultR;

public:

    OnlineSession(double defaultST=0.2, int defaultR=2048, ostream *out=NULL, ostream *err=NULL);
    ~OnlineSession(void);

    /* Commands. They print to the out/error streams, and return a status. */

    // Database and group oriented commands.
    int randdb(int range, int seqCount, int seqLength);
    int killdb(int index);

    int loaddb(const char *path);
    int savedb(int index, const char *path);

    int loadolddb(const char *path, int seqCount, int seqLength, int newlineDrop);
    int saveolddb(int index, const char *path);

    int initdbgroups(int index, seqitem_t ST=-1);
    int killdbgroups(int index);
    int savedbgroups(int index, const char *path);
    int loaddbgroups(int index, const char *path);

    int getdbcount(void);
    GroupableTimeSeriesSet *getdb(int index);
    void checkIndex(int index);

    int printdbs(void);
    int printdb(int index);
    int descdb(int index);
    int printint(int index, int seq, TimeInterval interval);
    TimeSeriesInterval getinterval(int index, int seq, TimeInterval interval);

    // Distance metric and search related commands.
    int printdists(void);
    seqitem_t findDist(int indexa, int indexb,
                  int seqa, int seqb,
                  TimeInterval inta, TimeInterval intb,
                  SeriesDistanceMetric *metric);

    kBest similar(int dbindex, int qindex, int qseq, TimeInterval qint, int strat=-1, int r=-1);
    int outlier(int dbindex, int length);

    // Meta and other commands.
    int setST(seqitem_t ST);
    seqitem_t getST(void);

    int setR(int R);
    int getR(void);

    void setout(ostream &out);
    void seterr(ostream &err);

    ostream &getout(void);
    ostream &geterr(void);

    int run(istream &in, bool interactive=true);

private:
    int _insertDataset(GroupableTimeSeriesSet* db);
    int _datasetCount;
};

#endif // ONLINESESSION_H
