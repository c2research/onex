var appendOutput = function(output) {
  $('#output').append('<p>' + output + '</p>');
}

var getDatasetList = function() {
  $.ajax({
    url: '/dataset/list/',
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
      st: 0.3
    },
    success: function(res) {
      appendOutput(res['dsLength']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
     appendOutput(textStatus);
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
     appendOutput(textStatus);
    }
  });
}

var findMatch = function() {
  $.ajax({ 
    url: '/query/find/',
    data: {
      requestId: 0,
      dsCollectionIndex: currentDS,
      qIndex: currentDS,
      qSeq: 0,
      qStart: 0,
      qEnd: 50
    },
    success: function(res) {
      appendOutput(res['result']);
    },
    error: function(jqXHR, textStatus, errorThrown) {
     appendOutput(textStatus);
    }
  });
}
