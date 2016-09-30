var appendOutput = function(output) {
  $('#output').append('<p>' + output + '</p>');
}

var getDatasetList = function() {
  $.ajax({
    url: '/dataset/list',
    success: function(res) {
      for (ds in res['datasets']) {
        appendOutput(res['datasets'][ds]);
      }
    }
  });
}

var currentDS = 0;

var loadAndGroupDataset = function() {
  $.ajax({ 
    url: '/dataset/init/',
    data: {
      requestId: 0,
      dsCollectionIndex: currentDS,
      st: 0.2
    },
    success: function(res) {
      appendOutput(res['dsLength']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      appendOutput(errorThrown);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown)
    }
  });
}

var sampleAQuery = function() {
  $.ajax({ 
    url: '/query/fromdataset',
    data: {
      dsCollectionIndex: currentDS,
      qSeq: 0
    },
    success: function(res) {
      appendOutput(res['query']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      appendOutput(errorThrown);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown)
    }
  });
}

var findMatch = function() {
  $.ajax({ 
    url: '/query/find/',
    data: {
      requestId: 0,
      dsCollectionIndex: currentDS,
      qFindWithCustomQuery: 0,
      qSeq: 0,
      qStart: 0,
      qEnd: 20
    },
    success: function(res) {
      appendOutput(res['result']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      appendOutput(errorThrown);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown)
    }
  });
}

var findMatchWithUploadedQuery = function() {
  $.ajax({ 
    url: '/query/find/',
    data: {
      requestId: 0,
      dsCollectionIndex: currentDS,
      qFindWithCustomQuery: 1,
      qSeq: 0,
      qStart: 0,
      qEnd: 10
    },
    success: function(res) {
      appendOutput(res['result']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      appendOutput(errorThrown);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown)
    }
  });
}