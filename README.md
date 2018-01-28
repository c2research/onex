## ONEX-INSIGHT: ONEX-Interactive Time Series Analytics System

INSIGHT is a visual analytics system for interactive time series mining built on top of the Online Exploration of Time Series Data (ONEX).

### Install dependencies for server

Open your favorite Terminal and run the following command.

```
$ make
$ cd INSIGHT
$ pip install -r requirements.txt
```

The 'make' command will build the ONEX binary and put that into the server directory. The other command will install neccessary dependencies for the server. You can also install in a virtualenv.


### Install dependencies for application

Installs dependencies for application necessary to build it. 
```
# Still in the INSIGHT folder
$ npm run install
```

### To build application 

Builds and bundles react app into plain js (choose one of the following).

When quickly compiling locally run this:
```
# Still in the INSIGHT folder
$ npm run build
```
When working locally, run this to continually update saved changes:
```
# Still in the INSIGHT folder
$ npm run watch
```
When deploying and NOT DEBUGGING, build it as production app as this will minify and otherwise optimize the app:
```
# Still in the INSIGHT folder
$ npm run production-build
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
usage: run.py [-h] [-H HOST] [-p PORT] [-d] [-l {DEBUG,INFO,WARN,ERROR}]

INSIGHT server

optional arguments:
  -h, --help            show this help message and exit
  -H HOST, --host HOST  hostname of the server [default 127.0.0.1]
  -p PORT, --port PORT  port for the server [default 5000]
  -d, --debug           turn on debug mode
  -l {DEBUG,INFO,WARN,ERROR}, --log {DEBUG,INFO,WARN,ERROR}
                        logging level [default INFO]
```

For example, to make the server externally visible in its network at port 5000, run:

```
$ ./run.py -H 0.0.0.0 -p 5000
```

