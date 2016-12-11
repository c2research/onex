#include "RepresentativeTree.h"
#include "TimeSeries.h"
#include <iomanip>

RepresentativeTree::RepresentativeTree(vector<TimeSeriesGroup*> groups, seqitem_t threshold)
{
  ST = threshold;
  root = NULL;
  cout << "Number of Groups " << groups.size() << endl;
  cout << "Length in Groups " << groups[0]->getLength() << endl;
  for (unsigned int i = 0; i < groups.size(); i++) {
    addNode(groups[i], i);
  }
}

void RepresentativeTree::addNode(TimeSeriesGroup* group, int groupIndex)
{
  treeNode* newNode = new treeNode; //allocate memory for struct
  newNode->group = group;
  newNode->groupIndex = groupIndex;
  newNode->left = NULL;
  newNode->right = NULL;

  if (root == NULL) {
    root = newNode;
    return;
  }

  treeNode* current = root;

  while (true) {
    if (current == NULL) {
      break;
    }

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
  return;
}

int RepresentativeTree::findBestGroup(TimeSeriesIntervalEnvelope query, int warps, seqitem_t *dist)
{
  seqitem_t diff;
  seqitem_t bsfDist = INF;
  if (this->root == NULL) {
    cout << "ROOT NULL" << endl;
  }
  treeNode* bsfNode = root;
  treeNode* current = root;

  while(current != NULL)
  {
    //switch this to a distance that does not dropout
    TimeSeriesGroup* g = current->group;
    TimeSeriesIntervalEnvelope groupEnv = g->getEnvelope();
    diff = groupEnv.cascadeDist(query, warps, bsfDist);

    if (bsfDist < diff) {
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

  *dist = bsfDist;
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
