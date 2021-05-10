const newPost = async (event) => {
    event.preventDefault();
  
    // Collect values from the login form
    const title = document.querySelector('#title').value.trim();
    const body = document.querySelector('#content').value.trim();
  
    if (title && body) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({ title, body }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the profile page
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  const newComment = async (event) => {
    event.preventDefault();
  
    const body = document.querySelector('#commenting').value.trim();
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    if (body) {
      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({ body, post_id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document
    .querySelector('.post-form')
    .addEventListener('submit', newPost);
  
  document
    .querySelector('.comment-form')
    .addEventListener('submit', newComment);