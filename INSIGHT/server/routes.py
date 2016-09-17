import random
import json
import threading
import logging
import ONEXBindings as onex

from server import app
from flask import render_template
from flask import request
from flask import jsonify
from flask import abort

DEFAULT_ST = 0.2
DATASET_LIST = 'datasets.json'

####### Server Initialization #################
lock = threading.Lock()
datasets = []

with open('datasets.json') as datasets_file:
  datasets = json.load(datasets_file)

current_collection_index = -1
current_in_memory_index = -1

logger = logging.getLogger(__name__)
###############################################

@app.route('/test')
def test():
  return render_template('test.html')


@app.route('/')
def index():
  return render_template('layout.html')


@app.route('/dataset/list/')
def api_dataset_load():
  global datasets

  with lock:
    datasets_list = [ds['name'] for ds in datasets]
  return jsonify(datasets=datasets_list)


@app.route('/dataset/init/')
def api_dataset_init():
  global current_collection_index, current_in_memory_index

  request_id = request.args.get('requestID', -1)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  st = request.args.get('st', 0.2, type=float) 

  with lock: 
    # TODO(Cuong) check validity and duplicity of parameters
    current_collection_index = ds_collection_index
 
    # Unload the current dataset in memory
    if current_in_memory_index != -1:
      onex.unloadDataset(current_in_memory_index)

    # Load the new dataset
    ds_path = str(datasets[current_collection_index]['path'])
    ds_index = onex.loadDataset(ds_path)
    current_in_memory_index = ds_index
    
    # Group the new dataset
    onex.groupDataset(ds_index, st)
    ds_length = onex.getDatasetSeqCount(ds_index);

    return jsonify(dsLength=ds_length, requestID=request_id)


@app.route('/query/fromdataset/')
def api_query_from_dataset():
  global current_in_memory_index
  request_id = request.args.get('requestID', -1)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  q_seq = request.args.get('qSeq', -1, type=int)
  with lock: 
    # TODO(Cuong) Check validity of parameters 
    # TODO(Cuong) Check if ds_collection_index matches current_collection_index
    seq_length = onex.getDatasetSeqLength(current_in_memory_index);
    query = onex.getSubsequence(current_in_memory_index, q_seq, 0, seq_length - 1)

    # Return the length of the dataset here
    return jsonify(query=query, requestID=request_id)


@app.route('/query/find/')
def api_find_best_match():
  request_id = request.args.get('requestID', -1)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  q_index = request.args.get('qIndex', -1, type=int)
  q_seq = request.args.get('qSeq', -1, type=int)
  q_start = request.args.get('qStart', -1, type=int)
  q_end = request.args.get('qEnd', -2, type=int)
  with lock:
    # TODO(Cuong) Check validity of parameters 
    # TODO(Cuong) Check if ds_collection_index matches current_collection_index
    r_dist, r_seq, r_start, r_end = \
      onex.findSimilar(current_in_memory_index, q_index, q_seq, q_start, q_end, 0, -1)
    result = onex.getSubsequence(current_in_memory_index, r_seq, r_start, r_end)
    return jsonify(result=result, dist=r_dist, requestID=request_id)


