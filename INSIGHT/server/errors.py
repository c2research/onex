from flask import jsonify
from server import app


class InvalidUsage(Exception):
  def __init__(self, message, status_code=None):
    Exception.__init__(self)
    self.message = message
    self.status_code = 400
    if status_code is not None:
      self.status_code = status_code  

  def to_dict(self):
    rv = dict()
    rv['message'] = self.message
    return rv


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
  response = jsonify(error.to_dict())
  response.status_code = error.status_code
  app.logger.error(error.message)
  return response