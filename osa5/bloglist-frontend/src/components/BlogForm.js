const BlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, submit }) =>
<form onSubmit={submit}>
  <div>
    title: <input value={title} onChange={e => setTitle(e.target.value)} />
  </div>
  <div>
    author: <input value={author} onChange={e => setAuthor(e.target.value)} />
  </div>
  <div>
    url: <input value={url} onChange={e => setUrl(e.target.value)} />
  </div>
  <div>
    <button type="submit">add</button>
  </div>
</form>

export default BlogForm