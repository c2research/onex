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
+ Example:
```
{ 
  dsLength: 200,
  requestID: 1
}
```

<br/>
### 3. Get a sequence from a dataset

**HTTP method and URL**

    GET /query/fromdataset/
    
**URL params**

    dsCollectionIndex: int
      Index of the dataset in the dataset list.

    qSeq: double 
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
+ Example:
```
{ 
  query: [1.24, 3.21, 3.1, 5.32],
  requestID: 1
}
```

<br />
### 4. Find best match
Find the best match with a subsequence in a dataset from all subsequences in another dataset.

**HTTP method and URL**

    GET /query/find/
    
**URL params**

    dsCollectionIndex: int
      Index of the dataset being sought.
  
    qFindWithCustomQuery: int
      If this is 0, find best match with a query from the same dataset. If this is 1, find best match with the uploaded query.
    
    qSeq: double 
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
  requestID: <int>   # The requestID sent with the request
}
```
+ Example:
```
{ 
  dist: 0.23
  result: [1.24, 3.21, 3.1, 5.32],
  requestID: 1
}
```

<br/>
### 5. Upload custom query
Upload a custom query to the server.

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
  query: [<double>] # The uploaded query
  requestID: <int>  # The requestID sent with the request
}
```
+ Example:

```
{ 
  query: [1.24, 3.21, 3.1, 5.32],
  requestID: 1
}
```
