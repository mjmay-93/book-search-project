import { useState } from "react";
import "./App.css";

type Document = {
  author_key: string[];
  author_name: string[];
  contributor: string[];
  cover_edition_key: string[];
  cover_i: number;
  ebook_access: string;
  ebook_count_i: number;
  edition_count: number;
  edition_key: string[];
  first_publish_year: number;
  format: string[];
  has_fulltext: boolean;
  isbn: string[];
  key: string;
  language: string[];
  last_modified_i: number;
  number_of_pages_median: number;
  oclc: string[];
  public_scan_b: boolean;
  publish_date: string[];
  publish_year: number[];
  publisher: string[];
  title: string;
  title_sort: string;
  title_suggest: string;
  type: string;
  subject: string[];
  readinglog_count: number;
  want_to_read_count: number;
  currently_reading_count: number;
  already_read_count: number;
};

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(Array<Document>());
  const [moreResults, setMoreResults] = useState("");
  const [expandedBook, setExpandedBook] = useState("");

  const search = async () => {
    const resp = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=20&language=eng`
    );

    const body = await resp.json();

    setResults(body.docs);
  };

  const expand = async (coverKey: number, key: string) => {
    const resp1 = await fetch(`https://openlibrary.org${key}.json`);

    const expandedBody = await resp1.json();

    setExpandedBook(`book-${coverKey}`);

    if (!expandedBody.description) {
      setMoreResults("Open Library doesn't have a description of this work.");
    } else if (typeof expandedBody.description == "string") {
      setMoreResults(expandedBody.description);
    } else if (typeof expandedBody.description.value == "string") {
      setMoreResults(expandedBody.description.value);
    }
  };

  const resultsList = results.map((d) => {
    return (
      <div
        key={d.key}
        id={`book-${d.cover_i}`}
        className="m-8 flex flex-col items-center"
      >
        <div className="relative w-[200px] h-[200px] mb-4">
          <img
            className="w-full h-full object-cover"
            src={
              d.cover_edition_key
                ? `https://covers.openlibrary.org/b/OLID/${d.cover_edition_key}-M.jpg`
                : `https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg`
            }
            width="200"
            height="200"
          />
        </div>

        <h3 className="text-lg font-semibold text-center">{d.title}</h3>
        <p className="text-center">
          {!d.author_name ? "" : d.author_name.join(", ")}
        </p>
        <button
          className="mt-2 px-4 py-2 bg-gray-200 rounded transition-colors"
          onClick={() => expand(d.cover_i, d.key)}
        >
          Description
        </button>
        {expandedBook === `book-${d.cover_i}` && (
          <p className="mt-2 p-2 w-full max-w-md">{moreResults}</p>
        )}
      </div>
    );
  });

  return (
    <div className="bg-white text-black">
      <div className="header">
        <h1>Search for a book</h1>
      </div>

      <div className="block">
        <input
          type="text"
          className="inline-block rounded bg-gray-200"
          onChange={(e) => setQuery(e.currentTarget.value)}
          required
          name="query"
          placeholder="Search..."
        ></input>
        <div
          className="inline-block px-8 cursor-pointer rounded bg-gray-100 m-4"
          onClick={search}
        >
          Submit
        </div>
        <div className="m-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center ">
          {resultsList}
        </div>
      </div>
    </div>
  );
}

export default App;
