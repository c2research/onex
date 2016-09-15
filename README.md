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

Run the following command to start the server.

```
# Still in the INSIGHT folder
$ python run.py
```
