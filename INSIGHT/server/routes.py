import random
import json
import threading
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

with open(DATASET_LIST) as datasets_file:
  datasets = json.load(datasets_file)

current_collection_index = -1
current_ds_index         = -1
current_ds_length        = -1
###############################################

@app.route('/test')
def test():
  return render_template('test.html')


@app.route('/')
def index():
  return render_template('layout.html')


@app.route('/dataset/list')
def api_dataset_load():
  global datasets

  with lock:
    datasets_list = [ds['name'] for ds in datasets]
    return jsonify(datasets=datasets_list)


@app.route('/dataset/init/')
def api_dataset_init():
  global current_collection_index, current_ds_index, current_ds_length

  request_id          = request.args.get('requestID', -1, type=int)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  st                  = request.args.get('st', 0.2, type=float)

  with lock:
    if ds_collection_index >= len(datasets) or ds_collection_index < 0:
      abort(400, 'Dataset collection index out of bound')

    if st < 0:
      abort(400, 'Invalid similarity threshold value')

    # Unload the current dataset in memory
    if current_ds_index != -1:
      onex.unloadDataset(current_ds_index)
      app.logger.debug('Unloaded dataset %d', current_collection_index)

    # Load the new dataset
    current_collection_index = ds_collection_index
    ds_path                  = str(datasets[current_collection_index]['path'])
    ds_name                  = str(datasets[current_collection_index]['name'])
    ds_index                 = onex.loadDataset(ds_path)
    current_ds_index         = ds_index
    app.logger.debug('Loaded dataset %d [%s]', current_collection_index, ds_name)

    # Group the new dataset%f' % (ds_collection_index, st)
    app.logger.debug('Grouping dataset %d with st = %f',
                     current_collection_index, st)
    num_groups = onex.groupDataset(current_ds_index, st)
    app.logger.info('Grouped dataset %d with st = %f. Created %d groups',
                     current_collection_index, st, num_groups)

    # Return number of sequences in the dataset
    current_ds_length = onex.getDatasetSeqCount(current_ds_index);

    return jsonify(dsLength=current_ds_length, numGroups=num_groups, requestID=request_id)


@app.route('/query/fromdataset/')
def api_query_from_dataset():
  global current_ds_index, current_ds_length
  request_id          = request.args.get('requestID', -1, type=int)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  q_seq               = request.args.get('qSeq', -1, type=int)
  with lock:
    if not (ds_collection_index == current_collection_index):
      abort(400, '{} is not loaded yet'.format(ds_collection_index))

    if (q_seq < 0 or q_seq >= current_ds_length):
      abort(400, 'Sequence index is out of bound')

    seq_length = onex.getDatasetSeqLength(current_ds_index);
    app.logger.debug('Get sequence %d in dataset %d',
                     q_seq,
                     current_collection_index)
    query = onex.getSubsequence(current_ds_index, q_seq, 0, seq_length - 1)

    return jsonify(query=query, requestID=request_id)


@app.route('/query/find/')
def api_find_best_match():
  request_id          = request.args.get('requestID', -1, type=int)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  q_type              = request.args.get('qType', -1, type=int)
  q_seq               = request.args.get('qSeq', -1, type=int)
  q_start             = request.args.get('qStart', -1, type=int)
  q_end               = request.args.get('qEnd', -2, type=int)
  with lock:
    if not (ds_collection_index == current_collection_index):
      abort(400, '{} is not loaded yet'.format(ds_collection_index))

    if (q_seq < 0 or q_seq >= current_ds_length):
      abort(400, 'Sequence index is out of bound')

    r_dist, r_seq, r_start, r_end = \
      onex.findSimilar(current_ds_index, current_ds_index, q_seq, q_start, q_end, 0, -1)
    app.logger.debug('Look for best match with sequence %d (%d:%d) in dataset %d',
                     q_seq, q_start, q_end, current_collection_index)
    result = onex.getSubsequence(current_ds_index, r_seq, r_start, r_end)
    return jsonify(result=result, dist=r_dist, requestID=request_id)


