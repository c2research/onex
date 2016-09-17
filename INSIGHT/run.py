#!/usr/bin/python

import argparse
import logging

DEFAULT_HOST = '127.0.0.1'
DEFAULT_PORT = 5000
DEFAULT_LOG_LEVEL = 'INFO'

parser = argparse.ArgumentParser(description='INSIGHT server')
parser.add_argument('-H', '--host',
                    help='hostname of the server ' + \
                         '[default %s]' % DEFAULT_HOST,
                    default=DEFAULT_HOST)
parser.add_argument('-p', '--port',
                    help='port for the server ' + \
                         '[default %s]' % DEFAULT_PORT,
                    type=int,
                    default=DEFAULT_PORT)
parser.add_argument('-l', '--log', 
                    help='logging level [default %s]' % DEFAULT_LOG_LEVEL,
                    choices=['DEBUG', 'INFO', 'WARN', 'ERROR'],
                    default=DEFAULT_LOG_LEVEL)

args = parser.parse_args()

# Set logging level for the root logger
logging_level = getattr(logging, args.log.upper(), None)
root_logger = logging.getLogger()
root_logger.setLevel(logging_level)
root_logger.addHandler(logging.StreamHandler())

# App should be imported here for the root logging config to take effect
from server import app

# Run the server
app.run(host=args.host, port=args.port, debug=True)
