# INSIGHT: Interactive Time Series Analytics System

## Server API specification

### Get a list of datasets

```
GET /dataset/list/
```

Get a list of available datasets.

**Success Response**

*Code* 200
*Content* 
```
{ 
  dataset: ['ECG', 'ItalyPower', ...]
}
```
