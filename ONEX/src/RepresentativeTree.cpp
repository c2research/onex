#include "RepresentativeTree.h"
#include "TimeSeries.h"
#include <iomanip>

RepresentativeTree::RepresentativeTree(const vector<TimeSeriesGroup*> &groups, seqitem_t threshold)
{
  ST = threshold;
  root = NULL;

  int maxDepth = 0;
  for (unsigned int i = 0; i < groups.size(); i++) {
    int depth = addNode(groups[i], i);
    maxDepth = std::max(maxDepth, depth);
  }
}

/**
 * Adds a node to the tree, storing it in the representativeTree
 *
 * \param group the group this node repreresents (used for comparisons)
 * \param groupIndex the index of the group (used for future access)
 *
 * \return the depth of the node added
 */
int RepresentativeTree::addNode(TimeSeriesGroup* group, int groupIndex)
{
  treeNode* newNode = new treeNode; //allocate memory for struct
  newNode->group = group;
  newNode->groupIndex = groupIndex;
  newNode->left = NULL;
  newNode->right = NULL;

  if (root == NULL) {
    root = newNode;
    return 0;
  }

  treeNode* current = root;
  int depth = 0;
  while (current != NULL) {
    depth++;
    seqitem_t diff = current->group->distance(group->getCentroid(), &dtw_lp2_dist, INF);
    if (diff > ST) { //go right
      if (current->right != NULL) {
        current = current->right;
      } else {
        current->right = newNode;
        break;
      }
    } else {//go left
      if (current->left != NULL) {
        current = current->left;
      } else {
        current->left = newNode;
        break;
      }
    }
  }
  return depth;
}

/**
 * Searches the tree for the best group
 *
 * \param query an envelope for calculating the query
 * \param dist sets this pointer to the distance of the lowest group
 * \param warps the max warp distance, although currently not utilized
 *
 * \return the index of the best group
 */
int RepresentativeTree::findBestGroup(TimeSeriesIntervalEnvelope query, int warps, seqitem_t *dist)
{
  seqitem_t diff;
  seqitem_t bsfDist = INF;

  treeNode* bsfNode = root;
  treeNode* current = root;

  while(current != NULL)
  {
    //switch this to a distance that does not dropout(?)
    TimeSeriesGroup* g = current->group;
    TimeSeriesIntervalEnvelope groupEnv = g->getEnvelope();
    diff = groupEnv.cascadeDist(query, warps, bsfDist);
    //diff = groupEnv.cascadeDist(query, warps, INF);

    if (bsfDist > diff) {
      //update best group found so far
      bsfDist = diff;
      bsfNode = current;
    }

    if (bsfDist == 0.0)
        break;

    if (diff > ST) {
      current = current->right;
    } else {
      current = current->left;
    }

  }

  *dist = bsfDist;//update the distance
  return bsfNode->groupIndex;
}

RepresentativeTree::~RepresentativeTree()
{
  deleteTree(root);
  root = NULL;
}

void RepresentativeTree::deleteTree(treeNode* current)
{
  if (current == NULL) return;
  deleteTree(current->left);
  deleteTree(current->right);

  delete current;
  return;
}

void RepresentativeTree::printTree()
{
  postorder(root, 0);
}

void RepresentativeTree::postorder(treeNode* p, int indent)
{
    if(p != NULL) {
        if(p->left) postorder(p->left, indent+2);
        if(p->right) postorder(p->right, indent+2);
        if (indent) {
            cout << std::setw(indent) << ' ';
        }
        cout<< p->groupIndex << "\n ";
    }
}
