#!/usr/bin/make

all_proxy: all

VERSION=0.0.1

# Toolchain programs.
CC=g++
LD=ld
AR=ar
LN=ln


# Directories.
SRC=src
INC=src
DATA=data

# Source and header files.
SRC_OBJS=main trillionDTW util deque TimeSeries OnlineSession Grouping GroupableTimeSeriesSet
INC_OBJS=     trillionDTW util deque TimeSeries OnlineSession Grouping GroupableTimeSeriesSet

OBJ_PATHS=$(addprefix $(SRC)/, $(addsuffix .o, $(SRC_OBJS)))
SRC_PATHS=$(addprefix $(SRC)/, $(addsuffix .cpp, $(SRC_OBJS)))
INC_PATHS=$(addprefix $(INC)/, $(addsuffix .h, $(INC_OBJS)))


# Compiler flags.
CCFLAGS=-Isrc -std=c++0x -Wall -Wextra -Wno-unused-parameter -Wformat -fpermissive -O2 -fPIC
DEBUG=#-pg -g

# Default rule for compiling object files.
%.o: %.cpp $(INC_PATHS)
	$(CC) $(CCFLAGS) $(DEBUG) -c $< -o $@

# Rule for compiling main executable.
onex: $(OBJ_PATHS)
	$(CC) $(DEBUG) $^ -o $@

run: onex
	./onex

# Main rule.
all: onex

# Clean repo.
clean:
	rm -f $(OBJ_PATHS) onex

.PHONY: all_proxy all clean
