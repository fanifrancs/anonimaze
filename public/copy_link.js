async function copyLink(param) {
  await navigator.clipboard.writeText(`Click this link to send me an anonymous message ${param} I won't know who sent it 😎.`)
  .then(() => {
    alert('Link copied to clipboard.');
  })
  .catch(err => {
    alert(err);
  })
}
