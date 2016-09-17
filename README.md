# ONEX-SYstem

## ONEX: 

## INSIGHT: Interactive Time Series Analytics System

INSIGHT is a visual analytics system for interactive time series mining built on top of the Online Exploration of Time Series Data (ONEX).

### Install dependencies for server

Open your favorite Terminal and run the following command.

```
$ make
$ cd INSIGHT
$ pip install -r requirements.txt
```

The 'make' command will build the ONEX binary and put that into the server directory. The other command will install neccessary dependencies for the server. You can also install in a virtualenv.

### To build application 

Builds and bundles react app into plain js
```
# Still in the INSIGHT folder
$ npm run build
```

### Run the server

Run the following command to start the server

```
# Still in the INSIGHT folder
$ python run.py
```

Or set execution permission for run.py using 

```
$ sudo chmod u+x run.py
```

Then simply run the server with

```
$ ./run.py
```

The run server command also accepts some optional arguments

```
$ ./run.py -h
Usage: run.py [-h] [-H HOST] [-p PORT] [-l {DEBUG,INFO,WARN,ERROR}]

INSIGHT server

optional arguments:
  -h, --help            show this help message and exit
  -H HOST, --host HOST  hostname of the server [default 127.0.0.1]
  -p PORT, --port PORT  port for the server [default 5000]
  -l {DEBUG,INFO,WARN,ERROR}, --log {DEBUG,INFO,WARN,ERROR}
                        logging level [default INFO]

# For example, to make the server externally visible in its network 
# at port with WARN logging level: 
# $ ./run.py -host 0.0.0.0 -p 5000 -l ERROR 
```

