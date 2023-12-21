document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn');
    const urlInput = document.querySelector('.URL-input');
    const select = document.querySelector('.opt');
    const videoContainer = document.getElementById('video-container');
    const serverURL = 'http://localhost:4000';

    btn.addEventListener('click', async () => {
        const videoType = select.value;
        const videoUrl = urlInput.value.trim();

        try {
            validateInput(videoUrl);

            const response = await fetch(`${serverURL}/download${videoType}?url=${encodeURIComponent(videoUrl)}`);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            displayVideo(objectUrl);

        } catch (error) {
            handleFetchError(error);
        }
    });

    function validateInput(input) {
        if (!input) {
            throw new Error('Please enter a YouTube URL');
        }

        if (!isValidURL(input)) {
            throw new Error('Invalid YouTube URL');
        }
    }

    function displayVideo(url) {
        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.controls = true;

        clearVideoContainer();
        videoContainer.appendChild(videoElement);
    }

    function clearVideoContainer() {
        videoContainer.innerHTML = '';
    }

    function handleFetchError(error) {
        console.error('Fetch error:', error);
        showAlert('An error occurred. Please try again later.');
    }

    function showAlert(message) {
        alert(message);
    }

    function isValidURL(input) {
        // Implement a simple URL validation logic based on your requirements
        return true;
    }
});
