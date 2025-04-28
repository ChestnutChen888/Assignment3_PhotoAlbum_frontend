const API_URL = 'https://5hlcrueasj.execute-api.us-east-1.amazonaws.com/Dev';


async function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) return alert('Please enter a search term.');

    const url = `${API_URL}/search?q=${encodeURIComponent(query)}`;
    const resultsDiv = document.getElementById('photoGrid');
    resultsDiv.innerHTML = 'Searching...';

    try {
        const response = await fetch(url);
        const data = await response.json();

        resultsDiv.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(item => {
                const card = document.createElement('div');
                card.className = 'photo-card';

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = item.objectKey || 'photo';
                img.className = 'photo-img';

                const labels = document.createElement('div');
                labels.className = 'photo-labels';
                labels.textContent = item.labels.join(', ');

                card.appendChild(img);
                card.appendChild(labels);
                resultsDiv.appendChild(card);
            });
        } else {
            resultsDiv.innerHTML = 'No photos found.';
        }
    } catch (error) {
        console.error('Error searching:', error);
        resultsDiv.innerHTML = 'Error performing search.';
    }
}

async function uploadPhoto() {
    const fileInput = document.getElementById('photoFile');
    const labelsInput = document.getElementById('customLabels');
    const file = fileInput.files[0];
    const customLabels = labelsInput.value.trim();

    if (!file) {
        alert('Please choose a file to upload.');
        return;
    }

    const s3UploadUrl = `https://assignment3-photoalstorage.s3.us-east-1.amazonaws.com/${encodeURIComponent(file.name)}`;
    const headers = {
        'x-amz-meta-customLabels': customLabels,
        'Content-Type': file.type
    };

    try {
        const response = await axios.put(s3UploadUrl, file, {
            headers: headers
        });
        alert('Photo uploaded successfully!');
    } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Check console for more info.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('uploadForm').addEventListener('submit', function (e) {
        e.preventDefault();
        uploadPhoto();
    });
});
