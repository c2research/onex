#include "TimeSeries.h"

#include <algorithm>
#include <iostream>
#include <fstream>
#include <vector>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>


using namespace std;

SeriesDistanceMetric::SeriesDistanceMetric(const char *name,
                                           const char *desc,
                                           seqitem_t (*run)(TimeSeriesInterval &a,
                                                          TimeSeriesInterval &b, seqitem_t dropout),
                                           warping_path_t (*getWarpingPath)(TimeSeriesInterval &a, TimeSeriesInterval &b))
{
    this->name = name;
    this->desc = desc;
    this->run = run;
    this->getWarpingPath = getWarpingPath;
}

static inline seqitem_t _abs(seqitem_t a)
{
    return (a > 0)? a : -a;
}

static inline bool _sameLength(TimeSeriesInterval &a, TimeSeriesInterval &b)
{
    if (a.length() != b.length()) {
        fprintf(stderr, "Attempted to get lp norm of two intervals of unequal length.\n");
        return false;
    }

    return true;
}

seqitem_t _lp1_dist(seqitem_t a, seqitem_t b)
{
    return _abs(b - a);
}
seqitem_t _lp2_dist(seqitem_t a, seqitem_t b)
{
    return (b - a) * (b - a);
}

seqitem_t _sum_pull(seqitem_t a, seqitem_t b)
{
    return a + b;
}

seqitem_t _max_pull(seqitem_t a, seqitem_t b)
{
    return std::max(a, b);
}

seqitem_t _basic_dtw(TimeSeriesInterval &a, TimeSeriesInterval &b,
                     seqitem_t (*distFunc)(seqitem_t, seqitem_t),
                     seqitem_t (*pullFunc)(seqitem_t, seqitem_t),
                     seqitem_t dropout=INF,
                     warping_path_t *warping_path=NULL)
                     //int *warps = NULL)
{
    int m = a.length();
    int n = b.length();

    // Fastpath for baseintervals.
    if (m == 1 && n == 1)
        return distFunc(a[0],b[0]);

    // create cost matrix
    seqitem_t cost[m][n];
    auto trace = new pair<seqitem_t, seqitem_t>*[m]; // For tracing warping
    for (int i = 0; i < m; i++) {
        trace[i] = new pair<seqitem_t, seqitem_t>[n];
    }
    int warpcount = 0; // Count warpings

    cost[0][0] = distFunc(a[0], b[0]);
    trace[0][0] = make_pair(-1, -1);

    // calculate first column
    for(int i = 1; i < m; i++) {
        cost[i][0] = pullFunc(cost[i-1][0], distFunc(a[i], b[0]));
        trace[i][0] = make_pair(i - 1, 0);
    }

    // calculate first row
    for(int j = 1; j < n; j++) {
        cost[0][j] = pullFunc(cost[0][j-1], distFunc(a[0], b[j]));
        trace[0][j] = make_pair(0, j - 1);
    }

    // fill matrix. If using dropout, keep tabs on min cost per row.
    if (dropout != INF) {

        for(int i = 1; i < m; i++) {

            seqitem_t min = cost[i][0];

            for(int j = 1; j < n; j++) {
                seqitem_t mp = std::min(cost[i-1][j],
                                     std::min(cost[i][j-1],
                                              cost[i-1][j-1]));
                if (mp != cost[i-1][j-1])
                    warpcount++;

                cost[i][j] = pullFunc(distFunc(a[i],b[j]), mp);

                min = std::min(min, cost[i][j]);
            }

            if (min > dropout) // Short circuit calculation.
            {
                for (int i = 0; i < m; i++) {
                    delete trace[i];
                }
                delete[] trace;
                return INF;
            }
        }

    } else {

        for(int i = 1; i < m; i++) {
            for(int j = 1; j < n; j++) {
                if (warping_path != NULL) {
                    vector<seqitem_t> tmp;
                    tmp.push_back(cost[i - 1][j]);
                    tmp.push_back(cost[i][j - 1]);
                    tmp.push_back(cost[i - 1][j - 1]);

                    auto mpe = min_element(tmp.begin(), tmp.end());
                    if (mpe == tmp.begin()) {
                        trace[i][j] = make_pair(i - 1, j);
                    }
                    else if (mpe == tmp.begin() + 1) {
                        trace[i][j] = make_pair(i, j - 1);
                    }
                    else if (mpe == tmp.begin() + 2) {
                        trace[i][j] = make_pair(i - 1, j - 1);
                    }
                }

                seqitem_t mp = std::min(cost[i-1][j],
                                        std::min(cost[i][j-1],
                                                 cost[i-1][j-1]));
                if (mp != cost[i-1][j-1])
                    warpcount++;

                cost[i][j] = pullFunc(distFunc(a[i],b[j]), mp);
            }
        }
    }

    if (warping_path != NULL) {
        int i = m - 1, j = n - 1;
        while (i != -1) {
            warping_path->push_back(make_pair(i, j));
            int old_i = i, old_j = j;
            i = trace[old_i][old_j].first;
            j = trace[old_i][old_j].second;
        }
    }

    // if (warps != NULL)
    //     *warps = warpcount;

    for (int i = 0; i < m; i++) {
        delete trace[i];
    }
    delete[] trace;

    return cost[m-1][n-1];
}

seqitem_t _dtw_lp1(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout=INF)
{
    return _basic_dtw(a, b, _lp1_dist, _sum_pull, dropout);
}

warping_path_t _dtw_lp1_wp(TimeSeriesInterval &a, TimeSeriesInterval &b) 
{
    warping_path_t path;
    _basic_dtw(a, b, _lp1_dist, _sum_pull, INF, &path);
    return path;
}

seqitem_t _dtw_lp2(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout=INF)
{
    return sqrt(_basic_dtw(a, b, _lp2_dist, _sum_pull, dropout));
}

warping_path_t _dtw_lp2_wp(TimeSeriesInterval &a, TimeSeriesInterval &b) 
{
    warping_path_t path;
    _basic_dtw(a, b, _lp2_dist, _sum_pull, INF, &path);
    return path;
}

seqitem_t _dtw_lpinf(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout=INF)
{
    return _basic_dtw(a, b, _lp1_dist, _max_pull, dropout);
}

warping_path_t _dtw_lpinf_wp(TimeSeriesInterval &a, TimeSeriesInterval &b) 
{
    warping_path_t path;
    _basic_dtw(a, b, _lp1_dist, _max_pull, INF, &path);
    return path;
}

seqitem_t _dtw_lp1_norm(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout=INF)
{
    seqitem_t len = max(a.length(), b.length());

    // Correct dropout for normalization.
    if (dropout != INF)
        dropout = dropout * len;

    return _basic_dtw(a, b, _lp1_dist, _sum_pull, dropout)/len;
}

warping_path_t _dtw_lp1_norm_wp(TimeSeriesInterval &a, TimeSeriesInterval &b) 
{
    warping_path_t path;
    _basic_dtw(a, b, _lp1_dist, _sum_pull, INF, &path);
    return path;
}

seqitem_t _dtw_lp2_norm(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout=INF)
{
    seqitem_t len = max(a.length(), b.length());

    // Correct dropout for normalization and sqrt.
    if (dropout != INF)
        dropout = dropout*dropout * len;

    return sqrt(_basic_dtw(a, b, _lp2_dist, _sum_pull, dropout)/len);
}

warping_path_t _dtw_lp2_norm_wp(TimeSeriesInterval &a, TimeSeriesInterval &b) 
{
    warping_path_t path;
    _basic_dtw(a, b, _lp2_dist, _sum_pull, INF, &path);
    return path;
}

seqitem_t _lp1(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout)
{
    if (!_sameLength(a, b))
        return INF;

    int len = a.length();

    seqitem_t sum = 0.0;
    for (int i = 0; i < len; i++) {

        sum += _abs(b[i] - a[i]);

        if (sum > dropout)
            return INF;
    }

    return sum;
}

seqitem_t _lp1_norm(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout)
{
    seqitem_t max = std::max(a.length(), b.length());

    // Correct dropout for normalization.
    if (dropout != INF)
        dropout = dropout * max;

    return _lp1(a,b, dropout)/max;
}

seqitem_t _lp2(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout)
{
    if (!_sameLength(a, b))
        return INF;

    int len = a.length();

    if (dropout != INF)
        dropout = dropout * dropout;

    seqitem_t sum = 0.0;
    for (int i = 0; i < len; i++) {

        seqitem_t dist = (b[i] - a[i]);
        sum += dist * dist;

        if (sum > dropout)
            return INF;
    }

    return sqrt(sum);
}

seqitem_t _lp2_norm(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout)
{
    seqitem_t smax = sqrt(std::max(a.length(), b.length()) - 1);

    // Correct for normalization.
    if (dropout != INF)
        dropout = dropout * smax;

    return _lp2(a, b, dropout)/smax;
}

seqitem_t _lpinf(TimeSeriesInterval &a, TimeSeriesInterval &b, seqitem_t dropout)
{
    if (!_sameLength(a, b))
        return INF;

    int len = a.length();

    seqitem_t max = -INF;
    for (int i = 0; i < len; i++) {

        max = std::max(_abs(b[i] - a[i]), max);

        if (max > dropout)
            return INF;
    }

    return max;
}

SeriesDistanceMetric dtw_lp1_dist = SeriesDistanceMetric(
    "dtw_lp1",
    "DTW distance between vectors using lp1 distance.",
    _dtw_lp1,
    _dtw_lp1_wp
);

SeriesDistanceMetric dtw_lp2_dist = SeriesDistanceMetric(
    "dtw_lp2",
    "DTW distance between vectors using euclidean distance.",
    _dtw_lp2,
    _dtw_lp2_wp
);

SeriesDistanceMetric dtw_lpinf_dist = SeriesDistanceMetric(
    "dtw_lpinf",
    "DTW distance between vectors using max / lpinf distance.",
    _dtw_lpinf,
    _dtw_lpinf_wp
);

SeriesDistanceMetric dtw_lp1_norm_dist = SeriesDistanceMetric(
    "dtw_lp1_norm",
    "DTW distance between vectors using taxicab distance, normalized by max length.",
    _dtw_lp1_norm,
    _dtw_lp1_norm_wp
);

SeriesDistanceMetric dtw_lp2_norm_dist = SeriesDistanceMetric(
    "dtw_lp2_norm",
    "DTW distance between vectors using squared distance, normalized by max length.",
    _dtw_lp2_norm,
    _dtw_lp2_norm_wp
);

SeriesDistanceMetric lp1_dist = SeriesDistanceMetric(
    "taxicab",
    "Taxicab (lp1) distance between vectors.",
    _lp1
);

SeriesDistanceMetric lp2_dist = SeriesDistanceMetric(
    "euclidean",
    "Euclidean (lp2) distance between vectors.",
    _lp2
);

SeriesDistanceMetric lpinf_dist = SeriesDistanceMetric(
    "chebyshev",
    "Chebyshev (lpinf) distance between vectors.",
    _lpinf
);

SeriesDistanceMetric lp1_norm_dist = SeriesDistanceMetric(
    "taxicab_norm",
    "Taxicab (lp1) distance between vectors, normalized by length.",
    _lp1_norm
);

SeriesDistanceMetric lp2_norm_dist = SeriesDistanceMetric(
    "euclidean_norm",
    "Euclidean (lp2) distance between vectors, normalized by length.",
    _lp2_norm
);

SeriesDistanceMetric lp_norm_dist = SeriesDistanceMetric(
    "euclidean_norm",
    "Euclidean (lp2) distance between vectors, normalized by sqrt(length).",
    _lp2_norm
);

SeriesDistanceMetric *availableDistMetrics[10] = {
    &dtw_lp1_dist,
    &dtw_lp2_dist,
    &dtw_lpinf_dist,

    &dtw_lp1_norm_dist,
    &dtw_lp2_norm_dist,

    &lp1_dist,
    &lp2_dist,

    &lp1_norm_dist,
    &lp2_norm_dist,
    NULL
};

SeriesDistanceMetric *getDistMetric(const char *name)
{
    SeriesDistanceMetric **t;
    for (t = availableDistMetrics; *t != NULL; t++)
        if (!strcmp((*t)->name, name))
            return *t;

    return NULL;
}

void printDistMetrics(void)
{
    printf("Available distance metrics:\n");

    for (int i = 0; availableDistMetrics[i] != NULL; i++) {
        SeriesDistanceMetric *t = availableDistMetrics[i];
        printf("[%d] '%20s': %s\n", i, t->name, t->desc);
    }
}

TimeInterval::TimeInterval(int start, int end)
{
    this->start = start;
    this->end = end;
}

TimeInterval TimeInterval::subinterval(TimeInterval other)
{
    int s = start + other.start;
    int e = start + other.end;

    return TimeInterval(s, e);
}

int TimeInterval::length(void)
{
    return end - start + 1;
}


TimeSeriesInterval::TimeSeriesInterval(TimeSeriesSet *dataset, int seqNum, TimeInterval interval)
{
    this->interval = interval;
    this->seqNum = seqNum;

    data = dataset->getRawData(seqNum, interval.start);
}

TimeSeriesInterval::TimeSeriesInterval(seqitem_t *data , TimeInterval interval)
{
    this->interval = interval;
    this->seqNum = 0;

    this->data = data;
}

TimeSeriesInterval::~TimeSeriesInterval(void) {}

seqitem_t &TimeSeriesInterval::operator[](int index)
{
    return data[index];
}

seqitem_t *TimeSeriesInterval::getData(int index)
{
    return &data[index];
}

int TimeSeriesInterval::length(void)
{
    return interval.length();
}

TimeSeriesInterval TimeSeriesInterval::subinterval(TimeInterval interval)
{
    TimeInterval t = this->interval.subinterval(interval);
    return TimeSeriesInterval(data, t);
}


seqitem_t TimeSeriesInterval::dist(TimeSeriesInterval &other, SeriesDistanceMetric *dist, seqitem_t dropout)
{
    return dist->run(*this, other, dropout);
}

TimeSeriesSet::TimeSeriesSet(int seqCount, int seqLength, seqitem_t *data)
{
    this->seqCount = seqCount;
    this->seqLength = seqLength;

    int dataSize = seqCount * seqLength;

    if (data == NULL)
        this->data = (seqitem_t*) calloc(dataSize, sizeof(seqitem_t));
    else
        this->data = data;

    this->name = strdup("<memory>");
}

TimeSeriesSet::TimeSeriesSet(const char *path)
{
    ifstream in(path);
    data = NULL;
    name = NULL;
    if (!in.is_open()) {
        fprintf(stderr, "Failed to open file for reading: %s.\n", path);
        seqCount = seqLength = min = max = 0;
        data = NULL;
        return;
    }

    in >> seqCount >> seqLength;
    if (seqCount <= 0 || seqLength <= 0) {
        fprintf(stderr, "Failed to read file %s: Given invalid sequence count or length.\n", path);
        seqCount = seqLength = min = max = 0;
        data = NULL;
        return;
    }

    data = (seqitem_t*) calloc(seqLength * seqCount, sizeof(seqitem_t));

    if (data == NULL) {
        fprintf(stderr, "Failed to read file %s: Insufficient memory.\n", path);
        seqCount = seqLength = min = max = 0;
        return;
    }

    seqitem_t minItem = INF, maxItem = -INF;
    seqitem_t t;
    for (int s = 0; s < seqCount; s++) {
        for (int i = 0; i < seqLength; i++) {
            in >> t;
            maxItem = std::max(maxItem, t);
            minItem = std::min(minItem, t);
            data[s*seqLength + i] = t;
        }
    }
    min = minItem;
    max = maxItem;

    name = strdup(path);

    in.close();
}

TimeSeriesSet::TimeSeriesSet(const char *path, int seqCount, int seqLength, int drop)
{
    ifstream in(path);

    if (!in.is_open()) {
        fprintf(stderr, "Failed to open file for reading: %s.\n", path);
        seqCount = seqLength = min = max = 0;
        data = NULL;
        return;
    }

    this->seqLength = seqLength;
    this->seqCount = seqCount;

    data = (seqitem_t*) calloc(seqLength * seqCount, sizeof(seqitem_t));

    if (data == NULL) {
        fprintf(stderr, "Failed to read file %s: Insufficient memory.\n", path);
        seqCount = seqLength = min = max = 0;
        return;
    }

    seqitem_t minItem = INF, maxItem = -INF;
    seqitem_t t;
    for (int s = 0; s < seqCount; s++) {
        for (int i = 0; i < drop; i++) in >> t;
        for (int i = 0; i < seqLength; i++) {
            in >> t;
            maxItem = std::max(maxItem, t);
            minItem = std::min(minItem, t);
            data[s*seqLength + i] = t;
        }
    }
    min = minItem;
    max = maxItem;

    name = strdup(path);

    in.close();
}

int TimeSeriesSet::toFile(const char *path, bool addSize)
{
    ofstream out(path);

    if (!out.is_open()) {
        fprintf(stderr, "Failed to open file for writing: %s.\n", path);
        return -1;
    }

    if (addSize) {
        out << seqCount << " ";
        out << seqLength << " ";
        out << std::endl;
    }

    for (int s = 0; s < seqCount; s++) {
        for (int i = 0; i < seqLength; i++) {
            out << data[s*seqLength + i] << " ";
        }
        out << std::endl;
    }

    out.close();

    return 0;
}

TimeSeriesSet::~TimeSeriesSet(void)
{
    if (data != NULL)
        free(data);

    if (name != NULL)
        free(name);
}

TimeSeriesSet &TimeSeriesSet::randomSet(int seqCount, int seqLength, int range)
{
    int size = seqCount * seqLength;

    seqitem_t *data = (seqitem_t*) calloc(size, sizeof(seqitem_t));

    if (data == NULL) {
        fprintf(stderr, "Failed to generate dataset: Insufficient memory.\n");
        return *(new TimeSeriesSet(seqCount, seqLength, NULL));
    }

    for (int i = 0; i < size; i++)
        data[i] = (rand() % range) + 1;

    TimeSeriesSet *t = new TimeSeriesSet(seqCount, seqLength, data);
    t->recalcMinMax();
    t->name = strdup("<random>");

    return *t;
}


bool TimeSeriesSet::valid(void)
{
    return data != NULL;
}

int TimeSeriesSet::getSeqCount(void)
{
    return seqCount;
}

int TimeSeriesSet::getSeqLength(void)
{
    return seqLength;
}

TimeSeriesInterval TimeSeriesSet::getInterval(int seqNum, TimeInterval interval)
{
    return TimeSeriesInterval(this, seqNum, interval);
}

void TimeSeriesSet::zero(void)
{
    for (int i = 0; i < seqCount * seqLength; i++)
        data[i] = 0.0;

    min = max = 0;
}

void TimeSeriesSet::normalize(void)
{
    seqitem_t diff = max - min;

    if (diff == 0.0) {
        if (max == 0)
            return;
        else
            zero();
    }

    for (int i = 0; i < seqCount * seqLength; i++)
        data[i] = (data[i] - min)/diff;

    min = 0.0;
    max = 1.0;
}

void TimeSeriesSet::recalcMinMax(void)
{
    seqitem_t minItem = INF;
    seqitem_t maxItem = -INF;

    for (int i = 0; i < seqCount * seqLength; i++) {
        minItem = std::min(minItem, data[i]);
        maxItem = std::max(maxItem, data[i]);
    }

    this->min = minItem;
    this->max = maxItem;
}

seqitem_t *TimeSeriesSet::getRawData(int seqNum, int seqIndex)
{
    return &data[(seqNum * seqLength) + seqIndex];
}

seqitem_t &TimeSeriesSet::getData(int seqNum, int seqIndex)
{
    return data[(seqNum * seqLength) + seqIndex];
}


void TimeSeriesSet::printDesc(ostream &out)
{
    out << "Time series set:" << endl;
    out << "Name: '" << name << "'" << endl;
    out << "Sequences: " << seqCount << endl;
    out << "Sequence length: " << seqLength << endl;
    out << "Min / max values: " << min << ", " << max << endl;
}

void TimeSeriesSet::printData(ostream &out)
{
    /*int w, p;
    w = out.width();
    p = out.precision();
    out << "Printing time series set '" << name;
    out << "' with " << seqCount <<" sequences of length " << seqLength << ":";

    for (int s = 0; s < seqCount; s++) {
        out << endl << "Sequence[" << s << "]:";
        for (int i = 0; i < seqLength; i++) {
            out << " ";
            out.width(6);
            out.precision(4);
            out << data[(s * seqLength) + i];
            out.width(w);
            out.precision(p);
        }
    }
    out << endl << "End of series set." << endl;
    */
}

void TimeSeriesSet::printInterval(ostream &out, int seq, TimeInterval interval)
{
    /*int w, p;
    w = out.width();
    p = out.precision();
    out << "Printing time series interval " << seq << "@[" << interval.start << "," << interval.end << "]." << endl;

    out.width(10);
    out.precision(8);

    out << "[";
    for (int i = interval.start; i < interval.end + 1; i++) {
        out << " ";
        out << data[(seq * seqLength) + i];
    }
    out << " ]" << endl;

    out.width(w);
    out.precision(p);

    out << "End of interval." << endl;
*/
}

const char *TimeSeriesSet::getName(void)
{
    return name;
}
