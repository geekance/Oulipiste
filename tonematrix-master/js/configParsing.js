function readXMLSessionInstru()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    var sessions=xmlData.getElementsByTagName("session");

    for (var i = 0; i < sessions[0].getElementsByTagName("instrument").length; i++) {
      // var name = emp[i].getElementsByTagName("name")[i].firstChild.data;
      directory[i] = sessions[0].getElementsByTagName("instrument")[i].firstChild.data;
      instuColors[i] = sessions[0].getElementsByTagName("color")[i].firstChild.data;
      document.styleSheets[0].insertRule(".note.active" + i + ":before { border-color:rgb(" + instuColors[i] +"); }", i)
    };
    sourceTemp = createArray(sessions[0].getElementsByTagName("instrument").length,circleId.length*positionId.length);
  }

  function readXMLSessionId()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/samples_amiens/recordings/sessionId.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("sessionid")[0].firstChild.data;

  };

  function sourceRecordings()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("sourceRecordings")[0].firstChild.data;

  }

  function istracking()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("istracking")[0].firstChild.data;

  }

  function isdetectingbuzz()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("isdetectingbuzz")[0].firstChild.data;

  }

  function ismanual()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("ismanual")[0].firstChild.data;

  }

  function sampledirectory()
  {
    var xml = new XMLHttpRequest();
    xml.open('GET','assets/sounds/soundConfig.xml',false);
    xml.send();
    var xmlData=xml.responseXML;
    if (!xmlData){
      xmlData = (new DOMParser()).parseFromString(xml.responseText,'text/xml');
    }
    return xmlData.getElementsByTagName("sampledirectory")[0].firstChild.data;

  }

  function writeXMLSessionId(index)
  {
    download('sessionId.xml',"<?xml version=\"1.0\"?><sonsAmiens><sessionid>"+index+"</sessionid></sonsAmiens></xml>");
    console.log(readXMLSessionId());
  };

  function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    pom.style.display = 'none';
    document.body.appendChild(pom);

    pom.click();

    document.body.removeChild(pom);
  };

  function createArray(length) {
      var arr = new Array(length || 0),
          i = length;

      if (arguments.length > 1) {
          var args = Array.prototype.slice.call(arguments, 1);
          while(i--) arr[length-1 - i] = createArray.apply(this, args);
      }

      return arr;
    };

    function createClass(name,rules){
      var style = document.createElement('style');
      style.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(style);
      if(!(style.sheet||{}).insertRule) 
          (style.styleSheet || style.sheet).addRule(name, rules);
      else
          style.sheet.insertRule(name+"{"+rules+"}",0);
    };

