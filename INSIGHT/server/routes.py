import random
import ONEXBindings as onex

from server import app
from flask import render_template
from flask import request
from flask import jsonify

@app.route('/')
def index():
  return render_template('layout.html')


@app.route('/query/random/')
def api_random_query():
  dataset_id = request.args.get('dataset', None)
  query_len = request.args.get('length', 20)
  if dataset_id:
    # TODO(Cuong) randomly sample a query 
    pass
  else:
    # TODO(Cuong) provide more parameters such as scaling, distribution...
    query = [random.random() for count in range(query_len)]
    return jsonify(query=query)


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


