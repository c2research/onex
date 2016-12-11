# INSIGHT: Interactive Time Series Analytics System

Since this server performs computation with ONEX code, which is not written in a stateless manner, the server must also act as a state machine. Each of the following requests may or may not change the state of the server or depend on the previous requests. For example, making a 'Initialize a dataset' request loads a new dataset into the memory and the subsequence queries will be performed on this dataset.

## Server API specification
### 1. Get a list of available datasets

**HTTP method and URL**

    GET /dataset/list

**Success Response**

+ Status: **200**
+ Content:
```
{
  dataset: [<string>] # A list of names of available datasets
}
```
+ Example:
```
{
  dataset: ['ECG', 'ItalyPower', 'FacesAll']
}
```

<br/>
### 2. Initalize a dataset

Perform loading and grouping on a dataset.

**HTTP method and URL**

    GET /dataset/init/

**URL params**

    dsCollectionIndex: int
      Index of the dataset in the dataset list.

    st: double
      Similarity threshold

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.


**Success Response**

+ Status: **200**
+ Content:
```
{
  dsLength: <int>  # Length of the dataset
  requestID: <int> # The requestID sent with the request
}
```

<br/>
### 3. Get a sequence from a dataset

**HTTP method and URL**

    GET /dataset/get/

**URL params**

    fromDataset: int
      1 if getting a sequence from the loaded dataset. 0 if getting from the uploaded query file.

    qSeq: int
      Index of a sequence in the dataset.

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.


**Success Response**

+ Status: **200**
+ Content:
```
{
  query: [<double>] # A sequence in the dataset
  requestID: <int>  # The requestID sent with the request
}
```

<br/>
### 4. Get full dataset (for the purpose of providing queries)
Get a list of time series in the current dataset

**HTTP method and URL**

  GET /dataset/queries

**URL params**

  requestID: int
    A unique ID of the request. This ID is used to match up this request with its response.

**Success Response**

Status: **200**
+ Content:
```
{
  queries: [[<double>]] # A list of list of doubles
  requestID: <int>  # The requestID sent with the request
}
```

<br/>
### 5. Get DTW distance and warping path between two time series
Get the DTW distance and optionally warping path between two time series.
One time series (q) is either from the loaded dataset or from an upload set,
the other (r) is from the loaded dataset

**HTTP method and URL**

  GET /dataset/queries

**URL params**

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.

    from_upload_set: int
      1 if the q time series is from the upload set, 0 otherwise

    get_warping_path: int
      1 to request the warping path, 0 to return an empty list for warping path

    q_seq: int
      Index of the q sequence

    q_start: int
      Starting position of the q sequence

    q_end: int
      Ending position of the q sequence

    r_seq: int
      Index of the r sequence

    r_start: int
      Starting position of the r sequence

    r_end: int
      Ending position of the r sequence

**Success Response**

Status: **200**
+ Content:
```
{
  distance: <double> # the DTW distance between the two time series
  warpingPath: <int>  # the warping path between two time series or an empty list if get_warping_path is 0
}
```

<br />
### 6. Find best match
Find the best match with a subsequence in a dataset from all subsequences in another dataset.

**HTTP method and URL**

    GET /query/find/

**URL params**

    dsCollectionIndex: int
      Index of the dataset being sought.

    qFindWithCustomQuery: int
      If this is 0, find best match with a query from the same dataset. If this is 1, find best match with the uploaded query.

    qSeq: int
      Index of a sequence containing the query.

    qStart: int
      Starting position of the query in the selected sequence.

    qEnd: int
      Ending position of the query in the selected sequence.

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.


**Success Response**

+ Status: **200**
+ Content:
```
{
  dist: <double>     # Distance between the query and the result
  result: [<double>] # The result sequence
  dsName: <string>   # Name of the dataset containing the result
  seq: <int>         # Index of the sequence containing the result
  start: <int>       # Starting position of the result in the sequence
  end: <int>         # Ending position of the result in the sequence
  requestID: <int>   # The requestID sent with the request
}
```

<br/>
### 7. Upload custom query
Upload a custom query file to the server.

**HTTP method and URL**

    POST /query/upload

**URL params**

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.

**Data**

Use 'query' for the 'name' attribute. For example:

```
<input type="file" name="query">
```


**Success Response**

Status: **200**
+ Content:
```
{
  queries: [[<double>]] # The uploaded queries
  requestID: <int>  # The requestID sent with the request
}
```

<br/>
### 8. Get seasonal patterns
Get a list of seasonal patterns within a given time series.

**HTTP method and URL**

    GET /seasonal

**URL params**

    dsCollectionIndex: int
      Index of the dataset in the dataset list.

    qSeq: int
      Index of a sequence in the dataset.

    length: int
      Length of each pattern in a seasonal patterns.

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.


```
<input type="file" name="query">
```

**Success Response**

Status: **200**
+ Content:
```
{
  seasonal: [[[<double>, <double>]] # A list of list of pair of starting position and ending position
  requestID: <int>  # The requestID sent with the request
}
```

<br/>
### 9. Get group representatives
Get a list of representatives of underlying groups (of the max length only)

**HTTP method and URL**

  GET /group/representatives

**URL params**

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.

**Success Response**

Status: **200**
+ Content:
```
{
  representatives: [[<double>]] # A list of list of doubles
  requestID: <int>  # The requestID sent with the request
}
```

<br/>
### 10. Get group values
Get a list of time series inside a group

**HTTP method and URL**

  GET /group/values

**URL params**

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.

    length: int
      The length set that the group belongs to

    index: int
      Index of group in the length set

**Success Response**

Status: **200**
+ Content:
```
{
  values: [{object}]] # A list of object 
  requestID: <int>  # The requestID sent with the request
}
```

values is a list of object that has the form:

```
{
  values: [<double>], # values of a sequence
  seq: <int>,         # index of the sequence in the loaded dataset
  start: <int>,       # starting position of the sequence
  end: <int>          # ending position of the sequence
}
```
