# Create Your First Application
Now that you've set up Harper, let's build a simple API. Harper lets you build powerful APIs with minimal effort. In just a few minutes, you'll have a functional REST API with automatic validation, indexing, and querying—all without writing a single line of code.

## Setup Your Project
Start by cloning the Harper application template:

```bash
git clone https://github.com/HarperDB/application-template my-book-app
cd my-book-app
```

## Create a Complete API with Just a Schema
Harper's power comes from its schema-first approach. Edit your `schema.graphql` file to define a Book table:

```graphql
type Book @table @export {
  id: ID @primaryKey
  title: String! @indexed
  author: String! @indexed
  publishedYear: Int
  genre: String @indexed
}
```

That's it! This simple schema gives you:

- Automatic table creation with the `@table` directive
- Full REST API with the `@export` directive (GET, POST, PUT, DELETE)
- Data validation (title and author are required with `!`)
- Fast querying with `@indexed` fields
- Auto-generated primary keys with `@primaryKey`


## Start Your Application
```bash
harperdb dev .
```
Harper automatically creates your Book table and REST endpoints. You now have a complete API at `http://localhost:9926/Book/`

## Test Your API
### Create a book:
```javascript
const response = await fetch('http://localhost:9926/Book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald", 
    publishedYear: 1925,
    genre: "Fiction"
  })
});
const newBook = await response.json();
```

### Get all books:
```javascript
const books = await fetch('http://localhost:9926/Book').then(r => r.json());
```

### Query by indexed fields:
```javascript
const authorBooks = await fetch('http://localhost:9926/Book?author=Chimamanda')
  .then(r => r.json());
const fictionTitles = await fetch('http://localhost:9926/Book?genre=Fiction&select(title,author)')
  .then(r => r.json());
```

### Get a specific book:
```bash
const book = await fetch(`http://localhost:9926/Book/${bookId}`).then(r => r.json());
```

## What You Get Automatically
Harper provides enterprise-grade features out of the box:

- **Content negotiation** (JSON, CBOR, MessagePack, CSV)
- **Authentication** (Basic, JWT, Cookie)
- **Caching headers** and ETags
- **Data validation** based on your schema
- **Automatic indexing** for fast queries
- **Error handling** and proper HTTP status codes

## Add Custom Logic (Optional)
Only when you need custom business logic should you add code. Create a `resources.js` file to define a new resource and add custom functionality:

```js
export class Books extends Resource {
  const { Book } = tables;
  post(data) {
    if (!data.title || !data.author) {
      return { error: "Title and author are required" };
    }
    
    // Add publication decade for analytics
    if (data.publishedYear) {
      data.decade = Math.floor(data.publishedYear / 10) * 10;
    }
    
    return Book.post(data);
  }
}
```

## Key Takeaway
Harper's schema-driven approach means you can build production-ready APIs in minutes, not hours. Start with pure schema definitions to get 90% of your functionality, then add custom code only where needed. This gives you the best of both worlds: rapid development with the flexibility to customize when required.