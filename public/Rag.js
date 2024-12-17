const uploadPDF = () => {
  const fileInput = document.getElementById('pdfUpload');
  const uploadStatus = document.getElementById('uploadStatus');
  const formData = new FormData();

  if (fileInput.files.length === 0) {
    uploadStatus.textContent = "Please select a PDF file to upload.";
    uploadStatus.style.color = 'red';
    return;
  }

  const file = fileInput.files[0];
  formData.append('file', file);

  uploadStatus.textContent = "Uploading file...";
  uploadStatus.style.color = 'blue';

  fetch('http://localhost:5001/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      uploadStatus.textContent = "PDF uploaded successfully!";
      uploadStatus.style.color = 'green';
    } else {
      uploadStatus.textContent = "Error uploading file: " + data.error;
      uploadStatus.style.color = 'red';
    }
  })
  .catch(error => {
    uploadStatus.textContent = "Error uploading file.";
    uploadStatus.style.color = 'red';
  });
};

const submitQuery = () => {
  const queryInput = document.getElementById('queryInput');
  const responseText = document.getElementById('responseText');

  const query = queryInput.value.trim();

  if (!query) {
    responseText.textContent = "Please enter a question.";
    responseText.style.color = 'red';
    return;
  }

  responseText.textContent = "Processing your query...";
  responseText.style.color = 'blue';

  fetch('http://localhost:5001/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      responseText.textContent = "According to query: " + data.answer;
      responseText.style.color = 'white';
    } else {
      responseText.textContent = "Error: " + data.error;
      responseText.style.color = 'red';
    }
  })
  .catch(error => {
    responseText.textContent = "Error processing query.";
    responseText.style.color = 'red';
  });
};
