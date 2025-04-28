async function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert('Please enter a search term.');
        return;
    }
    

    const resultsDiv = document.getElementById('photoGrid');
    resultsDiv.innerHTML = 'Searching...';

    try {
        const params = {
            q: query
        };
        const body = {};
        const additionalParams = {};

        const response = await sdk.searchGet(params, body, additionalParams);
        const data = response.data;

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

    const s3UploadUrl = `https://assignment3-photoalstorage.s3.amazonaws.com/${encodeURIComponent(file.name)}`;

    const headers = {
        'Content-Type': file.type,
        'x-amz-meta-customLabels': customLabels 
    };

    try {
        const response = await axios.put(s3UploadUrl, file, { headers });
        console.log('Upload success:', response);
        alert('Photo uploaded successfully!');
    } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Check console for more info.');
    }
}


async function uploadPhoto() {
    const fileInput = document.getElementById('photoFile');
    const labelsInput = document.getElementById('customLabels');
    const file = fileInput.files[0];
    let customLabels = labelsInput.value.trim();

    if (!file) {
        alert('Please choose a file to upload.');
        return;
    }

    if (!customLabels) {
        customLabels = ""; 
    }

    const params = {};

    const body = file;

    const additionalParams = {
        headers: {
            'Content-Type': file.type,
            'x-amz-meta-customLabels': customLabels 
        }
    };

    try {
        const response = await sdk.photosPut(params, body, additionalParams);
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
