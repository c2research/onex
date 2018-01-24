BOOST_INC = /usr/include
BOOST_LIB = /usr/lib

ONEX = ONEX
ONEX_INC = $(ONEX)/src
ONEX_LIB = $(ONEX)/src

TARGET = ONEXBindings
TARGET_LOC = INSIGHT/server

all: make_onex_and_bindings

make_onex_and_bindings:
	$(MAKE) -C $(ONEX)
	$(MAKE) $(TARGET).so

$(TARGET).so: $(TARGET).o $(ONEX_LIB)/*.o
	g++ -std=c++11 -shared $(TARGET).o $(ONEX_LIB)/*.o $$(python-config --ldflags) -lboost_python -o $(TARGET_LOC)/$(TARGET).so

$(TARGET).o: $(TARGET).cpp
	g++ -std=c++11 $$(python-config --include) -I$(BOOST_INC) -I$(ONEX_INC) -fPIC -c $(TARGET).cpp

clean: 
	rm -f *.so *.o
	rm -f $(TARGET_LOC)/*.so
	$(MAKE) -C $(ONEX) clean
