
  const newComment = async (event) => {
    event.preventDefault();
  
    const body = document.querySelector('#commenting').value.trim();
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
console.log(post_id)
    if (body) {
      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({ body, post_id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log(response);
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  };

  document
  .querySelector('.comment-form')
  .addEventListener('submit', newComment);