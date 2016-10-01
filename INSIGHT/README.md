# INSIGHT: Interactive Time Series Analytics System

## Server API specification
### 1. Get a list of available datasets

**HTTP method and URL**

    GET /dataset/list/

**Success Response**

+ Code: **200**
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
</br>
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

+ Code: **200**
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

**Error Response**

+ Code: **400**
+ Response JSON: 
```
{ message: "Dataset collection index out of bound" }
```
+ Reason: Index of the dataset is negative or larger than the number of available datasets.


+ Code: **400**
+ Response JSON: 
```
{ message: "Invalid similarity threshold value" }
```
+ Reason: Similarity threshold is negative
</br>
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

+ Code: **200**
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

**Error Response**

+ Code: **400**
+ Response JSON: 
```
{ message: "Dataset X is not loaded yet" }
```
+ Reason: Dataset X is not loaded before selected sequence from it


+ Code: **400**
+ Response JSON: 
```
{ message: "Sequence index is out of bound" }
```
+ Reason: Index of the sequence is negative or largere than the number of available sequences.

</br>
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

+ Code: **200**
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

**Error Response**

+ Code: **400**
+ Response JSON: 
```
{ message: "Dataset X is not loaded yet" }
```
+ Reason: Dataset X is not loaded before selected sequence from it


+ Code: **400**
+ Response JSON: 
```
{ message: "Sequence index is out of bound" }
```
+ Reason: Index of the sequence is negative or larger than the number of available sequences.


+ Code: **400**
+ Response JSON:
```
{ message: "No custom query is loaded" }
```
+ Reason: No custom query is uploaded to the server.


+ Code: **400**
+ Response JSON: 
```
{ message: "Invalid starting and ending position" }
```

</br>

### 5. Upload custom query
Upload a custom query to the server.

**HTTP method and URL**

    POST /query/upload
    
**URL params**

    requestID: int
      A unique ID of the request. This ID is used to match up this request with its response.

**Data**

  TODO


**Success Response**

Code: **200**
+ Content:
```
{ 
  query: [<double>] # The uploaded query
  requestID: <int>  # The requestID sent with the request
}
```
+ Example:

TODO

```
{ 
  query: [1.24, 3.21, 3.1, 5.32],
  requestID: 1
}
```

**Error Response**

TODO