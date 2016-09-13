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

with open('datasets.json') as datasets_file:
  datasets = json.load(datasets_file)

dataset_index_in_memory = [-1] * len(datasets)

###############################################


@app.route('/test')
def test():
  return render_template('test.html')


@app.route('/')
def index():
  return render_template('layout.html')


@app.route('/dataset/list/')
def api_dataset_load():
  global lock
  global datasets

  with lock:
    datasets_list = [ds['name'] for ds in datasets] 
  return jsonify(datasets=datasets_list)


@app.route('/dataset/init/')
def api_dataset_init():
  global lock
  global datasets

  ds_collection_index = request.args.get('dsCollectionIndex', -1, type=int)
  st = request.args.get('st', 0.2, type=float) 

  print "ds_collection_index = {}".format(ds_collection_index)

  with lock: 
    if ds_collection_index != -1 and ds_collection_index < len(datasets):
      ds_path = None
      ds_path = str(datasets[ds_collection_index]['path'])

      index_in_memory = onex.loadDataset(ds_path)
      onex.groupDataset(index_in_memory, st)

      dataset_index_in_memory[ds_collection_index] = index_in_memory 

      return jsonify(dsLength=0)
    else:
      # TODO(Cuong) add more meaningful message
      abort(400)


@app.route('/query/sample/')
def api_sample_query():
  dataset_id = request.args.get('dataset', None)
  # TODO(Cuong) other parameters (start, length, ...)
  if dataset_id: 
    # TODO(Cuong) pick the specified query 
    pass
  else:
    # TODO(Cuong) response with error
    pass


@app.route('/find')
def api_find_best_match():
  dataset_id = request.args.get('dataset', None)
  if dataset_id:
    pass
  else:
    pass


