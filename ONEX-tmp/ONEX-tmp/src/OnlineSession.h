#ifndef ONLINESESSION_H
#define ONLINESESSION_H

#include "TimeSeries.h"
#include "Grouping.h"

#include <map>
#include <string>
#include <iostream>
#include <vector>

using namespace std;

class OnlineSession;

class GroupableTimeSeriesSet
{
protected:

    TimeSeriesSet *dataset;
    TimeSeriesSetGrouping *grouping;
    OnlineSession *session;

public:

    GroupableTimeSeriesSet(OnlineSession *session, TimeSeriesSet *dataset=NULL, TimeSeriesSetGrouping *grouping=NULL);
    GroupableTimeSeriesSet(const GroupableTimeSeriesSet &other);
    ~GroupableTimeSeriesSet(void);

    void resetDB(void);

    bool valid();
    bool validGrouping();

    int dbFromFile(const char *path);
    int dbToFile(const char *path);

    int odbFromFile(const char *path, int seqCount, int seqLength, int del=0);
    int odbToFile(const char *path);

    int groupsToFile(const char *path);
    int groupsFromFile(const char *path);

    void normalize(void);

    void genGrouping(seqitem_t ST);
    void resetGrouping(void);

    void distance(int seq, TimeInterval interval,
                  GroupableTimeSeriesSet *other, int otherSeq, TimeInterval otherInt,
                  SeriesDistanceMetric *metric);
    void similar(GroupableTimeSeriesSet *other, int otherSeq, TimeInterval otherint,
                 SearchStrategy strat=EBOTTOM_TOP, int warps=-1);
    void outlier(int length);

    void printdb(void);
    void descdb(void);
    void printint(int seq, TimeInterval interval);
    const char *getName(void);
};

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
    int copydb(int index);
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

    // Distance metric and search related commands.
    int printdists(void);
    int printdist(int indexa, int indexb,
                  int seqa, int seqb,
                  TimeInterval inta, TimeInterval intb,
                  SeriesDistanceMetric *metric);

    int similar(int dbindex, int qindex, int qseq, TimeInterval qint, int strat=-1, int r=-1);
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
};

#endif // ONLINESESSION_H
