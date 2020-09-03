var isXML = function (doc) {
  console.log(doc.createElement("p").nodeName, doc.createElement("P").nodeName);
  return doc.createElement("p").nodeName !== doc.createElement("P").nodeName;
};

