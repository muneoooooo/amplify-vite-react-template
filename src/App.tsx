import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Pagination } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const limit = 3;

  useEffect(() => {
    const fetchTodos = async () => {
      setTodos([]);
      setFilteredTodos([]);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMorePages(false);
    };
    fetchTodos();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false,
    });
  };

  const handleFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleSearchButtonClick = async () => {
    let nextToken: string | null = undefined;
    const filteredItems: Schema["Todo"]["type"][] = [];

    do {
      const { data: items, errors, nextToken: token } = await client.models.Todo.list({
        filter: {
          content: {
            beginsWith: filterText,
          },
        },
        limit: limit,
        nextToken: nextToken,
      });
      filteredItems.push(...items);
      nextToken = token;
    } while (nextToken !== null);

    setFilteredTodos(filteredItems);
    setCurrentPage(1);
    setTotalPages(2);
    setHasMorePages(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter todos"
        value={filterText}
        onChange={handleFilterTextChange}
      />
      <button onClick={handleSearchButtonClick}>Search</button>
      <button onClick={createTodo}>Add new todo</button>
      <ul>
        {filteredTodos.slice((currentPage - 1) * limit, currentPage * limit).map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
      {hasMorePages && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={(page) => handlePageChange(page as number)}
        />
      )}
    </div>
  );
}