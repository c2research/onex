import os
import random
import json
import threading
import errors
import ONEXBindings as onex

from server import app
from errors import InvalidUsage
from flask import render_template
from flask import request
from flask import jsonify

DEFAULT_ST = 0.2
DATASET_LIST = 'datasets.json'

UPLOAD_FOLDER = 'queries'
UPLOAD_PART_NAME = 'query'
UPLOAD_FILE_NAME = 'query'
ALLOWED_EXTENSIONS = set(['txt', 'csv'])

####### Server Initialization #################
lock = threading.Lock()
datasets = []

with open(DATASET_LIST) as datasets_file:
  datasets = json.load(datasets_file)

current_collection_index = -1
current_ds_index         = -1
current_q_index          = -1
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
  global current_collection_index, current_ds_index
  # TODO(Cuong): Instead of use default value of -1, catch the exception
  request_id          = request.args.get('requestID', -1, type=int)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  st                  = request.args.get('st', 0.2, type=float)

  with lock:
    if ds_collection_index >= len(datasets) or ds_collection_index < 0:
      raise InvalidUsage('Dataset collection index out of bound')

    if st < 0:
      raise InvalidUsage('Invalid similarity threshold value')

    # Unload the current dataset in memory
    if current_ds_index != -1:
      onex.unloadDataset(current_ds_index)
      app.logger.debug('Unloaded dataset %d', current_collection_index)

    # Load the new dataset
    current_collection_index = ds_collection_index
    ds_path                  = str(datasets[current_collection_index]['path'])
    ds_name                  = str(datasets[current_collection_index]['name'])
    current_ds_index         = onex.loadDataset(ds_path)

    app.logger.debug('Loaded dataset %d [%s]', current_collection_index, ds_name)

    # Group the new dataset%f' % (ds_collection_index, st)
    app.logger.debug('Grouping dataset %d with st = %f',
                     current_collection_index, st)
    num_groups = onex.groupDataset(current_ds_index, st)
    app.logger.info('Grouped dataset %d with st = %f. Created %d groups',
                     current_collection_index, st, num_groups)

    # Return number of sequences in the dataset
    ds_length = onex.getDatasetSeqCount(current_ds_index);

    return jsonify(dsLength=ds_length, numGroups=num_groups, requestID=request_id)


@app.route('/query/fromdataset/')
def api_query_from_dataset():
  global current_ds_index
  request_id          = request.args.get('requestID', -1, type=int)
  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  q_seq               = request.args.get('qSeq', -1, type=int)
  with lock:
    if not (ds_collection_index == current_collection_index):
      raise InvalidUsage('Dataset {} is not loaded yet'.format(ds_collection_index))

    ds_length = onex.getDatasetSeqCount(current_ds_index);
    if (q_seq < 0 or q_seq >= ds_length):
      raise InvalidUsage('Sequence index is out of bound')

    app.logger.debug('Get sequence %d in dataset %d',
                     q_seq,
                     current_collection_index)

    seq_length = onex.getDatasetSeqLength(current_ds_index);
    query = onex.getSubsequence(current_ds_index, q_seq, 0, seq_length - 1)

    return jsonify(query=query, requestID=request_id)


@app.route('/query/find/')
def api_find_best_match():
  request_id               = request.args.get('requestID', -1, type=int)
  ds_collection_index      = request.args.get('dsCollectionIndex', -1, type=int)
  q_find_with_custom_query = request.args.get('qFindWithCustomQuery', 0, type=int)
  q_seq                    = request.args.get('qSeq', -1, type=int)
  q_start                  = request.args.get('qStart', -1, type=int)
  q_end                    = request.args.get('qEnd', -1, type=int)

  if q_start > q_end or q_start < 0 or q_end < 0:
    raise InvalidUsage('Invalid starting and ending position')

  with lock:
    if not (ds_collection_index == current_collection_index):
      raise InvalidUsage('Dataset {} is not loaded yet'.format(ds_collection_index))

    # Index of the dataset containing the query, by default set to the same dataset 
    # where the best match will be searched from
    q_ds_index = current_ds_index
    if q_find_with_custom_query:
      if current_q_index == -1:
        raise InvalidUsage('No custom query is loaded')
      # If find with custom query, set to the dataset containing the custom query
      q_ds_index = current_q_index
      # There is only one sequence in this dataset
      q_seq = 0

    # Get number of sequences in the database containing the query
    q_ds_length = onex.getDatasetSeqCount(q_ds_index)
    if q_seq < 0 or q_seq >= q_ds_length:
      raise InvalidUsage('Sequence index is out of bound')

    seq_length = onex.getDatasetSeqLength(q_ds_index)
    # TODO(Cuong): 1-based or 0-based ?
    if q_start >= seq_length or q_end >= seq_length:
      raise InvalidUsage('Invalid starting and ending position')

    if q_find_with_custom_query:
      app.logger.debug('Look for best match with sequence %d (%d:%d) in the custom query',
                   q_seq, q_start, q_end)
    else:
      app.logger.debug('Look for best match with sequence %d (%d:%d) in dataset %d',
                       q_seq, q_start, q_end, current_collection_index)
 
    r_dist, r_seq, r_start, r_end = \
      onex.findSimilar(current_ds_index, q_ds_index, q_seq, q_start, q_end, 0, -1)
    result = onex.getSubsequence(current_ds_index, r_seq, r_start, r_end)
    warping = onex.getWarpingPath(current_ds_index, q_seq, q_start, q_end,
                                  q_ds_index, r_seq, r_start, r_end)

    return jsonify(result=result, 
                   warping=warping,
                   dist=r_dist,
                   dsName=datasets[current_collection_index],
                   seq=r_seq,
                   start=r_start,
                   end=r_end,
                   requestID=request_id)


@app.route('/query/upload', methods=['POST'])
def api_upload_query():
  if UPLOAD_PART_NAME not in request.files:
    raise InvalidUsage("No '{}' part found".format(UPLOAD_PART_NAME))

  file = request.files[UPLOAD_PART_NAME]
  if file.filename == '':
    raise InvalidUsage('No selected file')

  if not _allowed_file(file.filename):
    raise InvalidUsage('File type not allowed')

  if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

  query_path = os.path.join(UPLOAD_FOLDER, UPLOAD_FILE_NAME)

  file.save(query_path)
  app.logger.info('Saved custom query to %s', query_path)

  global current_q_index
  request_id = request.args.get('requestID', -1, type=int)

  with lock:
    # Unload the current custom query in memory
    if current_q_index != -1:
      onex.unloadDataset(current_q_index)
      app.logger.debug('Unloaded previous custom query')

    current_q_index = onex.loadDataset(query_path)
    app.logger.debug('Loaded new custom query')

    seq_length = onex.getDatasetSeqLength(current_q_index);
    query = onex.getSubsequence(current_q_index, 0, 0, seq_length - 1)

    return jsonify(query=query, requestID=request_id)


def _allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
