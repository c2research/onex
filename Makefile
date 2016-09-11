PYTHON_VERSION = 2.7
PYTHON_INCLUDE = /usr/include/python$(PYTHON_VERSION)

BOOST_INC = /usr/include
BOOST_LIB = /usr/lib

ONEX = ONEX-tmp/ONEX-tmp
ONEX_INC = $(ONEX)/src
ONEX_LIB = $(ONEX)/src

TARGET = ONEXBindings

all: make_onex_and_bindings

make_onex_and_bindings:
	$(MAKE) -C $(ONEX)
	$(MAKE) $(TARGET).so

$(TARGET).so: $(TARGET).o $(ONEX_LIB)/*.o
	g++ -std=c++11 -shared $(TARGET).o $(ONEX_LIB)/*.o -lpython$(PYTHON_VERSION) -lboost_python -o $(TARGET).so

$(TARGET).o: $(TARGET).cpp
	g++ -I$(PYTHON_INCLUDE) -I$(BOOST_INC) -I$(ONEX_INC) -fPIC -c $(TARGET).cpp

clean: 
	rm -f *.so *.o
	$(MAKE) -C $(ONEX) clean
