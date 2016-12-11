#!/usr/bin/python

import unittest
import json

from server import app as App

class ServerTest(unittest.TestCase):

  def setUp(self):
    self.app = App.test_client()
    self.app.application.logger.disabled = True


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


  def test_init_dataset_out_of_bound(self):
    ret = self._init_dataset(-1, 1.0)
    self.assertEqual(ret.status_code, 400,
                     'Negative index of dataset must be invalid')
    ret = self._init_dataset(9999, 1.0)
    self.assertEqual(ret.status_code, 400,
                     'Out of bound index of dataset must be invalid')


  def test_init_dataset_st_out_of_bound(self):
    ret = self._init_dataset(0, -1.0)
    self.assertEqual(ret.status_code, 400,
                     'Negative similarity threshold must be invalid')


  def test_sample_query(self):
    dataset = 0
    self._init_dataset(dataset, 1.0)
    ret = self.app.get('/dataset/get/',
                       query_string={
                             'requestID': 0,
                             'fromDataset': 1,
                             'qSeq': 0
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['query']) > 0,
                    'Length of returned query must be positive')


  def test_sample_query_with_invalid_index(self):
    self._init_dataset(0, 1.0)
    ret = self.app.get('/dataset/get/',
                       query_string={
                             'requestID': 0,
                             'fromDataset': 1,
                             'qSeq': -1
                      })
    self.assertEqual(ret.status_code, 400,
                    'Sequence index must be positive')


  def test_find_best_match_same_dataset(self):
    dataset = 0
    self._init_dataset(dataset, 1.0)
    ret = self.app.get('/query/find/',
                       query_string={
                             'requestID': 0,
                             'dsCollectionIndex': dataset,
                             'q_find_with_custom_query': 0,
                             'qSeq': 0,
                             'qStart': 0,
                             'qEnd': 50
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['result']) > 0,
                    'Length of result must be positive')
    self.assertIsNotNone(ret_data.get('dist', None),
                    'A distance must be returned')


  def test_get_seasonal(self):
    dataset = 0
    self._init_dataset(dataset, 0.3)
    ret = self.app.get('/seasonal',
                       query_string={
                             'requestID': 0,
                             'dsCollectionIndex': dataset,
                             'qSeq': 0,
                             'length': 10
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['seasonal']) > 0,
                'Length of returned seasonal must be positive')


  def test_get_distance(self):
    dataset = 0
    self._init_dataset(dataset, 0.3)
    ret = self.app.get('/query/distance/',
                       query_string={
                             'requestID': 0,
                             'fromUploadSet': 0,
                             'getWarpingPath': 1,
                             'qSeq': 10,
                             'qStart': 0,
                             'qEnd': 20,
                             'rSeq': 20,
                             'rStart': 0,
                             'rEnd': 20
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(ret_data['distance'] and ret_data['distance'] > 0,
                'Distance must be positive')
    self.assertTrue(len(ret_data['warpingPath']) > 0,
                'Length of returned warping path must be positive')


  def test_get_group_values(self):
    dataset = 0
    self._init_dataset(dataset, 0.3)
    ret = self.app.get('/group/values/',
                       query_string={
                             'requestID': 0,
                             'length': 5,
                             'index': 0,
                      })
    ret_data = json.loads(ret.data)
    self.assertTrue(len(ret_data['values']) > 0,
                'Length of list of values must be positive')
    self.assertTrue(type(ret_data['values'][0]) == dict,
                'Each value must be a dict')


if __name__=='__main__':
  unittest.main()
