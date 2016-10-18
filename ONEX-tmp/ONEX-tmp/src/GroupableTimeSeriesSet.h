/**
 * \class GroupableTimeSeriesSet
 * \brief A set of groupable time series data.
 * 
 * This class is a wrapper of a set of time series data. It provides functions for 
 * grouping the subsequences in the dataset, and performing similarity searches 
 * on them.
 * 
 */
#ifndef GROUPABLETIMESRIESSET_H
#define GROUPABLETIMESRIESSET_H

#include "TimeSeries.h"
#include "Grouping.h"

class GroupableTimeSeriesSet
{
protected:

    TimeSeriesSet *dataset;
    TimeSeriesSetGrouping *grouping;

public:

    GroupableTimeSeriesSet(TimeSeriesSet *dataset=NULL, TimeSeriesSetGrouping *grouping=NULL);
    GroupableTimeSeriesSet(const GroupableTimeSeriesSet &other);
    ~GroupableTimeSeriesSet();

    int getSeqCount(void);
    int getSeqLength(void);

    /**
     * Clear all group and data in the dataset
     */
    void resetDB();

    /**
     * Check if this is a valid dataset.
     *
     * \return True if it is a valid dataset. False otherwise.
     */
    bool valid();

    /**
     * Check if this dataset has a valid grouping.
     *
     * \return True if has a valid grouping. False otherwise.
     */
    bool validGrouping();

    /**
     * Load dataset from a file into the current instance.
     *
     * \param path path to the file containing the dataset. 
     * \return 0 if the operation is successful, -1 otherwise.
     */
    int dbFromFile(const char *path);

    /**
     * Save current dataset to a file.
     *
     * \param path path of the 
     * \return 0 if the operation is successful, -1 otherwise.
     */   
    int dbToFile(const char *path);

    /**
     * Load dataset from a file with provided parameters.
     * 
     * \param seqCount number of sequences in the dataset.
     * \param seqLength length of each sequence in the dataset.
     * \del if set to 1, remove the first value of every row in the dataset.
     * \return 0 if the operation is successful, -1 otherwise.
     */
    int odbFromFile(const char *path, int seqCount, int seqLength, int del=0);

    /**
     * Save current dataset to a file.
     *
     * \param path path of the file containing the dataset.
     * \return 0 if the operation is successful, -1 otherwise.
     */   
    int odbToFile(const char *path);

   /**
     * Save current groups to a file.
     *
     * \param path path of the file containing the groups.
     * \return 0 if the operation is successful, -1 otherwise.
     */   
    int groupsToFile(const char *path);

    /**
     * Load groups from a file into the current instance.
     *
     * \param path path to the file containing the groups. 
     * \return 0 if the operation is successful, -1 otherwise.
     */
    int groupsFromFile(const char *path);

    /**
     * Normalize the dataset.
     */
    void normalize(void);

    /**
     * Group dataset using the provided Similarity Threshold.
     *
     * \param ST Similarity Threshold used in the grouping algorithm.
     * \return number of groups.
     */
    int genGrouping(seqitem_t ST);

    /**
     * Clear the groups.
     */
    void resetGrouping(void);

    /**
     * Calculate the distance between a subsequence of a series in this dataset to
     * a subsequence in another dataset using a certain distance metric.
     *
     * \param seq index of a sequence in this dataset.
     * \param interval an interval in the selected sequence.
     * \param other pointer to another dataset.
     * \param otherSeq index of a sequence in the other dataset.
     * \param otherInt an interval in the selected sequence in the other dataset.
     * \param metric a metric object that performs the distance calculation.
     * \return the calculated distance. If the arguments are invalide, return -1.
     */
    seqitem_t distance(int seq, TimeInterval interval,
                  GroupableTimeSeriesSet *other, int otherSeq, TimeInterval otherInt,
                  SeriesDistanceMetric *metric);

    /**
     * Get the warping path in dtw between two series.
     *
     * \param seq index of a sequence in this dataset.
     * \param interval an interval in the selected sequence.
     * \param other pointer to another dataset.
     * \param otherSeq index of a sequence in the other dataset.
     * \param otherInt an interval in the selected sequence in the other dataset.
     * \param metric a metric object that performs the distance calculation.
     * \return a vector containing the pairs of positions matched up between two series.
     */
    warping_path_t warping_path(int seq, TimeInterval interval,
                  GroupableTimeSeriesSet *other, int otherSeq, TimeInterval otherInt,
                  SeriesDistanceMetric *metric);

    /**
     * Find a subsequence in this dataset that best-matches with a subsequence in 
     * another dataset.
     *
     * \param other pointer to another dataset. 
     * \param otherSeq index of a sequenc in the other dataset.
     * \param otherInt an interval in the selected sequence in the other dataset.
     * \param strat search strategy.
     * \param warps TODO(Cuong): what is this?
     * \return a kBest struct containing information of the best-matched sequence.
     *         if the arguments are invalid, the seq field of this struct is -1.
     */
    kBest similar(GroupableTimeSeriesSet *other, int otherSeq, TimeInterval otherInt,
                 SearchStrategy strat=EBOTTOM_TOP, int warps=-1);

    vector< vector<kBest> > seasonalSimilarity(int TSIndex, int length);


    void outlier(int length);

    void printdb(void);
    void descdb(void);
    void printint(int seq, TimeInterval interval);
    TimeSeriesInterval getinterval(int seq, TimeInterval interval);
    const char *getName(void);
};

#endif // GROUPABLETIMESERIESSET_H
