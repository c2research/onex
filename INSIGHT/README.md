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
  dsLength: <int> # Length of the dataset
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
</br>
### 4. Find best match
Find the best match with a subsequence in a dataset from all subsequences in another dataset.

**HTTP method and URL**

    GET /query/find/
    
**URL params**

    dsCollectionIndex: int
      Index of the dataset being sought.
  
    qIndex: int
      Index of the dataset containing the query.
    
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
  dist: <double>   # Distance between the query and the result
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
