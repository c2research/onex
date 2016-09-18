#!/usr/bin/python

import unittest
import json

from server import app as App

class ServerTest(unittest.TestCase):

  def setUp(self):
    self.app = App.test_client()


  def test_list_dataset(self):
    ret = self.app.get('/dataset/list')
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['datasets']) > 0,
                    'Returned dataset list must not be empty')

  def _init_dataset(self, ds_collection_index, st):
    # Choose a small dataset otherwise it will take forever
    ret = self.app.get('/dataset/init/',
                       query_string={
                             'requestID': 0,
                             'dsCollectionIndex': ds_collection_index,
                             'st': st
                      })
    return ret


  def test_init_dataset(self):
    ret = self._init_dataset(0, 1.0)
    ret_data = json.loads(ret.data)
    self.assertTrue(ret_data['dsLength'] > 0,
                    'Number of sequences in a dataset must be positive')
    self.assertTrue(ret_data['numGroups'] > 0,
                    'Number of groups must be positive')


  def test_sample_query(self):
    dataset = 0
    self._init_dataset(dataset, 1.0)
    ret = self.app.get('/query/fromdataset/',
                       query_string={
                             'requestID': 0,
                             'dsCollectionIndex': dataset,
                             'qSeq': 0
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['query']) > 0,
                    'Length of returned query must be positive')


  def test_find_best_match_same_dataset(self):
    dataset = 0
    self._init_dataset(dataset, 1.0)
    ret = self.app.get('/query/find/',
                       query_string={
                             'requestID': 0,
                             'dsCollectionIndex': dataset,
                             'qIndex': dataset,
                             'qSeq': 0,
                             'qStart': 0,
                             'qEnd': 50
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['result']) > 0,
                    'Length of result must be positive')
    self.assertIsNotNone(ret_data.get('dist', None),
                    'A distance must be returned')


if __name__=='__main__':
  unittest.main()
