#ifndef GROUPING_H
#define GROUPING_H

#include "TimeSeries.h"
#include <vector>
#include <stdint.h>

using namespace std;

struct kBest
{
    int seq;
    TimeInterval interval;

    seqitem_t dist;

    bool operator<(kBest &other)
    {
        return dist < other.dist;
    }

    void min(kBest &other)
    {
        if ((other.dist < dist) || (dist == INF)) {
            seq = other.seq;
            interval = other.interval;
            dist = other.dist;
        }
    }

};

// A centroid for a time series interval. Efficient centroid calculation.
class TimeSeriesCentroid
{
protected:

    int length, count;
    vector<seqitem_t> sum;

    bool cacheValid;
    vector<seqitem_t> cachedCentroid;

public:

    TimeSeriesCentroid(int length);
    TimeSeriesCentroid(vector<seqitem_t> &centroid, int count);

    int getLength(void);
    int getCount(void);

    void addVector(const vector<seqitem_t> data);
    void addArray(const seqitem_t *data);

    vector<seqitem_t> &getCentroid(void);
};

// Implements trillionDTW style cascading lower bounds comparison. See README for references.
class TimeSeriesIntervalEnvelope
{
protected:

    bool kimfl_cache_valid;
    seqitem_t kimfl_f, kimfl_l, kimfl_min, kimfl_max;
    void genKimFL(void);

    bool keogh_cache_valid;
    vector<seqitem_t> keogh_lower, keogh_upper;
    void genKeoghLU(int r=5);
public:

    TimeSeriesInterval interval;

    TimeSeriesIntervalEnvelope(void):interval(NULL,TimeInterval()){}
    TimeSeriesIntervalEnvelope(TimeSeriesInterval interval);

    void setInterval(TimeSeriesInterval interval);

    vector<seqitem_t> &getKeoghLower(void);
    vector<seqitem_t> &getKeoghUpper(void);

    void genCaches(int r=5);

    seqitem_t kimFLDist(TimeSeriesIntervalEnvelope &other, double dropout=INF);
    seqitem_t keoghDist(TimeSeriesIntervalEnvelope &other, int warps=5, double dropout=INF);
    seqitem_t crossKeoghDist(TimeSeriesIntervalEnvelope &other, int warps=5, double dropout=INF);
    seqitem_t cascadeDist(TimeSeriesIntervalEnvelope &other, int warps=5, double dropout=INF);


};

// A group of similar TimeSeriesIntervals from a database, all of the same length.
class TimeSeriesGroup
{
protected:

    TimeSeriesSet *dataset;
    int length, perSeq;

    int count;
    vector<bool> members;

    TimeSeriesCentroid centroid;

    bool envelopeCacheValid;
    TimeSeriesIntervalEnvelope cachedEnvelope;

public:

    TimeSeriesGroup(TimeSeriesSet *dataset, int length);
    ~TimeSeriesGroup(void);

    void toFile(ostream &out);
    void fromFile(istream &in);

    void addMember(int seq, int start, bool update=true);
    bool isMember(int seq, int start);

    // From centroid.
    seqitem_t distance(vector<seqitem_t> &data, SeriesDistanceMetric *metric=&lp2_norm_dist, seqitem_t dropout=INF);
    seqitem_t distance(int len, seqitem_t *data, SeriesDistanceMetric *metric=&lp2_norm_dist, seqitem_t dropout=INF);

    int getCount(void);

    TimeSeriesIntervalEnvelope &getEnvelope(void);
    void genEnvelope(void);

    // primary similarity functions
    kBest getBestMatch(TimeSeriesIntervalEnvelope query, int warps=-1, double dropout=INF);
    kBest getBestDistinctMatch(TimeSeriesIntervalEnvelope query, int warps=-1, double dropout=INF, int qSeq=-1);
    vector<kBest> getSeasonal(int);

    vector<seqitem_t> &getCentroid(void);
};


// A complete (disjoint) grouping for a TimeSeriesSet's subsequences of a set length.
class TimeSeriesGrouping
{
protected:

    TimeSeriesSet *dataset;
    int length, perSeq;

    vector<TimeSeriesGroup*> groups;

    /*
    void updateDiffs(void);

    bool diffCacheValid;
    vector<seqitem_t> cachedDiffs;
    seqitem_t cachedMaxDiff;
    */

public:

    TimeSeriesGrouping(TimeSeriesSet *dataset, int length);
    ~TimeSeriesGrouping(void);

    void toFile(ostream &out);
    void fromFile(istream &in);

    TimeSeriesGroup *getGroup(int index);
    vector<TimeSeriesGroup*> getGroups();

    int getCount(void);

    void genGroups(seqitem_t ST=0.5);
    void clearGroups(void);

    void genEnvelopes(void);

    int getBestGroup(TimeSeriesIntervalEnvelope query, seqitem_t *dist=NULL, int warps=-1, double dropout=INF);
    vector< vector<kBest> > getSeasonal(int);
};

// Strategy when searching for similar representatives.
// Hitting good best-so-fars early go a long way in faster queries.
enum SearchStrategy
{
    EINTERMIX     = 0, // Start at same length, check 1up, check 1down, check 2up, ....
    EHIGHER_LOWER = 1, // Start at same length, check 1up, 2up, ..., check 1down, 2down, ...
    ELOWER_HIGHER = 2, // Start at same length, check 1down, 2down, ..., check 1up, 2up, ...
    EBOTTOM_TOP   = 3, // Start at bottom, search up.
    ETOP_BOTTOM   = 4, // Start at top, search down.
    ESEARCH_STRAT_LEN
};

int *genOrder(SearchStrategy strat, int top, int bottom, int center);

// A grouping for every subinterval in a database. (All lengths are grouped.)
class TimeSeriesSetGrouping
{
protected:

    TimeSeriesSet *dataset;
    seqitem_t ST;

    vector<TimeSeriesGrouping*> groups;

public:

    TimeSeriesSetGrouping(TimeSeriesSet *database, seqitem_t ST=0.5);
    ~TimeSeriesSetGrouping(void);

    void reset(void);

    int fromFile(const char *path);
    int toFile(const char *path);

    bool valid(void); // Are we group'd?

    TimeSeriesGrouping *getGroup(int length);
    TimeSeriesGrouping *getFullGroup();

    seqitem_t getST(void);
    void setST(seqitem_t ST);

    int group(void);
    void genEnvelopes(void);

    kBest getBestDistinctInterval(int len,
                                 seqitem_t *data,
                                 SearchStrategy strat=EHIGHER_LOWER,
                                 int warps=-1,
                                 int qSeq=-1);
    kBest getBestInterval(int len, seqitem_t *data, SearchStrategy strat=EHIGHER_LOWER, int warps=-1);
};

#endif // GROUPING_H
