#ifndef TIMESERIES_H
#define TIMESERIES_H


#include <iostream>
#include <stdlib.h>


// Use doubles for time series data, set INF=1e20.
#define INF 1e20
typedef double seqitem_t;


struct SeriesDistanceMetric;
struct TimeInterval;
class TimeSeriesInterval;
class TimeSeriesSet;


//// Distance metrics.
struct SeriesDistanceMetric
{
    // For pretty printing.
    const char *name;
    const char *desc;

    // Find the distance betwee two intervals.
    seqitem_t (*run)(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout);

    // Because initialization is bothersome.
    SeriesDistanceMetric(const char *name,
                         const char *desc,
                         seqitem_t (*run)(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout));
};

// Available distance metrics.
extern SeriesDistanceMetric dtw_lp1_dist; // DTW based, lp<n> norm of warp path.
extern SeriesDistanceMetric dtw_lp2_dist;
extern SeriesDistanceMetric dtw_lpinf_dist; // Infinite power (chebyshev/max distance.)

extern SeriesDistanceMetric dtw_lp1_norm_dist; // Same, but normalized by 1/max(a.length, b.length)^(1/n).
extern SeriesDistanceMetric dtw_lp2_norm_dist;

extern SeriesDistanceMetric lp1_dist; // lp1 norm of b-a. (note: a.length == b.length)
extern SeriesDistanceMetric lp2_dist; // l2 norm of b-a.
extern SeriesDistanceMetric lpinf_dist; // Infinite power.

extern SeriesDistanceMetric lp1_norm_dist; // Same, but normalized by by 1/a.length^(1/n).
extern SeriesDistanceMetric lp2_norm_dist;

extern SeriesDistanceMetric *availableDistMetrics[]; // List of available distance methods. NULL terminated.

SeriesDistanceMetric *getDistMetric(const char *name);
void printDistMetrics(void);


//// Time interval [a,b].
struct TimeInterval
{
    int start;
    int end;

    TimeInterval(int start=0, int end=0);

    TimeInterval subinterval(TimeInterval other);
    int length(void);
};



//// Reference to a slice of a timeseries.
class TimeSeriesInterval
{
protected:

    seqitem_t *data;

    int seqNum;
    TimeInterval interval;

public:

    TimeSeriesInterval(TimeSeriesSet *dataset, int seqNum, TimeInterval interval);
    TimeSeriesInterval(seqitem_t *data, TimeInterval interval);
    ~TimeSeriesInterval(void);

    int length(void);

    seqitem_t &operator[](int index); // Get a reference to a part of the index.
    seqitem_t *getData(int index = 0); // Get an actual pointer to the data.
    TimeSeriesInterval subinterval(TimeInterval interval); // Get a slice of this interval.

    seqitem_t dist(TimeSeriesInterval &other, SeriesDistanceMetric *dist=&lp2_norm_dist, seqitem_t dropout=INF);
};



//// Time series database.
class TimeSeriesSet
{
protected:

    seqitem_t *data;
    int seqCount, seqLength;

    seqitem_t min, max;

    char *name;

public:

    TimeSeriesSet(int seqCount, int seqLength, seqitem_t *data=NULL);
    ~TimeSeriesSet(void);

    TimeSeriesSet(const char *path);
    TimeSeriesSet(const char *path, int seqCount, int seqLength, int drop=0);
    int toFile(const char *path, bool addSize=true);

    static TimeSeriesSet &randomSet(int seqCount=100, int seqLength=800, int range=100);

    bool valid(void); // Was there an issue with loading?

    // Basics.
    int getSeqCount(void);
    int getSeqLength(void);

    // Querying data.
    TimeSeriesInterval getInterval(int seqNum, TimeInterval interval);
    seqitem_t &getData(int seqNum, int seqIndex);
    seqitem_t *getRawData(int seqNum, int seqIndex);

    // Modifying operations.
    void normalize(void);
    void zero(void);
    void recalcMinMax(void);

    // Debugging.
    void printDesc(std::ostream &out);
    void printInterval(std::ostream &out, int seq, TimeInterval interval);
    void printData(std::ostream &out);

    const char *getName(void);
};


#endif // TIMESERIES_H
