#ifndef REP_TREE_H
#define REP_TREE_H

#include "Grouping.h"
#include <vector>
#include <stdint.h>

using namespace std;

class TimeSeriesGroup;
class TimeSeriesIntervalEnvelope;

struct treeNode
{
  TimeSeriesGroup *group; //this is used for comparisons
  int groupIndex; //this is used when getting the best group
  struct treeNode *left;
  struct treeNode *right;
};

/// Data structure for sorting the groups
class RepresentativeTree
{
protected:
  treeNode *root;
  seqitem_t ST;

  int addNode(TimeSeriesGroup* group, int groupIndex);
  void postorder(treeNode* p, int indent=0);

public:
  RepresentativeTree(){ root=NULL; ST=1; };
  RepresentativeTree(const vector<TimeSeriesGroup*>& groups, seqitem_t ST);
  int findBestGroup(TimeSeriesIntervalEnvelope query, int warps, seqitem_t* dist); //returns the indice of the best group
  ~RepresentativeTree();
  void deleteTree(treeNode* current);
  void printTree();

};

#endif // REP_TREE_H
